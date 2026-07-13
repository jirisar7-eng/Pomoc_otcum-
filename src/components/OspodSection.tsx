/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Copy, Check, FileCheck, ClipboardList, Info } from 'lucide-react';

interface Rule {
  title: string;
  desc: string;
}

const DESATERO_OSPOD: Rule[] = [
  {
    title: '1. Zachovejte absolutní klid a věcnost',
    desc: 'Opatrovnice hodnotí vaši emoční stabilitu. Křik, pláč, hněv nebo agresivní tón (i když jsou reakcí na bezpráví) budou v zápisu popsány jako nestabilita a neschopnost ovládat emoce.'
  },
  {
    title: '2. Nikdy neočerňujte druhého rodiče vulgárně',
    desc: 'Místo „Matka je lhářka a psychopat“ řekněte věcně: „Matka bohužel v některých bodech neuvádí úplné informace, což mohu doložit těmito e-maily/dokumenty.“ OSPOD nesnáší zatahování do partnerských válek.'
  },
  {
    title: '3. Prezentujte se jako aktivní a pečující rodič',
    desc: 'Ukažte, že znáte denní režim dítěte, jméno jeho pediatra, učitele, zájmové kroužky a zdravotní potřeby. Připravte si fotky ze společně stráveného času a výletů.'
  },
  {
    title: '4. Nabízejte konkrétní konstruktivní řešení',
    desc: 'Neříkejte jen „chci střídavku“. Přijďte s podrobně rozepsaným plánem: jak bude probíhat předávání, kdo bude dítě vozit do školy, jak se podělíte o prázdniny a kroužky.'
  },
  {
    title: '5. Znejte svá práva - nahlížení do spisu',
    desc: 'Podle § 55 odst. 5 zákona o sociálně-právní ochraně dětí máte jako rodič právo nahlížet do spisové dokumentace (Om-spis) a pořizovat si z ní kopie. OSPOD vám to nemůže svévolně zakázat.'
  },
  {
    title: '6. Trvejte na písemných záznamech',
    desc: 'Z každého jednání nebo telefonátu žádejte písemný záznam. Pokud s obsahem zápisu nesouhlasíte, nepodepisujte ho bez výhrad. Trvejte na zapsání svých námitek přímo do protokolu.'
  },
  {
    title: '7. Připravte se na místní šetření (návštěvu doma)',
    desc: 'Sociální pracovnice zkoumá hygienické podmínky, zda má dítě vlastní postel, prostor na hraní a učení, a jak reaguje na vaše domácí prostředí. Nejde o luxus, ale o bezpečí a čistotu.'
  },
  {
    title: '8. Komunikujte primárně písemně',
    desc: 'Všechny důležité návrhy, informace o blokování styku protistranou nebo důkazy posílejte opatrovníkovi datovou schránkou nebo doporučeně. Co je psáno, to je ve spisu a soud to uvidí.'
  },
  {
    title: '9. Neodmítejte mediaci ani odbornou pomoc',
    desc: 'Pokud vám OSPOD navrhne rodinnou poradnu nebo mediaci, neodmítejte to. Odmítnutí se interpretuje jako neochota dohodnout se. Pokud odmítne druhá strana, je to vaše plus u soudu.'
  },
  {
    title: '10. Pamatujte, že OSPOD není soudce',
    desc: 'OSPOD dává soudu pouze „doporučení“ jako kolizní opatrovník. I když je jejich názor důležitý, soud se jím nemusí stoprocentně řídit, pokud předložíte silné důkazy vyvracející závěry OSPODu.'
  }
];

