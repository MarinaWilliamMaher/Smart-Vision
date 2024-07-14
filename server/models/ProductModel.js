import mongoose, { Schema } from 'mongoose';
import Reviews from './Review.js';
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is Required!'],
    },
    ARName: {
      type: String,
      required: [true, 'Arabic Product Name is Required!'],
    },
    description: {
      type: String,
    },
    ARDescription: {
      type: String,
    },
    quantity: {
      type: Number,
      required: [true, 'quantity is Required!'],
    },
    category: { type: String },
    price: { type: Number },
    images: [{ type: String }],
    likes: [{ type: String }],
    points: { type: Number },
    views: [{ type: String }],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Reviews' }],
    show: { type: Boolean, default: false },
    colors: [{ type: String }],
    totalRating: { type: Number, default: 0 },
    dimensions: {
      width: { type: Number },
      weight: { type: Number },
      height: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

/* required: [true, 'Product price is Required!'] */
/*  default: 200  */

productSchema.pre('findOneAndDelete', async function (next) {
  //console.log(this.reviews);
  try {
    const product = await this.model.findOne(this.getQuery());
    if (product.reviews.length) {
      const res = await Reviews.deleteMany({
        _id: {
          $in: product.reviews,
        },
      });
      console.log(res);
    }
  } catch (error) {
    console.log(error);
  }
});
const Products = mongoose.model('Products', productSchema);
export default Products;
