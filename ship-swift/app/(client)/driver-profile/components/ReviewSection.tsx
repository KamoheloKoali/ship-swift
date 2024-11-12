'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useDriverReviews } from './ReviewSection/hooks/useDriverReviews'
import { ReviewForm } from './ReviewForm'
import { ReviewList } from './ReviewSection/components/ReviewList'
import { Spinner } from '@/components/spinner'

interface ReviewSectionProps {
  onReviewSubmitted?: () => void
}

export function ReviewSection({ onReviewSubmitted }: ReviewSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)
  const { toast } = useToast()
  const params = useParams()
  const driverId = Array.isArray(params?.id) ? params.id[0] : params?.id

  const { reviews, isLoading, addReview, removeReview } = useDriverReviews(driverId)

  const handleSubmitReview = useCallback(
    async (reviewData: { rating: number, content?: string }) => {
      if (!driverId) {
        toast({
          title: "Error",
          description: "Driver ID is required",
          variant: "destructive",
        })
        return
      }

      setIsSubmitting(true)
      try {
        const response = await fetch(`/api/drivers/${driverId}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit review')
        }

        toast({
          title: "Success",
          description: "Review submitted successfully",
        })

        setShowReviewForm(false)
        onReviewSubmitted?.()
        addReview(data)
      } catch (error) {
        console.error('Error submitting review:', error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to submit review',
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [driverId, toast, onReviewSubmitted, addReview]
  )

  const handleDeleteReview = async (reviewId: string) => {
    setDeletingReviewId(reviewId)
    try {
      const response = await fetch(`/api/drivers/${driverId}/delete-review`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete review')
      }

      removeReview(reviewId)
      toast({
        title: "Success",
        description: "Review deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting review:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete review',
        variant: "destructive",
      })
    } finally {
      setDeletingReviewId(null)
    }
  }

  const handleCloseForm = () => {
    if (!isSubmitting) {
      setShowReviewForm(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Driver Reviews</h3>
        <Button
          variant="outline"
          onClick={() => setShowReviewForm(!showReviewForm)}
          disabled={isSubmitting}
        >
          {showReviewForm ? 'Cancel Review' : 'Leave a Review'}
        </Button>
      </div>

      {showReviewForm && (
        <ReviewForm
          driverId={driverId}
          onSubmit={handleSubmitReview}
          onClose={handleCloseForm}
          isSubmitting={isSubmitting}
        />
      )}

      {isSubmitting && (
        <div className="flex justify-center items-center py-4">
          <Spinner className="w-6 h-6 text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Submitting review...</span>
        </div>
      )}

      <ReviewList
        reviews={reviews}
        isLoading={isLoading}
        isError={false} // or set this based on your error state
        onDeleteReview={handleDeleteReview}
        deletingReviewId={deletingReviewId}
      />
    </div>
  )
}