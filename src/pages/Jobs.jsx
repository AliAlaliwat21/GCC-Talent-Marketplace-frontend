import {useEffect, useState} from "react"
import { index } from "../services/jobs"

const Jobs = ()=>{

    const [jobs, setJobs] = useState([])
    const [message, setMessage] = useState('')

    useEffect(() =>{
        const fetchJobs = async () =>{
            try {
                const data = await index()

                setJobs(data.jobs)
            } catch (err) {
                setMessage(err.message)
                
            }
        }
        fetchJobs()
    }, [])

    return (
        <section>
            <header>
                <h1>Browse Jobs</h1>
                <p>{message}</p>
            </header>

            {jobs.map((job) =>(
                <div className = 'card' key={job._id}>

                <h2>{job.title}</h2>

                <p>{job.description}</p>

                <p>budget:{job.budgetMin} - {job.budgetMax} </p>

                <p> {job.experienceLevel}</p>

                <p> Status: {job.status}</p>

                </div>
            ))}
        </section>
    )
}

export default Jobs