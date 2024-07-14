import ContactUs from '../models/ContactUs.js';
import Customers from '../models/CustomerModel.js';
import Verifications from '../models/EmailVerification.js';
import Orders from '../models/OrderModel.js';
import Products from '../models/ProductModel.js';
import { compareString, hashString } from '../utils/index.js';
import {
  calculateTotalRating,
  decreseQuantity,
  existProduct,
  increaseQuantity,
} from './productControlles.js';
import Reviews from '../models/Review.js';
import ServicesOrders from '../models/ServiceOrder.js';
import { resetPasswordLink } from '../utils/sendEmail.js';
import PasswordReset from '../models/PasswordReset.js';

export const verifyEmail = async (req, res, next) => {
  const { customerId, token } = req.params;
  try {
    const result = await Verifications.findOne({ customerId });
    if (result) {
      const { expiresAt, token: hashedToken } = result;
      // token has expires
      if (expiresAt < Date.now()) {
        Verifications.findOneAndDelete({ customerId })
          .then(() => {
            Customers.findOneAndDelete({ _id: customerId })
              .then(() => {
                const message = 'Verification token has expired';
                res.redirect(
                  `/customers/verified?status=error&message=${message}`
                );
              })
              .catch((err) => {
                res.redirect(`/customers/verified?status=error&message=`);
              });
          })
          .catch((error) => {
            console.log(error);
            res.redirect(`/customers/verified?message=`);
          });
      } else {
        // token Valid
        compareString(token, hashedToken)
          .then((isMatch) => {
            if (isMatch) {
              Customers.findOneAndUpdate(
                { _id: customerId },
                { verified: true }
              )
                .then(() => {
                  Verifications.findOneAndDelete({ customerId }).then(() => {
                    const message = 'Email verified successfully';
                    res.redirect(
                      `/customers/verified?status=success&message=${message}`
                    );
                  });
                })
                .catch((err) => {
                  console.log(err);
                  const message = 'verification faild or link is invalid(1)';
                  res.redirect(
                    `/customers/verified?status=error&message=${message}`
                  );
                });
            } else {
              // invalid token
              const message = 'verification faild or link is invalid(2)';
              res.redirect(
                `/customers/verified?status=error&message=${message}`
              );
            }
          })
          .catch((err) => {
            console.log(err);
            res.redirect(`/customers/verified?message=(3)`);
          });
      }
    } else {
      const message = 'Invalid verification link. Try again later.(4)';
      res.redirect(`/customers/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(error);
    res.redirect(`/customers/verified?message=(5)`);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const { customerId, username, gender, address } = req.body;
    if (!customerId || !username || !gender) {
      next('Provide Required Fields!');
      return;
    }
    const customer = await Customers.findByIdAndUpdate(
      { _id: customerId },
      { username: username, gender: gender, address: address },
      {
        new: true,
      }
    ).select('-password');
    res.status(200).json({
      success: true,
      message: 'update customer data successfully',
      customer,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'failed to update',
    });
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const customer = await Customers.findOne({ email });
    if (!customer) {
      return res.status(404).json({
        status: 'failed',
        message: 'Email address not found.',
      });
    }
    const existingRequest = await PasswordReset.findOne({ email });
    if (existingRequest) {
      //valid
      if (existingRequest.expiresAt > Date.now()) {
        return res.status(404).json({
          status: 'PENDING',
          message: 'Reset password link has already been sent to your email.',
        });
      }
      // axpiresAt < Date.now() ----> invalid
      await PasswordReset.findOneAndDelete({ email });
    }
    await resetPasswordLink(customer, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const resetPassword = async (req, res, next) => {
  console.log(req.params);
  const { customerId, token } = req.params;
  console.log(customerId, token);
  try {
    const customer = Customers.findById({ _id: customerId });
    if (!customer) {
      const message = 'Invalid password reset link. Try again';
      res.redirect(`/customers/resetPassword?status=error&message=${message}`);
    }
    const resetPassword = await PasswordReset.findOne({ customerId });
    console.log(resetPassword);
    console.log(!resetPassword);
    if (!resetPassword) {
      const message = 'Invalid password reset link. Try again';
      res.redirect(`/customers/resetPassword?status=error&message=${message}`);
      return;
    }
    const { expiresAt, token: resetToken } = resetPassword;
    if (expiresAt < Date.now()) {
      const message = 'Reset Password link has expired. Please try again';
      res.redirect(`/customers/resetPassword?status=error&message=${message}`);
    } else {
      const isMatch = await compareString(token, resetToken);
      if (!isMatch) {
        const message = 'Invalid password reset link. Try again';
        res.redirect(
          `/customers/resetPassword?status=error&message=${message}`
        );
      } else {
        const message = 'Change Your Password';
        res.redirect(
          `/customers/resetPassword?status=success&type=reset&id=${customerId}&message=${message}`
        );
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { customerId, password } = req.body;
    console.log(customerId, password);
    const hashedPassword = await hashString(password);
    const customer = await Customers.findByIdAndUpdate(
      { _id: customerId },
      { password: hashedPassword }
    );
    if (customer) {
      await PasswordReset.findOneAndDelete({ customerId });
      const message = 'Password successfully reset.';
      res.redirect(
        200,
        `/customers/resetpassword?status=success&id=${customerId}&message=${message}`
      );
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const saveContactMesseage = async (req, res, next) => {
  try {
    const data = req.body;
    const contact = await ContactUs.create({ ...data });
    res.status(200).json({
      success: true,
      message: 'send successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'failed to send feedback',
    });
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const wantedCustomer = await Customers.findById({ _id: id });
    if (wantedCustomer) {
      const isMatch = await compareString(password, wantedCustomer?.password);
      if (!isMatch) {
        next('Invalid password');
        return;
      }
      await Customers.findByIdAndDelete({ _id: id });
      res.status(200).json({
        success: true,
        message: 'deleted successfully',
        wantedCustomer,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'customer is not found',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'failed to delete',
    });
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { id, oldPassword, newPassword } = req.body;
    if (!id || !oldPassword || !newPassword) {
      next('Provide Required Fields!');
      return;
    }
    const wantedCustomer = await Customers.findById({ _id: id });
    console.log(wantedCustomer);
    const isMatch = await compareString(oldPassword, wantedCustomer?.password);
    if (!isMatch) {
      next('Invalid old password');
      return;
    }
    const hashedNewPassword = await hashString(newPassword);
    await Customers.findByIdAndUpdate(
      { _id: id },
      {
        password: hashedNewPassword,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'updated password successfully',
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'failed to change password',
    });
  }
};

export const makeFavorite = async (req, res, next) => {
  try {
    const { id, productId } = req.body;
    const customer = await Customers.findById({ _id: id });
    const product = await Products.findById({ _id: productId });
    const index = product.likes.findIndex((pid) => pid === String(id));
    if (index === -1) {
      product.likes.push(customer._id);
      customer.favoriteList.push(product._id);
    } else {
      //unfavorite
      customer.favoriteList = customer.favoriteList.filter(
        (pid) => String(pid._id) !== String(product._id)
      );
      product.likes = product.likes.filter(
        (pid) => pid !== String(customer._id)
      );
    }
    const newProductData = await Products.findByIdAndUpdate(
      { _id: productId },
      product,
      {
        new: true,
      }
    );
    const newCustomerData = await Customers.findByIdAndUpdate(
      { _id: id },
      customer,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: 'successfully',
      newCustomerData,
      newProductData,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'failed to make it favorite',
    });
  }
};

export const getFavoriteList = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Customers.findById({ _id: id })
      .populate('favoriteList')
      .then((customer) => {
        const favorite = customer.favoriteList;
        res.status(200).json({
          success: true,
          message: 'get favorite successfully',
          favorites: favorite,
        });
      })
      .catch(() => {
        res.status(404).json({
          success: false,
          message: 'customer is not found',
        });
      });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'failed to get your favorite',
    });
  }
};

export const makeOrder = async (req, res, next) => {
  try {
    let flag = true;
    const { id, cart, totalPrice, totalPoints, customerData } = req.body;
    if (!id || !cart.length || !totalPrice || !customerData) {
      next('Provide Required Fields!');
      return;
    }
    const customer = await Customers.findById({ _id: id });
    // to make sure that products in cart elready exist
    await Promise.all(
      cart.map(async (prod) => {
        const exist = await existProduct(prod.product);
        if (!exist) {
          flag = false;
        }
      })
    );
    if (flag) {
      cart.map(async (prod) => {
        await decreseQuantity(prod.product, prod.quantity);
      });
      //make order
      const order = await Orders.create({
        customerData: customerData,
        customer: id,
        products: cart,
        totalPrice,
        totalPoints,
        cancelOrderExpiresAt: new Date(
          new Date().setDate(new Date().getDate() + 3)
        ),
      });
      const populateOrder = await Orders.findById({ _id: order._id }).populate({
        path: 'products',
        populate: {
          path: 'product',
        },
      });
      //save order to customer history and update his point
      customer.orderHistory.push(order._id);
      //customer will get points after his receive this order
      //customer.points += totalPoints;
      const updatedCustomer = await Customers.findByIdAndUpdate(
        { _id: id },
        customer,
        { new: true }
      ).select('-password');
      res.status(200).json({
        success: true,
        message: 'the order has been made successfully',
        customer: updatedCustomer,
        order: populateOrder,
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
      message: 'failed to place this order',
    });
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id, orderId } = req.body;
    console.log(id, orderId);
    if (!id || !orderId) {
      next('Provide Required Fields!');
      return;
    }
    const order = await Orders.findById({ _id: orderId });
    if (order.state !== 'CANCELED') {
      if (order.cancelOrderExpiresAt > new Date()) {
        const updatedOrder = await Orders.findByIdAndUpdate(
          { _id: orderId },
          {
            state: 'CANCELED',
          },
          { new: true }
        );
        await Promise.all(
          order.products.map(async (prod) => {
            await increaseQuantity(prod.product.toString(), prod.quantity);
          })
        );
        res.status(200).json({
          success: true,
          message: 'the order has been canceled successfully',
          order: updatedOrder,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'you cannot cancel order after 3 day',
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: 'you cannot cancel order twice',
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'failed to cancel this order',
    });
  }
};

export const getOrderHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customers.findById({ _id: id })
      .populate({
        path: 'orderHistory',
        populate: {
          path: 'products',
          populate: {
            path: 'product',
            populate: {
              path: 'reviews',
            },
            select: 'name ARName images description ARDescription price category reviews',
          },
        },
      })
      .exec();
    customer.orderHistory = customer.orderHistory.map((orders) =>
      orders.products.map((items) => {
        console.log(
          items.product.reviews.filter(
            (review) => String(review.customer) !== id
          )
        );
        items.product.reviews = items.product.reviews.filter(
          (review) => String(review.customer) === id
        );
      })
    );

    res.status(200).json({
      success: true,
      message: 'get order history successfully',
      history: customer.orderHistory,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'failed to get your order history',
    });
  }
};

export const addreview = async (req, res, next) => {
  try {
    const { customerId, productId, comment, rating } = req.body;
    // Check if rating is within the allowed range
    if (rating < 1 || rating > 5) {
      next('Rating should be between 1 and 5');
      return;
    }
    if (!comment) {
      next('Comment should not be empty');
      return;
    }
    // Find the customer and product documents
    const customer = await Customers.findById(customerId);
    const product = await Products.findById(productId);
    // Create a new review
    const review = await Reviews.create({
      customer: customer._id,
      product: product._id,
      comment,
      rating,
    });
    review.populate({ path: 'customer', select: 'username email -password' });
    // Push review in product reviews array
    product.reviews.push(review._id);
    // get product details
    const reviews = (await product.populate('reviews')).reviews;
    product.totalRating = await calculateTotalRating(reviews);
    const newProductData = await Products.findByIdAndUpdate(
      { _id: productId },
      product,
      {
        new: true,
      }
    );
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      totalRating: newProductData.totalRating,
      review: review,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'failed to add review',
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
    res.status(404).json({
      success: false,
      message: 'failed to delete review',
    });
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { reviewId, productId, comment, rating } = req.body;
    // Check if rating is within the allowed range
    if (rating < 1 || rating > 5) {
      next('Rating should be between 1 and 5');
      return;
    }
    if (!comment) {
      next('Comment should not be empty');
      return;
    }
    // Find the review for the specific customer and product
    const oldReview = await Reviews.findById({ _id: reviewId });
    const newReview = await Reviews.findByIdAndUpdate(
      { _id: reviewId },
      { comment: comment, rating: rating },
      {
        new: true,
      }
    );
    const product = await Products.findById(productId);
    const productReviews = (await product.populate('reviews')).reviews;
    product.totalRating = await calculateTotalRating(productReviews);
    const newProductData = await Products.findByIdAndUpdate(
      { _id: productId },
      product,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      totalRating: newProductData.totalRating,
      oldReview: oldReview,
      newReview: newReview,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'failed to update review',
    });
  }
};

export const makeService = async (req, res, next) => {
  try {
    const serviceData = req.body;
    if (
      !serviceData.id ||
      !serviceData.service ||
      !serviceData.description ||
      !serviceData.address ||
      !serviceData.phone
    ) {
      next('Provide Required Fields!');
      return;
    }
    console.log(serviceData);
    const customer = await Customers.findById({ _id: serviceData.id });
    //make service order
    const serviceOrder = await ServicesOrders.create({
      ...serviceData,
      customer: serviceData.id,
      cancelServiceOrderExpiresAt: new Date(
        new Date().setDate(new Date().getDate() + 3)
      ),
    });

    const populatedServiceOrder = await ServicesOrders.findById({
      _id: serviceOrder._id,
    }).populate({
      path: 'customer',
      select: '_id username email gender phone verified address -password',
    });
    //save service order to customer history
    customer.serviceHistory.push(serviceOrder._id);
    const updatedCustomer = await Customers.findByIdAndUpdate(
      { _id: serviceData.id },
      customer,
      { new: true }
    ).select('-password');
    res.status(200).json({
      success: true,
      message: 'the order has been made successfully',
      customer: updatedCustomer,
      serviceOrder: populatedServiceOrder,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'failed to place this service',
    });
  }
};

export const cancelService = async (req, res, next) => {
  try {
    const { id, serviceId } = req.body;
    if (!id || !serviceId) {
      next('Provide Required Fields!');
      return;
    }
    const service = await ServicesOrders.findById({ _id: serviceId });
    if (service.state !== 'CANCELED') {
      if (service.cancelServiceOrderExpiresAt > new Date()) {
        const updatedServiceOrder = await ServicesOrders.findByIdAndUpdate(
          { _id: serviceId },
          {
            state: 'CANCELED',
          },
          { new: true }
        );
        res.status(200).json({
          success: true,
          message: 'the order has been canceled successfully',
          serviceOrder: updatedServiceOrder,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'you cannot cancel service order after 3 day',
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: 'you cannot cancel order twice',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'failed to cancel this service order',
    });
  }
};

export const getServiceHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customers.findById({ _id: id })
      .populate({
        path: 'serviceHistory',
      })
      .exec();

    res.status(200).json({
      success: true,
      message: 'get order history successfully',
      history: customer.serviceHistory,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'failed to get your service history',
    });
  }
};
