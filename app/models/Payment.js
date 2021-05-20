const mongoose = require("mongoose");


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

    user:{
      _id:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "user"
      },
      email: String
    },
    basket : basketSchema,
    paymentCode : String,
    success :{type:Boolean, default : false},
    amount: Number,
    refId : String
    
});




const model = mongoose.model("payment",schema);

module.exports=model;