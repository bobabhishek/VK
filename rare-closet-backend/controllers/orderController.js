import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendOrderAlert } from "../services/notifyService.js";

export const createOrder = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.user) payload.user = req.user._id;

    // Decrement stock for each order item
    if (Array.isArray(payload.orderItems)) {
      for (const item of payload.orderItems) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, { $inc: { countInStock: -item.qty } });
        }
      }
    }

    const order = await Order.create(payload);
    // Fire-and-forget admin notification
    try {
      const populatedUser = req.user || null;
      sendOrderAlert({ orderId: order._id, totalPrice: order.totalPrice, user: populatedUser });
    } catch (e) {
      // non-blocking
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
