const User = require("../db/models/User");
const ApiError = require("../errors/ApiError");
const userValidator = require('../validators/user.validator')

module.exports = {
    getUserByEmail: async (req, res, next) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                throw new ApiError(404, 'Користувача з таким email не знайдено.')
            }

            req.user = user;

            next();
        } catch (e) {
            next(e)
        }
    },
    isNewUserValid: async (req, res, next) => {
        try {

            let validate = userValidator.newUserValidator.validate(req.body.user);
            if (validate.error) {
                const errorDetails = validate.error.details[0] || null;

                if (errorDetails) {
                    const isErrorMessage = errorDetails.message || null;
                    const isCustomErrorMessage = errorDetails.context.label || null;
                    const errorMessage = isErrorMessage || isCustomErrorMessage;

                    throw new ApiError(409, errorMessage);
                }
            }

            req.body = validate.value;

            next()
        } catch (e) {
            next(e)
        }
    },
    checkIfUserExists: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId);

            if (!user) {
                throw new ApiError(400, 'Користувача не існує')
            }

            req.user = user;

            next();

        } catch (e) {
            next(e);
        }
    },
    checkIsEmailUnique: async (req, res, next) => {
        try {
            const { email } = req.body;

            if (!email) {
                throw new ApiError(400, 'Email відсутній');
            }

            const user = await User.findOne({ email });

            if (user) {
                throw new ApiError(409, 'Користувач з таким email вже існує.');
            }

            next();
        } catch (e) {
            next(e)
        }
    },

}