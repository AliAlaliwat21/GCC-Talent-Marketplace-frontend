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

const mine = async ()=>{
    try {
        const res = await fetch(`${BASE_URL}/api/v1/proposals/mine`,{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
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

const getJobProposals = async(jobId)=>{
    try {
        const res = await fetch(`${BASE_URL}/api/v1/jobs/${jobId}/proposals`,{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
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

const shortlist = async(proposalId)=>{
    try {
        const res = await fetch(`${BASE_URL}/api/v1/proposals/${proposalId}/shortlist`,{
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
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


const decline = async (proposalId) => {
    try {
        const res = await fetch(
            `${BASE_URL}/api/v1/proposals/${proposalId}/decline`,
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

const accept = async (proposalId, milestones) => {
    try {
        const res = await fetch(
            `${BASE_URL}/api/v1/proposals/${proposalId}/accept`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    milestones: milestones
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

const update = async (proposalId, proposalData)=>{

    try {
        const res = await fetch(`${BASE_URL}/api/v1/proposals/${proposalId}`,{
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify(proposalData)
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || data.message)
        }

        return data
    } catch (error) {
        throw new Error(error.message)
    }
}

const withdraw = async(proposalId)=>{
    try {
        const res = fetch(`${BASE_URL}/api/v1/proposals/${proposalId}/withdraw`,{
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}` },
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || data.message)
        }

        return data
    } catch (error) {
        
    }
}

export {
    create,
    mine,
    getJobProposals,
    shortlist,
    decline,
    accept,
    update,
    withdraw
}
