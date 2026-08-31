import { useEffect, useState } from "react"
import { showMe, upsertMe } from "../services/clientProfile"


const ClientProfile = () => {

    const initialState = {
        isCompany: false,
        companyName: "",
        description: "",
        website: ""
    }


    const [formData, setFormData] = useState(initialState)
    const [message, setMessage] = useState("")


    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const data = await showMe()

                const profile = data.profile || data

                setFormData({
                    isCompany: profile.isCompany || false,
                    companyName: profile.companyName || "",
                    description: profile.description || "",
                    website: profile.website || ""
                })

            } catch (error) {

                // If they haven't created a profile yet,
                // we just leave the form empty.

                if (
                    error.message !== "Client profile not found"
                ) {
                    setMessage(error.message)
                }

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

            await upsertMe(formData)

            setMessage(
                "Client profile saved successfully"
            )

        } catch (error) {

            setMessage(error.message)

        }

    }


    return (
        <section className="card">

            <header>

                <h1>Client Profile</h1>

                <p>
                    Tell freelancers about yourself or your company
                </p>

            </header>


            <p>{message}</p>


            <form onSubmit={handleSubmit}>


                <label htmlFor="isCompany">
                    Company Account
                </label>

                <input
                    id="isCompany"
                    name="isCompany"
                    type="checkbox"
                    checked={formData.isCompany}
                    onChange={handleChange}
                />


                {formData.isCompany && (
                    <>
                        <label htmlFor="companyName">
                            Company Name
                        </label>

                        <input
                            id="companyName"
                            name="companyName"
                            type="text"
                            value={formData.companyName}
                            onChange={handleChange}
                        />
                    </>
                )}


                <label htmlFor="description">
                    Description
                </label>

                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />


                <label htmlFor="website">
                    Website
                </label>

                <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                />


                <button type="submit">
                    Save Profile
                </button>


            </form>

        </section>
    )
}

export default ClientProfile