import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import collaborationRequestApi from "../../api/collaborationRequestApi";
import type { BrandCampaignOption } from "../../api/types/collaborationRequest";
import "./CollaborationRequestModal.css";

const DELIVERABLE_OPTIONS = [
    "Instagram post",
    "Instagram reel",
    "Instagram story",
    "TikTok video",
    "YouTube video",
    "YouTube short",
];

interface CollaborationRequestModalProps {
    influencerId: string;
    influencerName: string;
    onClose: () => void;
}

export function CollaborationRequestModal({
    influencerId,
    influencerName,
    onClose,
}: CollaborationRequestModalProps) {
    const [campaigns, setCampaigns] = useState<BrandCampaignOption[]>([]);
    const [campaignsLoading, setCampaignsLoading] = useState(true);

    const [campaignId, setCampaignId] = useState("");
    const [deliverables, setDeliverables] = useState<string[]>([]);
    const [offeredBudget, setOfferedBudget] = useState("");
    const [timeline, setTimeline] = useState("");
    const [message, setMessage] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setCampaignsLoading(true);
                const data = await collaborationRequestApi.getActiveCampaigns();
                if (!cancelled) setCampaigns(data);
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) setCampaignsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    function toggleDeliverable(item: string) {
        setDeliverables((prev) =>
            prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
        );
    }

    function handleTimelineChange(e: ChangeEvent<HTMLInputElement>) {
        setTimeline(e.target.value);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await collaborationRequestApi.create({
                influencerId,
                campaignId: campaignId || undefined,
                deliverables,
                offeredBudget: offeredBudget ? Number(offeredBudget) : undefined,
                timeline: timeline || undefined,
                message: message.trim() || undefined,
            });
            setSuccess(true);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Couldn't send this request. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="crm-overlay" onClick={onClose}>
            <div className="crm-content" onClick={(e) => e.stopPropagation()}>
                <button className="crm-close" onClick={onClose} aria-label="Close">
                    ×
                </button>

                {success ? (
                    <div className="crm-success">
                        <h2 className="crm-title">Request sent.</h2>
                        <p className="crm-subtitle">
                            {influencerName} will be notified of your collaboration request.
                        </p>
                        <button type="button" className="btn btn-solid" onClick={onClose}>
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <span className="crm-eyebrow">BRAND WORKSPACE</span>
                        <h2 className="crm-title">Request collaboration.</h2>

                        {error && <p className="crm-error">{error}</p>}

                        <form onSubmit={handleSubmit} className="crm-form">
                            <div className="crm-field">
                                <label className="crm-label" htmlFor="campaignId">
                                    Link to campaign
                                </label>
                                <select
                                    id="campaignId"
                                    className="crm-input"
                                    value={campaignId}
                                    onChange={(e) => setCampaignId(e.target.value)}
                                    disabled={campaignsLoading}
                                >
                                    <option value="">No campaign — standalone request</option>
                                    {campaigns.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="crm-field">
                                <span className="crm-label">Deliverables</span>
                                <div className="crm-checkbox-grid">
                                    {DELIVERABLE_OPTIONS.map((item) => (
                                        <label className="crm-checkbox" key={item}>
                                            <input
                                                type="checkbox"
                                                checked={deliverables.includes(item)}
                                                onChange={() => toggleDeliverable(item)}
                                            />
                                            <span>{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="crm-field-row">
                                <div className="crm-field">
                                    <label className="crm-label" htmlFor="offeredBudget">
                                        Offered budget
                                    </label>
                                    <div className="crm-budget-input">
                                        <span>$</span>
                                        <input
                                            id="offeredBudget"
                                            type="number"
                                            min="0"
                                            className="crm-input crm-budget-field"
                                            placeholder="0"
                                            value={offeredBudget}
                                            onChange={(e) => setOfferedBudget(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="crm-field">
                                    <label className="crm-label" htmlFor="timeline">
                                        Timeline
                                    </label>
                                    <input
                                        id="timeline"
                                        type="date"
                                        className="crm-input"
                                        value={timeline}
                                        onChange={handleTimelineChange}
                                    />
                                </div>
                            </div>

                            <div className="crm-field">
                                <label className="crm-label" htmlFor="message">
                                    Message to {influencerName}
                                </label>
                                <textarea
                                    id="message"
                                    className="crm-input crm-textarea"
                                    rows={4}
                                    placeholder="Why is this a fit? What's the creative direction? Any usage rights or exclusivity?"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn btn-solid" disabled={submitting}>
                                {submitting ? "Sending..." : "Send request"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}