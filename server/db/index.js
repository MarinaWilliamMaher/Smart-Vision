import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log('DB Connect Successfully');
  } catch (error) {
    console.log('DB Error: ' + error);
  }
};
export default dbConnection;
