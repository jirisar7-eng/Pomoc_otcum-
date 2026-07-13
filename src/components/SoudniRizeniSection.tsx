/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Gavel, Clock, ChevronRight, HelpCircle, AlertCircle, FileText, Sparkles } from 'lucide-react';

interface Stage {
  number: string;
  title: string;
  duration: string;
  summary: string;
  whatHappens: string[];
  tips: string[];
}

const STAGES: Stage[] = [
  {
    number: '01',
    title: 'Podání návrhu k soudu',
    duration: 'Zahájení řízení',
    summary: 'Řízení začíná dnem podání písemného návrhu na úpravu poměrů k nezletilému dítěti. Návrh se podává k okresnímu soudu v místě bydliště dítěte.',
    whatHappens: [
      'Vypracování návrhu (střídavá péče, výše výživného, případná úprava styku).',
      'Podání návrhu buď osobně na podatelně, poštou, nebo nejrychleji přes datovou schránku.',
      'Soud neplatí žádný soudní poplatek (řízení je od poplatků osvobozeno).',
      'Soud následně ustanoví OSPOD jako kolizního opatrovníka dítěte a zašle návrh druhému rodiči k vyjádření.'
    ],
    tips: [
      'Návrh koncipujte věcně, bez urážek. Popište svůj vztah k dítěti, jak o něj pečujete a jak máte zajištěné bydlení.',
      'Přiložte klíčové důkazy hned k návrhu (např. rozpis vašich pracovní směn, fotky dětského pokoje).',
      'Pokud protistrana blokuje styk s dítětem, podejte současně s hlavním návrhem i „Návrh na předběžné opatření“ (§ 74 OSŘ), o kterém musí soud rozhodnout do 7 dnů.'
    ]
  },
  {
    number: '02',
    title: 'Šetření OSPOD a vyjádření',
    duration: '1–3 měsíce od podání',
    summary: 'Před samotným nařízením jednání provede OSPOD pohovory s oběma rodiči a navštíví jejich domácnosti. Zjišťuje stanoviska obou stran.',
    whatHappens: [
      'Návštěva sociální pracovnice u vás doma (tzv. šetření v bytě).',
      'Pohovor s oběma rodiči na úřadě OSPOD (obvykle odděleně).',
      'OSPOD může mluvit i přímo s dítětem (ve škole nebo na úřadě) bez přítomnosti rodičů, pokud je k tomu věkově zralé.',
      'Vypracování písemné zprávy pro soud s předběžným doporučením péče.'
    ],
    tips: [
      'Buďte maximálně vstřícní a připravení. Mějte uklizeno, nakoupeno a připravenou dětskou postýlku a kout.',
      'Doložte OSPODu, že chcete s druhým rodičem spolupracovat a dohodnout se. Nabídněte mediaci jako první.',
      'Pravidelně nahlížejte do soudního spisu a spisu OSPODu, abyste včas věděli, co protistrana uvádí.'
    ]
  },
  {
    number: '03',
    title: 'První soudní stání',
    duration: '2–4 měsíce od podání',
    summary: 'Soud nařídí první ústní jednání. Cílem soudce je zjistit, zda je možná dohoda mezi rodiči a nastavit pravidla pro další dokazování.',
    whatHappens: [
      'Formální zahájení, přednesení návrhů obou rodičů.',
      'Předběžný výslech obou rodičů ohledně jejich představ o péči a výživném.',
      'Přednesení stanoviska OSPODu jako kolizního opatrovníka.',
      'Pokud je shoda, soud může schválit dohodu ihned rozsudkem. Pokud shoda není, soud nařídí dokazování a může nařídit asistovaný styk či mediaci.'
    ],
    tips: [
      'Oblečte se společensky, přijďte s dostatečným předstihem a zachovejte klid.',
      'Mluvte přímo k soudci, ne k druhému rodiči. Neodpovídejte na provokace protistrany.',
      'Pokud soudce tlačí na dohodu, která pro vás není výhodná (např. styk jednou za 14 dní), neustupujte pod tlakem. Trvejte na střídavé péči a nařízení dokazování.'
    ]
  },
  {
    number: '04',
    title: 'Dokazování a znalecké posudky',
    duration: '3–12 měsíců (pokud je spor)',
    summary: 'Pokud se rodiče nedohodnou, soud přistoupí k podrobnému dokazování. Zkoumá se způsobilost obou rodičů a vazby dítěte.',
    whatHappens: [
      'Výslechy svědků (prarodiče, učitelé, noví partneři).',
      'Vyžádání zpráv ze školky/školy, od dětského lékaře nebo psychologa.',
      'V extrémních sporech soud nařídí vypracování znaleckého posudku z oboru dětské psychologie a psychiatrie.',
      'Výslech soudního znalce v soudní síni.'
    ],
    tips: [
      'Znalecký posudek je drahý (stojí desítky tisíc) a prodlouží soud o půl roku. Při testech u znalce buďte upřímní, uvolnění a mluvte výhradně o blahu dítěte, ne o chybách ex-partnera.',
      'Pokud učitelé nebo lékař píší zprávy, zajistěte si, aby byly objektivní. Nabídněte jim schůzku a vysvětlete, že se aktivně zapojujete.',
      'Trvejte na tom, aby byl u soudu zohledněn názor dítěte, pokud je starší 10-12 let.'
    ]
  },
  {
    number: '05',
    title: 'Rozsudek a případné odvolání',
    duration: 'Konec prvního stupně',
    summary: 'Soudce na základě dokazování vynese rozsudek. Ten nabývá právní moci doručením oběma stranám, pokud se neodvolají.',
    whatHappens: [
      'Ústní vyhlášení rozsudku soudcem v soudní síni včetně stručného odůvodnění.',
      'Doručení písemného vyhotovení rozsudku oběma rodičům (může trvat i 30-60 dnů).',
      'Lhůta 15 dnů od doručení písemného rozsudku pro podání odvolání ke krajskému soudu.',
      'Případné odvolací řízení u krajského soudu (rozhodne většinou za 3–6 měsíců).'
    ],
    tips: [
      'Rozsudek si v klidu přečtěte se svým právním zástupcem. Ústní odůvodnění v síni se může mírně lišit od písemného vyhotovení.',
      'Pokud soud střídavou péči zamítl z banálních důvodů (např. že spolu s matkou nekomunikujete), podejte odvolání. Krajské soudy a Ústavní soud bývají v otázce střídavé péče podstatně liberálnější.',
      'I po rozsudku lze poměry kdykoliv v budoucnu změnit novým návrhem, pokud dojde ke „změně poměrů“ (např. dítě povyroste, změní se práce).'
    ]
  }
];

