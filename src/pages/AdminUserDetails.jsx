import PagedList from "../components/PagedList"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { getUser } from "../services/admin"

const AdminUserDetails = function () {
    const { userId } = useParams()
    const [details, setDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    
    useEffect(function () {
        const fetchUser = async function () {
            try {
                const data = await getUser(userId)
                setDetails(data)
            } catch (error) {
                setMessage(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [userId])
    
    if (loading) {
        return <p>Loading...</p>
    }
    
    if (!details) {
        return <p>{message}</p>
    }
    
    const user = details.user
    
    return (
        <section>
            <header>
                <h1>User Details</h1>
                <p>{message}</p>
            </header>

            <div className="card">
                <h2>{user.username}</h2>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <p>Status: {user.status}</p>
                <p>Verified: {user.isVerified ? "Yes" : "No"}</p>
            </div>

            <details className="compact-disclosure">
                <summary>Contracts as Client ({details.contracts.asClient.length})</summary>
                <div className="disclosure-content">
                    {details.contracts.asClient.length === 0 ? (
                        <p>No client contracts</p>
                    ) : (
                        <PagedList
                            label="Client contracts"
                            pageSize={4}
                            className="compact-card-grid"
                        >
                            {details.contracts.asClient.map(function (contract) {
                                return (
                                    <div className="card" key={contract._id}>
                                        <h3>{contract.title}</h3>
                                        <p>Status: {contract.status}</p>
                                        <p>
                                            Total: {contract.currency} {contract.totalAmount}
                                        </p>
                                    </div>
                                )
                            })}
                        </PagedList>
                    )}
                </div>
            </details>
            <details className="compact-disclosure">
                <summary>Contracts as Freelancer ({details.contracts.asFreelancer.length})</summary>
                <div className="disclosure-content">
                    {details.contracts.asFreelancer.length === 0 ? (
                        <p>No freelancer contracts</p>
                    ) : (
                        <PagedList
                            label="Freelancer contracts"
                            pageSize={4}
                            className="compact-card-grid"
                        >
                            {details.contracts.asFreelancer.map(function (contract) {
                                return (
                                    <div className="card" key={contract._id}>
                                        <h3>{contract.title}</h3>
                                        <p>Status: {contract.status}</p>
                                        <p>
                                            Total: {contract.currency} {contract.totalAmount}
                                        </p>
                                    </div>
                                )
                            })}
                        </PagedList>
                    )}
                </div>
            </details>
            <details className="compact-disclosure">
                <summary>Transactions ({details.transactions.length})</summary>
                <div className="disclosure-content">
                    {details.transactions.length === 0 ? (
                        <p>No transactions</p>
                    ) : (
                        <PagedList label="Transactions" pageSize={4} className="compact-card-grid">
                            {details.transactions.map(function (transaction) {
                                return (
                                    <div className="card" key={transaction._id}>
                                        <p>Type: {transaction.type}</p>
                                        <p>Amount: {transaction.amount}</p>
                                        <p>Direction: {transaction.direction}</p>
                                        <p>Status: {transaction.status}</p>
                                    </div>
                                )
                            })}
                        </PagedList>
                    )}
                </div>
            </details>
        </section>
    )
                        }
                        export default AdminUserDetails