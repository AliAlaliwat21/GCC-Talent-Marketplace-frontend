import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { show } from "../services/jobs"
import ProposalForm from "./ProposalForm"

const JobDetails = (props)=>{
    const {jobId} = useParams()

    const [job, setJob] = useState(null)
    const [clientJobsPosted, setClientJobsPosted] = useState(0)
    const [similarJobs, setSimilarJobs] = useState([])
    const [message, setMessage] = useState('')

    useEffect(()=>{
        const fetchJob = async ()=>{
            try {
                const data = await show(jobId)

                setJob(data.job)
                setClientJobsPosted(data.clientJobsPosted)
                setSimilarJobs(data.similarJobs)
            } catch (error) {
                setMessage(error.message)
            }
        }
        fetchJob()
    }, [jobId])

    if (message){
        return <p>{message}</p>
    }

    if (!job){
        return <p>Loading...</p>
    }

    return (
        <section>
            <header>
                <h1>{job.title}</h1>
                <p>{job.description}</p>
            </header>

            <div className="card">
                <h2>Job Details</h2>

                <p>Budget Type: {job.budgetType} </p>

                <p>
                    Budget: {job.budgetMin} - {job.budgetMax}
                </p>

                <p>
                    Experience Level: {job.experienceLevel}
                </p>

                <p>
                    Duration: {job.duration}
                </p>

                <p>
                    Status: {job.status}
                </p>
            </div>

            <div className="card">
                <h2>About the Client</h2>

                <p>
                    Username: {job.client?.username}
                </p>

                <p>
                    Jobs Posted: {clientJobsPosted}
                </p>

                <p>
                    Rating: {job.client?.ratingAvg}
                </p>

                <p>
                    Location: {job.client?.city}
                </p>
            </div>

            {props.user?.role === 'freelancer' &&(
                <ProposalForm jobId={jobId} />
            )}

            <section>
                <h2>Similar Jobs</h2>

                {similarJobs.map((similarJob) => (
                    <div className="card" key={similarJob._id}>
                        <h3>{similarJob.title}</h3>

                        <p>{similarJob.description}</p>

                        <p>
                            Budget: {similarJob.budgetMin} - {similarJob.budgetMax}
                        </p>
                    </div>
                ))}
            </section>
        </section>
    )
}

export default JobDetails