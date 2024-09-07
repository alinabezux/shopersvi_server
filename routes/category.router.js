const categoryRouter = require('express').Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const categoryMiddleware = require('../middlewares/category.middleware');

categoryRouter.get('/',
    categoryController.getAllCategories);

categoryRouter.get('/:categoryId',
    categoryController.getCategoryById);

categoryRouter.post('/',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    categoryMiddleware.checkIsCategoryUnique,
    categoryController.createCategory);

categoryRouter.put('/:categoryId',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    categoryMiddleware.checkIsCategoryUnique,
    categoryController.updateCategory);

categoryRouter.patch('/:categoryId',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    categoryController.uploadImage);

categoryRouter.delete('/:categoryId',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    categoryController.deleteCategory);


module.exports = categoryRouter;