const Joi = require("joi");

module.exports = {
    logInValidator: Joi.object({
        email: Joi.string().lowercase().trim().required(),
        password: Joi.string().required()
    })
}