import { Link } from "react-router-dom";
import useCampaigns from "../../hooks/useCampaigns";
import campaignApi from "../../api/campaignApi";
import "./CampaignsListPage.css";

function formatDate(dateStr?: string): string {
    if (!dateStr) return "No deadline";
    return `Closes ${new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })}`;
}

export function CampaignsListPage() {
    const { campaigns, loading, reload } = useCampaigns();

    async function handleDelete(id: string) {
        if (!window.confirm("Delete this campaign? This cannot be undone.")) return;
        await campaignApi.remove(id);
        reload();
    }

    return (
        <div className="campaigns-list-page">
            <div className="campaigns-list-header">
                <div>
                    <h1 className="campaigns-list-title">Campaigns.</h1>
                    <p className="campaigns-list-subtitle">
                        Manage your active, draft, and closed campaigns.
                    </p>
                </div>

                <Link to="/brand/campaigns/new" className="btn btn-solid">
                    New campaign
                </Link>
            </div>

            <div className="campaigns-list-card">
                {loading && <p className="campaigns-empty">Loading...</p>}

                {!loading && campaigns.length === 0 && (
                    <p className="campaigns-empty">No campaigns yet.</p>
                )}

                {!loading &&
                    campaigns.map((campaign) => (
                        <div className="campaign-row" key={campaign.id}>
                            <Link
                                to={`/brand/campaigns/${campaign.id}/applicants`}
                                className="campaign-row-main"
                            >
                                <p className="campaign-row-title">{campaign.title}</p>
                                <p className="campaign-row-meta">
                                    {campaign.applicantsCount} applicants · {formatDate(campaign.applicationDeadline)}
                                    {" · "}
                                    <span className={`campaign-status campaign-status-${campaign.status}`}>
                                        {campaign.status === "OpenForApplications"
                                            ? "Open for applications"
                                            : campaign.status}
                                    </span>
                                </p>
                            </Link>

                            <div className="campaign-row-actions">
                                <Link
                                    to={`/brand/campaigns/${campaign.id}/edit`}
                                    className="campaign-row-edit"
                                >
                                    Edit
                                </Link>
                                <button
                                    type="button"
                                    className="campaign-row-delete"
                                    onClick={() => handleDelete(campaign.id)}
                                    aria-label="Delete"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}