const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).send("You're not allowed! - شما دسترسی ندارید !");
    }

    try {
        const user = jwt.verify(token, config.get("jwtPVKey"));
        req.user = user;
        next();
    } catch (ex) {
        return res.status(401).send("You're not allowed! - شما دسترسی ندارید !");
    }

}