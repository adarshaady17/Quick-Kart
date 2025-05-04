import Order from "../models/Order.js";
//import User from '../models/User.js'
import Product from "../models/product.js";
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.user.id; // Get userId from authenticated user

    if (!userId) {
      return res.json({
        success: false,
        message: "User authentication required",
      });
    }

    if (!address || items.length === 0) {
      return res.json({
        success: false,
        message: "Address and items are required",
      });
    }

    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId, // Now using the authenticated user's ID
      items,
      address,
      amount,
      paymentType: "COD",
    });

    res.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Error in placing order",
      error: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate({
        path: "items.product",
        select: "name image category offerPrice",
      })
      .populate("address")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Error in placing order",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Error in placing order",
      error: error.message,
    });
  }
};
