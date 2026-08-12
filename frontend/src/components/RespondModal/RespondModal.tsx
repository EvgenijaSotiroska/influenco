import { useState, type FormEvent } from "react";
import campaignApi from "../../api/campaignApi";
import "./RespondModal.css";

interface RespondModalProps {
    campaignId: string;
    applicationId: string;
    applicantName: string;
    status: "Accepted" | "Rejected";
    onClose: () => void;
    onDone: () => void;
}

export function RespondModal({
    campaignId,
    applicationId,
    applicantName,
    status,
    onClose,
    onDone,
}: RespondModalProps) {
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            await campaignApi.respondToApplicant(campaignId, applicationId, {
                status,
                responseMessage: message.trim() || undefined,
            });
            onDone();
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="respond-modal-overlay" onClick={onClose}>
            <div className="respond-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="respond-modal-close" onClick={onClose} aria-label="Close">
                    ×
                </button>

                <h2 className="respond-modal-title">
                    {status === "Accepted" ? "Accept" : "Reject"} {applicantName}
                </h2>

                <p className="respond-modal-subtitle">
                    {status === "Accepted"
                        ? "Let them know how to reach you — email, next steps, or timeline."
                        : "Optional: let them know why, so they can apply elsewhere with confidence."}
                </p>

                <form onSubmit={handleSubmit} className="respond-modal-form">
                    <textarea
                        className="respond-modal-input"
                        rows={4}
                        placeholder={
                            status === "Accepted"
                                ? "e.g. Excited to work with you! Reach out to hello@brand.com to finalize details."
                                : "e.g. Going with a different fit for this campaign, but loved your pitch."
                        }
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button
                        type="submit"
                        className={`btn ${status === "Accepted" ? "btn-solid" : "btn-outline"}`}
                        disabled={submitting}
                    >
                        {submitting ? "Sending..." : status === "Accepted" ? "Confirm accept" : "Confirm reject"}
                    </button>
                </form>
            </div>
        </div>
    );
}