export default function SoudniRizeniSection() {
  const [selectedStage, setSelectedStage] = useState<number>(0);

  return (
    <div className="space-y-8" id="soudni-rizeni-container">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Právní proces</span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Průvodce soudním řízením</h2>
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
          Opatrovnické řízení o dětech má svá pevná pravidla a fáze. Nemusíte se soudu obávat, pokud víte, co vás v jednotlivých krocích čeká. Projděte si interaktivního průvodce od podání prvního návrhu až po konečný rozsudek a odvolání.
        </p>
      </div>

      {/* Main Roadmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Interactive Timeline Steps */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2 font-mono">Fáze soudního sporu</span>
          
          <div className="space-y-3">
            {STAGES.map((stage, idx) => {
              const isSelected = selectedStage === idx;
              return (
                <button
                  id={`stage-button-${idx}`}
                  key={idx}
                  onClick={() => setSelectedStage(idx)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                    isSelected 
                      ? 'bg-teal-50 border-teal-200 shadow-3xs text-teal-900' 
                      : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-teal-600 text-white' : 'bg-slate-50 text-slate-500'
                    }`}>
                      {stage.number}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold font-display leading-tight">{stage.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {stage.duration}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    isSelected ? 'text-teal-600 translate-x-1' : 'text-slate-300'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Stage Detailed Workspace Panel */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs space-y-6 min-h-[450px] flex flex-col justify-between" id="active-stage-details">
            <div className="space-y-5">
              
              {/* Header inside details */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-teal-600 font-mono uppercase bg-teal-50 px-2.5 py-1 rounded-md">Krok {STAGES[selectedStage].number}</span>
                  <h3 className="text-lg font-bold text-slate-800 font-display">{STAGES[selectedStage].title}</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono italic">{STAGES[selectedStage].duration}</span>
              </div>

              {/* Summary description */}
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {STAGES[selectedStage].summary}
              </p>

              {/* What happens list */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Průběh této fáze:</span>
                <ul className="space-y-2 pl-1">
                  {STAGES[selectedStage].whatHappens.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tactics and advice section */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150/50 space-y-3">
                <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider font-mono flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  Klíčové rady pro úspěch v této fázi:
                </span>
                <ul className="space-y-2">
                  {STAGES[selectedStage].tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                      <span className="text-teal-600 font-bold shrink-0">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Bottom help banner */}
            <div className="border-t border-slate-50 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                Máte k tomuto kroku konkrétní dotaz?
              </span>
              <button 
                onClick={() => {
                  const queryInput = document.getElementById('global-search-input');
                  if (queryInput) {
                    queryInput.focus();
                    (queryInput as HTMLInputElement).value = STAGES[selectedStage].title;
                  }
                  const aiBtn = document.getElementById('ai-assistant-toggle');
                  if (aiBtn) aiBtn.click();
                }}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 hover:underline"
              >
                Zeptat se AI na detaily k této fázi →
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Psychological Warning Footer banner */}
      <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex gap-3.5">
        <HelpCircle className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-indigo-900 text-xs font-display">Doporučení psychologa: Chraňte dítě před soudem</h4>
          <p className="text-indigo-700 text-xs leading-relaxed">
            Nikdy neřešte detaily soudních spisů, výslechů nebo prohřešků druhého rodiče před dětmi. Děti mají silný konflikt loajality a nesmí být zatahovány do sporů dospělých. Váš klidný postoj je pro ně nejlepším lékem na stres ze soudního řízení.
          </p>
        </div>
      </div>

    </div>
  );
}
