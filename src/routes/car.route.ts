import { Router } from "express";
const router = Router();


import { asyncWrapper } from "../middleware/asyncWrapper";
import { verify } from "../middleware/verify-token";
import { addCar, addReview, deleteCar, getCarById, getCarForSaleListings, getOwnerCars, getRentalCarListings } from "../controllers/car.controller";
import { getAvailableCars } from "../controllers/rental.controller";


import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../public/uploads');

        require('fs').mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// // تصفية الملفات لاستقبال الصور فقط
const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});
// , 
const uploadd = multer().none();

router.post('/addreview', verify, asyncWrapper(addReview));
router.post('/delete', verify, asyncWrapper(deleteCar));
router.post('/byid', asyncWrapper(getCarById));
router.post('/getavailablecarsforrental', asyncWrapper(getAvailableCars));

router.post('/add', verify, upload.array('images', 5), asyncWrapper(addCar)); // tested
router.post('/allrentalcar', asyncWrapper(getRentalCarListings));
router.post('/Allcarsforsale', asyncWrapper(getCarForSaleListings));
router.get('/getownercars', verify, asyncWrapper(getOwnerCars)); //tested

// todo


// 
export default router