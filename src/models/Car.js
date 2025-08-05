"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CarSchema = new mongoose_1.Schema({
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [String],
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
            validator: (colors) => colors.length > 0,
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
    capacity: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    engineOutput: {
        type: Number,
        required: true,
        min: 50,
        max: 1500
    },
    maxSpeed: {
        type: Number,
        required: true,
        min: 80,
        max: 400
    },
    advanceFeatures: {
        type: [String],
        default: []
    },
    singleChargeRange: {
        type: Number,
        min: 0,
        max: 1000,
        validate: {
            validator: function (value) {
                // Only required for electric vehicles
                return this.fuelType !== 'Electric' || value !== undefined;
            },
            message: 'Single charge range is required for electric vehicles'
        }
    },
    reviews: [{
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
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
CarSchema.virtual('averageRating').get(function () {
    if (!this.reviews || this.reviews.length === 0)
        return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / this.reviews.length;
});
// Indexes
CarSchema.index({ brand: 1, model: 1 });
CarSchema.index({ carRegistrationNumber: 1 }, { unique: true });
CarSchema.index({ 'reviews.rating': 1 });
const Car = (0, mongoose_1.model)('Car', CarSchema);
exports.default = Car;
