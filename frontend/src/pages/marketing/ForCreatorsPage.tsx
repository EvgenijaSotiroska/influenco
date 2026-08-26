import { Link } from "react-router-dom";
import "./ForBrandsPage.css";

export function ForCreatorsPage() {
    return (
        <div className="marketing-page">
            <section className="mp-hero">
                <p className="mp-eyebrow">For creators</p>
                <h1 className="mp-headline">
                    The <em>media kit</em> brands actually trust.
                </h1>
                <p className="mp-sub">
                    Stop sending screenshots and stale PDFs. Publish one living
                    profile with real stats, apply to campaigns directly, and turn
                    every completed deal into proof for the next one.
                </p>
                <div className="mp-ctas">
                    <Link to="/register" className="btn btn-solid">
                        Get started as a creator ↗
                    </Link>
                    <Link to="/campaigns" className="btn btn-outline">
                        Browse campaigns
                    </Link>
                </div>
            </section>

            <section className="mp-features">
                <div className="mp-features-intro">
                    <p className="mp-eyebrow">Why Influenco</p>
                    <h2 className="mp-section-heading">Everything in one profile.</h2>
                </div>

                <div className="mp-features-grid">
                    <div className="mp-feature">
                        <span className="mp-feature-index">01</span>
                        <h3 className="mp-feature-title">One shareable kit</h3>
                        <p className="mp-feature-desc">
                            Bio, niches, stats, and portfolio — a single link you can
                            drop anywhere instead of a DM full of screenshots.
                        </p>
                    </div>
                    <div className="mp-feature">
                        <span className="mp-feature-index">02</span>
                        <h3 className="mp-feature-title">Get discovered</h3>
                        <p className="mp-feature-desc">
                            Brands filter by niche, platform, and follower range — so
                            the right ones find you.
                        </p>
                    </div>
                    <div className="mp-feature">
                        <span className="mp-feature-index">03</span>
                        <h3 className="mp-feature-title">Apply with one click</h3>
                        <p className="mp-feature-desc">
                            Browse open campaigns and apply directly — no more
                            chasing brands over email.
                        </p>
                    </div>
                    <div className="mp-feature">
                        <span className="mp-feature-index">04</span>
                        <h3 className="mp-feature-title">Build credibility</h3>
                        <p className="mp-feature-desc">
                            Every completed deal adds to your track record, making
                            your next application stronger.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mp-steps">
                <div className="mp-features-intro">
                    <p className="mp-eyebrow">How it works</p>
                    <h2 className="mp-section-heading">From profile to paid deal.</h2>
                </div>
                <ol className="mp-steps-list">
                    <li>
                        <span className="mp-step-num">1</span>
                        <div>
                            <h3 className="mp-feature-title">Publish your kit</h3>
                            <p className="mp-feature-desc">
                                Add your bio, niches, stats, and portfolio in
                                minutes.
                            </p>
                        </div>
                    </li>
                    <li>
                        <span className="mp-step-num">2</span>
                        <div>
                            <h3 className="mp-feature-title">Browse campaigns</h3>
                            <p className="mp-feature-desc">
                                Find open briefs from brands looking for creators
                                like you.
                            </p>
                        </div>
                    </li>
                    <li>
                        <span className="mp-step-num">3</span>
                        <div>
                            <h3 className="mp-feature-title">Apply and get accepted</h3>
                            <p className="mp-feature-desc">
                                Submit your application and wait for the brand to
                                review it.
                            </p>
                        </div>
                    </li>
                    <li>
                        <span className="mp-step-num">4</span>
                        <div>
                            <h3 className="mp-feature-title">Collaborate and grow</h3>
                            <p className="mp-feature-desc">
                                Complete the deal and add it to your profile as
                                proof for your next brand.
                            </p>
                        </div>
                    </li>
                </ol>
            </section>

            <section className="mp-cta">
                <h2 className="mp-section-heading">Ready to build your kit?</h2>
                <Link to="/register" className="btn btn-solid">
                    Get started as a creator ↗
                </Link>
            </section>
        </div>
    );
}
