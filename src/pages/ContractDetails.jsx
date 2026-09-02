import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { addMilestone, show, updateMilestone } from "../services/contracts"

const ContractDetails = (props)=>{

    const {contractId} = useParams()

    const [contract, setContract] = useState(null)
    const [moneySummary, setMoneySummary] = useState(null)
    const [timeline, setTimeline] = useState([])
    const [messages, setMessages] = useState([])

    const [message, setMessage] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [milestoneData, setMilestoneData] = useState({
        title: '',
        description: '',
        amount: '',
        dueDate: ''
    })

    const fetchContract = async()=>{
        try {
            const data = await show(contractId)
            setContract(data.contract)
            setMoneySummary(data.moneySummary)
            setTimeline(data.timeline)
            setMessages(data.messages)
        } catch (error) {
            setMessage(error.message)
        }
    }

    useEffect(()=>{
        fetchContract()
    }, [contractId])

    const handleMilestoneChange = (event)=>{
        setMilestoneData({
            ...milestoneData,
            [event.target.name]: event.target.value
        })
    }

    const handleMilestoneSubmit = async(event)=>{
        event.preventDefault()
        setMessage('')

        try {
            const dataToSend = {
                ...milestoneData,
                amount: Number(milestoneData.amount)
            }

            if (editingId) {
                await updateMilestone(contractId, editingId, dataToSend)
                setMessage('Milestone updated successfully')
            } else {
                await addMilestone(contractId, dataToSend)
                setMessage('Milestone added successfully')
            }

            setEditingId(null)
            setMilestoneData({
                title: '',
                description: '',
                amount: '',
                dueDate: ''
            })
            fetchContract()
        } catch (error) {
            setMessage(error.message)
        }
    }

    const handleEditMilestone = (milestone)=>{
        setEditingId(milestone._id)
        setMilestoneData({
            title: milestone.title,
            description: milestone.description || '',
            amount: milestone.amount,
            dueDate: milestone.dueDate
                ? milestone.dueDate.slice(0, 10)
                : ''
        })
    }

    if (!contract){
        return <p>{message || 'Loading...'}</p>
    }

    const isClient = props.user?._id === contract.client?._id

    return(
        <section>
            <header>
                <h1>{contract.title}</h1>

                <p>{message}</p>

                <p>
                    Status: {contract.status}
                </p>

                <p>
                    Total: {contract.totalAmount} {contract.currency}
                </p>
            </header>

            <h2>Milestones</h2>

            {isClient && contract.status === 'active' && (
                <form onSubmit={handleMilestoneSubmit}>
                    <h3>{editingId ? 'Edit Milestone' : 'Add Milestone'}</h3>

                    <label htmlFor="milestoneTitle">Title</label>
                    <input
                        id="milestoneTitle"
                        name="title"
                        value={milestoneData.title}
                        onChange={handleMilestoneChange}
                        required
                    />

                    <label htmlFor="milestoneDescription">Description</label>
                    <textarea
                        id="milestoneDescription"
                        name="description"
                        value={milestoneData.description}
                        onChange={handleMilestoneChange}
                    />

                    <label htmlFor="milestoneAmount">Amount</label>
                    <input
                        id="milestoneAmount"
                        name="amount"
                        type="number"
                        min="1"
                        value={milestoneData.amount}
                        onChange={handleMilestoneChange}
                        required
                    />

                    <label htmlFor="milestoneDueDate">Due Date</label>
                    <input
                        id="milestoneDueDate"
                        name="dueDate"
                        type="date"
                        value={milestoneData.dueDate}
                        onChange={handleMilestoneChange}
                    />

                    <button type="submit">
                        {editingId ? 'Update Milestone' : 'Add Milestone'}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={()=>setEditingId(null)}
                        >
                            Cancel
                        </button>
                    )}
                </form>
            )}

            {contract.milestones.map((milestone) => (

                    <div
                        className="card"
                        key={milestone._id}
                    >

                        <h3>{milestone.title}</h3>

                        <p>
                            {milestone.description}
                        </p>

                        <p>
                            Amount: {milestone.amount}
                        </p>

                        <p>
                            Status: {milestone.status}
                        </p>

                        {milestone.dueDate && (
                            <p>
                                Due: {
                                    new Date(
                                        milestone.dueDate
                                    ).toLocaleDateString()
                                }
                            </p>
                        )}

                        <p>
                            Escrow: {milestone.escrowAmount}
                        </p>

                        {isClient && milestone.status === 'pending' && (
                            <button onClick={()=>handleEditMilestone(milestone)}>
                                Edit Milestone
                            </button>
                        )}

                    </div>

                ))}

                {moneySummary && (
    <section>
        <h2>Payment Summary</h2>

        <div className="card">
            <p>
                Total Amount: {moneySummary.totalAmount} {moneySummary.currency}
            </p>

            <p>
                In Escrow: {moneySummary.inEscrow} {moneySummary.currency}
            </p>

            <p>
                Released: {moneySummary.released} {moneySummary.currency}
            </p>

            <p>
                Platform Fees: {moneySummary.platformFees} {moneySummary.currency}
            </p>

            <p>
                Freelancer Received: {moneySummary.freelancerReceived} {moneySummary.currency}
            </p>

            <p>
                Refunded: {moneySummary.refunded} {moneySummary.currency}
            </p>

            <p>
                Remaining Unfunded: {moneySummary.remainingUnfunded} {moneySummary.currency}
            </p>
        </div>
    </section>
)}

<section>
    <h2>Activity</h2>

    {timeline.length === 0 ? (
        <p>No activity yet.</p>
    ) : (
        timeline.map((activity) => (
            <div
                className="card"
                key={activity._id}
            >
                <p>{activity.message}</p>

                {activity.by && (
                    <p>
                        By: {activity.by.username}
                    </p>
                )}
            </div>
        ))
    )}
</section>

<section>
    <h2>Messages</h2>

    {messages.length === 0 ? (
        <p>No messages yet.</p>
    ) : (
        messages.map((contractMessage) => (
            <div
                className="card"
                key={contractMessage._id}
            >
                <p>{contractMessage.text}</p>

                {contractMessage.sender && (
                    <p>
                        From: {contractMessage.sender.username}
                    </p>
                )}
            </div>
        ))
    )}
</section>
        </section>
    )
}

export default ContractDetails
