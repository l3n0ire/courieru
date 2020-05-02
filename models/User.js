const mongoose = require('mongoose');
const fetch = require('node-fetch')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'please add an unique user name'],
        unique:true,
        trim: true
    },
    password:{
        type: String,
        required:[true,'please enter a password'],
        trim: true
    },
    contactInfo:{
        fullName:String,
        phonenumber:Number,
        email:String
    },
    address:{
        type:String,
        required:true
    },
    location: {
        type: {
          type: String,
          enum: ['Point'], 
        },
        coordinates: {
          type: [Number], // number array
          index:'2dsphere'
        },
        formattedAddress:String,
        
      },
      createdAt:{
        type:Date,
        default:Date.now()
    },
    requests:[{
        item:String,
        quantity:Number,
        status:String
    }],
    role:{
        type:String, // recipient or courier
        required: true
    }
})
// create location
// pre - run before save
UserSchema.pre('save', async function(next){
    const modadd = this.address.split(" ").join("+")
    const url = "https://api.radar.io/v1/geocode/forward?query="+modadd;
    const res = await fetch(url,{method:'GET',headers:{"Content-Type":"application/json","Authorization":"prj_live_pk_bc355842d1d55d195b361380237c58fde8a6ef48"}})
    const data = await res.json();
    this.location = {
      type: 'Point',
      coordinates:[data.addresses[0].longitude, data.addresses[0].latitude],
      formattedAddress:data.addresses[0].formattedAddress
  }
    // do not save address
    this.address = undefined;
    next();

});
module.exports = mongoose.model('User',UserSchema);

