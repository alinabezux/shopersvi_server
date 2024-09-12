const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const { ACCESS_SECRET, REFRESH_SECRET, CONFIRM_ACCOUNT_ACTION_TOKEN_SECRET, FORGOT_PASSWORD_ACTION_TOKEN_SECRET } = require("../configs/configs")
const { config } = require('dotenv');
const OAuth = require("../db/models/OAuth");
const ApiError = require("../errors/ApiError")
const tokenTypes = require('../configs/tokenActions.enum')

module.exports = {
    hashPassword: (password) => bcrypt.hash(password, 10),

    comparePasswords: async (password, hashPassword) => {
        const isPasswordsSame = await bcrypt.compare(password, hashPassword);

        if (!isPasswordsSame) {
            throw new ApiError(409, 'Неправильний email або пароль.');
        }
    },

    generateTokenPair: (dataToSign = {}) => {
        const accessToken = jwt.sign(dataToSign, ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(dataToSign, REFRESH_SECRET, { expiresIn: '30d' });

        return {
            accessToken,
            refreshToken
        }
    },

    saveTokens: async (userId, tokenPair) => {
        let info = await OAuth.findOne({ _user: userId })

        if (info) {
            info.accessToken = tokenPair.accessToken;
            info.refreshToken = tokenPair.refreshToken;
            await info.save();
        } else {
            info = await OAuth.create({ _user: userId, ...tokenPair });
        }

        return info;

    },

    checkToken: (token, tokenType = 'accessToken') => {
        try {
            let secret = '';

            if (tokenType === 'accessToken') secret = ACCESS_SECRET
            else if (tokenType === 'refreshToken') secret = REFRESH_SECRET

            return jwt.verify(token, secret);

        } catch (e) {
            if (tokenType === 'refreshToken') {
                throw new ApiError(401, 'Рефреш токен не дійсний.')
            } else throw new ApiError(401, 'аксес токен не дійсний.')
        }
    },

    generateActionToken: (actionType, dataToSign = {}) => {
        let secretWord = '';

        switch (actionType) {
            case tokenTypes.CONFIRM_ACCOUNT:
                secretWord = CONFIRM_ACCOUNT_ACTION_TOKEN_SECRET
                break;
            case tokenTypes.FORGOT_PASSWORD_ACTION_ENUM:
                secretWord = FORGOT_PASSWORD_ACTION_TOKEN_SECRET
                break;
        }

        return jwt.sign(dataToSign, secretWord, { expiresIn: '7d' })
    },

    checkActionToken: (token, actionType) => {
        try {
            let secretWord = '';

            switch (actionType) {
                case tokenTypes.CONFIRM_ACCOUNT:
                    secretWord = CONFIRM_ACCOUNT_ACTION_TOKEN_SECRET
                    break;
                case tokenTypes.FORGOT_PASSWORD_ACTION_ENUM:
                    secretWord = FORGOT_PASSWORD_ACTION_TOKEN_SECRET
                    break;
            }
            jwt.verify(token, secretWord);

        } catch (e) {
            throw new ApiError('Token not valid', 401);
        }
    }
}