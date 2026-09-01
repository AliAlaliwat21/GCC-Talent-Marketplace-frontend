const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/v1`

const createReview = async (contractId, reviewData)=>{
    const token = localStorage.getItem("token")

    const res = await fetch(
        `${BASE_URL}/contracts/${contractId}/reviews`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(reviewData)
        }
    )

    const data = await res.json()

    if(!res.ok){
        throw new Error(
            data.message || "Failed to create review"
        )
    }
    return data
}

const getUserReviews = async (
    userId,
    page = 1,
    limit = 5
) => {
    const res = await fetch(
        `${BASE_URL}/users/${userId}/reviews?page=${page}&limit=${limit}`
    )
    const data = await res.json()

    if(!res.ok){
        throw new Error(
            data.message || "failed to fetch reviews"
        )
    }

    return data
}

export {
    createReview,
    getUserReviews
}