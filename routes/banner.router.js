const bannerRouter = require('express').Router();
const bannerController = require('../controllers/banner.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public: get current banner URLs for the homepage
bannerRouter.get('/', bannerController.getBanner);

// Admin only: upload desktop banner
bannerRouter.patch(
    '/desktop',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    bannerController.uploadDesktopBanner
);

// Admin only: upload mobile banner
bannerRouter.patch(
    '/mobile',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    bannerController.uploadMobileBanner
);

// Admin only: delete a banner (?type=desktop|mobile)
bannerRouter.delete(
    '/',
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole,
    bannerController.deleteBanner
);

module.exports = bannerRouter;
