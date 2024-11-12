import { DriverReview } from '@/types/driver'
import { StarRating } from './StarRating'
import { DeleteReviewDialog } from './DeleteReviewDialog'

interface ReviewCardProps {
  review: DriverReview
  onDelete: (reviewId: string) => void
}

export const ReviewCard = ({ review, onDelete }: ReviewCardProps) => (
  <div className="border rounded-lg p-4">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-medium">
          {review.client ? `${review.client.firstName} ${review.client.lastName}` : 'Anonymous'}
        </p>
        <StarRating rating={review.rating} />
      </div>
      <div className="flex items-center">
        <span className="text-sm text-gray-500 mr-2">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
        <DeleteReviewDialog onDelete={() => onDelete(review.id)} />
      </div>
    </div>
    <p className="mt-2 text-gray-600">{review.content || 'No comment'}</p>
  </div>
)