import mongoose from 'mongoose';
import { ENV } from '../constants/constant';

const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGODB_URI as string);
    console.log('database connected 🥳🥳');
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error('MongoDB connection failed:', error.message);
    else console.error('MongoDB connection failed:', 'Unknown Error');

    process.exit(1);
  }
};

export default connectDB;
