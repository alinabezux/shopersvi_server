const axios = require('axios');

const configs = require('../configs/configs')
const { CASH } = require('../configs/order.enum');
const ApiError = require('../errors/ApiError');

const createInvoice = async (order) => {
    let sum;
    if (order.paymentMethod === CASH) {
        sum = 20000
    } else sum = order.totalSum * 100;
    console.log(order)

    const invoiceData = {
        amount: sum,
        merchantPaymInfo: {
            reference: order.orderID,
            destination: "Оплата за товар",
            basketOrder: order.orderItems.map(item => ({
                name: item.name,
                qty: item.quantity,
                sum: Math.round(item.price * (1 - item.discount / 100) * item.quantity * 100),
                icon: item.img,
                code: item.article,
            }))
        },
        redirectUrl: `${configs.CLIENT_URL}/order/${order.orderID}`,
    };

    try {
        const response = await axios.post('https://api.monobank.ua/api/merchant/invoice/create', invoiceData, {
            headers: {
                'X-Token': configs.MONO_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        return response.data;

    } catch (error) {
        throw new ApiError(error.data.errCode, `Monobank API error: ${error.data.errText}`);
    }
}

const getInvoiceStatus = async (invoiceId) => {
    const url = `https://api.monobank.ua/api/merchant/invoice/status?invoiceId=${invoiceId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'X-Token': configs.MONO_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        return response.data;

    } catch (error) {
        throw new ApiError(error.response.status, `Monobank API error: ${error.response.statusText}`);
    }
}

let cachedPublicKey = null;

const getPublicKey = async () => {
    if (!cachedPublicKey) {
        try {
            const response = await axios.get('https://api.monobank.ua/api/merchant/pubkey', {
                headers: {
                    'X-Token': configs.MONO_TOKEN,
                    'Content-Type': 'application/json'
                }
            });
            cachedPublicKey = response.data;
        } catch (error) {
            throw new ApiError(error.response.status, 'Failed to fetch public key from Monobank API');
        }
    }

    return cachedPublicKey.key;
}


module.exports = { getPublicKey, getInvoiceStatus, createInvoice }

