import { ReviewItem } from '../review-item/review-item';
import { Review } from '../../types/review';

type ReviewsListProps = {
  displayedComments: Review[];
  }

function ReviewsList({ displayedComments }: ReviewsListProps) {
  return (
    <ul className="reviews__list">
      {displayedComments.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </ul>
  );

}

export { ReviewsList };
