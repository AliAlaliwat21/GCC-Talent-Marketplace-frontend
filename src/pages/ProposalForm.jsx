import { useState } from "react"
import { create } from "../services/proposal"
import { uploadFile } from "../services/uploads"

const ProposalForm = (props)=>{

    const initPropState = {
        coverLetter: '',
        amount: '',
        deliveryDays: ''
    }

    const [proposalData, setProposalData] = useState(initPropState)
    const [message, setMessage] = useState('')
    const [attachments, setAttachments] = useState([])
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (event)=>{
        setMessage('')
        setProposalData({...proposalData, [event.target.name]: event.target.value})
    }

    const handleAttachmentsChange = (event)=>{
        setAttachments(Array.from(event.target.files))
    }

    const handleSubmit = async (event)=>{
        event.preventDefault()
        setSubmitting(true)
        try {
            const uploadedAttachments = []

            for (let i = 0; i < attachments.length; i++) {
                const uploadedFile = await uploadFile(attachments[i])

                uploadedAttachments.push({
                    url: uploadedFile.url,
                    name: uploadedFile.name
                })
            }

            const dataToSend = {
                coverLetter: proposalData.coverLetter,
                amount: Number(proposalData.amount),
                deliveryDays: Number(proposalData.deliveryDays),
                attachments: uploadedAttachments
            }

            await create(props.jobId, dataToSend)
            setMessage('Proposal submitted successfully')
            setProposalData(initPropState)
            setAttachments([])
            event.target.reset()
        } catch (error) {
            setMessage(error.message)
        } finally {
            setSubmitting(false)
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

                Attachments:
                <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,application/pdf,application/zip"
                    onChange={handleAttachmentsChange}
                />

                    <button type="submit" disabled={!isFormValid() || submitting}>
                        {submitting ? "Submitting..." : "Submit Proposal"}
                    </button>

                    <button type='button' onClick={handleCancel} >Cancel</button>

            </form>
        </section>
    )

}

export default ProposalForm
