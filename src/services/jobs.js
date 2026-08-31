const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/v1/jobs`


const index = async () => {
    const res = await fetch(BASE_URL)

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch jobs')
    }

    return data
}


const show = async (jobId) => {
    const token = localStorage.getItem('token')

    const headers = {}

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(`${BASE_URL}/${jobId}`, {
        headers
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch job')
    }

    return data
}


const myJobs = async () => {
    const token = localStorage.getItem('token')

    const res = await fetch(`${BASE_URL}/mine`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch your jobs')
    }

    return data
}


const closeJob = async (jobId) => {
    const token = localStorage.getItem('token')

    const res = await fetch(`${BASE_URL}/${jobId}/close`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message || 'Failed to close job')
    }

    return data
}


const reopenJob = async (jobId) => {
    const token = localStorage.getItem('token')

    const res = await fetch(`${BASE_URL}/${jobId}/reopen`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message || 'Failed to reopen job')
    }

    return data
}


const deleteDraft = async (jobId) => {
    const token = localStorage.getItem('token')

    const res = await fetch(`${BASE_URL}/${jobId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message || 'Failed to delete draft')
    }

    return data
}

const create = async(formData)=>{

    const token = localStorage.getItem('token')

    const res = await fetch(BASE_URL, {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(formData)
    })
    
    const data = await res.json()

    if(!res.ok) {
        throw new Error(
            data.message || 'Failed to create job'
        )
    }
    return data
}

export {
    index,
    show,
    myJobs,
    closeJob,
    reopenJob,
    deleteDraft,
    create

}