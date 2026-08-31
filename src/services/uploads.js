const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/v1/uploads`

const uploadFile = async function (file) {
    const token = localStorage.getItem("token")
    const formData = new FormData()
    
    formData.append("file", file)
    
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    })
    
    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message || "Failed to upload file")
    }
    return data
}

export {
    uploadFile
}