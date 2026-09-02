import { useEffect, useRef, useState } from 'react'
import { index as getJobs } from '../services/jobs'
import { index as getFreelancers } from '../services/freelancerProfiles'
import { index as getCategories } from '../services/categories'
import { index as getSkills } from '../services/skills'
import JobCard from './JobCard'
import FreelancerCard from './FreelancerCard'
import Pagination from './Pagination'
import { EmptyState, ListingSkeletons } from './ListingStates'

const JOB_FILTERS = {
  search: '',
  category: '',
  skills: [],
  budgetMin: '',
  budgetMax: '',
  budgetType: '',
  experienceLevel: '',
  daysAgo: '',
  sort: 'newest',
  page: 1,
  limit: 9,
}
const TALENT_FILTERS = {
  q: '',
  category: '',
  skill: '',
  minRate: '',
  maxRate: '',
  minRating: '',
  country: '',
  city: '',
  availability: '',
  sort: 'newest',
  page: 1,
  limit: 9,
}
const COUNTRIES = [
  'Bahrain',
  'Kuwait',
  'Oman',
  'Qatar',
  'Saudi Arabia',
  'United Arab Emirates',
]
const LABELS = {
  search: 'Search',
  q: 'Search',
  category: 'Category',
  skills: 'Skill',
  skill: 'Skill',
  budgetMin: 'Min budget',
  budgetMax: 'Max budget',
  budgetType: 'Budget',
  experienceLevel: 'Experience',
  daysAgo: 'Last days',
  minRate: 'Min rate',
  maxRate: 'Max rate',
  minRating: 'Min rating',
  country: 'Country',
  city: 'City',
  availability: 'Availability',
}

const SelectField = ({
  name,
  label,
  value,
  onChange,
  options,
  emptyLabel = 'Any',
}) => (
  <div className="filter-field">
    <label htmlFor={`filter-${name}`}>{label}</label>
    <select id={`filter-${name}`} name={name} value={value} onChange={onChange}>
      <option value="">{emptyLabel}</option>
      {options.map(([value, text]) => (
        <option key={value} value={value}>
          {text}
        </option>
      ))}
    </select>
  </div>
)
const NumberField = ({ name, label, value, onChange }) => (
  <div className="filter-field">
    <label htmlFor={`filter-${name}`}>{label}</label>
    <input
      id={`filter-${name}`}
      name={name}
      type="number"
      min="0"
      step="any"
      value={value}
      onChange={onChange}
      placeholder="Any"
    />
  </div>
)

