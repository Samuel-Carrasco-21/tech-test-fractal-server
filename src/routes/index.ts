import { Router } from 'express';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';

const router = Router();

router.get('/', (_req, res) => res.send({ message: 'API is up!' }));
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

export default router;
