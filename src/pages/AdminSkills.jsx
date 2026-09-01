import { useEffect, useState } from "react"
import { index as getSkills, create } from "../services/skills"
import { index as getCategories } from "../services/categories"

const AdminSkills = function () {
    const [skills, setSkills] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [skillData, setSkillData] = useState({
        name: "",
        slug: "",
        category: ""
    })
    
    useEffect(function () {
        const fetchData = async function () {
            try {
                const skillsData = await getSkills()
                const categoriesData = await getCategories()
                setSkills(skillsData)
                setCategories(categoriesData)
            } catch (error) {
                setMessage(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    
    const handleChange = function (event) {
        setSkillData({
            ...skillData,
            [event.target.name]: event.target.value
        })
    }
    
    const handleSubmit = async function (event) {
        event.preventDefault()
        try {
            const data = await create(skillData)
            setSkills([
                ...skills,
                data
            ])
            setSkillData({
                name: "",
                slug: "",
                category: ""
            })
            setMessage("Skill created successfully")
        } catch (error) {
            setMessage(error.message)
        }
    }
    
    return (
    <section>
        <header>
            <h1>Manage Skills</h1>
            <p>{message}</p>
            </header>
            
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    name="name"
                    value={skillData.name}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="slug">Slug</label>
                <input
                    id="slug"
                    name="slug"
                    value={skillData.slug}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    name="category"
                    value={skillData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map(function (category) {
                        return (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                        )
                    })}
                </select>
                <button type="submit">Create Skill</button>
            </form>
            
            {loading ? (
                <p>Loading...</p>
            ) : skills.length === 0 ? (
                <p>No skills found</p>
            ) : (
                skills.map(function (skill) {
                    return (
                    <div className="card" key={skill._id}>
                        <h2>{skill.name}</h2>
                        <p>Slug: {skill.slug}</p>
                        <p>Category: {skill.category}</p>
                        </div>
                        )
                    })
                )}
                </section>
                )
            }
            export default AdminSkills