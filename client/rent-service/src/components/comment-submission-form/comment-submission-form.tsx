import { FormEvent, useEffect, useState , Fragment, useCallback } from 'react';
import { MIN_COMMENT_LENGTH, MAX_COMMENT_LENGTH, MIN_RATING, MAX_RATING, Status } from '../../const';
import { sendCommentAction } from '../../store/api-actions';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCommentPostStatus } from '../../store/review-data/review-data.selectors';
import { setCommentPostStatus } from '../../store/review-data/review-data.slice';
import { Comment } from '../../types/review';

type CommentSubmissionFormProps = {
  id: string;
}

function CommentSubmissionForm({id}: CommentSubmissionFormProps){
  const ratingValues = [
    {value: 5, title: 'perfect'},
    {value: 4, title: 'good'},
    {value: 3, title: 'not bad'},
    {value: 2, title: 'badly'},
    {value: 1, title: 'terribly'},
  ];
  const [form, setForm] = useState({rating: MIN_RATING, review: '', offerId: id });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const dispatch = useAppDispatch();
  const isCommentPosting = useAppSelector(getCommentPostStatus);
  const [isSending, setIsSending] = useState(false);

  const isValid = form.rating !== MIN_RATING && form.rating <= MAX_RATING && form.review.length >= MIN_COMMENT_LENGTH && form.review.length <= MAX_COMMENT_LENGTH;

  useEffect(() => {
    if (isValid) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [isValid]);

  useEffect(() => {
    if (isCommentPosting === Status.Success) {
      dispatch(setCommentPostStatus(Status.Idle));
      setForm({...form, review: '', rating: MIN_RATING});
    }
  }, [dispatch, form, isCommentPosting]);

  const handleRatingChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, rating: Number(evt.target.value) });
  },
  [form]
  );

  const handleReviewChange = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, review: evt.target.value });
  },
  [form]
  );

  const onSubmit = async (newComment: Comment) => await dispatch(sendCommentAction(newComment));

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    setIsSending(true);

    if (isValid) {
      onSubmit({rating: form.rating, comment: form.review,
        id: form.offerId,
      }).then(() => {
        setIsSending(false);
      });
    }
  };
  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {
          ratingValues.map((score) => (
            <Fragment key={score.value}>
              <input className="form__rating-input visually-hidden" name="rating" value={score.value} id={`${score.value}-stars`} checked={form.rating === score.value} type="radio" onChange={handleRatingChange} disabled={isSending} />
              <label htmlFor={`${score.value}-stars`} className="reviews__rating-label form__rating-label" title={score.title}>
                <svg className="form__star-image" width={37} height={33}><use xlinkHref="#icon-star" /></svg>
              </label>
            </Fragment>
          ))
        }
      </div>
      <textarea className="reviews__textarea form__textarea" name="review" id="review" placeholder="Tell how was your stay, what you like and what can be improved" onChange={handleReviewChange} value={form.review} disabled={isSending} />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">{MIN_COMMENT_LENGTH} characters</b>.
        </p>
        <button className="reviews__submit form__submit button" type="submit" disabled={isSending || isSubmitDisabled}>Submit</button>
      </div>
    </form >
  );
}

export { CommentSubmissionForm };
