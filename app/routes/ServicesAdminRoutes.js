const router = require("express").Router();
const controller = require("../http/controller/ServicesController");
const Auth = require("../http/middleware/Auth");
const ServiceAdmin = require("../http/middleware/ServiceAdmin");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/');
    },
    filename: function(req,file,cb){
        cb(null,Date.now() +"-"+ file.originalname);
    }
})

const upload = multer({storage:storage});

router.post("/login",controller.login)

router.post("/products/addProduct",[Auth,ServiceAdmin,upload.single("productPhoto")],controller.addProduct);
router.delete("/products/deleteProduct/:productId",[Auth,ServiceAdmin],controller.deleteProduct);
router.put("/products/editProduct/:productId",[Auth,ServiceAdmin],controller.editProduct);
router.get("/products/getProducts",[Auth,ServiceAdmin],controller.getProducts);


module.exports = router;