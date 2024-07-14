import ContactUs from '../models/ContactUs.js';
import Customers from '../models/CustomerModel.js';
import Verifications from '../models/EmailVerification.js';
import Orders from '../models/OrderModel.js';
import Products from '../models/ProductModel.js';
import Reviews from '../models/Review.js';
import ServicesOrders from '../models/ServiceOrder.js';
import Employees from '../models/Employee.js';
import { hashString } from '../utils/index.js';
import { calculateTotalRating } from './productControlles.js';

export const getAllCustomers = async (req, res, next) => {
  const customers = await Customers.find({}).select('-password');
  res.status(200).json({
    success: true,
    message: 'get data successfully',
    customers,
  });
};

export const getCustomerById = async (req, res, next) => {
  const { customerId } = req.params;

  try {
    const customer = await Customers.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer data retrieved successfully',
      customer,
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.body;

    const deletedCustomer = await Customers.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
      customer: deletedCustomer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
    });
  }
};
export const manageCustomers = async (req, res, next) => {
  try {
    const { customerId, username, email, gender, phone, address, password } =
      req.body;
    const hashedPassword = await hashString(password);

    const customerData = {
      customerId,
      username,
      email,
      gender,
      phone,
      address,
      password: hashedPassword,
    };

    if (
      !customerId ||
      !username ||
      !email ||
      !gender ||
      !phone ||
      !address ||
      !password
    ) {
      next('Provide Required Fields!');
      return;
    }

    const updatedCustomer = await Customers.findByIdAndUpdate(
      { _id: customerId },
      { ...customerData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Update customer successfully',
      updatedCustomer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer data',
    });
  }
};
export const addCustomer = async (req, res, next) => {
  try {
    const { username, email, password, gender, phone, address } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password || !gender || !phone || !address) {
      next('Provide Required Fields!');
      return;
    }

    // Check if the email is provided and it's valid
    if (!email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Check if the password meets the length requirement
    if (password.length < 7) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 7 characters long',
      });
    }

    // Check if the email is already registered
    const existingCustomer = await Customers.findOne({ email: email });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered',
      });
    }
    const hashedPassword = await hashString(password);
    // Create a new customer instance
    const newCustomer = await Customers.create({
      username: username,
      email: email,
      password: hashedPassword,
      gender: gender,
      phone: phone,
      address: address,
      verified: 'true',
    });

    res.status(201).json({
      success: true,
      message: 'Customer added successfully',
      customer: newCustomer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to add customer',
    });
  }
};
export const deleteReview = async (req, res, next) => {
  try {
    const { customerId, reviewId, productId } = req.body;
    console.log(customerId, reviewId, productId);
    const review = await Reviews.findById({ _id: reviewId });
    const product = await Products.findById({ _id: productId }).populate(
      'reviews'
    );
    if (String(review.customer) === customerId) {
      //delete review from product
      product.reviews = product.reviews.filter(
        (pid) => String(pid._id) !== String(review._id)
      );
      //Calculate totalRating
      product.totalRating = await calculateTotalRating(product.reviews);
      const newProductData = await Products.findByIdAndUpdate(
        { _id: productId },
        product,
        {
          new: true,
        }
      );
      const deletedReview = await Reviews.findOneAndDelete({ _id: reviewId });
      res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
        deletedReview,
        newProductData: newProductData,
        totalRating: product.totalRating,
      });
    } else {
      next('you are unauthorized to remove this review');
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'failed to delete review',
    });
  }
};

export const getCustomizationOrders = async (req, res, next) => {
  try {
    const customizationOrders = await ServicesOrders.find({
      service: 'Customization Service',
    }).populate([
      {
        path: 'customer',
        select: '-password',
      },
      {
        path: 'assignedEngineer',
        select: '_id username email -password',
      },
    ]);
    res.status(200).json({
      success: true,
      message: 'get customization orders successfully',
      customizationOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const service = await ServicesOrders.find({ _id: serviceId }).populate([
      {
        path: 'customer',
        select: '_id username email gender phone verified address -password',
      },
      {
        path: 'assignedEngineer',
        select: '_id username email -password',
      },
    ]);

    if (!service || service.length === 0) {
      next('No service orders found');
      return;
    }
    res.status(200).json({
      success: true,
      message: 'found successfully',
      service,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'this service not found',
    });
  }
};

export const addEmployee = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      gender,
      jobTitle,
      qualification,
      birthday,
      salary,
      phone,
      address,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !gender ||
      !jobTitle ||
      !qualification ||
      !birthday ||
      !salary ||
      !phone ||
      !address
    ) {
      next('Provide Required Fields!');
      return;
    }
    // Check if the email is provided and it's valid
    if (!email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Check if the password meets the length requirement
    if (password.length < 7) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 7 characters long',
      });
    }

    // Check if the email is already registered
    const existingEmployee = await Employees.findOne({ email: email });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered',
      });
    }
    // Hash the password
    const hashedPassword = await hashString(password);
    // Create a new employee instance
    const newEmployee = await Employees.create({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hashedPassword, // Store the hashed password
      gender: gender,
      jobTitle: jobTitle,
      qualification: qualification,
      birthday: birthday,
      salary: salary,
      phone: phone,
      address: address,
    });

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      employee: newEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to add employee',
    });
  }
};

export const manageEmployees = async (req, res, next) => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      email,
      gender,
      jobTitle,
      qualification,
      birthday,
      salary,
      phone,
      address,
    } = req.body;

    const employeeData = req.body;

    if (
      !employeeId ||
      !firstName ||
      !lastName ||
      !email ||
      !gender ||
      !jobTitle ||
      !qualification ||
      !birthday ||
      !salary ||
      !phone ||
      !address
    ) {
      next('Provide Required Fields!');
      return;
    }

    if (salary < 0) {
      next('salary cannot be less than 0!');
      return;
    }

    const updatedEmployee = await Employees.findByIdAndUpdate(
      { _id: employeeId },
      { ...employeeData },
      { new: true, select: '-password' } // Correct placement of .select('-password')
    );

    res.status(200).json({
      success: true,
      message: 'Update employee successfully',
      updatedEmployee,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee data',
    });
  }
};

export const getAllEmployees = async (req, res, next) => {
  try {
    // Query the database to get all employees
    const allEmployees = await Employees.find().select('-password');

    res.status(200).json({
      success: true,
      message: 'All employees retrieved successfully',
      employees: allEmployees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve employees',
    });
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params; // Assuming the employee ID is passed as a parameter in the URL

    // Query the database to find the employee by ID
    const employee = await Employees.findById(id).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully',
      employee: employee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve employee',
    });
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.body; // Assuming the employee ID is passed as a parameter in the URL

    // Find the employee by ID and delete it
    const deletedEmployee = await Employees.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      employee: deletedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
    });
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { id, newPassword } = req.body;

    // Find the employee by email
    const employee = await Employees.findById({ _id: id });

    // If employee not found
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Hash the new password
    const hashedNewPassword = await hashString(newPassword);
    await Employees.findByIdAndUpdate(
      { _id: id },
      {
        password: hashedNewPassword,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
    });
  }
};
