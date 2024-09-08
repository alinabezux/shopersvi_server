const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    surname: String,
    instagram: String,
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} не правильний номер телефону!`
        },
    },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    bonus: { type: Number, required: true, default: 10 }
},
    { timestamps: true }
)

module.exports = model('User', userSchema);