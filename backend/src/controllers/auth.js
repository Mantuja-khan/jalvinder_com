const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { HttpError } = require('../middleware/error');

const sanitize = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) throw new HttpError(409, 'Email already in use');
    
    const user = new User({
      id: uuid(),
      name,
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 10),
      role: 'user',
    });
    
    await user.save();
    res.status(201).json({ user: sanitize(user), token: signToken(user) });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new HttpError(401, 'Invalid credentials');
    
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new HttpError(401, 'Invalid credentials');
    
    res.json({ user: sanitize(user), token: signToken(user) });
  } catch (e) { next(e); }
};

exports.me = (req, res) => res.json({ user: req.user });
