import { Link } from "react-router"
import { signOut } from "../services/auth"


const Nav = (props) => {

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.log(error.message)
        }

        localStorage.removeItem('token')
        props.setUser(null)
    }

    return (
        <nav>
            <Link className="nav-brand" to="/">GCC Talent</Link>
            { props.user ? (
                <ul>
                    <li>Welcome, {props.user.username}!</li>
                    <li>
                        <Link to="/">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/jobs">Jobs</Link>
                    </li>
                    <li>
                        <Link to="/freelancers">Freelancers</Link>
                    </li>
                    <li>
                        <Link to="/settings">Settings</Link>
                    </li>
                    <li>
                        <Link to="/" onClick={handleSignOut}>Sign Out</Link>
                    </li>
                </ul>
            ) : (
            <ul>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='/jobs'>Jobs</Link>
                </li>
                <li>
                    <Link to='/freelancers'>Freelancers</Link>
                </li>
                <li>
                    <Link to='/sign-up'>Sign Up</Link>
                </li>
                <li>
                    <Link to='/sign-in'>Sign In</Link>
                </li>
            </ul>
            ) }

        </nav>
    )
}

export default Nav
