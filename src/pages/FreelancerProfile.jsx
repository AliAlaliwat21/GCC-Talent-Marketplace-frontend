import { useEffect, useState } from "react"
import { index as skillsIndex } from "../services/skills"
import { upsertMe } from "../services/freelancerProfiles"

const FreelancerProfile = () => {
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
    
    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }
    
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const data = await skillsIndex()
                
                setAvailableSkills(data)
            } catch (error) {
                setMessage(error.message)
            }
        }
        
        fetchSkills()
    }, [])
    
    const handleSkillsChange = (event) => {
        const selectedSkills = Array.from(
            event.target.selectedOptions,
            (option) => option.value
        )
        setFormData({...formData, skills: selectedSkills})
    }

    const handleLanguageChange = (event) => {
        setLanguage({...language, [event.target.name]: event.target.value})
    }

    const addLanguage = () => {
        if (!language.name || !language.level) {
            return
        }

        setFormData({
            ...formData,
            languages: [...formData.languages, language]
        })

        setLanguage({
            name: "",
            level: ""
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setMessage("")

        if (formData.languages.length === 0) {
            setMessage("Please add at least one language")
            return
        }

        try {
            const profileData = {
                ...formData,
                hourlyRate: Number(formData.hourlyRate)
            }

            await upsertMe(profileData)

            setMessage("Profile saved successfully")
        } catch (error) {
            setMessage(error.message)
        }
    }
    
    return (
    <section className="card">
        <header>
            <h1>Freelancer Profile</h1>
            <p>Tell clients about your skills and experience</p>
            </header>

            <p>{message}</p>
            
            <form onSubmit={handleSubmit}>
                <label htmlFor="headline">Headline</label>
                <input
                id="headline"
                name="headline"
                type="text"
                value={formData.headline}
                onChange={handleChange}
                required/>
                
                <label htmlFor="bio">Bio</label>
                <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required/>
                
                <label htmlFor="hourlyRate">Hourly Rate</label>
                <input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                min="0"
                value={formData.hourlyRate}
                onChange={handleChange}
                required/>
                
                <label htmlFor="availability">Availability</label>
                <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required>
                    <option value="">Select availability</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="unavailable">Unavailable</option>
                    </select>
                    
                    <label htmlFor="skills">Skills</label>
                    <select
                    id="skills"
                    name="skills"
                    multiple
                    value={formData.skills}
                    onChange={handleSkillsChange}
                    required>
                        {availableSkills.map((skill) => (
                            <option key={skill._id} value={skill._id}>
                                {skill.name}
                            </option>
                        ))}
                        </select>

                    <label htmlFor="languageName">Language</label>
                    <input
                    id="languageName"
                    name="name"
                    type="text"
                    value={language.name}
                    onChange={handleLanguageChange}/>

                    <label htmlFor="languageLevel">Language Level</label>
                    <select
                    id="languageLevel"
                    name="level"
                    value={language.level}
                    onChange={handleLanguageChange}>
                        <option value="">Select level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="native">Native</option>
                        </select>

                    <button type="button" onClick={addLanguage}>Add Language</button>

                    {formData.languages.map((item, index) => (
                        <p key={`${item.name}-${index}`}>
                            {item.name} - {item.level}
                        </p>
                    ))}
                    
                    <label htmlFor="country">Country</label>
                    <input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    required/>
                    
                    <label htmlFor="city">City</label>
                    <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    required/>

                    <button type="submit">Save Profile</button>
                    </form>
                    </section>
                    )
                }
                export default FreelancerProfile