const favouriteRouter = require('express').Router();
const favouriteController = require('../controllers/favourite.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');

favouriteRouter.get('/:userId',
    userMiddleware.checkIfUserExists,
    authMiddleware.checkAccessToken,
    authMiddleware.isRightUser,
    favouriteController.getUsersFavourite);

favouriteRouter.post('/:userId/:productId',
    userMiddleware.checkIfUserExists,
    authMiddleware.checkAccessToken,
    authMiddleware.isRightUser,
    favouriteController.addToFavourite);

favouriteRouter.delete('/:userId/:productId',
    userMiddleware.checkIfUserExists,
    authMiddleware.checkAccessToken,
    authMiddleware.isRightUser,
    favouriteController.deleteFromFavourite);

module.exports = favouriteRouter;
