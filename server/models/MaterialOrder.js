import mongoose, { Schema } from 'mongoose';
const materialOrderSchema = new mongoose.Schema(
  {
    engineer: {
      type: Schema.Types.ObjectId,
      ref: 'Employees',
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'ServicesOrders',
    },
    state: { type: String, default: 'PENDING' },
    materials: [
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

const MaterialOrders = mongoose.model('MaterialOrders', materialOrderSchema);
export default MaterialOrders;
