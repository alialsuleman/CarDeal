"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_token_1 = require("../middleware/verify-token");
const rental_controller_1 = require("../controllers/rental.controller");
const asyncWrapper_1 = require("../middleware/asyncWrapper");
const router = express_1.default.Router();
// Protected route - requires authentication
router.post('/add', verify_token_1.verify, rental_controller_1.createRental);
router.get('/getUserRentals', verify_token_1.verify, (0, asyncWrapper_1.asyncWrapper)(rental_controller_1.getUserRentals));
router.get('/getOwnerRentals', verify_token_1.verify, (0, asyncWrapper_1.asyncWrapper)(rental_controller_1.getOwnerRentals));
router.post('/getCarRentalsForowner', verify_token_1.verify, (0, asyncWrapper_1.asyncWrapper)(rental_controller_1.getCarRentals));
router.post('/completeRental', verify_token_1.verify, (0, asyncWrapper_1.asyncWrapper)(rental_controller_1.completeRental));
exports.default = router;
// getUserRentals
// getOwnerRentals
// getCarRentals
// completeRental
