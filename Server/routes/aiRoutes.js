import express from "express";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });  // using external api key from .env

router.post("/movie-chat", async (req, res) => {            // intenal api to connect the user interface
  try {
    const { movie, messages, userMessage } = req.body;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 500,
    messages: [
  {
    role: "system",
    content: `You are CineAI, a friendly movie assistant for Cineway theatre.
Here is everything about this movie:
Title: ${movie?.title || "Unknown"}
Genre: ${movie?.genres?.map(g => g.name).join(", ") || movie?.genre || "Unknown"}
Language: ${movie?.original_language || movie?.language || "Unknown"}
Rating: ${movie?.vote_average || movie?.rating || "Unknown"}
Duration: ${movie?.runtime || movie?.duration || "Unknown"} mins
Description: ${movie?.overview || movie?.description || "Unknown"}
Cast: ${movie?.casts?.slice(0,5).map(c => c.name).join(", ") || "Unknown"}

Answer all questions based on this movie. Be friendly and helpful.
Reply in same language as user.`
  },
  ...(messages || []),
  { role: "user", content: userMessage }
],
    });

    res.json({ success: true, reply: response.choices[0].message.content });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
