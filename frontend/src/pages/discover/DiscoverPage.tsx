import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useDiscoverInfluencers } from "../../hooks/useDiscoverInfluencers";
import { SignInPromptModal } from "../../components/SignInPromptModal/SignInPromptModal";
import type { DiscoverFilters } from "../../api/types/discover.ts";
import "./DiscoverPage.css";

const CATEGORY_OPTIONS = [
    "Fashion",
    "Beauty",
    "Travel",
    "Food",
    "Fitness",
    "Tech",
    "Gaming",
    "Lifestyle",
    "Comedy",
    "Music",
];

function formatFollowers(count: number): string {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
    return `${count}`;
}

export function DiscoverPage() {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const [locationInput, setLocationInput] = useState("");
    const [minFollowersInput, setMinFollowersInput] = useState("");
    const [maxFollowersInput, setMaxFollowersInput] = useState("");
    const [category, setCategory] = useState("");
    const [appliedFilters, setAppliedFilters] = useState<DiscoverFilters>({});

    const { influencers, loading, loadingMore, hasMore, error, loadMore } =
        useDiscoverInfluencers(appliedFilters);

    function applyFilters() {
        setAppliedFilters({
            location: locationInput.trim() || undefined,
            category: category || undefined,
            minFollowers: minFollowersInput ? Number(minFollowersInput) : undefined,
            maxFollowers: maxFollowersInput ? Number(maxFollowersInput) : undefined,
        });
    }

    function clearFilters() {
        setLocationInput("");
        setMinFollowersInput("");
        setMaxFollowersInput("");
        setCategory("");
        setAppliedFilters({});
    }

    function handleCardClick(id: string) {
        if (isLoggedIn) {
            navigate(`/profile/preview/${id}`);
        } else {
            setShowModal(true);
        }
    }

    function handleSeeMore() {
        if (isLoggedIn) {
            loadMore();
        } else {
            navigate("/login");
        }
    }

    return (
        <div className="discover-page">
            <section className="discover-hero">
                <span className="discover-eyebrow">THE ROSTER</span>
                <h1 className="discover-title">Discover creators.</h1>
                <p className="discover-subtitle">
                    A hand-picked selection. Filter by location, followers, and
                    category to find the right fit.
                </p>
            </section>

            {isLoggedIn && (
                <section className="discover-filters">
                    <div className="filter-field">
                        <label className="filter-label" htmlFor="filter-location">
                            Location
                        </label>
                        <input
                            id="filter-location"
                            className="filter-input"
                            placeholder="e.g. Bitola"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                        />
                    </div>

                    <div className="filter-field">
                        <label className="filter-label" htmlFor="filter-category">
                            Category
                        </label>
                        <select
                            id="filter-category"
                            className="filter-input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Any</option>
                            {CATEGORY_OPTIONS.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-field">
                        <label className="filter-label" htmlFor="filter-min-followers">
                            Min followers
                        </label>
                        <input
                            id="filter-min-followers"
                            type="number"
                            min="0"
                            className="filter-input"
                            placeholder="0"
                            value={minFollowersInput}
                            onChange={(e) => setMinFollowersInput(e.target.value)}
                        />
                    </div>

                    <div className="filter-field">
                        <label className="filter-label" htmlFor="filter-max-followers">
                            Max followers
                        </label>
                        <input
                            id="filter-max-followers"
                            type="number"
                            min="0"
                            className="filter-input"
                            placeholder="Any"
                            value={maxFollowersInput}
                            onChange={(e) => setMaxFollowersInput(e.target.value)}
                        />
                    </div>

                    <div className="filter-actions">
                        <button type="button" className="btn btn-solid" onClick={applyFilters}>
                            Apply
                        </button>
                        <button type="button" className="btn btn-outline" onClick={clearFilters}>
                            Clear
                        </button>
                    </div>
                </section>
            )}

            <section className="discover-grid">
                {loading && <div className="discover-status">Loading creators...</div>}

                {!loading && error && (
                    <div className="discover-status discover-status--error">{error}</div>
                )}

                {!loading && !error && influencers.length === 0 && (
                    <div className="discover-status">No creators match these filters.</div>
                )}

                {!loading &&
                    !error &&
                    influencers.map((influencer) => (
                        <div
                            className="creator-card"
                            key={influencer.id}
                            onClick={() => handleCardClick(influencer.id)}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="creator-image-wrap">
                                <img
                                    src={influencer.profilePictureUrl ?? "/placeholder-avatar.png"}
                                    alt={influencer.displayName}
                                    className="creator-image"
                                />
                                {influencer.isVerified && (
                                    <span className="verified-badge">✓ VERIFIED</span>
                                )}
                            </div>

                            <div className="creator-info">
                                <div className="creator-name-row">
                                    <span className="creator-name">{influencer.displayName}</span>
                                    <span className="creator-link-icon">↗</span>
                                </div>
                                <div className="creator-meta">
                                    {influencer.location?.toUpperCase()}
                                    {influencer.location && influencer.niche ? " · " : ""}
                                    {influencer.niche?.toUpperCase()}
                                </div>
                                <div className="creator-stats">
                                    <span className="creator-followers">
                                        {formatFollowers(influencer.totalFollowers)}
                                    </span>
                                    {influencer.overallEngagementRate !== null && (
                                        <span className="creator-er">
                                            {influencer.overallEngagementRate}% ER
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </section>

            {!loading && !error && (isLoggedIn ? hasMore : influencers.length > 0) && (
                <div className="discover-see-more-wrap">
                    <button
                        className="discover-see-more-btn"
                        onClick={handleSeeMore}
                        disabled={loadingMore}
                    >
                        {loadingMore ? "Loading..." : "See more"}
                    </button>
                </div>
            )}

            {showModal && <SignInPromptModal onClose={() => setShowModal(false)} />}
        </div>
    );
}