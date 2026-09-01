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

const fundMilestone = async (contractId, milestoneId) =>{
    try {
        const res = await fetch(`${BASE_URL}/api/v1/contracts/${contractId}/milestone/${milestoneId}/fund`, {
            method: 'POST',
            header: 
            {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        })

        const data = await res.json()
        if (!res.ok){
            throw new Error (data.error || data.message)
        }
        return data
    } catch (error) {
        throw new Error(error.message)
    }
}

const deliverMilestone = async (contractId, milestoneId, deliveryData)=>{
    try {
        const res = await fetch(`${BASE_URL}/api/v1/contracts/${contractId}/milestones/${milestoneId}/deliver`,{
            method: 'POST',
            header:
            {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },

            body: JSON.stringify(deliveryData)
        })

        const data = await res.json()

        if (!res.ok){
            throw new Error(data.error || data.message)
        }

        return data
    } catch (error) {
        throw new Error (error.message)
    }
}

const approveMilestone = async (contractId, milestoneId)=>{
    try {
        const res = await fetch(`${BASE_URL}/api/v1/contracts/${contractId}/milestones/${milestoneId}/approve`,{
            method: 'POST',
            header: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        const data = await res.json()

        if(!res.ok){
            throw new Error(data.error || data.message)
        }

        return data
    } catch (error) {
        throw new Error(error.message)
    }
}

const requestRevision = async(contractId, milestoneId, note)=>{
    try {
        const res = await fetch(`${BASE_URL}/api/v1/contracts/${contractId}/milestones/${milestoneId}/request-revision`,{
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({note: note})
        })

        const data = await res.json()

        if(!res.ok){
            throw new Error(data.error || data.message)
        }

        return data
        
    } catch (error) {
        throw new Error(error.message)
    }
}

const addMilestone = async (contractId, milestoneData) => {
    try {
        const res = await fetch(
            `${BASE_URL}/api/v1/contracts/${contractId}/milestones`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(milestoneData)
            }
        )

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || data.message)
        }

        return data

    } catch (error) {
        throw new Error(error.message)
    }
}


const updateMilestone = async (
    contractId,
    milestoneId,
    milestoneData
) => {
    try {
        const res = await fetch(
            `${BASE_URL}/api/v1/contracts/${contractId}/milestones/${milestoneId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(milestoneData)
            }
        )

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || data.message)
        }

        return data

    } catch (error) {
        throw new Error(error.message)
    }
}


const cancelContract = async (contractId) => {
    try {
        const res = await fetch(
            `${BASE_URL}/api/v1/contracts/${contractId}/cancel`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        )

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || data.message)
        }

        return data

    } catch (error) {
        throw new Error(error.message)
    }
}


const sendMessage = async (contractId, text) => {
    try {
        const res = await fetch(
            `${BASE_URL}/api/v1/contracts/${contractId}/messages`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    text: text
                })
            }
        )

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || data.message)
        }

        return data

    } catch (error) {
        throw new Error(error.message)
    }
}

export {
    index,
    show,
    fundMilestone,
    deliverMilestone,
    approveMilestone,
    requestRevision,
    addMilestone,
    updateMilestone,
    cancelContract,
    sendMessage
}