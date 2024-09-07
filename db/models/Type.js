const { Schema, model } = require('mongoose');

const typeSchema = new Schema({
    name: { type: String, required: true, unique: true },
    _category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
})

module.exports = model('Type', typeSchema);