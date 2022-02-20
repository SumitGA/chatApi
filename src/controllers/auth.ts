import { Request, Response, NextFunction } from 'express';

const register = (req: Request, res: Response, next: NextFunction): any => {
  res.status(200).send('You are in the create method');
  next();
}

const login = (): any => {
}

const Delete = (): any => {
}

const Show = (): any => {
}

export default { register, login }; 