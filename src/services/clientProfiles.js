const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/v1/clients`


const showMe = async () => {

    const token = localStorage.getItem("token")

    const res = await fetch(`${BASE_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(
            data.message || "Failed to fetch client profile"
        )
    }

    return data
}


const show = async (userId) => {

    const res = await fetch(`${BASE_URL}/${userId}`)

    const data = await res.json()

    if (!res.ok) {
        throw new Error(
            data.message || "Failed to fetch client profile"
        )
    }

    return data
}


const upsertMe = async (profileData) => {

    const token = localStorage.getItem("token")

    const res = await fetch(`${BASE_URL}/me`, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(profileData)
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(
            data.message || "Failed to save client profile"
        )
    }

    return data
}


export {
    showMe,
    show,
    upsertMe
}