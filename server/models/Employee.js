import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is Required!'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is Required!'],
    },
    username: {
      type: String,
      required: [true, 'Username is Required!'],
    },
    email: {
      type: String,
      required: [true, 'Email is Required!'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is Required!'],
      minlength: [6, 'Password length should be greater than 6 characters'],
      select: true,
    },
    gender: {
      type: String,
      required: [true, 'Gender is Required!'],
    },
    address: {
      type: String,
      required: [true, 'Address is Required!'],
    },
    phone: {
      type: Number,
      required: [true, 'Phone is Required!'],
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is Required!'],
    },
    salary: {
      type: Number,
      required: [true, 'Salary is Required!'],
    },
    jobTitle: { type: String, required: [true, 'Job title is Required!'] },
    birthday: { type: Date },
    verified: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Employees = mongoose.model('Employees', employeeSchema);
export default Employees;
