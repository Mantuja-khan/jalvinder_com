const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const { HttpError } = require('./error');

async function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new HttpError(401, 'Missing auth token'));
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findOne({ id: payload.sub });
    if (!user) return next(new HttpError(401, 'User no longer exists'));
    req.user = { id: user.id, email: user.email, name: user.name, role: user.role };
    next();
  } catch (error) {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}

function requireAdmin(req, _res, next) {
  if (!req.user) return next(new HttpError(401, 'Not authenticated'));
  if (req.user.role !== 'admin') return next(new HttpError(403, 'Admin only'));
  next();
}

module.exports = { requireAuth, requireAdmin };
