import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useBrowseCampaigns from "../../hooks/useBrowseCampaigns";
import { ApplyModal } from "../../components/ApplyModal/ApplyModal";
import type { BrowseCampaignsFilters } from "../../api/types/browseCampaign";
import "./BrowseCampaignsPage.css";
import usePendingRequestsCount from "../../hooks/usePendingRequestsCount";

const NICHE_OPTIONS = ["Travel", "Fashion", "Food", "Beauty", "Tech", "Fitness", "Outdoor", "Lifestyle"];

function formatBudget(budget?: number): string {
    if (budget === undefined) return "Rate on request";
    return `$${budget.toLocaleString()}`;
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return "No deadline";
    return `Deadline ${new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })}`;
}

export function BrowseCampaignsPage() {
    const { isLoggedIn } = useAuth();
    const [activeNiche, setActiveNiche] = useState<string | null>(null);
    const [applyTarget, setApplyTarget] = useState<{ id: string; title: string } | null>(null);
    const pendingCount = usePendingRequestsCount();

    const filters: BrowseCampaignsFilters = activeNiche ? { niche: activeNiche } : {};
    const { campaigns, loading, error, reload } = useBrowseCampaigns(filters);

    return (
        <div className="bc-page">
            <section className="bc-hero">
                <div className="bc-hero-top">
                    <div>
                        <span className="bc-eyebrow">OPPORTUNITIES</span>
                        <h1 className="bc-title">Browse campaigns.</h1>
                        <p className="bc-subtitle">
                            Structured briefs from brands and agencies. Filter by niche,
                            platform, and budget. Apply with your rate and pitch.
                        </p>
                    </div>

                    <div className="bc-hero-actions">
                        <Link to="/campaigns/my-applications" className="btn btn-outline">
                            My applications
                        </Link>
                        <Link to="/campaigns/requests" className="btn btn-outline bc-requests-link">
                            Requests
                            {pendingCount > 0 && <span className="bc-badge">{pendingCount}</span>}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bc-niche-bar">
                <button
                    type="button"
                    className={`bc-niche-pill ${activeNiche === null ? "bc-niche-pill-active" : ""}`}
                    onClick={() => setActiveNiche(null)}
                >
                    All niches
                </button>
                {NICHE_OPTIONS.map((niche) => (
                    <button
                        key={niche}
                        type="button"
                        className={`bc-niche-pill ${activeNiche === niche ? "bc-niche-pill-active" : ""}`}
                        onClick={() => setActiveNiche(niche)}
                    >
                        {niche}
                    </button>
                ))}
            </section>

            <section className="bc-list">
                {loading && <div className="bc-status">Loading campaigns...</div>}

                {!loading && error && <div className="bc-status bc-status-error">{error}</div>}

                {!loading && !error && campaigns.length === 0 && (
                    <div className="bc-status">No open campaigns match these filters.</div>
                )}

                {!loading &&
                    !error &&
                    campaigns.map((campaign) => (
                        <div className="bc-card" key={campaign.id}>
                            <div className="bc-card-main">
                                <div className="bc-card-brand-row">
                                    <span className="bc-card-brand">{campaign.brandName.toUpperCase()}</span>
                                    <span className="bc-card-badge">OPEN</span>
                                </div>

                                <h2 className="bc-card-title">{campaign.title}</h2>

                                {campaign.description && (
                                    <p className="bc-card-description">{campaign.description}</p>
                                )}

                                <div className="bc-card-tags">
                                    {campaign.niches.map((n) => (
                                        <span className="bc-tag" key={n}>
                                            {n}
                                        </span>
                                    ))}
                                    {campaign.platforms.map((p) => (
                                        <span className="bc-tag bc-tag-muted" key={p}>
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bc-card-side">
                                <span className="bc-card-budget">{formatBudget(campaign.budget)}</span>

                                {campaign.minimumFollowers && (
                                    <span className="bc-card-meta">
                                        Min {campaign.minimumFollowers.toLocaleString()} followers
                                    </span>
                                )}

                                <span className="bc-card-meta">{formatDate(campaign.applicationDeadline)}</span>

                                <div className="bc-card-actions">
                                    <span className="bc-card-applicants">
                                        {campaign.applicantsCount} applied
                                    </span>

                                    {campaign.hasApplied ? (
                                        <button type="button" className="bc-applied-btn" disabled>
                                            Applied ✓
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="bc-apply-btn"
                                            onClick={() =>
                                                isLoggedIn
                                                    ? setApplyTarget({ id: campaign.id, title: campaign.title })
                                                    : (window.location.href = "/login")
                                            }
                                        >
                                            Apply ↗
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </section>

            {applyTarget && (
                <ApplyModal
                    campaignId={applyTarget.id}
                    campaignTitle={applyTarget.title}
                    onClose={() => setApplyTarget(null)}
                    onApplied={() => {
                        setApplyTarget(null);
                        reload();
                    }}
                />
            )}
        </div>
    );
}