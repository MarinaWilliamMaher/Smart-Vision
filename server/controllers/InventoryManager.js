import MaterialOrders from '../models/MaterialOrder.js';
import Orders from '../models/OrderModel.js';
import IventoryTransactions from '../models/inventoryTransaction.js';

export const getMaterialOrders = async (req, res, next) => {
  try {
    const materialOrders = await MaterialOrders.find({}).populate([
      {
        path: 'engineer',
        select: '_id username email -password',
      },
      {
        path: 'service',
        select: '',
      },
    ]);
    res.status(200).json({
      success: true,
      message: 'get customization orders successfully',
      materialOrders,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await IventoryTransactions.find().populate({
      path: 'inventoryManager',
      select: '_id username email -password',
    });
    res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      transactions: transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transactions',
    });
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const confirmedOrders = await Orders.find({ state: 'PENDING' }).populate([
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
      orders: confirmedOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
    });
  }
};

export const sendOrderToShipped = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    console.log(orderId);
    const { managerId, products } = req.body;
    console.log(managerId, products);
    const ShippedOrder = await Orders.findByIdAndUpdate(
      { _id: orderId },
      { state: 'Shipped' },
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
    if (!managerId || !products.length) {
      next('Provide Required Fields!');
      return;
    }
    await IventoryTransactions.create({
      category: 'Products',
      inventoryManager: managerId,
      transaction: 'Export',
      products: products,
    });
    res.status(200).json({
      success: true,
      message: 'Order shipped and export successfully',
      order: ShippedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to ship and export order',
    });
  }
};
export const changeStateToShipped = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    // Find the material order by ID and update its state to "shipped"
    const updatedOrder = await MaterialOrders.findByIdAndUpdate(
      orderId,
      { state: 'SHIPPED' },
      { new: true } // To return the updated document
    )
      .populate({
        path: 'service',
        select: 'service',
      })
      .select('-engineer');

    // Check if the order exists
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Material order not found',
      });
    }

    // Send a success response
    res.status(200).json({
      success: true,
      message: 'Material order state changed to "shipped"',
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to change material order state',
    });
  }
};
