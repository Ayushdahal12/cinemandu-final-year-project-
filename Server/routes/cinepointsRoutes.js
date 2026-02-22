import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { userId } = req.auth()
        const user = await User.findById(userId)
        if (!user) return res.json({ success: false, message: 'User not found' })
        res.json({ success: true, points: user.cinePoints, history: user.pointsHistory })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.post('/claim', async (req, res) => {
    try {
        const { userId } = req.auth()
        const user = await User.findById(userId)
        if (!user) return res.json({ success: false, message: 'User not found' })
        if (user.cinePoints < 200) return res.json({ success: false, message: `You need ${200 - user.cinePoints} more points!` })

        user.cinePoints -= 200
        user.pointsHistory.push({ points: -200, reason: '🎟️ Free ticket claimed!' })
        await user.save()

        res.json({ success: true, message: 'Free ticket claimed! Show this to the counter.' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

export default router;