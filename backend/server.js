//server.js
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5001; // Load port from env

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use the backend .env file
});

// Middleware
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", // Adjust to your frontend origin
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express.json()); // Parse JSON body

// Helper function to create a new assistant
async function createNewAssistant(firstName) {
    try {
        // Retrieve instructions from the environment variable
        const instructionsTemplate = process.env.OPENAI_INSTRUCTIONS.replace(/\\n/g, "\n");


        // Replace the placeholder with the actual first name
        const instructions = instructionsTemplate.replace("{firstName}", firstName);

        

        console.log(instructions);

        const assistant = await openai.beta.assistants.create({
            instructions, // Use dynamically generated instructions
            model: process.env.OPENAI_MODEL || "gpt-4o-mini", // Load model from env
        });
        return assistant.id;
    } catch (error) {
        throw new Error("Failed to create assistant.");
    }
}

// Helper function to create a new thread
async function createNewThread() {
    try {
        const thread = await openai.beta.threads.create();
        return thread.id;
    } catch (error) {
        throw new Error("Failed to create thread.");
    }
}

// Route to initialize a new assistant and thread
app.post("/api/init", async (req, res) => {
    const { firstName } = req.body;
    if (!firstName) {
        return res.status(400).json({ error: "Missing first name." });
    }
    try {
        const assistantId = await createNewAssistant(firstName);
        const threadId = await createNewThread();
        res.status(200).json({ assistantId, threadId });
        console.log("Assistant and Thread initialized:", { assistantId, threadId });

    } catch (error) {
        res.status(500).json({ error: "Failed to initialize assistant and thread." });
    }
});


// Streaming SSE endpoint
app.get("/api/chat", async (req, res) => {
    const { assistantId, threadId } = req.query;

    if (!assistantId || !threadId) {
        res.status(400).json({ error: "Missing assistantId or threadId" });
        return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let stream;

    try {
        // Create the run with streaming
        stream = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistantId,
            stream: true, // Enable streaming
        });

        for await (const event of stream) {
            if (event.event === "thread.message.delta") {
                const delta = event.data.delta?.content || [];
                const formattedDelta = delta.map(item => item.text?.value).join(""); // Extract and join text values
                if (formattedDelta) {
                    res.write(`data: ${JSON.stringify({ content: formattedDelta })}\n\n`);
                }
            } else if (event.event === "thread.run.completed") {
                res.write("data: [DONE]\n\n");
                break;
            } else if (event.event === "thread.run.failed") {
                res.write(`data: ${JSON.stringify({ error: "Run failed." })}\n\n`);
                break;
            }
        }
    } catch (error) {
        if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify({ error: "Streaming error occurred." })}\n\n`);
        }
    } finally {
        if (stream && typeof stream.return === "function") {
            await stream.return();
        }
        res.end();
    }

    req.on("close", () => {
        if (stream && typeof stream.return === "function") {
            stream.return().catch(console.error);
        }
    });
});

// Chat API endpoint
app.post("/api/chat", async (req, res) => {
    const { threadId, role, content } = req.body;

    if (!threadId || !role || !content) {
        return res.status(400).json({ error: "Missing or invalid parameters." });
    }

    try {
        const response = await openai.beta.threads.messages.create(threadId, {
            role,
            content,
        });

        res.status(200).json({ messageId: response.id });
        console.log("Message sent to thread:", { threadId, role, content });

    } catch (error) {
        res.status(500).json({ error: "Failed to handle chat." });
    }
});

// Start server
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
