const UserModel = require("../../models/User");
const Payment = require("../../models/Payment");
const { registerValUser, loginValUser } = require("../validators/UserVal");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const User = require("../middleware/User");
const ZarinpalCheckout = require('zarinpal-checkout');
const { escapeRegExp } = require("lodash");
const zarinpal = ZarinpalCheckout.create('00000000-0000-0000-0000-000000000000', true);

class UserController {


    async login(req, res) {
        const { error } = loginValUser(req.body);
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        let user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send({ message: "No user found with this credentials - یوزری با این مشخصات یافت نشد" });
        }
        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result) {
            return res.status(400).send({ message: "No user found with this credentials - یوزری با این مشخصات یافت نشد" });
        }

        const token = user.generateAuthToken();
        res.header("Access-Control-Expose-headers", "x-auth-token").header("x-auth-token", token).status(200).send({ success: true });
    }

    async register(req, res) {
        const { error } = registerValUser(req.body);
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        let user = await UserModel.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).send({ message: "user found with this credentials - یوزری با این مشخصات یافت شد" });
        }

        user = new UserModel(_.pick(req.body, ["name", "email", "password"]));

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user = await user.save();

        const token = user.generateAuthToken();
        res.header("Access-Control-Expose-headers", "x-auth-token").header("x-auth-token", token).status(200).send({ success: true });
    }

    async updateBasket(req, res) {
        const basketBody = _.pick(req.body, ["serviceId", "serviceName", "products"]);
        if (!basketBody.products) {
            res.status(400).send({ message: "حداقل یک محصول انتخاب شود - Choose at least one product" });
        }
        if (!basketBody.serviceName || !basketBody.serviceId) {
            res.status(400).send({ message: "مشخصات سرویس را بفرستید - Send service details" });
        }
        const user = await UserModel.findById(req.user._id);

        if (!user) {
            res.status(400).send({ message: "باید لاگین کنید - You must login" });
        }
        user.basket = basketBody;
        await user.save();
        res.status(200).send("ok");
    }

    async getBasket(req, res) {
        const user = await UserModel.findById(req.user._id);
        res.send(user.basket);
    }

    async chekoutBasket(req, res) {
        const user = await UserModel.findById(req.user._id);
        const basket = user.basket;
        const amount = user.basket.products.reduce((acc, item) => {
            return acc + (item.price * item.count);
        }, 0);

        const payment = new Payment({
            user: {
                _id: user._id,
                email: user.email
            },
            basket,
            amount
        });

        const response = await zarinpal.PaymentRequest({
            Amount: amount, // In Tomans
            CallbackURL: 'http://localhost:3000/api/user/verifyPayment',
            Description: 'HR Team',
            Email: user.email,

        })
        payment.paymentCode = response.authority
        await payment.save();
        user.basket=undefined;
        await user.save();
        res.send({url : response.url});

    }

    async verifyPayment(req, res) {
        const paymentCode = req.query.Authority
        const status = req.query.Status;
        const payment = await Payment.findOne({ paymentCode });

        if (status === "OK") {
            const response = await zarinpal.PaymentVerification({
                Amount: payment.amount, // In Tomans
                Authority: paymentCode,
            });
            if (response.status === -21) {
                res.send('پرداخت پیدا نشد');
            } else {
                payment.refId = response.RefID;
                payment.success =true;
                await payment.save();
                res.send(`<h1>Verified! Ref ID: ${response.RefID}</h1>
                
                <a href="http://127.0.0.1:5500/bill_slip.html?paymentCode=${paymentCode}">سایت اصلی - Main site</a>
                
                `);
            }
        } else {
            res.send("پرداخت ناموفق بود -Payment Failed");
        }
    }

    async paymentDetail(req,res){
        const paymentCode = req.params.paymentCode;
        const payment = await Payment.findOne({paymentCode});

        if(payment){
            res.send(payment);
        }else{
            res.status(404).send("پیدا نشد - Not found");
        }
    }

};

module.exports = new UserController;