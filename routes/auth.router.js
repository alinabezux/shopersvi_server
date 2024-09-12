const authRouter = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');

authRouter.post('/logIn',
    authMiddleware.checkLogInBody,
    userMiddleware.getUserByEmail,
    authController.logIn);

authRouter.post('/refresh',
    authMiddleware.checkRefreshToken,
    authController.refresh);

authRouter.post('/logOut',
    authMiddleware.checkAccessToken,
    authController.logOut);

authRouter.post('/password/forgot',
    userMiddleware.getUserByEmail,
    authController.forgotPassword);

authRouter.put('/password/forgot',
    authMiddleware.checkActionToken,
    authController.setNewPassword);

module.exports = authRouter;