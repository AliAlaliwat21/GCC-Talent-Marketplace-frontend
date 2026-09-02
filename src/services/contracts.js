const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`

const index = async ()=>{

    try {
        const res = await fetch(`${BASE_URL}/api/v1/contracts`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })

    const data = await res.json()

    if (!res.ok) throw new Error (data.error || data.message)

        return data
    } catch (error) {
        throw new Error(error.message)
    }
   
}

const show = async (contractId)=>{
    try {
        const res = await fetch(`${BASE_URL}/api/v1/contracts/${contractId}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        )

        const data = await res.json()
        if (!res.ok) throw new Error (data.error || data.message)

            return data
    } catch (error) {
        throw new Error(error.message)
    }
}

const addMilestone = async (contractId, milestoneData)=>{
    const res = await fetch(`${BASE_URL}/api/v1/contracts/${contractId}/milestones`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(milestoneData)
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error || data.message)

    return data
}

const updateMilestone = async (contractId, milestoneId, milestoneData)=>{
    const res = await fetch(`${BASE_URL}/api/v1/contracts/${contractId}/milestones/${milestoneId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(milestoneData)
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error || data.message)

    return data
}

export {
    index,
    show,
    addMilestone,
    updateMilestone
}
