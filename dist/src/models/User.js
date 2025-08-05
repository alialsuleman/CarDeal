"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    email: {
        type: String,
        required: true,
        max: 255,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    divingLicenseNumber: {
        type: String,
        required: true
    },
    avatarFilename: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    },
    role: {
        type: String,
        enum: ['user', 'trader'],
        default: 'user'
    },
    cardFullName: {
        type: String,
        required: false
    },
    cardEmail: {
        type: String,
        required: false
    },
    cardNumber: {
        type: String,
        required: false
    },
    expiryDate: {
        type: String,
        required: false
    },
    cvc: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    zipCode: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now()
    }
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
//# sourceMappingURL=User.js.map