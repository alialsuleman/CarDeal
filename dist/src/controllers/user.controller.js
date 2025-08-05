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
exports.getAvatar = exports.addAvatar = exports.updateUserMethod = exports.updateUserHandler = void 0;
const User_1 = __importDefault(require("../models/User"));
const notification_controller_1 = require("./notification.controller");
const updateUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.userId;
        const updateData = req.body;
        const updatedUser = yield (0, exports.updateUserMethod)(userId, updateData);
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "user is not found ! "
            });
        }
        (0, notification_controller_1.createNotification)({
            userId: userId,
            msg: "Payment information has been successfully submitted."
        });
        res.status(200).json({
            success: true,
            message: "user is updated !",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "something wrong happen !"
        });
    }
});
exports.updateUserHandler = updateUserHandler;
const updateUserMethod = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    if (updateData.email) {
        delete updateData.email;
    }
    if (updateData.password) {
        delete updateData.password;
    }
    if (updateData.gender) {
        delete updateData.gender;
    }
    if (updateData.cardFullName) {
        updateData.role = 'trader';
    }
    const updatedUser = yield User_1.default.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true });
    return updatedUser;
});
exports.updateUserMethod = updateUserMethod;
const addAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId || '';
    console.log(userId);
    // @ts-ignore
    const { filename, path } = req.file;
    const updatedUser = yield User_1.default.findByIdAndUpdate(userId, { $set: { avatarFilename: `/avatars/${filename}` } }, { new: true, runValidators: true });
    if (!updatedUser) {
        return res.status(404).json({
            success: false,
            message: "user is not found ! "
        });
    }
    else
        res.status(200).json({
            success: true,
            message: "avatar is updated !"
        });
});
exports.addAvatar = addAvatar;
const getAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId || '';
    const user = yield User_1.default.findById(userId);
    console.log(userId);
    // console.log(user);
    if (user) {
        console.log("find it ");
        const imagePath = user.avatarFilename;
        console.log("path " + imagePath);
        console.log(imagePath);
        res.status(200).json({
            success: true,
            imagePath: imagePath
        });
    }
    else
        res.send({
            success: false,
            message: 'something wrong!'
        });
});
exports.getAvatar = getAvatar;
//# sourceMappingURL=user.controller.js.map