const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
    item:String,
    requests:Number,
    donations:Number,
    date:Date
})
module.exports = mongoose.model('Item',ItemSchema)
