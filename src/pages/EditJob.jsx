import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { index as categoriesIndex } from "../services/categories"
import { index as skillsIndex } from "../services/skills"
import { show, update } from "../services/jobs"
import { uploadFile } from "../services/uploads"

const EditJob = function () {
    const { jobId } = useParams()
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
        attachments: [],
        status: ""
    }

    const [formData, setFormData] = useState(initialState)
    const [categories, setCategories] = useState([])
    const [availableSkills, setAvailableSkills] = useState([])
    const [newAttachments, setNewAttachments] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(function () {
        const fetchData = async function () {
            try {
                const data = await show(jobId)
                const categoryData = await categoriesIndex()
                const skillData = await skillsIndex()

                const job = data.job

                setCategories(categoryData)
                setAvailableSkills(skillData)

                setFormData({
                    title: job.title,
                    description: job.description,
                    category: typeof job.category === "string"
                        ? job.category
                        : job.category?._id || "",
                    skills: job.skills.filter(function (skill) {
                        return skill
                    }).map(function (skill) {
                        if (typeof skill === "string") {
                            return skill
                        }

                        return skill._id
                    }),
                    budgetType: job.budgetType,
                    budgetMin: job.budgetMin,
                    budgetMax: job.budgetMax,
                    experienceLevel: job.experienceLevel,
                    duration: job.duration,
                    deadline: job.deadline
                        ? job.deadline.slice(0, 10)
                        : "",
                    attachments: job.attachments || [],
                    status: job.status
                })
            } catch (error) {
                setMessage(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [jobId])

    const handleChange = function (event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const handleSkillsChange = function (event) {
        const selectedSkills = Array.from(
            event.target.selectedOptions,
            function (option) {
                return option.value
            }
        )

        setFormData({
            ...formData,
            skills: selectedSkills
        })
    }

    const handleAttachmentsChange = function (event) {
        setNewAttachments(Array.from(event.target.files))
    }

    const handleSubmit = async function (event) {
        event.preventDefault()
        setMessage("")
        setSubmitting(true)

        try {
            const uploadedAttachments = [...formData.attachments]

            for (let i = 0; i < newAttachments.length; i++) {
                const uploadedFile = await uploadFile(newAttachments[i])

                uploadedAttachments.push({
                    url: uploadedFile.url,
                    name: uploadedFile.name,
                    size: uploadedFile.size
                })
            }

            const jobData = {
                ...formData,
                budgetMin: Number(formData.budgetMin),
                budgetMax: Number(formData.budgetMax),
                attachments: uploadedAttachments
            }

            await update(jobId, jobData)

            navigate(`/jobs/${jobId}`)
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
        <section className="card compact-page">
            <header>
                <h1>Edit Job</h1>
                <p>{message}</p>
            </header>

            <form className="compact-form compact-split" onSubmit={handleSubmit}>
                <fieldset className="compact-group">
                    <legend>Job details</legend>
                    <div className="compact-grid">
                        <div className="compact-field compact-full">
                            <label htmlFor="title">Title</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="compact-field compact-full">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="compact-field compact-full">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select category</option>

                                {categories.map(function (category) {
                                    return (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="compact-field compact-full">
                            <label htmlFor="skills">Skills</label>
                            <select
                                id="skills"
                                name="skills"
                                multiple
                                value={formData.skills}
                                onChange={handleSkillsChange}
                                required
                            >
                                {availableSkills.map(function (skill) {
                                    return (
                                        <option key={skill._id} value={skill._id}>
                                            {skill.name}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset className="compact-group">
                    <legend>Budget & timeline</legend>
                    <div className="compact-grid">
                        <div className="compact-field compact-full">
                            <label htmlFor="budgetType">Budget Type</label>
                            <select
                                id="budgetType"
                                name="budgetType"
                                value={formData.budgetType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select budget type</option>
                                <option value="fixed">Fixed</option>
                                <option value="hourly">Hourly</option>
                            </select>
                        </div>
                        <div className="compact-field">
                            <label htmlFor="budgetMin">Minimum Budget</label>
                            <input
                                id="budgetMin"
                                name="budgetMin"
                                type="number"
                                min="0"
                                value={formData.budgetMin}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="compact-field">
                            <label htmlFor="budgetMax">Maximum Budget</label>
                            <input
                                id="budgetMax"
                                name="budgetMax"
                                type="number"
                                min="0"
                                value={formData.budgetMax}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="compact-field">
                            <label htmlFor="experienceLevel">Experience Level</label>
                            <select
                                id="experienceLevel"
                                name="experienceLevel"
                                value={formData.experienceLevel}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select experience level</option>
                                <option value="entry">Entry</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="expert">Expert</option>
                            </select>
                        </div>
                        <div className="compact-field">
                            <label htmlFor="duration">Expected Duration</label>
                            <input
                                id="duration"
                                name="duration"
                                type="text"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="compact-field">
                            <label htmlFor="deadline">Deadline</label>
                            <input
                                id="deadline"
                                name="deadline"
                                type="date"
                                value={formData.deadline}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="compact-field">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="draft">Save as Draft</option>
                                <option value="open">Publish Job</option>
                            </select>
                        </div>
                        <div className="compact-field compact-full">
                            <label htmlFor="attachments">Add Attachments</label>
                            <input
                                id="attachments"
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,image/webp,application/pdf,application/zip"
                                onChange={handleAttachmentsChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <div className="compact-actions">
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Updating..." : "Update Job"}
                    </button>
                </div>
            </form>
        </section>
    )
            }

            export default EditJob