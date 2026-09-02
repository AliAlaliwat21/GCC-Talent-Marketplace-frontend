import { useEffect, useState } from "react"
import { addFunds, getWallet } from "../services/wallet"

const Wallet = function (props) {
    const initialState = {
        amount: "",
        number: "",
        exp: "",
        cvc: ""
    }
    
    const [wallet, setWallet] = useState({
        available: 0,
        pending: 0
    })
    const [formData, setFormData] = useState(initialState)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState("")
    
    useEffect(function () {
        const fetchWallet = async function () {
            try {
                const data = await getWallet()
                
                setWallet(data.wallet)
            } catch (error) {
                setMessage(error.message)
            } finally {
                setLoading(false)
            }
        }
        
        fetchWallet()
    }, [])
    
    const handleChange = function (event) {
        setFormData({...formData, [event.target.name]: event.target.value})
    }
    
    const handleSubmit = async function (event) {
        event.preventDefault()
        setMessage("")
        setSubmitting(true)
        
        try {
            const paymentData = {
                amount: Number(formData.amount),
                card: {
                    number: formData.number,
                    exp: formData.exp,
                    cvc: formData.cvc
                }
            }
            
            const data = await addFunds(paymentData)
            
            setWallet(data.wallet)
            setMessage(data.message)
            setFormData(initialState)
        } catch (error) {
            setMessage(error.message)
        } finally {
            setSubmitting(false)
        }
    }
    
    if (loading) {
        return <p>Loading wallet...</p>
    }
    
    return (
        <section>
            <header>
                <h1>My Wallet</h1>
                <p>{message}</p>
            </header>

            <div className="compact-columns">
                <div className="card">
                    <h2>Wallet Balance</h2>
                    <p>Available Balance: ${wallet.available}</p>
                    <p>Pending Balance: ${wallet.pending}</p>
                </div>

                {props.user?.role === "client" && (
                    <div className="card">
                        <h2>Add Funds</h2>

                        <form className="compact-form" onSubmit={handleSubmit}>
                            <div className="compact-grid">
                                <div className="compact-field compact-full">
                                    <label htmlFor="amount">Amount</label>
                                    <input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        min="1"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="compact-field compact-full">
                                    <label htmlFor="number">Card Number</label>
                                    <input
                                        id="number"
                                        name="number"
                                        type="text"
                                        value={formData.number}
                                        onChange={handleChange}
                                        placeholder="4242424242424242"
                                        required
                                    />
                                </div>
                                <div className="compact-field">
                                    <label htmlFor="exp">Expiry Date</label>
                                    <input
                                        id="exp"
                                        name="exp"
                                        type="text"
                                        value={formData.exp}
                                        onChange={handleChange}
                                        placeholder="12/30"
                                        required
                                    />
                                </div>
                                <div className="compact-field">
                                    <label htmlFor="cvc">CVC</label>
                                    <input
                                        id="cvc"
                                        name="cvc"
                                        type="text"
                                        value={formData.cvc}
                                        onChange={handleChange}
                                        placeholder="123"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="compact-actions">
                                <button type="submit" disabled={submitting}>
                                    {submitting ? "Adding..." : "Add Funds"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </section>
    )
                        }
                        export default Wallet