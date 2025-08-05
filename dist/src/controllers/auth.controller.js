"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../env");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, divingLicenseNumber, phoneNumber, gender } = req.body;
    let avatarFilename = 'male.png';
    if (gender == 'female')
        avatarFilename = 'female.jpg';
    // hash the password
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
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
        yield user.save();
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
});
exports.registerUser = registerUser;
// success: false,
//     message: 'Invalid car ID format'
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Create and assign a JWT
    const userId = res.locals.userId || '';
    console.log(userId);
    console.log(env_1.JWT_SECRET);
    console.log(env_1.JWT_LIFETIME);
    const token = jsonwebtoken_1.default.sign({ id: userId }, env_1.JWT_SECRET, {
        expiresIn: env_1.JWT_LIFETIME
    });
    let user = yield User_1.default.findById(userId).select('-password');
    ;
    res.header('Authorization', `Bearer ${token}`).send({
        success: true,
        message: 'You have successfully logged in.',
        user,
        token
    });
});
exports.loginUser = loginUser;
//# sourceMappingURL=auth.controller.js.map