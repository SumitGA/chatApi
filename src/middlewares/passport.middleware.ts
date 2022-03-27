import passport from 'passport';
import passportLocal from 'passport-local';
import { User, UserDoc } from '../models';
import userInterface from '../models/user';
import mongoose from 'mongoose';
import { NextFunction } from 'express';
import { NativeError } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * @Interface Declarations sections
 */
interface TokenInterface {
  email: String;
  id: String;
  username: String;
}

const LocalStrategy = passportLocal.Strategy;
// Implements passport-jwt Strategy
const JwtStrategy = Strategy;

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  // Converting id into mongoose readable from;
  const userId = new mongoose.Types.ObjectId(id);
  try {
    const user = await User.findOne({ _id: userId });
    done(undefined, user);
  } catch (error) {
    done(error, undefined);
  }
})

passport.use('signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (username: String, password: String, done: NextFunction) => {
  try {
    const user = await User.create({ username: String, email: String, password: String });
    return done(user);
  } catch (error) {
    done(error)
  }
}));

passport.use('login', new LocalStrategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
  try {
    const user = await User.findOne({
      where: {
        email: email
      },
    });

    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    if (user.email !== email) {
      return done(null, false, { message: 'Incorrect email' });
    }

    const validate = user.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user, { message: 'Logged in Successfully' });
    });
  } catch (error) {
    return done(error);
  }
}));


passport.use('jwt', new JwtStrategy({
  secretOrKey: `${process.env.JWT_SECRET}`,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  algorithms: ["RS512"],
},
  async (token: TokenInterface, done: NextFunction) => {
    try {
      const user = await User.findOne({
        where: {
          email: token.email
        }
      });
      if (!user) {
        return done(null);
      }
      return done(user);
    } catch (error) {
      done(error)
    }
  }
))

export default passport;
