const express = require("express");
const morgan = require("morgan");
const cors = require(("cors"));
require("express-async-errors");
require("winston-mongodb")
const mongoose = require("mongoose");
const Error = require("./http/middleware/Errors");
const winston = require("winston");
const api = require("./routes/api");

const app = express();

class Application {

    constructor() {
        this.setupExpressServer();
        this.setupMongoose();
        this.setupRoutesAndMidwares();
        this.setupConfigs();
    }

    setupRoutesAndMidwares() {
        //built-in middleware
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static("public"));
        app.use(express.static("uploads"));
        app.use(morgan("tiny"));

        //third-party middleware
        app.use(cors());

        

        //routes
        app.use("/api",api);

        app.use(Error);
    }

    setupConfigs() {
        winston.add(new winston.transports.File({ filename: "error-log.log" }));
        winston.add(new winston.transports.MongoDB({
            db: "mongodb://localhost:27017/nodesite"
        }));

        process.on('uncaughtException', (err) => {
            console.log(err);
            winston.error(err.message);
        });
        process.on('unhandledRejection', (err) => {
            console.log(err);
            winston.error(err.message);
        });

        //views
        app.set("view engine", "pug");
        app.set("views", "./views");//default
    }

    setupMongoose() {
        mongoose.connect("mongodb://localhost:27017/nodesite", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log("db connected");
        }).catch((err) => {
            console.log("db not connected", err);
        });
    }

    setupExpressServer() {
        const port = process.env.PORT || 3000;
        app.listen(port, (err) => {
            if (err) console.log(err);
            else console.log(`server listen on port ${port}`);
        });
    }
}


module.exports=Application;






