import express from 'express';
import authController from '../controllers/auth';
const router = express.Router();

router.get('/signup', authController.register);
router.get('/signin', authController.login);

export { router as authRouter };