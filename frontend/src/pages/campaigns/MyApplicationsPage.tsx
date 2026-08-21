import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import browseCampaignsApi from "../../api/browseCampaignsApi";
import type { MyApplication } from "../../api/types/myApplications";
import "./MyApplicationsPage.css";

export function MyApplicationsPage() {
    const [applications, setApplications] = useState<MyApplication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await browseCampaignsApi.getMyApplications();
                if (!cancelled) setApplications(data);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="ma-page">
            <div className="ma-header">
                <Link to="/campaigns" className="btn btn-outline">
                    ← Browse campaigns
                </Link>
                <h1 className="ma-title">My applications.</h1>
                <p className="ma-subtitle">
                    Track the status of campaigns you've applied to.
                </p>
            </div>

            <div className="ma-list">
                {loading && <p className="ma-status">Loading...</p>}

                {!loading && applications.length === 0 && (
                    <p className="ma-status">
                        You haven't applied to any campaigns yet.
                    </p>
                )}

                {!loading &&
                    applications.map((app) => (
                        <div className="ma-card" key={app.applicationId}>
                            <div className="ma-card-main">
                                <span className="ma-card-brand">{app.brandName.toUpperCase()}</span>
                                <h2 className="ma-card-title">{app.campaignTitle}</h2>

                                {app.pitchMessage && (
                                    <p className="ma-card-pitch">"{app.pitchMessage}"</p>
                                )}

                                {app.proposedRate !== undefined && (
                                    <p className="ma-card-rate">
                                        Your ask: ${app.proposedRate.toLocaleString()}
                                    </p>
                                )}
                            </div>

                            <div className="ma-card-side">
                                <span className={`ma-badge ma-badge-${app.status.toLowerCase()}`}>
                                    {app.status}
                                </span>

                                {app.brandResponseMessage && (
                                    <div className="ma-response">
                                        <span className="ma-response-label">
                                            {app.status === "Accepted" ? "Message from brand" : "Reason"}
                                        </span>
                                        <p className="ma-response-message">{app.brandResponseMessage}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}