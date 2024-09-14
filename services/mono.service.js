const axios = require('axios');

const configs = require('../configs/configs')
const { CASH } = require('../configs/order.enum');
const ApiError = require('../errors/ApiError');

const createInvoice = async (order) => {
    let sum;
    if (order.paymentMethod === CASH) {
        sum = 10000
    } else sum = order.totalSum * 100;

    const invoiceData = {
        amount: sum,
        merchantPaymInfo: {
            reference: order.orderID,
            destination: "Оплата за товар",
            basketOrder: order.orderItems.map(item => ({
                name: item.name,
                qty: item.quantity,
                sum: item.price * 100 * item.quantity,
                icon: item.img,
                code: item.article,
            }))
        },
        redirectUrl: `${configs.CLIENT_URL}/order/${order.orderID}`,
        webHookUrl: `${configs.SERVER_URL}/webhook/paymentStatus`,
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

    // console.log('Sending request to Monobank API for invoice status:', url);

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
        // console.log('Fetching new public key from Monobank API');
        try {
            const response = await axios.get('https://api.monobank.ua/api/merchant/pubkey', {
                headers: {
                    'X-Token': configs.MONO_TOKEN,
                    'Content-Type': 'application/json'
                }
            });
            cachedPublicKey = response.data;
        } catch (error) {
            // console.error('Error fetching public key:', error);
            throw new ApiError(error.response.status, 'Failed to fetch public key from Monobank API');
        }
    }

    return cachedPublicKey.key;
}


module.exports = { getPublicKey, getInvoiceStatus, createInvoice }

