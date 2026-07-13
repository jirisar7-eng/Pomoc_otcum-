/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Scale, Search, ExternalLink, Bookmark, HelpCircle, FileText } from 'lucide-react';

interface Ruling {
  id: string;
  caseNumber: string;
  title: string;
  date: string;
  court: string;
  summary: string;
  impactForParents: string;
  categories: string[];
  officialUrl: string;
}

const INITIAL_RULINGS: Ruling[] = [
  {
    id: 'ruling-1',
    caseNumber: 'I. ÚS 2482/13',
    title: 'Střídavá péče jako prioritní uspořádání',
    date: '2014-05-26',
    court: 'Ústavní soud ČR',
    summary: 'Svěření dítěte do střídavé péče musí být prioritní volbou, pokud jsou splněny zákonné podmínky (oba rodiče jsou způsobilí, mají o dítě zájem a mají k němu silný vztah). Prvostupňové soudy musí pečlivě zdůvodnit, proč střídavou péči případně nezavedly.',
    impactForParents: 'Tento nález je klíčovým argumentem, pokud se domáháte střídavé péče a druhá strana ji odmítá bez závažných důvodů. Říká, že střídavá péče má přednost před výlučnou, pokud neexistují objektivní překážky.',
    categories: ['střídavá péče', 'nejlepší zájem dítěte'],
    officialUrl: 'https://nalus.usoud.cz/Search/ResultDetail.aspx?id=83907'
  },
  {
    id: 'ruling-2',
    caseNumber: 'I. ÚS 1554/14',
    title: 'Předpoklady pro střídavou péči a konflikt rodičů',
    date: '2014-12-30',
    court: 'Ústavní soud ČR',
    summary: 'Pouhý nesouhlas jednoho z rodičů nebo existence napětí a špatné komunikace mezi nimi nemůže být bez dalšího důvodem pro vyloučení střídavé péče. Pokud by tomu tak bylo, mohl by jeden z rodičů střídavou péči záměrně bojkotovat a získat výlučnou péči.',
    impactForParents: 'Ideální judikát pro vyvrácení argumentu matky/otce typu: „Nekomunikujeme spolu, střídavá péče proto není možná.“ Ústavní soud jasně říká, že špatná komunikace nesmí být odměňována výlučnou péčí.',
    categories: ['střídavá péče', 'nejlepší zájem dítěte'],
    officialUrl: 'https://nalus.usoud.cz/Search/ResultDetail.aspx?id=86851'
  },
  {
    id: 'ruling-3',
    caseNumber: 'IV. ÚS 3481/19',
    title: 'Kojení dítěte a věk jako překážka střídavé péče',
    date: '2020-03-12',
    court: 'Ústavní soud ČR',
    summary: 'Kojení ani nízký věk dítěte (např. batolecí) nejsou automatickou překážkou pro zavedení střídavé nebo široké péče druhého rodiče. Soudy musí zkoumat individuální vazby a možnosti přizpůsobení režimu (např. kratší a častější intervaly střídání).',
    impactForParents: 'Použijte v případě, že je dítě mladší tří let a protistrana argumentuje tím, že je příliš malé nebo stále kojené na to, aby trávilo noci u otce. Navrhněte postupný přechodný režim střídání (např. 2-2-3 dny).',
    categories: ['střídavá péče', 'nejlepší zájem dítěte'],
    officialUrl: 'https://nalus.usoud.cz/Search/ResultDetail.aspx?id=111451'
  },
  {
    id: 'ruling-4',
    caseNumber: 'I. ÚS 3216/13',
    title: 'Vzdálenost bydlišť rodičů a školní docházka',
    date: '2014-06-18',
    court: 'Ústavní soud ČR',
    summary: 'Větší vzdálenost mezi bydlišti rodičů sice ztěžuje střídavou péči, ale nevylučuje ji. Je-li to v zájmu dítěte, lze střídavou péči nastavit i při větší vzdálenosti, přičemž je nutné přizpůsobit délku intervalů střídání (např. po 14 dnech) a vyřešit logistiku dopravy a volbu školského zařízení.',
    impactForParents: 'Užitečné, pokud se jeden z rodičů odstěhoval dál (např. 50-100 km). Ukazuje, že i v těchto případech existuje prostor pro férové zapojení obou rodičů namísto degradace jednoho na „víkendového návštěvníka“.',
    categories: ['střídavá péče'],
    officialUrl: 'https://nalus.usoud.cz/Search/ResultDetail.aspx?id=84240'
  },
  {
    id: 'ruling-5',
    caseNumber: 'III. ÚS 2298/15',
    title: 'Názor a přání nezletilého dítěte',
    date: '2015-12-17',
    court: 'Ústavní soud ČR',
    summary: 'Soudy jsou povinny zjišťovat přání nezletilého dítěte přímo nebo prostřednictvím zástupce, a to úměrně jeho věku a rozumové vyspělosti. Přání dítěte sice není pro soud absolutně závazné, ale musí mu být věnována zásadní pozornost a jeho nerespektování musí být podrobně odůvodněno.',
    impactForParents: 'Pokud vaše dítě (typicky nad 10-12 let) výslovně chce střídavou péči nebo chce trávit více času s vámi, a soud či OSPOD to ignorují, tento nález je nutí brát jeho hlas vážně.',
    categories: ['nejlepší zájem dítěte'],
    officialUrl: 'https://nalus.usoud.cz/Search/ResultDetail.aspx?id=91215'
  },
  {
    id: 'ruling-6',
    caseNumber: 'II. ÚS 3194/18',
    title: 'Finanční poměry a výpočet výživného při střídavé péči',
    date: '2019-04-16',
    court: 'Ústavní soud ČR',
    summary: 'Při střídavé péči nelze automaticky upustit od stanovení výživného. Pokud jsou příjmy rodičů výrazně nepoměrné, soud stanoví výživné rodiči s vyššími příjmy tak, aby byla zajištěna přibližně stejná životní úroveň dítěte v obou domácnostech.',
    impactForParents: 'Pomáhá pochopit, jak soudy nahlížejí na výživné ve střídavé péči. Střídavka neznamená „nulové alimenty“, pokud jeden z rodičů vydělává třikrát více než druhý.',
    categories: ['výživné'],
    officialUrl: 'https://nalus.usoud.cz/Search/ResultDetail.aspx?id=107380'
  },
  {
    id: 'ruling-7',
    caseNumber: 'I. ÚS 3065/21',
    title: 'Společná péče jako rovnocenná alternativa střídavé péče',
    date: '2021-11-23',
    court: 'Ústavní soud ČR',
    summary: 'Společná péče je plnohodnotná forma péče, která je vhodná tam, kde jsou rodiče schopni plně kooperovat a sdílet péči o dítě bez nutnosti striktního tabulkového střídání času. Oba rodiče zůstávají rovnocennými pečovateli bez degradace jednoho z nich.',
    impactForParents: 'Použijte, pokud je vaším cílem naprostá rovnost v rozhodování a péči a s protistranou jste schopni se rozumně a pružně domlouvat na denní bázi.',
    categories: ['společná péče'],
    officialUrl: 'https://nalus.usoud.cz/Search/ResultDetail.aspx?id=118659'
  },
  {
    id: 'ruling-8',
    caseNumber: 'II. ÚS 3505/18',
    title: 'Soudy nesmí slepě přejímat stanoviska OSPODu',
    date: '2019-02-14',
    court: 'Ústavní soud ČR',
    summary: 'Doporučení OSPODu jako kolizního opatrovníka není pro soud závazné. Pokud OSPOD vykazuje známky zaujatosti nebo jeho šetření bylo povrchní (např. nadržování matce bez objektivních důvodů), soudy jsou povinny samy provést důkladné dokazování a nesmí závěry OSPODu pouze nekriticky převzít.',
    impactForParents: 'Zásadní zbraň, pokud máte pocit, že sociální pracovnice OSPODu straní matce a ignoruje vaše předpoklady. Tento nález nutí soudce přezkoumat argumenty opatrovníka.',
    categories: ['OSPOD', 'nejlepší zájem dítěte'],
    officialUrl: 'https://nalus.usoud.cz/Search/ResultDetail.aspx?id=106720'
  },
  {
    id: 'ruling-9',
    caseNumber: 'I. ÚS 1506/13',
    title: 'Zákaz svévolného rozdělování sourozenců',
    date: '2013-09-30',
    court: 'Ústavní soud ČR',
    summary: 'Zásadním zájmem dětí je vyrůstat společně. Rozdělení sourozenců (např. syn k otci, dcera k matce) je možné pouze za výjimečných a prokazatelných okolností. Výchovný režim (včetně střídavé péče) by měl být pro sourozence zpravidla nastaven jednotně.',
    impactForParents: 'Použijte, pokud protistrana navrhuje rozdělení dětí s cílem zabránit komplexní střídavé péči o všechny sourozence společně.',
    categories: ['sourozenci', 'nejlepší zájem dítěte'],
    officialUrl: 'https://nalus.usoud.cz/Search/ResultDetail.aspx?id=81340'
  },
  {
    id: 'ruling-10',
    caseNumber: 'II. ÚS 1818/15',
    title: 'Rychlost rozhodování u předběžných opatření o styku',
    date: '2015-08-11',
    court: 'Ústavní soud ČR',
    summary: 'Pokud jeden z rodičů jednostranně brání styku druhého rodiče s dítětem, musí soud rozhodnout o předběžném opatření bezodkladně. Dlouhodobé odloučení od otce v důsledku pomalého rozhodování soudu vede k odcizení, což je v přímém rozporu s nejlepším zájmem dítěte.',
    impactForParents: 'Tento nález citujte v návrhu na předběžné opatření, pokud matka dítě zcela izoluje a hrozí riziko zpřetrhání vazeb dříve, než dojde k hlavnímu soudnímu stání.',
    categories: ['předběžné opatření', 'nejlepší zájem dítěte'],
    officialUrl: 'https://nalus.usoud.cz/Search/ResultDetail.aspx?id=90315'
  }
];

