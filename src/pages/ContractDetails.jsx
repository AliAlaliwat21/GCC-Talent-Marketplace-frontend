import { useEffect, useState } from "react"
import { useParams } from "react-router"

import {
    show,
    fundMilestone,
    deliverMilestone,
    approveMilestone,
    requestRevision,
    addMilestone,
    updateMilestone,
    cancelContract,
    sendMessage
} from "../services/contracts"


const ContractDetails = (props) => {

    const { contractId } = useParams()

    const [contract, setContract] = useState(null)

    const [moneySummary, setMoneySummary] = useState(null)

    const [timeline, setTimeline] = useState([])

    const [messages, setMessages] = useState([])

    const [message, setMessage] = useState('')


    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null)
    const [deliveryMessage, setDeliveryMessage] = useState('')

    const [selectedRevisionId, setSelectedRevisionId] = useState(null)
    const [revisionNote, setRevisionNote] = useState('')

    const [showAddMilestone, setShowAddMilestone] = useState(false)

    const [newMilestoneData, setNewMilestoneData] = useState({
        title: '',
        description: '',
        amount: '',
        dueDate: ''
    })

    const [editingMilestoneId, setEditingMilestoneId] = useState(null)

    const [editMilestoneData, setEditMilestoneData] = useState({
        title: '',
        description: '',
        amount: '',
        dueDate: ''
    })

    const [showCancelConfirm, setShowCancelConfirm] = useState(false)

    const [contractMessage, setContractMessage] = useState('')

    const fetchContract = async () => {
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


    useEffect(() => {
        fetchContract()
    }, [contractId])

    const handleFundMilestone = async (milestoneId) => {
        try {

            await fundMilestone(
                contractId,
                milestoneId
            )

            setMessage('Milestone funded successfully.')

            await fetchContract()

        } catch (error) {

            setMessage(error.message)

        }
    }


    const handleDeliverMilestone = async (milestoneId) => {
        try {

            const deliveryData = {
                message: deliveryMessage
            }

            await deliverMilestone(
                contractId,
                milestoneId,
                deliveryData
            )

            setMessage('Work delivered successfully.')

            setSelectedDeliveryId(null)

            setDeliveryMessage('')

            await fetchContract()

        } catch (error) {

            setMessage(error.message)

        }
    }


    const handleApproveMilestone = async (milestoneId) => {
        try {

            await approveMilestone(
                contractId,
                milestoneId
            )

            setMessage('Milestone approved successfully.')

            await fetchContract()

        } catch (error) {

            setMessage(error.message)

        }
    }

    const handleRequestRevision = async (milestoneId) => {
        try {

            await requestRevision(
                contractId,
                milestoneId,
                revisionNote
            )

            setMessage('Revision requested successfully.')

            setSelectedRevisionId(null)

            setRevisionNote('')

            await fetchContract()

        } catch (error) {

            setMessage(error.message)

        }
    }


    const handleNewMilestoneChange = (event) => {

        setNewMilestoneData({
            ...newMilestoneData,
            [event.target.name]: event.target.value
        })
    }


    const handleAddMilestone = async (event) => {

        event.preventDefault()

        try {

            const dataToSend = {
                title: newMilestoneData.title,
                description: newMilestoneData.description,
                amount: Number(newMilestoneData.amount)
            }

            if (newMilestoneData.dueDate) {
                dataToSend.dueDate =
                    newMilestoneData.dueDate
            }

            await addMilestone(
                contractId,
                dataToSend
            )

            setMessage('Milestone added successfully.')

            setNewMilestoneData({
                title: '',
                description: '',
                amount: '',
                dueDate: ''
            })

            setShowAddMilestone(false)

            await fetchContract()

        } catch (error) {

            setMessage(error.message)

        }
    }

    const handleEditMilestoneClick = (milestone) => {

        setEditingMilestoneId(milestone._id)

        setEditMilestoneData({
            title: milestone.title,
            description: milestone.description || '',
            amount: milestone.amount,

            dueDate: milestone.dueDate
                ? milestone.dueDate.split('T')[0]
                : ''
        })
    }


    const handleEditMilestoneChange = (event) => {

        setEditMilestoneData({
            ...editMilestoneData,
            [event.target.name]: event.target.value
        })
    }


    const handleUpdateMilestone = async (
        event,
        milestoneId
    ) => {

        event.preventDefault()

        try {

            const dataToSend = {
                title: editMilestoneData.title,
                description: editMilestoneData.description,
                amount: Number(editMilestoneData.amount)
            }

            if (editMilestoneData.dueDate) {
                dataToSend.dueDate =
                    editMilestoneData.dueDate
            }

            await updateMilestone(
                contractId,
                milestoneId,
                dataToSend
            )

            setMessage('Milestone updated successfully.')

            setEditingMilestoneId(null)

            await fetchContract()

        } catch (error) {

            setMessage(error.message)

        }
    }

    const handleCancelContract = async () => {
        try {

            await cancelContract(contractId)

            setMessage('Contract cancelled successfully.')

            setShowCancelConfirm(false)

            await fetchContract()

        } catch (error) {

            setMessage(error.message)

        }
    }

    const handleSendMessage = async (event) => {

        event.preventDefault()

        try {

            await sendMessage(
                contractId,
                contractMessage
            )

            setContractMessage('')

            await fetchContract()

        } catch (error) {

            setMessage(error.message)

        }
    }


    if (!contract) {
        return (
            <p>
                {message || 'Loading...'}
            </p>
        )
    }


    return (
        <section>

            <header>

                <h1>
                    {contract.title}
                </h1>

                <p>{message}</p>

                <p>
                    Status: {contract.status}
                </p>

                <p>
                    Total: {contract.totalAmount} {contract.currency}
                </p>

            </header>


            {props.user?.role === "client" &&
                contract.status === "active" && (

                <button
                    type="button"
                    onClick={() =>
                        setShowAddMilestone(true)
                    }
                >
                    Add Milestone
                </button>

            )}


            {showAddMilestone && (

                <form onSubmit={handleAddMilestone}>

                    <h3>Add Milestone</h3>

                    <label>
                        Title:
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={newMilestoneData.title}
                        onChange={handleNewMilestoneChange}
                        required
                    />


                    <label>
                        Description:
                    </label>

                    <textarea
                        name="description"
                        value={newMilestoneData.description}
                        onChange={handleNewMilestoneChange}
                    />


                    <label>
                        Amount:
                    </label>

                    <input
                        type="number"
                        name="amount"
                        value={newMilestoneData.amount}
                        onChange={handleNewMilestoneChange}
                        min="1"
                        required
                    />


                    <label>
                        Due Date:
                    </label>

                    <input
                        type="date"
                        name="dueDate"
                        value={newMilestoneData.dueDate}
                        onChange={handleNewMilestoneChange}
                    />


                    <button type="submit">
                        Add Milestone
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            setShowAddMilestone(false)
                        }
                    >
                        Cancel
                    </button>

                </form>

            )}

            <section>

                <h2>Milestones</h2>


                {contract.milestones.map((milestone) => (

                    <div
                        className="card"
                        key={milestone._id}
                    >

                        <h3>
                            {milestone.title}
                        </h3>


                        <p>
                            {milestone.description}
                        </p>


                        <p>
                            Amount: {milestone.amount} {contract.currency}
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
                            Escrow: {milestone.escrowAmount} {contract.currency}
                        </p>

                        {props.user?.role === "client" &&
                            contract.status === "active" &&
                            milestone.status === "pending" && (

                            <button
                                type="button"
                                onClick={() =>
                                    handleFundMilestone(
                                        milestone._id
                                    )
                                }
                            >
                                Fund Milestone
                            </button>

                        )}

                        {props.user?.role === "client" &&
                            contract.status === "active" &&
                            milestone.status === "pending" && (

                            <button
                                type="button"
                                onClick={() =>
                                    handleEditMilestoneClick(
                                        milestone
                                    )
                                }
                            >
                                Edit Milestone
                            </button>

                        )}

                        {editingMilestoneId === milestone._id && (

                            <form
                                onSubmit={(event) =>
                                    handleUpdateMilestone(
                                        event,
                                        milestone._id
                                    )
                                }
                            >

                                <h4>
                                    Edit Milestone
                                </h4>


                                <label>
                                    Title:
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={editMilestoneData.title}
                                    onChange={handleEditMilestoneChange}
                                    required
                                />


                                <label>
                                    Description:
                                </label>

                                <textarea
                                    name="description"
                                    value={editMilestoneData.description}
                                    onChange={handleEditMilestoneChange}
                                />


                                <label>
                                    Amount:
                                </label>

                                <input
                                    type="number"
                                    name="amount"
                                    value={editMilestoneData.amount}
                                    onChange={handleEditMilestoneChange}
                                    min="1"
                                    required
                                />


                                <label>
                                    Due Date:
                                </label>

                                <input
                                    type="date"
                                    name="dueDate"
                                    value={editMilestoneData.dueDate}
                                    onChange={handleEditMilestoneChange}
                                />


                                <button type="submit">
                                    Save Changes
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingMilestoneId(null)
                                    }
                                >
                                    Cancel
                                </button>

                            </form>

                        )}

                        {props.user?.role === "freelancer" &&
                            contract.status === "active" &&
                            (
                                milestone.status === "funded" ||
                                milestone.status === "in_progress"
                            ) && (

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedDeliveryId(
                                        milestone._id
                                    )
                                }
                            >
                                Deliver Work
                            </button>

                        )}

                        {selectedDeliveryId === milestone._id && (

                            <div>

                                <h4>
                                    Submit Work
                                </h4>


                                <label>
                                    Delivery Message:
                                </label>

                                <textarea
                                    value={deliveryMessage}
                                    onChange={(event) =>
                                        setDeliveryMessage(
                                            event.target.value
                                        )
                                    }
                                    required
                                />


                                <button
                                    type="button"
                                    disabled={!deliveryMessage.trim()}
                                    onClick={() =>
                                        handleDeliverMilestone(
                                            milestone._id
                                        )
                                    }
                                >
                                    Submit Delivery
                                </button>


                                <button
                                    type="button"
                                    onClick={() => {

                                        setSelectedDeliveryId(null)

                                        setDeliveryMessage('')
                                    }}
                                >
                                    Cancel
                                </button>

                            </div>

                        )}

                        {milestone.deliveries?.length > 0 && (

                            <div>

                                <h4>
                                    Deliveries
                                </h4>


                                {milestone.deliveries.map((delivery) => (

                                    <div
                                        key={delivery._id}
                                    >

                                        <p>
                                            {delivery.message}
                                        </p>


                                        <p>
                                            Submitted: {
                                                new Date(
                                                    delivery.submittedAt
                                                ).toLocaleString()
                                            }
                                        </p>


                                        {delivery.response && (

                                            <p>
                                                Response: {delivery.response}
                                            </p>

                                        )}


                                        {delivery.responseNote && (

                                            <p>
                                                Client Note: {delivery.responseNote}
                                            </p>

                                        )}

                                    </div>

                                ))}

                            </div>

                        )}

                        {props.user?.role === "client" &&
                            contract.status === "active" &&
                            milestone.status === "delivered" && (

                            <div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleApproveMilestone(
                                            milestone._id
                                        )
                                    }
                                >
                                    Approve Work
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedRevisionId(
                                            milestone._id
                                        )
                                    }
                                >
                                    Request Revision
                                </button>

                            </div>

                        )}

                        {selectedRevisionId === milestone._id && (

                            <div>

                                <h4>
                                    Request Revision
                                </h4>


                                <label>
                                    Revision Notes:
                                </label>


                                <textarea
                                    value={revisionNote}
                                    onChange={(event) =>
                                        setRevisionNote(
                                            event.target.value
                                        )
                                    }
                                    required
                                />


                                <button
                                    type="button"
                                    disabled={!revisionNote.trim()}
                                    onClick={() =>
                                        handleRequestRevision(
                                            milestone._id
                                        )
                                    }
                                >
                                    Send Revision Request
                                </button>


                                <button
                                    type="button"
                                    onClick={() => {

                                        setSelectedRevisionId(null)

                                        setRevisionNote('')
                                    }}
                                >
                                    Cancel
                                </button>

                            </div>

                        )}

                    </div>

                ))}

            </section>

            {moneySummary && (

                <section>

                    <h2>
                        Payment Summary
                    </h2>

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

                <h2>
                    Activity
                </h2>


                {timeline.length === 0 ? (

                    <p>
                        No activity yet.
                    </p>

                ) : (

                    timeline.map((activity) => (

                        <div
                            className="card"
                            key={activity._id}
                        >

                            <p>
                                {activity.message}
                            </p>


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

                <h2>
                    Contract Messages
                </h2>


                {messages.length === 0 ? (

                    <p>
                        No messages yet.
                    </p>

                ) : (

                    messages.map((contractMsg) => (

                        <div
                            className="card"
                            key={contractMsg._id}
                        >

                            <p>
                                <strong>
                                    {contractMsg.sender?.username}
                                </strong>
                            </p>

                            <p>
                                {contractMsg.text}
                            </p>

                        </div>

                    ))

                )}


                <form onSubmit={handleSendMessage}>

                    <textarea
                        value={contractMessage}
                        onChange={(event) =>
                            setContractMessage(
                                event.target.value
                            )
                        }
                        placeholder="Write a message..."
                        required
                    />


                    <button
                        type="submit"
                        disabled={!contractMessage.trim()}
                    >
                        Send Message
                    </button>

                </form>

            </section>

            {contract.status === "active" && (

                <button
                    type="button"
                    onClick={() =>
                        setShowCancelConfirm(true)
                    }
                >
                    Cancel Contract
                </button>

            )}


            {showCancelConfirm && (

                <div className="card">

                    <p>
                        Are you sure you want to cancel this contract?
                    </p>


                    <button
                        type="button"
                        onClick={handleCancelContract}
                    >
                        Yes, Cancel Contract
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            setShowCancelConfirm(false)
                        }
                    >
                        No
                    </button>

                </div>

            )}

        </section>
    )
}

export default ContractDetails