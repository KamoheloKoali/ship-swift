import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Star, StarHalf } from "lucide-react";
import { ReviewForm } from './ReviwForm';
import { useCallback } from 'react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  date: string;
}

interface ReviewSectionProps {
  driverId: string;
  reviews: Review[];
}

export function ReviewSection({ driverId, reviews }: ReviewSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleSubmitReview = useCallback(async (reviewData: { rating: number, content?: string }) => {
    try {
      console.log('Submitting review for driver:', driverId); // Debug log
      
      const response = await fetch(`/api/drivers/${driverId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit review');
      }

      // Handle successful submission
      return await response.json();
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }, [driverId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Driver Reviews</h3>
        <Button 
          variant="outline" 
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          {showReviewForm ? 'Cancel Review' : 'Leave a Review'}
        </Button>
      </div>

      {showReviewForm && <ReviewForm driverId={driverId} onClose={() => setShowReviewForm(false)} />}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{review.reviewerName}</p>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    i < review.rating 
                      ? <Star key={i} className="h-4 w-4 text-yellow-400" />
                      : <StarHalf key={i} className="h-4 w-4 text-gray-300" />
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <p className="mt-2 text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}