"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_token_1 = require("../middleware/verify-token");
const asyncWrapper_1 = require("../middleware/asyncWrapper");
const car_controller_1 = require("../controllers/car.controller");
const router = express_1.default.Router();
// Protected route - requires authentication
router.post('/purchaseCar', verify_token_1.verify, (0, asyncWrapper_1.asyncWrapper)(car_controller_1.purchaseCar));
router.get('/getmysoldcars', verify_token_1.verify, (0, asyncWrapper_1.asyncWrapper)(car_controller_1.getSoldCars));
router.get('/getmypurchases', verify_token_1.verify, (0, asyncWrapper_1.asyncWrapper)(car_controller_1.getUserPurchases));
exports.default = router;
// getUserRentals
// getOwnerRentals
// getCarRentals
// completeRental
//# sourceMappingURL=buy.route.js.map