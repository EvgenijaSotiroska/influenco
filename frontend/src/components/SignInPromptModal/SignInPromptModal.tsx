import { useNavigate } from "react-router-dom";
import "./SignInPromptModal.css";

interface SignInPromptModalProps {
    onClose: () => void;
}

export function SignInPromptModal({ onClose }: SignInPromptModalProps) {
    const navigate = useNavigate();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    ×
                </button>
                <h2 className="modal-title">Want to see more?</h2>
                <p className="modal-subtitle">
                    Sign in to view full creator profiles, stats, and contact details.
                </p>
                <div className="modal-actions">
                    <button
                        className="btn btn-solid"
                        onClick={() => navigate("/login")}
                    >
                        Sign in
                    </button>
                    <button className="modal-dismiss" onClick={onClose}>
                        Not now
                    </button>
                </div>
            </div>
        </div>
    );
}