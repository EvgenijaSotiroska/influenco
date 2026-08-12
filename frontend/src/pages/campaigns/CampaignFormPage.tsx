import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import useCampaignForm from "../../hooks/useCampaignForm";
import "./CampaignFormPage.css";

const NICHE_OPTIONS = ["Travel", "Fashion", "Beauty", "Food", "Tech", "Fitness", "Outdoor", "Lifestyle"];
const PLATFORM_OPTIONS = ["Instagram", "TikTok", "YouTube", "X", "Facebook"];

export function CampaignFormPage() {
    const { form, setForm, loading, saving, error, save, isEditMode } = useCampaignForm();

    if (loading) {
        return <div className="campaign-form-loading">Loading...</div>;
    }

    function handleChange(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    function handleNumberChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value === "" ? undefined : Number(value) });
    }

    function toggleNiche(niche: string) {
        setForm({
            ...form,
            niches: form.niches.includes(niche)
                ? form.niches.filter((n) => n !== niche)
                : [...form.niches, niche],
        });
    }

    function togglePlatform(platform: string) {
        setForm({
            ...form,
            platforms: form.platforms.includes(platform)
                ? form.platforms.filter((p) => p !== platform)
                : [...form.platforms, platform],
        });
    }

    async function handleSubmit() {
        await save();
    }

    return (
        <div className="cf-page">
            <div className="cf-header">
                <div>
                    <h1 className="cf-title">
                        {isEditMode ? "Edit campaign." : "New campaign."}
                    </h1>
                    <p className="cf-subtitle">
                        Write a brief creators can actually answer: deliverables, budget
                        range, and who you're looking for.
                    </p>
                </div>

                <Link to="/brand/campaigns" className="cf-btn cf-btn-outline">
                    ← Back to campaigns
                </Link>
            </div>

            {error && <p className="cf-error">{error}</p>}

            <div className="cf-grid">
                <div className="cf-card">
                    <h2 className="cf-card-title">The brief</h2>

                    <div className="cf-field">
                        <label className="cf-label" htmlFor="title">
                            Campaign title
                        </label>
                        <input
                            id="title"
                            name="title"
                            className="cf-input"
                            placeholder="Fall carry — travel creators for capsule launch"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="cf-field">
                        <label className="cf-label" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="cf-input cf-textarea"
                            placeholder="What you need, tone, deliverables, and anything creators should avoid."
                            rows={5}
                            value={form.description ?? ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="cf-field">
                        <label className="cf-label" htmlFor="deliverables">
                            Deliverables
                        </label>
                        <input
                            id="deliverables"
                            name="deliverables"
                            className="cf-input"
                            placeholder="1 Instagram reel, 3 Stories"
                            value={form.deliverables ?? ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="cf-card">
                    <h2 className="cf-card-title">Budget &amp; timing</h2>

                    <div className="cf-field">
                        <label className="cf-label" htmlFor="budget">
                            Budget (USD)
                        </label>
                        <input
                            id="budget"
                            name="budget"
                            type="number"
                            min="0"
                            className="cf-input"
                            placeholder="5000"
                            value={form.budget ?? ""}
                            onChange={handleNumberChange}
                        />
                    </div>

                    <div className="cf-field">
                        <label className="cf-label" htmlFor="applicationDeadline">
                            Application deadline
                        </label>
                        <input
                            id="applicationDeadline"
                            name="applicationDeadline"
                            type="date"
                            className="cf-input"
                            value={form.applicationDeadline ?? ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="cf-field">
                        <label className="cf-label" htmlFor="status">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            className="cf-input"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <option value="Draft">Draft</option>
                            <option value="OpenForApplications">Open for applications</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        className="cf-btn cf-btn-solid"
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : isEditMode ? "Save changes" : "Publish campaign"}
                    </button>
                </div>

                <div className="cf-card">
                    <h2 className="cf-card-title">Who you're looking for</h2>

                    <div className="cf-field">
                        <span className="cf-label">Niches</span>
                        <div className="cf-pill-group">
                            {NICHE_OPTIONS.map((niche) => (
                                <button
                                    key={niche}
                                    type="button"
                                    className={`cf-pill ${form.niches.includes(niche) ? "cf-pill-active" : ""}`}
                                    onClick={() => toggleNiche(niche)}
                                >
                                    {niche}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="cf-field">
                        <span className="cf-label">Platforms</span>
                        <div className="cf-pill-group">
                            {PLATFORM_OPTIONS.map((platform) => (
                                <button
                                    key={platform}
                                    type="button"
                                    className={`cf-pill ${form.platforms.includes(platform) ? "cf-pill-active" : ""}`}
                                    onClick={() => togglePlatform(platform)}
                                >
                                    {platform}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="cf-field">
                        <label className="cf-label" htmlFor="minimumFollowers">
                            Minimum followers
                        </label>
                        <input
                            id="minimumFollowers"
                            name="minimumFollowers"
                            type="number"
                            min="0"
                            className="cf-input"
                            placeholder="100000"
                            value={form.minimumFollowers ?? ""}
                            onChange={handleNumberChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}