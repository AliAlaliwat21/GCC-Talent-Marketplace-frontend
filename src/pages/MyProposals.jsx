import { useEffect, useState } from "react"
import { Link } from "react-router"
import { mine, withdraw, update } from "../services/proposal"

const MyProposals = ()=>{

    const [proposals, setProposals] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)

    const [editingId, setEditingId] = useState(null)

    const [editData, setEditData] = useState({
        coverLetter: '',
        amount: '',
        deliveryDays: ''
    })

    const fetchProposals = async () => {
        setLoading(true)

        try {
            const data = await mine()

            setProposals(data.proposals)

        } catch (error) {
            setMessage(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchInitialProposals = async () => {
            try {
                const data = await mine()
                setProposals(data.proposals)
            } catch (error) {
                setMessage(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchInitialProposals()
    }, [])

     const handleEditClick = (proposal) => {

        setEditingId(proposal._id)

        setEditData({
            coverLetter: proposal.coverLetter,
            amount: proposal.amount,
            deliveryDays: proposal.deliveryDays
        })
    }


    const handleChange = (event) => {

        setEditData({
            ...editData,
            [event.target.name]: event.target.value
        })
    }


    const handleUpdate = async (event, proposalId) => {

        event.preventDefault()

        try {

            const dataToSend = {
                coverLetter: editData.coverLetter,
                amount: Number(editData.amount),
                deliveryDays: Number(editData.deliveryDays)
            }

            await update(proposalId, dataToSend)

            setMessage('Proposal updated successfully.')

            setEditingId(null)

            fetchProposals()

        } catch (error) {

            setMessage(error.message)

        }
    }


    const handleWithdraw = async (proposalId) => {

        try {

            await withdraw(proposalId)

            setMessage('Proposal withdrawn successfully.')

            fetchProposals()

        } catch (error) {

            setMessage(error.message)

        }
    }


    const handleCancelEdit = () => {

        setEditingId(null)

        setEditData({
            coverLetter: '',
            amount: '',
            deliveryDays: ''
        })
    }

    if (loading) {
        return <p>Loading proposals...</p>
    }

    return (
        <section>

            <header>
                <h1>My Proposals</h1>
                <p>{message}</p>
            </header>


            {proposals.length === 0 && (
                <p>You have not submitted any proposals yet.</p>
            )}


            {proposals.map((proposal) => (

                <div
                    className="card"
                    key={proposal._id}
                >

                    <h2>
                        {proposal.job?.title}
                    </h2>


                    {editingId === proposal._id ? (

                        <form
                            onSubmit={(event) =>
                                handleUpdate(event, proposal._id)
                            }
                        >

                            <h3>Edit Proposal</h3>


                            <label>
                                Cover Letter:
                            </label>

                            <textarea
                                name="coverLetter"
                                value={editData.coverLetter}
                                onChange={handleChange}
                                required
                            />


                            <label>
                                Amount:
                            </label>

                            <input
                                type="number"
                                name="amount"
                                value={editData.amount}
                                onChange={handleChange}
                                min="1"
                                required
                            />


                            <label>
                                Delivery Days:
                            </label>

                            <input
                                type="number"
                                name="deliveryDays"
                                value={editData.deliveryDays}
                                onChange={handleChange}
                                min="1"
                                required
                            />


                            <button type="submit">
                                Save Changes
                            </button>

                            <button
                                type="button"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>

                        </form>

                    ) : (

                        <>
                            <p>
                                Amount: {proposal.amount}
                            </p>

                            <p>
                                Delivery Days: {proposal.deliveryDays}
                            </p>

                            <p>
                                Status: {proposal.status}
                            </p>

                            <p>
                                Cover Letter: {proposal.coverLetter}
                            </p>


                            {proposal.job && (
                                <Link to={`/jobs/${proposal.job._id}`}>
                                    View Job
                                </Link>
                            )}


                            {proposal.status === "pending" && (
                                <>
                                    <button
                                        onClick={() =>
                                            handleEditClick(proposal)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleWithdraw(proposal._id)
                                        }
                                    >
                                        Withdraw
                                    </button>
                                </>
                            )}

                        </>

                    )}

                </div>

            ))}

        </section>
    )
}

export default MyProposals
