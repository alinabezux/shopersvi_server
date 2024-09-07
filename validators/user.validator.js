const Joi = require('joi');
const regexp = require('../configs/regexp.enum');

module.exports = {
    newUserValidator: Joi.object({
        name: Joi.string().min(2).max(20).required().messages({
            'string.min': 'Ім\'я повинне складатися з 2 і більше символів.',
            'string.max': 'Ім\'я повинне містити не більше 20 символів.',
            'any.required': 'Ім\'я є обов\'язковим полем',
        }),
        email: Joi.string().regex(regexp.EMAIL).lowercase().trim().required().messages({
            'string.pattern.base': 'Email повинен складатися з англійських літер та містити "@" і "."',
            'any.required': 'Email є обов\'язковим полем',
        }),
        password: Joi.string().regex(regexp.PASSWORD).required().messages({
            'string.pattern.base': 'Ваш пароль повинен складатися з англійських літер, містити не менше 6-ти символів, літери великого та малого регістру, цифри.',
            'any.required': 'Пароль є обов\'язковим полем',
        }),
        isAdmin: Joi.boolean().optional()
    })
}