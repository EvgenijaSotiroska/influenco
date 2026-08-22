import { useEffect, useState } from "react";
import dealApi from "../../api/dealApi";
import type { Deal } from "../../api/types/deal";
import "./DealsModal.css";

interface DealsModalProps {
    influencerId: string;
    influencerName: string;
    onClose: () => void;
}

export function DealsModal({ influencerId, influencerName, onClose }: DealsModalProps) {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await dealApi.getForInfluencer(influencerId);
                if (!cancelled) setDeals(data);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [influencerId]);

    return (
        <div className="dm-overlay" onClick={onClose}>
            <div className="dm-content" onClick={(e) => e.stopPropagation()}>
                <button className="dm-close" onClick={onClose} aria-label="Close">
                    ×
                </button>

                <h2 className="dm-title">Completed deals</h2>
                <p className="dm-subtitle">{influencerName}'s deal history</p>

                <div className="dm-list">
                    {loading && <p className="dm-status">Loading...</p>}

                    {!loading && deals.length === 0 && (
                        <p className="dm-status">No deals yet.</p>
                    )}

                    {!loading &&
                        deals.map((deal) => (
                            <div className="dm-card" key={deal.id}>
                                <div className="dm-card-header">
                                    <span className="dm-card-brand">{deal.brandName}</span>
                                    <span className="dm-card-price">
                                        ${deal.price.toLocaleString()}
                                    </span>
                                </div>
                                <p className="dm-card-title">{deal.title}</p>
                                {deal.deliverables.length > 0 && (
                                    <div className="dm-card-tags">
                                        {deal.deliverables.map((d) => (
                                            <span className="dm-tag" key={d}>
                                                {d}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="dm-card-footer">
                                    {deal.isVerified ? (
                                        <span className="dm-verified-badge">✓ Verified by brand</span>
                                    ) : (
                                        <span className="dm-pending-badge">Awaiting verification</span>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}