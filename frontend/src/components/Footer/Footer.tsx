import { Link } from "react-router-dom";
import "./Footer.css";

export function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <h2 className="footer-logo">Influenco.</h2>

                    <p className="footer-description">
                        The credible media kit for modern influencers, and the
                        structured way brands find them.
                    </p>
                </div>

                <div className="footer-links">
                    <div className="footer-column">
                        <span className="footer-heading">Creators</span>

                        <Link to="/register">Create profile</Link>
                        <a href="#how-it-works">How it works</a>
                        <Link to="/">Featured creators</Link>
                    </div>

                    <div className="footer-column">
                        <span className="footer-heading">Brands</span>

                        <Link to="/register">Discover talent</Link>
                        <Link to="/register">Post a campaign</Link>
                        <Link to="/register">Create account</Link>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© 2026 Influenco. All rights reserved.</span>

                <div className="footer-bottom-links">
                    <Link to="/">Privacy</Link>
                    <Link to="/">Terms</Link>
                    <Link to="/">Contact</Link>
                </div>
            </div>
        </footer>
    );
}
