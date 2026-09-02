import { useEffect, useState } from "react"
import { useParams } from "react-router"

import {
    getJobProposals,
    shortlist,
    decline,
    accept
} from "../services/proposal"


const JobProposals = () => {

    const { jobId } = useParams()

    const [proposals, setProposals] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)

    const [selectedProposalId, setSelectedProposalId] = useState(null)

    const [milestoneData, setMilestoneData] = useState({
        title: '',
        description: '',
        dueDate: ''
    })


    const fetchProposals = async () => {
        setLoading(true)

        try {

            const data = await getJobProposals(jobId)

            setProposals(data.proposals)

        } catch (error) {

            setMessage(error.message)

        } finally {

            setLoading(false)

        }
    }


    useEffect(() => {
        fetchProposals()
    }, [jobId])


    const handleShortlist = async (proposalId) => {
        try {

            await shortlist(proposalId)

            setMessage('Proposal shortlisted.')

            fetchProposals()

        } catch (error) {

            setMessage(error.message)

        }
    }


    const handleDecline = async (proposalId) => {
        try {

            await decline(proposalId)

            setMessage('Proposal declined.')

            fetchProposals()

        } catch (error) {

            setMessage(error.message)

        }
    }


    const handleMilestoneChange = (event) => {

        setMilestoneData({
            ...milestoneData,
            [event.target.name]: event.target.value
        })

    }


    const handleAccept = async (proposal) => {
        try {

            const milestone = {
                title: milestoneData.title,
                description: milestoneData.description,
                amount: proposal.amount
            }

            if (milestoneData.dueDate) {
                milestone.dueDate = milestoneData.dueDate
            }

            await accept(
                proposal._id,
                [milestone]
            )

            setMessage('Proposal accepted and contract created.')

            setSelectedProposalId(null)

            setMilestoneData({
                title: '',
                description: '',
                dueDate: ''
            })

            fetchProposals()

        } catch (error) {

            setMessage(error.message)

        }
    }

    if (loading) {
        return <p>Loading job proposals...</p>
    }


    return (
        <section>

            <header>
                <h1>Job Proposals</h1>

                <p>{message}</p>
            </header>


            {proposals.length === 0 && (
                <p>No proposals have been submitted yet.</p>
            )}


            {proposals.map((item) => {

                const proposal = item.proposal

                const profile = item.freelancerProfile

                return (

                    <div
                        className="card"
                        key={proposal._id}
                    >

                        <h2>
                            {proposal.freelancer?.username}
                        </h2>


                        <p>
                            Rating: {proposal.freelancer?.ratingAvg}
                        </p>


                        {profile && (
                            <>
                                <p>
                                    {profile.headline}
                                </p>

                                <p>
                                    Skills:
                                </p>

                                <ul>
                                    {profile.skills?.map((skill) => (
                                        <li key={skill._id}>
                                            {skill.name}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}


                        <h3>Proposal</h3>

                        <p>
                            {proposal.coverLetter}
                        </p>

                        <p>
                            Amount: {proposal.amount}
                        </p>

                        <p>
                            Delivery Days: {proposal.deliveryDays}
                        </p>

                        <p>
                            Status: {proposal.status}
                        </p>


                        {proposal.status === "pending" && (
                            <button
                                onClick={() => handleShortlist(proposal._id)}
                            >
                                Shortlist
                            </button>
                        )}


                        {(proposal.status === "pending" ||
                            proposal.status === "shortlisted") && (
                            <>

                                <button
                                    onClick={() => handleDecline(proposal._id)}
                                >
                                    Decline
                                </button>

                                <button
                                    onClick={() =>
                                        setSelectedProposalId(proposal._id)
                                    }
                                >
                                    Accept
                                </button>

                            </>
                        )}


                        {selectedProposalId === proposal._id && (

                            <div>

                                <h3>Create Contract Milestone</h3>

                                <label>
                                    Milestone Title:
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={milestoneData.title}
                                    onChange={handleMilestoneChange}
                                    required
                                />


                                <label>
                                    Description:
                                </label>

                                <textarea
                                    name="description"
                                    value={milestoneData.description}
                                    onChange={handleMilestoneChange}
                                />


                                <label>
                                    Due Date:
                                </label>

                                <input
                                    type="date"
                                    name="dueDate"
                                    value={milestoneData.dueDate}
                                    onChange={handleMilestoneChange}
                                />


                                <p>
                                    Milestone Amount: {proposal.amount}
                                </p>


                                <button
                                    disabled={!milestoneData.title}
                                    onClick={() => handleAccept(proposal)}
                                >
                                    Confirm Acceptance
                                </button>


                                <button
                                    onClick={() =>
                                        setSelectedProposalId(null)
                                    }
                                >
                                    Cancel
                                </button>

                            </div>

                        )}

                    </div>

                )

            })}

        </section>
    )
}


export default JobProposals
