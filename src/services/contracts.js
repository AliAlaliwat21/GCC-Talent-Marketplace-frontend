const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`

const index = async ()=>{

        const res = await fetch(`${BASE_URL}/api/v1/contracts`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })

    const data = await res.json()

    if (!res.ok) throw new Error (data.error || data.message)

        return data
}

const show = async (contractId)=>{
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

const fundMilestone = async (contractId, milestoneId)=>{
    const res = await fetch(`${BASE_URL}/api/v1/contracts/${contractId}/milestones/${milestoneId}/fund`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error || data.message)

    return data
}

const deliverMilestone = async (contractId, milestoneId, deliveryData)=>{
    const res = await fetch(`${BASE_URL}/api/v1/contracts/${contractId}/milestones/${milestoneId}/deliver`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(deliveryData)
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error || data.message)

    return data
}

const approveMilestone = async (contractId, milestoneId)=>{
    const res = await fetch(`${BASE_URL}/api/v1/contracts/${contractId}/milestones/${milestoneId}/approve`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error || data.message)

    return data
}

const requestRevision = async (contractId, milestoneId, note)=>{
    const res = await fetch(`${BASE_URL}/api/v1/contracts/${contractId}/milestones/${milestoneId}/request-revision`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({note: note})
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error || data.message)

    return data
}

const cancelContract = async (contractId)=>{
    const res = await fetch(`${BASE_URL}/api/v1/contracts/${contractId}/cancel`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error || data.message)

    return data
}

const sendMessage = async (contractId, text)=>{
    const res = await fetch(`${BASE_URL}/api/v1/contracts/${contractId}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({text: text})
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error || data.message)

    return data
}

export {
    index,
    show,
    addMilestone,
    updateMilestone,
    fundMilestone,
    deliverMilestone,
    approveMilestone,
    requestRevision,
    cancelContract,
    sendMessage
}
