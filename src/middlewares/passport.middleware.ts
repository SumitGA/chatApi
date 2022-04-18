import passport from 'passport';
import passportLocal from 'passport-local';
import { Request } from 'express';
import { User, UserDoc } from '../models';
import userInterface from '../models/user';
import { NextFunction } from 'express';
import { NativeError } from 'mongoose';
import passportJwt from 'passport-jwt';
import 'dotenv/config';


const LocalStrategy = passportLocal.Strategy;
// Implements passport-jwt Strategy
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (user: any, done) => {
  User.findById(user.id, function (err: any, user: any) {
    done(err, user);
  })
})

passport.use('signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (username: String, password: String, done: NextFunction) => {
  try {
    const user = await User.create({ username: String, email: String, password: String });
    return done(user);
  } catch (error) {
    return done(error)
  }
}));

passport.use('login', new LocalStrategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
  try {
    const user = await User.findOne({
      where: {
        email
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
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
},
  async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ where: { email: jwt_payload.email } });
      // const user = await User.findById(jwt_payload.id);
      if (!user) {
        return done(null);
      }
      // Never change this line, requires exactly to continue with done(null, user)
      done(null, user);
    } catch (error) {
      done(error)
    }
  }
))
export default passport;
