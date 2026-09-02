import PagedList from "../components/PagedList"
import { useEffect, useState } from "react"
import { index as skillsIndex } from "../services/skills"
import { createPortfolioItem, show, upsertMe } from "../services/freelancerProfiles"
import { uploadFile } from "../services/uploads"

const FreelancerProfile = function (props) {
    const initialState = {
        headline: "",
        bio: "",
        hourlyRate: "",
        availability: "",
        country: "",
        city: "",
        skills: [],
        languages: []
    }
    
    const [formData, setFormData] = useState(initialState)
    const [availableSkills, setAvailableSkills] = useState([])
    const [message, setMessage] = useState("")
    const [language, setLanguage] = useState({
        name: "",
        level: ""
    })
    const [profileId, setProfileId] = useState("")
    const [portfolioData, setPortfolioData] = useState({
        title: "",
        description: "",
        link: ""
    })
    const [portfolioItems, setPortfolioItems] = useState([])
    const [portfolioImage, setPortfolioImage] = useState(null)
    const [loading, setLoading] = useState(true)

    const handleChange = function (event) {
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    useEffect(function () {
        const fetchSkills = async function () {
            try {
                const data = await skillsIndex()
                
                setAvailableSkills(data)
            } catch (error) {
                setMessage(error.message)
            }
        }
        fetchSkills()
    }, [])
    
    useEffect(function () {
        const fetchProfile = async function () {
            try {
                const data = await show(props.user._id)

                setProfileId(data.profile._id)
                setPortfolioItems(data.profile.portfolio || [])
                
                setFormData({
                    headline: data.profile.headline,
                    bio: data.profile.bio,
                    hourlyRate: data.profile.hourlyRate,
                    availability: data.profile.availability,
                    country: data.user.country || "",
                    city: data.user.city || "",
                    skills: data.profile.skills.map(function (skill) {
                        return skill._id
                    }),
                    languages: data.profile.languages
                })
            } catch (error) {
                if (error.message !== "Freelancer profile not found") {
                    setMessage(error.message)
                }
            } finally {
                setLoading(false)
            }
        }
        
        if (props.user) {
            fetchProfile()
        }
    }, [props.user])
    
    const handleSkillsChange = function (event) {
        const selectedSkills = Array.from(
            event.target.selectedOptions,
            function (option) {
                return option.value
            }
        )
        setFormData({...formData, skills: selectedSkills})
    }
    
    const handleLanguageChange = function (event) {
        setLanguage({...language, [event.target.name]: event.target.value})
    }
    
    const addLanguage = function () {
        if (!language.name || !language.level) {
            return
        }
        
        setFormData({...formData, languages: [...formData.languages, language]})
        setLanguage({name: "", level: ""})
    }

    const handlePortfolioChange = function (event) {
        setPortfolioData({
            ...portfolioData,
            [event.target.name]: event.target.value
        })
    }

    const handlePortfolioImageChange = function (event) {
        setPortfolioImage(event.target.files[0])
    }

    const handlePortfolioSubmit = async function (event) {
        event.preventDefault()
        setMessage("")

        if (!profileId) {
            setMessage("Save your profile before adding a portfolio item")
            return
        }

        try {
            const portfolioItemData = {
                title: portfolioData.title
            }

            if (portfolioData.description) {
                portfolioItemData.description = portfolioData.description
            }

            if (portfolioImage) {
                const uploadedFile = await uploadFile(portfolioImage)
                portfolioItemData.imageUrl = uploadedFile.url
            }

            if (portfolioData.link) {
                portfolioItemData.link = portfolioData.link
            }

            const savedProfile = await createPortfolioItem(
                profileId,
                portfolioItemData
            )

            setPortfolioItems(savedProfile.portfolio)
            setPortfolioData({
                title: "",
                description: "",
                link: ""
            })
            setPortfolioImage(null)
            event.target.reset()
            setMessage("Portfolio item added successfully")
        } catch (error) {
            setMessage(error.message)
        }
    }

    const handleSubmit = async function (event) {
        event.preventDefault()
        setMessage("")
        
        if (formData.languages.length === 0) {
            setMessage("Please add at least one language")
            return
        }

        try {
            const profileData = {...formData, hourlyRate: Number(formData.hourlyRate)}
            const savedProfile = await upsertMe(profileData)

            setProfileId(savedProfile._id)
            setPortfolioItems(savedProfile.portfolio || [])
            setMessage("Profile saved successfully")
        
        } catch (error) {
            setMessage(error.message)
        }
    }

    if (loading) {
        return <p>Loading freelancer profile...</p>
    }
    
    return (
        <section className="card compact-page">
            <header>
                <h1>Freelancer Profile</h1>
                <p>Tell clients about your skills and experience</p>
            </header>
            <p>{message}</p>

            <form className="compact-form compact-split" onSubmit={handleSubmit}>
                <fieldset className="compact-group">
                    <legend>Professional profile</legend>
                    <div className="compact-grid">
                        <div className="compact-field compact-full">
                            <label htmlFor="headline">Headline</label>
                            <input
                                id="headline"
                                name="headline"
                                type="text"
                                value={formData.headline}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="compact-field compact-full">
                            <label htmlFor="bio">Bio</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="compact-field compact-full">
                            <label htmlFor="skills">Skills</label>
                            <select
                                id="skills"
                                name="skills"
                                multiple
                                value={formData.skills}
                                onChange={handleSkillsChange}
                                required
                            >
                                {availableSkills.map(function (skill) {
                                    return (
                                        <option key={skill._id} value={skill._id}>
                                            {" "}
                                            {skill.name}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset className="compact-group">
                    <legend>Availability & location</legend>
                    <div className="compact-grid">
                        <div className="compact-field">
                            <label htmlFor="hourlyRate">Hourly Rate</label>
                            <input
                                id="hourlyRate"
                                name="hourlyRate"
                                type="number"
                                min="0"
                                value={formData.hourlyRate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="compact-field">
                            <label htmlFor="availability">Availability</label>
                            <select
                                id="availability"
                                name="availability"
                                value={formData.availability}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select availability</option>
                                <option value="full_time">Full Time</option>
                                <option value="part_time">Part Time</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>
                        <div className="compact-field">
                            <label htmlFor="country">Country</label>
                            <select
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Country</option>
                                <option value="Bahrain">Bahrain</option>
                                <option value="Kuwait">Kuwait</option>
                                <option value="Oman">Oman</option>
                                <option value="Qatar">Qatar</option>
                                <option value="Saudi Arabia">Saudi Arabia</option>
                                <option value="United Arab Emirates">United Arab Emirates</option>
                            </select>
                        </div>
                        <div className="compact-field">
                            <label htmlFor="city">City</label>
                            <input
                                id="city"
                                name="city"
                                type="text"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="compact-full language-editor">
                            <div className="compact-grid">
                                <div className="compact-field">
                                    <label htmlFor="languageName">Language</label>
                                    <input
                                        id="languageName"
                                        name="name"
                                        type="text"
                                        value={language.name}
                                        onChange={handleLanguageChange}
                                    />
                                </div>
                                <div className="compact-field">
                                    <label htmlFor="languageLevel">Language Level</label>
                                    <select
                                        id="languageLevel"
                                        name="level"
                                        value={language.level}
                                        onChange={handleLanguageChange}
                                    >
                                        <option value="">Select level</option>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                        <option value="native">Native</option>
                                    </select>
                                </div>
                            </div>
                            <button type="button" onClick={addLanguage}>
                                Add Language
                            </button>
                            <ul className="compact-tags">
                                {formData.languages.map((item, index) => (
                                    <li key={`${item.name}-${index}`}>
                                        {item.name} - {item.level}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </fieldset>
                <div className="compact-actions">
                    <button type="submit">Save Profile</button>
                </div>
            </form>

            <details className="compact-disclosure">
                <summary>Portfolio ({portfolioItems.length})</summary>
                <div className="disclosure-content">
                    <form className="compact-form" onSubmit={handlePortfolioSubmit}>
                        <div className="compact-grid">
                            <div className="compact-field">
                                <label htmlFor="portfolioTitle">Portfolio Title</label>
                                <input
                                    id="portfolioTitle"
                                    name="title"
                                    type="text"
                                    value={portfolioData.title}
                                    onChange={handlePortfolioChange}
                                    required
                                />
                            </div>
                            <div className="compact-field">
                                <label htmlFor="portfolioLink">Project Link</label>
                                <input
                                    id="portfolioLink"
                                    name="link"
                                    type="url"
                                    value={portfolioData.link}
                                    onChange={handlePortfolioChange}
                                />
                            </div>
                            <div className="compact-field compact-full">
                                <label htmlFor="portfolioDescription">Description</label>
                                <textarea
                                    id="portfolioDescription"
                                    name="description"
                                    value={portfolioData.description}
                                    onChange={handlePortfolioChange}
                                />
                            </div>
                            <div className="compact-field">
                                <label htmlFor="portfolioImage">Portfolio Image</label>
                                <input
                                    id="portfolioImage"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handlePortfolioImageChange}
                                />
                            </div>
                        </div>
                        <div className="compact-actions">
                            <button type="submit">Add Portfolio Item</button>
                        </div>
                    </form>
                    <PagedList label="Portfolio" className="compact-card-grid" pageSize={6}>
                        {portfolioItems.map(function (item) {
                            return (
                                <article key={item._id}>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>

                                    {item.imageUrl && <img src={item.imageUrl} alt={item.title} />}

                                    {item.link && (
                                        <a href={item.link} target="_blank" rel="noreferrer">
                                            View Project
                                        </a>
                                    )}
                                </article>
                            )
                        })}
                    </PagedList>
                </div>
            </details>
        </section>
    )
                }
                export default FreelancerProfile
