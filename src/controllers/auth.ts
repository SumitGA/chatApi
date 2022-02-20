import { Request, Response, NextFunction } from 'express';

const Create = (req: Request, res: Response, next: NextFunction): any => {
  res.status(200).send('You are in the create method');
  next();
}

const Update = (): any => {

}

const Delete = (): any => {

}

const Show = (): any => {
}

export default { Create, Update, Delete, Show }