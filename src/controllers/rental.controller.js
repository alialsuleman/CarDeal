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
exports.completeRental = exports.getCarRentals = exports.getOwnerRentals = exports.getUserRentals = exports.getAvailableCars = exports.isCarAvailable = exports.createRental = void 0;
const rental_1 = __importDefault(require("../models/rental"));
const Car_1 = __importDefault(require("../models/Car"));
const mongoose_1 = require("mongoose");
const notification_controller_1 = require("./notification.controller");
const createRental = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, mongoose_1.isValidObjectId)(req.body.carId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid car ID format'
            });
        }
        const { carId, startDate, endDate } = req.body;
        const userId = res.locals.userId;
        const car = yield Car_1.default.findById(carId);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        if (start < today) {
            return res.status(400).json({
                success: false,
                message: 'Start date must be in the future'
            });
        }
        if (end < start) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }
        const ok = yield (0, exports.isCarAvailable)(carId, startDate, endDate);
        console.log(ok);
        if (!ok) {
            return res.status(409).json({
                success: false,
                message: 'Car is already rented for the selected dates'
            });
        }
        const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = durationDays * car.price;
        const newRental = new rental_1.default({
            user: userId,
            owner: car.owner,
            car: carId,
            startDate: start,
            endDate: end,
            totalPrice,
            status: 'pending'
        });
        yield newRental.save();
        // 7. Prepare response
        const response = {
            success: true,
            message: 'Rental created successfully',
            data: {
                rentalId: newRental._id,
                car: car.brand + ' ' + car.model,
                startDate: newRental.startDate,
                endDate: newRental.endDate,
                durationDays,
                totalPrice: newRental.totalPrice,
                status: newRental.status
            }
        };
        (0, notification_controller_1.createNotification)({
            userId: userId,
            msg: `The vehicle -${car.brand} ${car.model} - reservation process was completed successfully.`
        });
        (0, notification_controller_1.createNotification)({
            userId: car.owner.toString(),
            msg: `your vehicle -${car.brand} ${car.model} - reservation process was completed successfully.`
        });
        res.status(201).json(response);
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create rental'
        });
    }
});
exports.createRental = createRental;
const isCarAvailable = (carId, startDate2, endDate2) => __awaiter(void 0, void 0, void 0, function* () {
    const conditions = {
        car: carId,
        // $or: [
        //     { startDate: { $gte: startDate2, $lte: endDate2 } },
        //     { endDate: { $gte: startDate2, $lte: endDate2 } },
        //     { startDate: { $lte: startDate2 }, endDate: { $gte: endDate2 } },
        // ]
    };
    const existingRental = yield rental_1.default.find(conditions);
    let x = false;
    for (let elment of existingRental) {
        //console.log(new Date(startDate2), endDate2, new Date(elment.startDate), elment.endDate);
        // console.log(new Date(startDate2).toISOString() === new Date(elment.startDate).toISOString());
        if (new Date(elment.startDate).toISOString() >= new Date(startDate2).toISOString() &&
            new Date(elment.startDate).toISOString() <= new Date(endDate2).toISOString())
            x = true;
        if (new Date(elment.endDate).toISOString() >= new Date(startDate2).toISOString() &&
            new Date(elment.endDate).toISOString() <= new Date(endDate2).toISOString())
            x = true;
        if (new Date(startDate2).toISOString() >= new Date(elment.startDate).toISOString() &&
            new Date(startDate2).toISOString() <= new Date(elment.endDate).toISOString())
            x = true;
        if (new Date(endDate2).toISOString() >= new Date(elment.startDate).toISOString() &&
            new Date(endDate2).toISOString() <= new Date(elment.endDate).toISOString())
            x = true;
    }
    console.log(existingRental);
    return !x;
});
exports.isCarAvailable = isCarAvailable;
const getAvailableCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.body;
        const allCars = yield Car_1.default.find({ purpose: "rent" }).select('_id').lean();
        const availableCars = [];
        for (const car of allCars) {
            const isAvailable = yield (0, exports.isCarAvailable)(car._id, startDate, endDate);
            if (isAvailable) {
                availableCars.push(car._id);
            }
        }
        res.status(200).send({
            success: true,
            message: '....',
            count: availableCars.length,
            availableCars
        });
    }
    catch (error) {
        console.error('Error finding available cars:', error);
        throw new Error('Failed to retrieve available cars');
    }
});
exports.getAvailableCars = getAvailableCars;
const getUserRentals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required'
        });
    }
    const rentals = yield rental_1.default.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json({
        success: true,
        count: rentals.length,
        data: rentals
    });
});
exports.getUserRentals = getUserRentals;
const getOwnerRentals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ownerId = res.locals.userId;
    if (!ownerId) {
        return res.status(400).json({
            success: false,
            message: 'Owner ID is required'
        });
    }
    const rentals = yield rental_1.default.find({ owner: ownerId })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json({
        success: true,
        count: rentals.length,
        data: rentals
    });
});
exports.getOwnerRentals = getOwnerRentals;
const getCarRentals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const carId = req.body.carId;
    const ownerId = res.locals.userId;
    ;
    if (!carId) {
        return res.status(400).json({
            success: false,
            message: 'CarId ID is required'
        });
    }
    const rentals = yield rental_1.default.find({ car: carId, owner: ownerId })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json({
        success: true,
        count: rentals.length,
        data: rentals
    });
});
exports.getCarRentals = getCarRentals;
const completeRental = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rentalId } = req.body;
    if (!(0, mongoose_1.isValidObjectId)(rentalId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid rental ID'
        });
    }
    const updatedRental = yield rental_1.default.findByIdAndUpdate(rentalId, {
        $set: {
            status: 'completed',
            updatedAt: new Date()
        }
    }, { new: true });
    if (updatedRental) {
        (0, notification_controller_1.createNotification)({
            userId: updatedRental.user.toString(),
            msg: `The payment process for reserving the vehicle  -${updatedRental.car} - has been completed.`
        });
        (0, notification_controller_1.createNotification)({
            userId: updatedRental.owner.toString(),
            msg: `The payment process for reserving your vehicle  -$${updatedRental.car}- has been completed.`
        });
    }
    res.status(200).json({
        success: true,
        message: 'Rental marked as completed',
        data: updatedRental
    });
});
exports.completeRental = completeRental;
//# sourceMappingURL=rental.controller.js.map