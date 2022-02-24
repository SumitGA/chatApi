import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { firstnane, lastname, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.status(403).json({ message: 'Email is already in use' });
  }

  user = await User.create({ firstnane, lastname, email, password });

  req.login(user, (err) => {
    if (err) throw err;
    res.status(201).json({
      user
    });
  })
}

const login = (): any => {
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