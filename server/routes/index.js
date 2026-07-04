import Router from 'express';
import userRouter from './userRoutes.js'; 
import offerRouter from './offerRoutes.js';
import reviewRouter from './reviewRoutes.js';



const router = new Router();

router.use('/', offerRouter)
router.use('/', userRouter)
router.use('/comments', reviewRouter)


export default router