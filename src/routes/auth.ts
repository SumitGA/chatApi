import express from 'express';
import authController from '../controllers/auth';
const router = express.Router();

router.get('/signup', authController.Create);
router.get('/signin', authController.Update);
router.put('/posts/:id', authController.Delete);
router.delete('/posts/:id', authController.Show);

export { router as authRouter };