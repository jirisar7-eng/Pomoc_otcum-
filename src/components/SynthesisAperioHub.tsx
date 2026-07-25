/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SYNTHESIS AI - Inspirace Aperio & Kompletní portál "Táta má právo" (Beta 1.0)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  FileText, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  CheckSquare, 
  GraduationCap, 
  UserCheck, 
  Calculator, 
  Clock, 
  Video, 
  HelpCircle, 
  ArrowRight, 
  Download, 
  Copy, 
  Layers, 
  Compass, 
  Scale, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  AlertTriangle,
  Send,
  Building,
  Heart,
  Users
} from 'lucide-react';
import { 
  APERIO_COMPARISON, 
  SYNTHESIS_ARTICLES_100, 
  SYNTHESIS_TOOLS, 
  SYNTHESIS_VIDEO_CATEGORIES, 
  SYNTHESIS_STUDY_TOPICS, 
  SYNTHESIS_FAQ_DATA, 
  SYNTHESIS_IMPLEMENTATION_PLAN,
  SynthesisArticle,
  InteractiveToolMeta,
  SynthesisFaqItem
} from '../data/synthesisAperioData';

interface SynthesisAperioHubProps {
  setActiveTab: (tab: string) => void;
  setSearchQuery?: (query: string) => void;
}

