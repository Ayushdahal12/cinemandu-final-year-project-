Cineway — Theatre Ticket Booking System

A full-stack MERN theatre ticket booking platform with AI features, eSewa payment integration, and a loyalty rewards system built for Nepal.

Features
User Features
Authentication with Clerk
Browse movies (Nepali, Hindi, English)
Movie details and trailers
Favorite movies
Theatre, date, time, and seat selection
eSewa payment integration
QR-based ticket generation
Booking confirmation email
Booking management (view/cancel)
Seat swap functionality
CinePoints loyalty system
AI movie chatbot
AI movie recommendations
Admin Features
Dashboard with analytics (users, income, bookings)
Manage shows and movies
Theatre management
Booking and refund management
Income tracking
AI Features
Movie Chatbot
Answers movie-related queries
Supports Nepali, Hindi, and English
Powered by Groq (Llama 3.3)
Movie Recommendation System
Personalized recommendations
Based on user activity
Powered by Claude AI
CinePoints System
Earn 10 points per ticket
200 points = 1 free ticket
Automatic tracking after payment
User reward dashboard
Payment System
eSewa integration (sandbox)
Automatic booking confirmation
QR ticket generation
10-minute payment timeout with seat release
Tech Stack

Frontend: React, Vite, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB, Mongoose
Authentication: Clerk
AI: Groq API, Claude API
Payment: eSewa
Email: Nodemailer
Jobs: Inngest
Movie Data: TMDB API
Deployment: Vercel

Installation
Clone Repository
git clone https://github.com/yourusername/cineway.git
cd cineway
Backend Setup
cd Server
npm install

Create .env:

MONGODB_URI=your_mongodb_uri
CLERK_SECRET_KEY=your_clerk_secret
TMDB_API_KEY=your_tmdb_api_key
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

Run backend:

npm run dev
Frontend Setup
cd client
npm install

Create .env:

VITE_BACKEND_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

Run frontend:

npm run dev
Project Structure
cineway/
├── client/     # React frontend
└── Server/     # Express backend
    ├── controllers
    ├── routes
    ├── models
    ├── middleware
    └── server.js
API Endpoints
GET /api/show
POST /api/booking/create
POST /api/booking/esewa-initiate
POST /api/booking/verify-payment
GET /api/cinepoints
POST /api/ai/movie-chat
POST /api/ai/recommend

clone project through- github.com/Ayushdahal12/cinemandu-final-year-project
Developer

Ayush Dahal
