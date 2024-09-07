const { Schema, model } = require("mongoose")

const ProductInFavouriteSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    _product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
})

module.exports = model('ProductInFavourite', ProductInFavouriteSchema)