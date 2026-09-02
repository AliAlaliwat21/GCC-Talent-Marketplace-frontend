import {useEffect, useState} from "react"
import { index } from "../services/jobs"
import { index as categoriesIndex } from "../services/categories"
import { index as skillsIndex } from "../services/skills"
import { Link } from "react-router"

const Jobs = function () {

    const [jobs, setJobs] = useState([])
    const [categories, setCategories] = useState([])
    const [skills, setSkills] = useState([])
    const [pagination, setPagination] = useState({})
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        skills: [],
        budgetMin: "",
        budgetMax: "",
        budgetType: "",
        experienceLevel: "",
        daysAgo: "",
        sort: "newest",
        page: 1,
        limit: 10
    })

    const fetchJobs = async function (selectedFilters) {
        setLoading(true)

        try {
            setMessage("")

            const data = await index(selectedFilters)

            setJobs(data.jobs)
            setPagination(data.pagination || {})
        } catch (err) {
            setMessage(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(function () {
        const fetchInitialJobs = async function () {
            try {
                const data = await index({
                    search: "",
                    category: "",
                    skills: [],
                    budgetMin: "",
                    budgetMax: "",
                    budgetType: "",
                    experienceLevel: "",
                    daysAgo: "",
                    sort: "newest",
                    page: 1,
                    limit: 10
                })
                setJobs(data.jobs)
                setPagination(data.pagination || {})
            } catch (error) {
                setMessage(error.message)
            } finally {
                setLoading(false)
            }
        }

        const fetchInitialOptions = async function () {
            try {
                const categoriesData = await categoriesIndex()
                const skillsData = await skillsIndex()
                setCategories(categoriesData)
                setSkills(skillsData)
            } catch (error) {
                setMessage(error.message)
            }
        }

        fetchInitialJobs()
        fetchInitialOptions()
    }, [])

    const handleChange = function (event) {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        })
    }

    const handleSkillsChange = function (event) {
        const selectedSkills = Array.from(
            event.target.selectedOptions,
            function (option) {
                return option.value
            }
        )

        setFilters({
            ...filters,
            skills: selectedSkills
        })
    }

    const handleSubmit = function (event) {
        event.preventDefault()

        const searchFilters = {
            ...filters,
            page: 1
        }

        setFilters(searchFilters)
        fetchJobs(searchFilters)
    }

    const handleReset = function () {
        const emptyFilters = {
            search: "",
            category: "",
            skills: [],
            budgetMin: "",
            budgetMax: "",
            budgetType: "",
            experienceLevel: "",
            daysAgo: "",
            sort: "newest",
            page: 1,
            limit: 10
        }

        setFilters(emptyFilters)
        fetchJobs(emptyFilters)
    }

    const handlePageChange = function (page) {
        const pageFilters = {
            ...filters,
            page: page
        }

        setFilters(pageFilters)
        fetchJobs(pageFilters)
    }

    const currentPage = pagination.page || 1
    const totalPages = pagination.totalPages || pagination.pages || 1

    return (
        <section>
            <header>
                <h1>Browse Jobs</h1>
                <p>{message}</p>
            </header>

            <form className="filter-form" onSubmit={handleSubmit}>
                <label htmlFor="search">Search</label>
                <input
                    id="search"
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Search jobs"
                />

                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                >
                    <option value="">All Categories</option>
                    {categories.map(function (category) {
                        return (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                        )
                    })}
                </select>

                <label htmlFor="skills">Skills</label>
                <select
                    id="skills"
                    name="skills"
                    multiple
                    value={filters.skills}
                    onChange={handleSkillsChange}
                >
                    {skills.map(function (skill) {
                        return (
                        <option key={skill._id} value={skill._id}>
                            {skill.name}
                        </option>
                        )
                    })}
                </select>

                <label htmlFor="budgetMin">Minimum Budget</label>
                <input
                    id="budgetMin"
                    name="budgetMin"
                    type="number"
                    value={filters.budgetMin}
                    onChange={handleChange}
                />

                <label htmlFor="budgetMax">Maximum Budget</label>
                <input
                    id="budgetMax"
                    name="budgetMax"
                    type="number"
                    value={filters.budgetMax}
                    onChange={handleChange}
                />

                <label htmlFor="budgetType">Budget Type</label>
                <select
                    id="budgetType"
                    name="budgetType"
                    value={filters.budgetType}
                    onChange={handleChange}
                >
                    <option value="">All</option>
                    <option value="fixed">Fixed</option>
                    <option value="hourly">Hourly</option>
                </select>

                <label htmlFor="experienceLevel">Experience Level</label>
                <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={filters.experienceLevel}
                    onChange={handleChange}
                >
                    <option value="">All</option>
                    <option value="entry">Entry</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                </select>

                <label htmlFor="daysAgo">Date Posted</label>
                <select
                    id="daysAgo"
                    name="daysAgo"
                    value={filters.daysAgo}
                    onChange={handleChange}
                >
                    <option value="">Any Time</option>
                    <option value="1">Last 24 Hours</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                </select>

                <label htmlFor="sort">Sort</label>
                <select
                    id="sort"
                    name="sort"
                    value={filters.sort}
                    onChange={handleChange}
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="budget_low">Budget Low to High</option>
                    <option value="budget_high">Budget High to Low</option>
                </select>

                <button type="submit">Search</button>
                <button type="button" onClick={handleReset}>
                    Reset
                </button>
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : jobs.length === 0 ? (
                <p>No jobs found</p>
            ) : (
                <div className="card-grid">
                    {jobs.map(function (job) {
                        return (
                        <div className="card listing-card" key={job._id}>
                            <h2>{job.title}</h2>
                            <p>{job.description}</p>
                            <p>Budget: {job.budgetMin} - {job.budgetMax}</p>
                            <p>Experience: {job.experienceLevel}</p>
                            <p>Status: {job.status}</p>
                            <Link to={`/jobs/${job._id}`}>
                                View Job
                            </Link>
                        </div>
                        )
                    })}
                </div>
            )}

            <div className="pagination">
                <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={function () {
                        handlePageChange(currentPage - 1)
                    }}
                >
                    Previous
                </button>

                <p>Page {currentPage} of {totalPages}</p>

                <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={function () {
                        handlePageChange(currentPage + 1)
                    }}
                >
                    Next
                </button>
            </div>
        </section>
    )
}

export default Jobs