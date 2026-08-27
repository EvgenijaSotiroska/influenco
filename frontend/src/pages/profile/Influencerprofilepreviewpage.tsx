import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useInfluencerProfile from "../../hooks/useInfluencerProfile";
import useAuth from "../../hooks/useAuth";
import influencerApi from "../../api/influencerApi";
import type { InfluencerProfile } from "../../api/types/influencer";
import "./InfluencerProfilePreviewPage.css";
import { CollaborationRequestModal } from "../../components/CollaborationRequestModal/CollaborationRequestModal";
import { DealsModal } from "../../components/DealsModal/DealsModal";
import { ReviewModal } from "../../components/ReviewModal/ReviewModal";
import { ReviewsListModal } from "../../components/ReviewsListModal/ReviewsListModal";
import { PostFeed } from "../../components/PostFeed/PostFeed";

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

    const ownProfileHook = useInfluencerProfile(!id);

    const [showCollabModal, setShowCollabModal] = useState(false);
    const [showDealsModal, setShowDealsModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showReviewsListModal, setShowReviewsListModal] = useState(false);

    const [otherProfile, setOtherProfile] =
        useState<InfluencerProfile | null>(null);

    const [otherLoading, setOtherLoading] = useState(!!id);
    const [otherError, setOtherError] = useState<string | null>(null);

    /*
     * Cover image position.
     *
     * 50 = centered
     * 0   = image positioned at the top
     * 100 = image positioned at the bottom
     */
    const [coverPosition, setCoverPosition] = useState(50);

    const [savingCover, setSavingCover] = useState(false);

    useEffect(() => {
        if (!id) return;

        let cancelled = false;

        async function load() {
            try {
                setOtherLoading(true);

                const data =
                    await influencerApi.getInfluencerDetail(id!);

                if (!cancelled) {
                    setOtherProfile(data);

                    /*
                     * Load the saved cover position from the backend.
                     */
                    setCoverPosition(
                        data.coverImagePosition ?? 50
                    );
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

    /*
     * When viewing your own profile, initialize the cover position
     * from the profile returned by useInfluencerProfile().
     */
    useEffect(() => {
        if (!id && ownProfileHook.profile) {
            setCoverPosition(
                ownProfileHook.profile.coverImagePosition ?? 50
            );
        }
    }, [id, ownProfileHook.profile]);

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
        user.email.toLowerCase() ===
        profile.email.toLowerCase();

    const locationAndCategories = [
        profile.location,
        profile.categories?.join(" / "),
    ]
        .filter(Boolean)
        .join(" · ");

    /*
     * Move cover image UP.
     */
    const moveCoverUp = () => {
        setCoverPosition((prev) =>
            Math.max(0, prev - 5)
        );
    };

    /*
     * Move cover image DOWN.
     */
    const moveCoverDown = () => {
        setCoverPosition((prev) =>
            Math.min(100, prev + 5)
        );
    };

    /*
     * Save the current cover position.
     */
    const handleSaveCover = async () => {
        if (!isOwner || !profile.coverImageUrl) {
            return;
        }

        try {
            setSavingCover(true);

            await influencerApi.updateCoverPosition(
                coverPosition
            );

            /*
             * Update the local profile so the UI knows
             * the currently displayed value is saved.
             */
            if (!isViewingOther && ownProfileHook.profile) {
                ownProfileHook.profile.coverImagePosition =
                    coverPosition;
            }

            if (isViewingOther && otherProfile) {
                setOtherProfile({
                    ...otherProfile,
                    coverImagePosition: coverPosition,
                });
            }
        } catch (err) {
            console.error(err);
            alert("Couldn't save the cover position.");
        } finally {
            setSavingCover(false);
        }
    };

    return (
        <div className="preview-page">

            {/* ================= COVER ================= */}
            <div
                className="preview-cover"
                style={
                    profile.coverImageUrl
                        ? {
                            backgroundImage: `url(${profile.coverImageUrl})`,
                            backgroundPosition: `center ${coverPosition}%`,
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

                {/* COVER POSITION CONTROLS */}
                {isOwner && profile.coverImageUrl && (
                    <div className="cover-position-controls">

                        <button
                            type="button"
                            onClick={moveCoverUp}
                            title="Move image up"
                            disabled={savingCover}
                        >
                            ↑
                        </button>

                        <button
                            type="button"
                            onClick={moveCoverDown}
                            title="Move image down"
                            disabled={savingCover}
                        >
                            ↓
                        </button>

                        <button
                            type="button"
                            className="cover-save-btn"
                            onClick={handleSaveCover}
                            disabled={savingCover}
                            title="Save cover position"
                        >
                            {savingCover ? "..." : "✓"}
                        </button>

                    </div>
                )}
            </div>

            {/* ================= BODY ================= */}
            <div className="preview-body">

                {/* ================= HEADER ================= */}
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
                            <>
                                {user?.role === "Brand" && (
                                    <button
                                        type="button"
                                        className="btn btn-outline preview-review-btn"
                                        onClick={() =>
                                            setShowReviewModal(true)
                                        }
                                    >
                                        Leave review
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className="btn btn-solid preview-collaboration-btn"
                                    onClick={() =>
                                        setShowCollabModal(true)
                                    }
                                >
                                    Request collaboration
                                    <span>↗</span>
                                </button>
                            </>
                        )}

                    </div>
                </div>

                {/* ================= STATS ================= */}
                <div className="preview-stats">

                    <div className="preview-stat">
                        <span className="preview-stat-number">
                            {formatNumber(
                                profile.totalReach
                            )}
                        </span>

                        <span className="preview-stat-label">
                            Total reach
                        </span>
                    </div>

                    <div className="preview-stat">
                        <span className="preview-stat-number">
                            {profile.overallEngagementRate !==
                                undefined
                                ? `${profile.overallEngagementRate}%`
                                : "—"}
                        </span>

                        <span className="preview-stat-label">
                            Avg engagement
                        </span>
                    </div>

                    <div
                        className="preview-stat preview-stat-clickable"
                        onClick={() =>
                            setShowDealsModal(true)
                        }
                    >
                        <span className="preview-stat-number">
                            {profile.dealsCount ?? 0}
                        </span>

                        <span className="preview-stat-label">
                            Completed deals
                        </span>
                    </div>

                    <div
                        className="preview-stat preview-stat-clickable"
                        onClick={() =>
                            setShowReviewsListModal(true)
                        }
                    >
                        <span className="preview-stat-number">
                            {profile.averageRating == null
                                ? "—"
                                : Number(profile.averageRating).toFixed(1)}
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

                {/* ================= ABOUT + SOCIAL ================= */}
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
                    {(
                        profile.instagramFollowers !== undefined ||
                        profile.tikTokFollowers !== undefined
                    ) && (
                            <section className="preview-social">

                                <div className="preview-social-header">

                                    <p className="preview-section-label">
                                        SOCIAL PRESENCE
                                    </p>

                                    {profile.statsUpdatedAt && (
                                        <p className="preview-updated">
                                            Self-reported · Last
                                            updated{" "}
                                            {new Date(
                                                profile.statsUpdatedAt
                                            ).toLocaleDateString()}
                                        </p>
                                    )}

                                </div>

                                <div className="preview-platforms-box">

                                    {/* INSTAGRAM */}
                                    {profile.instagramFollowers !==
                                        undefined && (
                                            <a
                                                href={
                                                    profile.instagramUrl ||
                                                    "#"
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
                                                            {profile.instagramEngagementRate ??
                                                                "—"}

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
                                    {profile.tikTokFollowers !==
                                        undefined && (
                                            <a
                                                href={
                                                    profile.tikTokUrl ||
                                                    "#"
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
                                                            {profile.tikTokEngagementRate ??
                                                                "—"}

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

            {/* ================= POSTS ================= */}
            <div className="preview-body">
                <div className="preview-posts-divider" />
                <p className="preview-section-label">{isOwner ? "ADD A POST" : "PORTFOLIO"}</p>

                <PostFeed
                    profileId={profile.id}
                    profileType="influencer"
                    isOwner={isOwner}
                    avatarUrl={profile.profilePictureUrl}
                />
            </div>

            {/* ================= COLLABORATION MODAL ================= */}
            {showCollabModal && profile && (
                <CollaborationRequestModal
                    influencerId={profile.id}
                    influencerName={profile.displayName}
                    onClose={() =>
                        setShowCollabModal(false)
                    }
                />
            )}

            {/* ================= DEALS MODAL ================= */}
            {showDealsModal && (
                <DealsModal
                    influencerId={profile.id}
                    influencerName={profile.displayName}
                    onClose={() =>
                        setShowDealsModal(false)
                    }
                />
            )}

            {/* ================= REVIEW MODAL ================= */}
            {showReviewModal && (
                <ReviewModal
                    influencerId={profile.id}
                    influencerName={profile.displayName}
                    onClose={() =>
                        setShowReviewModal(false)
                    }
                />
            )}

            {/* ================= REVIEWS LIST MODAL ================= */}
            {showReviewsListModal && (
                <ReviewsListModal
                    influencerId={profile.id}
                    influencerName={profile.displayName}
                    onClose={() =>
                        setShowReviewsListModal(false)
                    }
                />
            )}

        </div>
    );
}