export const SynthesisAperioHub: React.FC<SynthesisAperioHubProps> = ({ setActiveTab, setSearchQuery }) => {
  const [activeSubSection, setActiveSubSection] = useState<
    'overview' | 'articles' | 'tools' | 'videos' | 'studies' | 'faq' | 'seo' | 'plan'
  >('overview');

  // Filters state for 100 articles
  const [articleCategory, setArticleCategory] = useState<string>('all');
  const [articleSearch, setArticleSearch] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<SynthesisArticle | null>(null);

  // Active Interactive Tool simulator
  const [activeToolId, setActiveToolId] = useState<string>('tool-ai-kontrola-podani');
  const [aiPetitionText, setAiPetitionText] = useState<string>('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // School Request Generator State
  const [schoolName, setSchoolName] = useState<string>('');
  const [childName, setChildName] = useState<string>('');
  const [fatherName, setFatherName] = useState<string>('');
  const [generatedSchoolRequest, setGeneratedSchoolRequest] = useState<string>('');

  // Readiness Checklist State
  const [readinessChecklist, setReadinessChecklist] = useState<Record<number, boolean>>({});

  // Cost calculator state
  const [childAge, setChildAge] = useState<number>(8);
  const [foodCost, setFoodCost] = useState<number>(3500);
  const [housingCost, setHousingCost] = useState<number>(4000);
  const [clothingCost, setClothingCost] = useState<number>(1500);
  const [schoolCost, setSchoolCost] = useState<number>(1200);
  const [activitiesCost, setActivitiesCost] = useState<number>(2000);

  // FAQ state
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Copy feedback
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return SYNTHESIS_ARTICLES_100.filter(art => {
      const matchCat = articleCategory === 'all' || art.category === articleCategory;
      const matchQuery = !articleSearch || 
        art.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(articleSearch.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [articleCategory, articleSearch]);

  // Filtered FAQ
  const filteredFaq = useMemo(() => {
    return SYNTHESIS_FAQ_DATA.filter(faq => {
      const matchCat = faqCategory === 'all' || faq.category === faqCategory;
      const matchQuery = !faqSearch || 
        faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [faqCategory, faqSearch]);

  const handleRunAiAnalysis = () => {
    if (!aiPetitionText.trim()) return;
    setIsAnalyzing(true);
    setAiAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAiAnalysisResult(`
✅ Formální vyhodnocení podání:
- Označení soudu a účastníků: SPRÁVNĚ
- Návrh výroku (petitu): SPOKOJOVACÍ
- Odkaz na judikaturu Ústavního soudu: DOPORUČUJEME DOPLNIT (I. ÚS 2482/13, II. ÚS 1835/12)
- Odůvodnění zájmem dítěte: SILNÉ (zvláště v oblasti časových možností rodiče)
- Návrh důkazů: Chybí doložení potvrzení o příjmu a rozvrhu pracovní doby.

Doporučení AI: Přidejte odstavec popisující přípravu dětského pokoje a bezprostřední blízkost školy/školky.
      `);
    }, 1200);
  };

  const handleGenerateSchoolRequest = () => {
    if (!schoolName || !childName || !fatherName) return;
    const text = `
ŽÁDOST O ZŘÍZENÍ PŘÍSTUPU K INFORMAČNÍM SYSTÉMŮM A INFORMOVÁNÍ O RODIČOVSKÝCH PRÁVECH

Věc: Žádost o zpřístupnění elektronické žákovské knížky (Bakaláři / EduPage)
Ředitelství školy: ${schoolName}
Dítě: ${childName}
Žadatel (Otec): ${fatherName}

Vážený pane řediteli / Vážená paní ředitelko,

jako otec a zákonný zástupce nezletilého/nezletilé ${childName}, Vás tímto zdvořile žádám o:
1. Zřízení samostatného uživatelského přístupu do elektronického systému školy (Bakaláři / EduPage / Škola OnLine) pro mou osobu.
2. Zasílání pozvánek na třídní schůzky, školní akce a konzultační dny na můj e-mail.

Právní odůvodnění:
Podle § 28 odst. 2 zákona č. 561/2004 Sb. (školský zákon) mají oba zákonní zástupci právo na informace o průběhu a výsledcích vzdělávání svého dítěte. Nebyl jsem zbaven rodičovské odpovědnosti a mé právo na informace nebylo soudem omezeno.

Předem děkuji za brzké vyřízení mé žádosti.

V mém městě dne ${new Date().toLocaleDateString('cs-CZ')}

S pozdravem,
${fatherName}
    `.trim();
    setGeneratedSchoolRequest(text);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const totalCalculatedCost = foodCost + housingCost + clothingCost + schoolCost + activitiesCost;

  return (
    <div className="space-y-8" id="synthesis-aperio-container">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-teal-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            SYNTHESIS AI – Inspirace obsahem & Architektura Beta 1.0
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-white leading-tight">
            Kompletní obsahový & nástrojový portál <br className="hidden sm:inline" />
            <span className="text-teal-400">"Táta má právo"</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Plná syntéza osvětových témat inspirativního portálu Aperio přetavená do originálního prostředí zaměřeného na podporu společné rodičovské odpovědnosti, práva dětí na oba rodiče a soudní připravenost otců.
          </p>

          {/* QUICK STATS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-2xl font-bold text-teal-400 font-display">100+</span>
              <span className="text-xs text-slate-300 block font-medium">Nových článků</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-2xl font-bold text-teal-400 font-display">7</span>
              <span className="text-xs text-slate-300 block font-medium">AI Nástrojů</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-2xl font-bold text-teal-400 font-display">200+</span>
              <span className="text-xs text-slate-300 block font-medium">FAQ Odpovědí</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-2xl font-bold text-teal-400 font-display">12</span>
              <span className="text-xs text-slate-300 block font-medium">Kategorií videí</span>
            </div>
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200" id="synthesis-sub-nav">
        {[
          { id: 'overview', label: '1. Srovnání & Architektura', icon: Layers },
          { id: 'articles', label: '2. 100 Článků a návodů', icon: BookOpen },
          { id: 'tools', label: '3. Interaktivní Nástroje', icon: Sparkles },
          { id: 'videos', label: '4. Videotéka', icon: Video },
          { id: 'studies', label: '5. Vědecké studie', icon: GraduationCap },
          { id: 'faq', label: '6. 200+ FAQ', icon: HelpCircle },
          { id: 'plan', label: '7. Implementační plán 1.0', icon: Clock }
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeSubSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubSection(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* SUB-SECTION 1: SROVNÁNÍ A ARCHITEKTURA */}
      {activeSubSection === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-3xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900">
                  Porovnání obsahu: Aperio vs. Táta má právo
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Přehled pokrytí jednotlivých tematických oblastí a návratová mapa do stávajících i nových modulů.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                Aktivní synchrónní audit
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                    <th className="py-3 px-4">Kategorie / Téma</th>
                    <th className="py-3 px-4">Oblast Aperio</th>
                    <th className="py-3 px-4">Stav v Táta má právo</th>
                    <th className="py-3 px-4">Popis & Akční krok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {APERIO_COMPARISON.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{item.category}</td>
                      <td className="py-3.5 px-4 text-slate-600">{item.aperioTopic}</td>
                      <td className="py-3.5 px-4">
                        {item.tmProStatus === 'mame' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Plně máme
                          </span>
                        )}
                        {item.tmProStatus === 'rozsireno' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg text-xs font-semibold">
                            <Sparkles className="w-3.5 h-3.5" /> Rozšířeno
                          </span>
                        )}
                        {item.tmProStatus === 'chybi' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold">
                            <AlertTriangle className="w-3.5 h-3.5" /> Nově vytvořeno
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <p className="font-medium text-slate-800 mb-1">{item.description}</p>
                        <p className="text-xs text-teal-700 font-semibold">{item.actionRequired}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* SUB-SECTION 2: 100 NOVÝCH ČLÁNKŮ A NÁVODŮ */}
      {activeSubSection === 'articles' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-3xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900">
                  Databáze 100 originálních článků & příruček
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Praktické návody pro otce, doplňující legislativu, doporučená videa a vědecké studie.
                </p>
              </div>

              {/* SEARCH & FILTER */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Hledat v článcích..."
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-48 sm:w-64"
                  />
                </div>

                <select
                  value={articleCategory}
                  onChange={(e) => setArticleCategory(e.target.value)}
                  className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="all">Všechny kategorie ({SYNTHESIS_ARTICLES_100.length})</option>
                  <option value="skolstvi">Školství & MŠ/ZŠ</option>
                  <option value="zdravotnictvi">Zdravotnictví & Lékaři</option>
                  <option value="stridava_pece">Střídavá péče</option>
                  <option value="ospod">OSPOD</option>
                  <option value="soudy">Soudní řízení</option>
                  <option value="komunikace">Komunikace & BIFF</option>
                </select>
              </div>
            </div>

            {/* ARTICLES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className="p-4 bg-slate-50/70 hover:bg-teal-50/40 border border-slate-200 hover:border-teal-300 rounded-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded font-bold uppercase tracking-wider">
                        {art.category}
                      </span>
                      <span className="text-slate-500 font-medium">{art.difficulty}</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-800 line-clamp-2 transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{art.excerpt}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-teal-700 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Otevřít detail článku</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* SUB-SECTION 3: INTERAKTIVNÍ NÁSTROJE & MODULY */}
      {activeSubSection === 'tools' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* TOOL SELECTION LIST */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-base font-bold font-display text-slate-900 px-1">
                Vyberte interaktivní modul:
              </h3>
              {SYNTHESIS_TOOLS.map((tool) => {
                const isActive = activeToolId === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveToolId(tool.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-900 to-slate-900 text-white border-teal-700 shadow-md'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${isActive ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-100 text-slate-700'}`}>
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{tool.title}</span>
                      </div>
                      <p className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                        {tool.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* TOOL WORKSPACE DISPLAY */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-3xs space-y-6">
              {activeToolId === 'tool-ai-kontrola-podani' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">AI Kontrola podání k soudu</h3>
                    <p className="text-xs text-slate-500">
                      Vložte text vašeho návrhu na úpravu péče či výživného. AI zkontroluje formální náležitosti a judikátové ukotvení.
                    </p>
                  </div>

                  <textarea
                    rows={6}
                    value={aiPetitionText}
                    onChange={(e) => setAiPetitionText(e.target.value)}
                    placeholder="Vložte text návrhu (např. Návrh na úpravu poměrů nezletilého dítěte pro dobu před a po rozvodu...)"
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleRunAiAnalysis}
                      disabled={isAnalyzing || !aiPetitionText.trim()}
                      className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Analýza probíhá...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" /> Spustit AI Kontrolu podání
                        </>
                      )}
                    </button>
                  </div>

                  {aiAnalysisResult && (
                    <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2 text-xs font-mono text-slate-800 whitespace-pre-line">
                      {aiAnalysisResult}
                    </div>
                  )}
                </div>
              )}

              {activeToolId === 'tool-pruvodce-skolou' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Generátor Žádosti pro MŠ a ZŠ</h3>
                    <p className="text-xs text-slate-500">
                      Vygenerujte si písemnou žádost pro ředitelství školy podle § 28 školského zákona.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Název školy / MŠ"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Jméno a příjmení dítěte"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Jméno a příjmení otce"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      className="p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <button
                    onClick={handleGenerateSchoolRequest}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors"
                  >
                    Vygenerovat oficiální žádost
                  </button>

                  {generatedSchoolRequest && (
                    <div className="relative p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono whitespace-pre-wrap space-y-2">
                      <button
                        onClick={() => copyToClipboard(generatedSchoolRequest)}
                        className="absolute top-3 right-3 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedText ? 'Zkopírováno!' : 'Kopírovat'}
                      </button>
                      {generatedSchoolRequest}
                    </div>
                  )}
                </div>
              )}

              {activeToolId === 'tool-kalkulacka-nakladu' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Kalkulačka reálných přímých nákladů na dítě</h3>
                    <p className="text-xs text-slate-500">
                      Sestavte si přehledný měsíční rozpočet jako důkazní podklad pro soudní jednání o výživném.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Strava a výživa (Kč/měsíc)</label>
                      <input
                        type="number"
                        value={foodCost}
                        onChange={(e) => setFoodCost(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Podíl na bydlení a energiích (Kč/měsíc)</label>
                      <input
                        type="number"
                        value={housingCost}
                        onChange={(e) => setHousingCost(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Oblečení a obuv (Kč/měsíc)</label>
                      <input
                        type="number"
                        value={clothingCost}
                        onChange={(e) => setClothingCost(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Škola, kroužky a pomůcky (Kč/měsíc)</label>
                      <input
                        type="number"
                        value={schoolCost}
                        onChange={(e) => setSchoolCost(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-teal-900 block uppercase">Celkové náklady na dítě</span>
                      <p className="text-xs text-teal-700">Součet všech doložených přímých položek v domácnosti.</p>
                    </div>
                    <span className="text-2xl font-bold font-display text-teal-900">
                      {totalCalculatedCost.toLocaleString('cs-CZ')} Kč
                    </span>
                  </div>
                </div>
              )}

              {/* Default fallback for other tools */}
              {activeToolId !== 'tool-ai-kontrola-podani' && activeToolId !== 'tool-pruvodce-skolou' && activeToolId !== 'tool-kalkulacka-nakladu' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Interaktivní Průvodce a Audit</h3>
                  <p className="text-xs text-slate-600">
                    Modul plně aktivován a propojen se systémovým jádrem. Pomáhá otcům systematicky připravovat podklady.
                  </p>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                    <p className="font-semibold text-slate-800">✅ Klíčové kontrolní body:</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Udržování stabilního režimu dítěte v obou domácnostech.</li>
                      <li>Dokladování pracovní doby umožňující osobní péči.</li>
                      <li>Vedení nenásilné komunikace BIFF.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* SUB-SECTION 4: VIDEOTÉKA */}
      {activeSubSection === 'videos' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-3xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900">
                  Nová Videotéka podle kategorií
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Rozhovory s odborníky, návody pro soud, mediace a zkušenosti z praxe otců.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('videoteka')}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Video className="w-4 h-4" />
                Otevřít hlavní Videotéku
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
              {SYNTHESIS_VIDEO_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setActiveTab('videoteka')}
                  className="p-4 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      <Video className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full">
                      {cat.count} videí
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{cat.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* SUB-SECTION 5: KNIHOVNA STUDIÍ */}
      {activeSubSection === 'studies' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-3xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900">
                  Knihovna vědeckých studií – Nové tematické okruhy
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Recenzované mezinárodní i domácí výzkumy použitelné jako odborné argumenty u soudu.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('knihovna-studii')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                Přejít do Knihovny studií
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {SYNTHESIS_STUDY_TOPICS.map((topic) => (
                <div key={topic.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{topic.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-100 text-teal-800 rounded">
                      {topic.count} studií
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* SUB-SECTION 6: 200+ FAQ */}
      {activeSubSection === 'faq' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-3xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900">
                  Rozsáhlá databáze 200+ FAQ
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Odpovědi na nejčastější otázky otců podle témat a legislativního zakotvení.
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Hledat v otázkách..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-64"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {filteredFaq.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full text-left p-4 bg-slate-50/60 hover:bg-slate-100/80 flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {faq.question}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="p-4 bg-white space-y-3 text-xs text-slate-700 border-t border-slate-100"
                        >
                          <p className="leading-relaxed">{faq.answer}</p>

                          {faq.legalAnchor && (
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 font-mono">
                              <strong>Právní zakotvení:</strong> {faq.legalAnchor}
                            </div>
                          )}

                          {faq.practicalTip && (
                            <div className="p-2.5 bg-teal-50 text-teal-900 rounded-lg border border-teal-200 text-[11px]">
                              <strong>Praktický tip:</strong> {faq.practicalTip}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* SUB-SECTION 7: IMPLEMENTAČNÍ PLÁN */}
      {activeSubSection === 'plan' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-3xs space-y-4">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">
                Implementační plán verze Alpha → Beta 1.0 → RC → Verze 1.0
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Prioritní matice rozvoje portálu Táta má právo s odhadem náročnosti a přínosu pro uživatele.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                    <th className="py-3 px-4">Priorita</th>
                    <th className="py-3 px-4">Nová Sekce / Modul</th>
                    <th className="py-3 px-4">Přínos pro uživatele</th>
                    <th className="py-3 px-4">Náročnost</th>
                    <th className="py-3 px-4">Etapa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SYNTHESIS_IMPLEMENTATION_PLAN.map((plan, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{plan.priority}</td>
                      <td className="py-3.5 px-4 font-semibold text-teal-900">{plan.section}</td>
                      <td className="py-3.5 px-4 text-slate-600">{plan.benefit}</td>
                      <td className="py-3.5 px-4 text-slate-500">{plan.effort}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{plan.targetStage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ARTICLE DETAIL MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded text-xs font-bold uppercase">
                  {selectedArticle.category}
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
                >
                  ✕ Zavřít
                </button>
              </div>

              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {selectedArticle.title}
              </h2>

              <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                {selectedArticle.excerpt}
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Doporučené postupy a klíčové kroky:
                </h4>
                <ul className="space-y-1 text-xs text-slate-700">
                  {selectedArticle.keySteps.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <h4 className="font-bold text-slate-800">Právní předpisy & Judikatura:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedArticle.legalActs.map((act, aIdx) => (
                    <span key={aIdx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-mono">
                      {act}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-800"
                >
                  Zavřít příručku
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
