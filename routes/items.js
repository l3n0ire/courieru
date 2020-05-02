const express = require('express');
const router = express.Router();
const {getItems,addItem} = require('../controllers/items');

router.route('/').get(getItems).post(addItem);

module.exports = router;