import { useEffect, useState } from "react"
import { changePassword, showMe, updateMe } from "../services/user"

const AccountSettings = function (props) {
    const [accountData, setAccountData] = useState({
        username: "",
        avatarUrl: "",
        country: "",
        city: "",
        emailNotifications: true,
        inAppNotifications: true
    })
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: ""
    })
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    useEffect(function () {
        const fetchAccount = async function () {
            try {
                const data = await showMe()
                setAccountData({
                    username: data.username || "",
                    avatarUrl: data.avatarUrl || "",
                    country: data.country || "",
                    city: data.city || "",
                    emailNotifications: data.notificationPrefs?.email !== false,
                    inAppNotifications: data.notificationPrefs?.inApp !== false
                })
            } catch (error) {
                setMessage(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchAccount()
    }, [])

    const handleAccountChange = function (event) {
        const value = event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value

        setAccountData({
            ...accountData,
            [event.target.name]: value
        })
    }

    const handleAccountSubmit = async function (event) {
        event.preventDefault()
        setMessage("")

        try {
            const dataToSend = {
                username: accountData.username,
                avatarUrl: accountData.avatarUrl,
                city: accountData.city,
                notificationPrefs: {
                    email: accountData.emailNotifications,
                    inApp: accountData.inAppNotifications
                }
            }

            if (accountData.country) {
                dataToSend.country = accountData.country
            }

            const data = await updateMe(dataToSend)
            props.setUser({
                ...props.user,
                username: data.username
            })
            setMessage("Account updated successfully")
        } catch (error) {
            setMessage(error.message)
        }
    }

    const handlePasswordChange = function (event) {
        setPasswordData({
            ...passwordData,
            [event.target.name]: event.target.value
        })
    }

    const handlePasswordSubmit = async function (event) {
        event.preventDefault()
        setMessage("")

        try {
            const data = await changePassword(passwordData)
            setPasswordData({
                currentPassword: "",
                newPassword: ""
            })
            setMessage(data.message)
        } catch (error) {
            setMessage(error.message)
        }
    }

    if (loading) {
        return <p>Loading account settings...</p>
    }

    return (
    <section>
        <header>
            <h1>Account Settings</h1>
            <p>{message}</p>
            </header>

            <form onSubmit={handleAccountSubmit}>
                <h2>Account Details</h2>

                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    value={accountData.username}
                    onChange={handleAccountChange}
                    required
                />

                <label htmlFor="avatarUrl">Avatar URL</label>
                <input
                    id="avatarUrl"
                    name="avatarUrl"
                    type="url"
                    value={accountData.avatarUrl}
                    onChange={handleAccountChange}
                />

                <label htmlFor="country">Country</label>
                <select
                    id="country"
                    name="country"
                    value={accountData.country}
                    onChange={handleAccountChange}
                >
                    <option value="">Select Country</option>
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
                    value={accountData.city}
                    onChange={handleAccountChange}
                />

                <label>
                    <input
                        name="emailNotifications"
                        type="checkbox"
                        checked={accountData.emailNotifications}
                        onChange={handleAccountChange}
                    />
                    Email Notifications
                </label>

                <label>
                    <input
                        name="inAppNotifications"
                        type="checkbox"
                        checked={accountData.inAppNotifications}
                        onChange={handleAccountChange}
                    />
                    In App Notifications
                </label>

                <button type="submit">Save Account</button>
            </form>

            <form onSubmit={handlePasswordSubmit}>
                <h2>Change Password</h2>

                <label htmlFor="currentPassword">Current Password</label>
                <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                />

                <label htmlFor="newPassword">New Password</label>
                <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    minLength="8"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                />

                <button type="submit">Change Password</button>
            </form>
            </section>
            )
        }

export default AccountSettings
