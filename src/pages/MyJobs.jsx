import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { closeJob, deleteDraft, myJobs, reopenJob } from '../services/jobs'
import Pagination from '../components/Pagination'
import { EmptyState, ListingSkeletons } from '../components/ListingStates'

const STATUSES = [
  ['all', 'All'],
  ['draft', 'Drafts'],
  ['open', 'Open'],
  ['in_progress', 'In progress'],
  ['completed', 'Completed'],
  ['closed', 'Closed'],
]
const MyJobs = () => {
  const [jobs, setJobs] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [loadError, setLoadError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [pending, setPending] = useState(null)
  const heading = useRef(null)
  useEffect(() => {
    let active = true
    myJobs()
      .then((data) => {
        if (active) setJobs(data.jobs || [])
      })
      .catch(() => {
        if (active) setLoadError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [attempt])
  const handleAction = async (jobId, action) => {
    setMessage('')
    setPending(jobId)
    try {
      if (action === 'delete') {
        await deleteDraft(jobId)
        setJobs((current) => current.filter((job) => job._id !== jobId))
      } else {
        await (action === 'close' ? closeJob(jobId) : reopenJob(jobId))
        setJobs((current) =>
          current.map((job) =>
            job._id === jobId
              ? { ...job, status: action === 'close' ? 'closed' : 'open' }
              : job,
          ),
        )
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setPending(null)
    }
  }
  const filtered =
    selectedStatus === 'all'
      ? jobs
      : jobs.filter((job) => job.status === selectedStatus)
  const totalPages = Math.max(1, Math.ceil(filtered.length / 9))
  const currentPage = Math.min(page, totalPages)
  const visibleJobs = filtered.slice((currentPage - 1) * 9, currentPage * 9)
  const changePage = (next) => {
    setPage(next)
    heading.current?.focus({ preventScroll: true })
    heading.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }
  return (
    <section className="my-jobs-page">
      <header className="my-jobs-header">
        <div>
          <p className="eyebrow">YOUR HIRING WORKSPACE</p>
          <h1>My jobs</h1>
          <p>Keep your opportunities and proposals in one place.</p>
        </div>
        <Link className="primary-link" to="/client/jobs/new">
          Post a job <span aria-hidden="true">+</span>
        </Link>
      </header>
      {message && (
        <p className="error" role="alert">
          {message}
        </p>
      )}
      <div
        className="status-filters"
        role="group"
        aria-label="Filter jobs by status"
      >
        {STATUSES.map(([value, label]) => (
          <button
            type="button"
            key={value}
            aria-pressed={selectedStatus === value}
            onClick={() => {
              setSelectedStatus(value)
              setPage(1)
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="results-heading" ref={heading} tabIndex={-1}>
        <h2>{loading ? 'Loading your jobs…' : `${filtered.length} jobs`}</h2>
      </div>
      {loading ? (
        <ListingSkeletons />
      ) : loadError ? (
        <EmptyState
          title="Your jobs couldn’t be loaded"
          description="Please try again in a moment."
          action="Retry"
          onAction={() => {
            setLoading(true)
            setLoadError(false)
            setAttempt((value) => value + 1)
          }}
        />
      ) : visibleJobs.length === 0 ? (
        <EmptyState
          title={
            jobs.length === 0
              ? 'Your next hire starts here'
              : 'No jobs with this status'
          }
          description={
            jobs.length === 0
              ? 'Post your first job to connect with GCC talent.'
              : 'Choose another status to see your jobs.'
          }
        />
      ) : (
        <div className="marketplace-grid">
          {visibleJobs.map((job) => (
            <article
              className="marketplace-card managed-job-card"
              key={job._id}
            >
              <span className="type-badge">
                {job.status.replaceAll('_', ' ')}
              </span>
              <h2>{job.title}</h2>
              <div className="job-budget">
                <strong>
                  {job.budgetMin} – {job.budgetMax}
                </strong>{' '}
                {job.currency || ''}
              </div>
              <p className="muted">{job.proposalsCount || 0} proposals</p>
              <div className="managed-job-actions">
                <Link to={`/jobs/${job._id}`}>View job ↗</Link>
                {['draft', 'open'].includes(job.status) && (
                  <Link to={`/client/jobs/${job._id}/edit`}>Edit</Link>
                )}
                {job.status === 'open' && (
                  <Link to={`/client/jobs/${job._id}/proposals`}>
                    View proposals
                  </Link>
                )}
                {['draft', 'open', 'closed'].includes(job.status) && (
                  <button
                    className="outline-button"
                    type="button"
                    disabled={pending !== null}
                    onClick={() =>
                      handleAction(
                        job._id,
                        job.status === 'draft'
                          ? 'delete'
                          : job.status === 'open'
                            ? 'close'
                            : 'reopen',
                      )
                    }
                  >
                    {pending === job._id
                      ? 'Updating…'
                      : job.status === 'draft'
                        ? 'Delete draft'
                        : job.status === 'open'
                          ? 'Close job'
                          : 'Reopen job'}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      {!loading && !loadError && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={changePage}
        />
      )}
    </section>
  )
}
export default MyJobs
