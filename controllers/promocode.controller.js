const Promocode = require('../db/models/Promocode');

module.exports = {
    createPromocode: async (req, res, next) => {
        try {
            const promocode = await Promocode.create(req.body.promocode);
            return res.status(200).json(promocode);
        } catch (e) {
            return next(e)
        }
    },

    getAllPromocodes: async (req, res, next) => {
        try {
            const promocodes = await Promocode.find({});

            return res.status(200).json(promocodes)
        } catch (e) {
            return next(e)
        }
    },

    deletePromocode: async (req, res, next) => {
        try {
            await Promocode.deleteOne({ _id: req.params.promocodeId });

            res.sendStatus(204);
        } catch (e) {
            next(e)
        }
    },

}