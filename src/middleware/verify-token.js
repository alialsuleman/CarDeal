"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../env");
const verify = (req, res, next) => {
    const auth = req.header('Authorization');
    if (!auth)
        return res.status(401).send({
            success: false,
            message: 'Access denied!!!'
        });
    let token = auth.split(' ')[1];
    if (!token)
        return res.status(401).send({
            success: false,
            message: 'Access denied!!!'
        });
    try {
        const verify = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        res.locals.user = verify;
        res.locals.userId = res.locals.user.id;
        console.log("toke verfied and the userid is : " + res.locals.userId);
        next();
    }
    catch (err) {
        return res.status(400).send({
            success: false,
            message: 'Invalid token!!!',
        });
    }
};
exports.verify = verify;
