import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import passport from '../middlewares/passport.middleware';
import userInterface from '../models/user';
import { doesNotMatch } from 'assert';
import 'dotenv/config';

interface ErrorInterface {
  code: string;
  message: string;
  field: string;
  status: number;
}

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.status(403).json({ message: 'Email is already in use' });
  }

  user = await User.create({ username, email, password });

  // const token = jwt.sign({ id: user.id, email: user.email }, `${process.env.JWT_SECRET}`, { expiresIn: '24h' });

  // res.status(201).json({
  //   user,
  //   accessToken: `Bearer ${token}`,
  //   expiresIn: '24h',
  // })
  if (!user) {
    res.status(500).json({ message: 'Could not create user' });
  }

  res.status(201).json({ message: 'User created successfully' });
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Incorrect email or password' });
    } else {
      const token = jwt.sign({ id: user.id, email: user.email }, `${process.env.JWT_SECRET}`, { expiresIn: '24h' });
      res.status(200).json({
        user,
        accessToken: `Bearer ${token}`,
        expiresIn: '24h',
      });
    }
  } catch (error) {
    res.status(401).json({ message: 'Could not login. Something went wrong' });
  }
}

const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logOut();
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    res.status(204).json({ message: 'Logged out' });
  })
}

// TODO: Rename the function to something more meaningful
const me = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) res.status(200).json({ user: req.user });
  else res.status(401).json({ user: null });
}

export default { register, login, logout, me }; 