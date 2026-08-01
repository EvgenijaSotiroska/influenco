import {
    useState,
    type ChangeEvent,
    type FormEvent,
    type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import useInfluencerProfile from "../../hooks/useInfluencerProfile";
import type { InfluencerProfile } from "../../api/types/influencer";
import "./InfluencerProfilePage.css";

const emptyProfile: InfluencerProfile = {
    id: "",
    displayName: "",
    handle: "",
    bio: "",
    profilePictureUrl: "",
    coverImageUrl: "",
    location: "",
    categories: [],
    isVerified: false,
    totalReach: 0,
};

export function InfluencerProfilePage() {
    const navigate = useNavigate();

    const {
        profile,
        setProfile,
        loading,
        saving,
        saveProfile,
    } = useInfluencerProfile();

    const [newCategory, setNewCategory] = useState("");

    const currentProfile = profile ?? emptyProfile;

    if (loading) {
        return <div className="profile-loading">Loading...</div>;
    }

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setProfile({
            ...currentProfile,
            [e.target.name]: e.target.value,
        });
    };

    const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile({
            ...currentProfile,
            [name]: value === "" ? undefined : Number(value),
        });
    };

    const initials = currentProfile.displayName
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

    function addCategory() {
        const value = newCategory.trim();

        if (!value || currentProfile.categories.includes(value)) {
            setNewCategory("");
            return;
        }

        setProfile({
            ...currentProfile,
            categories: [...currentProfile.categories, value],
        });

        setNewCategory("");
    }

    function removeCategory(category: string) {
        setProfile({
            ...currentProfile,
            categories: currentProfile.categories.filter((c) => c !== category),
        });
    }

    function handleCategoryKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            addCategory();
        }
    }

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await saveProfile({
                displayName: currentProfile.displayName,
                handle: currentProfile.handle,
                bio: currentProfile.bio,
                location: currentProfile.location,
                categories: currentProfile.categories,
                profilePictureUrl: currentProfile.profilePictureUrl,
                coverImageUrl: currentProfile.coverImageUrl,

                instagramUrl: currentProfile.instagramUrl,
                instagramFollowers: currentProfile.instagramFollowers,
                instagramAvgViews: currentProfile.instagramAvgViews,
                instagramStoryViews: currentProfile.instagramStoryViews,

                tikTokUrl: currentProfile.tikTokUrl,
                tikTokFollowers: currentProfile.tikTokFollowers,
                tikTokAvgViews: currentProfile.tikTokAvgViews,

                audienceAgeRange: currentProfile.audienceAgeRange,
                audienceTopLocations: currentProfile.audienceTopLocations,
            });

            navigate("/profile/preview");
        } catch (error) {
            console.error("Failed to save profile:", error);
        }
    };

    return (
        <form className="profile-edit" onSubmit={handleSave}>
            <div className="workspace-bar">
                <span className="workspace-label">Creator workspace</span>
                <div className="workspace-avatar" aria-hidden="true">
                    {initials || "?"}
                </div>
            </div>

            <div className="profile-edit-header">
                <div>
                    <h1 className="profile-edit-title">
                        {profile ? "Edit your profile." : "Create your profile."}
                    </h1>
                    <p className="profile-edit-subtitle">
                        This is what brands see first. Keep it current.
                    </p>
                </div>

                <button type="submit" className="btn btn-solid" disabled={saving}>
                    {saving ? "Saving..." : profile ? "Save changes" : "Create profile"}
                </button>
            </div>

            <div className="profile-edit-grid">
                <div className="panel-card">
                    <span className="panel-heading">Cover &amp; avatar</span>

                    <div
                        className="cover-preview"
                        style={
                            currentProfile.coverImageUrl
                                ? { backgroundImage: `url(${currentProfile.coverImageUrl})` }
                                : undefined
                        }
                    >
                        {!currentProfile.coverImageUrl && (
                            <span className="cover-placeholder">No cover image yet</span>
                        )}
                    </div>

                    <div className="avatar-row">
                        <div
                            className="avatar-preview"
                            style={
                                currentProfile.profilePictureUrl
                                    ? { backgroundImage: `url(${currentProfile.profilePictureUrl})` }
                                    : undefined
                            }
                        >
                            {!currentProfile.profilePictureUrl && (
                                <span>{initials || "?"}</span>
                            )}
                        </div>
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="coverImageUrl">
                            Cover image URL
                        </label>
                        <input
                            id="coverImageUrl"
                            name="coverImageUrl"
                            className="field-input"
                            placeholder="https://..."
                            value={currentProfile.coverImageUrl ?? ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="profilePictureUrl">
                            Avatar image URL
                        </label>
                        <input
                            id="profilePictureUrl"
                            name="profilePictureUrl"
                            className="field-input"
                            placeholder="https://..."
                            value={currentProfile.profilePictureUrl ?? ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="panel-card">
                    <span className="panel-heading">Basic info</span>

                    <div className="field-row">
                        <div className="field-group">
                            <label className="field-label" htmlFor="displayName">
                                Full name
                            </label>
                            <input
                                id="displayName"
                                name="displayName"
                                className="field-input"
                                value={currentProfile.displayName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label className="field-label" htmlFor="handle">
                                Handle
                            </label>
                            <div className="handle-input">
                                <span className="handle-prefix">@</span>
                                <input
                                    id="handle"
                                    name="handle"
                                    className="field-input field-input-handle"
                                    value={currentProfile.handle}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="location">
                            Location
                        </label>
                        <input
                            id="location"
                            name="location"
                            className="field-input"
                            value={currentProfile.location ?? ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="bio">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            className="field-input field-textarea"
                            value={currentProfile.bio ?? ""}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="new-category">
                            Categories
                        </label>
                        <div className="category-tags">
                            {currentProfile.categories.map((category) => (
                                <span className="category-tag" key={category}>
                                    {category}
                                    <button
                                        type="button"
                                        className="category-remove"
                                        onClick={() => removeCategory(category)}
                                        aria-label={`Remove ${category}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}

                            <span className="category-tag category-tag-add">
                                <input
                                    id="new-category"
                                    className="category-add-input"
                                    placeholder="+ Add category"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    onKeyDown={handleCategoryKeyDown}
                                    onBlur={addCategory}
                                />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="panel-card panel-card-platform">
                    <span className="panel-heading">
                        <span className="platform-dot platform-dot-instagram" />
                        Instagram
                    </span>

                    <div className="field-group">
                        <label className="field-label" htmlFor="instagramUrl">
                            Profile URL
                        </label>
                        <input
                            id="instagramUrl"
                            name="instagramUrl"
                            className="field-input"
                            placeholder="https://instagram.com/yourhandle"
                            value={currentProfile.instagramUrl ?? ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="field-row">
                        <div className="field-group">
                            <label className="field-label" htmlFor="instagramFollowers">
                                Followers
                            </label>
                            <input
                                id="instagramFollowers"
                                name="instagramFollowers"
                                type="number"
                                min="0"
                                className="field-input"
                                value={currentProfile.instagramFollowers ?? ""}
                                onChange={handleNumberChange}
                            />
                        </div>

                        <div className="field-group">
                            <label className="field-label" htmlFor="instagramAvgViews">
                                Avg. views / post
                            </label>
                            <input
                                id="instagramAvgViews"
                                name="instagramAvgViews"
                                type="number"
                                min="0"
                                className="field-input"
                                value={currentProfile.instagramAvgViews ?? ""}
                                onChange={handleNumberChange}
                            />
                        </div>
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="instagramStoryViews">
                            Avg. story views
                        </label>
                        <input
                            id="instagramStoryViews"
                            name="instagramStoryViews"
                            type="number"
                            min="0"
                            className="field-input"
                            value={currentProfile.instagramStoryViews ?? ""}
                            onChange={handleNumberChange}
                        />
                    </div>
                </div>

                <div className="panel-card panel-card-platform">
                    <span className="panel-heading">
                        <span className="platform-dot platform-dot-tiktok" />
                        TikTok
                    </span>

                    <div className="field-group">
                        <label className="field-label" htmlFor="tikTokUrl">
                            Profile URL
                        </label>
                        <input
                            id="tikTokUrl"
                            name="tikTokUrl"
                            className="field-input"
                            placeholder="https://tiktok.com/@yourhandle"
                            value={currentProfile.tikTokUrl ?? ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="field-row">
                        <div className="field-group">
                            <label className="field-label" htmlFor="tikTokFollowers">
                                Followers
                            </label>
                            <input
                                id="tikTokFollowers"
                                name="tikTokFollowers"
                                type="number"
                                min="0"
                                className="field-input"
                                value={currentProfile.tikTokFollowers ?? ""}
                                onChange={handleNumberChange}
                            />
                        </div>

                        <div className="field-group">
                            <label className="field-label" htmlFor="tikTokAvgViews">
                                Avg. views / video
                            </label>
                            <input
                                id="tikTokAvgViews"
                                name="tikTokAvgViews"
                                type="number"
                                min="0"
                                className="field-input"
                                value={currentProfile.tikTokAvgViews ?? ""}
                                onChange={handleNumberChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="panel-card panel-card-wide">
                    <span className="panel-heading">Audience</span>

                    <div className="field-row">
                        <div className="field-group">
                            <label className="field-label" htmlFor="audienceAgeRange">
                                Age range
                            </label>
                            <input
                                id="audienceAgeRange"
                                name="audienceAgeRange"
                                className="field-input"
                                placeholder="e.g. 18–24"
                                value={currentProfile.audienceAgeRange ?? ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="field-group">
                            <label className="field-label" htmlFor="audienceTopLocations">
                                Top locations
                            </label>
                            <input
                                id="audienceTopLocations"
                                name="audienceTopLocations"
                                className="field-input"
                                placeholder="e.g. Skopje, Bitola"
                                value={currentProfile.audienceTopLocations ?? ""}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}