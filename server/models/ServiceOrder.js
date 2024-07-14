import mongoose, { Schema } from 'mongoose';
const serviceOrderSchema = new mongoose.Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customers',
    },
    state: { type: String, default: 'PENDING' },
    service: {
      type: String,
      required: [true, 'Service is Required!'],
    },
    description: {
      type: String,
      required: [true, 'Description is Required!'],
    },
    ARDescription: {
      type: String,
      /* required: [true, 'Arabic Description is Required!'], */
    },
    address: {
      type: String,
    },
    phone: { type: Number },
    images: [{ type: String }],
    details: {
      type: String,
    },
    price: { type: Number },
    measuring: { type: Boolean },
    assignedEngineer: {
      type: Schema.Types.ObjectId,
      ref: 'Employees',
    },
    date: {
      day: { type: String },
      time: { type: String },
    },
    cancelServiceOrderExpiresAt: { type: Date },
    requiredMaterials: [
      {
        quantity: { type: Number },
        material: {
          type: String,
        },
        ARMaterial: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ServicesOrders = mongoose.model('ServicesOrders', serviceOrderSchema);
export default ServicesOrders;
