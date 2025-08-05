import { Schema, model, Document, Types } from "mongoose";

interface IReview {
    user: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

interface ICarImage {
    filename: string;
    path: string;
}

interface ICar extends Document {
    owner: Types.ObjectId;
    images: ICarImage[];
    brand: string;
    model: string;
    price: number;
    location: String;
    year: number;
    carRegistrationNumber: string;
    colors: string[];
    fuelType: string;
    capacity: number;
    engineOutput: number; // Added (in horsepower)
    maxSpeed: number; // Added (in km/h)
    advanceFeatures: string[]; // Added
    singleChargeRange?: number; // Added (for EVs, in km)
    reviews: IReview[]; // Added
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    purpose: 'rent' | 'sale';
}

const CarSchema: Schema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [{
        filename: String,
        path: String
    }],
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 1,
    },
    location: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 1
    },
    carRegistrationNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    colors: {
        type: [String],
        required: true,
        validate: {
            validator: (colors: string[]) => colors.length > 0,
            message: 'At least one color must be specified'
        }
    },
    fuelType: {
        type: String,
        required: true,
        enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'LPG'],
        default: 'Gasoline'
    },
    purpose: {
        type: String,
        required: true,
        enum: ['rent', 'sale', 'sold'],
        default: 'rent'
    },
    capacity: { // Passenger capacity
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    engineOutput: { // Horsepower
        type: Number,
        required: true,
        min: 50,
        max: 1500
    },
    maxSpeed: { // km/h
        type: Number,
        required: true,
        min: 80,
        max: 400
    },
    advanceFeatures: {
        type: [String],
        default: []
    },
    singleChargeRange: { // km (only for EVs)
        type: Number,
        min: 0,
        max: 1000,
        validate: {
            validator: function (this: ICar, value: number) {
                // Only required for electric vehicles
                return this.fuelType !== 'Electric' || value !== undefined;
            },
            message: 'Single charge range is required for electric vehicles'
        }
    },
    reviews: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 500
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    description: {
        type: String,
        trim: true,
        maxlength: 1000
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Calculate average rating (virtual property)
CarSchema.virtual('averageRating').get(function (this: ICar) {
    if (!this.reviews || this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / this.reviews.length;
});

// Indexes
CarSchema.index({ brand: 1, model: 1 });
CarSchema.index({ carRegistrationNumber: 1 }, { unique: true });
CarSchema.index({ 'reviews.rating': 1 });

const Car = model<ICar>('Car', CarSchema);

export default Car;