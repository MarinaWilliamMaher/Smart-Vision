import Products from '../models/ProductModel.js';
import IventoryTransactions from '../models/inventoryTransaction.js';

export const getShowProducts = async (req, res, next) => {
  try {
    const products = await Products.find({ show: true }).populate({
      path: 'reviews',
      populate: {
        path: 'customer',
        select: 'username email -password',
      },
    });
    res.status(200).json({
      success: true,
      message: 'get products successfully',
      products,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Products.find({}).populate({
      path: 'reviews',
      populate: {
        path: 'customer',
        select: 'username email -password',
      },
    });
    res.status(200).json({
      success: true,
      message: 'get all products successfully',
      products,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addToStore = async (req, res, next) => {
  try {
    const productData = req.body;
    // validation
    if (!productData.name || !productData.images) {
      next('Please Provide needed fields');
      return;
    }
    const product = await Products.findByIdAndUpdate(
      { _id: productData._id },
      { ...productData },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'add product successfully to store',
      product,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    // validation
    if (
      !productData.name ||
      !productData.ARName ||
      !productData.quantity ||
      !productData.description ||
      !productData.category
    ) {
      next('Please Provide needed fields');
      return;
    }
    const product = await Products.create({ ...productData });
    res.status(200).json({
      success: true,
      message: 'add product successfully',
      product,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Products.findOne({ _id: id }).populate({
      path: 'reviews',
      populate: {
        path: 'customer',
        select: 'username email -password',
      },
    });
    res.status(200).json({
      success: true,
      message: 'get products successfully',
      product,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'not found',
    });
  }
};

// this funcation will help us to khow if the product exist or not
//to help us in funcation makeOrder in customerControllers
export const existProduct = async (id) => {
  try {
    const product = await Products.findOne({ _id: id });
    return true;
  } catch (error) {
    return false;
  }
};
// this funcation will help us to decrese quantity
//to help us in funcation makeOrder in customerControllers
export const decreseQuantity = async (id, quantity) => {
  try {
    const product = await Products.findById({ _id: id });
    product.quantity -= quantity;
    const updatedpProduct = await Products.findByIdAndUpdate(
      { _id: id },
      product,
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};
// this funcation will help us to decrese quantity
//to help us in funcation cancelOrder in customerControllers
export const increaseQuantity = async (id, quantity) => {
  try {
    const product = await Products.findById({ _id: id });
    product.quantity += quantity;
    const updatedpProduct = await Products.findByIdAndUpdate(
      { _id: id },
      product,
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};

export const decreseQuantityUsingProductName = async (name, quantity) => {
  try {
    const product = await Products.findOne({ name: name });
    product.quantity -= quantity;
    const updatedpProduct = await Products.findByIdAndUpdate(
      { _id: product._id },
      product,
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};

export const increaseQuantityUsingProductName = async (name, quantity) => {
  try {
    const product = await Products.findOne({ name: name });
    product.quantity += quantity;
    const updatedpProduct = await Products.findByIdAndUpdate(
      { _id: product._id },
      product,
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, quantity, category, price, points } = req.body;
    const productData = req.body;
    console.log(name, description, quantity, category, price, points);
    if (!name || !description || !category || !price || !points) {
      next('Please Provide needed fields');
      return;
    }
    const product = await Products.findByIdAndUpdate(
      { _id: id },
      { ...productData },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'get products successfully',
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'failed to update',
    });
  }
};

// this funcation will help us to calculate total Rating
//to help us in funcation deleteReview in customerControllers
export const calculateTotalRating = async (productReviews) => {
  let total = 0;
  if (productReviews.length < 1) {
    return 0;
  } else {
    productReviews.map((review) => {
      total = total + review.rating;
    });
    return total / productReviews.length;
  }
};

export const getNotShownProducts = async (req, res, next) => {
  try {
    const products = await Products.find({ show: false });
    res.status(200).json({
      success: true,
      message: 'get products successfully',
      products,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// this funcation will help us to Update Product Details when product in inverntory
export const updateProductDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      ARName,
      description,
      ARDescription,
      quantity,
      category,
      colors,
    } = req.body;
    if (
      !name ||
      !ARName ||
      !quantity ||
      !description ||
      !ARDescription ||
      !category ||
      !colors.length
    ) {
      next('Please Provide needed fields');
      return;
    }
    const product = await Products.findByIdAndUpdate(
      { _id: id },
      { name, ARName, description, ARDescription, quantity, category, colors },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'update product details successfully',
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'failed to update',
    });
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await Products.findByIdAndDelete({ _id: productId });
    res.status(200).json({
      success: true,
      message: 'deleted successfully',
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'failed to delete product',
    });
  }
};

// this funcation help us in inventory to record Product Transactions
export const productsTransaction = async (req, res, next) => {
  try {
    let flag = true;
    const { managerId, products, method } = req.body;
    console.log(products);
    if (!managerId || !products.length || !method) {
      next('Provide Required Fields!');
      return;
    }
    // to make sure that products in cart elready exist
    await Promise.all(
      products.map(async (prod) => {
        const exist = await existProduct(prod._id);
        if (!exist) {
          flag = false;
        }
      })
    );
    if (flag) {
      if (method === 'Export') {
        products.map(async (prod) => {
          await decreseQuantityUsingProductName(
            prod.productName,
            prod.quantity
          );
        });
      } else if (method === 'Import') {
        products.map(async (prod) => {
          await increaseQuantityUsingProductName(
            prod.productName,
            prod.quantity
          );
        });
      }

      //make transaction
      const transaction = await IventoryTransactions.create({
        category: 'Products',
        inventoryManager: managerId,
        transaction: method,
        products: products,
      });
      res.status(200).json({
        success: true,
        message: 'the Transaction has been made successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'product is not found',
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

export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    // Query the database for products based on the category
    const products = await Products.find({ category: category, show: 'true' });

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      products: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
    });
  }
};
