const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/v1/categories`
const ADMIN_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/v1/admin/categories`

const index = async ()=>{
    const res = await fetch(BASE_URL)
    const data = await res.json()

    if(!res.ok){
        throw new Error(
            data.message || "Failed to fetch categories"
        )
    }
    return data
}

const create = async function (categoryData) {
    const token = localStorage.getItem("token")
    const res = await fetch(ADMIN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
    })
    const data = await res.json()
    if (!res.ok) {
        throw new Error(data.message)
    }
    return data
}

const update = async function (categoryId, categoryData) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${ADMIN_URL}/${categoryId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
    })
    const data = await res.json()
    if (!res.ok) {
        throw new Error(data.message)
    }
    return data
}

export {
    index,
    create,
    update
}