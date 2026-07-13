/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Scale, 
  FileSpreadsheet, 
  Compass, 
  MessageCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Users2,
  AlertTriangle
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (tabId: string) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export default function HeroSection({ onNavigate, onOpenAuth, isLoggedIn }: HeroSectionProps) {
  const steps = [
    { title: '1. Dohoda rodičů', desc: 'Nejšetrnější řešení pro obě strany a hlavně dítě.', status: 'Klíčový krok' },
    { title: '2. Podání návrhu', desc: 'Sepsání a odeslání návrhu k příslušnému okresnímu soudu.', status: 'Právní zahájení' },
    { title: '3. Jednání s OSPOD', desc: 'Sociální šetření, rozhovor o zázemí a zájmech dítěte.', status: 'Opatrovník' },
    { title: '4. Soudní slyšení', desc: 'Dokazování, slyšení rodičů a vynesení samotného rozsudku.', status: 'Finální rozhodnutí' }
  ];

  return (
    <div className="space-y-12">
      
      {/* Hero Banner Section */}
      <section className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 lg:p-10 relative overflow-hidden shadow-2xs" id="home-hero-banner">
        {/* Background visual abstract graphics */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-50 rounded-full blur-3xl -z-10 opacity-60 -translate-x-20 translate-y-20"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold border border-teal-100/50"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Opatrovnický průvodce a komunitní portál</span>
            </motion.div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight font-display leading-tight" id="hero-title">
              Když jako táta bojuješ o své dítě, <span className="text-teal-600 block sm:inline">neměl bys být sám.</span>
            </h1>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl" id="hero-description">
              Stojíme pevně na straně aktivních tátů. Opatrovnický systém v ČR (soudy a OSPOD) často podléhá zažitým mateřským stereotypům, které otce odsouvají na vedlejší kolej jako víkendové návštěvníky. Nabízíme vám věcné návody, prověřené právní vzory a judikaturu, které vám pomohou uhájit právo vašeho dítěte na oba milující rodiče a vybojovat spravedlivou střídavou péči.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-cta-advice"
                onClick={() => onNavigate('soudni-rizeni')}
                className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-slate-800 text-white font-semibold text-xs rounded-xl shadow-md hover:from-teal-700 hover:to-slate-900 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Začít číst
                <ArrowRight className="w-3.5 h-3.5 text-teal-300" />
              </button>
              <button
                id="hero-cta-story"
                onClick={() => onNavigate('stories')}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
              >
                Můj příběh
                <Users2 className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                id="hero-cta-docs"
                onClick={() => onNavigate('ke-stazeni')}
                className="px-5 py-2.5 bg-teal-50 border border-teal-100/50 text-teal-800 hover:bg-teal-100/40 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
              >
                Vzory dokumentů
                <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-600/10 to-slate-800/10 rounded-2xl -rotate-1 scale-[1.02] -z-10 blur-xs"></div>
            <img
              src="/src/assets/images/father_and_child_hero_1783886957826.jpg"
              alt="Otec se svým malým synem"
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-md border border-slate-100"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" id="core-principles-section">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-teal-200 shadow-2xs transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 font-display mb-2">Péče o dítě a střídání</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Dítě potřebuje pro zdravý vývoj oba rodiče. Pomáháme vám prozkoumat rotační modely (7-7, 2-2-3) a naplánovat bezkonfliktní předávání dětí.
            </p>
          </div>
          <button onClick={() => onNavigate('pece-o-dite')} className="text-teal-600 hover:text-teal-700 text-xs font-semibold flex items-center gap-1 mt-4 group">
            Plánovač střídavých cyklů <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-teal-200 shadow-2xs transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 font-display mb-2">Bezplatné vzory podání</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Připravte si mimosoudní dohodu, návrh na střídavou péči k okresnímu soudu nebo naléhavé předběžné opatření díky našim vzorům.
            </p>
          </div>
          <button onClick={() => onNavigate('ke-stazeni')} className="text-teal-600 hover:text-teal-700 text-xs font-semibold flex items-center gap-1 mt-4 group">
            Prohlížet vzory podání <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-teal-200 shadow-2xs transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 font-display mb-2">Desatero jednání s OSPOD</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Jak se chovat při místním šetření u vás doma, na co si dát pozor při rozhovoru se sociální pracovnicí a jaká jsou vaše zákonná práva.
            </p>
          </div>
          <button onClick={() => onNavigate('ospod')} className="text-teal-600 hover:text-teal-700 text-xs font-semibold flex items-center gap-1 mt-4 group">
            Příprava na OSPOD <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* Process Timeline Checklist */}
      <section className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs" id="proceedings-timeline">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Metodika řízení</span>
            <h3 className="text-xl font-bold text-slate-800 font-display">Standardní cesta opatrovnického procesu</h3>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-medium text-slate-600">Garance odborného a nestranného obsahu</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Timeline Connector Line */}
          <div className="hidden lg:block absolute top-[26px] left-[15%] right-[15%] h-0.5 bg-slate-100 -z-10"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 relative hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm mb-3 shadow-sm">
                {idx + 1}
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">{step.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-2">{step.desc}</p>
              <span className="inline-block text-[9px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md uppercase">
                {step.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Statistics Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="portal-quick-stats">
        {[
          { value: '75%', label: 'Vyšší stabilita dohod', desc: 'oproti autoritativním rozsudkům' },
          { value: '100%', label: 'Nestrannost', desc: 'vyvážená podpora matky i otce' },
          { value: '8+', label: 'Právních vzorů', desc: 'připravených pro podání k soudu' },
          { value: '24/7', label: 'AI Asistent', desc: 'připraven zodpovědět dotazy' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 text-center">
            <span className="block text-2xl md:text-3xl font-extrabold text-teal-600 font-display mb-1">{stat.value}</span>
            <span className="block text-xs font-bold text-slate-800 mb-0.5">{stat.label}</span>
            <span className="block text-[10px] text-slate-400">{stat.desc}</span>
          </div>
        ))}
      </section>

      {/* Cooperative Coparenting Focus CTA */}
      <section className="bg-gradient-to-r from-slate-800 via-slate-900 to-teal-950 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden" id="coparenting-cta-banner">
        <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500 rounded-full blur-3xl opacity-20 -translate-y-10"></div>
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Users2 className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-lg md:text-xl font-display">Společné rodičovství rozchodem nekončí</h3>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Statistiky dokazují, že děti, jejichž rodiče i po rozvodu spolupracují a respektují se, zažívají podstatně méně úzkostí a v dospělosti vykazují vyšší míru stability. Naším cílem je vybudovat komunitu spolupracujících, odpovědných rodičů.
          </p>
        </div>
        <button
          id="cta-join-community"
          onClick={() => isLoggedIn ? onNavigate('forum') : onOpenAuth()}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer"
        >
          {isLoggedIn ? 'Přejít do diskuse' : 'Založit si účet zdarma'}
        </button>
      </section>

      {/* Právní prohlášení, podmínky užívání & vyloučení odpovědnosti */}
      <section className="bg-amber-50/60 border border-amber-200/60 rounded-3xl p-6 md:p-8 space-y-4" id="legal-disclaimer-home">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-800 font-display text-xs">Upozornění autora, podmínky užívání & vyloučení odpovědnosti</h3>
              <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider scale-90">Právní doložka</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Tento portál <strong>Táta má právo</strong> stavím jako soukromá osoba na základě svých osobních zkušeností získaných v náročném boji s opatrovnickými úřady, soudy, OSPODem a matkou mého dítěte. K analýzám a preciznímu zpracování textů, vzorů podání i judikatury využívám nejmodernější <strong>nástroje umělé inteligence (AI)</strong> a relevantní odborné, vědecké i judikatorní zdroje (např. konsenzuální zprávy Dr. Warshaka či studie prof. Fabriciuse).
            </p>
            <p className="text-slate-600 text-xs leading-relaxed">
              <strong>Důležité varování: Nejsem právník, advokát, psycholog ani nemám odpovídající formální vzdělání v těchto oborech.</strong> Všechny informace, texty, vzory dokumentů, doporučení, kalkulačky a výpočty na tomto webu mají <strong>výhradně informační a podpůrný charakter</strong> a nepředstavují odbornou právní pomoc, právní poradenství ani závazné posudky.
            </p>
            <p className="text-slate-700 text-xs leading-relaxed font-semibold">
              <strong>Souhlas s podmínkami užívání:</strong> Užíváním tohoto webu berete na vědomí a výslovně souhlasíte s tím, že veškeré materiály a informace používáte na vlastní nebezpečí a je nutné je vždy důkladně kontrolovat a revidovat s ohledem na možné chyby. Jako autor nenesu žádnou odpovědnost za případné věcné či právní chyby, nepřesnosti ani za jakékoliv přímé či nepřímé následky nebo škody vzniklé v důsledku použití informací, vzorů či doporučení z tohoto portálu ve vašem opatrovnickém řízení. Vždy doporučuji konzultovat vaše konkrétní podání s kvalifikovaným advokátem.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
