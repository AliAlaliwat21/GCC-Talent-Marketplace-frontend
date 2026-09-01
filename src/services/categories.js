const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/v1/categories`

const index = async ()=>{
    const res = await fetch(BASE_URL)
    const data = await res.json()

    if(!res.ok){
        throw new Error(
            data.message || "Failed to fetch categories"
        )
    }
    return data
    
}

export {
    index
}