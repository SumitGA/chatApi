import passport from 'passport';
import passportLocal from 'passport-local';
import { User, UserDoc } from '../models';
import userInterface from '../models/user';
import { NativeError } from 'mongoose';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((req, user, done) => {
  done(undefined, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
})

passport.use('signin', new LocalStrategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err: NativeError, user: userInterface) => {
    if (err) { return done(err); }
    if (!user) {
      return done(undefined, false, { message: `Email ${email} not found.` });
    }
    user.comparePassword(password, user.password, (err: Error, isMatch: boolean) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(undefined, user);
      }
      return done(undefined, false, { message: "Invalid email or password." });
    });
  });
}));

export default passport;
