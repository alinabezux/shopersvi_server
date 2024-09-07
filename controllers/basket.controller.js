const ProductInBasket = require("../db/models/ProductInBasket");

module.exports = {
    getUsersBasket: async (req, res, next) => {
        try {
            const productsInBasket = await ProductInBasket.find({ _user: req.params.userId }).populate('_product');

            const productsData = productsInBasket.map(productInBasket => ({
                ...productInBasket._product._doc,
                quantity: productInBasket.quantity
            }));

            res.status(200).json(productsData);
        } catch (e) {
            next(e);
        }
    },

    addToBasket: async (req, res, next) => {
        try {
            const { quantity, options } = req.body;
            let productInBasket = await ProductInBasket.findOne({
                _product: req.params.productId,
                _user: req.params.userId
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
                    quantity
                });

                productInBasket = await ProductInBasket.findById(productInBasket._id).populate('_product');
            }
            console.log(productInBasket);

            res.status(200).json(productInBasket);
        } catch (e) {
            next(e);
        }
    },

    deleteFromBasket: async (req, res, next) => {
        try {
            let productInBasket = await ProductInBasket.findOne({ _product: req.params.productId, _user: req.params.userId })

            if (productInBasket) {
                await ProductInBasket.deleteOne({ _id: productInBasket._id });
                res.sendStatus(204);
            } else {
                res.status(404).json({ message: "Такого продукту не існує в даній корзині" });
            }
        } catch (e) {
            next(e)
        }
    },

    changeProductQuantity: async (req, res, next) => {
        try {
            let updatedProductInBasket;

            let productInBasket = await ProductInBasket.findOne({ _product: req.params.productId, _user: req.params.userId })
            if (productInBasket) {
                updatedProductInBasket = await ProductInBasket.findOneAndUpdate(
                    { _id: productInBasket._id },
                    { quantity: req.body.quantity },
                    { new: true }
                )
            } else {
                res.status(404).json({ message: "Такого продукту не існує в даній корзині" });
            }
            res.status(200).json(updatedProductInBasket)
        } catch (e) {
            next(e)
        }
    }
}