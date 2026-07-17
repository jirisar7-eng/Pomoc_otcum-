import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, GraduationCap, Play, CheckCircle2, Award, ArrowRight, HelpCircle, AlertTriangle, Check, X, RefreshCw } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Začátečník' | 'Pokročilý' | 'Expert';
  lessonsCount: number;
  description: string;
  chapters: string[];
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Komunikační detox: Jak komunikovat s ex-partnerem bez konfliktů',
    duration: '45 min',
    difficulty: 'Začátečník',
    lessonsCount: 4,
    description: 'Praktický průvodce komunikací v krizových situacích. Naučíte se metodu B.I.F.F. (Brief, Informative, Friendly, Firm), jak odpovídat na útočné SMS a jak izolovat dítě od rodičovských sporů.',
    chapters: [
      'Pravidla písemné komunikace (metoda B.I.F.F.)',
      'Jak reagovat na bezdůvodná obvinění',
      'Zavedení komunikační aplikace pro spolurodiče',
      'Předávání dětí bez slovních střetů'
    ]
  },
  {
    id: 'course-2',
    title: 'Soudní síň: Jak vystupovat před soudcem a opatrovníkem',
    duration: '60 min',
    difficulty: 'Pokročilý',
    lessonsCount: 5,
    description: 'Detailní příprava na soudní jednání. Co si obléknout, jak správně oslovovat soudce, jak věcně odpovídat bez emocí a jak reagovat na provokační otázky protistrany.',
    chapters: [
      'Etiketa a oblékání v soudní síni',
      'Struktura výpovědi otce krok za krokem',
      'Práce s emocemi a zvládání stresu pod tlakem',
      'Jak podávat důkazy v reálném čase',
      'Závěrečný návrh a shrnutí případu'
    ]
  },
  {
    id: 'course-3',
    title: 'OSPOD šetření v domácnosti: Práva, povinnosti a strategie',
    duration: '35 min',
    difficulty: 'Expert',
    lessonsCount: 3,
    description: 'Kompletní taktická příprava na domácí návštěvu sociální pracovnice. Co kontrolovat v bytě, jak mluvit s dítětem před návštěvou a jaká jsou vaše nezadatelná ústavní práva.',
    chapters: [
      'Příprava bytových prostor (hygiena, dětský pokoj)',
      'Jak sociální pracovnice zjišťuje vazbu dítěte k otci',
      'Vaše právo na nahrávání návštěvy a pořizování záznamu'
    ]
  }
];

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'Jaká je role kolizního opatrovníka (OSPOD) u soudu?',
    options: [
      'Zastupuje zájmy matky jako primárního pečovatele.',
      'Zastupuje zájmy nezletilého dítěte a podává soudu nestranné doporučení.',
      'Funguje jako právní zástupce otce.',
      'Rozhoduje o výši výživného namísto soudce.'
    ],
    correctIdx: 1,
    explanation: 'OSPOD u soudu nevystupuje jako zástupce ani jednoho z rodičů. Jeho jedinou zákonnou povinností je hájit nejlepší zájmy nezletilého dítěte a poskytnout soudu objektivní zprávu.'
  },
  {
    id: 2,
    text: 'Co znamená komunikační metoda B.I.F.F. doporučovaná psychology?',
    options: [
      'Bold, Interactive, Fast, Furious — rychlá a agresivní reakce.',
      'Brief, Informative, Friendly, Firm — stručná, věcná, přátelská a pevná odpověď.',
      'Backup, Ignore, Filter, Focus — ignorování zpráv a focusing na soud.',
      'Business, Intellectual, Formal, Factual — složitá právní mluva.'
    ],
    correctIdx: 1,
    explanation: 'Metoda B.I.F.F. (Brief, Informative, Friendly, Firm) pomáhá tlumit konflikt. Zprávy mají být krátké, bez emocí, slušné a s jasně vymezenými hranicemi.'
  },
  {
    id: 3,
    text: 'Máte právo pořídit si zvukový záznam z jednání na úřadě OSPOD?',
    options: [
      'Ne, je to přísně zakázáno pod pokutou.',
      'Ano, občan má právo pořizovat si audiozáznam ze všech jednání s orgány veřejné moci pro ochranu svých práv.',
      'Pouze se souhlasem všech přítomných úředníků.',
      'Pouze pokud máte písemné povolení od opatrovnického soudce.'
    ],
    correctIdx: 1,
    explanation: 'Podle judikatury a správního řádu máte plné právo pořizovat si zvukový záznam z úředních jednání za účelem ochrany svých práv. Souhlas úředníka k tomuto účelu není vyžadován.'
  },
  {
    id: 4,
    text: 'Jaký vliv má komunikační konflikt rodičů na možnost nařízení střídavé péče?',
    options: [
      'Jakýkoliv konflikt automaticky střídavou péči vylučuje.',
      'Soud střídavou péči nenařídí, pokud s ní matka nesouhlasí.',
      'Konflikt rodičů sám o sobě není důvodem pro vyloučení střídavé péče, pokud je střídavka v zájmu dítěte (dle Ústavního soudu).',
      'Rozhoduje výhradně stanovisko dětského lékaře.'
    ],
    correctIdx: 2,
    explanation: 'Ústavní soud ČR opakovaně judikoval, že samotná absence komunikace či konflikt mezi rodiči nemůže být automatickým důvodem pro zamítnutí střídavé péče, jinak by se jednalo o právo veta jednoho z rodičů.'
  }
];

