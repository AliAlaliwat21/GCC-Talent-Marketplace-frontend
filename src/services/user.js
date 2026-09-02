const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`

const index = async () => {
    try {
        const res = await fetch(`${BASE_URL}/api/v1/users`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })

        const data = await res.json()
        

        if (!res.ok) {
            throw new Error(data.err || data.message)
        }

        return data

    } catch (err) {
        throw new Error(err.message)
    }
}

const showMe = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/users/me`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.err || data.message)
    }

    return data
}

const updateMe = async (userData) => {
    const res = await fetch(`${BASE_URL}/api/v1/users/me`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.err || data.message)
    }

    return data
}

const changePassword = async (passwordData) => {
    const res = await fetch(`${BASE_URL}/api/v1/users/me/password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(passwordData)
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.err || data.message)
    }

    return data
}

export {
    index,
    showMe,
    updateMe,
    changePassword
}
