const { v4: uuid } = require('uuid');
const Product = require('../models/Product');
const { HttpError } = require('../middleware/error');

exports.list = async (req, res, next) => {
  try {
    const { categoryId, q } = req.query;
    const filter = {};
    if (categoryId) {
      filter.categoryId = categoryId;
    }
    if (q) {
      filter.name = { $regex: String(q), $options: 'i' };
    }
    const items = await Product.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Product.findOne({ id: req.params.id });
    if (!item) throw new HttpError(404, 'Product not found');
    res.json(item);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const product = new Product({
      id: uuid(),
      ...req.body,
      description: req.body.description || '',
      warranty: req.body.warranty || '',
      seller: req.body.seller || 'Jalvindar Computer',
      deliveryDays: req.body.deliveryDays || 3,
      highlights: req.body.highlights || [],
      features: req.body.features || [],
    });
    await product.save();
    res.status(201).json(product);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Product.findOne({ id: req.params.id });
    if (!item) throw new HttpError(404, 'Product not found');
    
    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await Product.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) throw new HttpError(404, 'Product not found');
    res.status(204).end();
  } catch (e) { next(e); }
};