export default function JudikaturaSection() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => {
    const set = new Set<string>();
    INITIAL_RULINGS.forEach(r => r.categories.forEach(c => set.add(c)));
    return Array.from(set);
  }, []);

  const filteredRulings = useMemo(() => {
    return INITIAL_RULINGS.filter(r => {
      const matchesSearch = 
        r.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.summary.toLowerCase().includes(search.toLowerCase()) ||
        r.impactForParents.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = selectedCategory ? r.categories.includes(selectedCategory) : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const toggleBookmark = (id: string) => {
    setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8" id="judikatura-section-container">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Právní opora</span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Klíčová judikatura a nálezy</h2>
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
          Rozhodnutí Ústavního soudu České republiky jsou pro obecné soudy závazná. Pokud opatrovnický soud nebo OSPOD tvrdí věci, které jsou v rozporu s těmito nálezy, můžete se na ně ve svých vyjádřeních a návrzích odvolat. Zde naleznete nejdůležitější precedenty přehledně vysvětlené.
        </p>
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center shadow-3xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="judikatura-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hledat spisovou značku, slovo..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-xs outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === null 
                ? 'bg-teal-50 text-teal-700 font-bold border border-teal-100' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            Všechny témata
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat 
                  ? 'bg-teal-50 text-teal-700 font-bold border border-teal-100' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Judikatura Grid/List */}
      <div className="space-y-6" id="judikatura-feed-list">
        {filteredRulings.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-400">
            Nebyly nalezeny žádné judikáty odpovídající zadání. Zkuste změnit hledaný výraz.
          </div>
        ) : (
          filteredRulings.map(ruling => (
            <div 
              key={ruling.id} 
              className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 p-6 shadow-2xs flex flex-col md:flex-row gap-6 transition-all"
              id={`ruling-card-${ruling.id}`}
            >
              {/* Left visual column */}
              <div className="md:w-56 shrink-0 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">{ruling.court}</span>
                  <h3 className="text-sm font-bold text-teal-600 font-mono mt-1">{ruling.caseNumber}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Vydáno: {ruling.date}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {ruling.categories.map(c => (
                    <span key={c} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md font-medium border border-slate-100">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right content column */}
              <div className="flex-grow space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="text-base font-bold text-slate-800 font-display">{ruling.title}</h4>
                  <button 
                    onClick={() => toggleBookmark(ruling.id)} 
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-full hover:bg-slate-50 transition-colors"
                    title={bookmarked[ruling.id] ? "Odebrat z uložených" : "Uložit judikát"}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarked[ruling.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100/50 relative">
                  <span className="absolute -top-2.5 left-4 px-2 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-wider border border-slate-100 rounded-md">Klíčový právní názor</span>
                  <p className="text-xs text-slate-600 leading-relaxed italic mt-1">
                    "{ruling.summary}"
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-teal-500" />
                    Jak to prakticky využít u soudu:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed pl-4.5 border-l-2 border-teal-500/30">
                    {ruling.impactForParents}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <a 
                    href={ruling.officialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition-all hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Zobrazit plné znění v NALUS
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick advice banner */}
      <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-bold text-indigo-900 text-sm font-display">Potřebujete vyhledat další judikáty?</h4>
          <p className="text-indigo-700 text-xs">
            Můžete využít našeho vestavěného AI asistenta, který má přístup k širokému spektru nálezů Ústavního soudu ohledně péče o děti.
          </p>
        </div>
        <button 
          onClick={() => {
            const aiBtn = document.getElementById('ai-assistant-toggle');
            if (aiBtn) aiBtn.click();
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shrink-0 transition-colors cursor-pointer"
        >
          Zeptat se AI asistenta
        </button>
      </div>

    </div>
  );
}
