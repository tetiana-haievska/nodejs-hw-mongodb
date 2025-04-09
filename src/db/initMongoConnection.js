import { getEnvVar } from '../utils/getEnvVar.js';
import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const password = getEnvVar('MONGODB_PASSWORD');
    const cluster = getEnvVar('MONGODB_CLUSTER');
    const db = getEnvVar('MONGODB_DB_NAME');

    const uri = `mongodb+srv://${user}:${password}@${cluster}/${db}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(uri);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
