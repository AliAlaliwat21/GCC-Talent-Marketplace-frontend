const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/v1/jobs`

const index = async function (filters = {}) {
    const params = new URLSearchParams()

    for (const key in filters) {
        if (
            filters[key] !== "" &&
            filters[key] !== undefined &&
            filters[key] !== null
        ) {
            params.append(key, filters[key])
        }
    }

    const query = params.toString()

    const res = await fetch(
        query ? `${BASE_URL}?${query}` : BASE_URL
    )

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


const deleteDraft = async function (jobId) {
    const token = localStorage.getItem('token')

    const res = await fetch(`${BASE_URL}/${jobId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (!res.ok) {
        const data = await res.json()

        throw new Error(data.message || 'Failed to delete draft')
    }

    return true
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

const update = async function (jobId, formData) {
    const token = localStorage.getItem('token')

    const res = await fetch(`${BASE_URL}/${jobId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message || 'Failed to update job')
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
    create,
    update
}