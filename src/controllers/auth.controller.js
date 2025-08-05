"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../env");
const registerUser = async (req, res) => {
    const { name, email, password, divingLicenseNumber, phoneNumber, gender } = req.body;
    let avatarFilename = 'male.png';
    if (gender == 'female')
        avatarFilename = 'female.jpg';
    // hash the password
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(password, salt);
    // store the user in db
    const user = new User_1.default({
        name: name,
        email: email,
        password: hashedPassword,
        divingLicenseNumber,
        phoneNumber,
        gender,
        avatarFilename
    });
    try {
        await user.save();
        res.send({
            success: true,
            message: 'user is created !',
            user: user._id
        });
    }
    catch (err) {
        res.status(400).send({
            success: false,
            message: err
        });
    }
};
exports.registerUser = registerUser;
// success: false,
//     message: 'Invalid car ID format'
const loginUser = async (req, res) => {
    // Create and assign a JWT
    const userId = res.locals.userId || '';
    console.log(userId);
    console.log(env_1.JWT_SECRET);
    console.log(env_1.JWT_LIFETIME);
    const token = jsonwebtoken_1.default.sign({ id: userId }, env_1.JWT_SECRET, {
        expiresIn: env_1.JWT_LIFETIME
    });
    let user = await User_1.default.findById(userId).select('-password');
    ;
    res.header('Authorization', `Bearer ${token}`).send({
        success: true,
        message: 'You have successfully logged in.',
        user,
        token
    });
};
exports.loginUser = loginUser;
