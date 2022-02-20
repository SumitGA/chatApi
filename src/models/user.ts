import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * An interface that describes the properties that are 
 * required to create a new User
 */
export default interface UserAttrs {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  comparePassword: comparePasswordFunction;
}

/**
 * An interface that describes the properties that a User has
 */

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

/**
 * An interface that describes the properties
 * that a User Document has
 */

export interface UserDoc extends mongoose.Document {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  comparePassword: comparePasswordFunction;
}

type comparePasswordFunction = (candidatePassword: string, password: string, cb: (err: mongoose.Error | any, isMatch: any) => void) => void;

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,

  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: false
  },
}, {
  toJSON: {
    // this will remove the password from the response and versioning
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

//Saving user hashed password
userSchema.pre("save", function save(next) {
  const user = this as UserDoc;
  if (!user.isModified("password")) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err: mongoose.Error | any, hash: string) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

const comparePassword: comparePasswordFunction = function (candidatePassword: string, password: string, cb) {
  bcrypt.compare(candidatePassword, password, (err: any, isMatch: boolean) => {
    cb(err, isMatch);
  })
}

userSchema.methods.comparePassword = comparePassword;

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
export { User }
