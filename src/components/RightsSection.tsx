/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Scale, 
  Baby, 
  BookOpen, 
  Users, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';

export default function RightsSection() {
  const [activeSubTab, setActiveSubTab] = useState<'pece' | 'rizeni' | 'prava'>('pece');

  const peceTypes = [
    {
      title: 'Střídavá péče',
      desc: 'Dítě je svěřeno do péče obou rodičů střídavě v pravidelných intervalech (např. po týdnu, po 10 dnech nebo v asymetrickém režimu 2-2-3 dny).',
      conditions: [
        'Oba rodiče jsou výchovně způsobilí',
        'Oba mají zájem o osobní péči',
        'Zázemí rodičů umožňuje střídání (např. blízkost školy/školky)',
        'Soud přihlíží k přání dítěte s ohledem na věk'
      ],
      benefits: 'Zachovává plnohodnotný vztah s oběma rodiči, dělí rovnoměrně rodičovské radosti i povinnosti.',
      highlight: 'Preferovaný model Ústavním soudem ČR.'
    },
    {
      title: 'Společná péče',
      desc: 'Dítě je svěřeno oběma rodičům bez explicitního stanovení střídavých cyklů. Rodiče žijí buď nadále v jednom domě, nebo mají natolik flexibilní a vstřícný vztah, že střídání probíhá organicky na základě dohody.',
      conditions: [
        'Vysoká schopnost komunikace a shody obou rodičů',
        'Absence jakýchkoliv zásadních konfliktů',
        'Flexibilní časové možnosti obou rodičů'
      ],
      benefits: 'Maximální možná svoboda a přirozenost pro dítě i rodiče bez rigidních soudních rozvrhů.',
      highlight: 'Vyžaduje nadstandardní vztahy po rozchodu.'
    },
    {
      title: 'Výhradní péče jednoho z rodičů',
      desc: 'Dítě je svěřeno do výhradní péče jednoho z rodičů. Druhý rodič má právo a povinnost se s dítětem pravidelně stýkat (např. každý druhý víkend, polovina prázdnin) a přispívat na jeho výživu.',
      conditions: [
        'Jeden z rodičů nemá časové nebo bytové možnosti pro plnohodnotnou péči',
        'Dítě je velmi nízkého věku (kojenecký věk, kdy je silně fixováno na matku)',
        'Vzdálenost mezi bydlišti rodičů znemožňuje denní střídavou docházku do školy'
      ],
      benefits: 'Stabilní jedno domácí zázemí pro školní dny, jasné rozdělení rolí.',
      highlight: 'Druhý rodič má stále plnou rodičovskou odpovědnost.'
    }
  ];

  return (
    <div className="space-y-8" id="rights-section-container">
      
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Právní rámec ČR</span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Práva dětí a rodičů v opatrovnickém právu</h2>
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-3xl">
          Základním pilířem českého rodinného práva (zakotveného v občanském zákoníku) je <strong>rodinná solidarita</strong> a <strong>právo dítěte na péči obou rodičů</strong>. Soudy v opatrovnickém řízení nerozhodují o tom, kdo je "lepší" rodič, ale jak nejlépe zajistit zájmy dítěte do budoucna.
        </p>
      </div>

      {/* Internal Tab Selection */}
      <div className="flex border-b border-slate-200">
        {[
          { id: 'pece', label: 'Formy péče o dítě', icon: Baby },
          { id: 'rizeni', label: 'Jak probíhá soudní řízení', icon: BookOpen },
          { id: 'prava', label: 'Práva a povinnosti', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              id={`rights-subtab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 md:px-6 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                isActive 
                  ? 'border-teal-600 text-teal-600 font-semibold' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="mt-6" id="rights-tab-content">
        
        {/* TAB 1: FORMY PECE */}
        {activeSubTab === 'pece' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="rights-tab-pece">
            {peceTypes.map((pece, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-teal-100 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
                    <h3 className="font-bold text-slate-800 text-base font-display">{pece.title}</h3>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                      Forma {idx + 1}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4">{pece.desc}</p>
                  
                  <div className="space-y-3 mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Podmínky pro schválení:</span>
                    <ul className="space-y-1.5">
                      {pece.conditions.map((cond, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                          <span>{cond}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-slate-50 pt-4 mt-4 space-y-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-600 block tracking-wider">Klíčový přínos:</span>
                    <p className="text-xs text-slate-600 italic">"{pece.benefits}"</p>
                  </div>
                  <div className="bg-teal-50/50 p-2 rounded-lg border border-teal-50 text-[10px] text-teal-800 font-semibold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{pece.highlight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: PRUBEH RIZENI */}
        {activeSubTab === 'rizeni' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs space-y-8" id="rights-tab-rizeni">
            <div className="max-w-3xl space-y-6">
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">1</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm font-display">Místní příslušnost soudu</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Řízení probíhá u okresního soudu (v Praze u obvodního soudu), v jehož obvodu má nezletilé dítě své faktické bydliště. Návrh se podává k tomuto konkrétnímu soudu ve třech vyhotoveních.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">2</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm font-display">Jmenování opatrovníka (OSPOD)</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Soud bezodkladně jmenuje dítěti kolizního opatrovníka – místně příslušný OSPOD. Sociální pracovník zastupuje práva dítěte u soudu, navštěvuje obě bydliště, hovoří s rodiči a dává soudu doporučení k formě péče.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">3</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm font-display">Dokazování a slyšení dětí</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Soud zkoumá poměry rodičů, jejich příjmy, stabilitu zázemí, rodinné vazby. U starších dětí (obvykle nad 12 let, ale i mladších) je soud povinen zjistit jejich názor – buď výslechem na soudě v přítomnosti psychologa, nebo prostřednictvím OSPODu bez přítomnosti rodičů.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">4</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm font-display">Vynesení rozsudku a odvolání</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Soud rozhodne rozsudkem, který podrobně odůvodní. Pokud s rozhodnutím některý z rodičů nesouhlasí, má právo podat odvolání ke krajskému soudu do 15 dnů od doručení písemného vyhotovení rozsudku.
                  </p>
                </div>
              </div>

            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-slate-800 text-xs">Upozornění: Náklady řízení</h5>
                <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">
                  Řízení ve věcech péče o nezletilé je ze zákona osvobozeno od soudních poplatků. Každý rodič si však zpravidla hradí náklady na svého právního zástupce sám. Pokud soud nařídí znalecké posudky, náklady na ně mohou být rozděleny mezi rodiče.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRAVA A POVINNOSTI */}
        {activeSubTab === 'prava' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="rights-tab-prava">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-800 text-base font-display flex items-center gap-2 border-b border-slate-50 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                Rodičovská odpovědnost
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Rodičovská odpovědnost náleží <strong>oběma rodičům stejně</strong>, bez ohledu na to, zda jsou manželé, zda spolu žijí, nebo komu bylo dítě svěřeno do péče. Zaniká pouze rozhodnutím soudu v extrémních případech (týrání apod.).
              </p>
              
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Zahrnuje zejména:</span>
                <ul className="space-y-1.5">
                  <li className="text-xs text-slate-600 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    <span>Péči o zdraví, tělesný, citový, rozumový a mravní vývoj dítěte.</span>
                  </li>
                  <li className="text-xs text-slate-600 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    <span>Zastupování nezletilého dítěte při právních úkonech.</span>
                  </li>
                  <li className="text-xs text-slate-600 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    <span>Správu jmění dítěte (např. stavební spoření, dědictví).</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-800 text-base font-display flex items-center gap-2 border-b border-slate-50 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                Rozhodování o zásadních věcech
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Rodič, kterému bylo dítě svěřeno do péče, rozhoduje sám o běžných denních záležitostech (co bude dítě jíst, kdy půjde spát). V <strong>významných záležitostech</strong> se však rodiče musí dohodnout, nebo rozhodne soud.
              </p>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Mezi významné záležitosti patří:</span>
                <ul className="space-y-1.5">
                  <li className="text-xs text-slate-600 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Volba školy, studijního oboru nebo změna školy.</span>
                  </li>
                  <li className="text-xs text-slate-600 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Zásadní lékařské zákroky (např. operace, očkování).</span>
                  </li>
                  <li className="text-xs text-slate-600 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Určení místa bydliště dítěte (přestěhování do jiného města/státu).</span>
                  </li>
                  <li className="text-xs text-slate-600 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Vydání cestovního pasu a vycestování na delší dobu.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
