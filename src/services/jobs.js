const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`

const index = async ()=>{
    try {
        const res = await fetch(`${BASE_URL}/api/v1/jobs`)

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message)
        }

        return data
    } catch (err) {
        throw new Error(err.message)
        
    }
}

const show = async (jobId)=>{
    try {
        const res = await fetch(`${BASE_URL}/api/v1/jobs/${jobId}`)

        const data = await res.json()

        if (!res.ok){
            throw new Error(data.message)
        }

        return data
    } catch (error) {
        throw new Error(error.message)
    }
}

export {
    index,
    show
}