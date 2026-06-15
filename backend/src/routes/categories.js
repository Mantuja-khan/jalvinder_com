const router = require('express').Router();
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/categories');

const schema = z.object({
  name: z.string().min(1).max(80),
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  subcategories: z.array(z.object({
    id: z.string(),
    name: z.string()
  })).optional(),
});

router.get('/', ctrl.list);
router.post('/', requireAuth, requireAdmin, validate(schema), ctrl.create);
router.put('/', requireAuth, requireAdmin, validate(schema.partial()), ctrl.update);
router.put('/:id', requireAuth, requireAdmin, validate(schema.partial()), ctrl.update);
router.delete('/:id', requireAuth, requireAdmin, ctrl.remove);

module.exports = router;
