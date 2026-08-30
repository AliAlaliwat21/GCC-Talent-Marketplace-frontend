const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/v1/skills`

const index = async () => {
    const res = await fetch(BASE_URL)
    
    const data = await res.json()
    
    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch skills")
    }
    return data
}

export {
    index
}