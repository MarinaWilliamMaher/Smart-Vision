import mongoose, { Schema } from 'mongoose';
const materialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is Required!'],
    },
    ARName: {
      type: String,
      required: [true, 'Arabic Name is Required!'],
    },
    quantity: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Materials = mongoose.model('Materials', materialSchema);
export default Materials;
