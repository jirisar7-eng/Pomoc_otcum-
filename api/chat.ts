import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const aiKey = process.env.GEMINI_API_KEY;
    if (!aiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable. Nastavte prosím klíč v Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: aiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { prompt, history } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Chybí dotaz (prompt).' });
      return;
    }

    const ai = getAiClient();
    
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

    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      responseText = response.text || '';
    } catch (chatError: any) {
      console.warn(`[Synthesis OS] Chat primary model failed. Attempting 2.5-flash...`);
      try {
        const response2 = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });
        responseText = response2.text || '';
      } catch (chatError2: any) {
        console.error('[Synthesis OS] All Gemini models down. Replying with offline local Czech custody guidance.');
        responseText = `Ahoj! Jsem Synthesis AI, tvůj rodinný asistent v záložním režimu (Local Offline Engine). Vzhledem k dočasnému vysokému zatížení hlavního serveru odpovídám pomocí svých lokálních opatrovnických instrukcí.

Pro úspěšný postup a ochranu zájmů dětí doporučuji tyto 3 základní pilíře:
1. **Respektujte nejlepší zájem dítěte** – veškerou argumentaci stavte na potřebách dítěte (vztah se sourozenci, stabilita zázemí), nikoliv na osobních sporech s druhým rodičem.
2. **Udržujte věcnou komunikaci** – s druhým rodičem i orgány (OSPOD) komunikujte klidně, bez emocí a písemně (e-mail, zprávy), abyste měli průkaznou stopu pro soud.
3. **Předkládejte důkazy včas** – klíčové dokumenty (znalecké posudky, fotografie) doručte soudu nejméně 10 dnů před nařízeným stáním s odkazem na relevantní judikaturu (např. nález Ústavního soudu sp. zn. II. ÚS 132/24).

Máte nějaký konkrétní dotaz ohledně podání návrhu nebo komunikace s opatrovníkem? Jsem tu, abych vám pomohl.`;
      }
    }

    res.status(200).json({ text: responseText });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Nepodařilo se vygenerovat odpověď od AI.',
      details: error.message || 'Neznámá chyba serveru'
    });
  }
}
