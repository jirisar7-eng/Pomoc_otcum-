/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini SDK client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is missing. Please set it in Settings > Secrets in AI Studio.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API ROUTES FIRST
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Secure API Proxy for Synthesis AI Assistant
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { prompt, history } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Chybí dotaz (prompt).' });
      return;
    }

    const ai = getAiClient();
    
    // System instruction defining a professional child-centered Czech custody expert persona
    const systemInstruction = `
Jsi "Synthesis AI" - inteligentní rodinný poradce a právní asistent v systému Synthesis OS.
Tvým účelem je poskytovat rodičům věcné, srozumitelné a nestranné informace týkající se opatrovnického řízení, péče o děti, komunikace s OSPOD, soudních řízení v ČR a přípravy dohod o péči a výživném.

PRAVIDLA PRO REAKCI:
1. Jazyk: Vždy odpovídej v češtině.
2. Tón: Buď empatický, profesionální, klidný a věcný.
3. Princip: Vždy zdůrazňuj a podporuj **nejlepší zájem dítěte** a rovný přístup k oběma rodičům. Vyvaruj se jakékoliv zaujatosti vůči otcům nebo matkám.
4. Struktura: Používej přehledné odrážky (Checklisty), pokud odpovídáš na dotazy typu "Jak se připravit", "Na co nezapomenout" nebo "Jak postupovat".
5. Právní upozornění: Nejsi certifikovaný advokát. Na konci odpovědi uveď diskrétní, stručnou poznámku: "Tato odpověď má informativní charakter a nenahrazuje individuální právní pomoc."
6. Délka: Odpovídej stručně a strukturovaně, aby se text dobře četl v chatovacím okně (max 3-4 odstavce).
`;

    // We can use simple generateContent or chats
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Nepodařilo se vygenerovat odpověď od AI.',
      details: error.message || 'Neznámá chyba serveru'
    });
  }
});

// 2. VITE MIDDLEWARE SETUP FOR DEV VS STATIC PROD
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Running in DEVELOPMENT mode. Initializing Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Running in PRODUCTION mode. Serving static assets...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Synthesis Hub server running on port ${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to start Vite / Express server:', err);
});
