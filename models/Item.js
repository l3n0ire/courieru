const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
    item:String,
    requests:Number,
    donations:Number,
})
module.exports = mongoose.model('Item',ItemSchema)
