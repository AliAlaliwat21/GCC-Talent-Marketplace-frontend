import { useEffect, useState } from "react"
import { Link } from "react-router"
import { mine } from "../services/proposal"

const MyProposals = ()=>{

    const [proposals, setProposals] = useState([])
    const [message, setMessage] = useState('')

    useEffect(()=>{
        const fetchProposals = async ()=>{
            try {

                const data = await mine()
                setProposals(data.proposals)

            } catch (error) {
                setMessage(error.message)
            }
        }
        fetchProposals()
    }, [])

    return (
        <section>

            <header>
                <h1>My Proposals</h1>
                <p>{message}</p>
            </header>

            {proposals.length === 0 && (
                <p>You have not submitted any proposals yet.</p>
            )}

            {proposals.map((proposal) => (
                <div
                    className="card"
                    key={proposal._id}
                >

                    <h2>
                        {proposal.job?.title}
                    </h2>

                    <p>
                        Amount: {proposal.amount}
                    </p>

                    <p>
                        Delivery Days: {proposal.deliveryDays}
                    </p>

                    <p>
                        Status: {proposal.status}
                    </p>

                    <p>
                        Cover Letter: {proposal.coverLetter}
                    </p>

                    {proposal.job && (
                        <Link to={`/jobs/${proposal.job._id}`}>
                            View Job
                        </Link>
                    )}

                </div>
            ))}

        </section>
    )
}

export default MyProposals