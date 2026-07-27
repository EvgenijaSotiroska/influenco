import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDiscoverInfluencers } from "../../hooks/useDiscoverInfluencers";
import { SignInPromptModal } from "../../components/SignInPromptModal/SignInPromptModal";
import "./DiscoverPage.css";

function formatFollowers(count: number): string {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
    return `${count}`;
}

export function DiscoverPage() {
    const { influencers, loading, error } = useDiscoverInfluencers(6);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="discover-page">
            <section className="discover-hero">
                <span className="discover-eyebrow">THE ROSTER</span>
                <h1 className="discover-title">Discover creators.</h1>
                <p className="discover-subtitle">
                    A hand-picked selection. Sign in to filter 12,400+ creators by
                    niche, platform, follower range, and engagement.
                </p>
            </section>

            <section className="discover-grid">
                {loading && <div className="discover-status">Loading creators...</div>}

                {!loading && error && (
                    <div className="discover-status discover-status--error">{error}</div>
                )}

                {!loading &&
                    !error &&
                    influencers.map((influencer) => (
                        <div
                            className="creator-card"
                            key={influencer.id}
                            onClick={() => setShowModal(true)}
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
                                    <span className="creator-platform">{influencer.platform}</span>
                                    <span className="creator-followers">
                                        {formatFollowers(influencer.followerCount)}
                                    </span>
                                    <span className="creator-er">
                                        {influencer.engagementRate.toFixed(1)}% ER
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
            </section>

            <div className="discover-see-more-wrap">
                <button className="discover-see-more-btn" onClick={() => navigate("/login")}>
                    See more
                </button>
            </div>

            {showModal && (
                <SignInPromptModal onClose={() => setShowModal(false)} />
            )}
        </div>
    );
}