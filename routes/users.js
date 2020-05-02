const express = require('express');
const router = express.Router();
// import controller fucntions
const {getUsers,addUser} = require('../controllers/users')
// set get and post
router.route('/').get(getUsers).post(addUser);

module.exports = router;