import { Link } from "react-router-dom";
import useBrandProfile from "../../hooks/useBrandProfile";
import { ActiveCampaignsCard } from "../../components/ActiveCampaignsCard/ActiveCampaignsCard";
import "./BrandProfilePreviewPage.css";

export function BrandProfilePreviewPage() {
    const { profile, loading } = useBrandProfile();

    if (loading) {
        return <div className="profile-loading">Loading...</div>;
    }

    if (!profile) {
        return (
            <div className="profile-empty">
                <p>You haven't created a company profile yet.</p>
                <Link to="/brand/profile/edit" className="btn btn-solid">
                    Create your profile
                </Link>
            </div>
        );
    }

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
                    </div>
                </div>

                <div className="brand-preview-actions">
                    <Link
                        to="/brand/profile/edit"
                        className="btn btn-outline"
                    >
                        Edit profile
                    </Link>
                </div>
            </div>

            {profile.website && (
                <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="brand-preview-website"
                >
                    {profile.website}
                </a>
            )}

            {profile.description && (
                <p className="brand-preview-description">
                    {profile.description}
                </p>
            )}

            <ActiveCampaignsCard />
        </div>
    </div>
);
}

