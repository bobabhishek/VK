import Product from "../models/Product.js";

// Get all products with search/filter/pagination
export const getProducts = async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: "i" } } : {};
  const minPrice = req.query.minPrice ? { $gte: Number(req.query.minPrice) } : undefined;
  const maxPrice = req.query.maxPrice ? { $lte: Number(req.query.maxPrice) } : undefined;
  const priceFilter = minPrice || maxPrice ? { price: { ...(minPrice || {}), ...(maxPrice || {}) } } : {};

  const where = { ...keyword, ...priceFilter };
  const count = await Product.countDocuments(where);
  const products = await Product.find(where)
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize), count });
};

// Add product
export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
