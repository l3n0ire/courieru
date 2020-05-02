const mongoose = require('mongoose');
const RouteSchema = new mongoose.Schema({
    courier:String,
    addresses:[String],
    accepted:false

})
module.exports = mongoose.model("Route",RouteSchema)