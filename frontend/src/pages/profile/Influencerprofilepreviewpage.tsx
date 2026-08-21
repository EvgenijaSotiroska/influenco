import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useInfluencerProfile from "../../hooks/useInfluencerProfile";
import useAuth from "../../hooks/useAuth";
import influencerApi from "../../api/influencerApi";
import type { InfluencerProfile } from "../../api/types/influencer";
import "./InfluencerProfilePreviewPage.css";
import { CollaborationRequestModal } from "../../components/CollaborationRequestModal/CollaborationRequestModal";

function formatNumber(count?: number): string {
    if (count === undefined) return "—";

    if (count >= 1_000_000) {
        return `${(count / 1_000_000).toFixed(1)}M`;
    }

    if (count >= 1_000) {
        return `${(count / 1_000).toFixed(0)}K`;
    }

    return `${count}`;
}

export function InfluencerProfilePreviewPage() {
    const { id } = useParams<{ id?: string }>();
    const { user } = useAuth();

    const ownProfileHook = useInfluencerProfile();
    const [showCollabModal, setShowCollabModal] = useState(false);

    const [otherProfile, setOtherProfile] =
        useState<InfluencerProfile | null>(null);

    const [otherLoading, setOtherLoading] =
        useState(!!id);

    const [otherError, setOtherError] =
        useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        let cancelled = false;

        async function load() {
            try {
                setOtherLoading(true);

                const data =
                    await influencerApi.getInfluencerDetail(id);

                if (!cancelled) {
                    setOtherProfile(data);
                }
            } catch (err) {
                console.error(err);

                if (!cancelled) {
                    setOtherError("Couldn't load this profile.");
                }
            } finally {
                if (!cancelled) {
                    setOtherLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const isViewingOther = !!id;

    const profile = isViewingOther
        ? otherProfile
        : ownProfileHook.profile;

    const loading = isViewingOther
        ? otherLoading
        : ownProfileHook.loading;

    if (loading) {
        return (
            <div className="profile-loading">
                Loading...
            </div>
        );
    }

    if (isViewingOther && otherError) {
        return (
            <div className="profile-empty">
                <p>{otherError}</p>
            </div>
        );
    }

    if (!profile) {
        if (isViewingOther) {
            return (
                <div className="profile-empty">
                    <p>This profile could not be found.</p>
                </div>
            );
        }

        return (
            <div className="profile-empty">
                <p>You haven't created a profile yet.</p>

                <Link
                    to="/profile/edit"
                    className="btn btn-solid"
                >
                    Create your profile
                </Link>
            </div>
        );
    }

    const isOwner =
        !!user?.email &&
        !!profile.email &&
        user.email.toLowerCase() === profile.email.toLowerCase();

    const locationAndCategories = [
        profile.location,
        profile.categories?.join(" / "),
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <div className="preview-page">

            {/* COVER */}
            <div
                className="preview-cover"
                style={
                    profile.coverImageUrl
                        ? {
                            backgroundImage: `url(${profile.coverImageUrl})`,
                        }
                        : undefined
                }
            >
                <div
                    className="preview-avatar"
                    style={
                        profile.profilePictureUrl
                            ? {
                                backgroundImage: `url(${profile.profilePictureUrl})`,
                            }
                            : undefined
                    }
                />
            </div>

            <div className="preview-body">

                {/* HEADER */}
                <div className="preview-heading-row">

                    <div className="preview-heading-content">
                        <h1 className="preview-name">
                            {profile.displayName}
                        </h1>

                        {locationAndCategories && (
                            <p className="preview-meta">
                                {locationAndCategories}
                            </p>
                        )}
                    </div>

                    <div className="preview-actions">

                        {isOwner ? (
                            <Link
                                to="/profile/edit"
                                className="btn btn-outline"
                            >
                                Edit profile
                            </Link>
                        ) : (
                                <button
                                    type="button"
                                    className="btn btn-solid preview-collaboration-btn"
                                    onClick={() => setShowCollabModal(true)}
                                >
                                    Request collaboration
                                    <span>↗</span>
                                </button>
                        )}

                    </div>
                </div>

                {/* STATS */}
                <div className="preview-stats">

                    <div className="preview-stat">
                        <span className="preview-stat-number">
                            {formatNumber(profile.totalReach)}
                        </span>

                        <span className="preview-stat-label">
                            Total reach
                        </span>
                    </div>

                    <div className="preview-stat">
                        <span className="preview-stat-number">
                            {profile.overallEngagementRate !== undefined
                                ? `${profile.overallEngagementRate}%`
                                : "—"}
                        </span>

                        <span className="preview-stat-label">
                            Avg engagement
                        </span>
                    </div>

                    <div className="preview-stat">
                        <span className="preview-stat-number">
                            —
                        </span>

                        <span className="preview-stat-label">
                            Completed deals
                        </span>
                    </div>

                    <div className="preview-stat">
                        <span className="preview-stat-number">
                            —
                        </span>

                        <span className="preview-stat-label">
                            Average rating
                        </span>
                    </div>

                </div>

                {profile.statsUpdatedAt && isOwner && (
                    <p className="preview-stats-note">
                        Self-reported · updated{" "}
                        {new Date(
                            profile.statsUpdatedAt
                        ).toLocaleDateString()}
                    </p>
                )}

                {/* ABOUT + SOCIAL PRESENCE */}
                <div className="preview-main-content">

                    {/* ABOUT */}
                    {profile.bio && (
                        <section className="preview-about">
                            <p className="preview-section-label">
                                ABOUT
                            </p>

                            <div className="preview-about-content">
                                <p className="preview-about-quote">
                                    "{profile.bio}"
                                </p>
                            </div>
                        </section>
                    )}

                    {/* SOCIAL PRESENCE */}
                    {(profile.instagramFollowers !== undefined ||
                        profile.tikTokFollowers !== undefined) && (
                            <section className="preview-social">

                                <div className="preview-social-header">
                                    <p className="preview-section-label">
                                        SOCIAL PRESENCE
                                    </p>

                                    {profile.statsUpdatedAt && (
                                        <p className="preview-updated">
                                            Self-reported · Last updated{" "}
                                            {new Date(
                                                profile.statsUpdatedAt
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>

                                <div className="preview-platforms-box">

                                    {/* INSTAGRAM */}
                                    {profile.instagramFollowers !== undefined && (
                                        <a
                                            href={
                                                profile.instagramUrl || "#"
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="preview-platform-col"
                                        >
                                            <div className="preview-platform-top">
                                                <span className="preview-platform-brand">
                                                    Instagram
                                                    <span className="verified-badge">
                                                        ✓
                                                    </span>
                                                </span>

                                                <span className="preview-platform-handle">
                                                    {profile.instagramUrl
                                                        ? `@${profile.instagramUrl
                                                            .split("/")
                                                            .filter(Boolean)
                                                            .pop()}`
                                                        : ""}
                                                </span>
                                            </div>

                                            <div className="preview-platform-stats">

                                                <div className="preview-stat-item">
                                                    <span className="preview-num">
                                                        {formatNumber(
                                                            profile.instagramFollowers
                                                        )}
                                                    </span>

                                                    <span className="preview-lbl">
                                                        Followers
                                                    </span>

                                                    <div className="preview-bar preview-bar-dark" />
                                                </div>

                                                <div className="preview-stat-item">
                                                    <span className="preview-num">
                                                        {profile.instagramEngagementRate ?? "—"}
                                                        <span className="percent-symbol">
                                                            %
                                                        </span>
                                                    </span>

                                                    <span className="preview-lbl">
                                                        Engagement
                                                    </span>

                                                    <div className="preview-bar preview-bar-light" />
                                                </div>

                                            </div>
                                        </a>
                                    )}

                                    {/* TIKTOK */}
                                    {profile.tikTokFollowers !== undefined && (
                                        <a
                                            href={
                                                profile.tikTokUrl || "#"
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="preview-platform-col"
                                        >
                                            <div className="preview-platform-top">
                                                <span className="preview-platform-brand">
                                                    TikTok
                                                    <span className="verified-badge">
                                                        ✓
                                                    </span>
                                                </span>

                                                <span className="preview-platform-handle">
                                                    {profile.tikTokUrl
                                                        ? `@${profile.tikTokUrl
                                                            .split("/")
                                                            .filter(Boolean)
                                                            .pop()}`
                                                        : ""}
                                                </span>
                                            </div>

                                            <div className="preview-platform-stats">

                                                <div className="preview-stat-item">
                                                    <span className="preview-num">
                                                        {formatNumber(
                                                            profile.tikTokFollowers
                                                        )}
                                                    </span>

                                                    <span className="preview-lbl">
                                                        Followers
                                                    </span>

                                                    <div className="preview-bar preview-bar-dark" />
                                                </div>

                                                <div className="preview-stat-item">
                                                    <span className="preview-num">
                                                        {profile.tikTokEngagementRate ?? "—"}
                                                        <span className="percent-symbol">
                                                            %
                                                        </span>
                                                    </span>

                                                    <span className="preview-lbl">
                                                        Engagement
                                                    </span>

                                                    <div className="preview-bar preview-bar-light" />
                                                </div>

                                            </div>
                                        </a>
                                    )}

                                </div>

                            </section>
                        )}

                </div>

            </div>
            {showCollabModal && profile && (
                <CollaborationRequestModal
                    influencerId={profile.id}
                    influencerName={profile.displayName}
                    onClose={() => setShowCollabModal(false)}
                />
            )}
        </div>
    );
}