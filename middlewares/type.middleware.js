const Type = require("../db/models/Type");
const ApiError = require("../errors/ApiError");

module.exports = {
    checkIsTypeUnique: async (req, res, next) => {
        try {
            const { name } = req.body.type;

            if (!name) {
                throw new ApiError(400, 'name відсутній');
            }

            const type = await Type.findOne({ name });

            if (type) {
                throw new ApiError(409, 'Такий тип вже існує.');
            }

            next();
        } catch (e) {
            next(e)
        }
    },
}