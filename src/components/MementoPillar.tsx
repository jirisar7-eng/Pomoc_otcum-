/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Scale, 
  Lightbulb, 
  FileText, 
  ShieldAlert, 
  AlertCircle, 
  Award, 
  Check, 
  Copy,
  Flame,
  Shield,
  Heart,
  FileCheck,
  Building
} from 'lucide-react';

export default function MementoPillar() {
  const [pillarTab, setPillarTab] = useState<'motivation' | 'analysis' | 'rights'>('motivation');
  const [copiedPillarId, setCopiedPillarId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPillarId(id);
    setTimeout(() => setCopiedPillarId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8" id="memento-pillar-root">
      
      {/* Visual Header / Jumbotron specifically for Memento */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 md:p-10 relative overflow-hidden border border-rose-500/15 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500 rounded-full blur-3xl opacity-10 -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl opacity-5 translate-y-20 -translate-x-20"></div>
        
        <div className="relative max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold text-rose-400 tracking-widest font-mono">Základní pilíř portálu & Memento</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight font-display text-white">
            Anatomie systémového selhání <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-teal-400">
              Proč tento web existuje
            </span>
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed text-justify font-sans">
            Tato sekce stojí zcela mimo standardní informační obsah. Je to surové memento, osobní zpověď zakladatele a faktický rozbor konkrétních rozhodnutí státního aparátu. Slouží jako hluboká reflexe reality opatrovnického procesu v České republice a je hlavním hnacím motorem pro vznik celého portálu.
          </p>
        </div>
      </div>

      {/* Main Content Card Container */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-6" id="memento-main-card">
        
        {/* Navigation Selector for the Memento */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100/50 flex items-center justify-center text-rose-600 shrink-0">
              <Scale className="w-5.5 h-5.5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Detailní rozbor a svědectví
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Vyberte oblast pro zobrazení podkladů
              </p>
            </div>
          </div>

          <div className="flex bg-slate-50 border border-slate-150 p-1 rounded-xl text-xs font-semibold gap-1 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setPillarTab('motivation')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all cursor-pointer font-bold whitespace-nowrap text-xs ${
                pillarTab === 'motivation'
                  ? 'bg-white text-rose-700 shadow-3xs border border-rose-100/30'
                  : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100/60'
              }`}
            >
              Moje motivace
            </button>
            <button
              onClick={() => setPillarTab('analysis')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all cursor-pointer font-bold whitespace-nowrap text-xs ${
                pillarTab === 'analysis'
                  ? 'bg-white text-rose-700 shadow-3xs border border-rose-100/30'
                  : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100/60'
              }`}
            >
              Rozbor spisu (Soud & Poradna)
            </button>
            <button
              onClick={() => setPillarTab('rights')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all cursor-pointer font-bold whitespace-nowrap text-xs ${
                pillarTab === 'rights'
                  ? 'bg-white text-rose-700 shadow-3xs border border-rose-100/30'
                  : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100/60'
              }`}
            >
              Práva otců (Aperio)
            </button>
          </div>
        </div>

        {/* TAB CONTENT: MY MOTIVATION */}
        {pillarTab === 'motivation' && (
          <div className="space-y-5 animate-fadeIn" id="memento-motivation">
            <p className="text-xs text-slate-650 leading-relaxed font-serif text-justify">
              Když se vám narodí dítě, slíbíte mu, že tu pro něj budete vždycky. Že ho ochráníte, dáte mu stabilitu a budete jeho pevným přístavem. Když se nám <strong>2. prosince 2025</strong> narodil mladší syn, dělal jsem přesně to. Od jeho narození jsme měli s matkou nastavený stabilní režim, který skvěle a bezproblémově fungoval: pečoval jsem o syna od pondělí do středy a každý sudý pátek. Dítě bylo spokojené, klidné, otec plně zapojený do všech každodenních rituálů od prvních měsíců věku.
            </p>
            <p className="text-xs text-slate-650 leading-relaxed text-justify">
              Jenže pak zasáhl opatrovnický systém – sociální služby (OSPOD, rodinné poradny) a soudy prvního stupně. Realita, kterou jsem zažil u <strong>Okresního soudu</strong> a <strong>poradny pro rodinu</strong>, mi v plné nahotě odhalila, jak hluboce je systém paralyzován překonanými předsudky o roli otců a nefunkčními mateřskými stereotypy.
            </p>
            <p className="text-xs text-slate-650 leading-relaxed text-justify">
              Svědectví ze spisu odhaluje absurdní paradox: soud v odůvodnění rozsudku obšírně cituje moderní mezinárodní studie o tom, jak důležité je přespávání dětí u otců od narození a že nízký věk kojence není překážkou. Konstatuje, že otec je 100% kompetentní pečovatel a dítko k němu chová silnou vřelost. A pak? V samotném rozsudku podlehne alibismu, přespávání syna otci bezdůvodně odepře a rozseká péči na absurdní krátké bloky, které nutí dítě a tátu k neustálému cestování vlakem (5x týdně) a zcela rozbíjejí sourozeneckou vazbu s jeho starším bratrem, kterého má otec v plné péči.
            </p>
            <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl text-xs text-slate-850 flex gap-3">
              <Lightbulb className="w-5.5 h-5.5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold text-rose-950 text-xs">Mise tohoto portálu:</strong>
                <p className="leading-relaxed text-[11px] text-slate-700">
                  Tento web nevznikl z hořkosti, ale z hlubokého přesvědčení, že <strong>systémové bezpráví na dětech a otcích nesmí zůstat utajeno za zavřenými dveřmi soudních síní</strong>. Zveřejňuji tyto plně anonymizované dokumenty jako klíčový důkaz a návod pro ostatní aktivní otce. Bojujte za svá rodičovská práva a práva svých dětí na základě faktů, vědy a nejnovější judikatury.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: CASE ANALYSIS (ANONYMIZED DOCUMENTS) */}
        {pillarTab === 'analysis' && (
          <div className="space-y-6 animate-fadeIn" id="memento-analysis">
            <p className="text-xs text-slate-500 leading-relaxed italic">
              Níže najdete podrobnou, faktickou a plně anonymizovanou analýzu dvou klíčových dokumentů z mého spisu (bez jakýchkoliv odkazů na nesouvisející majetková řízení či exekuce). Tyto dokumenty ilustrují systémové opomíjení otcovských práv a vědeckých konsenzů v české praxi.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Document 1: Family Counseling Report */}
              <div className="bg-slate-50 border border-slate-150 p-5 rounded-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-4.5 h-4.5 text-amber-600" />
                    <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-850 px-2 py-0.5 rounded font-mono">Poradenská zpráva</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs font-display">Zpráva ze spolupráce (Poradna pro rodinu, 8. 6. 2026)</h4>
                  
                  <div className="text-[11px] text-slate-650 space-y-2.5 leading-relaxed text-justify">
                    <p>
                      <strong>Pozadí případu:</strong> Rodiče nezl. syna (nar. prosinec 2025) se zúčastnili dvou mediačních konzultací. Matka požadovala postupné "navykání" (ve skutečnosti drastické omezení) syna na přítomnost otce a vyřešení výživného jako podkladu pro získání státní sociální dávky. Otec naopak usiloval o zachování dosud skvěle fungujícího dohodnutého režimu (pondělí až středa a každý sudý pátek) a jeho rozšíření na střídavou péči 7x7 dní.
                    </p>
                    <p>
                      <strong>Ideologický postoj poradny:</strong> Sociální pracovnice v rozpravě otevřeně podsouvala otci vyvrácené biologické mýty z minulého století. Tvrdila, že 4měsíční kojenec má přirozenou citovou vazbu výhradně na matku jako "primární pečující osobu" (tzv. teorie monotropie) a role otce je druhotná.
                    </p>
                    <p>
                      <strong>Ignorování faktického stavu:</strong> Přestože otec i poradna potvrdili, že péče otce je naprosto bezproblémová, dítě v jeho přítomnosti spí klidně, usmívá se, dobře jí a pláče minimálně, poradna nutila otce, aby "nespěchal" a podvolil se matce, která trvala na tom, že dítě patří převážně jí.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-amber-800 font-mono font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    Teorie monotropie v praxi
                  </span>
                  <button
                    onClick={() => {
                      const txt = `Zpráva Poradny pro rodinu z 8. 6. 2026 ukazuje nebezpečné uplatňování překonané teorie monotropie u kojenců. Poradna nutila plně kompetentního otce k rezignaci na pravidelnou rovnocennou péči o syna (nar. 2. 12. 2025) s tvrzením, že matka je biologicky nadřazená 'primární pečující osoba', přestože otec o dítě úspěšně pečoval od narození a kojenec vykazoval plnou spokojenost a vřelost.`;
                      handleCopy('poradna', txt);
                    }}
                    className={`text-[9px] font-bold px-2 py-1 rounded transition-colors flex items-center gap-1 border cursor-pointer ${
                      copiedPillarId === 'poradna'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {copiedPillarId === 'poradna' ? 'Zkopírováno ✓' : 'Zkopírovat argument'}
                  </button>
                </div>
              </div>

              {/* Document 2: Court Ruling Paradox */}
              <div className="bg-slate-50 border border-slate-150 p-5 rounded-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4.5 h-4.5 text-rose-600" />
                    <span className="text-[9px] font-extrabold uppercase bg-rose-100 text-rose-850 px-2 py-0.5 rounded font-mono">Rozsudek okresního soudu</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs font-display">Rozsudek (Okresní soud, 9. 6. 2026)</h4>
                  
                  <div className="text-[11px] text-slate-650 space-y-2.5 leading-relaxed text-justify">
                    <p>
                      <strong>Výrok rozsudku:</strong> Samosoudkyně sice formálně svěřila syna do společné péče obou rodičů. Avšak konkrétní rozvržení péče omezila na extrémně fragmentovaný rozvrh: v sudém týdnu otec pečuje od pondělí 8:45 do úterý 15:30 (jediný nocleh) a v pátek od 8:45 do 15:30. V lichém týdnu pak pouze v pondělí, středu a pátek vždy od 8:45 do 15:30 (zcela bez noclehu!).
                    </p>
                    <p>
                      <strong>Bizarní paradox v odůvodnění:</strong> Soud v písemném odůvodnění výslovně cituje mezinárodní vědecký konsenzus reprezentovaný studií prof. Richarda A. Warshaka o tom, že <strong>nízký věk ani pohlaví rodiče neodůvodňují vyloučení přespávání dítěte u otce</strong>. Potvrzuje, že oba rodiče jsou plně výchovně kompetentní a dítě k nim má stejně citlivou vazbu. Přesto však soudkyně učinila pravý opak a přespávání otci zredukovala na jedinou noc za 14 dní!
                    </p>
                    <p>
                      <strong>Destrukce sourozeneckých vazeb a logistika:</strong> Jako zástupný důvod soud uvedla běžný po-návratový neklid kojence a absenci automobilu u rodičů. Tímto rozvrhem donutila otce cestovat vlakem s kojencem k předávání až 5x týdně! Zcela navíc odřízla kontakt mladšího syna s jeho starším bráchou, který žije v otcově plné péči.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-rose-850 font-mono font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    Absurdní procesní rozpor
                  </span>
                  <button
                    onClick={() => {
                      const txt = `Rozsudek Okresního soudu z 9. 6. 2026 vykazuje fatální vnitřní rozpor. Samosoudkyně v odůvodnění explicitně potvrzuje mezinárodní konsenzus (reprezentovaný prof. Warshakem), že nízký věk kojence není překážkou pro střídavé přespávání a že otec je plně výchovně způsobilý. Přesto ve výroku přespávání u otce zredukovala na pouhou 1 noc za 14 dní, čímž dítě zatížila neustálým předáváním na vlakové stanici 5x týdně a odřízla sourozenecké vazby se starším bratrem, který je v péči otce.`;
                      handleCopy('rozsudek', txt);
                    }}
                    className={`text-[9px] font-bold px-2 py-1 rounded transition-colors flex items-center gap-1 border cursor-pointer ${
                      copiedPillarId === 'rozsudek'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {copiedPillarId === 'rozsudek' ? 'Zkopírováno ✓' : 'Zkopírovat argument'}
                  </button>
                </div>
              </div>

            </div>

            <div className="bg-rose-50/25 border border-rose-100/50 p-5 rounded-2xl text-xs text-slate-700 space-y-2">
              <h5 className="font-bold text-rose-950 flex items-center gap-1.5 text-xs">
                <ShieldAlert className="w-4.5 h-4.5 text-rose-600" />
                Kritické vynechání exekucí ze soudního spisu
              </h5>
              <p className="leading-relaxed text-[11px] text-slate-650 text-justify">
                Opatrovnické orgány a protistrany se často snaží odvést pozornost soudu od zájmů dětí k nesouvisejícím osobním či majetkovým sporům (např. poukazováním na finanční potíže, staré dluhy nebo exekuční řízení, kterými byl otec v minulosti zatížen). V mém spisu soud potvrdil, že otec o mladšího syna bez potíží osobně pečuje, má doma veškeré zázemí a jeho dřívější finanční situace nemá na výchovné kompetence vliv. Pro opatrovnické řízení jsou osobní finanční spory irelevantní – klíčová je výhradně láska, bezpečí a osobní přítomnost rodiče.
              </p>
            </div>
          </div>
        )}

        {/* TAB CONTENT: FATHER'S RIGHTS (APERIO STANDARDS) */}
        {pillarTab === 'rights' && (
          <div className="space-y-6 animate-fadeIn" id="memento-rights">
            <div className="bg-rose-50/30 border border-rose-100/50 p-5 rounded-2xl flex flex-col md:flex-row items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0 border border-rose-100/30">
                <Award className="w-5 h-5 text-rose-600" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-rose-950 text-xs font-display">Práva otců v souvislosti s péčí o dítě podle standardů Aperio</h4>
                <p className="text-slate-650 text-[11px] leading-relaxed text-justify">
                  Organizace <strong>Aperio - společnost pro zdravou rodinu</strong> dlouhodobě prosazuje principy plné právní, psychosociální a biologické rovnoprávnosti obou rodičů od narození dítěte. Opatrovnické soudy se musí řídit těmito standardy a opustit diskriminační stereotypy.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-100 rounded-xl p-4 space-y-1.5 bg-white shadow-3xs">
                <span className="text-[9px] font-mono uppercase text-rose-600 font-bold block">1. Rovná rodičovská odpovědnost</span>
                <strong className="text-slate-800 text-xs block font-display">Právo vzniká narozením</strong>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Podle občanského zákoníku mají matka i otec stejný rozsah rodičovské odpovědnosti od prvního dne života dítěte. Rodičovství nelze redukovat na "návštěvy". Otec má nezpochybnitelné právo o dítě osobně pečovat, krmit ho, uspávat a budovat vazby.
                </p>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 space-y-1.5 bg-white shadow-3xs">
                <span className="text-[9px] font-mono uppercase text-rose-600 font-bold block">2. Nejlepší zájem dětí pod 3 roky</span>
                <strong className="text-slate-800 text-xs block font-display">Biologická připravenost kojenců</strong>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Moderní výzkum odmítá starou představu, že kojenci mohou spát pouze s matkou. Děti si vytvářejí paralelní a stejně hluboké vazby (attachment) k oběma rodičům, pokud mají příležitost s nimi trávit běžný denní a noční režim. Odkládání noclehů otcovskou vazbu nevratně poškozuje.
                </p>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 space-y-1.5 bg-white shadow-3xs">
                <span className="text-[9px] font-mono uppercase text-rose-600 font-bold block">3. Ochrana sourozeneckých vazeb</span>
                <strong className="text-slate-800 text-xs block font-display">Nerozdělování sourozenců</strong>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Podle judikatury Ústavního soudu ČR a standardů Aperio mají sourozenci (včetně polorodých) právo vyrůstat a rozvíjet své vztahy společně. Rozhodnutí soudu, které bezdůvodně rozvrhne péči tak, že se sourozenci nemohou potkat, je závažným pochybením.
                </p>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 space-y-1.5 bg-white shadow-3xs">
                <span className="text-[9px] font-mono uppercase text-rose-600 font-bold block">4. Zneužití konfliktu protistranou</span>
                <strong className="text-slate-800 text-xs block font-display">Konflikt není důvodem pro omezení</strong>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Nemá-li rodič sníženou výchovnou způsobilost, soud nesmí odmítnout střídavou péči jen proto, že mezi rodiči panuje napětí nebo že matka střídavku bojkotuje. Pokud to soud udělá, nepřímo tím matku odměňuje za agresivní, nekompromisní postoj a konflikt prohlubuje.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-mono text-[10px]">Zdroj: Aperio (Práva otců v souvislosti s péčí o dítě) • Ústavní soud ČR</span>
              <button
                onClick={() => {
                  const txt = `Rovnoprávnost obou rodičů v péči o dítě (včetně dětí mladších 3 let) je garantována občanským zákoníkem a podporována standardy organizace Aperio. Otec má plné právo na osobní péči, která zahrnuje noční péči (přespávání). Omezování otcovy péče na pouhé denní hodiny odporuje zájmům dítěte a poškozuje vývoj paralelního attachmentu k oběma rodičům.`;
                  handleCopy('rights', txt);
                }}
                className={`font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border cursor-pointer ${
                  copiedPillarId === 'rights'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {copiedPillarId === 'rights' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Zkopírováno do schránky!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    Zkopírovat právní argument Aperio
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
      
    </div>
  );
}
