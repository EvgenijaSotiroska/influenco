import { useState, type FormEvent } from "react";
import dealApi from "../../api/dealApi";
import type { CreateDealRequest } from "../../api/types/deal";
import "./CreateDealModal.css";

interface CreateDealModalProps {
    prefill: CreateDealRequest;
    influencerName: string;
    onClose: () => void;
    onCreated: () => void;
}

export function CreateDealModal({ prefill, influencerName, onClose, onCreated }: CreateDealModalProps) {
    const [title, setTitle] = useState(prefill.title);
    const [deliverables, setDeliverables] = useState(prefill.deliverables.join(", "));
    const [price, setPrice] = useState(String(prefill.price));
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await dealApi.create({
                ...prefill,
                title,
                deliverables: deliverables
                    .split(",")
                    .map((d) => d.trim())
                    .filter(Boolean),
                price: Number(price),
            });
            onCreated();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Couldn't create this deal. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="cd-overlay" onClick={onClose}>
            <div className="cd-content" onClick={(e) => e.stopPropagation()}>
                <button className="cd-close" onClick={onClose} aria-label="Close">
                    ×
                </button>

                <h2 className="cd-title">Create deal</h2>
                <p className="cd-subtitle">With {influencerName}</p>

                {error && <p className="cd-error">{error}</p>}

                <form onSubmit={handleSubmit} className="cd-form">
                    <div className="cd-field">
                        <label className="cd-label" htmlFor="title">
                            Deal title
                        </label>
                        <input
                            id="title"
                            className="cd-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="cd-field">
                        <label className="cd-label" htmlFor="deliverables">
                            Deliverables (comma separated)
                        </label>
                        <input
                            id="deliverables"
                            className="cd-input"
                            value={deliverables}
                            onChange={(e) => setDeliverables(e.target.value)}
                        />
                    </div>

                    <div className="cd-field">
                        <label className="cd-label" htmlFor="price">
                            Price (USD)
                        </label>
                        <input
                            id="price"
                            type="number"
                            min="0"
                            className="cd-input"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-solid" disabled={submitting}>
                        {submitting ? "Creating..." : "Create deal"}
                    </button>
                </form>
            </div>
        </div>
    );
}