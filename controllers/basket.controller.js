const ProductInBasket = require("../db/models/ProductInBasket");

module.exports = {
    getUsersBasket: async (req, res, next) => {
        try {
            const productsInBasket = await ProductInBasket.find({ _user: req.params.userId }).populate('_product');

            if (!productsInBasket.length) {
                return res.status(404).json({ message: "Кошик порожній або користувача не існує" });
            }

            const productsData = productsInBasket.map(productInBasket => ({
                ...productInBasket._product._doc,
                _id: productInBasket._id,
                productId: productInBasket._product._id,
                size: productInBasket.size,
                quantity: productInBasket.quantity
            }));

            res.status(200).json(productsData);
        } catch (e) {
            next(e);
        }
    },

    addToBasketAuth: async (req, res, next) => {
        try {
            const { quantity, size } = req.body;

            let productInBasket = await ProductInBasket.findOne({
                _product: req.params.productId,
                _user: req.params.userId,
                size
            });

            if (productInBasket) {
                productInBasket = await ProductInBasket.findOneAndUpdate(
                    { _id: productInBasket._id },
                    { quantity },
                    { new: true }
                ).populate('_product');
            } else {
                productInBasket = await ProductInBasket.create({
                    _user: req.params.userId,
                    _product: req.params.productId,
                    quantity,
                    size
                });

                productInBasket = await ProductInBasket.findById(productInBasket._id).populate('_product');
            }
            // console.log('addToBasket')
            // console.log(productInBasket)

            res.status(200).json(productInBasket);
        } catch (e) {
            next(e);
        }
    },

    deleteFromBasket: async (req, res, next) => {
        try {
            const productInBasket = await ProductInBasket.findById(req.params.productInBasketId);

            if (!productInBasket) {
                return res.status(404).json({ message: "Продукт у кошику не знайдено" });
            }

            await ProductInBasket.findByIdAndDelete(req.params.productInBasketId);
            res.sendStatus(204);

        } catch (e) {
            next(e)
        }
    },

    changeProductQuantity: async (req, res, next) => {
        try {
            const { productInBasketId } = req.params;
            const { quantity } = req.body;

            let updatedProductInBasket = await ProductInBasket.findOneAndUpdate(
                { _id: productInBasketId },
                { quantity },
                { new: true }
            )
            if (!updatedProductInBasket) {
                return res.status(404).json({ message: "Продукт у кошику не знайдено" });
            }
            res.status(200).json(updatedProductInBasket)
        } catch (e) {
            next(e)
        }
    }
}