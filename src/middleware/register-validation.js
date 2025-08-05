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
exports.registerValidation = void 0;
const zod_1 = require("zod");
const User_1 = __importDefault(require("../models/User"));
// zod Validations
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    email: zod_1.z.string().min(6).email(),
    password: zod_1.z.string().min(6),
    divingLicenseNumber: zod_1.z.string().min(3),
    phoneNumber: zod_1.z.string().min(3),
    gender: zod_1.z.string(),
}).strict();
const registerValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // validating using zod
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success)
        res.status(400).send(parsed.error);
    else {
        const { email: emailFromBody } = req.body;
        const divingLicenseNumber = req.body.divingLicenseNumber;
        const phoneNumber = req.body.phoneNumber;
        // checking to see if the user is already registered
        const emailExist = yield User_1.default.findOne({ email: emailFromBody });
        const divingLicenseNumberExist = yield User_1.default.findOne({ divingLicenseNumber: divingLicenseNumber });
        const phoneNumberExist = yield User_1.default.findOne({ phoneNumber: phoneNumber });
        if (emailExist)
            res.status(400).send({
                success: false,
                message: 'Email already exists!!!'
            });
        else if (divingLicenseNumberExist)
            res.status(400).send({
                success: false,
                message: 'divingLicenseNumber already exists!!!'
            });
        else if (phoneNumberExist)
            res.status(400).send({
                success: false,
                message: 'phoneNumber already exists!!!'
            });
        else
            next();
    }
});
exports.registerValidation = registerValidation;
//# sourceMappingURL=register-validation.js.map