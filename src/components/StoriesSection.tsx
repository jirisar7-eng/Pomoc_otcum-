/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Quote, 
  Heart, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  RefreshCw,
  BookOpen,
  Calendar,
  FileText,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Check,
  Scale,
  ExternalLink,
  ShieldAlert,
  Award,
  Copy,
  HelpCircle,
  FileCheck,
  Eye,
  AlertCircle,
  Clock
} from 'lucide-react';
import { ExperienceStory, User } from '../types';

interface StoriesSectionProps {
  currentUser: User | null;
  onStorySubmitted: (story: ExperienceStory) => void;
  externalStories: ExperienceStory[];
}

interface CaseStep {
  id: string;
  title: string;
  period: string;
  whatHappened: string;
  anonymizedDoc: {
    name: string;
    size: string;
    type: string;
  };
  lessonLearned: string;
  recommendation: string;
}

const CHRONOLOGICAL_CASE: CaseStep[] = [
  {
    id: 'case-1',
    title: 'Narození mladšího syna a fungující péče',
    period: 'Prosinec 2025',
    whatHappened: 'Když se vám narodí dítě, slíbíte mu, že tu pro něj budete vždycky. Že ho ochráníte, dáte mu stabilitu a budete jeho pevným přístavem. Když se nám 2. prosince 2025 narodil mladší syn, dělal jsem přesně to. Od jeho narození jsme měli s matkou nastavený režim, který skvěle a bezproblémově fungoval. O syna jsem pečoval od pondělí do středy a každý sudý pátek. Klid, stabilita, jasný řád pro dítě a fungující péče aktivního otce.',
    anonymizedDoc: {
      name: 'Dohoda_o_peci_od_narozeni_anonym.pdf',
      size: '180 KB',
      type: 'PDF'
    },
    lessonLearned: 'Aktivní otcovská péče od prvního dne života buduje hlubokou citovou vazbu, kterou nelze ničím nahradit. Pokud od začátku funguje stabilní rozdělení péče, je to nejlepší možný důkaz o výchovné způsobilosti otce.',
    recommendation: 'Udržujte si podrobné záznamy o tom, jak péče v praxi funguje (deník, fotografie, návštěvy lékaře). Vytváříte si tím nezpochybnitelný faktický stav, ze kterého by měl soud při rozhodování vycházet.'
  },
  {
    id: 'case-2',
    title: 'Rozsudek okresního soudu: Když soud popře sám sebe',
    period: 'Červen 2026',
    whatHappened: 'V červnu 2026 jsem stál před soudem s nadějí, že stát podpoří to, co už měsíce v praxi bez potíží fungovalo. Rozsudek z 9. června 2026 sice formálně svěřil mladšího syna do společné péče rodičů, ale to, co následovalo ve výroku o rozvržení péče, mi vyrazilo dech. Soudkyně v odůvodnění mluvila o tom, jak strašně důležitá je pro takto malé dítě kontinuita vazeb, a konstatovala, že nenašla žádnou odbornou překážku, proč by syn nemohl u mě, u svého táty, přespávat. A pak? V přímém rozporu se svými vlastními slovy a vědeckými poznatky, které sama citovala, mi v lichém týdnu přespávání syna bezdůvodně odepřela. Místo fungujícího režimu schválila roztříštěné bloky dní, které totálně zničily stabilitu dítěte, neúměrně zatížily oba rodiče a co je nejhorší – zcela odřízly kontakt mezi mladším synem a jeho starším bráchou, kterého mám v plné péči.',
    anonymizedDoc: {
      name: 'Rozsudek_Okresni_Soud_anonym.pdf',
      size: '540 KB',
      type: 'PDF'
    },
    lessonLearned: 'Soudy prvního stupně bohužel často podléhají alibismu a mateřským stereotypům. Jsou schopny v textu rozsudku uznat vaše kvality i důležitost přespávání, ale ve výroku vám přespávání zakázat nebo zredukovat na nesmyslné krátké bloky bez koncepce.',
    recommendation: 'Při vnitřně rozporném rozsudku okamžitě podejte odvolání. Poukazujte na přímý rozpor mezi odůvodněním rozsudku a jeho výrokem. Každý takový rozpor je zásadním procesním pochybením prvostupňového soudu.'
  },
  {
    id: 'case-3',
    title: 'Vytlačování z péče a zásahy asistenční služby',
    period: 'Červen - Červenec 2026',
    whatHappened: 'Papír snese všechno, ale realita všedních dnů nečeká. Od června 2026 se situace začala rapidně zhoršovat. Do péče začala aktivně vstupovat sociální asistenční služba a já začal být z procesu péče o vlastního syna systematicky vytlačován. Zažil jsem situace, kdy bylo nemocné dítě transportováno v rozporu s jakýmkoliv klidovým režimem a zdravým rozumem, jen aby se slepě naplnila litera nesmyslného a nevyváženého soudního rozhodnutí, které nezohledňuje reálné zdraví dítěte.',
    anonymizedDoc: {
      name: 'Zaznam_komunikace_asistence_anonym.pdf',
      size: '220 KB',
      type: 'PDF'
    },
    lessonLearned: 'Asymetrické rozsudky dávají jedné straně pocit absolutní převahy, což vede k systematickému vytlačování otce ze života dítěte. Organizace třetích stran, jako jsou asistenční služby, mohou být protistranou využívány k nátlaku namísto skutečné pomoci.',
    recommendation: 'Komunikujte výhradně písemně a věcně. V případě, kdy matka ohrožuje zdraví dítěte vynucenými transporty v nemoci, žádejte písemné stanovisko lékaře a doložte ho soudu.'
  },
  {
    id: 'case-4',
    title: 'Facka od OSPODu: Ignorování sourozenecké vazby',
    period: 'Červenec 2026',
    whatHappened: 'Největší facka přišla 7. července 2026 od OSPODu. Úřad, který má ze zákona hájit nejlepší zájem dítěte, ve svém vyjádření černé na bílém přiznal, že při svých návrzích vědomě ignoruje sourozenecké vazby. Pro státní aparát jako by moji dva synové nebyli bratři, kteří mají plné právo vyrůstat spolu, sdílet zážitky a budovat si celoživotní sourozenecké pouto.',
    anonymizedDoc: {
      name: 'Vyjadreni_OSPOD_anonym.pdf',
      size: '310 KB',
      type: 'PDF'
    },
    lessonLearned: 'OSPOD jako kolizní opatrovník může selhat a otevřeně ignorovat základní ústavní práva dětí, včetně práva na zachování sourozeneckých vazeb. Jejich doporučení však není pro soud slepě závazné.',
    recommendation: 'Pokud OSPOD vědomě ignoruje sourozenecké vazby, citujte konstantní judikaturu Ústavního soudu (např. nález I. ÚS 1506/13), který vysloveně zakazuje bezdůvodné rozdělování či separaci sourozenců.'
  },
  {
    id: 'case-5',
    title: 'Bleskové zamítnutí prozatímního opatření',
    period: '10. Července 2026',
    whatHappened: 'Když jsem podal návrh na prozatímní opatření, abych mladšího syna ochránil před chaosem a izolací, soud ho 10. července 2026 bleskově zamítl s tím, že „nedošlo k zásadní změně poměrů“. Proti tomuto bleskovému zamítnutí od stolu navíc nebylo přípustné standardní odvolání, což podtrhuje rigiditu celého systému, který odmítá pružně reagovat na akutní ohrožení stability dítěte.',
    anonymizedDoc: {
      name: 'Zamitnuti_Prozatimniho_Opatreni_anonym.pdf',
      size: '270 KB',
      type: 'PDF'
    },
    lessonLearned: 'Soudy prvního stupně se často schovávají za formulaci o „nezměněných poměrech“, aby nemusely přehodnocovat svá vlastní předchozí špatná rozhodnutí, i když v realitě dochází k vyhrocení situace.',
    recommendation: 'Nevzdávejte se. Zaznamenejte si toto zamítnutí jako další důkaz nečinnosti prvního stupně a předložte ho odvolacímu soudu jako ilustraci toho, že situace vyžaduje okamžitý zásah shora.'
  },
  {
    id: 'case-6',
    title: 'Boj pokračuje u Krajského soudu',
    period: 'Aktuální stav (Červenec 2026)',
    whatHappened: 'Aktuálně je celý spis na cestě ke Krajskému soudu. Bojuji dál. Připravuji nové návrhy, poukazuji na vnitřní rozpory v rozhodování soudů a odmítám se smířit s tím, že by moji synové měli doplatit na zvůli úředníků a nelogická rozhodnutí od stolu. Tento web vznikl jako platforma na podporu nás všech, tátů, kteří milují své děti a odmítají se vzdát své otcovské role.',
    anonymizedDoc: {
      name: 'Odvolani_ke_Krajskemu_Soud_anonym.pdf',
      size: '420 KB',
      type: 'PDF'
    },
    lessonLearned: 'Opatrovnický boj je psychicky extrémně náročný maraton. Klíčem je nenechat se zlomit nespravedlností, jednat vždy v zájmu dětí, zachovat chladnou hlavu a neustupovat ze svých práv.',
    recommendation: 'Využijte sdílené zkušenosti, právní vzory a judikaturu na tomto webu k přípravě své obhajoby. Spojte se s lidmi, kteří procházejí stejnou situací. Společně máme větší sílu!'
  }
];

