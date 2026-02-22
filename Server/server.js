// // npm install express - backend framework for node.js
// //  cors - allow to access backend from frontend
// // dotenv - store environment variables in .env file
// // mongoose  - connect to mongodb database
// // axios - make http requests from frontend to backend
// //  cloudinary - upload images to cloudinary 

// import express from 'express';
// import cors from 'cors'; 
// import 'dotenv/config';
// import connectDB from './configs/db.js';
// import { clerkMiddleware } from '@clerk/express'
// import { serve } from "inngest/express";
// import { inngest, functions } from "./inngest/index.js";
// import showRouter from './routes/showRoutes.js';
// import bookingRouter from './routes/bookingRoutes.js';
// import adminRouter from './routes/adminRoutes.js';
// import userRouter from './routes/userRoutes.js';
// import theaterRouter from './routes/theaterRoutes.js'
// import aiRouter from './routes/aiRoutes.js'   // add with other imports
             




// const app = express()
// const port = 3000;
// await connectDB()


// // Middleware
// app.use(express.json());
// app.use(cors());
// app.use(clerkMiddleware())

// //Api routes
// app.get('/', (req, res) =>  res.send('Server is running'))
// app.use('/api/inngest', serve({ client: inngest, functions }))
// app.use('/api/show', showRouter)
// app.use('/api/booking', bookingRouter)
// app.use('/api/admin', adminRouter)
// app.use('/api/user', userRouter)
// app.use('/api/theater', theaterRouter)
// app.use('/api/ai', aiRouter)    // add AI routes



// app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));




import express from 'express';
import cors from 'cors'; 
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import theaterRouter from './routes/theaterRoutes.js'
import aiRouter from './routes/aiRoutes.js'
import cinepointsRouter from './routes/cinepointsRoutes.js'
import { Webhook } from 'svix'
import User from './models/User.js'

const app = express()
const port = 3000;
await connectDB()

// Middleware
app.use(cors());
app.use(clerkMiddleware())

// Clerk Webhook — must be before express.json()
app.post('/api/clerk-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        const payload = wh.verify(req.body, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        })

        const { type, data } = payload

        if (type === 'user.created') {
            await User.create({
                _id: data.id,
                name: data.first_name + ' ' + data.last_name,
                email: data.email_addresses[0].email_address,
                image: data.image_url
            })
            console.log('New user created in MongoDB:', data.id)
        }

        if (type === 'user.updated') {
            await User.findByIdAndUpdate(data.id, {
                name: data.first_name + ' ' + data.last_name,
                email: data.email_addresses[0].email_address,
                image: data.image_url
            })
            console.log('User updated in MongoDB:', data.id)
        }

        if (type === 'user.deleted') {
            await User.findByIdAndDelete(data.id)
            console.log('User deleted from MongoDB:', data.id)
        }

        res.json({ success: true })
    } catch (error) {
        console.error('Webhook error:', error)
        res.status(400).json({ success: false })
    }
})

// JSON middleware after webhook route
app.use(express.json())

// Api routes
app.get('/', (req, res) => res.send('Server is running'))
app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/show', showRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)
app.use('/api/theater', theaterRouter)
app.use('/api/ai', aiRouter)
app.use('/api/cinepoints', cinepointsRouter)

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
