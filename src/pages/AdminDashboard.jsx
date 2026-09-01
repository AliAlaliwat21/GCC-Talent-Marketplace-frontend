import { useEffect, useState } from "react"
import { Link } from "react-router"
import { getStats } from "../services/admin"

const AdminDashboard = function () {
    const [stats, setStats] = useState(null)
    const [message, setMessage] = useState("")
    
    useEffect(function () {
        const fetchStats = async function () {
            try {
                const data = await getStats()
                setStats(data)
            } catch (error) {
                setMessage(error.message)
            }
        }
        fetchStats()
    }, [])

    if (message) {
        return <p>{message}</p>
    }

    if (!stats) {
        return <p>Loading...</p>
    }

    const totalUsers =
        stats.users.clients +
        stats.users.freelancers +
        stats.users.admins

    return (
        <section>
            <header>
                <h1>Admin Dashboard</h1>
            </header>

            <div className="card">
                <h2>Users</h2>
                <p>Total Users: {totalUsers}</p>
                <p>Clients: {stats.users.clients}</p>
                <progress
                    value={stats.users.clients}
                    max={totalUsers || 1}
                />
                <p>Freelancers: {stats.users.freelancers}</p>
                <progress
                    value={stats.users.freelancers}
                    max={totalUsers || 1}
                />
                <p>Admins: {stats.users.admins}</p>
                <progress
                    value={stats.users.admins}
                    max={totalUsers || 1}
                />
            </div>

            <div className="card">
                <h2>Platform Statistics</h2>
                <p>New Sign-ups in 7 Days: {stats.newSignups.last7Days}</p>
                <p>New Sign-ups in 30 Days: {stats.newSignups.last30Days}</p>
                <p>Open Jobs: {stats.openJobs}</p>
                <p>Active Contracts: {stats.activeContracts}</p>
                <p>GMV: ${stats.gmv}</p>
                <p>Platform Revenue: ${stats.platformRevenue}</p>
            </div>

            <div className="card">
                <h2>Management</h2>
                <Link to="/admin/users">Manage Users</Link>
                <br/>
                <Link to="/admin/categories">Manage Categories</Link>
                <br/>
                <Link to="/admin/skills">Manage Skills</Link>
            </div>
        </section>
    )
}

export default AdminDashboard