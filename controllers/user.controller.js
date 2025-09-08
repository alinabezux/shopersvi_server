const OAuthService = require("../services/OAuthService")
const User = require('../db/models/User')

module.exports = {
    createUser: async (req, res, next) => {
        try {
            const hashPassword = await OAuthService.hashPassword(req.body.password);

            await User.create({ ...req.body, password: hashPassword });

            res.status(201).json('Користувач зареєстрований.')
        } catch (e) {
            next(e);
        }
    },

    getUserById: async (req, res, next) => {
        try {
            const user = req.user
            // console.log(user);

            res.status(200).json(user);
        } catch (e) {
            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const newInfo = req.body.user;

            if (!newInfo) {
                throw new ApiError(400, 'Немає даних')
            }

            // console.log('newInfo')
            // console.log(newInfo)

            const updatedUser = await User.findByIdAndUpdate(req.params.userId, newInfo, { new: true });
            // console.log('updatedUser')
            // console.log(updatedUser)

            res.status(200).json(updatedUser);

        } catch (e) {
            next(e)
        }
    },

    changePassword: async (req, res, next) => {
        try {
            const { currentPassword, newPassword } = req.body;

            await OAuthService.comparePasswords(currentPassword, req.user.password);

            const hashedPassword = await OAuthService.hashPassword(newPassword);
            await User.findByIdAndUpdate(req.params.userId, { password: hashedPassword }, { new: true });

            res.status(200).json({ message: 'Пароль успішно змінено' });
        } catch (e) {
            next(e);
        }
    },

    getAllUsers: async (req, res, next) => {
        try {
            let { page } = req.query;
            page = parseInt(page) || 1;
            const limit = 20;
            const skip = (page - 1) * limit;

            const users = await User.find({})
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit)

            let count = await User.countDocuments();

            return res.status(200).json({
                users,
                count: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (e) {
            next(e);
        }
    }

}