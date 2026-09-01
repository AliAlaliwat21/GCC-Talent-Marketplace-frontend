import { useEffect, useState } from "react"
import { index } from "../services/skills"

const AdminSkills = function () {
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    
    useEffect(function () {
        const fetchSkills = async function () {
            try {
                const data = await index()
                setSkills(data)
            } catch (error) {
                setMessage(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchSkills()
    }, [])
    
    return (
    <section>
        <header>
            <h1>Manage Skills</h1>
            <p>{message}</p>
            </header>
            
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