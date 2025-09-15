import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" })); // allow all origins during development
app.use(express.json());

// OpenAI client
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/", (req, res) => {
    res.send("✅ Doc Generator API is running...");
});

app.post("/generate", async(req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt is required" });

        // Create chat completion — adapt to the version of openai you have.
        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        // Safely extract text
        const text =
            response ? .choices ? .[0] ? .message ? .content ? ?
            response ? .choices ? .[0] ? .text ? ?
            JSON.stringify(response);

        return res.json({ result: text });
    } catch (err) {
        console.error("❌ Error generating document:", err);
        // send error details for debugging (but avoid leaking secrets in production)
        return res.status(500).json({ error: "AI failed to generate document" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Backend running on port ${PORT}`));