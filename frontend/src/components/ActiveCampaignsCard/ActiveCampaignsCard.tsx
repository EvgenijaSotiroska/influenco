import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCampaigns from "../../hooks/useCampaigns";
import brandApi from "../../api/brandApi";
import type { CampaignSummary } from "../../api/types/campaign";
import "./ActiveCampaignsCard.css";

function formatDate(dateStr?: string): string {
    if (!dateStr) return "No deadline";
    return `Closes ${new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })}`;
}

function isPastDeadline(dateStr?: string): boolean {
    if (!dateStr) return false;
    return new Date(dateStr).getTime() < Date.now();
}

interface ActiveCampaignsCardProps {
    isOwner: boolean;
    brandId?: string;
}

export function ActiveCampaignsCard({ isOwner, brandId }: ActiveCampaignsCardProps) {
    // Owner path: authenticated "my campaigns" list
    const ownCampaigns = useCampaigns();

    // Visitor path: public campaigns for a specific brand
    const [publicCampaigns, setPublicCampaigns] = useState<CampaignSummary[]>([]);
    const [publicLoading, setPublicLoading] = useState(!isOwner);

    useEffect(() => {
        if (isOwner || !brandId) return;
        let cancelled = false;

        async function load() {
            try {
                setPublicLoading(true);
                const data = await brandApi.getActiveCampaigns(brandId!);
                if (!cancelled) setPublicCampaigns(data);
            } finally {
                if (!cancelled) setPublicLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [isOwner, brandId]);

    const loading = isOwner ? ownCampaigns.loading : publicLoading;

    const active = isOwner
        ? ownCampaigns.campaigns
            .filter((c) => c.status !== "Closed")
            .filter((c) => !isPastDeadline(c.applicationDeadline))
            .slice(0, 5)
        : publicCampaigns.slice(0, 5);

    return (
        <div className="active-campaigns-card">
            <div className="active-campaigns-header">
                <h2 className="active-campaigns-title">Active campaigns</h2>
                {isOwner && (
                    <Link to="/brand/campaigns" className="active-campaigns-manage">
                        Manage all
                    </Link>
                )}
            </div>

            {loading && <p className="active-campaigns-empty">Loading...</p>}

            {!loading && active.length === 0 && (
                <p className="active-campaigns-empty">
                    No active campaigns yet.
                    {isOwner && (
                        <>
                            {" "}
                            <Link to="/brand/campaigns/new">Create one</Link>
                        </>
                    )}
                </p>
            )}

            {!loading &&
                active.map((campaign) =>
                    isOwner ? (
                        <Link
                            to={`/brand/campaigns/${campaign.id}/applicants`}
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
                    ) : (
                        <div className="active-campaign-row active-campaign-row-static" key={campaign.id}>
                            <div>
                                <p className="active-campaign-title">{campaign.title}</p>
                                <p className="active-campaign-meta">
                                    {campaign.applicantsCount} applicants · {formatDate(campaign.applicationDeadline)}
                                </p>
                            </div>
                        </div>
                    )
                )}
        </div>
    );
}