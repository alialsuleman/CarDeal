"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvatar = exports.addAvatar = exports.updateUserMethod = exports.updateUserHandler = void 0;
const User_1 = __importDefault(require("../models/User"));
const notification_controller_1 = require("./notification.controller");
const updateUserHandler = async (req, res) => {
    try {
        const userId = res.locals.userId;
        const updateData = req.body;
        const updatedUser = await (0, exports.updateUserMethod)(userId, updateData);
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
};
exports.updateUserHandler = updateUserHandler;
const updateUserMethod = async (userId, updateData) => {
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
    const updatedUser = await User_1.default.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true });
    return updatedUser;
};
exports.updateUserMethod = updateUserMethod;
const addAvatar = async (req, res) => {
    const userId = res.locals.userId || '';
    console.log(userId);
    // @ts-ignore
    const { filename, path } = req.file;
    const updatedUser = await User_1.default.findByIdAndUpdate(userId, { $set: { avatarFilename: `/avatars/${filename}` } }, { new: true, runValidators: true });
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
};
exports.addAvatar = addAvatar;
const getAvatar = async (req, res) => {
    const userId = req.body.userId || '';
    const user = await User_1.default.findById(userId);
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
};
exports.getAvatar = getAvatar;
