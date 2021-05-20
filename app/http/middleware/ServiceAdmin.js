const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {

    try {
        const role = req.user.role;

        if (role === "service") {
            next();
        } else {
            return res.status(401).send("You're not allowed! - شما دسترسی ندارید !");
        }
    } catch (err) {
        console.log(err.message);
        return res.status(401).send("You're not allowed! - شما دسترسی ندارید !");
    }


}