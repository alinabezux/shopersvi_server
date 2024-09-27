const orderRouter = require('express').Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');

orderRouter.post('/:userId',
    authMiddleware.checkAccessToken,
    userMiddleware.checkIfUserExists,
    orderController.createOrderAuth);

orderRouter.post('/',
    orderController.createOrder);

orderRouter.get('/',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    orderController.getAllOrders);

orderRouter.get('/:userId',
    userMiddleware.checkIfUserExists,
    authMiddleware.checkAccessToken,
    authMiddleware.isRightUser,
    orderController.getUserOrders);

orderRouter.delete('/:orderId',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    orderController.deleteOrderById);

module.exports = orderRouter;