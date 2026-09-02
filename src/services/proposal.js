const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`

const create = async (jobId, proposalData)=>{
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
}

const mine = async ()=>{
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
}

const getJobProposals = async(jobId)=>{
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
}

const shortlist = async(proposalId)=>{
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
}


const decline = async (proposalId) => {
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

}

const accept = async (proposalId, milestones) => {
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

}

const update = async (proposalId, proposalData)=>{

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
}

const withdraw = async(proposalId)=>{
        const res = await fetch(`${BASE_URL}/api/v1/proposals/${proposalId}/withdraw`,{
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}` },
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || data.message)
        }

        return data
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
