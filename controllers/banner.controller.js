const S3service = require('../services/S3.service');
const SiteSettings = require('../db/models/SiteSettings');
const path = require('path');
const uuid = require('uuid');
const { S3_BUCKET_NAME } = require('../configs/configs');
const S3 = require('aws-sdk/clients/s3');
const { S3_BUCKET_REGION, S3_ACCESS_KEY, S3_SECRET_KEY } = require('../configs/configs');

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_DESKTOP_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_MOBILE_SIZE = 3 * 1024 * 1024;  // 3 MB

const s3Bucket = new S3({
    region: S3_BUCKET_REGION,
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
});

async function deleteByKey(key) {
    if (!key) return;
    try {
        await s3Bucket.deleteObject({ Bucket: S3_BUCKET_NAME, Key: key }).promise();
    } catch (err) {
        console.error('Banner S3 delete error:', err);
    }
}

module.exports = {
    getBanner: async (req, res, next) => {
        try {
            const settings = await SiteSettings.findOne({});
            return res.json({
                desktopBannerUrl: settings ? settings.desktopBannerUrl : null,
                mobileBannerUrl:  settings ? settings.mobileBannerUrl  : null,
            });
        } catch (e) {
            next(e);
        }
    },

    uploadDesktopBanner: async (req, res, next) => {
        try {
            if (!req.files || !req.files.image) {
                return res.status(400).json({ message: 'Файл не знайдено. Передайте поле image.' });
            }
            const file = req.files.image;

            if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
                return res.status(400).json({ message: 'Непідтримуваний формат. Дозволено: JPEG, PNG, WebP.' });
            }
            const ext = path.extname(file.name).toLowerCase();
            if (!ALLOWED_EXTENSIONS.includes(ext)) {
                return res.status(400).json({ message: 'Непідтримуване розширення файлу.' });
            }
            if (file.size > MAX_DESKTOP_SIZE) {
                return res.status(400).json({ message: 'Файл занадто великий. Максимум 5 MB для Desktop.' });
            }

            const key = `banner/desktop/${uuid.v4()}${ext}`;

            const uploaded = await s3Bucket.upload({
                ContentType: file.mimetype,
                ACL: 'public-read',
                Body: file.data,
                Bucket: S3_BUCKET_NAME,
                Key: key,
            }).promise();

            const current = await SiteSettings.findOne({});
            const oldKey = current ? current.desktopBannerKey : null;

            const updated = await SiteSettings.findOneAndUpdate(
                {},
                { desktopBannerUrl: uploaded.Location, desktopBannerKey: key },
                { new: true, upsert: true }
            );

            await deleteByKey(oldKey);

            return res.json({
                desktopBannerUrl: updated.desktopBannerUrl,
                mobileBannerUrl:  updated.mobileBannerUrl,
            });
        } catch (e) {
            console.error('Upload desktop banner error:', e);
            return res.status(500).json({ message: e.message || 'Помилка при завантаженні Desktop-банера в S3.' });
        }
    },

    uploadMobileBanner: async (req, res, next) => {
        try {
            if (!req.files || !req.files.image) {
                return res.status(400).json({ message: 'Файл не знайдено. Передайте поле image.' });
            }
            const file = req.files.image;

            if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
                return res.status(400).json({ message: 'Непідтримуваний формат. Дозволено: JPEG, PNG, WebP.' });
            }
            const ext = path.extname(file.name).toLowerCase();
            if (!ALLOWED_EXTENSIONS.includes(ext)) {
                return res.status(400).json({ message: 'Непідтримуване розширення файлу.' });
            }
            if (file.size > MAX_MOBILE_SIZE) {
                return res.status(400).json({ message: 'Файл занадто великий. Максимум 3 MB для Mobile.' });
            }

            const key = `banner/mobile/${uuid.v4()}${ext}`;

            const uploaded = await s3Bucket.upload({
                ContentType: file.mimetype,
                ACL: 'public-read',
                Body: file.data,
                Bucket: S3_BUCKET_NAME,
                Key: key,
            }).promise();

            const current = await SiteSettings.findOne({});
            const oldKey = current ? current.mobileBannerKey : null;

            const updated = await SiteSettings.findOneAndUpdate(
                {},
                { mobileBannerUrl: uploaded.Location, mobileBannerKey: key },
                { new: true, upsert: true }
            );

            await deleteByKey(oldKey);

            return res.json({
                desktopBannerUrl: updated.desktopBannerUrl,
                mobileBannerUrl:  updated.mobileBannerUrl,
            });
        } catch (e) {
            console.error('Upload mobile banner error:', e);
            return res.status(500).json({ message: e.message || 'Помилка при завантаженні Mobile-банера в S3.' });
        }
    },

    deleteBanner: async (req, res, next) => {
        try {
            const { type } = req.query;
            if (!type || !['desktop', 'mobile'].includes(type)) {
                return res.status(400).json({ message: 'Параметр type має бути desktop або mobile.' });
            }

            const current = await SiteSettings.findOne({});
            if (!current) return res.json({ desktopBannerUrl: null, mobileBannerUrl: null });

            if (type === 'desktop') {
                await deleteByKey(current.desktopBannerKey);
                const updated = await SiteSettings.findOneAndUpdate(
                    {},
                    { desktopBannerUrl: null, desktopBannerKey: null },
                    { new: true }
                );
                return res.json({ desktopBannerUrl: updated.desktopBannerUrl, mobileBannerUrl: updated.mobileBannerUrl });
            } else {
                await deleteByKey(current.mobileBannerKey);
                const updated = await SiteSettings.findOneAndUpdate(
                    {},
                    { mobileBannerUrl: null, mobileBannerKey: null },
                    { new: true }
                );
                return res.json({ desktopBannerUrl: updated.desktopBannerUrl, mobileBannerUrl: updated.mobileBannerUrl });
            }
        } catch (e) {
            console.error('Delete banner error:', e);
            return res.status(500).json({ message: e.message || 'Помилка при видаленні банера.' });
        }
    },
};
