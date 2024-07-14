import AssignedDateTable from '../models/AssignedDate.js';
import ContactUs from '../models/ContactUs.js';
import Employees from '../models/Employee.js';
import Orders from '../models/OrderModel.js';
import ServicesOrders from '../models/ServiceOrder.js';
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Orders.find().populate([
      {
        path: 'customer',
        select: '_id username email -password',
      },
      {
        path: 'products',
        populate: {
          path: 'product',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      orders: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
    });
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by ID and populate customer and products
    const order = await Orders.findById(orderId).populate([
      {
        path: 'customer',
        select: '_id username email -password',
      },
      {
        path: 'products',
        populate: {
          path: 'product',
        },
      },
    ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      order: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve the order',
    });
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.body.orderId; // Assuming the order ID is passed in the request parameters
    const { newStatus } = req.body; // Assuming the new status is passed in the request body
    if (!newStatus || !orderId) {
      next('Provide Required Fields!');
      return;
    }
    // Find the order by ID
    const order = await Orders.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Update the status
    order.state = newStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
    });
  }
};

export const updateServiceOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.body.orderId; // Assuming the order ID is passed in the request parameters
    const { newState } = req.body; // Assuming the new state is passed in the request body
    if (!newState || !orderId) {
      next('Provide Required Fields!');
      return;
    }
    // Find the service order by ID
    const serviceOrder = await ServicesOrders.findById(orderId);

    if (!serviceOrder) {
      return res.status(404).json({
        success: false,
        message: 'Service order not found',
      });
    }

    // Update the state
    serviceOrder.state = newState;
    await serviceOrder.save();

    res.status(200).json({
      success: true,
      message: 'Service order state updated successfully',
      serviceOrder: serviceOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service order state',
    });
  }
};

export const assignedEnginerToService = async (req, res, next) => {
  try {
    const { engineerId, serviceId, date } = req.body;
    let service;
    if (date) {
      const busyDates = await AssignedDateTable.find({
        engineer: engineerId,
        date: date,
      });
      if (busyDates.length < 1) {
        service = await ServicesOrders.findByIdAndUpdate(
          { _id: serviceId },
          { assignedEngineer: engineerId, date: date },
          { new: true }
        ).populate([
          {
            path: 'customer',
            select:
              '_id username email gender phone verified address -password',
          },
          {
            path: 'assignedEngineer',
            select: '_id username email -password',
          },
        ]);
        await AssignedDateTable.create({
          engineer: engineerId,
          date: date,
        });
      } else {
        return res.status(403).json({
          success: false,
          message: 'Is already assinged to anthor service in this time',
        });
      }
    } else {
      service = await ServicesOrders.findByIdAndUpdate(
        { _id: serviceId },
        { assignedEngineer: engineerId },
        { new: true }
      ).populate([
        {
          path: 'customer',
          select: '_id username email gender phone verified address -password',
        },
        {
          path: 'assignedEngineer',
          select: '_id username email -password',
        },
      ]);
    }
    res.status(200).json({
      success: true,
      message: 'assignd engineer to order successfully',
      service: service,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllServices = async (req, res, next) => {
  try {
    const services = await ServicesOrders.find({
      state: { $ne: 'CANCELED' },
    }).populate([
      {
        path: 'customer',
        select: '_id username email gender phone verified address -password',
      },
      {
        path: 'assignedEngineer',
        select: '_id username email -password',
      },
    ]);

    if (!services || services.length === 0) {
      next('No service orders found');
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Get services orders',
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get services orders',
    });
  }
};

export const getAllEngineers = async (req, res, next) => {
  try {
    const engineers = await Employees.find({ jobTitle: 'engineer' });

    if (!engineers || engineers.length === 0) {
      next('No engineers found');
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Get engineers',
      engineers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get all engineers',
    });
  }
};

export const sentProductOrderToInventory = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    // Find the order by ID and populate customer and products
    const order = await Orders.findByIdAndUpdate(
      { _id: orderId },
      { state: 'Confirmed' },
      { new: true }
    ).populate([
      {
        path: 'customer',
        select: '_id username email -password',
      },
      {
        path: 'products',
        populate: {
          path: 'product',
        },
      },
    ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      order: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve the order',
    });
  }
};

export const getContactUs = async (req, res, next) => {
  try {
    const contactUs = await ContactUs.find({});
    if (contactUs.length === 0) {
      next('No engineers found');
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Get all contactUs',
      contactUs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get all contactUs',
    });
  }
};

export const deleteContactUs = async (req, res, next) => {
  try {
    const { contactUsId } = req.params;
    console.log(contactUsId);
    await ContactUs.findByIdAndDelete({ _id: contactUsId });
    res.status(200).json({
      success: true,
      message: 'delete the contactUs',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete contactUs',
    });
  }
};
