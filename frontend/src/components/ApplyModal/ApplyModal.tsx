import { useState, type FormEvent } from "react";
import browseCampaignsApi from "../../api/browseCampaignsApi";
import "./ApplyModal.css";

interface ApplyModalProps {
    campaignId: string;
    campaignTitle: string;
    onClose: () => void;
    onApplied: () => void;
}

export function ApplyModal({ campaignId, campaignTitle, onClose, onApplied }: ApplyModalProps) {
    const [pitchMessage, setPitchMessage] = useState("");
    const [proposedRate, setProposedRate] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await browseCampaignsApi.apply(campaignId, {
                pitchMessage: pitchMessage.trim() || undefined,
                proposedRate: proposedRate ? Number(proposedRate) : undefined,
            });
            onApplied();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Couldn't submit your application. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="apply-modal-overlay" onClick={onClose}>
            <div className="apply-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="apply-modal-close" onClick={onClose} aria-label="Close">
                    ×
                </button>

                <h2 className="apply-modal-title">Apply to campaign</h2>
                <p className="apply-modal-subtitle">{campaignTitle}</p>

                {error && <p className="apply-modal-error">{error}</p>}

                <form onSubmit={handleSubmit} className="apply-modal-form">
                    <div className="apply-modal-field">
                        <label className="apply-modal-label" htmlFor="pitchMessage">
                            Your pitch
                        </label>
                        <textarea
                            id="pitchMessage"
                            className="apply-modal-input"
                            rows={4}
                            placeholder="Tell the brand why you're a good fit."
                            value={pitchMessage}
                            onChange={(e) => setPitchMessage(e.target.value)}
                        />
                    </div>

                    <div className="apply-modal-field">
                        <label className="apply-modal-label" htmlFor="proposedRate">
                            Your rate (USD)
                        </label>
                        <input
                            id="proposedRate"
                            type="number"
                            min="0"
                            className="apply-modal-input"
                            placeholder="e.g. 5000"
                            value={proposedRate}
                            onChange={(e) => setProposedRate(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-solid" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit application"}
                    </button>
                </form>
            </div>
        </div>
    );
}