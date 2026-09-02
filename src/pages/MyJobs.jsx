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
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [loadError, setLoadError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [pending, setPending] = useState(null)
  const heading = useRef(null)

  useEffect(() => {
    let active = true

    setLoading(true)
    setLoadError(false)

    myJobs({
      page,
      limit: 9,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
    })
      .then((data) => {
        if (!active) return

        const pages = Math.max(1, Number(data.totalPages) || 1)

        if (page > pages) {
          setPage(pages)
          return
        }

        setJobs(data.jobs || [])
        setTotal(Number(data.total) || 0)
        setTotalPages(pages)
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
  }, [attempt, page, selectedStatus])

  const handleAction = async (jobId, action) => {
    setMessage('')
    setPending(jobId)

    try {
      if (action === 'delete') {
        await deleteDraft(jobId)
      } else {
        await (action === 'close' ? closeJob(jobId) : reopenJob(jobId))
      }

      setLoading(true)
      setAttempt((value) => value + 1)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setPending(null)
    }
  }

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
        <h2>
          {loading
            ? 'Loading your jobs…'
            : `${total} ${total === 1 ? 'job' : 'jobs'}`}
        </h2>
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
      ) : jobs.length === 0 ? (
        <EmptyState
          title={
            selectedStatus === 'all'
              ? 'Your next hire starts here'
              : 'No jobs with this status'
          }
          description={
            selectedStatus === 'all'
              ? 'Post your first job to connect with GCC talent.'
              : 'Choose another status to see your jobs.'
          }
        />
      ) : (
        <div className="marketplace-grid">
          {jobs.map((job) => (
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
          page={page}
          totalPages={totalPages}
          onPageChange={changePage}
        />
      )}
    </section>
  )
}

export default MyJobs
