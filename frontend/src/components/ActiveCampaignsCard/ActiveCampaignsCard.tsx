import { Link } from "react-router-dom";
import useCampaigns from "../../hooks/useCampaigns";
import "./ActiveCampaignsCard.css";

function formatDate(dateStr?: string): string {
    if (!dateStr) return "No deadline";
    return `Closes ${new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })}`;
}

export function ActiveCampaignsCard() {
    const { campaigns, loading } = useCampaigns();

    const active = campaigns.filter((c) => c.status !== "Closed").slice(0, 5);

    return (
        <div className="active-campaigns-card">
            <div className="active-campaigns-header">
                <h2 className="active-campaigns-title">Active campaigns</h2>
                <Link to="/brand/campaigns" className="active-campaigns-manage">
                    Manage all
                </Link>
            </div>

            {loading && <p className="active-campaigns-empty">Loading...</p>}

            {!loading && active.length === 0 && (
                <p className="active-campaigns-empty">
                    No active campaigns yet.{" "}
                    <Link to="/brand/campaigns/new">Create one</Link>
                </p>
            )}

            {!loading &&
                active.map((campaign) => (
                    <Link
                        to={`/brand/campaigns/${campaign.id}/edit`}
                        className="active-campaign-row"
                        key={campaign.id}
                    >
                        <div>
                            <p className="active-campaign-title">{campaign.title}</p>
                            <p className="active-campaign-meta">
                                {campaign.applicantsCount} applicants · {formatDate(campaign.applicationDeadline)}
                            </p>
                        </div>
                        <span className="active-campaign-icon">↗</span>
                    </Link>
                ))}
        </div>
    );
}