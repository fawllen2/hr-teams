const router = require("express").Router();
const controller = require("../http/controller/ServicesController");
const usercontroller = require("../http/controller/UserController");
const Auth = require("../http/middleware/Auth");
const User = require("../http/middleware/User");


router.get("/servicesList",controller.getListForUser);
router.get("/serviceDetails/:id",controller.getOneForUser);

router.post("/addCommentService/:id",controller.addCommentToService);

router.post("/login",usercontroller.login);
router.post("/register",usercontroller.register);

router.post("/updateBasket",[Auth,User],usercontroller.updateBasket);
router.get("/getBasket",[Auth,User],usercontroller.getBasket);

router.get("/chekoutBasket",[Auth,User],usercontroller.chekoutBasket);
router.get("/verifyPayment",usercontroller.verifyPayment);
router.get("/payment/:paymentCode",usercontroller.paymentDetail);







module.exports = router;