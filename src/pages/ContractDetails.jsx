import PagedList from "../components/PagedList"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router"
import { addMilestone, approveMilestone, cancelContract, deliverMilestone, fundMilestone, requestRevision, sendMessage, show, updateMilestone } from "../services/contracts"
import { uploadFile } from "../services/uploads"
import ReviewForm from "../components/ReviewForm"

const ContractDetails = (props)=>{

    const {contractId} = useParams()
    const [activeSection, setActiveSection] = useState('milestones')
    const milestoneEditor = useRef(null)

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
    const [deliveryId, setDeliveryId] = useState(null)
    const [deliveryMessage, setDeliveryMessage] = useState('')
    const [deliveryFiles, setDeliveryFiles] = useState([])
    const [revisionId, setRevisionId] = useState(null)
    const [revisionNote, setRevisionNote] = useState('')
    const [contractMessage, setContractMessage] = useState('')

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
        const fetchInitialContract = async()=>{
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

        fetchInitialContract()
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
        if (milestoneEditor.current) {
            milestoneEditor.current.open = true
            milestoneEditor.current.querySelector('input')?.focus()
        }
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

    const handleFundMilestone = async(milestoneId)=>{
        setMessage('')

        try {
            await fundMilestone(contractId, milestoneId)
            setMessage('Milestone funded successfully')
            fetchContract()
        } catch (error) {
            setMessage(error.message)
        }
    }

    const handleDeliverySubmit = async(event, milestoneId)=>{
        event.preventDefault()
        setMessage('')

        try {
            const attachments = []

            for (let i = 0; i < deliveryFiles.length; i++) {
                const uploadedFile = await uploadFile(deliveryFiles[i])

                attachments.push({
                    url: uploadedFile.url,
                    name: uploadedFile.name
                })
            }

            await deliverMilestone(contractId, milestoneId, {
                message: deliveryMessage,
                attachments: attachments
            })

            setDeliveryId(null)
            setDeliveryMessage('')
            setDeliveryFiles([])
            setMessage('Work delivered successfully')
            fetchContract()
        } catch (error) {
            setMessage(error.message)
        }
    }

    const handleApproveMilestone = async(milestoneId)=>{
        setMessage('')

        try {
            await approveMilestone(contractId, milestoneId)
            setMessage('Delivery approved successfully')
            fetchContract()
        } catch (error) {
            setMessage(error.message)
        }
    }

    const handleRevisionSubmit = async(event, milestoneId)=>{
        event.preventDefault()
        setMessage('')

        try {
            await requestRevision(contractId, milestoneId, revisionNote)
            setRevisionId(null)
            setRevisionNote('')
            setMessage('Revision requested successfully')
            fetchContract()
        } catch (error) {
            setMessage(error.message)
        }
    }

    const handleCancelContract = async()=>{
        const confirmed = window.confirm('Are you sure you want to cancel this contract?')

        if (!confirmed) return

        setMessage('')

        try {
            await cancelContract(contractId)
            setMessage('Contract cancelled successfully')
            fetchContract()
        } catch (error) {
            setMessage(error.message)
        }
    }

    const handleSendMessage = async(event)=>{
        event.preventDefault()
        setMessage('')

        try {
            await sendMessage(contractId, contractMessage)
            setContractMessage('')
            fetchContract()
        } catch (error) {
            setMessage(error.message)
        }
    }

    if (!contract){
        return <p>{message || 'Loading...'}</p>
    }

    const isClient = props.user?._id === contract.client?._id
    const isFreelancer = props.user?._id === contract.freelancer?._id

    return (
        <section>
            <header>
                <h1>{contract.title}</h1>

                <p>{message}</p>

                <p>Status: {contract.status}</p>

                <p>
                    Total: {contract.totalAmount} {contract.currency}
                </p>
            </header>

            {contract.status === "active" && (
                <button onClick={handleCancelContract}>Cancel Contract</button>
            )}

            <nav className="workspace-sections" aria-label="Contract sections">
                {[
                    ["milestones", "Milestones"],
                    ["messages", "Messages"],
                    ["activity", "Activity"],
                    ["payments", "Payments & reviews"],
                ].map(([id, label]) => (
                    <button
                        type="button"
                        key={id}
                        aria-pressed={activeSection === id}
                        aria-controls={`contract-${id}`}
                        onClick={() => setActiveSection(id)}
                    >
                        {label}
                    </button>
                ))}
            </nav>
            <section
                id="contract-milestones"
                className="workspace-panel"
                hidden={activeSection !== "milestones"}
                aria-label="Milestones"
            >
                <h2>Milestones</h2>

                {isClient && contract.status === "active" && (
                    <details className="compact-disclosure" ref={milestoneEditor}>
                        <summary>{editingId ? "Edit Milestone" : "Add Milestone"}</summary>
                        <div className="disclosure-content">
                            <form className="compact-form" onSubmit={handleMilestoneSubmit}>
                                <div className="compact-grid">
                                    <div className="compact-field compact-full">
                                        <label htmlFor="milestoneTitle">Title</label>
                                        <input
                                            id="milestoneTitle"
                                            name="title"
                                            value={milestoneData.title}
                                            onChange={handleMilestoneChange}
                                            required
                                        />
                                    </div>
                                    <div className="compact-field compact-full">
                                        <label htmlFor="milestoneDescription">Description</label>
                                        <textarea
                                            id="milestoneDescription"
                                            name="description"
                                            value={milestoneData.description}
                                            onChange={handleMilestoneChange}
                                        />
                                    </div>
                                    <div className="compact-field">
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
                                    </div>
                                    <div className="compact-field">
                                        <label htmlFor="milestoneDueDate">Due Date</label>
                                        <input
                                            id="milestoneDueDate"
                                            name="dueDate"
                                            type="date"
                                            value={milestoneData.dueDate}
                                            onChange={handleMilestoneChange}
                                        />
                                    </div>
                                </div>
                                <div className="compact-actions">
                                    <button type="submit">
                                        {editingId ? "Update Milestone" : "Add Milestone"}
                                    </button>

                                    {editingId && (
                                        <button type="button" onClick={() => setEditingId(null)}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </details>
                )}

                <PagedList
                    label="Milestones"
                    pageSize={4}
                    className="compact-card-grid"
                    disabled={deliveryId !== null || revisionId !== null}
                >
                    {contract.milestones.map((milestone) => (
                        <div className="card" key={milestone._id}>
                            <h3>{milestone.title}</h3>

                            <p>{milestone.description}</p>

                            <p>Amount: {milestone.amount}</p>

                            <p>Status: {milestone.status}</p>

                            {milestone.dueDate && (
                                <p>Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                            )}

                            <p>Escrow: {milestone.escrowAmount}</p>

                            <details className="compact-disclosure">
                                <summary>Delivery history ({milestone.deliveries.length})</summary>
                                <div className="disclosure-content">
                                    <PagedList label="Deliveries" pageSize={3}>
                                        {milestone.deliveries.map((delivery) => (
                                            <div key={delivery._id}>
                                                <h4>Delivery</h4>
                                                <p>{delivery.message}</p>

                                                {delivery.attachments.map((attachment) => (
                                                    <a
                                                        key={attachment._id}
                                                        href={attachment.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {attachment.name}
                                                    </a>
                                                ))}

                                                {delivery.responseNote && (
                                                    <p>Revision Note: {delivery.responseNote}</p>
                                                )}
                                            </div>
                                        ))}
                                    </PagedList>
                                </div>
                            </details>

                            {isClient && milestone.status === "pending" && (
                                <>
                                    <button onClick={() => handleEditMilestone(milestone)}>
                                        Edit Milestone
                                    </button>

                                    <button onClick={() => handleFundMilestone(milestone._id)}>
                                        Fund Milestone
                                    </button>
                                </>
                            )}

                            {isFreelancer &&
                                (milestone.status === "funded" ||
                                    milestone.status === "in_progress") &&
                                (deliveryId === milestone._id ? (
                                    <form
                                        onSubmit={(event) =>
                                            handleDeliverySubmit(event, milestone._id)
                                        }
                                    >
                                        <label htmlFor={`delivery-${milestone._id}`}>
                                            Delivery Notes
                                        </label>
                                        <textarea
                                            id={`delivery-${milestone._id}`}
                                            value={deliveryMessage}
                                            onChange={(event) =>
                                                setDeliveryMessage(event.target.value)
                                            }
                                            required
                                        />

                                        <label htmlFor={`deliveryFiles-${milestone._id}`}>
                                            Attachments
                                        </label>
                                        <input
                                            id={`deliveryFiles-${milestone._id}`}
                                            type="file"
                                            multiple
                                            accept="image/jpeg,image/png,image/webp,application/pdf,application/zip"
                                            onChange={(event) =>
                                                setDeliveryFiles(Array.from(event.target.files))
                                            }
                                        />

                                        <button type="submit">Submit Delivery</button>
                                        <button type="button" onClick={() => setDeliveryId(null)}>
                                            Cancel
                                        </button>
                                    </form>
                                ) : (
                                    <button onClick={() => setDeliveryId(milestone._id)}>
                                        Deliver Work
                                    </button>
                                ))}

                            {isClient && milestone.status === "delivered" && (
                                <>
                                    <button onClick={() => handleApproveMilestone(milestone._id)}>
                                        Approve Delivery
                                    </button>

                                    {revisionId === milestone._id ? (
                                        <form
                                            onSubmit={(event) =>
                                                handleRevisionSubmit(event, milestone._id)
                                            }
                                        >
                                            <label htmlFor={`revision-${milestone._id}`}>
                                                Revision Comments
                                            </label>
                                            <textarea
                                                id={`revision-${milestone._id}`}
                                                value={revisionNote}
                                                onChange={(event) =>
                                                    setRevisionNote(event.target.value)
                                                }
                                                required
                                            />

                                            <button type="submit">Request Revision</button>
                                            <button
                                                type="button"
                                                onClick={() => setRevisionId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </form>
                                    ) : (
                                        <button onClick={() => setRevisionId(milestone._id)}>
                                            Request Revision
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </PagedList>
            </section>
            <section
                id="contract-activity"
                className="workspace-panel"
                hidden={activeSection !== "activity"}
                aria-label="Activity"
            >
                <h2>Activity</h2>

                {timeline.length === 0 ? (
                    <p>No activity yet.</p>
                ) : (
                    <PagedList label="Activities" pageSize={5}>
                        {timeline.map((activity) => (
                            <div className="card" key={activity._id}>
                                <p>{activity.message}</p>

                                {activity.by && <p>By: {activity.by.username}</p>}
                            </div>
                        ))}
                    </PagedList>
                )}
            </section>

            <section
                id="contract-messages"
                className="workspace-panel"
                hidden={activeSection !== "messages"}
                aria-label="Messages"
            >
                <h2>Messages</h2>
                <form onSubmit={handleSendMessage}>
                    <label htmlFor="contractMessage">Message</label>
                    <textarea
                        id="contractMessage"
                        value={contractMessage}
                        onChange={(event) => setContractMessage(event.target.value)}
                        required
                    />

                    <button type="submit">Send Message</button>
                </form>

                {messages.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    <PagedList label="Messages" pageSize={5}>
                        {messages.map((contractMessage) => (
                            <div className="card" key={contractMessage._id}>
                                <p>{contractMessage.text}</p>

                                {contractMessage.sender && (
                                    <p>From: {contractMessage.sender.username}</p>
                                )}
                            </div>
                        ))}
                    </PagedList>
                )}
            </section>

            <section
                id="contract-payments"
                className="workspace-panel"
                hidden={activeSection !== "payments"}
                aria-label="Payments and reviews"
            >
                {moneySummary && (
                    <section>
                        <h2>Payment Summary</h2>

                        <div className="card payment-facts">
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
                                Freelancer Received: {moneySummary.freelancerReceived}{" "}
                                {moneySummary.currency}
                            </p>

                            <p>
                                Refunded: {moneySummary.refunded} {moneySummary.currency}
                            </p>

                            <p>
                                Remaining Unfunded: {moneySummary.remainingUnfunded}{" "}
                                {moneySummary.currency}
                            </p>
                        </div>
                    </section>
                )}

                {(contract.status === "completed" || contract.status === "cancelled") && (
                    <ReviewForm contractId={contractId} />
                )}
            </section>
        </section>
    )
}

export default ContractDetails
