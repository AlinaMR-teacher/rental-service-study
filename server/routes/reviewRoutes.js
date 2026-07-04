import Router from 'express';
import { getAllReviews, getReviewsByOfferId, addReview } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = new Router();

router.get('/:offerId', getReviewsByOfferId);
router.post('/:offerId', authenticateToken, addReview);
router.get('/reviews', getAllReviews);


export default router;