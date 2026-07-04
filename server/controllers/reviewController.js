import Review from '../models/review.js';
import ApiError from '../error/ApiError.js';
import User from '../models/user.js';



export const addReview = async (req, res, next) => {
  try {
    const { comment, rating } = req.body;
    const offerId = req.params.offerId;
    const userId = req.user.id; 

    if (!comment || !rating || !offerId) {
      return next(ApiError.badRequest('Не хватает данных для комментария'));
    }

    const review = await Review.create({
      text: comment,
      rating,
      authorId: userId,
      OfferId: offerId
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    next(ApiError.badRequest('Ошибка при добавлении комментария'));
  }
};


  const adaptReviewToClient = (review) => {
    const baseUrl = `${process.env.HOST}:${process.env.PORT || 5000}`;
    const prepareUrl = (url) => (url && !url.startsWith('http') ? `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}` : url);
  
    return {
      id: String(review.id),
      comment: review.text,
      rating: review.rating,
      date: review.publishDate.toISOString(),
      user: {
        name: review.author?.name || 'Unknown',
        avatarUrl: prepareUrl(review.author?.avatarUrl || ''),
        isPro: review.author?.isPro || false
      }
    };
  };

  
  export const getReviewsByOfferId = async (req, res, next) => {
    try {
      const reviews = await Review.findAll({
        where: { OfferId: req.params.offerId },
        include: { model: User, as: 'author' },
        order: [['publishDate', 'DESC']]
      });
  
      const adaptedReviews = reviews.map(adaptReviewToClient);
      res.json(adaptedReviews);
    } catch (error) {
      console.error(error);
      next(ApiError.internal('Ошибка при получении комментариев'));
    }
  };
  

export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.findAll();
    res.send(reviews);
  } catch (error) {
    next(ApiError.internal('Не удалось получить список предложений'));
  }
}

