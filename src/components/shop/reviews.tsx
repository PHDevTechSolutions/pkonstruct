"use client"

import { useState } from "react"
import { useReviews, useCanReview } from "@/hooks/use-reviews"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Star, ThumbsUp, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ReviewsProps {
  productId: string
}

export function Reviews({ productId }: ReviewsProps) {
  const { user } = useAuth()
  const { reviews, loading, stats, addReview, markHelpful } = useReviews(productId)
  const { canReview } = useCanReview(productId, user?.email || undefined)
  
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    comment: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setSubmitting(true)
    const result = await addReview({
      productId,
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || "Anonymous",
      rating: formData.rating,
      title: formData.title,
      comment: formData.comment,
      verified: true, // Would be verified by purchase check
    })
    
    if (result.success) {
      setShowForm(false)
      setFormData({ rating: 5, title: "", comment: "" })
    }
    setSubmitting(false)
  }

  const StarRating = ({ rating, interactive = false, onRate }: { 
    rating: number
    interactive?: boolean
    onRate?: (r: number) => void 
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <Star 
            className={`w-5 h-5 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'fill-gray-200 text-gray-200'
            }`} 
          />
        </button>
      ))}
    </div>
  )

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl font-bold text-gray-900">{stats.average.toFixed(1)}</div>
          <div>
            <StarRating rating={Math.round(stats.average)} />
            <p className="text-sm text-gray-600 mt-1">Based on {stats.count} reviews</p>
          </div>
        </div>
        
        {/* Distribution bars */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.distribution[star as keyof typeof stats.distribution]
            const percentage = stats.count > 0 ? (count / stats.count) * 100 : 0
            return (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="w-8">{star} star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-gray-500">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Write Review Button */}
      {user && canReview && !showForm && (
        <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
          Write a Review
        </Button>
      )}
      
      {user && !canReview && (
        <p className="text-sm text-gray-500 text-center">
          Only verified purchasers can write reviews
        </p>
      )}
      
      {!user && (
        <p className="text-sm text-gray-500 text-center">
          Please sign in to write a review
        </p>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-6">
          <h3 className="font-semibold">Write Your Review</h3>
          
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Your Rating</label>
            <StarRating 
              rating={formData.rating} 
              interactive 
              onRate={(r) => setFormData(prev => ({ ...prev, rating: r }))}
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Review Title (optional)</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Summarize your experience"
              maxLength={100}
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Your Review</label>
            <Textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="What did you like or dislike?"
              rows={4}
              required
              maxLength={1000}
            />
            <p className="text-xs text-gray-400 mt-1">{formData.comment.length}/1000</p>
          </div>
          
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating rating={review.rating} />
                    {review.verified && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <h4 className="font-semibold text-gray-900">{review.title}</h4>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                </span>
              </div>
              
              <p className="text-gray-700 mb-3">{review.comment}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">By {review.userName}</span>
                <button
                  onClick={() => markHelpful(review.id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
