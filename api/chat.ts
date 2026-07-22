import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Metoda není povolena'
    });
  }

  try {
    // 1. KONTROLA API KLÍČE
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: false,
        error: "Dočasná chyba při spojení s AI. Zkontrolujte API klíč nebo to zkusíte za chvíli znovu."
      });
    }

    const { message, prompt } = req.body || {};
    const content = message || prompt;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Chybí dotaz (prompt nebo message)'
      });
    }

    // 2. OŠETŘENÍ CHYB V API ROUTE
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: content,
    });

    return res.status(200).json({
      success: true,
      text: response.text || ''
    });

  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    return res.status(200).json({
      success: false,
      error: "Dočasná chyba při spojení s AI. Zkontrolujte API klíč nebo to zkusíte za chvíli znovu."
    });
  }
}
