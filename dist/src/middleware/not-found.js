"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (_, res) => res.status(404).send({
    success: false,
    message: 'Route does not exist!'
});
exports.notFound = notFound;
//# sourceMappingURL=not-found.js.map