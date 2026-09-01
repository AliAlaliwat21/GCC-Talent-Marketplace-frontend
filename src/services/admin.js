const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/v1/admin`

const getStats = async function () {
    const token = localStorage.getItem("token")
    const res = await fetch(`${BASE_URL}/stats`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const data = await res.json()
    if (!res.ok) {
        throw new Error(data.message)
    }
    return data
}

const getUsers = async function (filters) {
    const token = localStorage.getItem("token")
    const params = new URLSearchParams()
    if (filters.username) {
        params.append("username", filters.username)
    }
    if (filters.email) {
        params.append("email", filters.email)
    }
    if (filters.role) {
        params.append("role", filters.role)
    }
    if (filters.status) {
        params.append("status", filters.status)
    }
    if (filters.page) {
        params.append("page", filters.page)
    }
    const res = await fetch(`${BASE_URL}/users?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    
    const data = await res.json()
    if (!res.ok) {
        throw new Error(data.message)
    }
    return data
}

const getUser = async function (userId) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const data = await res.json()
    if (!res.ok) {
        throw new Error(data.message)
    }
    return data
}

const updateUserStatus = async function (userId, status) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${BASE_URL}/users/${userId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            status: status
        })
    })
    const data = await res.json()
    if (!res.ok) {
        throw new Error(data.message)
    }
    return data
}

const verifyUser = async function (userId) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${BASE_URL}/users/${userId}/verify`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const data = await res.json()
    if (!res.ok) {
        throw new Error(data.message)
    }
    return data
}

const deleteUser = async function (userId) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const data = await res.json()
    if (!res.ok) {
        throw new Error(data.message)
    }
    return data
}

export {
    getStats,
    getUsers,
    getUser,
    updateUserStatus,
    verifyUser,
    deleteUser
}