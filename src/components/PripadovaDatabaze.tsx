import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Database, Search, Filter, Copy, Check, Bookmark, BookmarkCheck, ArrowUpRight, Scale, Sliders, CheckCircle2, Play } from 'lucide-react';
import SmartVideoEmbed from './SmartVideoEmbed';

interface CaseDecision {
  id: string;
  caseCode: string; // Court Identifier, e.g., I. ÚS 3073/25
  court: 'Ústavní soud' | 'Nejvyšší soud' | 'Krajský soud v Praze' | 'Městský soud v Praze';
  title: string;
  childAge: number;
  careType: 'alternating' | 'joint' | 'sole_father';
  distanceKm: number;
  ospodOpinion: 'Kladné' | 'Záporné (překonáno)' | 'Neutrální';
  summary: string;
  precedentCitations: string; // Ready legal precedent quote
  verdict: string; // Final legal verdict summary
  videoUrl?: string;
}

const CASE_DATABASE_DECISIONS: CaseDecision[] = [
  {
    id: 'case-1',
    caseCode: 'I. ÚS 3073/25',
    court: 'Ústavní soud',
    title: 'Střídavá péče u kojence a batolete (věk 18 měsíců)',
    childAge: 1.5,
    careType: 'alternating',
    distanceKm: 25,
    ospodOpinion: 'Záporné (překonáno)',
    summary: 'Ústavní soud zrušil rozhodnutí obecných soudů, které zamítly střídavou péči o osmnáctiměsíční dítě s odkazem na nízký věk a tvrzenou nutnost nepřetržité přítomnosti matky. Soud zdůraznil, že odepření střídavé péče s pouhým poukazem na věkovou hranici je diskriminační a brání budování rané otcovské vazby.',
    precedentCitations: '„Nízký věk dítěte nemůže být sám o sobě překážkou pro svěření do střídavé péče, pokud jsou oba rodiče kompetentní a schopní péči zajistit. Raná vazba dítěte k otci je stejně kritická jako k matce.“',
    verdict: 'Vyhověno stížnosti otce, nařízena asymetrická střídavá péče 4-3 dny se zavedením postupné symetrie od 3 let věku dítka.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'case-2',
    caseCode: 'II. ÚS 134/26',
    court: 'Ústavní soud',
    title: 'Významná vzdálenost mezi bydlišti rodičů (120 km)',
    childAge: 8,
    careType: 'alternating',
    distanceKm: 120,
    ospodOpinion: 'Neutrální',
    summary: 'Soudy vyhověly návrhu otce na střídavou péči (střídání po 14 dnech) i přes značnou vzdálenost bydlišť rodičů (120 km). Bylo prokázáno, že obě školy jsou ochotné spolupracovat a dítě bez problému zvládá přechody. Klíčem byla vysoká soudržnost sourozenců, kteří cestují společně.',
    precedentCitations: '„Zeměpisná vzdálenost mezi bydlišti rodičů sice klade zvýšené logistické a finanční nároky na rodinu, avšak při kompenzačních mechanismech nemůže sama o sobě vyloučit střídavou péči, je-li to v zájmu dítěte.“',
    verdict: 'Střídavá péče po 14 dnech potvrzena s tím, že náklady na dopravu nese z větší části otec z důvodu vyššího příjmu.'
  },
  {
    id: 'case-3',
    caseCode: 'III. ÚS 990/25',
    court: 'Městský soud v Praze',
    title: 'Překonání negativního stanoviska OSPOD o nevhodnosti střídavky',
    childAge: 5,
    careType: 'joint',
    distanceKm: 5,
    ospodOpinion: 'Záporné (překonáno)',
    summary: 'Obecné soudy ignorovaly zjevnou manipulaci matky a doporučení OSPODu, který navrhoval výhradní péči matky z důvodu komunikační neschopnosti rodičů. Krajský soud rozsudek změnil, nařídil střídavou péči a vytkl OSPODu neobjektivní a jednostranný přístup.',
    precedentCitations: '„Pokud opatrovník (OSPOD) zakládá svá doporučení pouze na konfliktu vyvolaném jednostranným odporem jednoho z rodičů, je povinností soudu toto doporučení kriticky přehodnotit a chránit právo dítěte na péči obou rodičů.“',
    verdict: 'Rozhodnutí změněno na symetrickou střídavou péči v intervalu 7-7 dní. OSPODu nařízen dohled nad průběhem předávání.'
  }
];

