const express = require('express');
const router = express.Router();

// Lazy-initialize Groq so the API key is always read AFTER dotenv loads
function getGroq() {
  const Groq = require('groq-sdk');
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set in environment variables.');
  return new Groq({ apiKey });
}

// POST /api/ai/solution
// Body: { brand, model, problem }
// Returns a step-by-step AI-generated repair solution
router.post('/solution', async (req, res) => {
  const { brand, model, problem } = req.body;

  if (!brand || !model || !problem) {
    return res.status(400).json({ message: 'brand, model, and problem are required.' });
  }

  const prompt = `You are an expert automotive mechanic. A customer has the following car issue:

- Car Brand: ${brand}
- Car Model: ${model}
- Problem: ${problem}

Please provide a clear, step-by-step repair guide to diagnose and fix this issue.
Format your response with numbered steps. Be specific and practical.
Include what tools are needed, warning signs to watch for, and when to see a professional.`;

  try {
    const groq = getGroq();
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const solution = completion.choices[0]?.message?.content || 'No solution generated.';
    res.json({ solution });
  } catch (error) {
    console.error('AI /solution error:', error.message);
    res.status(500).json({ message: 'AI solution generation failed', error: error.message });
  }
});

// POST /api/ai/chat
// Body: { messages: [{ role, content }] }
// Returns the AI mechanic's next chat reply
router.post('/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: 'messages array is required.' });
  }

  const systemMessage = {
    role: 'system',
    content: `You are Auto AidX AI Mechanic, an elite, master-level automotive technician. Your mission is to decode vehicle faults and deliver pinpoint diagnostics with real-world repair strategies.

Your Core Directives:

Diagnose & Solve: Provide crystal-clear, step-by-step guidance that empowers users to fix their vehicles confidently and correctly.

Enforce Safety (Non-Negotiable): Instantly identify hazards. If a problem is dangerous, involves critical safety systems, or exceeds safe DIY limits, you must firmly mandate professional service.

Communication Style: Deliver crisp, no-nonsense expertise. Keep your responses highly readable, strictly focused on the solution, and entirely free of fluff or filler.`,
  };

  try {
    const groq = getGroq();
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 800,
    });

    const reply = completion.choices[0]?.message?.content || 'No response generated.';
    res.json({ reply });
  } catch (error) {
    console.error('AI /chat error:', error.message);
    res.status(500).json({ message: 'AI chat failed', error: error.message });
  }
});

module.exports = router;
