// File: server.js
// =====================================

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

// Helper function to validate real estate-related queries
const isRealEstateRelated = (text) => {
    if (!text) return false;
    const realEstateKeywords = [
        "property", "real estate", "house", "apartment", "mortgage", "listing", "client", "sale", "rent", "broker", "agent", "commission", "contract", "lease", "condo", "realtor", "investment", "neighborhood", "zoning", "valuation", "home", "land", "residential", "commercial"
    ];
    const normalizedText = text.toLowerCase().trim();
    return realEstateKeywords.some((keyword) => normalizedText.includes(keyword));
};

// Chat API endpoint
app.post("/api/chat", async (req, res) => {
    try {
        const { messages, user } = req.body;

        console.log("Received request body:", JSON.stringify(req.body, null, 2));

        if (!messages || !Array.isArray(messages)) {
            console.error("Invalid messages format:", messages);
            return res.status(400).json({ error: "Invalid messages format. Must be an array." });
        }

        // Validate if the user's message is real estate-related
        const latestMessage = messages[messages.length - 1]?.content || "";
        console.log("Latest user message:", latestMessage);

        if (!isRealEstateRelated(latestMessage)) {
            console.warn("Unrelated query received:", latestMessage);
            return res.json({
                role: "assistant",
                content: "I'm here to assist with real estate-related questions. Please let me know how I can help you with property or real estate matters.",
                refusal: "unrelated_query", // Provide a clear refusal reason
            });
        }

        const personalizedMessage = [
            {
                role: "system",
                content: `You are Beta, a real estate AI assistant for Alfred.Realtor. Your sole purpose is to assist with real estate-related questions and client assistance. If a query is unrelated to real estate, respond politely with: "I'm here to assist with real estate-related questions. Please let me know how I can help you with property or real estate matters."`
            },
            ...messages,
        ];

        console.log("Sending messages to OpenAI API:", JSON.stringify(personalizedMessage, null, 2));

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: personalizedMessage,
        });

        // Check if the API returned a valid response
        if (!response || !response.choices || !response.choices.length) {
            console.error("Invalid API response:", response);
            return res.status(500).json({ error: "Invalid response from OpenAI API" });
        }

        // Extract the assistant's reply
        const assistantMessage = response.choices[0]?.message?.content?.trim() || "No response from assistant.";

        console.log("Assistant's response:", assistantMessage);
        console.log("Formatted response to frontend:", {
            role: "assistant",
            content: assistantMessage,
            refusal: null,
        });

        res.json({
            role: "assistant",
            content: assistantMessage, // Ensure the format matches the frontend's expectation
            refusal: null, // Ensure `refusal` is always present in the response structure
        });
    } catch (error) {
        console.error("Error communicating with OpenAI API:", error.message, error.stack);
        res.status(500).json({ error: "Failed to communicate with OpenAI API. Please check server logs for details." });
    }
});

app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
