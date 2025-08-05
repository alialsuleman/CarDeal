"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_controller_1 = require("../controllers/auth.controller");
const register_validation_1 = require("../middleware/register-validation");
const login_validation_1 = require("../middleware/login-validation");
const asyncWrapper_1 = require("../middleware/asyncWrapper");
const verify_token_1 = require("../middleware/verify-token");
const user_controller_1 = require("../controllers/user.controller");
const multer_1 = __importDefault(require("multer"));
const notification_controller_1 = require("../controllers/notification.controller");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/avatars');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage });
router.post('/register', register_validation_1.registerValidation, (0, asyncWrapper_1.asyncWrapper)(auth_controller_1.registerUser));
router.post('/login', login_validation_1.loginValidation, (0, asyncWrapper_1.asyncWrapper)(auth_controller_1.loginUser));
router.post('/update', verify_token_1.verify, (0, asyncWrapper_1.asyncWrapper)(user_controller_1.updateUserHandler));
router.get('/getUserNotifications', verify_token_1.verify, (0, asyncWrapper_1.asyncWrapper)(notification_controller_1.getUserNotifications));
router.post('/addavatar', verify_token_1.verify, upload.single('image'), (0, asyncWrapper_1.asyncWrapper)(user_controller_1.addAvatar));
router.post('/getuseravatar', (0, asyncWrapper_1.asyncWrapper)(user_controller_1.getAvatar));
exports.default = router;
notification_controller_1.getUserNotifications;
//# sourceMappingURL=user.route.js.map