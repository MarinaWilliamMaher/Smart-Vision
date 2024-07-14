import AssignedDateTable from '../models/AssignedDate.js';
import Employees from '../models/Employee.js';
import MaterialOrders from '../models/MaterialOrder.js';
import ServicesOrders from '../models/ServiceOrder.js';

export const getAssignedServices = async (req, res, nex) => {
  try {
    const { id } = req.params;
    const { serviceName } = req.body;
    let assignedOrders;
    if (serviceName) {
      assignedOrders = await ServicesOrders.find({
        assignedEngineer: id,
        service: serviceName,
        state: 'PENDING',
      }).populate([
        {
          path: 'customer',
          select: 'username phone email address -password',
        },
        {
          path: 'assignedEngineer',
          select: '_id username email -password',
        },
      ]);
    } else {
      assignedOrders = await ServicesOrders.find({
        assignedEngineer: id,
        state: 'PENDING',
      }).populate([
        {
          path: 'customer',
          select: 'username phone email address -password',
        },
        {
          path: 'assignedEngineer',
          select: '_id username email -password',
        },
      ]);
    }
    res.status(200).json({
      success: true,
      message: 'get customization orders successfully',
      services: assignedOrders,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCustomizationOrdersById = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const order = await ServicesOrders.findById({
      _id: serviceId,
    }).populate([
      {
        path: 'customer',
        select: 'username phone email address -password',
      },
      {
        path: 'assignedEngineer',
        select: '_id username email -password',
      },
    ]);
    res.status(200).json({
      success: true,
      message: 'get customization orders successfully',
      customizationOrder: order,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const sendServiceDetails = async (req, res, next) => {
  try {
    const { serviceId, engineerId, materials, details } = req.body;
    const service = await ServicesOrders.findById({ _id: serviceId });
    const engineer = await Employees.findById({ _id: engineerId });
    service.details = details;
    service.state = 'MANFACTURING';
    service.requiredMaterials = materials;
    service.save();
    if (service.date) {
      await AssignedDateTable.findOneAndDelete({
        engineer: engineerId,
        date: service.date,
      });
    }
    const materialOrder = await MaterialOrders.create({
      engineer: engineerId,
      service: serviceId,
      materials: materials,
    });
    res.status(200).json({
      success: true,
      message: 'send material orders and details successfully',
      materialOrder: materialOrder,
      service: service,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getCustomizedOrderById = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const customizedOrder = await ServicesOrders.findById(requestId).populate([
      {
        path: 'customer',
        select: 'username phone email address -password',
      },
      {
        path: 'assignedEngineer',
        select: '_id username email -password',
      },
    ]);
    if (!customizedOrder) {
      return res.status(404).json({ message: 'Customized order not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Customized order found successfully',
      customizationOrder: customizedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
