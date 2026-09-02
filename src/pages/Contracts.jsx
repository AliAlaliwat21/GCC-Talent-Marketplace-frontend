import { useEffect, useState } from "react"
import { index } from "../services/contracts"
import { Link } from "react-router"
const Contracts = ()=>{

    const [contracts, setContracts] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const fetchContracts = async ()=>{
            try {

                const data = await index()
                setContracts(data.contracts)

            } catch (error) {
                setMessage(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchContracts()
    }, [])

    return(
        <section>
            <header>
                <h1>My Contracts</h1>
                <p>{message}</p>
            </header>

            {loading ? (
                <p>Loading contracts...</p>
            ) : message ? null : contracts.length === 0 && (
                <p>You are yet to have any contracts!</p>
            )}

            {contracts.map((contract) => (

                <div
                    className="card"
                    key={contract._id}
                >

                    <h2>{contract.title}</h2>

                    <p>
                        Status: {contract.status}
                    </p>

                    <p>
                        Total Amount: {contract.totalAmount} {contract.currency}
                    </p>

                    <p>
                        Milestones: {contract.milestones.length}
                    </p>

                    <Link to={`/contracts/${contract._id}`}>
                        View Contract
                    </Link>

                </div>

            ))}

        </section>
    )
}

export default Contracts
