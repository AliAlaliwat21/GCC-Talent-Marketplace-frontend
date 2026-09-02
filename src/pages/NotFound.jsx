import { Link } from "react-router"

const NotFound = function () {
    return (
    <section>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/">Return Home</Link>
        </section>
        )
    }

export default NotFound
