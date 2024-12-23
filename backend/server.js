const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = 5001;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use the backend .env file
});

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON body

app.get("/", (req, res) => {
    res.send("Welcome to the Backend API!");
});

// Chat API endpoint
app.post("/api/chat", async (req, res) => {
    try {
        const { messages, user } = req.body; // Include user info
        const personalizedMessage = [
            { role: "system", content: `You are chatting with ${user.name}. Be helpful and engaging.` },
            ...messages,
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: personalizedMessage,
        });

        res.json(response);
    } catch (error) {
        console.error("Error communicating with OpenAI API:", error);
        res.status(500).json({ error: "Failed to communicate with OpenAI API" });
    }
});



app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
