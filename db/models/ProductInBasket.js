const { Schema, model } = require("mongoose")

const ProductInBasketSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    _product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    size: String,
    quantity: { type: Number, required: true, default: 1 },
})

module.exports = model('ProductInBasket', ProductInBasketSchema)