const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`

const create = async (jobId, proposalData)=>{
    try {
        const res = await fetch(`${BASE_URL}/api/v1/jobs/${jobId}/proposals`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify(proposalData)
        })

        const data = await res.json()

        if (!res.ok){
            throw new Error(data.error || data.message)
        }

        return data
    } catch (error) {
        throw new Error(error.message)
    }
}

export {
    create
}