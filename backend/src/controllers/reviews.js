const { v4: uuid } = require('uuid');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { HttpError } = require('../middleware/error');

exports.listForProduct = async (req, res, next) => {
  try {
    const items = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const product = await Product.findOne({ id: req.params.productId });
    if (!product) throw new HttpError(404, 'Product not found');
    
    const review = new Review({
      id: uuid(),
      productId: req.params.productId,
      name: req.body.name,
      phone: req.body.phone || '',
      rating: req.body.rating,
      response: req.body.response,
    });
    
    await review.save();
    res.status(201).json(review);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await Review.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) throw new HttpError(404, 'Review not found');
    res.status(204).end();
  } catch (e) { next(e); }
};
