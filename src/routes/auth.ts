import express, { Request, Response, NextFunction } from 'express';
import authController from '../controllers/auth';
import passport from '../middlewares/passport.middleware';
const router = express.Router();

router.post('/auth/signup', authController.register);
router.post('/auth/signin', authController.login);
router.post('/auth/logout', authController.logout);

export { router as authRouter };