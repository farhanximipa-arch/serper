const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Inisialisasi SDK menggunakan Environment Variables (Bukan hardcode)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

// Endpoint AI Gemini
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt tidak boleh kosong' });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({ result: response.text() });
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'Gagal memproses request Gemini' });
  }
});

// Endpoint AI Groq
app.post('/api/groq', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt tidak boleh kosong' });

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });

    res.json({ result: completion.choices[0]?.message?.content || 'Tidak ada respon.' });
  } catch (error) {
    console.error('Groq Error:', error);
    res.status(500).json({ error: 'Gagal memproses request Groq' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Test AI berjalan di port ${PORT}`));