import { Link } from "react-router-dom";
import "./ForBrandsPage.css";

export function ForBrandsPage() {
    return (
        <div className="marketing-page">
            <section className="mp-hero">
                <p className="mp-eyebrow">For brands</p>
                <h1 className="mp-headline">
                    Find creators you can actually <em>trust</em>.
                </h1>
                <p className="mp-sub">
                    Skip the screenshots and the DM negotiations. Discover verified
                    creators, launch structured campaigns, and track every deal from
                    application to completion — all in one place.
                </p>
                <div className="mp-ctas">
                    <Link to="/register" className="btn btn-solid">
                        Get started as a brand ↗
                    </Link>
                    <Link to="/discover" className="btn btn-outline">
                        Browse creators
                    </Link>
                </div>
            </section>

            <section className="mp-features">
                <div className="mp-features-intro">
                    <p className="mp-eyebrow">Why Influenco</p>
                    <h2 className="mp-section-heading">Built for real campaigns.</h2>
                </div>

                <div className="mp-features-grid">
                    <div className="mp-feature">
                        <span className="mp-feature-index">01</span>
                        <h3 className="mp-feature-title">Verified creator profiles</h3>
                        <p className="mp-feature-desc">
                            Every creator kit shows real stats, niches, and platforms —
                            not a screenshot someone could have edited.
                        </p>
                    </div>
                    <div className="mp-feature">
                        <span className="mp-feature-index">02</span>
                        <h3 className="mp-feature-title">Powerful discovery</h3>
                        <p className="mp-feature-desc">
                            Filter by location, follower range, and category to build a
                            shortlist in minutes, not weeks.
                        </p>
                    </div>
                    <div className="mp-feature">
                        <span className="mp-feature-index">03</span>
                        <h3 className="mp-feature-title">Structured campaigns</h3>
                        <p className="mp-feature-desc">
                            Post a campaign brief once, review every applicant side by
                            side, and pick the right fit with confidence.
                        </p>
                    </div>
                    <div className="mp-feature">
                        <span className="mp-feature-index">04</span>
                        <h3 className="mp-feature-title">Deals you can track</h3>
                        <p className="mp-feature-desc">
                            Once you accept a creator, the collaboration becomes a deal
                            you can follow from kickoff to completion.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mp-steps">
                <div className="mp-features-intro">
                    <p className="mp-eyebrow">How it works</p>
                    <h2 className="mp-section-heading">From brief to deal in four steps.</h2>
                </div>
                <ol className="mp-steps-list">
                    <li>
                        <span className="mp-step-num">1</span>
                        <div>
                            <h3 className="mp-feature-title">Create your campaign</h3>
                            <p className="mp-feature-desc">
                                Describe the collaboration, budget, and the kind of
                                creator you're looking for.
                            </p>
                        </div>
                    </li>
                    <li>
                        <span className="mp-step-num">2</span>
                        <div>
                            <h3 className="mp-feature-title">Review applicants</h3>
                            <p className="mp-feature-desc">
                                See who applied, check their kits, and shortlist your
                                favorites.
                            </p>
                        </div>
                    </li>
                    <li>
                        <span className="mp-step-num">3</span>
                        <div>
                            <h3 className="mp-feature-title">Accept and collaborate</h3>
                            <p className="mp-feature-desc">
                                Turn an accepted application into a deal and work
                                together directly.
                            </p>
                        </div>
                    </li>
                    <li>
                        <span className="mp-step-num">4</span>
                        <div>
                            <h3 className="mp-feature-title">Close it out</h3>
                            <p className="mp-feature-desc">
                                Mark the deal complete and build a track record for
                                future campaigns.
                            </p>
                        </div>
                    </li>
                </ol>
            </section>

            <section className="mp-cta">
                <h2 className="mp-section-heading">Ready to find your next creator?</h2>
                <Link to="/register" className="btn btn-solid">
                    Get started as a brand ↗
                </Link>
            </section>
        </div>
    );
}
