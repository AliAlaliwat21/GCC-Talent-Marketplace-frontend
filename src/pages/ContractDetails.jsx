import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { show, fundMilestone, deliverMilestone } from "../services/contracts"

const ContractDetails = (props)=>{

    const {contractId} = useParams()

    const [contract, setContract] = useState(null)
    const [moneySummary, setMoneySummary] = useState(null)
    const [timeline, setTimeline] = useState([])
    const [messages, setMessages] = useState([])

    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null)
    const [deliveryMessage, setDeliveryMessage] = useState('')

    const [message, setMessage] = useState('')

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

    const handleFundMilestone = async (milestoneId)=>{
        try {

            await fundMilestone(contractId, milestoneId)

            setMessage('Milestone funded successfully')

            await fetchContract()
        } catch (error) {
            setMessage(error.message)
        }
    }

    const handleDeliverMilestone = async(milestoneId)=>{
        try {

            const deliveryData = {
                message: deliveryMessage
            }

            await deliverMilestone(contractId, milestoneId, deliveryData)

            setMessage('Work delivered successfully.')

            setSelectedDeliveryId(null)

            setDeliveryMessage('')

            await fetchContract()
        } catch (error) {
            setMessage(error.message)
        }
    }

    useEffect(()=>{
        fetchContract()
    }, [contractId])


    if (!contract){
        return <p>Loading...</p>
    }

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

                        {/* Client funds */}
                        {props.user?.role === 'client' &&
                        contract.status === 'active' &&
                        milestone.status === 'pending'(
                            <button onClick={()=> handleFundMilestone(milestone._id)}>
                                Fund Milestone

                            </button>
                        )}

                         {/* Freelancer delivers */}
                        {props.user?.role === 'freelancer' &&
                        contract.status === 'active' &&
                        (
                            milestone.status === 'funded' || milestone.status === 'in_progress'
                        )&&(
                            <button
                            onClick={()=> setSelectedDeliveryId(milestone._id)}>
                                Deliver Work
                            </button>
                        )}

                       
                        {selectedDeliveryId === milestone._id && (

                        <div>

                            <h4>Submit Work</h4>

                            <label>
                                Delivery Message:
                            </label>

                            <textarea
                                value={deliveryMessage}
                                onChange={(event) =>
                                    setDeliveryMessage(event.target.value)
                                }
                                required
                            />

                            <button
                                disabled={!deliveryMessage.trim()}
                                onClick={() =>
                                    handleDeliverMilestone(milestone._id)
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

                    {/* Delivery History */}
                    {milestone.deliveries?.length > 0 && (

                        <div>

                            <h4>Deliveries</h4>

                            {milestone.deliveries.map((delivery) => (

                                <div key={delivery._id}>

                                    <p>{delivery.message}</p>

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