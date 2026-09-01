const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/v1/wallet`

const getWallet = async function () {
    const token = localStorage.getItem("token")
    
    const res = await fetch(BASE_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    
    const data = await res.json()
    
    if (!res.ok) {
        throw new Error(data.message)
    }
    return data
}

const addFunds = async function (formData) {
    const token = localStorage.getItem("token")
    const idempotencyKey = Date.now().toString()
    
    const res = await fetch(`${BASE_URL}/deposit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Idempotency-Key": idempotencyKey
        },
        body: JSON.stringify(formData)
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}

export {
    getWallet,
    addFunds
}