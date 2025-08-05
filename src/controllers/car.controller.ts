import { Request, Response } from 'express';

import { isValidObjectId } from 'mongoose';
import Car from '../models/Car';
import { Buy } from '../models/Buy';


interface CarRequest {
    owner: string;
    brand: string;
    model: string;
    price: number;
    location: string;
    year: number;
    carRegistrationNumber: string;
    colors: string | string[];
    fuelType: string;
    capacity: number;
    engineOutput: number;
    maxSpeed: number;
    advanceFeatures?: string[];
    singleChargeRange?: number;
    reviews?: Array<{
        user: string;
        rating: number;
        comment?: string;
    }>;
    description?: string;
}
export const addCar = async (req: Request, res: Response) => {
    try {
        const ownerId = res.locals.userId;

        if (!isValidObjectId(ownerId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid owner ID format'
            });
        }
        console.log(req.body);
        const images = Array.isArray(req.files)
            ? req.files.map((file: Express.Multer.File) => ({
                filename: file.filename,
                path: `/uploads/${file.filename}`
            }))
            : [];

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
            images: images,
            purpose: req.body.purpose
        };

        if (carData.fuelType === 'Electric' && !carData.singleChargeRange) {
            return res.status(400).json({
                success: false,
                message: 'Single charge range is required for electric vehicles'
            });
        }

        const newCar = new Car(carData);
        await newCar.save();

        const responseCar = newCar.toObject();
        delete responseCar.__v;
        delete responseCar.reviews;

        res.status(201).json({
            success: true,
            message: 'Car added successfully with images',
            data: responseCar
        });

    } catch (error: any) {

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
            const messages = Object.values(error.errors).map((err: any) => err.message);
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


export const deleteCar = async (req: Request, res: Response) => {
    try {


        const ownerId = res.locals.userId;



        const carId = req.body._id;
        if (!isValidObjectId(carId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid car ID format'
            });
        }


        const car = await Car.findById(carId);
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


        await Car.deleteOne({ _id: carId });


        res.status(200).json({
            success: true,
            message: 'Car deleted successfully',
            deletedCarId: carId
        });

    } catch (error: any) {

        res.status(500).json({
            success: false,
            message: 'Failed to delete car'

        });
    }
};






interface ReviewRequest {
    carId: string;
    rating: number;
    comment?: string;
}

export const addReview = async (req: Request<{ id: string }, {}, ReviewRequest>, res: Response) => {
    try {

        const carId = req.body.carId;
        const userId = res.locals.userId;
        if (!isValidObjectId(carId)) {
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


        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }


        const existingReview = car.reviews.find(
            review => review.user.toString() === userId
        );

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

    } catch (error: any) {

        res.status(500).json({
            success: false,
            message: 'Failed to add review'
        });
    }
};



export const getCarById = async (req: Request, res: Response) => {
    try {

        const carId = req.body.id;
        if (!isValidObjectId(carId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid car ID format'
            });
        }


        const car = await Car.findById(carId)
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

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch car details',

        });
    }
};



interface CarListing {
    _id: string;
    brand: string;
    model: string;
    price: number;
    location: string;
    year: number;
    capacity: number;

}

export const getRentalCarListings = async (req: Request, res: Response) => {
    try {

        const filter: any = {};
        filter.purpose = 'rent';
        if (req.body.brand) {
            filter.brand = req.body.brand;
        }


        const cars = await Car.find(filter)
            .select('images brand model price location year capacity reviews')
            .lean();

        console.log(cars);
        const listings: CarListing[] = cars.map(car => ({
            _id: car._id,
            brand: car.brand,
            images: car.images || [],
            model: car.model,
            price: car.price,
            location: car.location as string,
            year: car.year,
            capacity: car.capacity

        }));


        res.status(200).json({
            success: true,
            count: listings.length,
            data: listings
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch car listings'
        });
    }
};

export const getCarForSaleListings = async (req: Request, res: Response) => {
    try {

        const filter: any = {};
        filter.purpose = 'sale';
        if (req.body.brand) {
            filter.brand = req.body.brand;
        }


        const cars = await Car.find(filter)
            .select('images brand model price location year capacity reviews')
            .lean();

        console.log(cars);
        const listings: CarListing[] = cars.map(car => ({
            _id: car._id,
            brand: car.brand,
            images: car.images || [],
            model: car.model,
            price: car.price,
            location: car.location as string,
            year: car.year,
            capacity: car.capacity

        }));


        res.status(200).json({
            success: true,
            count: listings.length,
            data: listings
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch car listings'
        });
    }
};


export const purchaseCar = async (req: Request, res: Response) => {
    const { carId } = req.body;
    const buyerId = res.locals.userId;
    try {
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        const newPurchase = new Buy({
            car: carId,
            buyer: buyerId
        });

        await newPurchase.save();

        await Car.findByIdAndUpdate(carId, { status: 'sold' });

        res.status(201).json({
            success: true,
            data: newPurchase
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
export const getSoldCars = async (req: Request, res: Response) => {

    const sellerId = res.locals.userId;
    try {
        const purchases = await Buy.find()
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
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

export const getUserPurchases = async (req: Request, res: Response) => {
    const userId = res.locals.userId;

    try {
        const userPurchases = await Buy.find({ buyer: userId })
            .populate('car', 'brand model priceAtPurchase');

        res.status(200).json({
            success: true,
            data: userPurchases
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
export const getOwnerCars = async (req: Request, res: Response) => {
    const ownerId = res.locals.userId;

    try {
        const Cars = await Car.find({
            owner: ownerId,
        });

        res.status(200).json({
            success: true,
            data: Cars
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
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