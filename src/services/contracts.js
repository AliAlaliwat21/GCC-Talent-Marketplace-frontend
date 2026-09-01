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

export {
    index,
    show,
    fundMilestone,
    deliverMilestone
}