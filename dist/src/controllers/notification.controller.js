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
exports.getUserNotifications = exports.createNotification = void 0;
const notification_1 = __importDefault(require("../models/notification"));
const createNotification = (notificationData) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = new notification_1.default(notificationData);
    yield notification.save();
    return notification;
});
exports.createNotification = createNotification;
const getUserNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    const notifications = yield notification_1.default.find({ userId }).sort({ date: -1 });
    const response = {
        success: true,
        notifications
    };
    res.status(200).json(response);
    for (let x of notifications) {
        markAsRead(x._id);
    }
});
exports.getUserNotifications = getUserNotifications;
function markAsRead(notificationId) {
    return __awaiter(this, void 0, void 0, function* () {
        const notification = yield notification_1.default.findByIdAndUpdate(notificationId, { read: true }, { new: true });
    });
}
//# sourceMappingURL=notification.controller.js.map