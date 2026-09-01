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
export {
    getStats,
    getUsers,
    getUser
}