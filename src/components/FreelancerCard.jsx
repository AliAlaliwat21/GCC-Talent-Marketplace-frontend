import { useState } from 'react'
import { Link } from 'react-router'

const FreelancerCard = ({ profile, headingLevel = 'h2' }) => {
  const [failedAvatar, setFailedAvatar] = useState(null)
  const user = profile.user
  if (!user) return null
  const Heading = headingLevel
  const initials = (user.username || 'Freelancer')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  const skills = (profile.skills || [])
    .filter((skill) => skill?.name)
    .slice(0, 3)
  const rating = Number(user.ratingAvg)
  const location = [user.city, user.country].filter(Boolean).join(', ')
  return (
    <article className="marketplace-card talent-card">
      <div className="talent-card-top">
        <div className="talent-avatar" aria-hidden="true">
          {user.avatarUrl && failedAvatar !== user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              width="56"
              height="56"
              loading="lazy"
              onError={() => setFailedAvatar(user.avatarUrl)}
            />
          ) : (
            initials
          )}
        </div>
        {user.isVerified && <span className="verified-badge">✓ Verified</span>}
      </div>
      <div>
        <Heading>{user.username}</Heading>
        <p className="card-summary">{profile.headline || 'GCC freelancer'}</p>
      </div>
      <p className="card-location">{location || 'Location not provided'}</p>
      <div className="talent-metrics">
        <span>
          {rating > 0 ? (
            <>
              <span className="rating-star" aria-hidden="true">
                ★
              </span>{' '}
              {rating.toFixed(1)}{' '}
              <span className="sr-only">out of 5 stars</span>
            </>
          ) : (
            'No reviews yet'
          )}
        </span>
        <span>
          <strong>{profile.hourlyRate ?? '—'}</strong> {profile.currency || ''}
          <span className="muted"> / hr</span>
        </span>
      </div>
      {skills.length > 0 && (
        <div className="skill-tags">
          {skills.map((skill) => (
            <span key={skill._id || skill.name}>{skill.name}</span>
          ))}
        </div>
      )}
      <div className="card-footer">
        <span
          className={`availability-label ${profile.availability === 'unavailable' ? 'unavailable' : ''}`}
        >
          {{
            full_time: 'Full time',
            part_time: 'Part time',
            unavailable: 'Unavailable',
          }[profile.availability] || 'Availability not set'}
        </span>
        <Link
          to={`/freelancers/${user._id}`}
          aria-label={`View ${user.username}'s profile`}
        >
          View profile <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  )
}
export default FreelancerCard
