"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
const asyncWrapper_1 = require("../middleware/asyncWrapper");
const verify_token_1 = require("../middleware/verify-token");
const car_controller_1 = require("../controllers/car.controller");
const rental_controller_1 = require("../controllers/rental.controller");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../public/uploads');
        require('fs').mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// // تصفية الملفات لاستقبال الصور فقط
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed!'), false);
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});
// , 
const uploadd = (0, multer_1.default)().none();
router.post('/addreview', verify_token_1.verify, (0, asyncWrapper_1.asyncWrapper)(car_controller_1.addReview));
router.post('/delete', verify_token_1.verify, (0, asyncWrapper_1.asyncWrapper)(car_controller_1.deleteCar));
router.post('/byid', (0, asyncWrapper_1.asyncWrapper)(car_controller_1.getCarById));
router.post('/getavailablecarsforrental', (0, asyncWrapper_1.asyncWrapper)(rental_controller_1.getAvailableCars));
router.post('/add', verify_token_1.verify, exports.upload.array('images', 5), (0, asyncWrapper_1.asyncWrapper)(car_controller_1.addCar)); // tested
router.post('/allrentalcar', (0, asyncWrapper_1.asyncWrapper)(car_controller_1.getRentalCarListings));
router.post('/Allcarsforsale', (0, asyncWrapper_1.asyncWrapper)(car_controller_1.getCarForSaleListings));
router.get('/getownercars', verify_token_1.verify, (0, asyncWrapper_1.asyncWrapper)(car_controller_1.getOwnerCars)); //tested
// todo
// 
exports.default = router;
