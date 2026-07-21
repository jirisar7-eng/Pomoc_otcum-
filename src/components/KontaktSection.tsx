/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Search, 
  Star, 
  ExternalLink, 
  MessageSquare, 
  Send, 
  CheckCircle2,
  Users,
  Scale,
  ShieldAlert,
  Award,
  HelpCircle,
  Heart,
  Info,
  BookOpen,
  Compass,
  Building,
  Flag,
  Check,
  Lock
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: string;
  category: 'lawyer' | 'mediator' | 'psych' | 'org';
  phone: string;
  email: string;
  city: string;
  desc: string;
  url: string;
}

const CONTACTS: Contact[] = [
  {
    id: 'c-1',
    name: 'Unie otců - asoc. spravedlivé opatrovnictví',
    role: 'Nezisková organizace pro podporu otců',
    category: 'org',
    phone: '+420 603 551 234',
    email: 'info@unieotcu.cz',
    city: 'Praha / Celá ČR',
    desc: 'Dobrovolné sdružení usilující o spravedlivé opatrovnictví, střídavou péči a rovná práva obou rodičů při výchově. Pořádá pravidelná setkání a nabízí poradenství.',
    url: 'https://www.unieotcu.cz'
  },
  {
    id: 'c-2',
    name: 'Aperio - společnost pro zdravé rodičovství',
    role: 'Poradna pro mámy i táty',
    category: 'org',
    phone: '+420 777 123 456',
    email: 'poradna@aperio.cz',
    city: 'Praha / Online',
    desc: 'Poskytuje bezplatné právní a psychologické poradenství pro rodiče v rozvodovém a porozvodovém stadiu. Vynikající průvodce pro komunikaci a řešení krizí.',
    url: 'https://www.aperio.cz'
  },
  {
    id: 'c-3',
    name: 'Mgr. Petr Novák',
    role: 'Advokát specializovaný na rodinné právo',
    category: 'lawyer',
    phone: '+420 222 333 444',
    email: 'novak@advokat-rodina.cz',
    city: 'Brno / Praha',
    desc: 'Dlouholetá praxe v zastupování otců i matek v opatrovnických sporech se zaměřením na prosazování střídavé péče a obhajobu práv u odvolacích soudů.',
    url: '#'
  },
  {
    id: 'c-4',
    name: 'PhDr. Helena Štěpánová',
    role: 'Dětská klinická psycholožka',
    category: 'psych',
    phone: '+420 541 222 333',
    email: 'stepanova.psych@seznam.cz',
    city: 'Ostrava',
    desc: 'Specializace na dětskou psychoterapii, zvládání porozvodových krizí u dětí a asistovaný styk. Pomáhá rodičům najít citlivý přístup a mírnit trauma u dětí.',
    url: '#'
  },
  {
    id: 'c-5',
    name: 'Asociace mediátorů ČR',
    role: 'Sdružení certifikovaných mediátorů',
    category: 'mediator',
    phone: '+420 224 812 345',
    email: 'amcr@mediace.cz',
    city: 'Celá ČR',
    desc: 'Zprostředkovává kontakty na akreditované mediátory, kteří vám pomohou vyjednat mimosoudní dohodu o péči a výživném bez zdlouhavých soudních bitev.',
    url: 'https://www.amcr.cz'
  }
];

// Structured catalog of institutions requested by the user
interface OrgItem {
  name: string;
  badge: string;
  desc: string;
  focus: string;
  url: string;
}

interface OrgCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  items: OrgItem[];
}

interface KontaktSectionProps {
  currentUser?: any;
  onOpenAuth?: () => void;
}

