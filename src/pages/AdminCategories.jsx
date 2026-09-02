import PagedList from "../components/PagedList"
import { useEffect, useState } from "react"
import { index, create, update, deleteCategory } from "../services/categories"

const AdminCategories = function () {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [editingId, setEditingId] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
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
    
    const handleEdit = function (category) {
        setEditingId(category._id)
        setCategoryData({
            name: category.name,
            slug: category.slug,
            icon: category.icon,
            isFeatured: category.isFeatured
        })
    }
    
    const handleSubmit = async function (event) {
        event.preventDefault()
        try {
            if (editingId) {
                const data = await update(editingId, categoryData)
                setCategories(categories.map(function (category) {
                    if (category._id === editingId) {
                        return data
                    }
                    return category
                }))
                setEditingId(null)
                setMessage("Category updated successfully")
            } else {
                const data = await create(categoryData)
                setCategories([
                    ...categories,
                    data
                ])
                setMessage("Category created successfully")
            }
            setCategoryData({
                name: "",
                slug: "",
                icon: "",
                isFeatured: false
            })
        } catch (error) {
            setMessage(error.message)
        }
    }
    
    const handleDelete = async function (categoryId) {
        try {
            const data = await deleteCategory(categoryId)
            setCategories(categories.filter(function (category) {
                return category._id !== categoryId
            }))
            setDeleteId(null)
            setMessage(data.message)
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

            <form className="compact-form" onSubmit={handleSubmit}>
                <div className="compact-grid">
                    <div className="compact-field">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            value={categoryData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="compact-field">
                        <label htmlFor="slug">Slug</label>
                        <input
                            id="slug"
                            name="slug"
                            value={categoryData.slug}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="compact-field">
                        <label htmlFor="icon">Icon</label>
                        <input
                            id="icon"
                            name="icon"
                            value={categoryData.icon}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="compact-field">
                        <label htmlFor="isFeatured">Featured</label>
                        <input
                            id="isFeatured"
                            name="isFeatured"
                            type="checkbox"
                            checked={categoryData.isFeatured}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="compact-actions">
                    <button type="submit">
                        {editingId ? "Update Category" : "Create Category"}
                    </button>
                </div>
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : categories.length === 0 ? (
                <p>No categories found</p>
            ) : (
                <PagedList label="Categories" pageSize={6} className="compact-card-grid">
                    {categories.map(function (category) {
                        return (
                            <div className="card" key={category._id}>
                                <h2>{category.name}</h2>
                                <p>Slug: {category.slug}</p>
                                <p>Icon: {category.icon}</p>
                                <p>Featured: {category.isFeatured ? "Yes" : "No"}</p>
                                <button
                                    onClick={function () {
                                        handleEdit(category)
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={function () {
                                        setDeleteId(category._id)
                                    }}
                                >
                                    Delete
                                </button>
                                {deleteId === category._id && (
                                    <div>
                                        <p>Are you sure you want to delete this category?</p>
                                        <button
                                            onClick={function () {
                                                handleDelete(category._id)
                                            }}
                                        >
                                            Yes, Delete
                                        </button>
                                        <button
                                            onClick={function () {
                                                setDeleteId(null)
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </PagedList>
            )}
        </section>
    )
            }
            export default AdminCategories