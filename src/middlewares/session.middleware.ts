import { Request, Response, NextFunction } from 'express';
import MongoStore from 'connect-mongo';
import session from 'express-session';

const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  return session({
    secret: process.env.SESSION_SECRET || 'secretCode',
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || 'mongodb://localhost/test',
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })(req, res, next);
}

export default sessionMiddleware;