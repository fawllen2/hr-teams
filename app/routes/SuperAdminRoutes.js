const router = require("express").Router();
const controller = require("../http/controller/ServicesController");
const Auth = require("../http/middleware/Auth");


router.get("/",controller.getList);
router.get("/:id",controller.getOne);
router.post("/",controller.create);
router.put("/:id",controller.update);
router.delete("/:id",controller.delete);


module.exports = router;