export default function StoriesSection({ currentUser, onStorySubmitted, externalStories }: StoriesSectionProps) {
  // Navigation tabs for the stories area
  const [subTab, setSubTab] = useState<'my_case' | 'community'>('my_case');

  // Filter approved community stories
  const allStories = useMemo(() => {
    const seen = new Set<string>();
    return [...externalStories]
      .filter(s => s.approved && !s.reported)
      .filter(s => {
        if (!s || !s.id) return false;
        if (seen.has(s.id)) return false;
        seen.add(s.id);
        return true;
      });
  }, [externalStories]);

  // Case Step detail accordion state
  const [expandedStepId, setExpandedStepId] = useState<string>('case-1');

  // Share form states
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [spamAnswer, setSpamAnswer] = useState('');
  const [spamQuestion, setSpamQuestion] = useState({ num1: 5, num2: 5, answer: 10 });
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [downloadedDoc, setDownloadedDoc] = useState<string | null>(null);

  const handleRefreshSpam = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 2;
    setSpamQuestion({ num1: n1, num2: n2, answer: n1 + n2 });
    setSpamAnswer('');
  };

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim() || !authorName.trim()) {
      setError('Vyplňte prosím všechna povinná pole.');
      return;
    }

    if (content.length < 100) {
      setError('Příběh je příliš krátký (minimálně 100 znaků). Podělte se o více detailů.');
      return;
    }

    if (parseInt(spamAnswer) !== spamQuestion.answer) {
      setError('Kontrolní otázka proti spamu je nesprávná.');
      return;
    }

    const newStory: ExperienceStory = {
      id: 'story-' + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      content: content.trim(),
      authorName: authorName.trim(),
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      approved: false, // moderated!
      reported: false
    };

    onStorySubmitted(newStory);

    setTitle('');
    setContent('');
    setAuthorName('');
    setSpamAnswer('');
    setFormOpen(false);
    setShowSuccessModal(true);
    handleRefreshSpam();
  };

  const triggerDownload = (docName: string) => {
    setDownloadedDoc(docName);
    setTimeout(() => {
      setDownloadedDoc(null);
    }, 2000);
  };

  return (
    <div className="space-y-8" id="stories-section-root">
      
      {/* Sub tabs selection */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 flex gap-2 shadow-3xs justify-center sm:justify-start">
        <button
          onClick={() => setSubTab('my_case')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'my_case'
              ? 'bg-teal-50 text-teal-700 shadow-3xs border border-teal-100'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-teal-600" />
          Můj příběh (Chronologie případu)
        </button>
        <button
          onClick={() => setSubTab('community')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'community'
              ? 'bg-teal-50 text-teal-700 shadow-3xs border border-teal-100'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4 text-teal-600" />
          Zkušenosti ostatních rodičů ({allStories.length})
        </button>
      </div>

      {subTab === 'my_case' ? (
        <div className="space-y-8" id="chronological-case-view">
          {/* Core Interactive Vertical Timeline Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Timeline sidebar picker */}
            <div className="lg:col-span-4 relative border-l-2 border-slate-200 pl-4 space-y-4 ml-3">
              {CHRONOLOGICAL_CASE.map((step, idx) => {
                const isExpanded = expandedStepId === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setExpandedStepId(step.id)}
                    className="w-full text-left focus:outline-none block relative"
                    id={`case-step-btn-${step.id}`}
                  >
                    {/* Circle on line */}
                    <span className={`absolute -left-[25px] top-1.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isExpanded 
                        ? 'bg-teal-600 border-teal-600 ring-4 ring-teal-100/50 text-white' 
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}>
                      {isExpanded && <Check className="w-2.5 h-2.5" />}
                    </span>

                    <div className={`p-3 rounded-xl transition-all ${
                      isExpanded ? 'bg-white shadow-3xs border border-slate-150' : 'hover:bg-slate-50'
                    }`}>
                      <span className="text-[9px] text-slate-400 font-mono block uppercase">{step.period}</span>
                      <h4 className="text-xs font-bold text-slate-700 font-display mt-0.5">{step.title}</h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Step detail workspace panel */}
            <div className="lg:col-span-8">
              {(() => {
                const activeStep = CHRONOLOGICAL_CASE.find(s => s.id === expandedStepId);
                if (!activeStep) return null;
                return (
                  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs space-y-6" id="active-step-workspace">
                    {/* Header */}
                    <div className="border-b border-slate-50 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-mono uppercase bg-slate-50 text-slate-400 px-2.5 py-0.5 rounded-md border border-slate-100">{activeStep.period}</span>
                        <h3 className="text-lg font-bold text-[#3D3833] font-serif mt-1">{activeStep.title}</h3>
                      </div>
                      <span className="text-xs text-[#7D8F69] font-serif italic">Deník případu</span>
                    </div>

                    {/* What happened block */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Co se stalo:</span>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {activeStep.whatHappened}
                      </p>
                    </div>

                    {/* Anonymized document card */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 truncate max-w-xs">{activeStep.anonymizedDoc.name}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">{activeStep.anonymizedDoc.type} • {activeStep.anonymizedDoc.size} • Plně anonymizováno</span>
                        </div>
                      </div>

                      <button
                        onClick={() => triggerDownload(activeStep.anonymizedDoc.name)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-bold bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-3xs"
                      >
                        {downloadedDoc === activeStep.anonymizedDoc.name ? 'Staženo ✓' : 'Stáhnout dokument'}
                      </button>
                    </div>

                    {/* Lessons learned & recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                      
                      <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EBE7E0] space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Co jsem se naučil:
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {activeStep.lessonLearned}
                        </p>
                      </div>

                      <div className="bg-[#E6EBDD]/40 p-4 rounded-xl border border-[#D2DEC4] space-y-2">
                        <span className="text-[10px] uppercase font-bold text-[#7D8F69] tracking-wider font-mono flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#7D8F69]" />
                          Doporučení pro vás:
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {activeStep.recommendation}
                        </p>
                      </div>

                    </div>

                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      ) : (
        <div className="space-y-8" id="community-stories-view">
          {/* Community Intro Header */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Společná komunita</span>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Zkušenosti a příběhy rodičů</h2>
                </div>
              </div>
              
              <button
                id="open-story-form-btn"
                onClick={() => setFormOpen(!formOpen)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-teal-300" />
                Sdílet svůj příběh
              </button>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
              Rozchod a boj o děti jsou emočně vyčerpávající. Někdy nejvíce pomůže přečíst si zkušenosti lidí, kteří si prošli stejným opatrovnickým maratonem a našli klidné, funkční střídavé řešení. Všechny zaslané příběhy jsou anonymizované a moderované.
            </p>
          </div>

          {/* Success Modal */}
          {showSuccessModal && (
            <div id="story-success-modal" className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-md w-full shadow-xl text-center space-y-4">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto border border-teal-100">
                  <CheckCircle2 className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-slate-800 font-display text-lg">Příběh odeslán k moderaci</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Děkujeme vám za sdílení vaší zkušenosti! Z důvodu ochrany nezletilých dětí, zamezení spamu a nevhodným útokům každý text před schválením prochází rychlou kontrolou administrátorem. Jakmile ho schválíme, ihned se objeví na portálu.
                </p>
                <button
                  id="close-success-modal-btn"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Rozumím
                </button>
              </div>
            </div>
          )}

          {/* Form write story */}
          {formOpen && (
            <motion.div
              id="story-submission-form-card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white rounded-2xl border border-teal-100 p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-1.5 border-b border-slate-50 pb-3">
                <Sparkles className="w-4.5 h-4.5 text-teal-600" />
                <h3 className="font-bold text-slate-800 text-sm font-display">Napsat anonymní příběh do portálu</h3>
              </div>

              <form onSubmit={handleSubmitStory} className="space-y-4" id="submit-story-form">
                {error && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs p-3 rounded-xl" id="story-form-error">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600">Název příběhu</label>
                    <input
                      id="story-input-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Např. Jak jsme s matkou dcery vyjednali střídavku"
                      className="w-full px-3 py-2 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600">Podpis autora (může být anonymní)</label>
                    <input
                      id="story-input-author"
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Např. Máma Radka z Kolína / Bojující táta"
                      className="w-full px-3 py-2 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">Obsah příběhu (co se stalo a co vám pomohlo)</label>
                  <textarea
                    id="story-input-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Podělte se o své zkušenosti. Vaše konkrétní rady mohou dodat odvahu dalším rodičům, kteří právě prochází krizí..."
                    rows={6}
                    className="w-full px-4 py-3 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none resize-none transition-all"
                  />
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      Ochrana proti robotům: {spamQuestion.num1} + {spamQuestion.num2} =
                    </span>
                    <input
                      id="story-spam-input"
                      type="text"
                      value={spamAnswer}
                      onChange={(e) => setSpamAnswer(e.target.value)}
                      placeholder="?"
                      className="w-12 px-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-center outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleRefreshSpam}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      id="cancel-story-form"
                      type="button"
                      onClick={() => setFormOpen(false)}
                      className="px-4 py-2 text-slate-500 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                    >
                      Zrušit
                    </button>
                    <button
                      id="submit-story-btn"
                      type="submit"
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-teal-200" />
                      Odeslat ke schválení
                    </button>
                  </div>
                </div>

                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-100 flex gap-2">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-800 leading-relaxed">
                    <strong>Pravidla schválení:</strong> Nepište celá reálná příjmení dětí, bývalých partnerů ani konkrétních jmen soudců či OSPOD pracovníků. Takové příspěvky nemohou být zveřejněny. Děkujeme za ochranu dětí.
                  </p>
                </div>
              </form>
            </motion.div>
          )}

          {/* Stories Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="stories-feed-list">
            {allStories.length === 0 ? (
              <div className="col-span-2 bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-400 shadow-2xs">
                Zatím zde nejsou žádné schválené příběhy. Budeme rádi, pokud se podělíte o ten svůj!
              </div>
            ) : (
              allStories.map((story) => (
                <div key={story.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-teal-100 shadow-2xs flex flex-col justify-between transition-colors relative" id={`story-card-${story.id}`}>
                  <Quote className="w-10 h-10 text-teal-100/60 absolute top-4 right-4" />
                  
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-800 font-display text-base pr-8">{story.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed italic whitespace-pre-wrap">
                      "{story.content}"
                    </p>
                  </div>

                  <div className="border-t border-slate-50 pt-4 mt-5 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-700">{story.authorName}</span>
                      <span className="block text-[10px] text-slate-400">{story.date}</span>
                    </div>

                    <button
                      id={`story-like-${story.id}`}
                      onClick={() => onStorySubmitted({ ...story, likes: story.likes + 1, approved: true })} // incremental updater
                      className="flex items-center gap-1 text-slate-400 hover:text-teal-600 text-xs font-bold transition-colors"
                    >
                      <Heart className="w-4 h-4 text-rose-400 shrink-0 fill-rose-100" />
                      <span>{story.likes}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
