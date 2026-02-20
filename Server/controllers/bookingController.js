import Booking from "../models/Booking.js";
import Show from "../models/Show.js"
import { inngest } from "../inngest/index.js";
import crypto from 'crypto'

const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId)
        if (!showData) return false;
        const occupiedSeats = showData.occupiedSeats;
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat])
        return !isAnySeatTaken;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { showId, selectedSeats } = req.body;

        const isAvailable = await checkSeatsAvailability(showId, selectedSeats)

        if (!isAvailable) {
            return res.json({ success: false, message: "Selected Seats are not available." })
        }

        const showData = await Show.findById(showId).populate('movie');

        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');
        await showData.save();

        await inngest.send({
            name: "app/checkpayment",
            data: {
                bookingId: booking._id.toString()
            }
        })

        res.json({ success: true, message: 'Booked successfully', amount: booking.amount, bookingId: booking._id })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        const showData = await Show.findById(showId);
        const bookedSeats = Object.keys(showData.occupiedSeats)
        res.json({ success: true, bookedSeats })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { transaction_uuid, amount } = req.body
        const { userId } = req.auth()

        const booking = await Booking.findOne({ user: userId, amount }).sort({ createdAt: -1 })

        if (booking) {
            booking.isPaid = true
            await booking.save()
            res.json({ success: true, message: 'Payment verified' })
        } else {
            res.json({ success: false, message: 'Booking not found' })
        }
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const initiateEsewaPayment = async (req, res) => {
    try {
        const { amount, bookingId } = req.body
        const transaction_uuid = bookingId
        const product_code = "EPAYTEST"
        const secret_key = "8gBm/:&EnhH.1/q"
        const total_amount = Math.round(amount)

        const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`
        const signature = crypto.createHmac('sha256', secret_key).update(message).digest('base64')

        res.json({
            success: true,
            amount: total_amount,
            transaction_uuid,
            product_code,
            signature
        })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}