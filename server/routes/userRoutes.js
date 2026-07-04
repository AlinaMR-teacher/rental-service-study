import Router from 'express';
import { login, registration, checkAuth } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = new Router();

router.post('/login', login);
router.post('/register', registration);
router.get('/login', authenticateToken, checkAuth);  
router.delete('/logout', (req, res) => res.status(204).send());

export default router;
