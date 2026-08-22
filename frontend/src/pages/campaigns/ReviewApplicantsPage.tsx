import { useState } from "react";
import { Link } from "react-router-dom";
import useCampaignApplicants from "../../hooks/useCampaignApplicants";
import useRequestedInfluencers from "../../hooks/useRequestedInfluencers";
import { RespondModal } from "../../components/RespondModal/RespondModal";
import { CreateDealModal } from "../../components/CreateDealModal/CreateDealModal";
import type { Applicant } from "../../api/types/applicant";
import type { CreateDealRequest } from "../../api/types/deal";
import "./ReviewApplicantsPage.css";

function formatFollowers(count: number): string {
    if (count >= 1_000_000) {
        return `${(count / 1_000_000).toFixed(1)}M`;
    }

    if (count >= 1_000) {
        return `${(count / 1_000).toFixed(0)}K`;
    }

    return `${count}`;
}

export function ReviewApplicantsPage() {
    const { campaignId, data, loading, reload } = useCampaignApplicants();

    const {
        requested,
        loading: requestedLoading,
        reload: reloadRequested,
    } = useRequestedInfluencers(campaignId);

    const [showRequested, setShowRequested] = useState(false);

    const [respondTarget, setRespondTarget] = useState<{
        applicant: Applicant;
        status: "Accepted" | "Rejected";
    } | null>(null);

    const [dealTarget, setDealTarget] = useState<{
        request: CreateDealRequest;
        influencerName: string;
        source: "applicant" | "requested";
    } | null>(null);

    if (loading) {
        return <div className="ra-status">Loading...</div>;
    }

    if (!data) {
        return <div className="ra-status">Campaign not found.</div>;
    }

    function handleDealCreated() {
        const source = dealTarget?.source;

        setDealTarget(null);

        if (source === "applicant") {
            reload();
        } else {
            reloadRequested();
        }
    }

    return (
        <div className="ra-page">
            {/* HEADER */}
            <div className="ra-header">
                <div className="ra-header-top">
                    <div>
                        <span className="ra-eyebrow">
                            CAMPAIGN · {data.campaignTitle.toUpperCase()}
                        </span>

                        <h1 className="ra-title">
                            {showRequested
                                ? "Requested influencers."
                                : "Review applicants."}
                        </h1>

                        <p className="ra-subtitle">
                            {showRequested
                                ? "Influencers you've reached out to directly for this campaign."
                                : "Side-by-side comparison. Accept, reject, or negotiate on price."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() =>
                            setShowRequested((prev) => !prev)
                        }
                    >
                        {showRequested
                            ? "View applicants"
                            : "Requested influencers"}
                    </button>
                </div>
            </div>

            {/* APPLICANTS */}
            {!showRequested && (
                <div className="ra-list">
                    {data.applicants.length === 0 && (
                        <p className="ra-status">No applicants yet.</p>
                    )}

                    {data.applicants.map((applicant) => (
                        <div
                            className="ra-card"
                            key={applicant.applicationId}
                        >
                            <div className="ra-card-identity">
                                <div
                                    className="ra-avatar"
                                    style={
                                        applicant.profilePictureUrl
                                            ? {
                                                backgroundImage: `url(${applicant.profilePictureUrl})`,
                                            }
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
                                        @{applicant.handle} ·{" "}
                                        {formatFollowers(
                                            applicant.totalFollowers
                                        )}
                                        {applicant.overallEngagementRate !==
                                            null &&
                                            ` · ${applicant.overallEngagementRate}% ER`}
                                    </p>
                                </div>
                            </div>

                            {applicant.pitchMessage && (
                                <p className="ra-pitch">
                                    "{applicant.pitchMessage}"
                                </p>
                            )}

                            <div className="ra-side">
                                {/* PENDING */}
                                {applicant.status === "Pending" && (
                                    <>
                                        {applicant.proposedRate !==
                                            undefined && (
                                                <div className="ra-asking">
                                                    <span className="ra-asking-label">
                                                        ASKING
                                                    </span>

                                                    <span className="ra-asking-value">
                                                        $
                                                        {applicant.proposedRate.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}

                                        <div className="ra-actions">
                                            <button
                                                type="button"
                                                className="ra-icon-btn ra-icon-btn-reject"
                                                title="Reject"
                                                onClick={() =>
                                                    setRespondTarget({
                                                        applicant,
                                                        status: "Rejected",
                                                    })
                                                }
                                            >
                                                ×
                                            </button>

                                            <button
                                                type="button"
                                                className="ra-icon-btn ra-icon-btn-accept"
                                                title="Accept"
                                                onClick={() =>
                                                    setRespondTarget({
                                                        applicant,
                                                        status: "Accepted",
                                                    })
                                                }
                                            >
                                                ✓
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* ACCEPTED */}
                                {applicant.status === "Accepted" && (
                                    <>
                                        <span className="ra-badge ra-badge-accepted">
                                            ACCEPTED
                                        </span>

                                        {applicant.hasDeal ? (
                                            <span className="ra-badge ra-badge-accepted">
                                                DEAL CREATED
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                className="ra-create-deal-btn"
                                                onClick={() =>
                                                    setDealTarget({
                                                        source: "applicant",
                                                        influencerName:
                                                            applicant.displayName,
                                                        request: {
                                                            influencerId:
                                                                applicant.influencerId,
                                                            campaignId,
                                                            campaignApplicationId:
                                                                applicant.applicationId,
                                                            title:
                                                                data.campaignTitle,
                                                            deliverables:
                                                                data.campaignDeliverables
                                                                    ? data.campaignDeliverables
                                                                        .split(
                                                                            ","
                                                                        )
                                                                        .map(
                                                                            (
                                                                                d
                                                                            ) =>
                                                                                d.trim()
                                                                        )
                                                                        .filter(
                                                                            Boolean
                                                                        )
                                                                    : [],
                                                            price:
                                                                applicant.proposedRate ??
                                                                0,
                                                        },
                                                    })
                                                }
                                            >
                                                Create deal
                                            </button>
                                        )}
                                    </>
                                )}

                                {/* REJECTED */}
                                {applicant.status === "Rejected" && (
                                    <span className="ra-badge ra-badge-rejected">
                                        REJECTED
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* REQUESTED INFLUENCERS */}
            {showRequested && (
                <div className="ra-list">
                    {requestedLoading && (
                        <p className="ra-status">Loading...</p>
                    )}

                    {!requestedLoading && requested.length === 0 && (
                        <p className="ra-status">
                            You haven't sent any direct requests for this
                            campaign yet.
                        </p>
                    )}

                    {!requestedLoading &&
                        requested.map((r) => (
                            <div
                                className="ra-card"
                                key={r.requestId}
                            >
                                <div className="ra-card-identity">
                                    <div
                                        className="ra-avatar"
                                        style={
                                            r.profilePictureUrl
                                                ? {
                                                    backgroundImage: `url(${r.profilePictureUrl})`,
                                                }
                                                : undefined
                                        }
                                    />

                                    <div>
                                        <Link
                                            to={`/profile/preview/${r.influencerId}`}
                                            className="ra-name"
                                        >
                                            {r.displayName}
                                        </Link>

                                        <p className="ra-handle">
                                            @{r.handle}
                                        </p>
                                    </div>
                                </div>

                                <div className="ra-pitch" />

                                <div className="ra-side">
                                    {/* PENDING / OTHER STATUS */}
                                    {r.status !== "Accepted" && (
                                        <>
                                            {r.offeredBudget !== undefined && (
                                                <div className="ra-asking">
                                                    <span className="ra-asking-label">
                                                        OFFERED
                                                    </span>

                                                    <span className="ra-asking-value">
                                                        $
                                                        {r.offeredBudget.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}

                                            <span
                                                className={`ra-badge ra-badge-${r.status.toLowerCase()}`}
                                            >
                                                {r.status.toUpperCase()}
                                            </span>
                                        </>
                                    )}

                                    {/* ACCEPTED */}
                                    {r.status === "Accepted" && (
                                        <>
                                            <span className="ra-badge ra-badge-accepted">
                                                ACCEPTED
                                            </span>

                                            {r.hasDeal ? (
                                                <span className="ra-badge ra-badge-accepted">
                                                    DEAL CREATED
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="ra-create-deal-btn"
                                                    onClick={() =>
                                                        setDealTarget({
                                                            source: "requested",
                                                            influencerName:
                                                                r.displayName,
                                                            request: {
                                                                influencerId:
                                                                    r.influencerId,
                                                                campaignId,
                                                                collaborationRequestId:
                                                                    r.requestId,
                                                                title:
                                                                    data.campaignTitle ??
                                                                    "Direct collaboration",
                                                                deliverables:
                                                                    r.deliverables,
                                                                price:
                                                                    r.offeredBudget ??
                                                                    0,
                                                            },
                                                        })
                                                    }
                                                >
                                                    Create deal
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {/* RESPOND MODAL */}
            {respondTarget && (
                <RespondModal
                    campaignId={campaignId}
                    applicationId={
                        respondTarget.applicant.applicationId
                    }
                    applicantName={
                        respondTarget.applicant.displayName
                    }
                    status={respondTarget.status}
                    onClose={() => setRespondTarget(null)}
                    onDone={() => {
                        setRespondTarget(null);
                        reload();
                    }}
                />
            )}

            {/* CREATE DEAL MODAL */}
            {dealTarget && (
                <CreateDealModal
                    prefill={dealTarget.request}
                    influencerName={dealTarget.influencerName}
                    onClose={() => setDealTarget(null)}
                    onCreated={handleDealCreated}
                />
            )}
        </div>
    );
}