import express, { Request, Response, NextFunction } from 'express';
import authController from '../controllers/auth';
import passport from '../middlewares/passport.middleware';
const router = express.Router();

router.post('/auth/signup', authController.register);
router.post('/auth/signin', passport.authenticate('login', { session: false }), authController.login);

export { router as authRouter };