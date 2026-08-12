import { useState } from "react";
import { Link } from "react-router-dom";
import useCampaignApplicants from "../../hooks/useCampaignApplicants";
import { RespondModal } from "../../components/RespondModal/RespondModal";
import type { Applicant } from "../../api/types/applicant";
import "./ReviewApplicantsPage.css";

function formatFollowers(count: number): string {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
    return `${count}`;
}

export function ReviewApplicantsPage() {
    const { campaignId, data, loading, reload } = useCampaignApplicants();
    const [respondTarget, setRespondTarget] = useState<{
        applicant: Applicant;
        status: "Accepted" | "Rejected";
    } | null>(null);

    if (loading) {
        return <div className="ra-status">Loading...</div>;
    }

    if (!data) {
        return <div className="ra-status">Campaign not found.</div>;
    }

    return (
        <div className="ra-page">
            <div className="ra-header">
                <span className="ra-eyebrow">CAMPAIGN · {data.campaignTitle.toUpperCase()}</span>
                <h1 className="ra-title">Review applicants.</h1>
                <p className="ra-subtitle">
                    Side-by-side comparison. Accept, reject, or negotiate on price.
                </p>
            </div>

            <div className="ra-list">
                {data.applicants.length === 0 && (
                    <p className="ra-status">No applicants yet.</p>
                )}

                {data.applicants.map((applicant) => (
                    <div className="ra-card" key={applicant.applicationId}>
                        <div className="ra-card-identity">
                            <div
                                className="ra-avatar"
                                style={
                                    applicant.profilePictureUrl
                                        ? { backgroundImage: `url(${applicant.profilePictureUrl})` }
                                        : undefined
                                }
                            />
                            <div>
                                <Link
                                    to={`/profile/preview/${applicant.influencerId}`}
                                    className="ra-name"
                                >
                                    {applicant.displayName}
                                </Link>
                                <p className="ra-handle">
                                    @{applicant.handle} · {formatFollowers(applicant.totalFollowers)}
                                    {applicant.overallEngagementRate !== null &&
                                        ` · ${applicant.overallEngagementRate}% ER`}
                                </p>
                            </div>
                        </div>

                        {applicant.pitchMessage && (
                            <p className="ra-pitch">"{applicant.pitchMessage}"</p>
                        )}

                        <div className="ra-side">
                            {applicant.proposedRate !== undefined && (
                                <div className="ra-asking">
                                    <span className="ra-asking-label">ASKING</span>
                                    <span className="ra-asking-value">
                                        ${applicant.proposedRate.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {applicant.status === "Pending" && (
                                <div className="ra-actions">
                                    <button
                                        type="button"
                                        className="ra-icon-btn ra-icon-btn-reject"
                                        title="Reject"
                                        onClick={() =>
                                            setRespondTarget({ applicant, status: "Rejected" })
                                        }
                                    >
                                        ×
                                    </button>
                                    <button
                                        type="button"
                                        className="ra-icon-btn ra-icon-btn-accept"
                                        title="Accept"
                                        onClick={() =>
                                            setRespondTarget({ applicant, status: "Accepted" })
                                        }
                                    >
                                        ✓
                                    </button>
                                </div>
                            )}

                            {applicant.status === "Accepted" && (
                                <span className="ra-badge ra-badge-accepted">ACCEPTED</span>
                            )}

                            {applicant.status === "Rejected" && (
                                <span className="ra-badge ra-badge-rejected">REJECTED</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {respondTarget && (
                <RespondModal
                    campaignId={campaignId}
                    applicationId={respondTarget.applicant.applicationId}
                    applicantName={respondTarget.applicant.displayName}
                    status={respondTarget.status}
                    onClose={() => setRespondTarget(null)}
                    onDone={() => {
                        setRespondTarget(null);
                        reload();
                    }}
                />
            )}
        </div>
    );
}