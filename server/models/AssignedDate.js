import mongoose, { Schema } from 'mongoose';

const assignedDateSchema = new mongoose.Schema(
  {
    engineer: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    },
    date: {
      day: { type: String },
      time: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const AssignedDateTable = mongoose.model('AssignedDate', assignedDateSchema);
export default AssignedDateTable;
