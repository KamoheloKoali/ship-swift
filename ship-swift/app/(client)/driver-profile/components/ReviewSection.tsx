import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Star, StarHalf } from "lucide-react";
import { useCallback } from 'react';
import { DriverReview } from '@/types/driver';
import { useToast } from "@/hooks/use-toast"
import { ReviewForm } from './ReviewForm';

interface ReviewSectionProps {
  driverId: string;
  reviews: DriverReview[];
  onReviewSubmitted?: () => void;
}


export function ReviewSection({ driverId, reviews, onReviewSubmitted }: ReviewSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitReview = useCallback(async (reviewData: { rating: number, content?: string }) => {
    if (!driverId) {
      toast({
        title: "Error",
        description: "Driver ID is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting review:', reviewData);
      const response = await fetch(`/api/drivers/${driverId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });

      setShowReviewForm(false);
      onReviewSubmitted?.();
      
      return data;
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to submit review',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [driverId, toast, onReviewSubmitted]);

  const handleCloseForm = () => {
    if (!isSubmitting) {
      setShowReviewForm(false);
    }
  };

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
          driverId={'user_2msxfh6QIiMFhIAbgEog7Qiecc7'} 
          onSubmit={handleSubmitReview}
          onClose={handleCloseForm}
          isSubmitting={isSubmitting}
        />
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
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
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{review.content || 'No comment'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}