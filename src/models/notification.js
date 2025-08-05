"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required'],
        index: true
    },
    msg: {
        type: String,
        required: [true, 'Message is required'],
        trim: true
    },
    read: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Notification = (0, mongoose_1.model)('Notification', notificationSchema);
exports.default = Notification;
//# sourceMappingURL=notification.js.map