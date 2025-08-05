"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageModel = void 0;
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    path: {
        type: String,
        required: true,
        trim: true
    },
    filename: {
        type: String,
        required: true,
        trim: true
    },
    cardId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
exports.ImageModel = (0, mongoose_1.model)('Image', imageSchema);