export default function OspodSection() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    bed: false,
    desk: false,
    toys: false,
    food: false,
    doctor: false,
    contact: false,
    photos: false,
    schedule: false,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleChecklist = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const requestFileTemplate = `Okresní soud v [Město]
v zastoupení kolizního opatrovníka - OSPOD [Název města/MČ]
[Adresa OSPODu]

Spisová značka opatrovnického řízení: [Spisová značka, např. 12 P 123/2026]

VĚC: Žádost o nahlížení do spisové dokumentace a pořízení kopií

Já, níže podepsaný/á [Vaše Jméno a Příjmení], narozen/a [Datum narození], bytem [Vaše Adresa], jakožto otec/matka nezletilého/é [Jméno dítěte], narozeného/é [Datum narození dítěte], tímto uplatňuji své zákonné právo a 

ŽÁDÁM

o nahlédnutí do spisové dokumentace vedené k mému/mé nezletilému/é synovi/dceři (tzv. Om spis) podle ustanovení § 55 odst. 5 zákona č. 359/1999 Sb., o sociálně-právní ochraně dětí, ve znění pozdějších předpisů.

Současně žádám o umožnění pořízení fotokopií/skenů všech listin obsažených v tomto spisu pomocí vlastního mobilního telefonu/fotoaparátu.

Prosím o určení termínu k nahlížení do spisu v co nejkratší době. Odpověď prosím zašlete do mé datové schránky / na níže uvedený e-mail.

V [Město] dne [Datum]

...........................................
[Váš vlastnoruční podpis]
Tel: [Telefon]
E-mail: [E-mail]
ID Datové schránky: [ID schránky]`;

  return (
    <div className="space-y-8" id="ospod-section-container">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Kolizní opatrovník</span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Jak jednat s OSPODem</h2>
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
          Orgán sociálně-právní ochrany dětí (OSPOD) je soudem ustanoven jako kolizní opatrovník vašeho dítěte. Jeho posudek a doporučení mají pro rozhodnutí soudce obrovskou váhu. Připravte se na komunikaci s nimi tak, abyste působili jako zralý, stabilní a spolupracující rodič.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - 10 rules accordion */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs">
            <h3 className="text-base font-bold text-slate-800 font-display mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-teal-500" />
              Desatero úspěšné komunikace s OSPOD
            </h3>
            
            <div className="space-y-3">
              {DESATERO_OSPOD.map((rule, idx) => {
                const isOpen = activeAccordion === idx;
                return (
                  <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setActiveAccordion(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-700 font-display">{rule.title}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                        {rule.desc}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Copyable templates */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-500" />
              Vzor: Žádost o nahlížení do spisu
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              OSPOD má povinnost zaznamenávat veškeré kroky do spisu Om. Máte právo do něj nahlížet, abyste věděli, co o vás protistrana tvrdí a jaké zprávy opatrovník shromažďuje (např. ze školy či od lékaře). Tento vzor vyplňte a zašlete opatrovníkovi.
            </p>

            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-[11px] font-mono overflow-x-auto whitespace-pre leading-relaxed h-72">
                {requestFileTemplate}
              </pre>
              <button
                onClick={() => handleCopy(requestFileTemplate, 'file-request')}
                className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-bold cursor-pointer"
              >
                {copiedId === 'file-request' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                    Zkopírováno
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-teal-300" />
                    Zkopírovat vzor
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Checklist for apartment inspection */}
        <div className="space-y-6">
          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#EBE7E0] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#EBE7E0] pb-3">
              <span className="text-[10px] bg-[#E6EBDD] text-[#7D8F69] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider font-mono">Příprava</span>
              <h3 className="text-sm font-bold text-slate-800 font-display">Místní šetření OSPOD</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Při návštěvě sociální pracovnice u vás doma (tzv. místní šetření) se zkoumá připravenost zázemí pro výchovu dítěte. Označte si splněné body:
            </p>

            <div className="space-y-2.5">
              <label className="flex items-start gap-3 p-2.5 bg-white rounded-xl border border-slate-100 hover:border-teal-150 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.bed}
                  onChange={() => toggleChecklist('bed')}
                  className="mt-1 accent-teal-600 rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block leading-tight">Vlastní postel dítěte</span>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Dítě musí mít vlastní čisté lůžko odpovídající jeho věku.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 bg-white rounded-xl border border-slate-100 hover:border-teal-150 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.desk}
                  onChange={() => toggleChecklist('desk')}
                  className="mt-1 accent-teal-600 rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block leading-tight">Kout pro učení a hraní</span>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Psací stůl pro školáka, u mladších dětí bezpečný prostor na hraní.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 bg-white rounded-xl border border-slate-100 hover:border-teal-150 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.toys}
                  onChange={() => toggleChecklist('toys')}
                  className="mt-1 accent-teal-600 rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block leading-tight">Věk-odpovídající hračky a knihy</span>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Ukažte, že stimulujete rozvoj dítěte vhodnými hračkami a knihami.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 bg-white rounded-xl border border-slate-100 hover:border-teal-150 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.food}
                  onChange={() => toggleChecklist('food')}
                  className="mt-1 accent-teal-600 rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block leading-tight">Potraviny v lednici a čistota</span>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Lednice by měla obsahovat čerstvé suroviny, ovoce a zeleninu pro děti.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 bg-white rounded-xl border border-slate-100 hover:border-teal-150 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.doctor}
                  onChange={() => toggleChecklist('doctor')}
                  className="mt-1 accent-teal-600 rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block leading-tight">Znalost dětského lékaře</span>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Mějte v paměti kontakt na dětského lékaře, popř. zubaře.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 bg-white rounded-xl border border-slate-100 hover:border-teal-150 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.photos}
                  onChange={() => toggleChecklist('photos')}
                  className="mt-1 accent-teal-600 rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block leading-tight">Fotky dětí a společné zážitky</span>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Mějte vystavené fotky dětí, ukazuje to vřelou rodinnou atmosféru.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 bg-white rounded-xl border border-slate-100 hover:border-teal-150 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.schedule}
                  onChange={() => toggleChecklist('schedule')}
                  className="mt-1 accent-teal-600 rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block leading-tight">Připravený kroužkový režim</span>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Ukažte zájem zapojit se do odpoledních kroužků dítěte.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Legal Warning Notice */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 space-y-2">
            <div className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-bold text-amber-900 uppercase font-display">Upozornění z praxe</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              OSPOD by měl vystupovat nestranně, v praxi se však můžete setkat s předsudky ohledně péče otců o malé děti. V takovém případě nepodléhejte emocím, ale trpělivě a doložitelně dokazujte svou způsobilost. Každý krok zaznamenávejte písemně do datové schránky.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
