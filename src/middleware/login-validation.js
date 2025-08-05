"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = void 0;
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
// zod Validations
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().min(6).email(),
    password: zod_1.z.string().min(6)
}).strict();
const loginValidation = async (req, res, next) => {
    // validating using zod
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
        res.status(400).send({
            success: false,
            message: parsed.error
        });
    else {
        const { email: emailFromBody, password: passwordFromBody } = req.body;
        // checking if the email exists
        const user = await User_1.default.findOne({ email: emailFromBody });
        if (user) {
            // checking if the password is correct
            const validPass = await bcryptjs_1.default.compare(passwordFromBody, user.password);
            if (validPass) {
                res.locals.userId = user._id;
                next();
            }
            else
                res.status(400).send({
                    success: false,
                    message: 'Invalid Email or Password!!!'
                });
        }
        else
            res.status(400).send({
                success: false,
                message: 'Invalid Email or Password!!!'
            });
    }
};
exports.loginValidation = loginValidation;
