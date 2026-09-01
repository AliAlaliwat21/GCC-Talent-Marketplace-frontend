import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { show } from "../services/contracts"

const ContractDetails = (props)=>{

    const {contractId} = useParams()

    const [contract, setContract] = useState(null)
    const [moneySummary, setMoneySummary] = useState(null)
    const [timeline, setTimeline] = useState([])
    const [messages, setMessages] = useState([])

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

    useEffect(()=>{
        fetchContract()
    }, [contractId])

    if (message)
        return <p>{message}</p>

    if (!contract){
        return <p>Loading...</p>
    }

    return(
        <section>
            <header>
                <h1>{contract.title}</h1>

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