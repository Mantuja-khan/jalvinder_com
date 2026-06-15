const { v4: uuid } = require('uuid');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { HttpError } = require('../middleware/error');

exports.create = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    let total = 0;
    
    const lineItems = await Promise.all(items.map(async (it) => {
      const product = await Product.findOne({ id: it.productId });
      if (!product) throw new HttpError(400, `Product not found: ${it.productId}`);
      const subtotal = product.price * it.quantity;
      total += subtotal;
      return { 
        productId: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: it.quantity, 
        subtotal 
      };
    }));

    const order = new Order({
      id: uuid(),
      userId: req.user.id,
      items: lineItems,
      total,
      shippingAddress,
      paymentMethod,
      status: 'pending',
    });

    await order.save();
    res.status(201).json(order);
  } catch (e) { next(e); }
};

exports.myOrders = async (req, res, next) => {
  try {
    const list = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
};

exports.all = async (_req, res, next) => {
  try {
    const list = await Order.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) throw new HttpError(404, 'Order not found');
    
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (e) { next(e); }
};
