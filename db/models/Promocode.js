const { Schema, model } = require('mongoose');

const promocodeSchema = new Schema({
    name: { type: String, required: true }
})

module.exports = model('Promocode', promocodeSchema);