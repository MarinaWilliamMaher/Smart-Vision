import mongoose, { Schema } from 'mongoose';
const reviewSchema = new mongoose.Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customers' },
    product: { type: Schema.Types.ObjectId, ref: 'Products' },
    comment: { type: String, required: true },
    rating: {
      type: Number,
      minlength: [1, 'Rating length should be greater than 1'],
      maxlength: [5, 'Rating length should be less than 5'],
    },
  },
  {
    timestamps: true,
  }
);

const Reviews = mongoose.model('Reviews', reviewSchema);
export default Reviews;
