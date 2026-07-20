import { Link } from "react-router-dom";
import "./HomePage.css";

export function HomePage() {
    return (
        <div className="home">
            <section className="hero">
                <div className="masthead-row">
                    <span className="masthead-tag">Discover. Connect. Collaborate.</span>
                    <span className="masthead-tag masthead-tag-right">Est. 2026 · Skopje · N. Macedonia</span>
                </div>

                <div className="hero-grid">
                    <div className="hero-copy">
                        <p className="eyebrow">A portfolio &amp; marketplace for creators</p>
                        <h1 className="hero-headline">
                            The credible <em>media kit</em> for modern influencers.
                        </h1>
                        <p className="hero-sub">
                            Screenshots, DMs, and stale PDFs are not a media kit. Influenco is the
                            living portfolio brands actually trust — verified stats, real deals,
                            one shareable link.
                        </p>
                        <div className="hero-ctas">
                            <Link to="/register" className="btn btn-solid">
                                I'm a creator — start free ↗
                            </Link>
                            <Link to="/register" className="btn btn-outline">
                                I'm a brand — discover talent ↗
                            </Link>
                        </div>
                    </div>

                    <div className="hero-media">
                        <img
                            className="hero-photo"
                            src="https://i.pinimg.com/736x/42/a2/2c/42a22c4e3648cbde13c17c609cfe6cee.jpg"
                            alt="Portrait of a featured creator on Influenco"
                        />
                        <div className="hero-caption">
                            <span className="hero-caption-label">Cover creator</span>
                            <span className="hero-caption-name">Ava Loren</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats">
                <div className="stat">
                    <span className="stat-number">12,400+</span>
                    <span className="stat-label">Verified creators</span>
                </div>
                <div className="stat">
                    <span className="stat-number">3,200+</span>
                    <span className="stat-label">Brands &amp; agencies</span>
                </div>
                <div className="stat">
                    <span className="stat-number">$48M</span>
                    <span className="stat-label">In collaborations booked</span>
                </div>
                <div className="stat">
                    <span className="stat-number">4.9/5</span>
                    <span className="stat-label">Average deal rating</span>
                </div>
            </section>

            <section className="how-it-works">
                <div className="how-intro">
                    <p className="eyebrow">Feature 01</p>
                    <h2 className="section-heading">How Influenco works.</h2>
                    <p className="how-sub">
                        A single credible surface for creators, a structured pipeline for
                        brands. No more chasing screenshots and negotiating over DMs.
                    </p>
                </div>

                <div className="how-grid">
                    <div className="how-item">
                        <span className="how-index">01</span>
                        <h3 className="how-title">Publish your kit</h3>
                        <p className="how-desc">
                            Bio, niches, per-platform stats and engagement rate, portfolio,
                            rate card. Shareable at influenco.co/@you.
                        </p>
                    </div>
                    <div className="how-item">
                        <span className="how-index">02</span>
                        <h3 className="how-title">Get discovered</h3>
                        <p className="how-desc">
                            Brands filter by niche, platform, follower range, and engagement
                            rate — then add you to shortlists.
                        </p>
                    </div>
                    <div className="how-item">
                        <span className="how-index">03</span>
                        <h3 className="how-title">Apply or get invited</h3>
                        <p className="how-desc">
                            Structured campaign briefs replace open-ended DMs. Applied →
                            accepted → completed.
                        </p>
                    </div>
                    <div className="how-item">
                        <span className="how-index">04</span>
                        <h3 className="how-title">Build credibility</h3>
                        <p className="how-desc">
                            Every completed deal, once verified by the brand, becomes a
                            permanent proof point on your kit.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}