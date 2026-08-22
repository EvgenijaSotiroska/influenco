import { useEffect, useState } from "react";
import dealApi from "../../api/dealApi";
import type { Deal } from "../../api/types/deal";
import "./BrandDealsPage.css";

export function BrandDealsPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await dealApi.getMyDeals();
                if (!cancelled) setDeals(data);
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
        <div className="bd-page">
            <div className="bd-header">
                <h1 className="bd-title">Deals.</h1>
                <p className="bd-subtitle">
                    Every collaboration you've finalized.
                </p>
            </div>

            <div className="bd-list">
                {loading && <p className="bd-status">Loading...</p>}

                {!loading && deals.length === 0 && (
                    <p className="bd-status">No deals yet.</p>
                )}

                {!loading &&
                    deals.map((deal) => (
                        <div className="bd-card" key={deal.id}>
                            <div className="bd-card-header">
                                <span className="bd-card-influencer">
                                    {deal.influencerName}
                                </span>

                                <span className="bd-card-price">
                                    ${deal.price.toLocaleString()}
                                </span>
                            </div>

                            <p className="bd-card-title">{deal.title}</p>

                            {deal.deliverables.length > 0 && (
                                <div className="bd-card-tags">
                                    {deal.deliverables.map((d) => (
                                        <span className="bd-tag" key={d}>
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Verification */}
                            <div className="bd-verification">
                                {!deal.isVerified && (
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={async () => {
                                            await dealApi.verify(deal.id);

                                            setDeals((prev) =>
                                                prev.map((d) =>
                                                    d.id === deal.id
                                                        ? {
                                                            ...d,
                                                            isVerified: true,
                                                        }
                                                        : d
                                                )
                                            );
                                        }}
                                    >
                                        Verify deal
                                    </button>
                                )}

                                {deal.isVerified && (
                                    <span className="bd-verified-badge">
                                        ✓ Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}