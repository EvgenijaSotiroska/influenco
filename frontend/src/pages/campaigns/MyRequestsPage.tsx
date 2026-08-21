import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import collaborationRequestApi from "../../api/collaborationRequestApi";
import type { IncomingCollaborationRequest } from "../../api/types/incomingRequests";
import "./MyRequestsPage.css";

function formatDate(dateStr?: string): string {
    if (!dateStr) return "No timeline set";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function MyRequestsPage() {
    const [requests, setRequests] = useState<IncomingCollaborationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [respondingId, setRespondingId] = useState<string | null>(null);

    async function load() {
        try {
            const data = await collaborationRequestApi.getMyRequests();
            setRequests(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleRespond(requestId: string, status: "Accepted" | "Declined") {
        setRespondingId(requestId);
        try {
            await collaborationRequestApi.respond(requestId, status);
            await load();
        } finally {
            setRespondingId(null);
        }
    }

    return (
        <div className="mr-page">
            <div className="mr-header">
                <Link to="/campaigns" className="btn btn-outline">
                    ← Browse campaigns
                </Link>
                <h1 className="mr-title">Requests.</h1>
                <p className="mr-subtitle">
                    Collaboration requests sent to you directly by brands.
                </p>
            </div>

            <div className="mr-list">
                {loading && <p className="mr-status">Loading...</p>}

                {!loading && requests.length === 0 && (
                    <p className="mr-status">No collaboration requests yet.</p>
                )}

                {!loading &&
                    requests.map((req) => (
                        <div className="mr-card" key={req.requestId}>
                            <div className="mr-card-main">
                                <span className="mr-card-brand">{req.brandName.toUpperCase()}</span>

                                {req.campaignTitle && (
                                    <h2 className="mr-card-title">{req.campaignTitle}</h2>
                                )}

                                {req.message && <p className="mr-card-message">"{req.message}"</p>}

                                {req.deliverables.length > 0 && (
                                    <div className="mr-card-tags">
                                        {req.deliverables.map((d) => (
                                            <span className="mr-tag" key={d}>
                                                {d}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mr-card-side">
                                {req.offeredBudget !== undefined && (
                                    <span className="mr-budget">
                                        ${req.offeredBudget.toLocaleString()}
                                    </span>
                                )}

                                <span className="mr-timeline">{formatDate(req.timeline)}</span>

                                {req.status === "Pending" ? (
                                    <div className="mr-actions">
                                        <button
                                            type="button"
                                            className="mr-btn mr-btn-decline"
                                            onClick={() => handleRespond(req.requestId, "Declined")}
                                            disabled={respondingId === req.requestId}
                                        >
                                            Decline
                                        </button>
                                        <button
                                            type="button"
                                            className="mr-btn mr-btn-accept"
                                            onClick={() => handleRespond(req.requestId, "Accepted")}
                                            disabled={respondingId === req.requestId}
                                        >
                                            Accept
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`mr-badge mr-badge-${req.status.toLowerCase()}`}>
                                        {req.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}