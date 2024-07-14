import mongoose, { Schema } from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);
const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: Number },
    customerData: {
      firstName: { type: String },
      lastName: { type: String },
      phoneNumber: { type: Number },
      city: { type: String },
      country: { type: String },
      address: { type: String },
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customers',
    },
    products: [
      {
        quantity: { type: Number },
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Products',
        },
      },
    ],
    totalPrice: { type: Number },
    totalPoints: { type: Number },
    state: { type: String, default: 'PENDING' },
    cancelOrderExpiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
orderSchema.plugin(AutoIncrement, {
  id: 'orderNumbers',
  inc_field: 'orderNumber',
});
const Orders = mongoose.model('Orders', orderSchema);
export default Orders;
