import Booking from "../models/Booking.js";
import Show from "../models/Show.js"
import User from "../models/User.js"
import { inngest } from "../inngest/index.js";
import crypto from 'crypto'
import { sendBookingEmail } from "../utils/sendEmail.js";

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

        const booking = await Booking.findOne({ user: userId, amount })
            .sort({ createdAt: -1 })
            .populate({ path: 'show', populate: { path: 'movie' } })

        if (!booking) {
            return res.json({ success: false, message: 'Booking not found' })
        }

        booking.isPaid = true
        await booking.save()

        // ⭐ Add CinePoints — 10 points per seat
        const pointsToAdd = booking.bookedSeats.length * 10
        await User.findByIdAndUpdate(userId, {
            $inc: { cinePoints: pointsToAdd },
            $push: {
                pointsHistory: {
                    points: pointsToAdd,
                    reason: `🎬 Booked ${booking.bookedSeats.length} seat(s) for ${booking.show.movie.title}`
                }
            }
        })
        console.log(`Added ${pointsToAdd} CinePoints to user ${userId}`)

        // Send booking email
        const user = await User.findById(userId)
        console.log("User found:", user)
        console.log("Sending email to:", user?.email)

        if (user && user.email) {
            await sendBookingEmail(user.email, {
                bookingId: booking._id,
                movieTitle: booking.show.movie.title,
                seats: booking.bookedSeats,
                amount: booking.amount,
                showDate: new Date(booking.show.showDateTime).toLocaleString()
            })
        } else {
            console.log("No user email found!")
        }

        res.json({ success: true, message: 'Payment verified' })

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

export const swapSeat = async (req, res) => {
    try {
        const { bookingId, oldSeat, newSeat } = req.body
        const { userId } = req.auth()

        const booking = await Booking.findById(bookingId)
        const show = await Show.findById(booking.show)

        if (show.occupiedSeats[newSeat]) {
            return res.json({ success: false, message: 'Seat is already booked' })
        }

        delete show.occupiedSeats[oldSeat]
        show.occupiedSeats[newSeat] = userId
        show.markModified('occupiedSeats')
        await show.save()

        booking.bookedSeats = booking.bookedSeats.map(seat => seat === oldSeat ? newSeat : seat)
        await booking.save()

        res.json({ success: true, message: 'Seat swapped successfully' })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const refundBooking = async (req, res) => {
    try {
        const { bookingId } = req.body

        const booking = await Booking.findById(bookingId).populate('show')

        if (!booking) return res.json({ success: false, message: 'Booking not found' })

        const show = await Show.findById(booking.show._id)
        booking.bookedSeats.forEach(seat => {
            delete show.occupiedSeats[seat]
        })
        show.markModified('occupiedSeats')
        await show.save()

        await Booking.findByIdAndDelete(bookingId)

        res.json({ success: true, message: 'Booking refunded and cancelled successfully' })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.body
        const { userId } = req.auth()

        const booking = await Booking.findById(bookingId).populate('show')

        if (!booking) return res.json({ success: false, message: 'Booking not found' })
        if (booking.user !== userId) return res.json({ success: false, message: 'Unauthorized' })

        const showTime = new Date(booking.show.showDateTime)
        const now = new Date()
        const diffInHours = (showTime - now) / (1000 * 60 * 60)

        if (diffInHours < 1) {
            return res.json({ success: false, message: 'Cannot cancel booking within 1 hour of show' })
        }

        booking.isCancelled = true
        await booking.save()

        res.json({ success: true, message: 'Booking cancelled successfully. Refund will be processed by admin.' })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}