const { Schema, model } = require('mongoose');

const siteSettingsSchema = new Schema({
    desktopBannerUrl: { type: String, default: null },
    desktopBannerKey: { type: String, default: null },
    mobileBannerUrl:  { type: String, default: null },
    mobileBannerKey:  { type: String, default: null },
}, { timestamps: true });

module.exports = model('SiteSettings', siteSettingsSchema);
