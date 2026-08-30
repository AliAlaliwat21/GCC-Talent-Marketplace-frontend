import { Link } from "react-router"
import "./Landing.css"

const Landing = () => {
    return (
    <div className="landing-page">
        <section className="hero">
            <p className="hero-label">GCC Talent Marketplace</p>
            <h1>Connect with skilled talent across the GCC</h1>
            
            <p className="hero-description"> Clients can post jobs and hire trusted freelancers. Freelancers can find opportunities and grow their careers</p>
            
            <div className="hero-actions">
                <Link className="primary-link" to="/sign-up"> Hire Talent </Link>
                <Link className="secondary-link" to="/sign-up"> Find Work </Link> </div>
                </section>
                
                <section className="landing-section">
                    <h2>Popular Categories</h2>
                    
                    <div className="category-grid">
                        <article>Web Development</article>
                        <article>Design & Creative</article>
                        <article>Digital Marketing</article>
                        <article>Writing & Translation</article>
                        </div>
                        </section>
                        
                        <section className="landing-section">
                            <h2>How It Works</h2>
                            
                            <div className="steps-grid">
                                <article>
                                    <h3>1. Create an Account</h3>
                                    <p>Join as a client or freelancer</p>
                                    </article>
                                    
                                    <article>
                                        <h3>2. Connect</h3>
                                        <p>Post a job or submit a proposal</p>
                                        </article>
                                        
                                        <article>
                                            <h3>3. Complete the Work</h3>
                                            <p>Manage milestones and approve completed work.</p>
                                            </article>
                                            </div>
                                            </section>
                                            </div>
                                            )
                                        }
                                        export default Landing