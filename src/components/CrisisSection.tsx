/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  LifeBuoy, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  ArrowRight, 
  FileText, 
  Check, 
  Copy, 
  Calendar, 
  Plus, 
  Trash2, 
  Printer, 
  Clock, 
  BookOpen, 
  AlertTriangle,
  Send,
  Download,
  Info
} from 'lucide-react';
import { getStoredState, setStoredState } from '../initialState';

// --- Types ---
interface IncidentLog {
  id: string;
  date: string;
  childState: string;
  motherState: string;
  incidentType: 'smooth' | 'delay' | 'obstruction' | 'verbal_attack' | 'other';
  policeCalled: boolean;
  notes: string;
}

interface RegionOrg {
  name: string;
  desc: string;
  city: string;
  phone: string;
  email: string;
  url: string;
  focus: string;
}

interface CrisisSectionProps {
  setActiveTab?: (tab: string) => void;
}

export default function CrisisSection({ setActiveTab }: CrisisSectionProps = {}) {
  // --- States ---
  const [activeSubTab, setActiveSubTab] = useState<'triage' | 'generator' | 'map' | 'diary' | 'glossary'>('triage');
  
  // Triage active scenario state
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // --- 1. REGIONAL DIRECTORY DATA ---
  const REGIONS_DATA: Record<string, RegionOrg[]> = {
    'Celá ČR': [
      {
        name: 'Unie otců – otcové za práva dětí',
        desc: 'Klíčový spolek hájící zájmy otců v ČR. Poskytuje právní konzultace, pomoc při syndromu zavrženého rodiče a doprovod k soudům po celé republice.',
        city: 'Praha / Celá ČR',
        phone: '+420 603 551 234',
        email: 'info@unie-otcu.cz',
        url: 'https://www.unie-otcu.cz/',
        focus: 'Právní konzultace, doprovod k soudu, syndrom zavrženého rodiče.'
      },
      {
        name: 'Liga otevřených mužů (LOM)',
        desc: 'Celostátní organizace zaměřená na muže a aktivní otcovství. Provozují poradnu pro táty v krizi, kurzy zvládání vzteku (klíčové pro soudní spory) a podporují zapojení mužů do péče.',
        city: 'Praha / Celá ČR',
        phone: '+420 724 985 141',
        email: 'info@ilom.cz',
        url: 'https://ilom.cz/',
        focus: 'Krizová poradna pro táty, kurzy zvládání vzteku, aktivní otcovství.'
      },
      {
        name: 'Zůstáváme rodiči',
        desc: 'Celorepubliková platforma prosazující Cochemský model (smírné řešení rozvodů) a podporující oba rodiče v tom, aby po rozchodu zůstali plnohodnotnými rodiči.',
        city: 'Praha / Online',
        phone: '+420 777 123 456',
        email: 'info@zustavamerodici.cz',
        url: 'https://zustavamerodici.cz/',
        focus: 'Cochemská praxe, kurzy pro rodiče, mimosoudní dohody.'
      },
      {
        name: 'Servis rodiny (Women for Women)',
        desc: 'Celorepublikový program pomáhající rodičům projít rozvodem kultivovaně a uzavřít mimosoudní dohodu o péči a výživném v zájmu dětí.',
        city: 'Praha / Celá ČR',
        phone: '+420 222 245 613',
        email: 'servisrodiny@w4w.cz',
        url: 'https://women-for-women.cz/servis-rodiny/',
        focus: 'Edukační kurzy, rodinná mediace, mimosoudní dohody.'
      },
      {
        name: 'Úřad pro mezinárodněprávní ochranu dětí (ÚMPOD)',
        desc: 'Státní úřad se sídlem v Brně s celostátní působností pro mezinárodní rodinné spory, únosy dětí či spory s cizím prvkem.',
        city: 'Brno / Celostátní',
        phone: '+420 542 215 522',
        email: 'podatelna@umpod.cz',
        url: 'https://umpod.gov.cz/',
        focus: 'Mezinárodní spory o děti, vymáhání výživného ze zahraničí.'
      }
    ],
    'Praha': [
      {
        name: 'CSS Praha – Poradna Mánesova',
        desc: 'Městská poradna poskytující bezplatné rodinné poradenství, psychologickou pomoc a zvládání krizí spojených s rozchodem rodičů.',
        city: 'Praha 2',
        phone: '+420 224 228 333',
        email: 'poradna.manesova@csspraha.cz',
        url: 'https://www.csspraha.cz/poradna-manesova',
        focus: 'Rodinná terapie, rozvodové poradenství, psychologická podpora.'
      },
      {
        name: 'Naše rovnováha z.s.',
        desc: 'Nezisková organizace nabízející krizové intervence a psychologickou podporu specificky cílenou na muže a otce v opatrovnické tísni.',
        city: 'Praha',
        phone: '+420 725 321 445',
        email: 'info@naserovnovaha.cz',
        url: 'https://naserovnovaha.cz/',
        focus: 'Podpora otců v krizi, krizová intervence pro muže.'
      },
      {
        name: 'Aperio – Společnost pro zdravé rodičovství',
        desc: 'Poskytuje vynikající bezplatnou právní a psychologickou poradnu pro rozvádějící se rodiče. Pomáhá nastavit zdravé komunikační hranice.',
        city: 'Praha 1 / Online',
        phone: '+420 777 123 456',
        email: 'poradna@aperio.cz',
        url: 'https://aperio.cz/',
        focus: 'Právní poradna rodinného práva, psychologická podpora.'
      }
    ],
    'Středočeský kraj': [
      {
        name: 'Triangl – Centrum pro rodinu',
        desc: 'Sociálně-aktivizační služby pro rodiny, mediace v opatrovnických sporech, asistovaná předávání dětí s cílem mírnit konflikty.',
        city: 'Praha / Střední Čechy',
        phone: '+420 224 812 214',
        email: 'triangl@cssm.cz',
        url: 'https://www.triangl-cpr.cz/',
        focus: 'Asistovaná předávání, rodinná mediace, vysoce konfliktní spory.'
      },
      {
        name: 'Centrum psychologicko-sociálního poradenství Středočeského kraje',
        desc: 'Krajská síť poraden pro manželství a rodinu v okresních městech poskytující bezplatné konzultace otcům v porozvodové nouzi.',
        city: 'Kladno, Ml. Boleslav, Příbram, Kolín, Benešov',
        phone: '+420 312 248 102',
        email: 'kladno@poradny-sk.cz',
        url: 'http://www.poradny-sk.cz/',
        focus: 'Psychologické a rodinné poradenství, psychoterapie.'
      }
    ],
    'Jihočeský kraj': [
      {
        name: 'TEMPERI o.p.s.',
        desc: 'Specializovaný program „Doprovázení rodin po rozchodu rodičů“. Pomáhá otcům nastavit a uhájit kontakt s dětmi, koordinuje komunikaci s OSPOD.',
        city: 'České Budějovice',
        phone: '+420 725 930 112',
        email: 'info@tempericb.cz',
        url: 'http://www.tempericb.cz/',
        focus: 'Doprovázení po rozchodu, mimosoudní dohody, podpora dětí.'
      },
      {
        name: 'Arkáda – Sociálně psychologické centrum',
        desc: 'Krizové centrum nabízející odborné sociální, právní a psychologické služby rodinám v závažných životních krizích.',
        city: 'Písek',
        phone: '+420 382 213 145',
        email: 'arkada@arkada.cz',
        url: 'http://www.arkada.cz/',
        focus: 'Krizová intervence, psychoterapie, řešení rozpadu rodiny.'
      }
    ],
    'Plzeňský kraj': [
      {
        name: 'DOMUS – Centrum pro rodinu',
        desc: 'Pracuje s rodinami s vysoce konfliktními rozvody. Poskytuje mediace a dává dohromady rodičovské dohody zaměřené na nejlepší zájem dítěte.',
        city: 'Plzeň',
        phone: '+420 377 224 411',
        email: 'domus@domus-cpr.cz',
        url: 'https://www.domus-cpr.cz/',
        focus: 'Mediace, sociální asistence, stabilizace porozvodových vztahů.'
      },
      {
        name: 'Poradna pro rodinu, manželství a mezilidské vztahy Plzeň',
        desc: 'Bezplatná psychologická a manželská poradna zřizovaná městem se zaměřením na porozvodové rodinné kontexty.',
        city: 'Plzeň',
        phone: '+420 377 225 352',
        email: 'poradnaplzen@seznam.cz',
        url: 'http://www.poradnaplzen.cz/',
        focus: 'Porozvodové psychologické poradenství, stabilizace rodičů.'
      }
    ],
    'Karlovarský kraj': [
      {
        name: 'Pomoc v nouzi, o.p.s.',
        desc: 'Odborné sociální a právní poradenství pro lidi v krizových životních situacích, včetně tátů čelících náhlým soudním opatřením.',
        city: 'Sokolov / Karlovy Vary',
        phone: '+420 352 661 103',
        email: 'info@pomocvnouziops.cz',
        url: 'https://www.pomocvnouziops.cz/',
        focus: 'Sociální a právní poradenství, krizové ubytování.'
      },
      {
        name: 'Poradna pro rodinu a manželství Karlovy Vary',
        desc: 'Bezplatná psychologická poradna poskytovaná krajem pro zmírnění sporů mezi rodiči o děti.',
        city: 'Karlovy Vary / Cheb',
        phone: '+420 353 226 211',
        email: 'poradnakv@seznam.cz',
        url: 'https://www.karlovyvary.cz',
        focus: 'Psychologie, podpora dětí v porozvodové krizi.'
      }
    ],
    'Ústecký kraj': [
      {
        name: 'Intervenční centrum Ústí nad Labem (Spirála)',
        desc: 'Zajišťuje krizové intervence v případech vyhrocených sporů, domácího násilí i manipulací v opatrovnických věcech.',
        city: 'Ústí nad Labem',
        phone: '+420 475 210 500',
        email: 'spiralacentrum@seznam.cz',
        url: 'https://www.spirala-pomoc.cz/',
        focus: 'Krizová intervence, řešení eskalovaného násilí a napadení.'
      },
      {
        name: 'Poradna pro rodinu, manželství a mezilidské vztahy Ústí n. L.',
        desc: 'Krajská rodinná poradna s pobočkami v Mostě, Teplicích a Děčíně. Zaměřuje se na psychologii dětí a rodičů při ztrátě rodinného zázemí.',
        city: 'Ústí nad Labem, Most, Teplice, Děčín',
        phone: '+420 475 501 321',
        email: 'info@centrum-poradenstvi.cz',
        url: 'https://www.centrum-poradenstvi.cz/',
        focus: 'Rozvodová psychoterapie, bezplatné konzultace.'
      }
    ],
    'Liberecký kraj': [
      {
        name: 'Centrum pro rodinu Náruč',
        desc: 'Pomáhá rodinám s dětmi po rozpadu svazku. Nabízí asistované kontakty s dětmi, pokud matka brání styku s otcem, a mediace.',
        city: 'Turnov',
        phone: '+420 775 570 821',
        email: 'naruc@naruc.cz',
        url: 'https://www.naruc.cz/',
        focus: 'Asistovaný styk, mediace mezi rodiči, poradenství.'
      },
      {
        name: 'Poradna pro rodinu Liberec',
        desc: 'Sociálně-právní a manželské poradenství, terapie po rozchodu pro obnovení rodičovských kompetencí.',
        city: 'Liberec / Jablonec nad Nisou',
        phone: '+420 485 103 211',
        email: 'poradnaliberec@volny.cz',
        url: 'https://www.liberec.cz',
        focus: 'Porozvodová komunikace, dětská krizová podpora.'
      }
    ],
    'Královéhradecký kraj': [
      {
        name: 'Centrum sociální pomoci a služeb Hradec Králové',
        desc: 'Provozuje síť Manželských a rodinných poraden s bezplatným režimem v Hradci Králové, Náchodě, Jičíně a Rychnově nad Kněžnou.',
        city: 'Hradec Králové, Náchod, Jičín',
        phone: '+420 495 514 851',
        email: 'poradna@csps-hk.cz',
        url: 'https://csps-hk.cz/',
        focus: 'Manželská a rodinná psychoterapie, právní minimum.'
      },
      {
        name: 'Salinger, z.s. – Středisko Samaritán',
        desc: 'Pomoc rodinám v krizových životních situacích, podpora dětí vystavených chronickému stresu z rodičovských soudů.',
        city: 'Hradec Králové',
        phone: '+420 731 598 101',
        email: 'salinger@salinger.cz',
        url: 'https://www.salinger.cz/',
        focus: 'Porozvodové konflikty, ochrana dětí před psychickým tlakem.'
      }
    ],
    'Pardubický kraj': [
      {
        name: 'Poradna pro rodinu Pardubického kraje',
        desc: 'Bezplatná krajská síť poraden s pobočkami v Pardubicích, Chrudimi, Svitavách a Ústí nad Orlicí. Poskytují vysoce hodnocené krizové i rozvodové poradenství.',
        city: 'Pardubice, Chrudim, Svitavy, Ústí nad Orlicí',
        phone: '+420 466 535 881',
        email: 'poradna.pardubice@krajprorodinu.cz',
        url: 'https://krajprorodinu.cz/',
        focus: 'Krizová intervence, rozvodové poradenství, dětská psychologie.'
      }
    ],
    'Kraj Vysočina': [
      {
        name: 'Psychocentrum – manželská a rodinná poradna Kraje Vysočina',
        desc: 'Krajská příspěvková organizace s pobočkami v Havlíčkově Brodě, Třebíči, Pelhřimově a Žďáru nad Sázavou. Odborníci na rozvodovou terapii a zvládnutí porozvodové agrese.',
        city: 'Jihlava, Třebíč, Havlíčkův Brod, Pelhřimov',
        phone: '+420 567 301 411',
        email: 'jihlava@psychocentrum.cz',
        url: 'https://www.psychocentrum.cz/',
        focus: 'Rozvodová terapie, vyrovnání se s rozchodem, kurzy pro rodiče.'
      }
    ],
    'Jihomoravský kraj': [
      {
        name: 'Centrum pro rodinu a sociální péči (CRSP)',
        desc: 'Mimořádně aktivní organizace, která nabízí rodinné mediace, kurzy rozumného rodičovství po rozchodu a speciální programy pro otce.',
        city: 'Brno',
        phone: '+420 541 247 112',
        email: 'crsp@crsp.cz',
        url: 'https://www.crsp.cz/',
        focus: 'Kurzy „Rodiče po rozchodu“, rodinná mediace, setkání pro táty.'
      },
      {
        name: 'Centrum pro rodinu Hodonín',
        desc: 'Zajišťuje známý regionální projekt „Rodiče napořád“. Nabízí asistované kontakty pro otce, kterým matka svévolně brání ve styku, a odbornou terapii.',
        city: 'Hodonín',
        phone: '+420 774 411 123',
        email: 'info@cprhodonin.cz',
        url: 'https://www.cprhodonin.cz/',
        focus: 'Asistovaný styk, obhajoba práv bráněného rodiče, terapie.'
      }
    ],
    'Olomoucký kraj': [
      {
        name: 'Centrum pro rodinný život',
        desc: 'Poskytuje odborné sociální, partnerské a psychologické poradenství pro toulající se rodiny a otce v opatrovnické bezmoci.',
        city: 'Olomouc',
        phone: '+420 585 223 113',
        email: 'cpr@arcibiskupstvi.cz',
        url: 'https://www.rodinnyzivot.cz/',
        focus: 'Rodinné poradenství, psychická pomoc otcům.'
      },
      {
        name: 'Poradna pro rodinu Olomouc',
        desc: 'Krajská bezplatná poradna (pobočky Přerov, Šumperk) zaměřená na nápravu komunikace mezi rodiči v průběhu opatrovnického řízení.',
        city: 'Olomouc, Přerov, Šumperk',
        phone: '+420 585 242 121',
        email: 'poradnaol@seznam.cz',
        url: 'https://www.kraj-olomouc.cz',
        focus: 'Porozvodová komunikace, rodinné právo pro laiky.'
      }
    ],
    'Zlínský kraj': [
      {
        name: 'Centrum pro rodinu Zlín',
        desc: 'Pomáhá nastavit pravidla porozvodové péče o děti. Pořádá krizové rozhovory a provádí rodiče fázemi rozchodové krize.',
        city: 'Zlín',
        phone: '+420 731 521 202',
        email: 'cprzlin@volny.cz',
        url: 'https://www.cprzlin.cz/',
        focus: 'Nastavení pravidel péče, rodinná asistence.'
      },
      {
        name: 'Poradna pro rodinu, manželství a mezilidské vztahy Zlín',
        desc: 'Bezplatné psychologické služby a rodinná terapie pod záštitou kraje s pobočkami v Uherském Hradišti, Vsetíně a Kroměříži.',
        city: 'Zlín, Uh. Hradiště, Vsetín, Kroměříž',
        phone: '+420 577 210 522',
        email: 'poradnazlin@volny.cz',
        url: 'https://www.poradnazlin.cz/',
        focus: 'Psychologie, řešení rodičovských sporů.'
      }
    ],
    'Moravskoslezský kraj': [
      {
        name: 'Centrum pro rodinu Ostrava',
        desc: 'Poskytuje mimořádně ucelenou podporu rodičům v rozpadu vztahu. Specializuje se na párovou mediaci, finanční dohody a eliminaci dopadů sporů na psychiku dítěte.',
        city: 'Ostrava',
        phone: '+420 596 112 113',
        email: 'ostrava@prorodiny.cz',
        url: 'https://www.prorodiny.cz/',
        focus: 'Párová mediace, stabilizace rodičů, dětské krizové skupiny.'
      },
      {
        name: 'Náruč rodičům z.s.',
        desc: 'Odborná psychosociální podpora rodinám procházejícím vysoce nepřátelským a dlouhodobým procesem opatrovnického soudu.',
        city: 'Ostrava',
        phone: '+420 734 811 112',
        email: 'info@narucrodicum.cz',
        url: 'https://www.narucrodicum.cz/',
        focus: 'Konfliktní rozvody, právní doprovod, terapie dětí.'
      }
    ]
  };

  const [selectedRegion, setSelectedRegion] = useState<string>('Celá ČR');

  // --- 2. GLOSSARY DATA ---
  const GLOSSARY_DATA = [
    { term: 'Změna poměrů', def: 'Zákonný důvod pro podání nového návrhu na úpravu péče či výživného (např. nástup dítěte do školy, výrazná změna příjmu rodiče, stěhování). Soud bez podstatné změny poměrů dřívější rozsudek nezmění.' },
    { term: 'Výkon rozhodnutí', def: 'Soudní vynucení platného rozsudku (např. nařízení předání dítěte, když matka styk ignoruje). Může probíhat ukládáním pokut (až do 50 000 Kč opakovaně) nebo v krajním případě asistovaným odnětím dítěte.' },
    { term: 'Předběžné opatření', def: 'Rychlé a dočasné rozhodnutí soudu (soud musí rozhodnout do 7 dnů), které upravuje styk nebo poměry dítěte do doby, než proběhne hlavní soudní řízení. Klíčové při svévolném odstřižení otce.' },
    { term: 'Znalecký ústav / Znalec', def: 'Soudem jmenovaný psycholog/psychiatr, který vypracovává posudek na rodiče a dítě. Často rozhoduje spor, avšak jeho závěry lze rozporovat vědeckými oponentními posudky.' },
    { term: 'Cochemská praxe', def: 'Metoda, kdy soud, OSPOD, advokáti a psychologové postupují koordinovaně tak, aby rodiče dovedli k dohodě. Cílem je zamezit zdlouhavému dokazování a obviňování u soudu.' },
    { term: 'Asistovaný styk / předávání', def: 'Setkání otce s dítětem za přítomnosti třetí neutrální osoby (např. psychologa z krizového centra), nejčastěji když matka vyvolává v dítěti syndrom zavrženého rodiče nebo tvrdí, že dítě otce odmítá.' },
    { term: 'OSPOD', def: 'Orgán sociálně-právní ochrany dětí. V soudním řízení vystupuje jako tzv. kolizní opatrovník dítěte. Jeho úkolem je nestranně hájit zájmy dítěte, v praxi však často podléhá předsudkům.' },
    { term: 'Střídavá péče', def: 'Uspořádání, kdy dítě tráví srovnatelný čas s oběma rodiči (např. střídání po týdnu). Ústavní soud ČR ji definuje jako prioritní formu péče, pokud jsou oba rodiče způsobilí.' }
  ];

  const [glossarySearch, setGlossarySearch] = useState('');
  const filteredGlossary = GLOSSARY_DATA.filter(g => 
    g.term.toLowerCase().includes(glossarySearch.toLowerCase()) || 
    g.def.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  // --- 3. DOCUMENT GENERATOR STATE & LOGIC ---
  const [generatorDocType, setGeneratorDocType] = useState<'predbezko' | 'podjatost' | 'mareni'>('predbezko');
  const [genData, setGenData] = useState({
    courtCity: '',
    fatherName: '',
    fatherBirth: '',
    fatherAddress: '',
    motherName: '',
    motherBirth: '',
    motherAddress: '',
    childName: '',
    childBirth: '',
    incidentDate: '',
    incidentDetails: '',
    ospodWorker: '',
    ospodCity: '',
    contactRegime: 'od pátku 16:00 do neděle 18:00 každý sudý víkend'
  });
  const [generatedText, setGeneratedText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleGenChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setGenData({ ...genData, [e.target.name]: e.target.value });
  };

  const generateDocument = () => {
    const today = new Date().toLocaleDateString('cs-CZ');
    
    // Fill fallback variables if empty to make document look formal
    const court = genData.courtCity ? `Okresnímu soudu v ${genData.courtCity}` : 'Okresnímu soudu v [Doplňte město soudu]';
    const otec = `${genData.fatherName || '[Jméno otce]'}, nar. ${genData.fatherBirth || '[Datum nar. otce]'}, bytem ${genData.fatherAddress || '[Adresa otce]'}`;
    const matka = `${genData.motherName || '[Jméno matky]'}, nar. ${genData.motherBirth || '[Datum nar. matky]'}, bytem ${genData.motherAddress || '[Adresa matky]'}`;
    const dite = `${genData.childName || '[Jméno dětí]'}, nar. ${genData.childBirth || '[Datum nar. dětí]'}`;
    const datumInc = genData.incidentDate || '[Datum incidentu]';
    const detailyInc = genData.incidentDetails || '[Zde popište podrobně, co se přesně stalo. Např. matka odmítla předat dítě u jejího domu, neotvírala dveře, nereagovala na telefonáty a SMS, přestože styk byl stanoven rozsudkem/dohodou.]';
    const pracospod = genData.ospodWorker || '[Jméno sociální pracovnice]';
    const uradospod = genData.ospodCity ? `OSPOD při Městském úřadě v ${genData.ospodCity}` : 'OSPOD [Doplňte úřad]';
    const rezim = genData.contactRegime || '[Doplňte navrhovaný režim, např. každý sudý týden od pátku 16:00 do neděle 18:00]';

    let text = '';

    if (generatorDocType === 'predbezko') {
      text = `K ${court}
Adresa soudu: [Doplňte adresu soudu]

Věc: Úprava poměrů nezletilého (předběžné opatření)

Navrhovatel (otec):
${otec}
(dále jen „otec“)

Odpůrkyně (matka):
${matka}
(dále jen „matka“)

Nezletilé dítě / děti:
${dite}
(dále jen „nezletilý“)

NÁVRH NA NAŘÍZENÍ PŘEDBĚŽNÉHO OPATŘENÍ
podle § 74 a násl. občanského soudního řádu (o.s.ř.) ve spojení s § 452 a násl. zákona o zvláštních řízeních soudních (z.ř.s.)

I.
Rozhodnutím soudu / dohodou rodičů ze dne [Doplňte datum] byla/y nezletilý svěřen/y do péče matky, přičemž styk s otcem byl / měl být realizován pravidelně. Nicméně matka se v poslední době chová zcela autokraticky a ignoruje rodičovská práva otce. 

Konkrétně dne ${datumInc} došlo k následujícímu závažnému incidentu:
${detailyInc}

Matka otci dlouhodobě svévolně upírá kontakt s nezletilým, odmítá mu ho předávat, blokuje komunikaci a snaží se systematicky narušit citové vazby mezi nezletilým a otcem. Tímto jednáním matka vážně poškozuje zdravý psychický vývoj nezletilého, který má právo na péči obou rodičů.

II.
Vzhledem k tomu, že je dán stav naléhavosti, kdy hrozí bezprostřední nebezpečí odcizení dítěte od otce a syndrom zavrženého rodiče, a stávající situaci nelze vyřešit smírnou cestou pro absolutní neochotu matky, otec navrhuje rychlý zásah soudu prostřednictvím předběžného opatření. Otec je bezúhonný, má pro péči o nezletilého vytvořené plnohodnotné zázemí a je plně způsobilý se o syna/dceru starat.

III.
S ohledem na výše uvedené otec navrhuje, aby soud vydal toto

u s n e s e n í :

1. Nařizuje se předběžné opatření, podle kterého je matka povinna předat nezletilého ${genData.childName || '[Jméno dětí]'} otci ke styku, a to v následujícím rozsahu:
   - ${rezim}.
   Matka je povinna nezletilého na styk řádně připravit (vybavit oblečením, léky, osobními doklady) a v uvedený čas jej předat otci v místě svého bydliště. Otec je povinen nezletilého po ukončení styku předat matce zpět tamtéž.

2. Žádný z účastníků nemá právo na náhradu nákladů tohoto řízení o předběžném opatření.

V [Doplňte vaše město] dne ${today}


.................................................
[Váš podpis]
${genData.fatherName || '[Jméno otce]'}`;
    } else if (generatorDocType === 'podjatost') {
      text = `K rukám vedoucího ${uradospod}
Adresa úřadu: [Doplňte adresu úřadu]

Věc: Námitka podjatosti kolizního opatrovníka a žádost o změnu sociální pracovnice

Spisová značka / Věc nezletilého:
Nezletilý/í: ${dite}
Otec nezletilého: ${otec}
Matka nezletilého: ${matka}

VZNESENÍ NÁMITKY PODJATOSTI
podle § 14 zákona č. 500/2004 Sb., správní řád, v platném znění

I.
Výše jmenovaný otec tímto vznáší formální námitku podjatosti vůči úřední osobě – sociální pracovnici OSPOD jménem ${pracospod}, která byla určena jako klíčový opatrovník pro hájení zájmů mého nezletilého dítěte v probíhajícím opatrovnickém soudním řízení.

II.
Důvodem pro vznesení této námitky je zjevný nedostatek nestrannosti jmenované pracovnice, která se v průběhu šetření a komunikace chová vysoce zaujatě ve prospěch matky, ignoruje objektivní důkazy předložené otcem a aktivně maří možnost dosažení smíru či střídavé péče.

Nestrannost byla konkrétně narušena při těchto incidentech:
${detailyInc}

Pracovnice ${pracospod} opakovaně odmítá zaprotokolovat mé stížnosti na nepředávání dítěte matkou, vyjadřuje se dehonestujícím způsobem o otci a dopředu předjímá, že otcové mají pouze sekundární roli v životě dětí, což je v příkrém rozporu s Úmluvou o právech dítěte a metodickými pokyny MPSV.

III.
Podle § 14 odst. 1 správního řádu jsou z projednávání a rozhodování věci vyloučeny osoby, u nichž se zřetelem na jejich poměr k věci, k účastníkům řízení nebo k jejich zástupcům lze mít pochybnost o jejich nestrannosti.

S ohledem na výše popsané skutečnosti je zřejmé, že jmenovaná pracovnice není schopna vykonávat funkci kolizního opatrovníka nezaujatě.

IV.
Na základě výše uvedeného otec navrhuje:

1. Aby vedoucí OSPOD rozhodl o vyloučení úřední osoby ${pracospod} z projednávání a zastupování nezletilého v této opatrovnické věci.
2. Aby byl nezletilému neprodleně přidělen nový, nezaujatý a odborně způsobilý sociální pracovník, který bude hájit skutečné nejlepší zájmy dítěte, včetně práva na oba rodiče.

V [Doplňte vaše město] dne ${today}


.................................................
[Váš podpis]
${genData.fatherName || '[Jméno otce]'}`;
    } else if (generatorDocType === 'mareni') {
      text = `K ${court}
Adresa soudu: [Doplňte adresu soudu]

Věc nezletilého: ${dite}
Otec nezletilého: ${otec}
Matka nezletilého: ${matka}

OZNÁMENÍ O MAŘENÍ VÝKONU ROZHODNUTÍ A NÁVRH NA VÝKON ROZHODNUTÍ ULOŽENÍM POKUTY
podle § 501 a násl. zákona č. 292/2013 Sb., o zvláštních řízeních soudních (z.ř.s.)

I.
Rozsudkem / Předběžným opatřením Okresního soudu v [Doplňte město soudu] ze dne [Doplňte datum], č.j. [Doplňte číslo jednací], byl stanoven styk otce s nezletilým ${genData.childName || '[Jméno dítěte]'} tak, že otec je oprávněn se s nezletilým stýkat v rozsahu:
- ${rezim}.

II.
Matka nezletilého toto vykonatelné soudní rozhodnutí záměrně a opakovaně nerespektuje a maří styk otce s nezletilým.

Konkrétně dne ${datumInc} matka odmítla nezletilého otci předat, přestože otec se včas dostavil na místo předání.
Podrobnosti o incidentu:
${detailyInc}

Matka neuvedla žádný relevantní, zejména pak zdravotní důvod (nepředložila lékařské potvrzení o neschopnosti převozu dítěte) a na pokusy otce o domluvu náhradního termínu reagovala arogantně či vůbec. Otec o maření styku bezodkladně informoval kolizního opatrovníka OSPOD.

III.
Jednání matky vykazuje znaky soustavného maření výkonu soudního rozhodnutí. Matka si musí být vědoma, že soudní rozhodnutí jsou závazná a jejich ignorováním traumatizuje nezletilého a porušuje zákon.

IV.
S ohledem na výše uvedené otec navrhuje, aby soud vydal toto

u s n e s e n í :

1. Soud vyzývá matku ${genData.motherName || '[Jméno matky]'}, aby dobrovolně plnila vykonatelné soudní rozhodnutí – rozsudek / předběžné opatření Okresního soudu v [Doplňte město] ze dne [Doplňte datum], č.j. [Číslo jednací], a předávala nezletilého otci ke stanoveným stykům.

2. Pro případ, že matka nezletilého otci v budoucnu opětovně nepředá v souladu se soudním rozhodnutím, ukládá se matce pokuta ve výši 20 000 Kč (slovy: dvacet tisíc korun českých) za každé jednotlivé porušení povinnosti.

3. Matka je povinna uhradit otci náklady tohoto řízení do 3 dnů od právní moci tohoto usnesení.

V [Doplňte vaše město] dne ${today}


.................................................
[Váš podpis]
${genData.fatherName || '[Jméno otce]'}`;
    }

    setGeneratedText(text);
  };

  useEffect(() => {
    generateDocument();
  }, [generatorDocType, genData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    const title = generatorDocType === 'predbezko' ? 'Návrh na předběžné opatření' : generatorDocType === 'podjatost' ? 'Námitka podjatosti OSPOD' : 'Oznámení o maření výkonu rozhodnutí';
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document || printFrame.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: 'Times New Roman', Times, Georgia, serif;
                padding: 40px;
                line-height: 1.6;
                color: #111111;
                font-size: 12pt;
              }
              h1, h2, h3 {
                text-align: center;
                margin-bottom: 20px;
              }
              p, div {
                margin-bottom: 15px;
                text-align: justify;
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>
            <div style="font-size: 9pt; text-align: right; color: #777; margin-bottom: 25px; font-family: sans-serif; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
              Generováno krizovým centrem portálu "Táta má právo" (synthesis-hub)
            </div>
            <div style="white-space: pre-wrap;">${generatedText}</div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.frameElement.remove();
                }, 200);
              }
            </script>
          </body>
        </html>
      `);
      doc.close();
    }
  };

  const handleDownloadWord = () => {
    const title = generatorDocType === 'predbezko' ? 'predbezne_opatreni' : generatorDocType === 'podjatost' ? 'namitka_podjatosti' : 'mareni_vykonu';
    const blob = new Blob(['\ufeff' + generatedText], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- 4. INCIDENT LOG / DIARY SYSTEM ---
  const [diaryLogs, setDiaryLogs] = useState<IncidentLog[]>(() => 
    getStoredState<IncidentLog[]>('diary_logs', [])
  );
  
  const [newLog, setNewLog] = useState<Omit<IncidentLog, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    childState: '',
    motherState: '',
    incidentType: 'smooth',
    policeCalled: false,
    notes: ''
  });

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const log: IncidentLog = {
      id: 'log-' + Date.now(),
      ...newLog
    };
    const updated = [log, ...diaryLogs];
    setDiaryLogs(updated);
    setStoredState('diary_logs', updated);
    // Reset state
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      childState: '',
      motherState: '',
      incidentType: 'smooth',
      policeCalled: false,
      notes: ''
    });
  };

  const handleDeleteLog = (id: string) => {
    const updated = diaryLogs.filter(log => log.id !== id);
    setDiaryLogs(updated);
    setStoredState('diary_logs', updated);
  };

  const getIncidentBadge = (type: string) => {
    switch (type) {
      case 'smooth': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'delay': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'obstruction': return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      case 'verbal_attack': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getIncidentLabel = (type: string) => {
    switch (type) {
      case 'smooth': return 'Hladké předání';
      case 'delay': return 'Zpoždění matky';
      case 'obstruction': return 'Maření / Nepředání dítěte';
      case 'verbal_attack': return 'Verbální útok / Konflikt';
      default: return 'Jiné';
    }
  };

  return (
    <div className="space-y-8" id="crisis-section-root">

      {/* Main Section Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <LifeBuoy className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider font-mono">První Pomoc &amp; Právní Podklady</span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Krizová podpora &amp; Odborný průvodce</h2>
            </div>
          </div>
          
          {/* Main Navigation Sub-tabs */}
          <div className="flex flex-wrap bg-slate-50 border border-slate-100 p-1 rounded-xl text-xs font-semibold gap-1 shrink-0 w-full md:w-auto" id="crisis-sub-nav-tabs">
            <button
              onClick={() => { setActiveSubTab('triage'); setSelectedScenario(null); }}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center justify-center gap-1 ${
                activeSubTab === 'triage' ? 'bg-white text-rose-700 shadow-3xs border border-rose-100/30' : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Triage / Krizová navigace
            </button>
            <button
              onClick={() => setActiveSubTab('generator')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center justify-center gap-1 ${
                activeSubTab === 'generator' ? 'bg-white text-rose-700 shadow-3xs border border-rose-100/30' : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Generátor podání
            </button>
            <button
              onClick={() => setActiveSubTab('map')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center justify-center gap-1 ${
                activeSubTab === 'map' ? 'bg-white text-rose-700 shadow-3xs border border-rose-100/30' : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Regionální krizové mapy
            </button>
            <button
              onClick={() => setActiveSubTab('diary')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center justify-center gap-1 ${
                activeSubTab === 'diary' ? 'bg-white text-rose-700 shadow-3xs border border-rose-100/30' : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Protokol předávání
            </button>
            <button
              onClick={() => setActiveSubTab('glossary')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center justify-center gap-1 ${
                activeSubTab === 'glossary' ? 'bg-white text-rose-700 shadow-3xs border border-rose-100/30' : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Slovníček
            </button>
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
          Pokud řešíte náhlou krizovou situaci v opatrovnické věci, zprávu sociální pracovnice nebo se připravujete k jednání u soudu, jste na správném místě. Zde najdete <strong>přehledné návody krok za krokem</strong>, automatický generátor podání, regionální kontakty pro odbornou pomoc a deník pro věcnou evidenci průběhu péče.
        </p>
      </div>

      {/* --- CONTENT RENDER --- */}

      {/* --- SUB-TAB 1: TRIAGE / KRIZOVÁ NAVIGACE --- */}
      {activeSubTab === 'triage' && (
        <div className="space-y-6 animate-fadeIn" id="triage-main-view">
          
          {/* Grid of Scenario Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <button
              id="triage-scenario-refused"
              onClick={() => setSelectedScenario('refused')}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-4 h-full ${
                selectedScenario === 'refused'
                  ? 'bg-teal-50 border-teal-300 shadow-xs'
                  : 'bg-white hover:bg-teal-50/20 border-slate-100 hover:border-teal-150 shadow-3xs'
              }`}
            >
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-teal-600 block">Incident s nepředáním</span>
                <h3 className="font-bold text-slate-800 text-sm font-display">Matka odmítla předat dítě</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Stojíte před domem, zvoníte, neotvírá. Nebo matka tvrdí, že dítě je „nemocné“, ale odmítá doložit lékařskou zprávu. Co dělat teď?
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 mt-2">
                Zobrazit doporučený postup <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              id="triage-scenario-court"
              onClick={() => setSelectedScenario('court')}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-4 h-full ${
                selectedScenario === 'court'
                  ? 'bg-teal-50 border-teal-300 shadow-xs'
                  : 'bg-white hover:bg-teal-50/20 border-slate-100 hover:border-teal-150 shadow-3xs'
              }`}
            >
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-teal-600 block">Příprava na přelíčení</span>
                <h3 className="font-bold text-slate-800 text-sm font-display">Brzy mám opatrovnický soud</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Cítíte obavy a stres z nadcházejícího jednání. Jak se klidně a věcně připravit a na co se zaměřit?
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 mt-2">
                Zobrazit doporučený postup <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              id="triage-scenario-ospod"
              onClick={() => setSelectedScenario('ospod')}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-4 h-full ${
                selectedScenario === 'ospod'
                  ? 'bg-teal-50 border-teal-300 shadow-xs'
                  : 'bg-white hover:bg-teal-50/20 border-slate-100 hover:border-teal-150 shadow-3xs'
              }`}
            >
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-teal-600 block">Jednání s úřadem</span>
                <h3 className="font-bold text-slate-800 text-sm font-display">OSPOD vypracoval zkreslenou zprávu</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Sociální pracovnice neúplně vyhodnotila vaše podklady nebo postupovala neuplatněním rovného přístupu.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 mt-2">
                Zobrazit doporučený postup <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              id="triage-scenario-verdict"
              onClick={() => setSelectedScenario('verdict')}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-4 h-full ${
                selectedScenario === 'verdict'
                  ? 'bg-teal-50 border-teal-300 shadow-xs'
                  : 'bg-white hover:bg-teal-50/20 border-slate-100 hover:border-teal-150 shadow-3xs'
              }`}
            >
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-teal-600 block">Soudní rozhodnutí</span>
                <h3 className="font-bold text-slate-800 text-sm font-display">Soud doručil nepříznivý rozsudek</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Obdrželi jste rozhodnutí nebo předběžné opatření, které nenaplňuje rovnocenný podíl na péči. Lhůta pro odvolání běží.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 mt-2">
                Zobrazit doporučený postup <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

          </div>

          {/* Detailed Strategy Guidance Card based on selected scenario */}
          {selectedScenario ? (
            <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-md space-y-6 animate-fadeIn" id="triage-detail-guidance-card">
              
              {/* Refused scenario */}
              {selectedScenario === 'refused' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-rose-100">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <h3 className="font-bold text-slate-850 text-base font-display">První pomoc: Matka odmítla předat dítě</h3>
                  </div>

                  <p className="text-xs text-slate-650 leading-relaxed">
                    Nepředání dítěte v čase stanoveném soudem nebo písemnou dohodou rodičů je závažným mařením výkonu rozhodnutí. Nehádejte se, neprovokujte konflikty, nepokoušejte se o násilný vstup. Postupujte s chladnou hlavou jako chirurg. Vaším cílem je <strong>vytvořit nezpochybnitelné důkazy pro soud</strong>.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-1.5">
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-[11px] font-extrabold flex items-center justify-center">1</span>
                      <h4 className="font-bold text-slate-800 text-xs font-display">Zdokumentujte scénu</h4>
                      <p className="text-[11px] text-slate-550 leading-normal">
                        Natočte na mobilní telefon krátké video, jak stojíte před domem, zazvoňte, slušně požádejte o předání dítěte. Pokud nikdo neodpovídá, zaznamenejte na videu přesný čas a okolí.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-1.5">
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-[11px] font-extrabold flex items-center justify-center">2</span>
                      <h4 className="font-bold text-slate-800 text-xs font-display">Pošlete SMS / E-mail</h4>
                      <p className="text-[11px] text-slate-550 leading-normal">
                        Okamžitě pošlete matce SMS: <em>„Stojím před domem k převzetí dětí dle rozsudku. Prosím o předání dětí.“</em> Pokud neodpoví, po 15 min odešlete výzvu k náhradnímu termínu.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-1.5">
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-[11px] font-extrabold flex items-center justify-center">3</span>
                      <h4 className="font-bold text-slate-800 text-xs font-display">Svědectví / OSPOD</h4>
                      <p className="text-[11px] text-slate-550 leading-normal">
                        Mějte s sebou svědka (kamaráda, přítele), který může odpřísahat průběh incidentu. Pošlete sociální pracovnici OSPODU e-mail s popisem incidentu ještě tentýž den.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FAF9F5] border border-[#EBE7E0] p-4.5 rounded-xl space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-rose-600" />
                      Volat Policii ČR?
                    </h4>
                    <p className="text-[11px] text-slate-650 leading-relaxed">
                      <strong>Základní pravidlo:</strong> Policie ČR dítě fyzicky neodebere, pokud nejde o bezprostřední ohrožení života. Volání policie však slouží k <strong>oficiálnímu zaprotokolování maření</strong>. Pokud matka maří opakovaně, Policii ČR zavolejte na linku 158. Požádejte o příjezd hlídky k prověření porušování předběžného opatření/rozsudku. Následně si na policejní stanici vyžádejte <strong>úřední záznam</strong>. Tento záznam je pro soud neprůstřelným důkazem!
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      onClick={() => { setActiveSubTab('generator'); setGeneratorDocType('mareni'); }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-3xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-300" />
                      Generovat Oznámení o maření pro soud
                    </button>
                  </div>
                </div>
              )}

              {/* Court scenario */}
              {selectedScenario === 'court' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-rose-100">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <h3 className="font-bold text-slate-850 text-base font-display">První pomoc: Zítra mám opatrovnický soud</h3>
                  </div>

                  <p className="text-xs text-slate-655 leading-relaxed">
                    Soudní síň není bojištěm emocí, ale <strong>bojištěm důkazů a chladnokrevného dojmu</strong>. Soudce opatrovnického soudu vidí desítky rodin týdně. Vyhraje ten, kdo působí jako stabilní, dospělý, neemotivní partner, který se soustředí výhradně na zájmy dětí.
                  </p>

                  <div className="space-y-3.5 text-xs text-slate-700">
                    <div className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                      <div>
                        <strong className="text-slate-900 font-display font-semibold block">Vystupování a vizuální dojem</strong>
                        <p className="text-[11px] text-slate-550 leading-relaxed mt-0.5">
                          Oblečte se formálně (oblek, košile). Mluvte pomalu, klidným tónem, zásadně neskákejte soudci ani matce do řeči. I když protistrana lže, klidně si dělejte poznámky na papír. Emoční výbuch nebo naštvanost otec u soudu vždy prohraje – soudce to vyhodnotí jako agresivitu.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                      <div>
                        <strong className="text-slate-900 font-display font-semibold block">Argumentační fokus: Zájem dětí</strong>
                        <p className="text-[11px] text-slate-550 leading-relaxed mt-0.5">
                          Nikdy nekritizujte matku jako člověka. Argumentujte věcně: <em>„Matka je dobrá matka, ale já jsem stejně dobrý a plnohodnotný otec. Dítě má právo na oba rodiče.“</em> Zaměřte se na organizaci času, kroužky, zdravý vývoj. Ukažte, že střídavou péči navrhujete proto, aby kluci nepřišli o tátu ani o sebe navzájem.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                      <div>
                        <strong className="text-slate-900 font-display font-semibold block">Co si vzít fyzicky s sebou</strong>
                        <p className="text-[11px] text-slate-550 leading-relaxed mt-0.5">
                          Blok, pero, vytištěné nejdůležitější důkazy ve 3 kopiích (pro soudce, OSPOD a matku). Mějte s sebou vytištěný náš <strong>grafický plán střídavé péče</strong> a simulátor sourozeneckých vazeb. Vizuální schémata soudce okamžitě pochopí a ušetříte tím hodiny vysvětlování.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      onClick={() => setActiveSubTab('glossary')}
                      className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      Studovat právní slovníček
                    </button>
                  </div>
                </div>
              )}

              {/* OSPOD scenario */}
              {selectedScenario === 'ospod' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-rose-100">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <h3 className="font-bold text-slate-850 text-base font-display">První pomoc: OSPOD je podjatý / píše lži</h3>
                  </div>

                  <p className="text-xs text-slate-655 leading-relaxed">
                    Pracovnice OSPODU by měla být nestranným opatrovníkem dětí, v realitě se však bohužel setkáváme s hluboce zakořeněnými předsudky a protežováním matek. Pokud pracovnice píše do zpráv lži, ignoruje vaše práva a chová se k vám arogantně, <strong>musíte se začít bránit právními nástroji</strong>.
                  </p>

                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-150 space-y-2">
                      <h4 className="font-bold text-slate-800 text-xs font-display">1. Komunikujte výhradně písemně</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Po každém telefonátu nebo osobním jednání s pracovnicí OSPOD pošlete e-mail se shrnutím: <em>„Dobrý den, navazuji na naše dnešní jednání, kde jsem vám sdělil, že... Vy jste mi na to odpověděla, že...“</em> Tímto způsobem zamezíte překrucování vašich slov.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-150 space-y-2">
                      <h4 className="font-bold text-slate-800 text-xs font-display">2. Právo nahlížet do spisu (Spis OSPOD - tzv. „Om-spis“)</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Máte plné zákonné právo nahlížet do spisu vašeho dítěte vedeného na OSPOD a pořizovat si z něj fotokopie. Udělejte to okamžitě! Zjistíte, zda matka bez vašeho vědomí nezanáší pracovnici lživé pomluvy, které se pak dostávají k soudu.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-150 space-y-2">
                      <h4 className="font-bold text-slate-800 text-xs font-display">3. Stížnost a Námitka podjatosti</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Pokud pracovnice zjevně porušuje zákon a etický kodex, podejte formální stížnost k jejímu vedoucímu nebo vzneste <strong>námitku podjatosti</strong>. Tím vyvoláte správní řízení, její vedoucí musí věc prošetřit a vy dáváte jasný signál, že si nenecháte líbit nezákonné postupy.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      onClick={() => { setActiveSubTab('generator'); setGeneratorDocType('podjatost'); }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-3xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-300" />
                      Generovat námitku podjatosti OSPOD
                    </button>
                  </div>
                </div>
              )}

              {/* Verdict scenario */}
              {selectedScenario === 'verdict' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-rose-100">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <h3 className="font-bold text-slate-850 text-base font-display">První pomoc: Doručení nepříznivého rozsudku</h3>
                  </div>

                  <p className="text-xs text-slate-655 leading-relaxed">
                    Doručení nepříznivého rozsudku prvoinstančního soudu může přinést zklamání a nejistotu. Pamatujte, že <strong>proces nekončí</strong>. Rozsudek Okresního soudu není definitivní, dokud nenabude právní moci. Máte zákonné právo podat odvolání ke Krajskému soudu a předložit věcnou argumentaci!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-1.5">
                      <h4 className="font-bold text-slate-800 text-xs font-display">1. Hlídejte si odvolací lhůtu!</h4>
                      <p className="text-[11px] text-slate-600 leading-normal">
                        Standardní lhůta pro odvolání proti rozsudku je <strong>15 dní od doručení</strong> (rozhodující je datum převzetí na poště nebo v datové schránce). U předběžného opatření je to často rovněž 15 dní. Tuto lhůtu nesmíte promeškat ani o vteřinu, jinak rozhodnutí nabude právní moci!
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-1.5">
                      <h4 className="font-bold text-slate-800 text-xs font-display">2. Sepište odvolání racionálně</h4>
                      <p className="text-[11px] text-slate-600 leading-normal">
                        V odvolání neútočte na soudce ani na matku. Argumentujte vědeckými poznatky, porušováním práv dítěte a <strong>judikaturou Ústavního soudu</strong>. Krajské soudy mívají výrazně vyšší právní kulturu a často napravují katastrofální chyby okresních soudců.
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-850 space-y-1.5">
                    <h4 className="font-bold flex items-center gap-1.5">
                      <LifeBuoy className="w-4 h-4 text-amber-700 animate-pulse" />
                      Doporučení: Okamžitá právní pomoc
                    </h4>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      Při doručení rozsudku důrazně doporučujeme obrátit se na bezplatnou <strong>Asociaci občanských poraden</strong> nebo na organizaci <strong>Aperio / Unie otců</strong>. Pomohou vám analyzovat odůvodnění soudce a sepsat vysoce kvalifikované odvolání. Kontakty naleznete v našem adresáři.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      onClick={() => setActiveSubTab('map')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-3xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-teal-300" />
                      Najít bezplatnou poradnu ve svém kraji
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center" id="triage-placeholder">
              <LifeBuoy className="w-10 h-10 text-slate-350 mx-auto animate-pulse mb-3" />
              <p className="text-slate-500 text-xs max-w-md mx-auto">
                Zvolte nahoře jeden ze čtyř kritických scénářů krizové situace. Zobrazíme vám okamžitý, bezpečný a strategicky neprůstřelný akční plán krok za krokem.
              </p>
            </div>
          )}

        </div>
      )}

      {/* --- SUB-TAB 2: INTERAKTIVNÍ GENERÁTOR DOKUMENTŮ --- */}
      {activeSubTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn" id="document-generator-view">
          
          {/* Left inputs column (4 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-3xs space-y-4">
              
              <div className="border-b border-slate-50 pb-2.5">
                <h3 className="font-bold text-slate-800 text-xs font-display">1. Vyberte vzor podání</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Soudní návrhy generujeme bleskově</p>
              </div>

              {/* Selector buttons */}
              <div className="grid grid-cols-1 gap-2">
                <button
                  id="generator-type-predbezko"
                  onClick={() => setGeneratorDocType('predbezko')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                    generatorDocType === 'predbezko'
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : 'bg-slate-50/50 hover:bg-slate-50 border-slate-150 text-slate-700'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs">Předběžné opatření (styk s dětmi)</h4>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Když matka svévolně odstřihne otce a zamezí kontaktu s dětmi.</p>
                  </div>
                </button>

                <button
                  id="generator-type-podjatost"
                  onClick={() => setGeneratorDocType('podjatost')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                    generatorDocType === 'podjatost'
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : 'bg-slate-50/50 hover:bg-slate-50 border-slate-150 text-slate-700'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs">Námitka podjatosti OSPOD</h4>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Pokud sociální pracovnice porušuje nestrannost a nadržuje matce.</p>
                  </div>
                </button>

                <button
                  id="generator-type-mareni"
                  onClick={() => setGeneratorDocType('mareni')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                    generatorDocType === 'mareni'
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : 'bg-slate-50/50 hover:bg-slate-50 border-slate-150 text-slate-700'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs">Oznámení o maření styku (Pokuty)</h4>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Matka ignoruje platné rozhodnutí soudu a nepředává dítě.</p>
                  </div>
                </button>
              </div>

              <div className="border-b border-slate-50 pt-2 pb-2.5">
                <h3 className="font-bold text-slate-800 text-xs font-display">2. Vyplňte základní údaje</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Údaje se okamžitě dosadí do formální šablony</p>
              </div>

              {/* Form fields */}
              <div className="space-y-3.5 text-xs text-slate-700" id="generator-form-fields">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-slate-600">Okresní soud v (město)</label>
                    <input
                      type="text"
                      name="courtCity"
                      value={genData.courtCity}
                      onChange={handleGenChange}
                      placeholder="např. Kladně, Odrách"
                      className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-rose-500 rounded-lg outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-slate-600">Jméno dětí</label>
                    <input
                      type="text"
                      name="childName"
                      value={genData.childName}
                      onChange={handleGenChange}
                      placeholder="např. syn Tomáš"
                      className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-rose-500 rounded-lg outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-slate-600">Datum narození dětí</label>
                    <input
                      type="text"
                      name="childBirth"
                      value={genData.childBirth}
                      onChange={handleGenChange}
                      placeholder="12. 5. 2018 a 3. 9. 2020"
                      className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-rose-500 rounded-lg outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-slate-600">Datum incidentu / porušení</label>
                    <input
                      type="text"
                      name="incidentDate"
                      value={genData.incidentDate}
                      onChange={handleGenChange}
                      placeholder="např. 11. července 2026"
                      className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-rose-500 rounded-lg outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-1">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">Údaje o otci (Navrhovatel)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="fatherName"
                      value={genData.fatherName}
                      onChange={handleGenChange}
                      placeholder="Celé jméno otce"
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs"
                    />
                    <input
                      type="text"
                      name="fatherBirth"
                      value={genData.fatherBirth}
                      onChange={handleGenChange}
                      placeholder="Datum narození"
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    name="fatherAddress"
                    value={genData.fatherAddress}
                    onChange={handleGenChange}
                    placeholder="Adresa bydliště, PSČ"
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs mt-1"
                  />
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-1">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">Údaje o matce (Odpůrkyně)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="motherName"
                      value={genData.motherName}
                      onChange={handleGenChange}
                      placeholder="Celé jméno matky"
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs"
                    />
                    <input
                      type="text"
                      name="motherBirth"
                      value={genData.motherBirth}
                      onChange={handleGenChange}
                      placeholder="Datum narození"
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    name="motherAddress"
                    value={genData.motherAddress}
                    onChange={handleGenChange}
                    placeholder="Adresa bydliště, PSČ"
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs mt-1"
                  />
                </div>

                {generatorDocType === 'podjatost' && (
                  <div className="border-t border-slate-100 pt-3 space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">Údaje o OSPOD</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="ospodWorker"
                        value={genData.ospodWorker}
                        onChange={handleGenChange}
                        placeholder="Jméno soc. pracovnice"
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs"
                      />
                      <input
                        type="text"
                        name="ospodCity"
                        value={genData.ospodCity}
                        onChange={handleGenChange}
                        placeholder="Městská část / Město"
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs"
                      />
                    </div>
                  </div>
                )}

                {(generatorDocType === 'predbezko' || generatorDocType === 'mareni') && (
                  <div className="border-t border-slate-100 pt-3 space-y-1">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">Navrhovaný režim / Režim dle rozsudku</label>
                    <input
                      type="text"
                      name="contactRegime"
                      value={genData.contactRegime}
                      onChange={handleGenChange}
                      placeholder="např. od pátku 16:00 do neděle 18:00 v sudých týdnech"
                      className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-rose-500 rounded-lg outline-none transition-all"
                    />
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 space-y-1">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">Popis incidentu / důvody krizové situace</label>
                  <textarea
                    name="incidentDetails"
                    value={genData.incidentDetails}
                    onChange={handleGenChange}
                    rows={4}
                    placeholder="Zde podrobně rozepište konkrétní chování matky nebo úřednice. Např. dne 10.7. matka nevydala dětí a zabouchla dveře s tím, že otec nemá nárok. / Úřednice při rozhovoru vyjádřila dehonestující soudy, že muži neumí vařit..."
                    className="w-full px-2.5 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-rose-500 rounded-lg outline-none resize-none transition-all text-xs"
                  />
                </div>

              </div>

            </div>
          </div>

          {/* Right output preview column (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-slate-900 rounded-2xl p-5 md:p-6 shadow-md border border-slate-800 flex flex-col justify-between h-full min-h-[600px]">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-teal-400" />
                    <div>
                      <h3 className="font-bold text-white text-xs font-display">Právní náhled podání</h3>
                      <p className="text-[10px] text-slate-400">Připraveno k odeslání do datové schránky soudu</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      id="copy-generated-doc-btn"
                      onClick={copyToClipboard}
                      className="px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-white border border-teal-500/20 hover:border-teal-500 text-[11px] font-extrabold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {isCopied ? 'Zkopírováno!' : 'Zkopírovat'}
                    </button>

                    <button
                      id="print-generated-doc-btn"
                      onClick={handlePrint}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white border border-teal-600 hover:border-teal-700 text-[11px] font-extrabold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Vytisknout nebo uložit do PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Tisk / PDF
                    </button>

                    <button
                      id="download-generated-doc-word-btn"
                      onClick={handleDownloadWord}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 text-[11px] font-extrabold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Stáhnout jako formát pro MS Word"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      Word (.doc)
                    </button>
                  </div>
                </div>

                {/* Formatted plaintext document preview area */}
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 font-mono text-[11px] text-slate-300 h-[520px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-text" id="generated-document-textarea">
                  {generatedText}
                </div>
              </div>

              {/* Informative footer */}
              <div className="mt-4 bg-slate-800/40 border border-slate-800 p-3 rounded-xl text-[11px] text-slate-400 space-y-1 leading-normal">
                <h4 className="font-bold text-teal-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  Jak vygenerované podání podat na soud?
                </h4>
                <p>
                  1. Zkopírujte text podání kliknutím na tlačítko nahoře.<br />
                  2. Vložte jej do textového editoru (Word, Pages) a uložte jako <strong>PDF</strong>.<br />
                  3. Přihlaste se do své <strong>osobní datové schránky</strong> a odešlete PDF přímo na datovou schránku daného soudu. Podání přes datovou schránku má váhu podpisu, je <strong>zdarma</strong> a soud ho musí okamžitě zaprotokolovat.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* --- SUB-TAB 3: REGIONÁLNÍ ADRESÁŘ & MAPA POMOCI --- */}
      {activeSubTab === 'map' && (
        <div className="space-y-6 animate-fadeIn" id="regional-map-help-view">
          
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-3xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm font-display">Filtrovat krizové organizace a poradny podle krajů</h3>
                <p className="text-xs text-slate-400 mt-0.5">Vyberte svůj kraj pro zobrazení lokální podpory</p>
              </div>
              
              {/* Region Select dropdown */}
              <div className="relative w-full sm:w-64">
                <select
                  id="region-filter-dropdown"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-rose-500 rounded-xl text-xs font-bold outline-none cursor-pointer transition-colors"
                >
                  {Object.keys(REGIONS_DATA).map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* List of institutions in selected region */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="region-institutions-list">
              {REGIONS_DATA[selectedRegion]?.map((item, idx) => (
                <div key={idx} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-150 hover:border-rose-200 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all">
                  
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <span className="text-[9px] bg-rose-50 border border-rose-100 text-rose-700 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                        {selectedRegion}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm font-display leading-snug mt-1">{item.name}</h4>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed text-justify">
                      {item.desc}
                    </p>

                    <div className="text-[10px] text-slate-500 font-mono bg-white p-2.5 rounded-xl border border-slate-100">
                      <strong className="text-rose-800 font-bold">Oblast pomoci:</strong> {item.focus}
                    </div>

                    {/* Quick contacts */}
                    <div className="space-y-1.5 pt-1 text-[11px] text-slate-500 font-mono">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-600" />
                        {item.city}
                      </div>
                      {item.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-rose-600" />
                          {item.phone}
                        </div>
                      )}
                      {item.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-rose-600" />
                          <span className="truncate">{item.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/40">
                    <a
                      href={item.url}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="w-full py-2 bg-white hover:bg-rose-600 border border-slate-200 hover:border-rose-600 text-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Přejít na oficiální web
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* --- SUB-TAB 4: DIARY / PROTOKOL PŘEDÁVÁNÍ --- */}
      {activeSubTab === 'diary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn" id="incident-diary-view">
          
          {/* Left Form Column (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-3xs space-y-4">
              
              <div className="border-b border-slate-50 pb-2.5">
                <h3 className="font-bold text-slate-800 text-xs font-display">Zapsat nový incident / předání</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Zapisujte pravidelně, tvoříte si chronologický deník důkazů</p>
              </div>

              <form onSubmit={handleAddLog} className="space-y-4 text-xs text-slate-700" id="diary-log-form">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-slate-600">Datum incidentu / převzetí</label>
                    <input
                      type="date"
                      required
                      value={newLog.date}
                      onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-slate-600">Typ incidentu</label>
                    <select
                      value={newLog.incidentType}
                      onChange={(e) => setNewLog({ ...newLog, incidentType: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      <option value="smooth">Hladké předání</option>
                      <option value="delay">Zpoždění matky</option>
                      <option value="obstruction">Maření / Nepředání dítěte</option>
                      <option value="verbal_attack">Verbální útok / Konflikt</option>
                      <option value="other">Jiné</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-slate-600">Stav dětí při předání</label>
                    <input
                      type="text"
                      value={newLog.childState}
                      onChange={(e) => setNewLog({ ...newLog, childState: e.target.value })}
                      placeholder="např. ustrašený, plakal, šťastný"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-slate-600">Reakce / Stav matky</label>
                    <input
                      type="text"
                      value={newLog.motherState}
                      onChange={(e) => setNewLog({ ...newLog, motherState: e.target.value })}
                      placeholder="např. arogantní, odmítla mluvit"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                  <input
                    type="checkbox"
                    id="police-called-checkbox"
                    checked={newLog.policeCalled}
                    onChange={(e) => setNewLog({ ...newLog, policeCalled: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                  <label htmlFor="police-called-checkbox" className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono cursor-pointer select-none">
                    Byla přivolána hlídka Policie ČR?
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-slate-600">Podrobné poznámky (Důkazní popisy)</label>
                  <textarea
                    required
                    value={newLog.notes}
                    onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                    rows={4}
                    placeholder="Zapište doslovné citace, co přesně matka řekla, zda dětí měly připravené věci, zda byly přítomni svědci a jejich jména."
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg resize-none text-xs outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  id="add-diary-log-btn"
                  type="submit"
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-3xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-teal-300" />
                  Uložit záznam do protokolu
                </button>

              </form>

            </div>
          </div>

          {/* Right Diary List Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-3xs flex flex-col justify-between h-full min-h-[500px]">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-rose-600" />
                    <div>
                      <h3 className="font-bold text-slate-850 text-xs font-display">Deník předávání & Přehled incidentů</h3>
                      <p className="text-[10px] text-slate-400">Data jsou bezpečně uložena pouze ve vašem prohlížeči</p>
                    </div>
                  </div>
                  
                  {diaryLogs.length > 0 && (
                    <button
                      id="print-diary-logs-btn"
                      onClick={() => window.print()}
                      className="px-3 py-1.5 border border-slate-250 text-slate-750 hover:bg-slate-50 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      Tisk protokolu pro soud
                    </button>
                  )}
                </div>

                {/* Logs lists container */}
                <div className="space-y-4 max-h-[550px] overflow-y-auto" id="diary-logs-scroller">
                  {diaryLogs.length === 0 ? (
                    <div className="text-center p-12 text-slate-400 text-xs space-y-2">
                      <Clock className="w-10 h-10 text-slate-300 mx-auto animate-pulse" />
                      <p>Deník je zatím prázdný.</p>
                      <p className="text-[10px] max-w-sm mx-auto">
                        Zapište první předání nebo zmařený styk vlevo. Pravidelný deník slouží k prokázání systematického porušování povinností druhou stranou u soudu.
                      </p>
                    </div>
                  ) : (
                    diaryLogs.map(log => (
                      <div key={log.id} className="p-4 rounded-xl border border-slate-100 hover:border-rose-100 bg-slate-50/20 hover:bg-slate-50/50 transition-all space-y-3" id={`diary-log-item-${log.id}`}>
                        
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-700 bg-white border border-slate-150 px-2 py-0.5 rounded-lg shadow-3xs">
                              {new Date(log.date).toLocaleDateString('cs-CZ')}
                            </span>
                            <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-md uppercase tracking-wider font-mono ${getIncidentBadge(log.incidentType)}`}>
                              {getIncidentLabel(log.incidentType)}
                            </span>
                          </div>

                          <button
                            id={`delete-diary-log-btn-${log.id}`}
                            onClick={() => handleDeleteLog(log.id)}
                            className="text-slate-350 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Smazat záznam"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed text-justify font-sans whitespace-pre-wrap">
                          {log.notes}
                        </p>

                        <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-slate-500 bg-white p-2.5 rounded-lg border border-slate-100">
                          <div>
                            <span className="text-slate-450 block font-bold text-[9px] uppercase tracking-wider mb-0.5">Stav dětí:</span>
                            {log.childState || 'Nespecifikováno'}
                          </div>
                          <div>
                            <span className="text-slate-450 block font-bold text-[9px] uppercase tracking-wider mb-0.5">Stav matky:</span>
                            {log.motherState || 'Nespecifikováno'}
                          </div>
                          {log.policeCalled && (
                            <div className="col-span-2 pt-1.5 border-t border-slate-50 text-rose-700 font-bold flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              PŘIVOLÁNA HLÍDKA POLICIE ČR
                            </div>
                          )}
                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>

              {/* Informative Footer banner */}
              <div className="mt-4 bg-[#FAF9F5] border border-[#EBE7E0] p-4.5 rounded-xl text-xs text-slate-700 space-y-1">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-rose-600" />
                  Právní síla deníku předávání
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed text-justify">
                  Sami o sobě jsou vaše zápisky tvrzením. Pokud je však doložíte <strong>fotografiemi doručených SMS, výpisy volání, písemnou zprávou od OSPODU nebo úředními záznamy Policie ČR</strong>, získává tento chronologický deník obrovskou váhu. Soudce vidí dlouhodobý systematický režim (nebo jeho rozvrat), což eliminuje argumenty matky o „ojedinělém náhodném nedorozumění“.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* --- SUB-TAB 5: SLOVNÍČEK POJMŮ --- */}
      {activeSubTab === 'glossary' && (
        <div className="space-y-5 animate-fadeIn" id="legal-glossary-view">
          
          <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-3xs space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm font-display">Opatrovnický slovníček pojmů</h3>
                <p className="text-xs text-slate-400 mt-0.5">Demystifikujeme složitou právnickou hantýrku do lidské řeči</p>
              </div>

              {/* Glossary Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="glossary-search-input"
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Vyhledat pojem (např. OSPOD)..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-rose-500 rounded-xl outline-none transition-all"
                />
              </div>
            </div>

            {/* Glossary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="glossary-grid-container">
              {filteredGlossary.map((g, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 hover:border-rose-200 bg-slate-50/20 hover:bg-white hover:shadow-3xs transition-all space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-xs font-display flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    {g.term}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    {g.def}
                  </p>
                </div>
              ))}
              {filteredGlossary.length === 0 && (
                <div className="col-span-2 text-center p-8 text-slate-400 text-xs">
                  Nebyly nalezeny žádné pojmy odpovídající zadání.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Footer Banner: Switch to Author Contact */}
      <div className="mt-8 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold uppercase">
            <Mail className="w-4 h-4" />
            <span>Technická podpora &amp; Kontakt na autora</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            Máte technický dotaz k fungování portálu, hlášení chyby v AI asistentovi nebo chcete odeslat přímou zpětnou vazbu zakladateli Jiřímu Šárovi?
          </p>
        </div>
        <button
          onClick={() => setActiveTab && setActiveTab('contacts')}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-3xs shrink-0 flex items-center gap-1.5"
        >
          <span>Přejít na Kontakt na autora</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
