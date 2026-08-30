import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { myJobs } from '../services/jobs'

const MyJobs = () => {

    const [jobs, setJobs] = useState([])
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [message, setMessage] = useState("")

    useEffect(() => {

        const fetchMyJobs = async () => {
            try {

                const data = await myJobs()

                setJobs(data.jobs)

            } catch (error) {

                setMessage(error.message)

            }
        }

        fetchMyJobs()

    }, [])


    const filteredJobs =
        selectedStatus === "all"
            ? jobs
            : jobs.filter((job) => job.status === selectedStatus)


    return (
        <section>

            <header>

                <h1>My Jobs</h1>

                <Link to='/client/jobs/new'>
                    Post new Job
                </Link>

            </header>


            <p>{message}</p>


            <div>

                <button onClick={() => setSelectedStatus("all")}>
                    All
                </button>

                <button onClick={() => setSelectedStatus("draft")}>
                    Drafts
                </button>

                <button onClick={() => setSelectedStatus("open")}>
                    Open
                </button>

                <button onClick={() => setSelectedStatus("in_progress")}>
                    In Progress
                </button>

                <button onClick={() => setSelectedStatus("completed")}>
                    Completed
                </button>

                <button onClick={() => setSelectedStatus("closed")}>
                    Closed
                </button>

            </div>


            {filteredJobs.length === 0 ? (

                <p>No jobs found.</p>

            ) : (

                filteredJobs.map((job) => (

                    <div
                        className="card"
                        key={job._id}
                    >

                        <h2>{job.title}</h2>

                        <p>
                            Status: {job.status}
                        </p>

                        <p>
                            Budget: {job.budgetMin} - {job.budgetMax}
                        </p>

                        <p>
                            Proposals: {job.proposalsCount}
                        </p>


                        <Link to={`/jobs/${job._id}`}>
                            View
                        </Link>


                        {job.status === "draft" && (
                            <>
                                <Link to={`/client/jobs/${job._id}/edit`}>
                                    Edit
                                </Link>

                                <button>
                                    Delete Draft
                                </button>
                            </>
                        )}


                        {job.status === "open" && (
                            <>
                                <Link to={`/client/jobs/${job._id}/edit`}>
                                    Edit
                                </Link>

                                <Link to={`/client/jobs/${job._id}/proposals`}>
                                    View Proposals
                                </Link>

                                <button>
                                    Close Job
                                </button>
                            </>
                        )}


                        {job.status === "closed" && (
                            <button>
                                Reopen Job
                            </button>
                        )}

                    </div>

                ))

            )}

        </section>
    )
}

export default MyJobs