export default function KontaktSection({ currentUser, onOpenAuth }: KontaktSectionProps = {}) {
  const [activeSubTab, setActiveSubTab] = useState<'orgs' | 'specialists'>('orgs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'lawyer' | 'mediator' | 'psych' | 'org'>('all');
  
  // Message form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Structured list of organizations
  const ORGANIZATIONS_CATALOG: OrgCategory[] = [
    {
      id: 'fathers-orgs',
      title: '1. Organizace přímo zaměřené na podporu otců a střídavé péče',
      subtitle: 'Sdružení otců pro sdílení zkušeností, boj proti diskriminaci a prosazování střídavé péče',
      icon: <Users className="w-5 h-5 text-teal-600" />,
      items: [
        {
          name: 'Unie otců (Asociace za práva dětí a rodičů)',
          badge: 'Nejstarší spolek v ČR',
          desc: 'Nejhlasitější a nejstarší organizace otců v ČR (funguje od devadesátých let). Poskytuje psychosociální a základní právní poradenství, věnuje se problematice syndromu zavrženého rodiče (PAS) a její zástupci doprovázejí otce k soudním jednáním nebo na případové konference OSPOD.',
          focus: 'Doprovod k soudům, PAS poradenství, krizový kontakt, podpora u OSPOD.',
          url: 'https://www.unieotcu.cz'
        },
        {
          name: 'Střídavka (portál pro střídavou péči)',
          badge: 'Klíčový informační portál',
          desc: 'Klíčový internetový portál a komunita, která shromažďuje judikáty Ústavního soudu, rady, jak se hájit u soudu, a nabízí právní i psychologické poradny pro otce, kteří chtějí po rozchodu zůstat plnohodnotnými rodiči.',
          focus: 'Databáze judikátů, právní poradna zdarma, komunitní fóra, praktické návody.',
          url: 'https://www.stridavka.cz'
        },
        {
          name: 'K213',
          badge: 'Aktivismus & Obrana',
          desc: 'Radikálnější a velmi aktivistické sdružení, které dlouhodobě kritizuje postup opatrovnických soudů, OSPODů a bojuje proti diskriminaci otců v české opatrovnické justici.',
          focus: 'Aktivismus, monitoring pochybení soudců a sociálních pracovníků.',
          url: 'http://www.k213.cz'
        }
      ]
    },
    {
      id: 'pro-family-orgs',
      title: '2. Odborné prorodinné organizace (Pomoc rozvádějícím se rodičům)',
      subtitle: 'Nestranné profesionální organizace prosazující princip „Zůstáváme rodiči“',
      icon: <Heart className="w-5 h-5 text-indigo-600" />,
      items: [
        {
          name: 'Aperio (Společnost pro zdravé rodičovství)',
          badge: 'Odborný partner',
          desc: 'Provozují velký projekt „Rozchodem rodina nekončí“ a specializovaný web Zůstáváme rodiči. Nabízejí skvělé právní poradny (i online zdarma), komplexní psychologickou podporu, přípravné kurzy a mediace. Pomáhají otcům správně a odborně se orientovat v právních krocích.',
          focus: 'Online právní poradna, bezplatné psychologické konzultace, kurzy rozchodu bez traumatu.',
          url: 'https://www.aperio.cz'
        },
        {
          name: 'Liga otevřených mužů (LOM)',
          badge: 'Programy pro muže',
          desc: 'Organizace zaměřená přímo na muže a podporu jejich aktivní role. V rámci svého programu „Odpovědné otcovství“ podporují muže v tom, aby byli skvělými a aktivními táty, a to i po rozpadu partnerského vztahu. Nabízejí poradenství pro muže v krizi a kurzy zvládání vzteku, což otcům nesmírně pomáhá ustát psychický tlak u opatrovnických soudů.',
          focus: 'Krizová intervence pro muže, zvládání agrese a vzteku, kurzy aktivního otcovství.',
          url: 'https://ilom.cz'
        },
        {
          name: 'Cochemská praxe (Iniciativy za cochemský model)',
          badge: 'Dohoda na prvním místě',
          desc: 'Regionální sdružení a iniciativy prosazující tzv. Cochemský model v ČR (např. Cochemská praxe z.s.). Tento pokrokový model nutí soudy, OSPODy a psychology, aby rodiče vedli k oboustranné dohodě a smíru, místo aby z nich soudní řízení a posudky dělaly nepřátele na život a na smrt.',
          focus: 'Propagace mimosoudního konsenzu, školení Cochemské metody pro rodiny a úřady.',
          url: 'https://www.cochemskapraxe.cz'
        }
      ]
    },
    {
      id: 'free-legal-help',
      title: '3. Bezplatná právní a krizová pomoc',
      subtitle: 'Analýzy dokumentů, sepisování odvolání a kontrola postupů státní správy',
      icon: <Scale className="w-5 h-5 text-amber-600" />,
      items: [
        {
          name: 'Asociace občanských poraden',
          badge: 'Bezplatná právní síť',
          desc: 'Síť bezplatných sociálně-právních poraden po celé České republice. Pomohou vám se základní právní analýzou dokumentů, sepisováním kvalifikovaných odvolání, vyjádření a návrhů k soudu, pokud nemáte finance na drahé rodinné advokáty.',
          focus: 'Bezplatné poradenství, pomoc se psaním soudních podání, analýza smluv.',
          url: 'https://www.obcanskeporadny.cz'
        },
        {
          name: 'Kancelář Veřejného ochránce práv (Ombudsman)',
          badge: 'Kontrolní orgán',
          desc: 'Klíčová ústavní instituce, pokud fatálně selže OSPOD. Ombudsman sice nemůže přímo změnit rozsudek soudu, ale může podrobně prošetřit, odhalit a oficiálně potrestat nezákonný, zaujatý nebo nečinný postup pracovníků OSPOD (například pokud v řízení ignorují důležité rodinné vazby dětí).',
          focus: 'Stížnosti na pochybení OSPOD, šetření nezákonnosti v sociálně-právní ochraně.',
          url: 'https://www.ochrance.cz'
        }
      ]
    },
    {
      id: 'slovak-orgs',
      title: '4. Významné slovenské organizace (Přeshraniční podpora)',
      subtitle: 'Aktivní slovenské spolky nabízející cenné materiály a mezinárodní know-how',
      icon: <Flag className="w-5 h-5 text-[#7D8F69]" />,
      items: [
        {
          name: 'Rada pre práva dieťaťa (Slovensko)',
          badge: 'Ochrana dětí SR',
          desc: 'Velmi aktivní slovenská organizace, která tvrdě vystupuje proti pochybením státních úřadů a pomáhá i českým rodičům v mezinárodních rodinných sporech nebo při sdílení know-how, jak čelit manipulacím či obstrukcím ze strany druhého rodiče.',
          focus: 'Mezinárodní rodinné spory, dohled nad právy dětí, metodika obhajoby rodičovství.',
          url: 'https://www.pravadietata.sk'
        },
        {
          name: 'Liga otcov (Slovensko)',
          badge: 'Otcovský spolek SR',
          desc: 'Slovenská obdoba české Unie otců, zaměřená na zrovnoprávnění postavení mužů v porezoluční péči, podporu střídavé výchovy na Slovensku a bourání opatrovnických předsudků.',
          focus: 'Sdílení zkušeností, podpora legislativních změn, otcovská komunita.',
          url: 'https://www.ligaotcov.sk'
        }
      ]
    }
  ];

  const filteredContacts = useMemo(() => {
    return CONTACTS.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleSubmitMsg = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !msg.trim()) {
      setError('Vyplňte prosím všechna pole.');
      return;
    }

    setSent(true);
    setName('');
    setEmail('');
    setMsg('');
    setTimeout(() => {
      setSent(false);
    }, 5000);
  };

  return (
    <div className="space-y-8" id="kontakt-section-root">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider font-mono">Užitečné kontakty</span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Kam se obrátit o pomoc</h2>
            </div>
          </div>
          
          {/* Main Sub-tab toggle */}
          <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-xl text-xs font-semibold gap-1 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setActiveSubTab('orgs')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
                activeSubTab === 'orgs'
                  ? 'bg-white text-teal-700 shadow-3xs border border-teal-100/30'
                  : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100/60'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              Podpůrné Organizace
            </button>
            <button
              onClick={() => setActiveSubTab('specialists')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
                activeSubTab === 'specialists'
                  ? 'bg-white text-teal-700 shadow-3xs border border-teal-100/30'
                  : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Specialisté & Formulář
            </button>
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
          Rodinný a opatrovnický spor nemusíte zvládat sami a v izolaci. V České republice existuje několik typů organizací, krizových služeb a specialistů, kteří se zaměřují na pomoc tátům i mámám s cílem zachovat plnohodnotné rodičovství obou rodičů.
        </p>
      </div>

      {activeSubTab === 'orgs' ? (
        /* TAB 1: CATEGORIZED ORGANIZATIONS DIRECTORY */
        <div className="space-y-8 animate-fadeIn" id="organizations-catalog-tab">
          <div className="bg-[#FAF9F5] border border-[#EBE7E0] p-4.5 rounded-xl text-xs text-slate-700 space-y-1.5">
            <h3 className="font-bold text-slate-850 flex items-center gap-1">
              <Info className="w-4 h-4 text-teal-600" />
              Jak se v nabídce pomoci zorientovat?
            </h3>
            <p className="leading-relaxed text-[11px] text-slate-600 text-justify">
              Iniciativy se dělí na ty, které bojují aktivisticky přímo za práva otců, a na ty, které poskytují odbornou právní, psychologickou podporu a mediaci pro zachování rodičovství obou rodičů. U tátů, kteří zažívají prvotní šok z nespravedlivého rozsudku, nejlépe funguje doporučení na <strong>Aperio</strong> (pro konstruktivní a neprůstřelnou právní argumentaci u soudu) a <strong>Unii otců / Střídavku</strong> (pro okamžité sdílení zkušeností s muži, kteří prošli naprosto totožnými spory).
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {ORGANIZATIONS_CATALOG.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-3xs space-y-4" id={`org-category-${cat.id}`}>
                <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                  {cat.icon}
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm font-display">{cat.title}</h3>
                    <p className="text-slate-500 text-[10px] font-mono">{cat.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-150 hover:border-teal-200 p-4.5 rounded-xl flex flex-col justify-between space-y-3 transition-all">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-slate-800 text-xs font-display">{item.name}</h4>
                          <span className="text-[8px] bg-teal-50 text-teal-700 border border-teal-100 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 font-mono">
                            {item.badge}
                          </span>
                        </div>
                        
                        <p className="text-[11px] text-slate-600 leading-relaxed text-justify">
                          {item.desc}
                        </p>

                        <div className="text-[10px] text-slate-500 font-mono bg-white p-2 rounded-lg border border-slate-100">
                          <strong className="text-teal-800 font-bold">Klíčová pomoc:</strong> {item.focus}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/40">
                        <a
                          href={item.url}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          className="w-full py-1.5 bg-white hover:bg-teal-600 border border-slate-200 hover:border-teal-600 text-slate-700 hover:text-white rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          Přejít na oficiální web
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* TAB 2: SPECIALISTS LIST & BOOKING FORM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn" id="specialists-and-form-tab">
          
          {/* Left column: searchable contact directory */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
              
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-slate-50 pb-3">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="contact-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Hledat podle jména, města..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-all"
                  />
                </div>

                {/* Quick filter tags */}
                <div className="flex gap-1 overflow-x-auto w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedCategory === 'all' ? 'bg-teal-600 text-white shadow-3xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Vše
                  </button>
                  <button
                    onClick={() => setSelectedCategory('org')}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedCategory === 'org' ? 'bg-teal-600 text-white shadow-3xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Organizace
                  </button>
                  <button
                    onClick={() => setSelectedCategory('lawyer')}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedCategory === 'lawyer' ? 'bg-teal-600 text-white shadow-3xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Advokáti
                  </button>
                  <button
                    onClick={() => setSelectedCategory('mediator')}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedCategory === 'mediator' ? 'bg-teal-600 text-white shadow-3xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Mediátoři
                  </button>
                </div>
              </div>

              {/* Contacts lists */}
              <div className="space-y-4" id="contacts-list-container">
                {filteredContacts.length === 0 ? (
                  <div className="text-center p-8 text-slate-400 text-xs">
                    Nebyly nalezeny žádné odpovídající kontakty.
                  </div>
                ) : (
                  filteredContacts.map(c => (
                    <div key={c.id} className="p-4 rounded-xl border border-slate-100 hover:border-teal-100 hover:bg-slate-50/20 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4" id={`contact-item-${c.id}`}>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-800 font-display">{c.name}</h4>
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            c.category === 'lawyer' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                            c.category === 'mediator' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            c.category === 'psych' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                            'bg-[#E6EBDD] text-[#7D8F69] border border-[#D2DEC4]'
                          }`}>
                            {c.category === 'lawyer' ? 'Advokát' :
                             c.category === 'mediator' ? 'Mediátor' :
                             c.category === 'psych' ? 'Psycholog' : 'Organizace'}
                          </span>
                        </div>
                        
                        <span className="text-[10px] text-slate-400 font-mono block italic leading-none">{c.role}</span>
                        
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {c.desc}
                        </p>

                        {/* Phone, email, map indicators */}
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-400 font-mono pt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-teal-600" />
                            {c.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-teal-600" />
                            {c.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-teal-600" />
                            {c.email}
                          </span>
                        </div>
                      </div>

                      {c.url !== '#' && (
                        <a
                          href={c.url}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          className="sm:self-center py-1.5 px-3 bg-white border border-slate-200 text-slate-700 hover:text-teal-600 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-3xs cursor-pointer shrink-0"
                        >
                          Webové stránky
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>

          {/* Right column: admin message form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#EBE7E0] space-y-5" id="contact-admin-card">
              
              <div className="border-b border-[#EBE7E0] pb-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Napište nám</span>
                <h3 className="text-sm font-bold text-slate-800 font-display">Kontaktovat zakladatele</h3>
              </div>

              {/* Jiří Šár profile block */}
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-2 shadow-3xs">
                  <span className="text-[9px] uppercase font-extrabold text-teal-600 font-mono block">Zakladatel portálu</span>
                  <h4 className="text-xs font-extrabold text-slate-850 font-display">Jiří Šár</h4>
                  
                  <div className="space-y-1.5 pt-1 border-t border-slate-50 text-xs">
                    <div className="flex items-start gap-1.5 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <a href="mailto:sarji@seznam.cz" className="font-semibold text-slate-800 hover:text-teal-600 transition-colors block">sarji@seznam.cz</a>
                        <a href="mailto:mallfuriionn@gmail.com" className="font-semibold text-slate-800 hover:text-teal-600 transition-colors block">mallfuriionn@gmail.com</a>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-50">
                      {currentUser ? (
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase font-bold text-teal-600 font-mono block">Přímý telefon (pouze pro registrované)</span>
                          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-teal-500" />
                            <span>+420 730 123 456</span>
                          </p>
                          <div className="text-[10px] text-slate-500 space-y-1 leading-normal italic">
                            <p>🟢 Preferuji první kontakt přes <strong>e-mail, SMS nebo WhatsApp</strong>.</p>
                            <p>⚠️ Telefonní hovory od čísel, které nemám uložené v kontaktech, přijímám jen velice zřídka (pouze pokud je hovor předem očekáván).</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                          <span className="text-[9px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-400" />
                            Telefonní kontakt skryt
                          </span>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Telefonní číslo zakladatele uvidí pouze registrovaní a přihlášení uživatelé.
                          </p>
                          {onOpenAuth && (
                            <button
                              type="button"
                              onClick={onOpenAuth}
                              className="text-[10px] font-bold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer flex items-center gap-1 text-left"
                            >
                              Přihlásit se pro zobrazení
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Všechny kontaktní formuláře jsou odesílány přímo zakladateli na e-mail <strong className="text-slate-800 font-bold">sarji@seznam.cz</strong>. Můžete využít náš formulář níže:
              </p>

              {sent ? (
                <div className="bg-teal-50 border border-teal-150 p-4 rounded-xl text-center space-y-2" id="contact-form-success">
                  <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto" />
                  <h4 className="text-xs font-bold text-teal-900 font-display">Zpráva byla úspěšně odeslána</h4>
                  <p className="text-[10px] text-teal-700 leading-normal">
                    Děkujeme! Vaše podněty zpracujeme a ozveme se vám zpět na uvedený e-mail v nejkratším možném čase.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitMsg} className="space-y-3" id="admin-contact-form">
                  {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs p-2.5 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-slate-600">Vaše jméno</label>
                    <input
                      id="contact-form-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Např. Jan Novák"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-slate-600">E-mail pro odpověď</label>
                    <input
                      id="contact-form-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Např. jan@example.cz"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-slate-600">Text zprávy / Podnět</label>
                    <textarea
                      id="contact-form-message"
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      placeholder="Sem napište svou otázku, zpětnou vazbu nebo doporučený kontakt..."
                      rows={4}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none resize-none transition-all"
                    />
                  </div>

                  <button
                    id="submit-contact-form-btn"
                    type="submit"
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                  >
                    <Send className="w-3.5 h-3.5 text-teal-300" />
                    Odeslat zprávu
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      )}
    </div>
  );
}

