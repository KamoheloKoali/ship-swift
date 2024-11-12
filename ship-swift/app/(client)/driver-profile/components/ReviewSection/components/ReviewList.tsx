import { DriverReview } from '@/types/driver'
import { ReviewCard } from './ReviewCard'
import { ReviewSkeleton } from './ReviewSkeleton'

interface ReviewListProps {
  reviews: DriverReview[]
  isLoading: boolean
  onDeleteReview: (reviewId: string) => void
}

export const ReviewList = ({ reviews, isLoading, onDeleteReview }: ReviewListProps) => (
  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 -mr-4">
    {isLoading ? (
      [...Array(3)].map((_, index) => <ReviewSkeleton key={index} />)
    ) : reviews.length === 0 ? (
      <p className="text-gray-500 text-center py-4">No reviews yet</p>
    ) : (
      reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onDelete={onDeleteReview}
        />
      ))
    )}
  </div>
)