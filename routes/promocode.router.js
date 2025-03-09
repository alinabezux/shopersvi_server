const promocodeRouter = require('express').Router();
const promocodeController = require('../controllers/promocode.controller')
const authMiddleware = require('../middlewares/auth.middleware');

promocodeRouter.get('/',
    promocodeController.getAllPromocodes
);

promocodeRouter.post('/',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    promocodeController.createPromocode
);

promocodeRouter.delete('/:promocodeId',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    promocodeController.deletePromocode
);


module.exports = promocodeRouter;