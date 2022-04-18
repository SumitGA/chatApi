import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from './middlewares/passport.middleware';
import morgan from 'morgan';
import { authRouter } from './routes';
import { postsRouter } from './routes';
import sessionMiddleware from './middlewares/session.middleware';
import 'dotenv/config';

const app: Express = express();

/** Logging */
app.use(morgan('dev'));
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());
app.use(cors({ "origin": "*" }));

app.use(cookieParser());
app.use(sessionMiddleware)
app.use(passport.initialize());
app.use(passport.session());
/** Routes */
app.use(authRouter);
app.use(postsRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err; // In development only, comment this out in production

  // Uncomment the following in production
  // res.locals.error = {};


  // render the error page
  res.status(err.status || 500);
  res.send(res.locals);
});

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({
    message: 'Resource not found.',
  });
});

/** Error handling */

export { app };