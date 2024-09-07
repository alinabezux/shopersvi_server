const router = require('express').Router();
const productRouter = require('./product.router');
const categoryRouter = require('./category.router');
const typeRouter = require('./type.router');
const userRouter = require('./user.router');
const authRouter = require('./auth.router');
const basketRouter = require('./basket.router');
const favouriteRouter = require('./favourite.router');
const orderRouter = require('./order.router');

router.use('/products', productRouter)
router.use('/categories', categoryRouter);
router.use('/types', typeRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/favorite', favouriteRouter);
router.use('/basket', basketRouter);
router.use('/order', orderRouter);

module.exports = router;

