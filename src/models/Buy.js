"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buy = void 0;
const mongoose_1 = require("mongoose");
const BuySchema = new mongoose_1.Schema({
    car: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Car', required: true },
    buyer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    purchaseDate: { type: Date, default: Date.now },
});
exports.Buy = (0, mongoose_1.model)('Buy', BuySchema);
