const express = require('express');
const router = express.Router();
const {getRoutes,addRoute} = require('../controllers/routes');

router.route('/').get(getRoutes).post(addRoute);

module.exports = router;