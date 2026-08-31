import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { closeJob, deleteDraft, myJobs, reopenJob } from '../services/jobs'

const MyJobs = function () {

    const [jobs, setJobs] = useState([])
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [message, setMessage] = useState("")
    
    useEffect(function () {
        const fetchMyJobs = async function () {
            try {
                const data = await myJobs()
                setJobs(data.jobs)
            
            } catch (error) {
                setMessage(error.message)
            }
        }
        fetchMyJobs()
    }, [])
    
    const handleDeleteDraft = async function (jobId) {
        setMessage("")
        
        try {
            await deleteDraft(jobId)
            
            setJobs(jobs.filter(function (job) {
                return job._id !== jobId
            }))
        } catch (error) {
            setMessage(error.message)
        }
    }

    const handleCloseJob = async function (jobId) {
        setMessage("")
        
        try {
            await closeJob(jobId)
            
            setJobs(jobs.map(function (job) {
                if (job._id === jobId) {
                    return {...job, status: "closed"}
                }

                return job
            }))
        } catch (error) {
            setMessage(error.message)
        }
    }

    const handleReopenJob = async function (jobId) {
        setMessage("")
        
        try {
            await reopenJob(jobId)
            
            setJobs(jobs.map(function (job) {
                if (job._id === jobId) {
                    return {...job, status: "open"}
                }

                return job
            }))
        } catch (error) {
            setMessage(error.message)
        }
    }
    
    const filteredJobs =
    selectedStatus === "all"
    ? jobs
    : jobs.filter(function (job) {
        return job.status === selectedStatus
    })
    
    return (
    <section>
        <header>
            <h1>My Jobs</h1><Link to='/client/jobs/new'>Post new Job</Link>
            </header>
            <p>{message}</p>
            <div>
                
                <button onClick={function () {
                    setSelectedStatus("all")
                    }}>All</button>
                    
                    <button onClick={function () {
                        setSelectedStatus("draft")
                        }}>Drafts</button>
                        
                        <button onClick={function () {
                            setSelectedStatus("open")
                            }}>Open</button>
                            
                            <button onClick={function () {
                                setSelectedStatus("in_progress")
                                }}>In Progress</button>
                                
                                <button onClick={function () {
                                    setSelectedStatus("completed")
                                    }}>Completed</button>
                                    
                                    <button onClick={function () {
                                        setSelectedStatus("closed")
                                        }}>Closed</button>
                                        </div>
                                        
                                        {filteredJobs.length === 0 ? (
                                            <p>No jobs found</p>
                                        ) : (
                                            
                                            filteredJobs.map(function (job) {
                                                return (
                                                
                                                <div
                                                className="card"
                                                key={job._id}>
                                                    <h2>{job.title}</h2>
                                                    <p>Status: {job.status}</p>
                                                    
                                                    <p>Budget: {job.budgetMin} - {job.budgetMax}</p>
                                                    
                                                    <p>Proposals: {job.proposalsCount}</p>
                                                    
                                                    <Link to={`/jobs/${job._id}`}>View</Link>
                                                    
                                                    {job.status === "draft" && (
                                                        <>
                                                        <Link to={`/client/jobs/${job._id}/edit`}>Edit</Link>
                                                        
                                                        <button onClick={function () {
                                                            handleDeleteDraft(job._id)
                                                            }}>
                                                                Delete Draft</button>
                                                                </>
                                                            )}
                                                            
                                                            {job.status === "open" && (
                                                                <>
                                                                <Link to={`/client/jobs/${job._id}/edit`}>Edit</Link>
                                                                <Link to={`/client/jobs/${job._id}/proposals`}>View Proposals</Link>
                                                                
                                                                <button onClick={function () {
                                                                    handleCloseJob(job._id)
                                                                    }}>Close Job</button>
                                                                </>
                                                            )}
                                                            {job.status === "closed" && (
                                                                <button onClick={function () {
                                                                    handleReopenJob(job._id)
                                                                    }}>Reopen Job</button>
                                                                )}
                                                                </div>
                                                                )
                                                            })
                                                            )}
                                                            </section>
                                                            )
                                                        }
                                                        export default MyJobs