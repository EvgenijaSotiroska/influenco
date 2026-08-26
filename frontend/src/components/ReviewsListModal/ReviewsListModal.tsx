import { useEffect, useState } from "react";
import reviewApi from "../../api/reviewApi";
import type { Review } from "../../api/types/review";
import "./ReviewsListModal.css";

interface ReviewsListModalProps {
    influencerId: string;
    influencerName: string;
    onClose: () => void;
}

export function ReviewsListModal({ influencerId, influencerName, onClose }: ReviewsListModalProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await reviewApi.getForInfluencer(influencerId);
                if (!cancelled) setReviews(data);
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
        <div className="rlm-overlay" onClick={onClose}>
            <div className="rlm-content" onClick={(e) => e.stopPropagation()}>
                <button className="rlm-close" onClick={onClose} aria-label="Close">
                    ×
                </button>

                <h2 className="rlm-title">Reviews</h2>
                <p className="rlm-subtitle">What brands say about {influencerName}</p>

                <div className="rlm-list">
                    {loading && <p className="rlm-status">Loading...</p>}

                    {!loading && reviews.length === 0 && (
                        <p className="rlm-status">No reviews yet.</p>
                    )}

                    {!loading &&
                        reviews.map((review) => (
                            <div className="rlm-card" key={review.id}>
                                <div className="rlm-card-header">
                                    <span className="rlm-card-brand">{review.brandName}</span>
                                    <span className="rlm-card-stars">
                                        {"★".repeat(review.rating)}
                                        <span className="rlm-card-stars-empty">
                                            {"★".repeat(5 - review.rating)}
                                        </span>
                                    </span>
                                </div>
                                {review.comment && <p className="rlm-card-comment">{review.comment}</p>}
                                <p className="rlm-card-date">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
