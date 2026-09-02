import { useEffect, useState } from "react"
import { Link } from "react-router"
import { index as getFreelancers } from "../services/freelancerProfiles"
import { index as getCategories } from "../services/categories"
import { index as getSkills } from "../services/skills"

const Freelancers = function () {
    const [profiles, setProfiles] = useState([])
    const [categories, setCategories] = useState([])
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [totalPages, setTotalPages] = useState(1)
    const [filters, setFilters] = useState({
        q: "",
        category: "",
        skill: "",
        minRate: "",
        maxRate: "",
        minRating: "",
        country: "",
        city: "",
        availability: "",
        sort: "newest",
        page: 1,
        limit: 10
    })

    const fetchFreelancers = async function (selectedFilters) {
        setLoading(true)
        setMessage("")

        try {
            const data = await getFreelancers(selectedFilters)
            setProfiles(data.profiles)
            setTotalPages(Math.max(1, Math.ceil(data.totalProfiles / data.limit)))
        } catch (error) {
            setMessage(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(function () {
        const fetchOptions = async function () {
            try {
                const categoriesData = await getCategories()
                const skillsData = await getSkills()
                setCategories(categoriesData)
                setSkills(skillsData)
            } catch (error) {
                setMessage(error.message)
            }
        }

        fetchOptions()
        fetchFreelancers(filters)
    }, [])

    const handleChange = function (event) {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = function (event) {
        event.preventDefault()
        const searchFilters = {
            ...filters,
            page: 1
        }
        setFilters(searchFilters)
        fetchFreelancers(searchFilters)
    }

    const handlePageChange = function (page) {
        const newFilters = {
            ...filters,
            page: page
        }
        setFilters(newFilters)
        fetchFreelancers(newFilters)
    }

    return (
    <section>
        <header>
            <h1>Find Freelancers</h1>
            <p>{message}</p>
            </header>

            <form onSubmit={handleSubmit}>
                <label htmlFor="q">Search</label>
                <input
                    id="q"
                    name="q"
                    value={filters.q}
                    onChange={handleChange}
                    placeholder="Name, headline or bio"
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

                <label htmlFor="skill">Skill</label>
                <select
                    id="skill"
                    name="skill"
                    value={filters.skill}
                    onChange={handleChange}
                >
                    <option value="">All Skills</option>
                    {skills.map(function (skill) {
                        return (
                        <option key={skill._id} value={skill._id}>
                            {skill.name}
                        </option>
                        )
                    })}
                </select>

                <label htmlFor="minRate">Minimum Rate</label>
                <input
                    id="minRate"
                    name="minRate"
                    type="number"
                    min="0"
                    value={filters.minRate}
                    onChange={handleChange}
                />

                <label htmlFor="maxRate">Maximum Rate</label>
                <input
                    id="maxRate"
                    name="maxRate"
                    type="number"
                    min="0"
                    value={filters.maxRate}
                    onChange={handleChange}
                />

                <label htmlFor="minRating">Minimum Rating</label>
                <select
                    id="minRating"
                    name="minRating"
                    value={filters.minRating}
                    onChange={handleChange}
                >
                    <option value="">Any Rating</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>

                <label htmlFor="country">Country</label>
                <select
                    id="country"
                    name="country"
                    value={filters.country}
                    onChange={handleChange}
                >
                    <option value="">All Countries</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Oman">Oman</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                </select>

                <label htmlFor="city">City</label>
                <input
                    id="city"
                    name="city"
                    value={filters.city}
                    onChange={handleChange}
                />

                <label htmlFor="availability">Availability</label>
                <select
                    id="availability"
                    name="availability"
                    value={filters.availability}
                    onChange={handleChange}
                >
                    <option value="">Any Availability</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="unavailable">Unavailable</option>
                </select>

                <label htmlFor="sort">Sort</label>
                <select
                    id="sort"
                    name="sort"
                    value={filters.sort}
                    onChange={handleChange}
                >
                    <option value="newest">Newest</option>
                    <option value="rate_low">Rate Low to High</option>
                    <option value="rate_high">Rate High to Low</option>
                </select>

                <button type="submit">Search</button>
            </form>

            {loading ? (
                <p>Loading freelancers...</p>
            ) : profiles.length === 0 ? (
                <p>No freelancers found</p>
            ) : (
                <>
                {profiles.map(function (profile) {
                    return (
                    <div className="card" key={profile._id}>
                        <h2>{profile.user.username}</h2>
                        <p>{profile.headline}</p>
                        <p>Rate: {profile.hourlyRate} {profile.currency}</p>
                        <p>Availability: {profile.availability.replace("_", " ")}</p>
                        <p>Rating: {profile.user.ratingAvg} / 5</p>
                        <Link to={`/freelancers/${profile.user._id}`}>
                            View Profile
                        </Link>
                        </div>
                        )
                    })}

                    <button
                        disabled={filters.page === 1}
                        onClick={function () {
                            handlePageChange(filters.page - 1)
                        }}
                    >
                        Previous
                    </button>
                    <span> Page {filters.page} of {totalPages} </span>
                    <button
                        disabled={filters.page === totalPages}
                        onClick={function () {
                            handlePageChange(filters.page + 1)
                        }}
                    >
                        Next
                    </button>
                </>
                )}
                </section>
                )
            }

export default Freelancers
