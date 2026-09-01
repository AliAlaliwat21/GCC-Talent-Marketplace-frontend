import { useEffect, useState } from "react"
import { getUsers } from "../services/admin"

const AdminUsers = function () {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    
    useEffect(function () {
        const fetchUsers = async function () {
            try {
                const data = await getUsers({
                    page: 1
                })
                setUsers(data.users)
            } catch (error) {
                setMessage(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])
    
    return (
    <section>
        <header>
            <h1>Manage Users</h1>
            <p>{message}</p>
            </header>
            
            {loading ? (
                <p>Loading...</p>
            ) : users.length === 0 ? (
            <p>No users found</p>
        ) : (
            users.map(function (user) {
                return (
                <div className="card" key={user._id}>
                    <h2>{user.username}</h2><p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Status: {user.status}</p>
                    <p>Verified: {user.isVerified ? "Yes" : "No"}</p>
                    </div>
                    )
                })
                )}
                </section>
                )
            }
            export default AdminUsers