const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`

const signUp = async (formData) => {
    try {

        const userData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role
        }
        const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData)
        })
        const data = await res.json()

        if (!res.ok) {
        throw new Error(data.err || data.message)
}

        if (data.accessToken) {
            localStorage.setItem('token', data.accessToken)

            return JSON.parse(atob(data.accessToken.split('.')[1])).payload
        }

    } catch (err) {
        throw err
    }

}

const signIn = async (formData) => {
    try {
        const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
        const data = await res.json()

       if (!res.ok) {
            throw new Error(data.err || data.message)
        }

        if (data.accessToken) {
            localStorage.setItem('token', data.accessToken)
            // returning the user object
            return JSON.parse(atob(data.accessToken.split('.')[1])).payload
        }

    } catch (err) {
        throw err
    }

}

const signOut = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.err || data.message)
    }

    return data
}

export {
    signUp,
    signIn,
    signOut
}
