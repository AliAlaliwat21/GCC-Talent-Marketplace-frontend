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
        <section className="card compact-page">
            <header>
                <h1>Submit a Proposal</h1>
                <p>{message}</p>
            </header>
            <form className="compact-form" onSubmit={handleSubmit}>
                <div className="compact-grid">
                    <div className="compact-field compact-full">
                        <label htmlFor="proposal-cover-letter">Cover Letter</label>
                        <textarea
                            id="proposal-cover-letter"
                            name="coverLetter"
                            onChange={handleChange}
                            value={proposalData.coverLetter}
                            required
                        />
                    </div>
                    <div className="compact-field">
                        <label htmlFor="proposal-amount">Amount</label>
                        <input
                            type="number"
                            id="proposal-amount"
                            name="amount"
                            onChange={handleChange}
                            value={proposalData.amount}
                            required
                        />
                    </div>
                    <div className="compact-field">
                        <label htmlFor="proposal-delivery-days">Delivery Days</label>
                        <input
                            type="number"
                            id="proposal-delivery-days"
                            name="deliveryDays"
                            onChange={handleChange}
                            value={proposalData.deliveryDays}
                            required
                        />
                    </div>
                    <div className="compact-field compact-full">
                        <label htmlFor="proposal-attachments">Attachments</label>
                        <input
                            id="proposal-attachments"
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp,application/pdf,application/zip"
                            onChange={handleAttachmentsChange}
                        />
                    </div>
                </div>
                <div className="compact-actions">
                    <button type="submit" disabled={!isFormValid() || submitting}>
                        {submitting ? "Submitting..." : "Submit Proposal"}
                    </button>
                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </section>
    )

}

export default ProposalForm
