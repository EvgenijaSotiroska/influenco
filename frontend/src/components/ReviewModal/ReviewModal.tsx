import { useState, type FormEvent } from "react";
import reviewApi from "../../api/reviewApi";
import "./ReviewModal.css";

interface ReviewModalProps {
    influencerId: string;
    influencerName: string;
    onClose: () => void;
    onSubmitted?: () => void;
}

const RATING_LABELS: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very good",
    5: "Excellent",
};

export function ReviewModal({ influencerId, influencerName, onClose, onSubmitted }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (rating < 1) {
            setError("Please select a rating.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await reviewApi.create(influencerId, {
                rating,
                comment: comment.trim() || undefined,
            });
            setSuccess(true);
            onSubmitted?.();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Couldn't submit this review. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    }

    const displayedRating = hoverRating || rating;

    return (
        <div className="rvm-overlay" onClick={onClose}>
            <div className="rvm-content" onClick={(e) => e.stopPropagation()}>
                <button className="rvm-close" onClick={onClose} aria-label="Close">
                    ×
                </button>

                {success ? (
                    <div className="rvm-success">
                        <h2 className="rvm-title">Review submitted.</h2>
                        <p className="rvm-subtitle">
                            Thanks for rating your collaboration with {influencerName}.
                        </p>
                        <button type="button" className="btn btn-solid" onClick={onClose}>
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <span className="rvm-eyebrow">BRAND WORKSPACE</span>
                        <h2 className="rvm-title">Leave a review.</h2>
                        <p className="rvm-subtitle">Rate your experience working with {influencerName}.</p>

                        {error && <p className="rvm-error">{error}</p>}

                        <form onSubmit={handleSubmit} className="rvm-form">
                            <div className="rvm-field">
                                <span className="rvm-label">Rating</span>
                                <div className="rvm-stars" onMouseLeave={() => setHoverRating(0)}>
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            className={`rvm-star ${value <= displayedRating ? "rvm-star-active" : ""}`}
                                            onMouseEnter={() => setHoverRating(value)}
                                            onClick={() => setRating(value)}
                                            aria-label={`${value} star${value > 1 ? "s" : ""}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                {displayedRating > 0 && (
                                    <span className="rvm-rating-label">{RATING_LABELS[displayedRating]}</span>
                                )}
                            </div>

                            <div className="rvm-field">
                                <label className="rvm-label" htmlFor="comment">
                                    Comment (optional)
                                </label>
                                <textarea
                                    id="comment"
                                    className="rvm-input rvm-textarea"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="How was the collaboration?"
                                    maxLength={1000}
                                />
                            </div>

                            <button type="submit" className="btn btn-solid" disabled={submitting}>
                                {submitting ? "Submitting..." : "Submit review"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
