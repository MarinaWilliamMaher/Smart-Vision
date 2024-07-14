import Employees from '../models/Employee.js';
import Materials from '../models/Material.js';
import IventoryTransactions from '../models/inventoryTransaction.js';
export const addMaterial = async (req, res, next) => {
  try {
    const { name, ARName, quantity } = req.body;
    const newMaterial = await Materials.create({
      name,
      ARName,
      quantity,
    });

    res.status(201).json({
      success: true,
      message: 'Material added successfully',
      material: newMaterial,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to add material',
    });
  }
};

export const getMaterials = async (req, res, next) => {
  try {
    const materials = await Materials.find();
    if (materials.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No materials found' });
    }

    res.status(200).json({ success: true, materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMaterial = async (req, res, next) => {
  try {
    const { id } = req.body;

    // Find the material by ID and delete it
    const deletedMaterial = await Materials.findByIdAndDelete(id);

    if (!deletedMaterial) {
      return res
        .status(404)
        .json({ success: false, message: 'Material not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Material deleted successfully',
      material: deletedMaterial,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getMaterialById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const material = await Materials.findById(id);

    if (!material) {
      return res
        .status(404)
        .json({ success: false, message: 'Material not found' });
    }

    res.status(200).json({ success: true, material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMaterial = async (req, res, next) => {
  try {
    const { id } = req.body;
    const { name, ARName, quantity } = req.body;

    // Find the material by ID and update its fields
    const updatedMaterial = await Materials.findByIdAndUpdate(
      id,
      { name, ARName, quantity },
      { new: true }
    );
    if (!updatedMaterial) {
      return res
        .status(404)
        .json({ success: false, message: 'Material not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Material updated successfully',
      material: updatedMaterial,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const existMaterials = async (id) => {
  try {
    const material = await Materials.findOne({ _id: id });
    return true;
  } catch (error) {
    return false;
  }
};

export const checkMaterialQuantity = async (name, quantity, next) => {
  try {
    // Find the material by ID
    const material = await Materials.findOne({ name: name });
    // Check if the requested quantity to decrease is negative or exceeds the current quantity
    if (quantity <= 0 || quantity > material.quantity) {
      next(`Sorry, not enough quantity available in ${name} to decrease`);
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};
export const decreaseMaterialQuantity = async (name, quantity, next) => {
  try {
    // Find the material by ID
    const material = await Materials.findOne({ name: name });
    // Decrease the quantity by the specified amount
    material.quantity -= quantity;
    await material.save();
    return true;
  } catch (error) {
    console.log(error);
  }
};

export const increaseMaterialQuantity = async (name, quantity, next) => {
  try {
    // Find the material by ID
    const material = await Materials.findOne({ name: name });
    // Increase the quantity by the specified amount
    material.quantity += quantity;
    await material.save();
    /* res.status(200).json({
        success: true,
        message: 'Material quantity decreased successfully',
        material,
      }); */
  } catch (error) {
    console.log(error);
  }
};

export const materialsTransaction = async (req, res, next) => {
  try {
    let flag = true;
    const { managerId, materials, method } = req.body;
    console.log(materials)
    if (!managerId || !materials.length || !method) {
      next('Provide Required Fields!');
      return;
    }
    // to make sure that products in cart elready exist
    await Promise.all(
      materials.map(async (material) => {
        const exist = await existMaterials(material._id);
        if (!exist) {
          flag = false;
        }
      })
    );
    let success = true;
    if (flag) {
      if (method === 'Export') {
        await Promise.all(
          materials.map(async (material) => {
            success = await checkMaterialQuantity(
              material.materialName,
              material.quantity,
              next
            );
          })
        );
        if (success === true) {
          materials.map(async (material) => {
            await decreaseMaterialQuantity(
              material.materialName,
              material.quantity
            );
          });
        }
      } else if (method === 'Import') {
        materials.map(async (material) => {
          await increaseMaterialQuantity(
            material.materialName,
            material.quantity
          );
        });
      }

      //make transaction

      if (success) {
        const transaction = await IventoryTransactions.create({
          category: 'Materials',
          inventoryManager: managerId,
          transaction: method,
          materials: materials,
        });
        res.status(200).json({
          success: true,
          message: 'the Transaction has been made successfully',
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: 'material is not found',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'failed to place this transaction',
    });
  }
};
