const { Schema, model } = require('mongoose');
const { CARD, NOVAPOST } = require('../../configs/order.enum');

const generateSixDigitId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000).toString()
    return `ID-${randomNum}`;
};

const orderSchema = new Schema({
    orderID: { type: String, required: true, unique: true, default: generateSixDigitId },
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    orderItems: [{ type: Object, required: true }],
    shipping: { type: String, default: NOVAPOST, required: true, },
    instagram: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} не правильний номер телефону!`
        },
    },
    city: {
        ref: { type: String },
        description: { type: String },
    },
    warehouse: {
        ref: { type: String },
        index: { type: String },
        number: { type: String },
        description: { type: String }
    },
    cityUKR: { type: String },
    index: { type: String },
    region: {
        value: { type: Number },
        label: { type: String }
    },
    freeShipping: { type: Boolean, required: true, default: false },
    email: { type: String, required: true },
    paymentMethod: { type: String, default: CARD, required: true },
    totalSum: { type: Number, required: true },
    cashback: { type: Number, required: true },
    useBonus: { type: Boolean, required: true },
    status: { type: String, required: true, default: "Нове" },
    paymentStatus: { type: String },
    invoiceId: { type: String }
},
    { timestamps: true }
)
module.exports = model('Order', orderSchema)