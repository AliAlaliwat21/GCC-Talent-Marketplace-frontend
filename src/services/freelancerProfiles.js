const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/v1/freelancers`

const show = async (userId) => {
    const res = await fetch(`${BASE_URL}/${userId}`)
    
    const data = await res.json()
    
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch freelancer profile')
    }

    return data
}

export {
    show
}