import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ OpenAI Client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Root Test Route
app.get("/api", (req, res) => {
    res.send("✅ Doc Generator API is running...");
});

// ✅ AI Document Generation
app.post("/api/generate", async(req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        res.json({ result: response.choices[0].message.content });
    } catch (err) {
        console.error("❌ Error generating document:", err);
        res.status(500).json({ error: "AI failed to generate document" });
    }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
    console.log(`🚀 Backend + Frontend running on port ${PORT}`)
);