export default function VzdelavaniSection() {
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  // Quiz State
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleLessonToggle = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(completedLessons.filter(l => l !== lessonId));
    } else {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const handleAnswerClick = (idx: number) => {
    if (selectedAnswer !== null) return; // Answer already selected
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === QUIZ_QUESTIONS[currentQuestion].correctIdx) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuestion + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizScore(0);
    setQuizFinished(false);
    setQuizStarted(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="vzdelavaci-akademie-section">
      
      {/* Academy Header */}
      <div className="bg-gradient-to-tr from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 relative overflow-hidden shadow-lg border border-teal-500/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/25 border border-teal-400/30 rounded-full text-[11px] font-mono uppercase tracking-wider text-teal-300 font-bold">
            <GraduationCap className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> Edukační akademie pro rodinné spory
          </div>
          <h2 className="text-xl md:text-3xl font-black font-display tracking-tight leading-tight">
            Vzdělávání & Akademie tátů
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Staňte se klidným, vyrovnaným a dokonale informovaným rodičem. Naše akademie vás připraví na psychologický nátlak, naučí vás komunikovat bez konfliktů a pomůže vám úspěšně projít soudním i opatrovnickým řízením.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Courses */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-extrabold text-sm md:text-base text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-600" /> Interaktivní Kurzy a Lekce
          </h3>

          <div className="grid grid-cols-1 gap-6">
            {COURSES.map(course => {
              const isOpen = activeCourse === course.id;
              return (
                <div 
                  key={course.id}
                  className={`bg-white border rounded-2xl p-5 transition-all shadow-3xs hover:shadow-xs ${
                    isOpen ? 'border-teal-500/60 ring-4 ring-teal-500/5' : 'border-slate-150'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-700">
                          {course.difficulty}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ⏱️ {course.duration} • {course.lessonsCount} témat
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm md:text-base leading-tight mt-1">
                        {course.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => setActiveCourse(isOpen ? null : course.id)}
                      className={`p-2 rounded-xl transition-all cursor-pointer font-bold text-xs flex items-center gap-1 ${
                        isOpen ? 'bg-slate-100 text-slate-800' : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      {isOpen ? 'Zavřít' : 'Otevřít lekci'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Expand chapters/lessons */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-4 pt-4 border-t border-slate-100 space-y-3"
                      >
                        <h5 className="text-[10px] font-mono font-extrabold text-teal-600 uppercase tracking-wider">
                          Osnova studia a praktická cvičení:
                        </h5>
                        <div className="space-y-2">
                          {course.chapters.map((chap, idx) => {
                            const uniqueId = `${course.id}-${idx}`;
                            const isDone = completedLessons.includes(uniqueId);
                            return (
                              <div 
                                key={idx}
                                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                                  isDone ? 'bg-teal-50/40 border-teal-200' : 'bg-slate-50/50 border-slate-100'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center font-mono">
                                    {idx + 1}
                                  </span>
                                  <span className="text-xs font-semibold text-slate-700 leading-snug">
                                    {chap}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleLessonToggle(uniqueId)}
                                  className={`p-1 rounded-lg transition-all cursor-pointer ${
                                    isDone ? 'bg-teal-100 text-teal-800' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600'
                                  }`}
                                  title={isDone ? "Označit jako nehotové" : "Dokončit téma"}
                                >
                                  {isDone ? <CheckCircle2 className="w-4 h-4 text-teal-600" /> : <Check className="w-4 h-4" />}
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Congratulatory course progression */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-500">
                            Postup kurzem:{' '}
                            <strong>
                              {course.chapters.filter((_, idx) => completedLessons.includes(`${course.id}-${idx}`)).length} / {course.lessonsCount}
                            </strong>
                          </span>
                          <button
                            onClick={() => alert('Plná verze certifikátu bude vygenerována po splnění všech 3 modulů.')}
                            className="text-xs font-bold text-teal-600 hover:text-teal-700 font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            Získat Certifikát <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Custody Proceedings Quiz */}
        <div className="space-y-6">
          <h3 className="font-extrabold text-sm md:text-base text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600 animate-bounce" /> Právní kvíz: Otestujte se
          </h3>

          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />

            {!quizStarted && !quizFinished ? (
              <div className="space-y-4 text-center py-4">
                <HelpCircle className="w-12 h-12 text-teal-400 mx-auto animate-pulse" />
                <h4 className="font-extrabold text-sm uppercase tracking-wide">
                  KVÍZ OPATROVNICKÝCH ZNALOSTÍ
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Prověřte si své vědomosti v oblasti procesního práva, práv dítěte, fungování OSPOD a taktické komunikace před nástupem k soudu.
                </p>
                <button
                  onClick={() => setQuizStarted(true)}
                  className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all"
                >
                  Spustit test znalostí
                </button>
              </div>
            ) : quizFinished ? (
              <div className="space-y-4 text-center py-4">
                <Award className="w-12 h-12 text-teal-400 mx-auto" />
                <h4 className="font-black text-sm uppercase tracking-wide">
                  KVÍZ JE DOKONČEN!
                </h4>
                <p className="text-xs font-mono">
                  Vaše skóre: <strong className="text-teal-400 text-base">{quizScore}</strong> / {QUIZ_QUESTIONS.length} správně
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {quizScore === QUIZ_QUESTIONS.length 
                    ? 'Gratulujeme! Máte naprosto excelentní přehled o svých právech a soudních procedurách.' 
                    : 'Doporučujeme prostudovat si kapitoly Vzdělávání a Precedenty judikatury k posílení vašich argumentů.'}
                </p>
                <button
                  onClick={resetQuiz}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-705 text-white border border-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Spustit znovu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Question progress */}
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>OTÁZKA {currentQuestion + 1} Z {QUIZ_QUESTIONS.length}</span>
                  <span className="text-teal-400 font-bold">SKÓRE: {quizScore}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-400 transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>

                {/* Question Text */}
                <h5 className="font-bold text-xs md:text-sm text-white leading-snug">
                  {QUIZ_QUESTIONS[currentQuestion].text}
                </h5>

                {/* Options list */}
                <div className="space-y-2 pt-2">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === QUIZ_QUESTIONS[currentQuestion].correctIdx;
                    
                    let btnClass = 'bg-slate-800 border-slate-750 text-slate-200 hover:bg-slate-750';
                    if (selectedAnswer !== null) {
                      if (isCorrect) btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-100';
                      else if (isSelected) btnClass = 'bg-rose-950/80 border-rose-500 text-rose-100';
                      else btnClass = 'bg-slate-800/40 border-slate-800 text-slate-400 opacity-60';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerClick(idx)}
                        disabled={selectedAnswer !== null}
                        className={`w-full p-3 rounded-xl border text-left text-xs leading-snug font-medium transition-all cursor-pointer flex justify-between items-center ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {selectedAnswer !== null && (
                          isCorrect ? <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" /> :
                          isSelected ? <X className="w-4 h-4 text-rose-400 shrink-0 ml-2" /> : null
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation detail */}
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-slate-850 border border-slate-800 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center gap-1 text-[10px] font-mono text-teal-400 font-bold uppercase">
                      <AlertTriangle className="w-3.5 h-3.5" /> Vysvětlení a doporučení:
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                      {QUIZ_QUESTIONS[currentQuestion].explanation}
                    </p>
                    <button
                      onClick={handleNextQuestion}
                      className="mt-2 w-full py-1.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-[10px] uppercase rounded-lg tracking-wider cursor-pointer transition-colors"
                    >
                      {currentQuestion + 1 === QUIZ_QUESTIONS.length ? 'Vyhodnotit kvíz' : 'Další otázka'}
                    </button>
                  </motion.div>
                )}

              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
