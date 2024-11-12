'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Star, StarHalf, Trash2 } from "lucide-react"
import { useCallback } from 'react'
import { DriverReview } from '@/types/driver'
import { useToast } from "@/hooks/use-toast"
import { ReviewForm } from './ReviewForm'
import { useParams } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ReviewSectionProps {
  onReviewSubmitted?: () => void
}

export function ReviewSection({ onReviewSubmitted }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<DriverReview[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)
  const { toast } = useToast()


  const params = useParams()
  const driver = Array.isArray(params?.id) ? params.id[0] : params?.id

  console.log('Driver ID:', driver)

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/drivers/${driver}/get-reviews`)
        if (!response.ok) {
          throw new Error('Failed to fetch reviews')
        }
        const data = await response.json()
        setReviews(data)
      } catch (error) {
        console.error('Error fetching reviews:', error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to fetch reviews',
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [ toast, driver])

  const handleSubmitReview = useCallback(
    async (reviewData: { rating: number, content?: string }) => {
    if (!driver) {
      toast({
        title: "Error",
        description: "Driver ID is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      console.log('Submitting review for driverId:', driver)
      const response = await fetch(`/api/drivers/${driver}/reviews`, {
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
      setReviews([...reviews, data])
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
  }, [ reviews, toast, onReviewSubmitted])

  const handleDeleteReview = async (reviewId: string) => {
    setDeletingReviewId(reviewId)
    try {
      const response = await fetch(`/api/drivers/${driver}/delete-review`, {
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

      setReviews(reviews.filter(review => review.id !== reviewId))
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
          driverId={driver}
          onSubmit={handleSubmitReview}
          onClose={handleCloseForm}
          isSubmitting={isSubmitting}
        />
      )}

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 -mr-4">
        {isLoading ? (
          // Skeleton loader for reviews
          [...Array(3)].map((_, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No reviews yet</p>
        ) : (
          reviews.map((review: DriverReview) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {review.client ? `${review.client.firstName} ${review.client.lastName}` : 'Anonymous'}
                  </p>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      i < review.rating
                        ? <Star key={i} className="h-4 w-4 text-yellow-400" />
                        : <StarHalf key={i} className="h-4 w-4 text-gray-300" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete review</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the review.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteReview(review.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <p className="mt-2 text-gray-600">{review.content || 'No comment'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}