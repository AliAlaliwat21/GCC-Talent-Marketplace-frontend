import PagedList from "../components/PagedList"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { show } from "../services/freelancerProfiles"
import ReviewsList from "../components/ReviewsList"

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
            <section className="card compact-page">
                <p>
                    {message || "Loading profile..."}
                </p>
            </section>
        )
    }

    const profile = profileData.profile
    const user = profileData.user

    return (
        <section className="card compact-page">
            <header>
                {user.avatarUrl && (
                    <img className="compact-avatar" src={user.avatarUrl} alt={user.username} />
                )}

                <h1>{user.username}</h1>

                <h2>{profile.headline}</h2>

                {user.isVerified && <p>Verified Freelancer</p>}

                <p>
                    {user.country} - {user.city}
                </p>

                <p>
                    Rating:{" "}
                    {user.ratingCount > 0
                        ? `${user.ratingAvg} / 5 (${user.ratingCount} reviews)`
                        : "No reviews yet"}
                </p>
            </header>

            <div className="compact-columns">
                <div>
                    <h2>About</h2>

                    <p>{profile.bio}</p>

                    <p>
                        Hourly Rate: {profile.hourlyRate} {profile.currency}
                    </p>

                    <p>Availability: {profile.availability.replace("_", " ")}</p>

                    <p>Completed Contracts: {profile.completedContracts || 0}</p>
                </div>
                <div>
                    <h2>Skills</h2>
                    <div className="compact-tags">
                        {profile.skills.map(function (skill) {
                            return <p key={skill._id}>{skill.name}</p>
                        })}
                    </div>
                    <h2>Languages</h2>
                    <div className="compact-tags">
                        {profile.languages.map(function (language) {
                            return (
                                <p key={language._id}>
                                    {language.name} - {language.level}
                                </p>
                            )
                        })}
                    </div>
                </div>
            </div>
            <h2>Portfolio</h2>

            <PagedList label="Portfolio" pageSize={4} className="compact-card-grid">
                {profile.portfolio.map(function (item) {
                    return (
                        <div key={item._id}>
                            <h3>{item.title}</h3>

                            <p>{item.description}</p>

                            {item.imageUrl && <img src={item.imageUrl} alt={item.title} />}

                            {item.link && (
                                <a href={item.link} target="_blank" rel="noreferrer">
                                    View Project
                                </a>
                            )}
                        </div>
                    )
                })}
            </PagedList>

            <ReviewsList userId={userId} />
        </section>
    )
}

export default PublicFreelancerProfile
