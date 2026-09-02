import { useState } from "react"
import { signUp } from "../services/auth"
import { useNavigate } from "react-router"

const SignUpForm = (props) => {

    const navigate = useNavigate()

    const initialState = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    }

    const [formData, setFormData] = useState(initialState)
    const [message, setMessage] = useState('')

    const handleChange = (event) => {
        setMessage('')
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const newUser = await signUp(formData)
            props.setUser(newUser)
            setFormData(initialState)
            navigate('/')
        } catch (err) {
            setMessage(err.message)
        }
    }

    const isFormValid = () => {
        if(
            formData.username &&
            formData.email &&
            formData.password &&
            formData.role &&
            formData.password ===
            formData.confirmPassword
        ) {
            return true
        } else return false
    }

    return (
        <section className="card auth-card sign-up-card">
            <header>
                <h1>Sign Up</h1>
                <p>Create your GCC Talent account</p>
                {message && <p className="error">{message}</p>}
            </header>

            <form className="sign-up-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        onChange={handleChange}
                        value={formData.username}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        onChange={handleChange}
                        value={formData.confirmPassword}
                        required
                    />
                </div>

                <div className="form-field role-field">
                    <label htmlFor="role">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a Role</option>
                        <option value="client">Client</option>
                        <option value="freelancer">Freelancer</option>
                    </select>
                </div>

                <div className="actions sign-up-actions">
                    <button type="submit" disabled={!isFormValid()}>
                        Sign Up
                    </button>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => navigate('/')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </section>
    )
}

export default SignUpForm