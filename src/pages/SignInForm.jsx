import { useNavigate } from "react-router"
import { useState } from "react"
import { signIn } from "../services/auth"

const SignInForm = (props) => {

    const navigate = useNavigate()

    const initialState = {
        email: '',
        password: '',
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
            const signedInUser = await signIn(formData)
            props.setUser(signedInUser)
            setFormData(initialState)
            navigate('/')
        } catch(err) {
            setMessage(err.message)
        }
    }

    return(
        <section className="card auth-card">
            <header>
                <h1>Sign In</h1>
                {message && <p className="error">{message}</p>}
            </header>

            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    required
                    onChange={handleChange}
                />
                
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    required
                    onChange={handleChange}
                />

                <div className="actions">
                    <button type="submit">
                        Sign In
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

export default SignInForm