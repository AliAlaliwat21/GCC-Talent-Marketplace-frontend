import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { show } from "../services/freelancerProfiles"

const PublicFreelancerProfile = function () {
    const { userId } = useParams()
    const [profileData, setProfileData] = useState(null)
    const [message, setMessage] = useState("")
    
    useEffect(function () {
        const fetchProfile = async function () {
            try {
                const data = await show(userId)
                
                setProfileData(data)
            } catch (error) {
                setMessage(error.message)
            }
        }
        
        fetchProfile()
    }, [userId])
    
    if (!profileData) {
        return (
        <section className="card">
            <p>{message || "Loading profile..."}</p>
            </section>
            )
        }
        
        const profile = profileData.profile
        const user = profileData.user
        
        return (
        <section className="card">
            <header> {user.avatarUrl && (<img src={user.avatarUrl} alt={user.username}/>)}
            
            <h1>{user.username}</h1>
            <h2>{profile.headline}</h2>
            
            {user.isVerified && (<p>Verified Freelancer</p>)}
            
            <p>{user.country} - {user.city}</p>
            
            <p>
                Rating: {user.ratingCount > 0
                ? `${user.ratingAvg} / 5 (${user.ratingCount} reviews)`
                : "No reviews yet"}
                </p>
                </header>
                
                <h2>About</h2>
                <p>{profile.bio}</p>
                <p>Hourly Rate: {profile.hourlyRate} {profile.currency}</p>
                <p>Availability: {profile.availability.replace("_", " ")}</p>
                
                <h2>Skills</h2>
                {profile.skills.map(function (skill) {
                    return <p key={skill._id}>{skill.name}</p>
                    })}
                    
                    <h2>Languages</h2>
                    {profile.languages.map(function (language) {
                        return (
                        <p key={language._id}>
                            {language.name} - {language.level}
                            </p>
                            )
                            })}
                            
                            <h2>Portfolio</h2>
                            {profile.portfolio.map(function (item) {
                                return (
                                <div key={item._id}>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    
                                    {item.imageUrl && (<img src={item.imageUrl} alt={item.title}/>)}
                                    {item.link && (<a href={item.link} target="_blank" rel="noreferrer">View Project</a>)}
                                    </div>
                                    )
                                    })}
                            
                            <h2>Reviews</h2>
                            {profileData.reviews.length === 0 && (<p>No reviews yet</p>)}
                            {profileData.reviews.map(function (review) {
                                return (
                                <div key={review._id}>
                                    <p>Rating: {review.rating} / 5</p>
                                    <p>{review.comment}</p>
                                    </div>
                                    )
                                })}
                                </section>
                                )
                            }
                            
                            export default PublicFreelancerProfile