import { useState } from "react"

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
    
    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }
    
    return (
    <section className="card">
        <header>
            <h1>Freelancer Profile</h1>
            <p>Tell clients about your skills and experience</p>
            </header>
            
            <form>
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
                    </form>
                    </section>
                    )
                }
                
                export default FreelancerProfile