import OpenAI from "openai";

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const OPENAI_CONFIG = {
    model: process.env.OPENAI_MODEL || "gpt-4",
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1500'),
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
}