import { useEffect, useState } from "react"
import { index } from "../services/categories"

const AdminCategories = function () {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    
    useEffect(function () {
        const fetchCategories = async function () {
            try {
                const data = await index()
                setCategories(data)
            } catch (error) {
                setMessage(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchCategories()
    }, [])
    
    return (
    <section>
        <header>
            <h1>Manage Categories</h1>
            <p>{message}</p>
            </header>
            
            {loading ? (
                <p>Loading...</p>
            ) : categories.length === 0 ? (
                <p>No categories found</p>
            ) : (
                categories.map(function (category) {
                    return (
                    <div className="card" key={category._id}>
                        <h2>{category.name}</h2>
                        <p>Slug: {category.slug}</p>
                        <p>Icon: {category.icon}</p>
                        <p>Featured: {category.isFeatured ? "Yes" : "No"}</p>
                        </div>
                        )
                    })
                )}
                </section>
                )
            }
            export default AdminCategories