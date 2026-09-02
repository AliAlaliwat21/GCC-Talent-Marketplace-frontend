import PagedList from "../components/PagedList"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { show } from "../services/jobs"
import ProposalForm from "./ProposalForm"

const JobDetails = function (props) {
    const {jobId} = useParams()

    const [job, setJob] = useState(null)
    const [clientJobsPosted, setClientJobsPosted] = useState(0)
    const [similarJobs, setSimilarJobs] = useState([])
    const [message, setMessage] = useState('')

    useEffect(function () {
        const fetchJob = async function () {
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

            <div className="compact-columns">
                <div className="card">
                    <h2>Job Details</h2>

                    <p>Budget Type: {job.budgetType} </p>

                    <p>
                        Budget: {job.budgetMin} - {job.budgetMax}
                    </p>

                    <p>Experience Level: {job.experienceLevel}</p>

                    <p>Duration: {job.duration}</p>

                    <p>Status: {job.status}</p>

                    <p>Proposals: {job.proposalsCount}</p>

                    {job.attachments?.length > 0 && (
                        <div>
                            <h3>Attachments</h3>
                            
                            {job.attachments.map((attachment) => (
                                <div key={attachment._id || attachment.url}>
                                    {/\.(jpg|jpeg|png|webp)$/i.test(attachment.name || "") && (
                                        <img
                                        src={attachment.url}
                                        alt={attachment.name || "Job attachment"}
                                        width="220"
                    />
                )}
                <p>
                    <a
                        href={attachment.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {attachment.name || "View attachment"}
                    </a>
                </p>
            </div>
        ))}
    </div>
)}
                </div>

                <div className="card">
                    <h2>About the Client</h2>

                    <p>Username: {job.client?.username}</p>

                    <p>Jobs Posted: {clientJobsPosted}</p>

                    <p>Rating: {job.client?.ratingAvg}</p>

                    <p>Verified: {job.client?.isVerified ? "Yes" : "No"}</p>

                    <p>Location: {job.client?.city}</p>
                </div>
            </div>
            {props.user?.role === "freelancer" && job.status === "open" && (
                <ProposalForm jobId={jobId} />
            )}

            <section>
                <h2>Similar Jobs</h2>

                {similarJobs.length === 0 ? (
                    <p>No similar jobs found</p>
                ) : (
                    <PagedList label="Similar jobs" pageSize={6} className="compact-card-grid">
                        {similarJobs.map(function (similarJob) {
                            return (
                                <div className="card" key={similarJob._id}>
                                    <h3>{similarJob.title}</h3>
                                    <p>{similarJob.description}</p>
                                    <p>
                                        Budget: {similarJob.budgetMin} - {similarJob.budgetMax}
                                    </p>
                                    <Link to={`/jobs/${similarJob._id}`}>View Job</Link>
                                </div>
                            )
                        })}
                    </PagedList>
                )}
            </section>
        </section>
    )
                    }
                    export default JobDetails
