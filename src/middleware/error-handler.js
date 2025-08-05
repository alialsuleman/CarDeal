"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const errorHandlerMiddleware = async (err, req, res, next) => {
    console.log(err);
    return res.status(500).json({
        success: false,
        message: 'Something went wrong, please try again'
    });
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
