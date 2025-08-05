"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncWrapper = void 0;
const asyncWrapper = (asycnFn) => {
    return (req, res, next) => {
        asycnFn(req, res, next).catch((err) => {
            next(err);
        });
    };
};
exports.asyncWrapper = asyncWrapper;
