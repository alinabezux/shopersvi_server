const Order = require("../db/models/Order");
const ProductInBasket = require("../db/models/ProductInBasket");
const monoService = require("../services/mono.service");

module.exports = {
    createOrderAuth: async (req, res, next) => {
        try {
            const userId = req.user._id;

            const productsInBasket = ((await ProductInBasket.find({ _user: userId }).populate('_product')));

            if (productsInBasket.length === 0) {
                return res.status(400).json({ message: "No products in basket" });
            }

            const products = productsInBasket.map(productInBasket => {
                return {
                    _productId: productInBasket._product._id,
                    article: productInBasket._product.article,
                    img: productInBasket._product.images[0],
                    name: productInBasket._product.name,
                    color: productInBasket._product?.info?.color,
                    size: productInBasket?.size,
                    quantity: productInBasket.quantity,
                    price: productInBasket._product.price,
                    discount: productInBasket._product.discount
                };
            });

            const orderData = {
                ...req.body.order,
                _user: userId,
                orderItems: products
            };

            const order = await Order.create(orderData);
            const invoice = await monoService.createInvoice(order)
            // console.log('invoice:', invoice);
            const status = await monoService.getInvoiceStatus(invoice.invoiceId)
            // console.log('status:', status);

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

    createOrder: async (req, res, next) => {
        try {
            const productsInBasket = req.body.productsInBasket;

            if (productsInBasket.length === 0) {
                return res.status(400).json({ message: "No products in basket" });
            }

            const products = productsInBasket.map(productInBasket => {
                return {
                    _productId: productInBasket._id,
                    article: productInBasket.article,
                    img: productInBasket.images[0],
                    name: productInBasket.name,
                    color: productInBasket?.info?.color,
                    size: productInBasket?.size,
                    quantity: productInBasket.quantity,
                    discount: productInBasket.discount,
                    price: productInBasket.price,
                };
            });

            const orderData = {
                ...req.body.order,
                orderItems: products
            };

            const order = await Order.create(orderData);
            const invoice = await monoService.createInvoice(order);
            // console.log('invoice:', invoice);

            const status = await monoService.getInvoiceStatus(invoice.invoiceId)
            // console.log('status:', status);

            if (status.status === 'created') {
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
            let { page } = req.query;

            page = parseInt(page) || 1;
            const limit = 20;

            console.log(page)

            const skip = (page - 1) * limit;

            const orders = await (await Order.find({})
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit))

            for (let order of orders) {
                if (order.invoiceId) {
                    const status = await monoService.getInvoiceStatus(order.invoiceId);
                    if (status.status !== order.paymentStatus) {
                        order.paymentStatus = status.status;
                        await order.save();
                    }

                }
            }


            let count = await Order.countDocuments();
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