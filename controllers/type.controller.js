const Type = require('../db/models/Type');

module.exports = {
    createType: async (req, res, next) => {
        try {
            const type = await Type.create(req.body.type);

            return res.status(200).json(type);
        } catch (e) {
            return next(e)
        }
    },

    getAllTypes: async (req, res, next) => {
        try {
            const types = await Type.find({});

            return res.status(200).json(types)
        } catch (e) {
            return next(e)
        }
    },
    
    getTypesByCategoryId: async (req, res, next) => {
        try {
            const typesByCategory = await Type.find({_category: req.params.categoryId});
            res.status(200).json(typesByCategory);
        } catch (e) {
            next(e);
        }
    },
    
    updateType: async (req, res, next) => {
        try {
            const newInfo = req.body.type;
            const updatedType = await Type.findByIdAndUpdate(req.params.typeId, newInfo, {new: true});
            
            res.status(200).json(updatedType);
        } catch (e) {
            next(e);
        }
    },
    
    deleteType: async (req, res, next) => {
        try {
            await Type.deleteOne({_id: req.params.typeId});

            res.sendStatus(204);
        } catch (e) {
            next(e)
        }
    },

}