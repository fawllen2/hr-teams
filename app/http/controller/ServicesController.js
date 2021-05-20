const ServicesModel = require("../../models/Services");
const { createServiceVal, updateServiceVal, loginVal,productVal } = require("../validators/ServicesVal");
const _ = require("lodash");
const bcrypt = require("bcrypt");

class ServicesController {

    async getList(req, res) {
        const list = await ServicesModel.find().select("name description adminUsername pic score");
        res.send(list);
    }
    async getListForUser(req, res) {
        const list = await ServicesModel.find().select("name description pic score");
        res.send(list);
    }
    async getOne(req, res) {
        const id = req.params.id;
        const data = await ServicesModel.findById(id).select("-adminPassword");
        if (!data) {
            res.status(404).send("Not Found ! - پیدا نشد");
        }
        res.send(data);
    }
    async getOneForUser(req, res) {
        const id = req.params.id;
        const data = await ServicesModel.findById(id).select("-adminPassword -adminUsername");
        if (!data) {
            res.status(404).send("Not Found ! - پیدا نشد");
        }
        res.send(data);
    }
    async create(req, res) {
        const { error } = createServiceVal(req.body);
        if (error) {
            res.status(404).send(error.message);
        }
        let service = new ServicesModel(_.pick(req.body,
            ['name', 'description', 'adminUsername', 'adminPassword'])
        );
        const salt = await bcrypt.genSalt(10);
        service.adminPassword = await bcrypt.hash(service.adminPassword, salt);
        service = await service.save();
        res.send(service);
    }
    async update(req, res) {
        const id = req.params.id;
        const { error } = updateServiceVal(req.body);
        if (error) {
            res.status(404).send(error.message);
        }
        const result = await ServicesModel.findByIdAndUpdate(id, {
            $set: _.pick(req.body, [
                'name', 'description', 'adminUsername', 'adminPassword'
            ]),
        }, { new: true });
        if (!result) {
            return res.status(404).send("Not Found ! - پیدا نشد");
        }
        res.send(_.pick(result, [
            'name', 'description', 'adminUsername', 'adminPassword'
        ]));
    }
    async delete(req, res) {
        const id = req.params.id;
        const result = await ServicesModel.findByIdAndRemove(id);
        res.status(200).send("Deleted - حذف شد");
    }

    async login(req, res) {
        const { error } = loginVal(req.body);
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        let service = await ServicesModel.findOne({ adminUsername: req.body.username });
        if (!service) {
            return res.status(400).send({ message: "No service found with this credentials - سرویسی با این مشخصات یافت نشد" });
        }
        const result = await bcrypt.compare(req.body.password, service.adminPassword);
        if (!result) {
            return res.status(400).send({ message: "No service found with this credentials - سرویسی با این مشخصات یافت نشد" });
        }

        const token = service.generateAuthToken();
        res.header("Access-Control-Expose-headers","x-auth-token").header("x-auth-token", token).status(200).send({ success: true });
    }

    async addProduct(req,res){
        const service = await ServicesModel.findOne({adminUsername:req.user.username});
        if(!service){
            res.status(404).send("Service not found - سرویس پیدا نشد");
        }
        const {error} = productVal(req.body);
        if(error){
            res.status(400).send(error.message);
        }
        service.menu.push({..._.pick(req.body,["name","description","price"]),pic:req.file.path});
        await service.save();
        res.send(true);
    }

    async getProducts(req,res){
        const service = await ServicesModel.findOne({adminUsername:req.user.username});
        if(!service){
            res.status(404).send("Service not found - سرویس پیدا نشد");
        }
        res.send(service.menu);
    }

    async deleteProduct(req,res){
        const service = await ServicesModel.findOne({adminUsername:req.user.username});
        if(!service){
            res.status(404).send("Service not found - سرویس پیدا نشد");
        }
        const productId = req.params.productId;
        const foundProduct=service.menu.id(productId);
        if(foundProduct){
            foundProduct.remove();
        }
        await service.save();
        res.send("Deleted - حذف شد");

    }

    async editProduct(req,res){
        const service = await ServicesModel.findOne({adminUsername:req.user.username});
        if(!service){
            res.status(404).send("Service not found - سرویس پیدا نشد");
        }
        const productId = req.params.productId;
        const foundProduct=service.menu.id(productId);
        if(foundProduct){
            if(req.body.name){
                foundProduct.name=req.body.name;
            }
            if(req.body.description){
                foundProduct.description=req.body.description;
            }
            if(req.body.price){
                foundProduct.price=req.body.price
            }
        }
        await service.save();
        res.send("Edited - ویرایش شد");

    }

    // async setProductPhoto(req,res){
    //     res.send(req.file)
    // }

    async addCommentToService(req,res){
        const id = req.params.id;
        const data = await ServicesModel.findById(id);
        if(!data){
            res.status(404).send("Not found");
        }
        const comment ={
            user:req.body.user,
            text:req.body.text,
            score:req.body.score
        }
        data.comment.push(comment);
        await data.save();
        res.send(true);

    }
    


};

module.exports = new ServicesController;