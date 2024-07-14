import ServicesOrders from '../models/ServiceOrder.js';

export const getCustomizationOrdersDetails = async (req, res, next) => {
  try {
    const customizationOrdersDetails = await ServicesOrders.find({
      service: 'Customization Service',
      state: 'MANFACTURING',
    }).populate({
      path: 'customer',
      select: '-password',
    });
    res.status(200).json({
      success: true,
      message: 'get customization orders details successfully',
      customizationOrdersDetails,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateServiceOrderStateToShipped = async (req, res, next) => {
  try {
    const { orderId } = req.body; // Assuming the order ID is passed in the request parameters

    // Find the service order by ID
    const serviceOrder = await ServicesOrders.findById(orderId).populate({
      path: 'customer',
      select: '-password',
    });

    // If service order not found
    if (!serviceOrder) {
      return res.status(404).json({
        success: false,
        message: 'Service order not found',
      });
    }

    // Update the state to "Shipped"
    serviceOrder.state = 'Shipped';

    // Save the updated service order to the database
    await serviceOrder.save();

    res.status(200).json({
      success: true,
      message: 'Service order state updated to Shipped',
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