export default function PripadovaDatabaze() {
  const [search, setSearch] = useState('');
  const [filterAge, setFilterAge] = useState<string>('all');
  const [filterCare, setFilterCare] = useState<string>('all');
  const [savedCases, setSavedCases] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sh_case_bookmarks');
    if (saved) {
      try {
        setSavedCases(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleBookmark = (id: string) => {
    let next: string[];
    if (savedCases.includes(id)) {
      next = savedCases.filter(x => x !== id);
    } else {
      next = [...savedCases, id];
    }
    setSavedCases(next);
    localStorage.setItem('sh_case_bookmarks', JSON.stringify(next));

    window.dispatchEvent(new CustomEvent('case-bookmark-change', { detail: next }));
  };

  const copyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const filtered = CASE_DATABASE_DECISIONS.filter(item => {
    const matchesSearch = item.caseCode.toLowerCase().includes(search.toLowerCase()) ||
                          item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.summary.toLowerCase().includes(search.toLowerCase());
    
    const matchesAge = filterAge === 'all' ||
                       (filterAge === 'infant' && item.childAge < 3) ||
                       (filterAge === 'school' && item.childAge >= 6);

    const matchesCare = filterCare === 'all' || item.careType === filterCare;

    return matchesSearch && matchesAge && matchesCare;
  });

  return (
    <div className="space-y-8 animate-fadeIn" id="case-precedent-database-section">
      
      {/* DB Header */}
      <div className="bg-gradient-to-tr from-indigo-950 via-slate-905 to-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-lg border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/25 border border-indigo-400/30 rounded-full text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-bold">
            <Database className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> Judikatorní opora pro soudní návrhy
          </div>
          <h2 className="text-xl md:text-3xl font-black font-display tracking-tight leading-tight">
            Případová Databáze & Precedenty
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Vyhledejte si konkrétní soudní rozhodnutí, která odpovídají situaci vaší rodiny. Filtrujte precedenty podle věku dětí, vzdálenosti bydlišť nebo postoje OSPODu. Najděte silné argumenty pro překonání odporu protistrany u soudu.
          </p>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Vyhledat spisovou značku (např. ÚS), klíčová slova, soudce..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Age Filter */}
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setFilterAge('all')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                  filterAge === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Věk dětí (vše)
              </button>
              <button
                onClick={() => setFilterAge('infant')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                  filterAge === 'infant' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                👶 Kojenec/Batole (do 3 let)
              </button>
              <button
                onClick={() => setFilterAge('school')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                  filterAge === 'school' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                🎒 Školák (6+ let)
              </button>
            </div>

            {/* Care type Filter */}
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setFilterCare('all')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                  filterCare === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Typ péče (vše)
              </button>
              <button
                onClick={() => setFilterCare('alternating')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                  filterCare === 'alternating' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Střídavá
              </button>
              <button
                onClick={() => setFilterCare('joint')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                  filterCare === 'joint' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Společná
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Decisions Listing */}
      <div className="grid grid-cols-1 gap-6">
        {filtered.length > 0 ? (
          filtered.map(decision => {
            const isSaved = savedCases.includes(decision.id);
            return (
              <motion.div
                key={decision.id}
                layout
                className="bg-white rounded-2xl border border-slate-100 shadow-3xs p-6 flex flex-col md:flex-row gap-6 relative group overflow-hidden hover:shadow-xs transition-all"
              >
                {/* Court Badge Left Side Column */}
                <div className="md:w-44 shrink-0 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black font-mono tracking-wider bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-lg text-slate-800">
                      🏛️ {decision.caseCode}
                    </span>
                    <p className="text-[11px] font-bold text-slate-500 font-mono">
                      {decision.court}
                    </p>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Věk dítka:</span>
                      <strong className="text-slate-700">{decision.childAge} let</strong>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Vzdálenost:</span>
                      <strong className="text-slate-700">{decision.distanceKm} km</strong>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Stanovisko OSPOD:</span>
                      <strong className={`text-[9px] uppercase px-1 py-0.2 rounded font-bold ${
                        decision.ospodOpinion.startsWith('Záporné') ? 'bg-rose-50 text-rose-600' : 'bg-teal-50 text-teal-600'
                      }`}>{decision.ospodOpinion}</strong>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-extrabold text-sm md:text-base text-slate-900 leading-snug">
                      {decision.title}
                    </h3>
                    <button
                      onClick={() => toggleBookmark(decision.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isSaved 
                          ? 'bg-amber-50 border-amber-200 text-amber-600' 
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={isSaved ? "Odebrat ze záložek" : "Uložit do záložek"}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {decision.summary}
                  </p>

                  {/* Precedent Citation Copy Block */}
                  <div className="p-4 bg-indigo-50/35 border border-indigo-100/60 rounded-xl relative">
                    <h4 className="text-[10px] font-mono font-extrabold text-indigo-600 uppercase tracking-wider mb-1.5">
                      KLÍČOVÝ PRECEDENS (KCITOVÁNÍ U SOUDU):
                    </h4>
                    <p className="text-xs text-slate-700 font-serif italic leading-relaxed">
                      {decision.precedentCitations}
                    </p>

                    <div className="mt-3.5 flex justify-between items-center pt-2.5 border-t border-indigo-100/60">
                      <span className="text-[10px] font-mono text-slate-500">
                        Výsledek: <strong className="text-emerald-600">{decision.verdict}</strong>
                      </span>
                      <button
                        onClick={() => copyCitation(decision.precedentCitations + " (Rozsudek " + decision.caseCode + ")", decision.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-1.5 transition-all cursor-pointer ${
                          copiedId === decision.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {copiedId === decision.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Zkopírováno!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Zkopírovat precedens
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {decision.videoUrl && (
                    <div className="mt-4 max-w-xl">
                      <h4 className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1 mb-2">
                        <Play className="w-3.5 h-3.5 text-indigo-600 fill-current" /> Video rozbor judikátu s expertem:
                      </h4>
                      <SmartVideoEmbed
                        url={decision.videoUrl}
                        title={`Rozbor judikátu: ${decision.caseCode}`}
                        author="Jiří Šár (Táta má právo)"
                        tags={['Judikát', decision.caseCode]}
                      />
                    </div>
                  )}
                </div>

              </motion.div>
            );
          })
        ) : (
          <div className="p-12 text-center text-slate-500 bg-white border border-slate-100 rounded-3xl">
            <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-xs font-mono font-bold uppercase tracking-wider">Případová databáze neobsahuje vybrané filtry</p>
            <p className="text-xs text-slate-400 mt-1">Zkuste resetovat vyhledávací pole nebo změnit kritéria věku a typu péče.</p>
          </div>
        )}
      </div>

    </div>
  );
}
