import Router from 'express';
import { createOffer, getAllOffers, getFullOffer,  toggleFavorite, getNearbyOffers, getFavoriteOffers} from '../controllers/offerController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';



const router = new Router();

router.get('/offers', getAllOffers)
router.get('/favorite', getFavoriteOffers)
router.get('/offers/:id', getFullOffer)
router.get('/offers/:id/nearby', getNearbyOffers)

router.post('/favorite/:offerId/:status', authenticateToken, toggleFavorite);
router.post('/offer', createOffer);



export default router