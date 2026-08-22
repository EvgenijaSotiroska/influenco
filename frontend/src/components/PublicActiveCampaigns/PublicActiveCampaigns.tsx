import { useEffect, useState } from "react";
import brandApi from "../../api/brandApi";
import type { CampaignSummary } from "../../api/types/campaign";
import "./PublicActiveCampaigns.css";

function formatDate(dateStr?: string): string {
    if (!dateStr) return "No deadline";
    return `Closes ${new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })}`;
}

function formatBudget(budget?: number): string {
    if (budget === undefined) return "Rate on request";
    return `$${budget.toLocaleString()}`;
}

export function PublicActiveCampaigns({ brandId }: { brandId: string }) {
    const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await brandApi.getActiveCampaigns(brandId);
                if (!cancelled) setCampaigns(data);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [brandId]);

    if (loading) {
        return (
            <div className="pac-card">
                <h2 className="pac-title">Active campaigns</h2>
                <p className="pac-empty">Loading...</p>
            </div>
        );
    }

    return (
        <div className="pac-card">
            <h2 className="pac-title">Active campaigns</h2>

            {campaigns.length === 0 && (
                <p className="pac-empty">No active campaigns right now.</p>
            )}

            {campaigns.map((c) => (
                <div className="pac-row" key={c.id}>
                    <div>
                        <p className="pac-row-title">{c.title}</p>
                        <p className="pac-row-meta">
                            {formatBudget(c.budget)} · {formatDate(c.applicationDeadline)}
                        </p>
                    </div>
                    <span className="pac-row-applicants">{c.applicantsCount} applied</span>
                </div>
            ))}
        </div>
    );
}