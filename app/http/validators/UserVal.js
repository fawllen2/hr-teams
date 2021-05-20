const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const registerValUser = (data)=>{
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
    });
    return schema.validate(data);
}


const loginValUser = (data)=>{
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
}



module.exports={registerValUser,loginValUser};