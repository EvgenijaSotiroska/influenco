import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useInfluencerProfile from "../../hooks/useInfluencerProfile";
import influencerApi from "../../api/influencerApi";
import type { InfluencerProfile } from "../../api/types/influencer";
import "./InfluencerProfilePreviewPage.css";

function formatNumber(count?: number): string {
    if (count === undefined) return "—";
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
    return `${count}`;
}

export function InfluencerProfilePreviewPage() {
    const { id } = useParams<{ id?: string }>();

    const ownProfileHook = useInfluencerProfile();

    const [otherProfile, setOtherProfile] =
        useState<InfluencerProfile | null>(null);

    const [otherLoading, setOtherLoading] = useState(!!id);

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

    const locationAndCategories = [
        profile.location,
        profile.categories?.join(" / "),
    ]
        .filter(Boolean)
        .join(" · ");

    const hasAudienceInfo =
        profile.audienceAgeRange ||
        profile.audienceTopLocations ||
        profile.audienceGenderSplit;

    return (
        <div className="preview-page">

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

                <div className="preview-heading-row">

                    <div>
                        <h1 className="preview-name">
                            {profile.displayName}
                        </h1>

                        {locationAndCategories && (
                            <p className="preview-meta">
                                {locationAndCategories}
                            </p>
                        )}
                    </div>

                    {!isViewingOther && (
                        <div className="preview-actions">
                            <Link
                                to="/profile/edit"
                                className="btn btn-outline"
                            >
                                Edit profile
                            </Link>
                        </div>
                    )}

                </div>

                {profile.bio && (
                    <p className="preview-bio">
                        {profile.bio}
                    </p>
                )}

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

                {profile.statsUpdatedAt && !isViewingOther && (
                    <p className="preview-stats-note">
                        Self-reported · updated{" "}
                        {new Date(
                            profile.statsUpdatedAt
                        ).toLocaleDateString()}
                    </p>
                )}

                {(profile.instagramFollowers !== undefined ||
                    profile.tikTokFollowers !== undefined) && (

                        <div className="preview-platforms">

                            {profile.instagramFollowers !== undefined && (
                                <a
                                    href={profile.instagramUrl || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="preview-platform-card"
                                >
                                    <span className="preview-platform-name">
                                        Instagram
                                    </span>

                                    <span className="preview-platform-followers">
                                        {formatNumber(
                                            profile.instagramFollowers
                                        )} followers
                                    </span>

                                    {profile.instagramEngagementRate !== undefined && (
                                        <span className="preview-platform-er">
                                            {profile.instagramEngagementRate}% ER
                                        </span>
                                    )}
                                </a>
                            )}

                            {profile.tikTokFollowers !== undefined && (
                                <a
                                    href={profile.tikTokUrl || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="preview-platform-card"
                                >
                                    <span className="preview-platform-name">
                                        TikTok
                                    </span>

                                    <span className="preview-platform-followers">
                                        {formatNumber(
                                            profile.tikTokFollowers
                                        )} followers
                                    </span>

                                    {profile.tikTokEngagementRate !== undefined && (
                                        <span className="preview-platform-er">
                                            {profile.tikTokEngagementRate}% ER
                                        </span>
                                    )}
                                </a>
                            )}

                        </div>
                    )}

                {hasAudienceInfo && (

                    <div className="preview-audience">

                        <h2 className="preview-section-title">
                            Audience
                        </h2>

                        <div className="preview-audience-grid">

                            {profile.audienceAgeRange && (
                                <div>
                                    <span className="preview-audience-label">
                                        Age range
                                    </span>

                                    <span className="preview-audience-value">
                                        {profile.audienceAgeRange}
                                    </span>
                                </div>
                            )}

                            {profile.audienceGenderSplit && (
                                <div>
                                    <span className="preview-audience-label">
                                        Gender split
                                    </span>

                                    <span className="preview-audience-value">
                                        {profile.audienceGenderSplit}
                                    </span>
                                </div>
                            )}

                            {profile.audienceTopLocations && (
                                <div>
                                    <span className="preview-audience-label">
                                        Top locations
                                    </span>

                                    <span className="preview-audience-value">
                                        {profile.audienceTopLocations}
                                    </span>
                                </div>
                            )}

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}