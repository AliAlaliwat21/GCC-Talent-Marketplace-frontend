import { Link } from 'react-router'
const JobCard = ({ job }) => {
  const skills = (job.skills || []).filter((skill) => skill?.name).slice(0, 3)
  const date = job.createdAt ? new Date(job.createdAt) : null
  return (
    <article className="marketplace-card job-card">
      <div className="job-card-top">
        <span className="type-badge">
          {job.budgetType === 'hourly' ? 'Hourly' : 'Fixed price'}
        </span>
        {job.category?.name && (
          <span className="card-category">{job.category.name}</span>
        )}
      </div>
      <h2>
        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
      </h2>
      <p className="card-summary">{job.description}</p>
      <div className="job-budget">
        <strong>
          {job.budgetMin} – {job.budgetMax}
        </strong>{' '}
        {job.currency || ''}
      </div>
      {job.experienceLevel && (
        <p className="card-experience">
          {job.experienceLevel.replaceAll('_', ' ')} level
        </p>
      )}
      {skills.length > 0 && (
        <div className="skill-tags">
          {skills.map((skill) => (
            <span key={skill._id || skill.name}>{skill.name}</span>
          ))}
        </div>
      )}
      <div className="card-footer">
        <span className="muted">
          {date && !Number.isNaN(date.getTime()) ? (
            <time dateTime={date.toISOString()}>
              {date.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          ) : (
            'Open opportunity'
          )}
        </span>
        <Link to={`/jobs/${job._id}`} aria-label={`View job: ${job.title}`}>
          View job <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  )
}
export default JobCard
