const router = require('express').Router();
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/orders');

const createSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive(),
  })).min(1),
  shippingAddress: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(7),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(4),
  }),
  paymentMethod: z.enum(['cod', 'card', 'upi']),
});

const statusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
});

router.post('/', requireAuth, validate(createSchema), ctrl.create);
router.get('/me', requireAuth, ctrl.myOrders);
router.get('/', requireAuth, requireAdmin, ctrl.all);
router.patch('/:id/status', requireAuth, requireAdmin, validate(statusSchema), ctrl.updateStatus);

module.exports = router;
