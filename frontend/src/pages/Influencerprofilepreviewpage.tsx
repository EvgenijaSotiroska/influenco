import { Link } from "react-router-dom";
import useInfluencerProfile from "../hooks/useInfluencerProfile";
import "./InfluencerProfilePreviewPage.css";

export function InfluencerProfilePreviewPage() {
    const { profile, loading } = useInfluencerProfile();

    if (loading) {
        return <div className="profile-loading">Loading...</div>;
    }

    if (!profile) {
        return (
            <div className="profile-empty">
                <p>You haven't created a profile yet.</p>
                <Link to="/profile/edit" className="btn btn-solid">Create your profile</Link>
            </div>
        );
    }

    const locationAndCategories = [profile.location, profile.categories.join(" / ")]
        .filter(Boolean)
        .join(" · ");

    return (
        <div className="preview-page">
            <div
                className="preview-cover"
                style={
                    profile.coverImageUrl ? { backgroundImage: `url(${profile.coverImageUrl})` } : undefined
                }
            >
                <div
                    className="preview-avatar"
                    style={
                        profile.profilePictureUrl
                            ? { backgroundImage: `url(${profile.profilePictureUrl})` }
                            : undefined
                    }
                />
            </div>

            <div className="preview-body">
                <div className="preview-heading-row">
                    <div>
                        <h1 className="preview-name">{profile.displayName}</h1>
                        {locationAndCategories && (
                            <p className="preview-meta">{locationAndCategories}</p>
                        )}
                    </div>
                    <div className="preview-actions">
                        <Link to="/profile/edit" className="btn btn-outline">Edit profile</Link>
                    </div>
                </div>

                {profile.bio && <p className="preview-bio">{profile.bio}</p>}

                <div className="preview-stats">
                    <div className="preview-stat">
                        <span className="preview-stat-number">—</span>
                        <span className="preview-stat-label">Total reach</span>
                    </div>
                    <div className="preview-stat">
                        <span className="preview-stat-number">—</span>
                        <span className="preview-stat-label">Avg engagement</span>
                    </div>
                    <div className="preview-stat">
                        <span className="preview-stat-number">—</span>
                        <span className="preview-stat-label">Completed deals</span>
                    </div>
                    <div className="preview-stat">
                        <span className="preview-stat-number">—</span>
                        <span className="preview-stat-label">Average rating</span>
                    </div>
                </div>
            </div>
        </div>
    );
}