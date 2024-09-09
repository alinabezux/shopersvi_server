const Order = require("../db/models/Order");
const ProductInBasket = require("../db/models/ProductInBasket");
const User = require("../db/models/User");
const ApiError = require("../errors/ApiError");
const monoService = require("../services/mono.service");

module.exports = {
    createOrder: async (req, res, next) => {
        try {
            const userId = req.user._id;

            const productsInBasket = await ProductInBasket.find({ _user: userId }).populate('_product');

            if (productsInBasket.length === 0) {
                return res.status(400).json({ message: "No products in basket" });
            }

            const products = productsInBasket.map(productInBasket => {
                return {
                    _productId: productInBasket._product._id,
                    name: productInBasket._product.name,
                    info: productInBasket._product?.info,
                    quantity: productInBasket.quantity,
                    price: productInBasket._product.price,
                    img: productInBasket._product.images[0],
                    article: productInBasket._product.article
                };
            });


            const orderData = {
                ...req.body.order,
                _user: userId,
                orderItems: products
            };

            const order = await Order.create(orderData);

            const invoice = await monoService.createInvoice(order)
            const status = await monoService.getInvoiceStatus(invoice.invoiceId)

            if (status.status === 'created') {
                await ProductInBasket.deleteMany({ _user: userId });

                const updatedOrder = await Order.findOne({ 'orderID': status.reference });

                if (updatedOrder) {
                    updatedOrder.paymentStatus = status.status;
                    updatedOrder.invoiceId = invoice.invoiceId;

                    await updatedOrder.save();
                }
            }

            res.status(200).json({ order, invoice });
        } catch (e) {
            next(e);
        }
    },

    getAllOrders: async (req, res, next) => {
        try {
            let { page = 1 } = req.query;
            const limit = 20;
            let count;

            const orders = await Order.find({}).limit(limit).skip((page - 1) * limit);

            count = await Order.countDocuments();

            res.status(200).json({
                orders,
                count: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (e) {
            next(e);
        }
    },

    getUserOrders: async (req, res, next) => {
        try {
            const orders = await Order.find({ _user: req.params.userId });

            res.status(200).json(orders);
        } catch (e) {
            next(e);
        }
    },
    getNewOrderStatus: async (req, res, next) => {
        try {
            const order = await Order.findById(req.params.userId);

            res.status(200).json(order.paymentStatus);
        } catch (e) {
            next(e);
        }
    },

    updateOrderStatus: async (req, res, next) => {
        try {
            const newStatus = req.body.status;
            console.log(newStatus);

            const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, { status: newStatus }, { new: true });

            res.status(200).json(updatedOrder);
        } catch (e) {
            next(e);
        }
    },

    deleteOrderById: async (req, res, next) => {
        try {
            await Order.findByIdAndDelete({ _id: req.params.orderId });

            res.sendStatus(204);
        } catch (e) {
            next(e)
        }
    },
}