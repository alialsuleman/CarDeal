import express from 'express'

import { connectDB } from './db/connect'
import { notFound } from './middleware/not-found'
import { errorHandlerMiddleware } from './middleware/error-handler'
import authRoute from './routes/user.route'
import protectedRoutes from './routes/protected.route'
import imgRoutes from './routes/img.route'
import carRoutes from './routes/car.route'
import rentalRoutes from './routes/rental.route'
import buyRoters from './routes/buy.route'

import dotenv from 'dotenv'

import cors from 'cors';
import { verify } from './middleware/verify-token'
import { MONGO_URI } from '../env'
import path from 'path'


const app = express()
app.use(express.json()); // للتعامل مع JSON
app.use(express.urlencoded({ extended: true }));

app.use(cors());
dotenv.config();


const port = process.env.PORT || 3000;


// middleware

app.use(express.static('public')); //http://localhost:3000/uploads/1754137588861-750925608.jpeg
// Routes
//app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/user', authRoute);
app.use('/api/protected', protectedRoutes); // just for example
app.use('/api/car', carRoutes)
app.use('/api/img', imgRoutes)
app.use('/api/rental', rentalRoutes)
app.use('/api/buy', buyRoters)

app.use(notFound)
app.use(errorHandlerMiddleware)

console.log(MONGO_URI);
const start = async () => {
    try {
        await connectDB(MONGO_URI as string);
        app.listen(port, () => console.log(`Server listening on port ${port}...`))
    } catch (err) {
        console.log(err);
    }
}

start()