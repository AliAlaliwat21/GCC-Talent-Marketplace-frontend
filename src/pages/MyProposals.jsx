import { useEffect, useState } from "react"
import { Link } from "react-router"
import { mine, withdraw, update } from "../services/proposal"

const MyProposals = ()=>{

    const [proposals, setProposals] = useState([])
    const [message, setMessage] = useState('')

    const [editingId, setEditingId] = useState(null)

    const [editData, setEditData] = useState({
        coverLetter: '',
        amount: '',
        deliveryDays: ''
    })

    const fetchProposals = async () => {
        try {
            const data = await mine()

            setProposals(data.proposals)

        } catch (error) {
            setMessage(error.message)
        }
    }

    useEffect(() => {
        fetchProposals()
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

                </div>
            ))}

        </section>
    )
}

export default MyProposals