const mongoose = require("mongoose");
const config = require('config');
const jwt = require('jsonwebtoken');

const basketSchema = new mongoose.Schema({
  serviceId :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "service"
  },
  serviceName : String,
  products:[{
    name:String,
    productId:String,
    price:Number,
    count:Number
  }]
})

const schema = new mongoose.Schema({

    email:{type:String,required:true},
    name:{type:String,required:true},
    password :String,
    basket :basketSchema
    
});


schema.methods.generateAuthToken = function () {
    const data = {
      _id: this._id,
      role: "user",
    };
    return jwt.sign(data, config.get('jwtPVKey'));
  };

const model = mongoose.model("user",schema);

module.exports=model;