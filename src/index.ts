import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/posts';

const app: Express = express();

/** Logging */
app.use(morgan('dev'));
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());
app.use(cors());
/** Routes */
app.use('/', routes);

/** Error handling */
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('not found');
  return res.status(404).json({
    message: error.message,
  });
});

/** Server */
const PORT: any = process.env.PORT ?? 8080;
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));