const router = require('express').Router();
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/products');

const productSchema = z.object({
  name: z.string().min(1).max(200),
  categoryId: z.string().min(1),
  brand: z.string().max(100).optional(),
  price: z.number().nonnegative(),
  oldPrice: z.number().nonnegative().optional(),
  image: z.string().url().or(z.string().min(1)),
  images: z.array(z.string()).optional(),
  badge: z.string().max(50).optional(),
  rating: z.number().min(0).max(5).optional(),
  category: z.string().min(1),
  subcategory: z.string().max(100).optional(),
  description: z.string().max(5000).optional(),
  highlights: z.array(z.string()).optional(),
  warranty: z.string().max(200).optional(),
  seller: z.string().max(120).optional(),
  deliveryDays: z.number().nonnegative().optional(),
  specs: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  features: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  inStock: z.boolean().optional(),
  offers: z.array(z.string()).optional(),
});

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', requireAuth, requireAdmin, validate(productSchema), ctrl.create);
router.put('/:id', requireAuth, requireAdmin, validate(productSchema.partial()), ctrl.update);
router.delete('/:id', requireAuth, requireAdmin, ctrl.remove);

module.exports = router;
