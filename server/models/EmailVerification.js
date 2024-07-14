import mongoose, { Schema } from 'mongoose';
const emailVerificationSchema = new mongoose.Schema({
  customerId: String,
  token: String,
  createdAt: Date,
  expiresAt: Date,
});

const Verifications = mongoose.model('Verification', emailVerificationSchema);
export default Verifications;
