import express from 'express';
import { createBooking, getOccupiedSeats, verifyPayment, initiateEsewaPayment } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);
bookingRouter.post('/verify-payment', verifyPayment);
bookingRouter.post('/esewa-initiate', initiateEsewaPayment);

export default bookingRouter;
