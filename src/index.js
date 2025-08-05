"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const connect_1 = require("./db/connect");
const not_found_1 = require("./middleware/not-found");
const error_handler_1 = require("./middleware/error-handler");
const user_route_1 = __importDefault(require("./routes/user.route"));
const protected_route_1 = __importDefault(require("./routes/protected.route"));
const img_route_1 = __importDefault(require("./routes/img.route"));
const car_route_1 = __importDefault(require("./routes/car.route"));
const rental_route_1 = __importDefault(require("./routes/rental.route"));
const buy_route_1 = __importDefault(require("./routes/buy.route"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./env");
const app = (0, express_1.default)();
app.use(express_1.default.json()); // للتعامل مع JSON
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
const port = process.env.PORT || 3000;
// middleware
app.use(express_1.default.static('public')); //http://localhost:3000/uploads/1754137588861-750925608.jpeg
// Routes
//app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api/user', user_route_1.default);
app.use('/api/protected', protected_route_1.default); // just for example
app.use('/api/car', car_route_1.default);
app.use('/api/img', img_route_1.default);
app.use('/api/rental', rental_route_1.default);
app.use('/api/buy', buy_route_1.default);
app.use(not_found_1.notFound);
app.use(error_handler_1.errorHandlerMiddleware);
console.log(env_1.MONGO_URI);
const start = async () => {
    try {
        await (0, connect_1.connectDB)(env_1.MONGO_URI);
        app.listen(port, () => console.log(`Server listening on port ${port}...`));
    }
    catch (err) {
        console.log(err);
    }
};
start();


//{
//     "version": 2,
//     "builds": [
//         {
//             "src": "src/index.js",
//             "use": "@vercel/node"
//         },
//         {
//             "src": "public/**",
//             "use": "@vercel/static"
//         }
//     ],
//     "routes": [
//         {
//             "src": "/api/(.*)",
//             "dest": "src/index.js"
//         },
//         {
//             "src": "/public/(.*)",
//             "dest": "public/$1"
//         },
//         {
//             "src": "/(.*)",
//             "dest": "public/$1",
//             "continue": true
//         },
//         {
//             "src": "/(.*)",
//             "dest": "src/index.js"
//         }
//     ]
// }