const MarketplaceDirectory = ({ type }) => {
  const isJobs = type === 'jobs'
  const defaults = isJobs ? JOB_FILTERS : TALENT_FILTERS
  const searchKey = isJobs ? 'search' : 'q'
  const [draft, setDraft] = useState(defaults)
  const [applied, setApplied] = useState(defaults)
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [skills, setSkills] = useState([])
  const [total, setTotal] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [optionsError, setOptionsError] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const heading = useRef(null)

  useEffect(() => {
    let active = true
    Promise.all([getCategories(), getSkills()])
      .then(([categoryData, skillData]) => {
        if (!active) return
        setCategories(categoryData)
        setSkills(skillData)
        setOptionsError(false)
      })
      .catch(() => {
        if (active) setOptionsError(true)
      })
    return () => {
      active = false
    }
  }, [attempt])

  useEffect(() => {
    let active = true
    const fetchItems = isJobs ? getJobs : getFreelancers
    fetchItems(applied)
      .then((data) => {
        if (!active) return
        const records = isJobs
          ? data.jobs || []
          : (data.profiles || []).filter((profile) => profile?.user)
        const count = isJobs ? data.total : data.totalProfiles
        const pages = isJobs
          ? (data.totalPages ??
            Math.ceil((count ?? records.length) / applied.limit))
          : Math.ceil(
              (count ?? records.length) / (Number(data.limit) || applied.limit),
            )
        setItems(records)
        setTotal(Number.isFinite(Number(count)) ? Number(count) : null)
        setTotalPages(Math.max(1, Number(pages) || 1))
      })
      .catch(() => {
        if (active)
          setError(
            `We couldn’t load ${isJobs ? 'jobs' : 'freelancers'}. Please try again.`,
          )
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [applied, isJobs, attempt])

  const applyFilters = (next) => {
    setLoading(true)
    setError('')
    setValidationError('')
    setApplied({ ...next, limit: 9 })
  }
  const handleChange = (event) =>
    setDraft({ ...draft, [event.target.name]: event.target.value })
  const handleSubmit = (event) => {
    event.preventDefault()
    const min = isJobs ? draft.budgetMin : draft.minRate
    const max = isJobs ? draft.budgetMax : draft.maxRate
    if (min !== '' && max !== '' && Number(min) > Number(max)) {
      setValidationError(
        'The maximum must be greater than or equal to the minimum.',
      )
      return
    }
    applyFilters({ ...draft, page: 1 })
  }
  const clearFilters = () => {
    setDraft(defaults)
    applyFilters(defaults)
  }
  const handleSort = (event) => {
    setDraft({ ...draft, sort: event.target.value })
    applyFilters({ ...applied, sort: event.target.value, page: 1 })
  }
  const changePage = (page) => {
    if (page === applied.page || page < 1 || page > totalPages) return
    applyFilters({ ...applied, page })
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    heading.current?.focus({ preventScroll: true })
    heading.current?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }
  const activeFilters = Object.entries(applied).filter(
    ([key, value]) =>
      !['sort', 'page', 'limit'].includes(key) &&
      (Array.isArray(value) ? value.length > 0 : value !== ''),
  )
  const chipLabel = (key, value) => {
    if (key === 'category')
      return (
        categories.find((item) => item._id === value)?.name ||
        'Selected category'
      )
    if (key === 'skill')
      return skills.find((item) => item._id === value)?.name || 'Selected skill'
    if (key === 'skills')
      return `${value.length} selected skill${value.length === 1 ? '' : 's'}`
    return `${LABELS[key]}: ${String(value).replaceAll('_', ' ')}`
  }
  const removeFilter = (key) => {
    setDraft({ ...draft, [key]: defaults[key] })
    applyFilters({ ...applied, [key]: defaults[key], page: 1 })
  }
  const sortOptions = isJobs
    ? [
        ['newest', 'Newest first'],
        ['oldest', 'Oldest first'],
        ['budget_low', 'Budget: low to high'],
        ['budget_high', 'Budget: high to low'],
      ]
    : [
        ['newest', 'Newest first'],
        ['rate_low', 'Rate: low to high'],
        ['rate_high', 'Rate: high to low'],
      ]

  return (
    <section className="directory-page">
      <header>
        <p className="eyebrow">
          {isJobs ? 'YOUR NEXT CHAPTER' : 'EXPERTISE ACROSS THE GCC'}
        </p>
        <h1>
          {isJobs
            ? 'Find your next opportunity'
            : 'Find your next collaborator'}
        </h1>
        <p>
          {isJobs
            ? 'Explore projects that match your skills and ambitions.'
            : 'Discover the people who can bring your ideas to life.'}
        </p>
      </header>
      <form className="directory-search" onSubmit={handleSubmit}>
        <div className="search-toolbar">
          <div className="search-input">
            <label className="sr-only" htmlFor="directory-query">
              {isJobs ? 'Search jobs' : 'Search freelancers'}
            </label>
            <span aria-hidden="true">⌕</span>
            <input
              id="directory-query"
              name={searchKey}
              value={draft[searchKey]}
              onChange={handleChange}
              placeholder={
                isJobs
                  ? 'Search job titles or descriptions…'
                  : 'Search names, headlines or bios…'
              }
            />
            <button type="submit">Search</button>
          </div>
          <div className="sort-control">
            <label htmlFor="directory-sort">Sort by</label>
            <select
              id="directory-sort"
              value={draft.sort}
              onChange={handleSort}
            >
              {sortOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <details className="advanced-filters">
          <summary>
            Filters{' '}
            <span>
              {activeFilters.length > 0
                ? `${activeFilters.length} applied`
                : 'Refine your search'}
            </span>
          </summary>
          {optionsError && (
            <p className="filter-notice" role="status">
              Category and skill filters are temporarily unavailable. You can
              still search using the other filters.
            </p>
          )}
          <div className="filter-fields-grid">
            <SelectField
              name="category"
              label="Category"
              value={draft.category}
              onChange={handleChange}
              emptyLabel="All categories"
              options={categories.map((item) => [item._id, item.name])}
            />
            {!isJobs && (
              <SelectField
                name="skill"
                label="Skill"
                value={draft.skill}
                onChange={handleChange}
                emptyLabel="All skills"
                options={skills.map((item) => [item._id, item.name])}
              />
            )}
            <NumberField
              name={isJobs ? 'budgetMin' : 'minRate'}
              label={isJobs ? 'Minimum budget' : 'Minimum hourly rate'}
              value={isJobs ? draft.budgetMin : draft.minRate}
              onChange={handleChange}
            />
            <NumberField
              name={isJobs ? 'budgetMax' : 'maxRate'}
              label={isJobs ? 'Maximum budget' : 'Maximum hourly rate'}
              value={isJobs ? draft.budgetMax : draft.maxRate}
              onChange={handleChange}
            />
            {isJobs ? (
              <>
                <SelectField
                  name="budgetType"
                  label="Budget type"
                  value={draft.budgetType}
                  onChange={handleChange}
                  options={[
                    ['fixed', 'Fixed price'],
                    ['hourly', 'Hourly'],
                  ]}
                />
                <SelectField
                  name="experienceLevel"
                  label="Experience level"
                  value={draft.experienceLevel}
                  onChange={handleChange}
                  options={[
                    ['entry', 'Entry'],
                    ['intermediate', 'Intermediate'],
                    ['expert', 'Expert'],
                  ]}
                />
                <SelectField
                  name="daysAgo"
                  label="Date posted"
                  value={draft.daysAgo}
                  onChange={handleChange}
                  emptyLabel="Any time"
                  options={[
                    ['1', 'Last 24 hours'],
                    ['7', 'Last 7 days'],
                    ['30', 'Last 30 days'],
                  ]}
                />
                {skills.length > 0 && (
                  <fieldset className="skill-filter">
                    <legend>Skills</legend>
                    <div className="skill-checkboxes">
                      {skills.map((skill) => (
                        <label key={skill._id}>
                          <input
                            type="checkbox"
                            checked={draft.skills.includes(skill._id)}
                            onChange={(event) =>
                              setDraft({
                                ...draft,
                                skills: event.target.checked
                                  ? [...draft.skills, skill._id]
                                  : draft.skills.filter(
                                      (id) => id !== skill._id,
                                    ),
                              })
                            }
                          />
                          {skill.name}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
              </>
            ) : (
              <>
                <SelectField
                  name="minRating"
                  label="Minimum rating"
                  value={draft.minRating}
                  onChange={handleChange}
                  options={[
                    ['4', '4 stars and up'],
                    ['3', '3 stars and up'],
                    ['2', '2 stars and up'],
                    ['1', '1 star and up'],
                  ]}
                />
                <SelectField
                  name="country"
                  label="Country"
                  value={draft.country}
                  onChange={handleChange}
                  emptyLabel="All countries"
                  options={COUNTRIES.map((country) => [country, country])}
                />
                <div className="filter-field">
                  <label htmlFor="filter-city">City</label>
                  <input
                    id="filter-city"
                    name="city"
                    value={draft.city}
                    onChange={handleChange}
                    placeholder="Any city"
                  />
                </div>
                <SelectField
                  name="availability"
                  label="Availability"
                  value={draft.availability}
                  onChange={handleChange}
                  options={[
                    ['full_time', 'Full time'],
                    ['part_time', 'Part time'],
                    ['unavailable', 'Unavailable'],
                  ]}
                />
              </>
            )}
          </div>
          <div className="filter-actions">
            <button type="submit">Apply filters</button>
            <button
              className="outline-button"
              type="button"
              onClick={clearFilters}
            >
              Clear all
            </button>
          </div>
        </details>
        {validationError && (
          <p className="error" role="alert">
            {validationError}
          </p>
        )}
      </form>
      {activeFilters.length > 0 && (
        <div className="active-filters" aria-label="Applied filters">
          {activeFilters.map(([key, value]) => (
            <button
              type="button"
              key={key}
              onClick={() => removeFilter(key)}
              aria-label={`Remove ${chipLabel(key, value)} filter`}
            >
              {chipLabel(key, value)} <span aria-hidden="true">×</span>
            </button>
          ))}
          <button
            className="clear-filter-link"
            type="button"
            onClick={clearFilters}
          >
            Clear all
          </button>
        </div>
      )}
      <div className="results-heading" ref={heading} tabIndex={-1}>
        <h2>
          {loading
            ? 'Finding matches…'
            : error
              ? 'Results unavailable'
              : `${total ?? items.length} ${isJobs ? 'opportunities' : 'freelancers'}${total === null ? ' on this page' : ''}`}
        </h2>
        <span>
          {!loading && !error && items.length > 0
            ? `Page ${applied.page} of ${totalPages}`
            : ''}
        </span>
      </div>
      <div aria-busy={loading}>
        {loading ? (
          <ListingSkeletons />
        ) : error ? (
          <EmptyState
            title="Let’s try that again"
            description={error}
            action="Retry"
            onAction={() => {
              setLoading(true)
              setError('')
              setAttempt((value) => value + 1)
            }}
          />
        ) : items.length === 0 ? (
          <EmptyState
            title={`No ${isJobs ? 'jobs' : 'freelancers'} match your search`}
            description="Try a different search or clear your filters to see more results."
            action="Clear filters"
            onAction={clearFilters}
          />
        ) : (
          <div className="marketplace-grid">
            {items.map((item) =>
              isJobs ? (
                <JobCard key={item._id} job={item} />
              ) : (
                <FreelancerCard key={item._id} profile={item} />
              ),
            )}
          </div>
        )}
      </div>
      {!error && (
        <Pagination
          page={applied.page}
          totalPages={totalPages}
          disabled={loading}
          onPageChange={changePage}
        />
      )}
    </section>
  )
}
export default MarketplaceDirectory
