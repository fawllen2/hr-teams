const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const createServiceVal = (data)=>{
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        adminUsername: Joi.string().required(),
        adminPassword: Joi.string().required(),
    });
    return schema.validate(data);
}

const updateServiceVal = (data)=>{
    const schema = Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        adminUsername: Joi.string(),
        adminPassword: Joi.string()
    });
    return schema.validate(data);
}

const loginVal = (data)=>{
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
}

const productVal = (data)=>{
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required()
    });
    return schema.validate(data);
}


module.exports={createServiceVal,updateServiceVal,loginVal,productVal};