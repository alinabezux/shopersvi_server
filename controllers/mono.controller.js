const crypto = require('crypto');
const Order = require('../db/models/Order');
const User = require('../db/models/User');
const Product = require('../db/models/Product');
const monoService = require('../services/mono.service')

module.exports = {
    getStatusWebHook: async (req, res, next) => {
        try {
            console.log('Контролер викликано');
            const message = JSON.stringify(req.body);
            const xSignBase64 = req.headers['x-sign'];

            // console.log('Received webhook:', req.body);
            // console.log('X-Sign Header:', req.headers['x-sign']);

            if (!xSignBase64) {
                return res.status(400).send('Missing X-Sign header');
            }

            const signatureBuf = Buffer.from(xSignBase64, 'base64');
            const publicKeyBuf = Buffer.from(await monoService.getPublicKey(), 'base64');
            // console.log('publicKeyBuf')
            // console.log(publicKeyBuf)

            const verify = crypto.createVerify('SHA256');
            verify.update(message);
            verify.end();

            const isValidSignature = verify.verify(publicKeyBuf, signatureBuf);

            if (!isValidSignature) {
                console.log('Invalid signature, fetching new public key');
                cachedPublicKey = null;
                publicKeyBuf = Buffer.from(await monoService.getPublicKey(), 'base64');
                isValidSignature = verify.verify(publicKeyBuf, signatureBuf);
            }

            const { reference, status, modifiedDate } = req.body;
            const order = await Order.findOne({ 'orderID': reference });

            if (order) {
                if (new Date(modifiedDate) > new Date(order.updatedAt)) {
                    order.paymentStatus = status;
                    order.updatedAt = modifiedDate;
                    await order.save();
                }

                if (status === 'success') {
                    let bonusUpdate;
                    const user = await User.findById(order._user)

                    if (order.useBonus === true) {
                        bonusUpdate = User.findByIdAndUpdate(order._user, { bonus: order.cashback }, { new: true });
                    } else {
                        const newBonus = user.bonus + order.cashback;
                        bonusUpdate = User.findByIdAndUpdate(order._user, { bonus: newBonus }, { new: true });
                    }

                    const productUpdates = order.orderItems.map(item =>
                        Product.findByIdAndUpdate(
                            item._productId,
                            { $inc: { quantity: -item.quantity } },
                            { new: true }
                        )
                    );

                    await Promise.all([bonusUpdate, ...productUpdates]);
                }
            } else {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json({ message: 'Status updated successfully' });
        } catch (error) {
            console.error('Помилка в контролері:', error);
            next(error);
        }
    }
}