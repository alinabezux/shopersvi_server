const Product = require("../db/models/Product");
const ApiError = require("../errors/ApiError");

module.exports = {
    checkIsArticleUnique: async (req, res, next) => {
        try {
            const { article } = req.body.product;

            if (!article) {
                throw new ApiError(400, 'article відсутній');
            }

            const product = await Product.findOne({ article });

            if (product) {
                throw new ApiError(409, 'Продукт з таким артикулом вже існує.');
            }

            next();
        } catch (e) {
            next(e)
        }
    },
}