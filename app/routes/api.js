const router = require("express").Router();
const ServicesRoutes = require("./ServicesAdminRoutes");
const SuperAdminRoutes = require("./SuperAdminRoutes");
const UserRoutes = require("./UserRoutes");

router.use("/services",ServicesRoutes);
router.use("/services",SuperAdminRoutes);
router.use("/user",UserRoutes);

module.exports = router;