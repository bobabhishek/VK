import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get current user's cart
export const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(cart || { user: req.user._id, items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add or update item in cart
export const addItemToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    if (!productId || !qty || qty < 1) return res.status(400).json({ message: "Invalid payload" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const idx = cart.items.findIndex((i) => String(i.product) === String(productId));
    if (idx >= 0) {
      cart.items[idx].qty = qty;
      cart.items[idx].price = product.price;
      cart.items[idx].name = product.name;
      cart.items[idx].image = product.image;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
export const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => String(i.product) !== String(productId));
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


