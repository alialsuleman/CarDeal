"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleController = void 0;
// sample controller - it will be executed after the JWT validation.
const sampleController = async (req, res) => {
    res.status(200).json({ data: 'This is only accessible using JWT', user: res.locals.user });
};
exports.sampleController = sampleController;
