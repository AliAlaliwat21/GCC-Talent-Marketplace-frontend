import { useState } from "react"
import { createReview } from '../services/reviews'

const ReviewForm = ({
    contractId,
    onReviewCreated
}) => {

    const [rating, setRating] = useState(5)
    const [comment, setComment]= useState("")
    const [message, setMessage]= useState("")
    const [submitting, setSubmit]=useState(false)
    const [submitted, setSubmitted] =useState(false)

    const handleSubmit = async(event)=>{
        event.preventDefault()

        setMessage("")
        setSubmit(true)

        try {
            const review = await createReview(
                contractId,
                {
                    rating: Number(rating),
                    comment: comment
                }
            )

            setMessage("Review submitted successfully!")
            setSubmit(true)

            if(onReviewCreated){
                onReviewCreated(review)
            }
        } catch (error) {
            setMessage(error.message)
            
        } finally{
            setSubmitted(false)
        }
    }

    if(submitted){
        return (
           <section className="card">
                <h2>Review Submitted</h2>
                <p>
                    Thank you for sharing your experience.
                </p>

           </section> 
        )
    }

    return (
        <section className="card">
            <h2>Leave a Review</h2>
            <p>
                How was your experience working on this contract?
            </p>

            {message && (
                <p>{message}</p>
            )}

            <form onSubmit={handleSubmit}>

                <label htmlFor="rating">
                    Rating
                </label>

                <select
                    id="rating"
                    value={rating}
                    onChange={(event) =>
                        setRating(event.target.value)
                    }
                >
                    <option value="5">★★★★★ - Excellent</option>
                    <option value="4">★★★★☆ - Very Good</option>
                    <option value="3">★★★☆☆ - Good</option>
                    <option value="2">★★☆☆☆ - Fair</option>
                    <option value="1">★☆☆☆☆ - Poor</option>
                </select>

                <label htmlFor="comment">
                    Review
                </label>

                <textarea
                    id="comment"
                    value={comment}
                    onChange={(event) =>
                        setComment(event.target.value)
                    }
                    placeholder="Describe your experience..."
                    maxLength="2000"
                    required
                />

                <button
                    type="submit"
                    disabled={submitting}
                >
                    {
                        submitting
                            ? "Submitting..."
                            : "Submit Review"
                    }
                </button>

            </form>

        </section>
    )
}

export default ReviewForm