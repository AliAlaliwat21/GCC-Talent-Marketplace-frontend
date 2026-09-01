import { useEffect, useState } from "react"
import { index, create } from "../services/categories"

const AdminCategories = function () {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [categoryData, setCategoryData] = useState({
        name: "",
        slug: "",
        icon: "",
        isFeatured: false
    })
    
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
    
    const handleChange = function (event) {
        setCategoryData({
            ...categoryData,
            [event.target.name]: event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value
        })
    }
    
    const handleSubmit = async function (event) {
        event.preventDefault()
        try {
            const data = await create(categoryData)
            setCategories([
                ...categories,
                data
            ])
            setCategoryData({
                name: "",
                slug: "",
                icon: "",
                isFeatured: false
            })
            setMessage("Category created successfully")
        } catch (error) {
            setMessage(error.message)
        }
    }
    
    return (
    <section>
        <header>
            <h1>Manage Categories</h1>
            <p>{message}</p>
            </header>
            
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    name="name"
                    value={categoryData.name}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="slug">Slug</label>
                <input
                    id="slug"
                    name="slug"
                    value={categoryData.slug}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="icon">Icon</label>
                <input
                    id="icon"
                    name="icon"
                    value={categoryData.icon}
                    onChange={handleChange}
                />
                <label htmlFor="isFeatured">Featured</label>
                <input
                    id="isFeatured"
                    name="isFeatured"
                    type="checkbox"
                    checked={categoryData.isFeatured}
                    onChange={handleChange}
                />
                <button type="submit">Create Category</button>
            </form>
            
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