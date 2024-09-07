const Category = require("../db/models/Category");
const ApiError = require("../errors/ApiError");

module.exports = {
    checkIsCategoryUnique: async (req, res, next) => {
        try {
            const { name } = req.body.category;

            if (!name) {
                throw new ApiError(400, 'name відсутній');
            }

            const category = await Category.findOne({ name });

            if (category) {
                throw new ApiError(409, 'Така категорія вже існує.');
            }

            next();
        } catch (e) {
            next(e)
        }
    },
}