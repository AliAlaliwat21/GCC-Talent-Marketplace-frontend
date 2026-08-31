import { useState } from "react"

const ProposalForm = ()=>{

    const initPropState = {
        coverLetter: '',
        amount: '',
        deliveryDays: ''
    }

    const [proposalData, setProposalData] = useState(initPropState)

    const handleChange = (event)=>{
        setProposalData({...proposalData, [event.target.name]: event.target.value})
    }

    const handleSubmit = ()=>{
        event.preventDefault()
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
                <h1>Propose</h1>
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


                    <button type="button" disabled={!isFormValid()}>Sign Up</button>
                    <button>Cancel</button>

            </form>
        </section>
    )

}