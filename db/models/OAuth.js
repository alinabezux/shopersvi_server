const { Schema, model } = require('mongoose');

const OAuthSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    accessToken: String,
    refreshToken: String,
},
    { timestamps: true }
);

module.exports = model('OAuth', OAuthSchema);