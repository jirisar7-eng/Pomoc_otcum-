import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { message, prompt } = req.body;
    const content = message || prompt;
    if (!content) {
      return res.status(400).json({ error: 'Missing message body or prompt' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: content,
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
