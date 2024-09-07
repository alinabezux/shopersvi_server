const basketRouter = require('express').Router();
const basketController = require('../controllers/basket.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');

basketRouter.get('/:userId',
    userMiddleware.checkIfUserExists,
    authMiddleware.checkAccessToken,
    authMiddleware.isRightUser,
    basketController.getUsersBasket);

basketRouter.post('/:userId/:productId',
    userMiddleware.checkIfUserExists,
    authMiddleware.checkAccessToken,
    authMiddleware.isRightUser,
    basketController.addToBasket);

basketRouter.patch('/:userId/:productId',
    userMiddleware.checkIfUserExists,
    authMiddleware.checkAccessToken,
    authMiddleware.isRightUser,
    basketController.changeProductQuantity);

basketRouter.delete('/:userId/:productId',
    userMiddleware.checkIfUserExists,
    authMiddleware.checkAccessToken,
    authMiddleware.isRightUser,
    basketController.deleteFromBasket);

module.exports = basketRouter;