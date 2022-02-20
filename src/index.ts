import mongoose from "mongoose";
import { app } from './app';
import 'dotenv/config';

// Connecting to mongodb instance on local server
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo URI must be defind')
  }
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to mongodb');
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000')
})

start();