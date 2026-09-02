import { Link } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import { index as getFreelancers } from '../services/freelancerProfiles'
import FreelancerCard from '../components/FreelancerCard'
import { EmptyState, ListingSkeletons } from '../components/ListingStates'
import './Landing.css'

const Landing = () => {
  const [freelancers, setFreelancers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [attempt, setAttempt] = useState(0)
  const carousel = useRef(null)
  useEffect(() => {
    let active = true
    getFreelancers({ page: 1, limit: 9 })
      .then((data) => {
        if (active)
          setFreelancers(
            (data.profiles || []).filter((profile) => profile?.user),
          )
      })
      .catch(() => {
        if (active)
          setMessage('We couldn’t load freelancers. Please try again.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [attempt])
  const scrollCards = (direction) => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    carousel.current?.scrollBy({
      left: direction * carousel.current.clientWidth * 0.85,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">LOCAL TALENT. SHARED AMBITION.</p>
          <h1>
            Great work starts
            <br />
            with the <span>right people.</span>
          </h1>
          <p className="hero-description">
            Connect with skilled freelancers across the GCC. Find the expertise
            for your next project, or the opportunity for your next chapter.
          </p>
          <div className="hero-actions">
            <Link className="primary-link" to="/freelancers">
              Hire talent <span aria-hidden="true">↗</span>
            </Link>
            <Link className="secondary-link" to="/jobs">
              Find work <span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className="hero-footnote">One marketplace. Six GCC countries.</p>
        </div>
        <div className="hero-workspace">
          <div className="workspace-top">
            <span>GCC TALENT</span>
            <span className="workspace-label">From idea to done</span>
          </div>
          <h2>
            Your next project.
            <br />
            Our region’s talent.
          </h2>
          <div className="workspace-steps">
            <div>
              <span className="workflow-number">01</span>
              <div>
                <strong>Find your expert</strong>
                <p>Explore profiles and skills.</p>
              </div>
              <span aria-hidden="true">↗</span>
            </div>
            <div>
              <span className="workflow-number">02</span>
              <div>
                <strong>Set the milestones</strong>
                <p>Agree on the work, together.</p>
              </div>
              <span aria-hidden="true">→</span>
            </div>
            <div>
              <span className="workflow-number">03</span>
              <div>
                <strong>Bring it to life</strong>
                <p>Collaborate, deliver and approve.</p>
              </div>
              <span aria-hidden="true">✓</span>
            </div>
          </div>
          <div className="workspace-countries">
            Bahrain · Kuwait · Oman · Qatar
            <br />
            Saudi Arabia · United Arab Emirates
          </div>
        </div>
      </section>
      <section className="landing-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE YOUR POSSIBILITIES</p>
            <h2>Expertise for every ambition</h2>
          </div>
        </div>
        <div className="category-grid">
          {[
            'Web Development',
            'Design & Creative',
            'Digital Marketing',
            'Writing & Translation',
          ].map((category, index) => (
            <article key={category}>
              <span className="category-index">0{index + 1}</span>
              <h3>{category}</h3>
            </article>
          ))}
        </div>
      </section>
      <section className="landing-section" aria-labelledby="featured-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MEET YOUR NEXT COLLABORATOR</p>
            <h2 id="featured-heading">Featured freelancers</h2>
          </div>
          <div className="carousel-actions">
            <Link to="/freelancers">
              View all <span aria-hidden="true">↗</span>
            </Link>
            {!loading && freelancers.length > 1 && (
              <>
                <button
                  className="outline-button carousel-arrow"
                  type="button"
                  aria-label="Scroll freelancers left"
                  onClick={() => scrollCards(-1)}
                >
                  ←
                </button>
                <button
                  className="outline-button carousel-arrow"
                  type="button"
                  aria-label="Scroll freelancers right"
                  onClick={() => scrollCards(1)}
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
        {loading ? (
          <ListingSkeletons count={3} />
        ) : message ? (
          <EmptyState
            title="Freelancers are temporarily unavailable"
            description={message}
            action="Try again"
            onAction={() => {
              setMessage('')
              setLoading(true)
              setAttempt((value) => value + 1)
            }}
          />
        ) : freelancers.length === 0 ? (
          <EmptyState
            title="New talent is on the way"
            description="Check back soon, or create your freelancer profile."
          />
        ) : (
          <div
            className="freelancer-carousel"
            ref={carousel}
            tabIndex={0}
            role="region"
            aria-label="Featured freelancer cards"
          >
            <div className="carousel-track">
              {freelancers.map((profile) => (
                <FreelancerCard
                  key={profile._id}
                  profile={profile}
                  headingLevel="h3"
                />
              ))}
            </div>
          </div>
        )}
      </section>
      <section className="landing-section how-it-works">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A CLEAR PATH FORWARD</p>
            <h2>How it works</h2>
          </div>
          <Link to="/sign-up">
            Get started <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="steps-grid">
          {[
            [
              'Create an account',
              'Join as a client or freelancer and tell us what you do.',
            ],
            [
              'Make a connection',
              'Post a job or send a proposal to find your next collaborator.',
            ],
            [
              'Do your best work',
              'Manage milestones, deliver work and celebrate a job well done.',
            ],
          ].map(([title, description], index) => (
            <article key={title}>
              <span className="step-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
export default Landing
