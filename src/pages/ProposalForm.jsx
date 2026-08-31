import { useState } from "react"
import { create } from "../services/proposal"

const ProposalForm = (props)=>{

    const initPropState = {
        coverLetter: '',
        amount: '',
        deliveryDays: ''
    }

    const [proposalData, setProposalData] = useState(initPropState)
    const [message, setMessage] = useState('')

    const handleChange = (event)=>{
        setMessage('')
        setProposalData({...proposalData, [event.target.name]: event.target.value})
    }

    const handleSubmit = async (event)=>{
        event.preventDefault()
        try {
            const dataToSend = {
                coverLetter: proposalData.coverLetter,
                amount: Number(proposalData.amount),
                deliveryDays: Number(proposalData.deliveryDays)
            }

            await create(props.jobId, dataToSend)
            setMessage('Proposal submitted successfully')
            setProposalData(initPropState)
        } catch (error) {
            setMessage(error.message)
        }
    }

    const handleCancel = ()=>{
        setProposalData(initPropState)
        setMessage('')
    }

    const isFormValid = () => {
        return (
            proposalData.coverLetter &&
            proposalData.amount &&
            proposalData.deliveryDays
        )
    }

    return (
        <section className="card">
            <header>
                <h1>Submit a Propose</h1>
                <p>{message}</p>
            </header>
            <form onSubmit={handleSubmit}>

                Cover Letter:
                <textarea
                    name='coverLetter'
                    onChange={handleChange}
                    value={proposalData.coverLetter}
                    required
                />
                
                Amount:
                <input type="number" name="amount" onChange={handleChange} value={proposalData.amount} required />

                Delivery Days:
                <input type="number" name="deliveryDays" onChange={handleChange} value={proposalData.deliveryDays} required />


                    <button type="submit" disabled={!isFormValid()}>Submit Porposal</button>

                    <button type='button' onClick={handleCancel} >Cancel</button>

            </form>
        </section>
    )

}

export default ProposalForm