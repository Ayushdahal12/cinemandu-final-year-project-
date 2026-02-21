import express from "express";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/movie-chat", async (req, res) => {
  try {
    const { movie, messages, userMessage } = req.body;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: `You are CineAI, a friendly movie assistant for Cineway theatre.
Only answer about: "${movie.title}"
Genre: ${movie.genre}, Language: ${movie.language}, Rating: ${movie.rating}
Description: ${movie.description}
Keep answers short and friendly. Reply in same language as user.`
        },
        ...( messages || []),
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
