const { v4: uuid } = require('uuid');
const Category = require('../models/Category');
const { HttpError } = require('../middleware/error');

exports.list = async (_req, res, next) => {
  try {
    const list = await Category.find().sort({ name: 1 });
    res.json(list);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;
    const exists = await Category.findOne({ slug });
    if (exists) throw new HttpError(409, 'Slug already exists');
    
    const cat = new Category({
      id: uuid(),
      name,
      slug,
      description: description || '',
    });
    
    await cat.save();
    res.status(201).json(cat);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const cat = await Category.findOne({ id: req.params.id });
    if (!cat) throw new HttpError(404, 'Category not found');
    
    Object.assign(cat, req.body);
    await cat.save();
    res.json(cat);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await Category.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) throw new HttpError(404, 'Category not found');
    res.status(204).end();
  } catch (e) { next(e); }
};
