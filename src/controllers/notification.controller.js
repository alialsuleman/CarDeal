"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserNotifications = exports.createNotification = void 0;
const notification_1 = __importDefault(require("../models/notification"));
const createNotification = async (notificationData) => {
    const notification = new notification_1.default(notificationData);
    await notification.save();
    return notification;
};
exports.createNotification = createNotification;
const getUserNotifications = async (req, res) => {
    const userId = res.locals.userId;
    const notifications = await notification_1.default.find({ userId }).sort({ date: -1 });
    const response = {
        success: true,
        notifications
    };
    res.status(200).json(response);
    for (let x of notifications) {
        markAsRead(x._id);
    }
};
exports.getUserNotifications = getUserNotifications;
async function markAsRead(notificationId) {
    const notification = await notification_1.default.findByIdAndUpdate(notificationId, { read: true }, { new: true });
}
