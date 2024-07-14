import mongoose, { Schema } from 'mongoose';
import Orders from './OrderModel.js';
import ServicesOrders from './ServiceOrder.js';
import Reviews from './Review.js';
import Products from './ProductModel.js';
import { calculateTotalRating } from '../controllers/productControlles.js';
const customerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'userName is Required!'],
    },
    email: {
      type: String,
      required: [true, 'Email is Required!'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is Required!'],
      minlength: [6, 'Password length should be greater than 6 character'],
      select: true,
    },
    gender: { type: String },
    address: { type: String },
    phone: { type: Number, unique: true },

    points: { type: Number, default: 0 },
    favoriteList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Products',
      },
    ],
    orderHistory: [{ type: Schema.Types.ObjectId, ref: 'Orders' }],
    serviceHistory: [{ type: Schema.Types.ObjectId, ref: 'ServicesOrders' }],
    customizedHistory: [
      { type: Schema.Types.ObjectId, ref: 'CustomizedOrders' },
    ],
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

customerSchema.pre('findOneAndDelete', async function (next) {
  //console.log(this.reviews);
  try {
    const customer = await this.model.findOne(this.getQuery());
    if (customer.orderHistory.length) {
      await Orders.deleteMany({
        _id: {
          $in: customer.orderHistory,
        },
      });
    }
    if (customer.serviceHistory.length) {
      await ServicesOrders.deleteMany({
        _id: {
          $in: customer.serviceHistory,
        },
      });
    }
    if (customer.customizedHistory.length) {
      await ServicesOrders.deleteMany({
        _id: {
          $in: customer.customizedHistory,
        },
      });
    }
    const customerReviews = await Reviews.find({
      customer: customer._id,
    });
    //console.log(customerReviews);
    if (customerReviews) {
      await Promise.all(
        customerReviews.map(async (review) => {
          const product = await Products.findById({ _id: review.product });
          //remove customerReviews from productReviews
          product.reviews = product.reviews.filter(
            (pid) => String(pid._id) !== String(review._id)
          );
          //Calculate totalRating
          product.totalRating = await calculateTotalRating(product.reviews);
          await Products.findByIdAndUpdate({ _id: review.product }, product, {
            new: true,
          });
        })
      );
      await Reviews.deleteMany({
        customer: customer._id,
      });
    } else {
      console.log('no reviews');
    }
  } catch (error) {
    console.log(error?.message);
  }
});

const Customers = mongoose.model('Customers', customerSchema);
export default Customers;
