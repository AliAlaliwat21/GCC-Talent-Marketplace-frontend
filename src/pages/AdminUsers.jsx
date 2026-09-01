import { useEffect, useState } from "react"
import { getUsers } from "../services/admin"

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
        fetchUsers(filters)
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