import { useEffect, useState } from "react"
import { showMe, upsertMe } from "../services/clientProfiles"
import { showMe as showAccount } from "../services/user"


const ClientProfile = () => {

    const initialState = {
        isCompany: false,
        companyName: "",
        description: "",
        website: "",
        country: "",
        city: ""
    }


    const [formData, setFormData] = useState(initialState)
    const [message, setMessage] = useState("")


    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const account = await showAccount()
                let profile = {}

                try {
                    const data = await showMe()
                    profile = data.profile || data
                } catch (error) {
                    if (error.message !== "Client profile not found") {
                        throw error
                    }
                }

                setFormData({
                    isCompany: profile.isCompany || false,
                    companyName: profile.companyName || "",
                    description: profile.description || "",
                    website: profile.website || "",
                    country: account.country || "",
                    city: account.city || ""
                })

            } catch (error) {

                setMessage(error.message)

            }

        }

        fetchProfile()

    }, [])


    const handleChange = (event) => {

        const { name, value, type, checked } = event.target

        setFormData({
            ...formData,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        })

    }


    const handleSubmit = async (event) => {

        event.preventDefault()

        setMessage("")

        try {

            const dataToSend = {
                ...formData
            }

            if (!dataToSend.website) {
                delete dataToSend.website
            }

            await upsertMe(dataToSend)

            setMessage(
                "Client profile saved successfully"
            )

        } catch (error) {

            setMessage(error.message)

        }

    }


    return (
        <section className="card compact-page">
            <header>
                <h1>Client Profile</h1>

                <p>Tell freelancers about yourself or your company</p>
            </header>

            <p>{message}</p>

            <form className="compact-form compact-split" onSubmit={handleSubmit}>
                <fieldset className="compact-group">
                    <legend>About you</legend>
                    <div className="compact-grid">
                        <div className="compact-field compact-full">
                            <label htmlFor="isCompany">Company Account</label>

                            <input
                                id="isCompany"
                                name="isCompany"
                                type="checkbox"
                                checked={formData.isCompany}
                                onChange={handleChange}
                            />
                        </div>
                        {formData.isCompany && (
                            <div className="compact-field compact-full">
                                <label htmlFor="companyName">Company Name</label>

                                <input
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <div className="compact-field compact-full">
                            <label htmlFor="description">Description</label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset className="compact-group">
                    <legend>Website & location</legend>
                    <div className="compact-grid">
                        <div className="compact-field compact-full">
                            <label htmlFor="website">Website</label>

                            <input
                                id="website"
                                name="website"
                                type="url"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                            />
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
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <div className="compact-actions">
                    <button type="submit">Save Profile</button>
                </div>
            </form>
        </section>
    )
}

export default ClientProfile
