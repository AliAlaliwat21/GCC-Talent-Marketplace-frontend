import {useEffect, useState } from "react"
import { getUserReviews } from "../services/reviews"

const ReviewsList = ({ userId }) =>{
 const [reviews, setReviews] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    useEffect(() => {

        const fetchReviews = async () => {

            setLoading(true)
            setMessage("")

            try {

                const data = await getUserReviews(
                    userId,
                    page,
                    5
                )

                setReviews(data.reviews || [])
                setTotalPages(data.totalPages || 1)

            } catch (error) {

                setMessage(error.message)

            } finally {

                setLoading(false)

            }
        }

        fetchReviews()

    }, [userId, page])

    if (loading) {
        return (
            <section>
                <h2>Reviews</h2>
                <p>Loading reviews...</p>
            </section>
        )
    }

    return (
        <section>

            <h2>Reviews</h2>

            {message && (
                <p>{message}</p>
            )}

            {reviews.length === 0 ? (

                <p>No reviews yet.</p>

            ) : (

                reviews.map((review) => {

                    return (
                        <article
                            className="card"
                            key={review._id}
                        >

                            <p>
                                {"★".repeat(review.rating)}
                                {"☆".repeat(5 - review.rating)}
                            </p>

                            <p>
                                {review.comment}
                            </p>

                            <small>
                                {
                                    new Date(
                                        review.createdAt
                                    ).toLocaleDateString()
                                }
                            </small>

                        </article>
                    )
                })

            )}

            {totalPages > 1 && (

                <div>

                    <button
                        disabled={page === 1}
                        onClick={() =>
                            setPage(page - 1)
                        }
                    >
                        Previous
                    </button>

                    <span>
                        {" "}
                        Page {page} of {totalPages}
                        {" "}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() =>
                            setPage(page + 1)
                        }
                    >
                        Next
                    </button>

                </div>

            )}

        </section>
    )
}

export default ReviewsList
    
