import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { show } from "../services/clientProfiles"
import ReviewsList from "../components/ReviewsList"

const PublicClientProfile = () => {

    const { userId } = useParams()

    const [profileData, setProfileData] = useState(null)
    const [message, setMessage] = useState("")

    useEffect(() => {

        const fetchProfile = async () => {

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
                <p>
                    {message || "Loading client profile..."}
                </p>
            </section>
        )
    }

    const {
        profile,
        user,
        hiringSummary
    } = profileData

    return (
        <section className="card">

            <header>

                {user.avatarUrl && (
                    <img
                        src={user.avatarUrl}
                        alt={user.username}
                    />
                )}

                <h1>
                    {
                        profile.isCompany &&
                        profile.companyName
                            ? profile.companyName
                            : user.username
                    }
                </h1>

                {user.isVerified && (
                    <p>Verified Client</p>
                )}

                <p>
                    {user.country}
                    {user.city && ` - ${user.city}`}
                </p>

                <p>
                    Rating: {
                        user.ratingCount > 0
                            ? `${Number(
                                user.ratingAvg
                            ).toFixed(1)} / 5 (${user.ratingCount} reviews)`
                            : "No reviews yet"
                    }
                </p>

            </header>

            <h2>About</h2>

            <p>{profile.description}</p>

            {profile.website && (
                <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                >
                    Visit Website
                </a>
            )}

            <h2>Hiring History</h2>

            <p>
                Jobs Posted: {hiringSummary.jobsPosted}
            </p>

            <p>
                Contracts: {hiringSummary.contracts}
            </p>

            <p>
                Completed Contracts: {
                    hiringSummary.completedContracts
                }
            </p>

            <p>
                Hire Rate: {hiringSummary.hireRate}%
            </p>

            <ReviewsList userId={userId} />

        </section>
    )
}

export default PublicClientProfile