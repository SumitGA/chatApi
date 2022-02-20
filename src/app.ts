import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import morgan from 'morgan';
import { authRouter } from './routes';
import { postsRouter } from './routes';
import sessionMiddleware from './middlewares/session.middleware';

const app: Express = express();

/** Logging */
app.use(morgan('dev'));
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());
app.use(cors());

/** using express-session middlware */

app.use(cookieParser());
app.use(sessionMiddleware)
app.use(passport.initialize());
app.use(passport.session());
/** Routes */
app.use(authRouter);
app.use(postsRouter);

/** Error handling */

export { app };