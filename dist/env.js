"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_LIFETIME = exports.JWT_SECRET = exports.MONGO_URI = exports.PORT = void 0;
exports.PORT = process.env.PORT ? +process.env.PORT : 3030;
exports.MONGO_URI = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost:27017/RentalApplication";
exports.JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : "any";
exports.JWT_LIFETIME = process.env.JWT_LIFETIME ? +process.env.JWT_LIFETIME : 30 * 60 * 1000;
//process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost:27017/RentalApplication"
//# sourceMappingURL=env.js.map