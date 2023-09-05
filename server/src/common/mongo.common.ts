import mongoose from 'mongoose';
import { getMongoURI } from '@config/mongo.config';

export default async () => {
  const isProd = process.env.NODE_ENV === 'production';

  mongoose.set('strictQuery', false);
  const DB_URI = isProd ? getMongoURI() : 'mongodb://localhost:27017/secret';
  
  try {
    await mongoose.connect(DB_URI);
    console.log(`MongoDB connected: ${DB_URI}`);
  } catch (err) {
    console.log(err);
  }
}