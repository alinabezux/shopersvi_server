const monoRouter = require('express').Router();
const monoConroller = require('../controllers/mono.controller')

monoRouter.post('/paymentStatus', monoConroller.getStatusWebHook);

module.exports = monoRouter;