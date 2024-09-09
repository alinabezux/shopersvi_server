const ProductInFavourite = require("../db/models/ProductInFavourite");

module.exports = {
    getUsersFavourite: async (req, res, next) => {
        try {
            const productsInFavourite = await ProductInFavourite.find({ _user: req.params.userId }).populate('_product');
            const productsData = productsInFavourite.map(productInFavourite => ({
                ...productInFavourite._product._doc,
            }));

            console.log('productsData')
            console.log(productsData)

            res.status(200).json(productsData);

        } catch (e) {
            next(e);
        }
    },

    addToFavourite: async (req, res, next) => {
        try {
            const { userId, productId } = req.params;
            let existingFavorite = await ProductInFavourite.findOne({ _user: userId, _product: productId });
            if (existingFavorite) {
                return res.status(400).json({ message: 'Продукт вже є у списку бажань.' });
            }

            const productInFavourite = await ProductInFavourite.create({
                _user: req.params.userId,
                _product: req.params.productId
            });

            const populatedFavourite = await ProductInFavourite.findById(productInFavourite._id).populate('_product');

            console.log('populatedFavourite')
            console.log(populatedFavourite)

            res.status(200).json(populatedFavourite)
        } catch (e) {
            next(e)
        }
    },

    deleteFromFavourite: async (req, res, next) => {
        try {
            let productInFavourite = await ProductInFavourite.findOne({ _product: req.params.productId, _user: req.params.userId })

            if (productInFavourite) {
                await ProductInFavourite.deleteOne({ _id: productInFavourite._id });
                res.sendStatus(204);
            } else {
                res.status(404).json({ message: "Такого продукту не існує в даному списку бажань." });
            }
        } catch (e) {
            next(e)
        }
    },


}