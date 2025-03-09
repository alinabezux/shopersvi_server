const productRouter = require('express').Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const productMiddleware = require('../middlewares/product.middleware');

productRouter.get('/',
    productController.getAllProducts);

productRouter.get('/:productId',
    productController.getProductById);

productRouter.post('/',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    productMiddleware.checkIsArticleUnique,
    productController.createProduct);

productRouter.put('/:productId',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    productController.updateProduct);

productRouter.patch('/:productId/images',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    productController.uploadImage);

productRouter.patch('/:productId',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    productController.addDiscountProduct);

productRouter.delete('/:productId/images',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    productController.deleteImage);

productRouter.delete('/:productId',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    productController.deleteProduct);

module.exports = productRouter;