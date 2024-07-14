import mongoose, { Schema } from 'mongoose';
const customizedOrderSchema = new mongoose.Schema(
  {
    customerID: {
      type: String, // if exist put customer id if not put out to note that this customer came from store.
    },
    name: { type: String, required: [true, 'Name is Required!'] },
    address: { type: String },
    phone: { type: Number },
    Price: { type: Number },
    state: { type: String },
    description: { type: String },
    data: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CustomizedOrders = mongoose.model(
  'CustomizedOrders',
  customizedOrderSchema
);
export default CustomizedOrders;
