import { useEffect, useState } from "react"
import { getUsers, verifyUser, updateUserStatus, deleteUser } from "../services/admin"
import { Link } from "react-router"

const AdminUsers = function () {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [filters, setFilters] = useState({
        username: "",
        email: "",
        role: "",
        status: "",
        page: 1
    })
    const [totalPages, setTotalPages] = useState(1)
    
    const fetchUsers = async function (selectedFilters) {
        setLoading(true)
        setMessage("")
        try {
            const data = await getUsers(selectedFilters)
            setUsers(data.users)
            setTotalPages(data.totalPages)
        } catch (error) {
            setMessage(error.message)
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(function () {
        const fetchInitialUsers = async function () {
            try {
                const data = await getUsers({page: 1})
                setUsers(data.users)
                setTotalPages(data.totalPages)
            } catch (error) {
                setMessage(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchInitialUsers()
    }, [])
    
    const handleChange = function (event) {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        })
    }
    
    const handleSubmit = function (event) {
        event.preventDefault()
        const searchFilters = {
            ...filters,
            page: 1
        }
        setFilters(searchFilters)
        fetchUsers(searchFilters)
    }
    
    const handlePageChange = function (page) {
        const newFilters = {
            ...filters,
            page: page
        }
        setFilters(newFilters)
        fetchUsers(newFilters)
    }
    
    const handleVerify = async function (userId) {
    try {
        const data = await verifyUser(userId)
        setMessage(data.message)
        fetchUsers(filters)
    } catch (error) {
        setMessage(error.message)
    }
}
    
    const handleStatusChange = async function (userId, status) {
    const newStatus = status === "active" ? "suspended" : "active"
    try {
        await updateUserStatus(userId, newStatus)
        setMessage("User status updated successfully")
        fetchUsers(filters)
    } catch (error) {
        setMessage(error.message)
    }
}
    
    const handleDelete = async function (userId) {
    const confirmed = window.confirm("Are you sure you want to delete this user?")
    if (!confirmed) return
    try {
        const data = await deleteUser(userId)
        setMessage(data.message)
        fetchUsers(filters)
    } catch (error) {
        setMessage(error.message)
    }
}
    
    return (
    <section>
        <header>
            <h1>Manage Users</h1>
            <p>{message}</p>
            </header>
            
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    value={filters.username}
                    onChange={handleChange}
                />
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    value={filters.email}
                    onChange={handleChange}
                />
                <label htmlFor="role">Role</label>
                <select
                    id="role"
                    name="role"
                    value={filters.role}
                    onChange={handleChange}
                >
                    <option value="">All Roles</option>
                    <option value="client">Client</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="admin">Admin</option>
                </select>
                <label htmlFor="status">Status</label>
                <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                </select>
                <button type="submit">Search</button>
            </form>
            
            {loading ? (
                <p>Loading...</p>
            ) : users.length === 0 ? (
            <p>No users found</p>
        ) : (
            <>
            {users.map(function (user) {
                return (
                <div className="card" key={user._id}>
                    <h2>{user.username}</h2><p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Status: {user.status}</p>
                    <p>Verified: {user.isVerified ? "Yes" : "No"}</p>
                    <Link to={`/admin/users/${user._id}`}>View Details</Link>
                    {!user.isVerified && (
                        <button onClick={function () {
                            handleVerify(user._id)
                        }}>
                            Verify
                        </button>
                    )}
                    <button onClick={function () {
                        handleStatusChange(user._id, user.status)
                    }}>
                        {user.status === "active" ? "Suspend" : "Unsuspend"}
                    </button>
                    <button onClick={function () {
                        handleDelete(user._id)
                    }}>
                        Delete
                    </button>
                    </div>
                    )
                })}
                <button
                    disabled={filters.page === 1}
                    onClick={function () {
                        handlePageChange(filters.page - 1)
                    }}
                >
                    Previous
                </button>
                <span> Page {filters.page} of {totalPages} </span>
                <button
                    disabled={filters.page === totalPages}
                    onClick={function () {
                        handlePageChange(filters.page + 1)
                    }}
                >
                    Next
                </button>
                </>
                )}
                </section>
                )
            }
            export default AdminUsers
