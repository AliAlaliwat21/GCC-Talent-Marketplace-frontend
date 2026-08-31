import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { index as categoriesIndex } from "../services/categories"
import { index as skillsIndex } from "../services/skills"
import { create } from "../services/jobs"
import { uploadFile } from "../services/uploads"

const CreateJob = function () {
    const navigate = useNavigate()

    const initialState = {
        title: "",
        description: "",
        category: "",
        skills: [],
        budgetType: "",
        budgetMin: "",
        budgetMax: "",
        experienceLevel: "",
        duration: "",
        deadline: "",
        status: "draft"
    }

    const [formData, setFormData] = useState(initialState)
    const [categories, setCategories] = useState([])
    const [availableSkills, setAvailableSkills] = useState([])
    const [attachments, setAttachments] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(function () {
        const fetchFormData = async function () {
            try {
                const categoryData = await categoriesIndex()
                const skillData = await skillsIndex()

                setCategories(categoryData)
                setAvailableSkills(skillData)
            } catch (error) {
                setMessage(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchFormData()
    }, [])

    const handleChange = function (event) {
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    const handleSkillsChange = function (event) {
        const selectedSkills = Array.from(
            event.target.selectedOptions,
            function (option) {
                return option.value
            }
        )

        setFormData({...formData, skills: selectedSkills})
    }

    const handleAttachmentsChange = function (event) {
        setAttachments(Array.from(event.target.files))
    }

    const handleSubmit = async function (event) {
        event.preventDefault()
        setMessage("")
        setSubmitting(true)

        try {
            const uploadedAttachments = []

            for (let i = 0; i < attachments.length; i++) {
                const uploadedFile = await uploadFile(attachments[i])

                uploadedAttachments.push({
                    url: uploadedFile.url,
                    name: uploadedFile.name,
                    size: uploadedFile.size
                })
            }

            const jobData = {...formData,
                budgetMin: Number(formData.budgetMin),
                budgetMax: Number(formData.budgetMax),
                attachments: uploadedAttachments
            }

            const createdJob = await create(jobData)

            navigate(`/jobs/${createdJob._id}`)
        } catch (error) {
            setMessage(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <p>Loading...</p>
    }

    return (
    <section className="card">
        <header>
            <h1>Create Job</h1>
            <p>{message}</p>
            </header>

            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required/>

                <label htmlFor="description">Description</label>
                <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required/>

                <label htmlFor="category">Category</label>
                <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required>
                    <option value="">Select category</option>

                    {categories.map(function (category) {
                        return (
                        <option key={category._id} value={category._id}>
                            {category.name}
                            </option>
                            )
                        })}
                    </select>

                <label htmlFor="skills">Skills</label>
                <select
                id="skills"
                name="skills"
                multiple
                value={formData.skills}
                onChange={handleSkillsChange}
                required>
                    {availableSkills.map(function (skill) {
                        return (
                        <option key={skill._id} value={skill._id}>
                            {skill.name}
                            </option>
                            )
                        })}
                    </select>

                <label htmlFor="budgetType">Budget Type</label>
                <select
                id="budgetType"
                name="budgetType"
                value={formData.budgetType}
                onChange={handleChange}
                required>
                    <option value="">Select budget type</option>
                    <option value="fixed">Fixed</option>
                    <option value="hourly">Hourly</option>
                    </select>

                <label htmlFor="budgetMin">Minimum Budget</label>
                <input
                id="budgetMin"
                name="budgetMin"
                type="number"
                min="0"
                value={formData.budgetMin}
                onChange={handleChange}
                required/>

                <label htmlFor="budgetMax">Maximum Budget</label>
                <input
                id="budgetMax"
                name="budgetMax"
                type="number"
                min="0"
                value={formData.budgetMax}
                onChange={handleChange}
                required/>

                <label htmlFor="experienceLevel">Experience Level</label>
                <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                required>
                    <option value="">Select experience level</option>
                    <option value="entry">Entry</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                    </select>

                <label htmlFor="duration">Expected Duration</label>
                <input
                id="duration"
                name="duration"
                type="text"
                value={formData.duration}
                onChange={handleChange}
                required/>

                <label htmlFor="deadline">Deadline</label>
                <input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                required/>

                <label htmlFor="attachments">Attachments</label>
                <input
                id="attachments"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,application/pdf,application/zip"
                onChange={handleAttachmentsChange}/>

                <label htmlFor="status">Status</label>
                <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}>
                    <option value="draft">Save as Draft</option>
                    <option value="open">Publish Job</option>
                    </select>

                <button type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : "Save Job"}
                    </button>
                </form>
                </section>
                )
            }

            export default CreateJob