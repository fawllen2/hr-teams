const mongoose = require("mongoose");
const config = require('config');
const jwt = require('jsonwebtoken');

const schemaComment = new mongoose.Schema({

    user:{type:String,required:true},
    text:{type:String,required:true},
    score :Number
});

const schemaService = new mongoose.Schema({

    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    comments:[schemaComment],
    pic:String,
    score :{type:Number,require:true,default:0}
});

const schema = new mongoose.Schema({
     name:{
         type: String,
         required:true
     },
     description:{
         type : String,
         required:true
     },
     score:{
         type:Number,
         default:0
     },
     pic: String,
     comment : [schemaComment],
     menu:[schemaService],
     adminUsername:{type:String,required:true},
     adminPassword:{type:String,required:true}

});

schema.methods.generateAuthToken = function () {
    const data = {
      _id: this._id,
      username: this.adminUsername,
      role: "service",
    };
    return jwt.sign(data, config.get('jwtPVKey'));
  };

const model = mongoose.model("services",schema);

module.exports=model;