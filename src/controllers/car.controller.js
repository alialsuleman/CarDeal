"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnerCars = exports.getUserPurchases = exports.getSoldCars = exports.purchaseCar = exports.getCarForSaleListings = exports.getRentalCarListings = exports.getCarById = exports.addReview = exports.deleteCar = exports.addCar = void 0;
const cloudinary_1 = require("cloudinary");
const mongoose_1 = require("mongoose");
const Car_1 = __importDefault(require("../models/Car"));
const Buy_1 = require("../models/Buy");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});
const addCar = async (req, res) => {
    try {
        const ownerId = res.locals.userId;
        if (!(0, mongoose_1.isValidObjectId)(ownerId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid owner ID format'
            });
        }
        console.log(req.body);
        const images = Array.isArray(req.files)
            ? req.files.map((file) => (file))
            : [];
        let imagesUrl = await Promise.all(images.map(async (item) => {
            let result = await cloudinary_1.v2.uploader.upload(item.path, { resource_type: 'image' });
            return result.secure_url;
        }));
        console.log(imagesUrl);
        const carData = {
            owner: ownerId,
            brand: req.body.brand,
            model: req.body.model,
            price: req.body.price,
            location: req.body.location,
            year: req.body.year,
            carRegistrationNumber: req.body.carRegistrationNumber,
            colors: Array.isArray(req.body.colors) ? req.body.colors : [req.body.colors],
            fuelType: req.body.fuelType,
            capacity: req.body.capacity,
            engineOutput: req.body.engineOutput,
            maxSpeed: req.body.maxSpeed,
            advanceFeatures: req.body.advanceFeatures || [],
            singleChargeRange: req.body.singleChargeRange,
            description: req.body.description,
            reviews: [],
            images: imagesUrl,
            purpose: req.body.purpose
        };
        if (carData.fuelType === 'Electric' && !carData.singleChargeRange) {
            return res.status(400).json({
                success: false,
                message: 'Single charge range is required for electric vehicles'
            });
        }
        const newCar = new Car_1.default(carData);
        await newCar.save();
        const responseCar = newCar.toObject();
        delete responseCar.__v;
        delete responseCar.reviews;
        res.status(201).json({
            success: true,
            message: 'Car added successfully with images',
            data: responseCar
        });
    }
    catch (error) {
        // if (req.files) {
        //     req.files.forEach((file: Express.Multer.File) => {
        //         require('fs').unlinkSync(file.path);
        //     });
        // }
        if (error.code === 11000 && error.keyPattern?.carRegistrationNumber) {
            return res.status(400).json({
                success: false,
                message: 'Car registration number already exists'
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        if (error.message === 'Only image files are allowed!') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to add car',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.addCar = addCar;
const deleteCar = async (req, res) => {
    try {
        const ownerId = res.locals.userId;
        const carId = req.body._id;
        if (!(0, mongoose_1.isValidObjectId)(carId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid car ID format'
            });
        }
        const car = await Car_1.default.findById(carId);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }
        if (car.owner.toString() !== ownerId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You can only delete your own cars'
            });
        }
        await Car_1.default.deleteOne({ _id: carId });
        res.status(200).json({
            success: true,
            message: 'Car deleted successfully',
            deletedCarId: carId
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete car'
        });
    }
};
exports.deleteCar = deleteCar;
const addReview = async (req, res) => {
    try {
        const carId = req.body.carId;
        const userId = res.locals.userId;
        if (!(0, mongoose_1.isValidObjectId)(carId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid car ID format'
            });
        }
        if (req.body.rating < 1 || req.body.rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }
        const car = await Car_1.default.findById(carId);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }
        const existingReview = car.reviews.find(review => review.user.toString() === userId);
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this car'
            });
        }
        const newReview = {
            user: userId,
            rating: req.body.rating,
            comment: req.body.comment || '',
            createdAt: new Date()
        };
        car.reviews.push(newReview);
        await car.save();
        const response = {
            success: true,
            message: 'Review added successfully'
        };
        res.status(201).json(response);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add review'
        });
    }
};
exports.addReview = addReview;
const getCarById = async (req, res) => {
    try {
        const carId = req.body.id;
        if (!(0, mongoose_1.isValidObjectId)(carId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid car ID format'
            });
        }
        const car = await Car_1.default.findById(carId)
            .populate('owner', 'name email')
            .populate('reviews.user', 'name')
            .lean();
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }
        let averageRating = 0;
        if (car.reviews && car.reviews.length > 0) {
            const sum = car.reviews.reduce((acc, review) => acc + review.rating, 0);
            averageRating = parseFloat((sum / car.reviews.length).toFixed(1));
        }
        const responseData = {
            ...car,
            averageRating,
            reviewCount: car.reviews?.length || 0
        };
        delete responseData.__v;
        res.status(200).json({
            success: true,
            data: responseData
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch car details',
        });
    }
};
exports.getCarById = getCarById;
const getRentalCarListings = async (req, res) => {
    try {
        const filter = {};
        filter.purpose = 'rent';
        if (req.body.brand) {
            filter.brand = req.body.brand;
        }
        const cars = await Car_1.default.find(filter)
            .select('images brand model price location year capacity reviews')
            .lean();
        console.log(cars);
        const listings = cars.map(car => ({
            _id: car._id,
            brand: car.brand,
            images: car.images || [],
            model: car.model,
            price: car.price,
            location: car.location,
            year: car.year,
            capacity: car.capacity
        }));
        res.status(200).json({
            success: true,
            count: listings.length,
            data: listings
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch car listings'
        });
    }
};
exports.getRentalCarListings = getRentalCarListings;
const getCarForSaleListings = async (req, res) => {
    try {
        const filter = {};
        filter.purpose = 'sale';
        if (req.body.brand) {
            filter.brand = req.body.brand;
        }
        const cars = await Car_1.default.find(filter)
            .select('images brand model price location year capacity reviews')
            .lean();
        console.log(cars);
        const listings = cars.map(car => ({
            _id: car._id,
            brand: car.brand,
            images: car.images || [],
            model: car.model,
            price: car.price,
            location: car.location,
            year: car.year,
            capacity: car.capacity
        }));
        res.status(200).json({
            success: true,
            count: listings.length,
            data: listings
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch car listings'
        });
    }
};
exports.getCarForSaleListings = getCarForSaleListings;
const purchaseCar = async (req, res) => {
    const { carId } = req.body;
    const buyerId = res.locals.userId;
    try {
        const car = await Car_1.default.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        const newPurchase = new Buy_1.Buy({
            car: carId,
            buyer: buyerId
        });
        await newPurchase.save();
        await Car_1.default.findByIdAndUpdate(carId, { status: 'sold' });
        res.status(201).json({
            success: true,
            data: newPurchase
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.purchaseCar = purchaseCar;
const getSoldCars = async (req, res) => {
    const sellerId = res.locals.userId;
    try {
        const purchases = await Buy_1.Buy.find()
            .populate({
            path: 'car',
            match: { owner: sellerId }
        })
            .populate('buyer', 'name email');
        const filteredPurchases = purchases.filter(purchase => purchase.car !== null);
        res.status(200).json({
            success: true,
            data: filteredPurchases
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.getSoldCars = getSoldCars;
const getUserPurchases = async (req, res) => {
    const userId = res.locals.userId;
    try {
        const userPurchases = await Buy_1.Buy.find({ buyer: userId })
            .populate('car', 'brand model priceAtPurchase');
        res.status(200).json({
            success: true,
            data: userPurchases
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getUserPurchases = getUserPurchases;
const getOwnerCars = async (req, res) => {
    const ownerId = res.locals.userId;
    try {
        const Cars = await Car_1.default.find({
            owner: ownerId,
        });
        res.status(200).json({
            success: true,
            data: Cars
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
exports.getOwnerCars = getOwnerCars;
/*

 "brand": "merc",
  "model": "Model 9",
  "price" : 23  ,
  "location":"homs" ,
  "year": 2023,
  "carRegistrationNumber": "TESLA9asd58",
  "colors": ["White", "Black"],
  "fuelType": "Electric",
  "capacity": 5,
  "engineOutput": 450,
  "maxSpeed": 261,
  "advanceFeatures": ["Autopilot", "Premium Interior"],
  "singleChargeRange": 502,
  "description": "Performance edition with dual motors"


*/ 
