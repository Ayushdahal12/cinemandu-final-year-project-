import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true },
  cinePoints: { type: Number, default: 0 },
  pointsHistory: [{
    points: Number,
    reason: String,
    date: { type: Date, default: Date.now }
  }]
})

const User = mongoose.model('User', userSchema)
export default User;