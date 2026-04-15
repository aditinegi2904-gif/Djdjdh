const functions  = require('firebase-functions');
const admin      = require('firebase-admin');
const fetch      = require('node-fetch');

admin.initializeApp();

// ── OpenAI Proxy ───────────────────────────────────────────────
exports.openaiProxy = functions
  .runWith({ secrets: [''] })
  .https.onRequest(async (req, res) => {

    // Allow CORS from your Firebase Hosting domain
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    // Optional: verify Firebase Auth token
    // const token = req.headers.authorization?.split('Bearer ')[1];
    // const decoded = await admin.auth().verifyIdToken(token);

    const { messages, model = 'gpt-3.5-turbo', max_tokens = 2000 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'messages array is required' });
      return;
    }

    try {
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({ model, messages, max_tokens, temperature: 0.7 })
      });

      if (!openaiRes.ok) {
        const err = await openaiRes.json();
        res.status(openaiRes.status).json({ error: err.error?.message || 'OpenAI error' });
        return;
      }

      const data  = await openaiRes.json();
      const reply = data.choices[0].message.content;
      res.status(200).json({ reply });

    } catch (err) {
      console.error('OpenAI proxy error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });