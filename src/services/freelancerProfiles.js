const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/v1/freelancers`

const index = async (filters = {}) => {
    const params = new URLSearchParams()

    Object.keys(filters).forEach(function (filter) {
        if (filters[filter] !== "" && filters[filter] !== undefined) {
            params.append(filter, filters[filter])
        }
    })

    const res = await fetch(`${BASE_URL}?${params.toString()}`)

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch freelancers")
    }
    return data
}

const show = async (userId) => {
    const res = await fetch(`${BASE_URL}/${userId}`)
    
    const data = await res.json()
    
    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch freelancer profile")
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
        throw new Error(data.message || "Failed to save freelancer profile")
    }
    return data
}

const createPortfolioItem = async function (profileId, portfolioData) {
    const token = localStorage.getItem("token")
    
    const res = await fetch(`${BASE_URL}/${profileId}/portfolio`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(portfolioData)
    })
    const data = await res.json()
    
    if (!res.ok) {
        throw new Error(data.message || "Failed to add portfolio item")
    }
    return data
}

export {
    index,
    show,
    upsertMe,
    createPortfolioItem
}
