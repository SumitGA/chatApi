import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import morgan from 'morgan';
import { authRouter } from './routes';
import { postsRouter } from './routes';

const app: Express = express();

/** Logging */
app.use(morgan('dev'));
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: 'secretCode',
    resave: true,
    saveUninitialized: true,
  })
)
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
/** Routes */
app.use(authRouter);
app.use(postsRouter);

/** Error handling */

export { app };