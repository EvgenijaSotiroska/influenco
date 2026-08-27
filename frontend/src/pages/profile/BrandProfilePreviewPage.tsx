import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useBrandProfile from "../../hooks/useBrandProfile";
import useAuth from "../../hooks/useAuth";
import brandApi from "../../api/brandApi";
import type { BrandProfile } from "../../api/types/brand";
import { ActiveCampaignsCard } from "../../components/ActiveCampaignsCard/ActiveCampaignsCard";
import { PostFeed } from "../../components/PostFeed/PostFeed";
import "./BrandProfilePreviewPage.css";

export function BrandProfilePreviewPage() {
    const { id } = useParams<{ id?: string }>();
    const { user } = useAuth();

    const ownProfileHook = useBrandProfile();

    const [otherProfile, setOtherProfile] = useState<BrandProfile | null>(null);
    const [otherLoading, setOtherLoading] = useState(!!id);
    const [otherError, setOtherError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        let cancelled = false;

        async function load() {
            try {
                setOtherLoading(true);

                const data = await brandApi.getById(id);

                if (!cancelled) {
                    setOtherProfile(data);
                }
            } catch (err) {
                console.error(err);

                if (!cancelled) {
                    setOtherError("Couldn't load this brand's profile.");
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
        return <div className="profile-loading">Loading...</div>;
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
                    <p>This brand could not be found.</p>
                </div>
            );
        }

        return (
            <div className="profile-empty">
                <p>You haven't created a company profile yet.</p>

                <Link
                    to="/brand/profile/edit"
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

    const initials = profile.companyName
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const websiteUrl = profile.website
        ? profile.website.startsWith("http")
            ? profile.website
            : `https://${profile.website}`
        : "";

    return (
        <div className="brand-preview-page">
            <div className="brand-preview-body">

                {/* Header */}
                <div className="brand-preview-heading-row">
                    <div className="brand-preview-identity">
                        <div
                            className="brand-preview-logo"
                            style={
                                profile.logoUrl
                                    ? {
                                        backgroundImage: `url(${profile.logoUrl})`,
                                    }
                                    : undefined
                            }
                        >
                            {!profile.logoUrl && (
                                <span>{initials || "?"}</span>
                            )}
                        </div>

                        <div>
                            <h1 className="brand-preview-name">
                                {profile.companyName}
                            </h1>

                            {profile.industry && (
                                <p className="brand-preview-meta">
                                    {profile.industry}
                                </p>
                            )}

                            {profile.website && (
                                <a
                                    href={websiteUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="brand-preview-website-link"
                                >
                                    Go to website
                                    <span>↗</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {isOwner && (
                        <div className="brand-preview-actions">
                            <Link
                                to="/brand/profile/edit"
                                className="btn btn-outline"
                            >
                                Edit profile
                            </Link>

                            <Link
                                to="/brand/deals"
                                className="btn btn-outline"
                            >
                                View deals
                            </Link>
                        </div>
                    )}
                </div>

                {/* About + Stats */}
                <div className="brand-preview-main">
                    {profile.description && (
                        <section className="brand-preview-about">
                            <p className="brand-preview-section-label">
                                ABOUT
                            </p>

                            <div className="brand-preview-about-content">
                                <p className="brand-preview-about-quote">
                                    "{profile.description}"
                                </p>
                            </div>
                        </section>
                    )}

                    <div className="brand-preview-stats-col">
                        <div className="brand-preview-stat">
                            <span className="brand-preview-stat-number">
                                {profile.activeCampaignsCount}
                            </span>

                            <span className="brand-preview-stat-label">
                                Active campaigns
                            </span>
                        </div>

                        <div className="brand-preview-stat">
                            <span className="brand-preview-stat-number">
                                {profile.dealsCount}
                            </span>

                            <span className="brand-preview-stat-label">
                                Completed deals
                            </span>
                        </div>
                    </div>
                </div>

                {/* Active campaigns */}
                <ActiveCampaignsCard isOwner={isOwner} brandId={profile.id} />

                {/* Posts */}
                <div className="brand-preview-posts-divider" />
                <p className="brand-preview-section-label">
                    {isOwner ? "ADD A POST" : "PORTFOLIO"}
                </p>

                <PostFeed
                    profileId={profile.id}
                    profileType="brand"
                    isOwner={isOwner}
                    avatarUrl={profile.logoUrl}
                />
            </div>
        </div>
    );
}