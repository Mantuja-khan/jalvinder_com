const router = require('express').Router();
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/reviews');

const reviewSchema = z.object({
  name: z.string().min(1).max(80),
  phone: z.string().regex(/^[+\d\s\-()]{7,20}$/).optional().or(z.literal('')),
  rating: z.number().int().min(1).max(5),
  response: z.string().min(1).max(2000),
});

router.get('/product/:productId', ctrl.listForProduct);
router.post('/product/:productId', validate(reviewSchema), ctrl.create);
router.delete('/:id', requireAuth, requireAdmin, ctrl.remove);

module.exports = router;
