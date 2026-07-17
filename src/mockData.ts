/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Article, 
  DocumentTemplate, 
  AdviceItem, 
  ForumCategory, 
  ForumPost, 
  SupportContact, 
  ExperienceStory,
  Comment,
  Donation
} from './types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Velká novela občanského zákoníku 2026: Co se mění v péči o děti?',
    summary: 'Přehled klíčových změn v rodinném právu, upřednostňování smírného řešení a posílení participativních práv dítěte.',
    content: `Česká legislativa v oblasti rodinného práva prochází významnou modernizací. Novela občanského zákoníku klade zásadní důraz na mimosoudní dohody a nejlepší zájem dítěte.

### Hlavní změny:
1. **Přednost dohodě**: Soudy budou mít povinnost aktivně vést rodiče k mediaci a smírnému vyřešení ještě před samotným zahájením dokazování.
2. **Názor dítěte**: Posiluje se role opatrovníka a povinnost zohlednit názor dítěte s ohledem na jeho věk a rozumovou vyspělost (obvykle od 12 let, ale nově i dříve prostřednictvím specializovaných psychologů).
3. **Zjednodušení střídavé péče**: Pokud jsou oba rodiče způsobilí, střídavá péče je brána jako primární varianta, pokud to odpovídá možnostem a přáním dítěte.

Cílem je minimalizovat traumata dětí ze zdlouhavých soudních sporů a motivovat rodiče k férovému partnerství i po rozchodu.`,
    category: 'Zákony',
    date: '2026-06-15',
    author: 'Mgr. Kateřina Veselá (Rodinná advokátka)',
    likes: 42,
    commentsCount: 3,
    readTime: '5 min',
    tags: ['Zákony', 'Střídavá péče', 'Novela 2026']
  },
  {
    id: 'art-2',
    title: 'Rozhodnutí Ústavního soudu k právu dítěte na oba rodiče',
    summary: 'Ústavní soud potvrdil, že pokud jsou oba rodiče stejně způsobilí, nelze střídavou péči zamítnout jen kvůli špatné komunikaci rodičů.',
    content: `Ústavní soud ve svém nejnovějším nálezu judikoval zásadní princip pro opatrovnická řízení. Špatná komunikace mezi rodiči nemůže být automatickým důvodem pro vyloučení střídavé péče.

Soud konstatoval, že pokud by na to soudy přistoupily, dávaly by jednomu z rodičů moc "zablokovat" střídavou péči tím, že bude záměrně odmítat komunikovat. Naopak, povinností soudů je zkoumat příčinu této nekomunikace a motivovat oba rodiče k nápravě, například nařízením rodinné terapie nebo mediace.

Tento nález významně posiluje právo dětí na vyváženou výchovu oběma rodiči a apeluje na odpovědnost dospělých překonat osobní spory v zájmu svých dětí.`,
    category: 'Soudy',
    date: '2026-07-01',
    author: 'JUDr. Martin Dvořák',
    likes: 56,
    commentsCount: 5,
    readTime: '4 min',
    tags: ['Judikatura', 'Ústavní soud', 'Komunikace']
  },
  {
    id: 'art-3',
    title: 'Jak zvládnout rozvod a opatrovnické řízení z pohledu dětské psychologie',
    summary: 'Rady dětského psychologa, jak s dětmi o rozchodu mluvit, čeho se vyvarovat a jak pro ně zachovat pocit bezpečí.',
    content: `Rozchod rodičů je pro dítě jednou z nejnáročnějších životních situací. Způsob, jakým rodiče proces zvládnou, přímo ovlivňuje budoucí psychický vývoj dítěte.

### Základní pravidla:
* **Nikdy neočerňujte druhého rodiče**: Dítě miluje oba rodiče. Pokud na jednoho z nich útočíte, útočíte na polovinu identity samotného dítěte.
* **Ujistěte dítě, že za nic nemůže**: Děti mají tendenci vinit se z rozchodu rodičů. Opakujte jim, že je to rozhodnutí dospělých a že je oba stále milujete.
* **Udržujte rituály**: Stabilní prostředí, stejná škola, kroužky a předvídatelný režim dávají dítěti pocit jistoty v turbulentní době.

Pamatujte, že nejlepší zájem dítěte není výhra u soudu, ale klidní a spolupracující rodiče.`,
    category: 'Psychologie',
    date: '2026-06-28',
    author: 'PhDr. Alena Novotná (Dětská psycholožka)',
    likes: 38,
    commentsCount: 2,
    readTime: '6 min',
    tags: ['Psychologie', 'Prevence', 'Zájem dítěte']
  }
];

export const INITIAL_DOCUMENTS: DocumentTemplate[] = [
  {
    id: 'doc-1',
    title: 'Dohoda rodičů o úpravě poměrů k nezletilému dítěti',
    description: 'Vzor komplexní dohody rodičů o svěření dítěte do péče (střídavé, společné či výhradní) a stanovení výživného. Nejsnazší a nejšetrnější cesta pro schválení soudem.',
    category: 'Návrhy k soudu',
    downloadCount: 145,
    fileContent: `OKRESNÍMU SOUDU V [Město soudu]

K sp. zn.: [Spisová značka, pokud existuje]

Matka: [Jméno a příjmení matky], nar. [Datum narození matky], bytem [Adresa matky]
Otec: [Jméno a příjmení otce], nar. [Datum narození otce], bytem [Adresa otce]

Nezletilý/á: [Jméno a příjmení dítěte], nar. [Datum narození dítěte], bytem [Adresa dítěte]

NÁVRH NA SCHVÁLENÍ DOHODY RODIČŮ O ÚPRAVĚ POMĚRŮ K NEZLETILÉMU DÍTĚTI PRO DOBU PO ROZVODU / PRO DOBU PO ROZCHODU

I.
Rodiče nezletilého [Jméno dítěte] uzavřeli dne [Datum dohody] dohodu o úpravě poměrů pro dobu po rozvodu manželství (popř. po rozpadu společné domácnosti) s následujícím obsahem:
1. Nezletilý [Jméno dítěte] se svěřuje do [Typ péče - např. střídavé péče obou rodičů].
2. Interval střídání se stanovuje tak, že dítě bude v péči matky každý [Lichý / sudý] týden od pondělí 8:00 do následujícího pondělí 8:00, kdy bude předáno otci, v jehož péči bude následující týden.
3. Otec se zavazuje přispívat na výživu nezletilého částkou [Výživné otec] Kč měsíčně k rukám matky. Matka se zavazuje přispívat částkou [Výživné matka] Kč měsíčně k rukám otce.

II.
Tato dohoda plně odpovídá zájmům a potřebám našeho dítěte. Oba rodiče jsou plně způsobilí zajistit stabilní výchovné prostředí.

S ohledem na výše uvedené navrhujeme, aby soud vydal tento

R O Z S U D E K:

Schvaluje se dohoda rodičů tohoto znění:
Nezletilý/á [Jméno dítěte] se svěřuje do [Typ péče] rodičů.
Výživné se stanovuje dohodou rodičů tak, jak je uvedeno v článku I. této dohody.

V [Město], dne [Dnešní datum]

______________________                    ______________________
[Jméno matky] (podpis)                    [Jméno otce] (podpis)`,
    formFields: [
      { name: 'sud', label: 'Okresní soud', type: 'text', placeholder: 'Okresní soud v Liberci' },
      { name: 'matka_jmeno', label: 'Jméno matky', type: 'text', placeholder: 'Jana Nováková' },
      { name: 'matka_narozeni', label: 'Datum narození matky', type: 'text', placeholder: '12. 5. 1990' },
      { name: 'matka_adresa', label: 'Adresa matky', type: 'text', placeholder: 'Dlouhá 123, Liberec' },
      { name: 'otec_jmeno', label: 'Jméno otce', type: 'text', placeholder: 'Petr Novák' },
      { name: 'otec_narozeni', label: 'Datum narození otce', type: 'text', placeholder: '24. 8. 1988' },
      { name: 'otec_adresa', label: 'Adresa otce', type: 'text', placeholder: 'Krátká 456, Liberec' },
      { name: 'dite_jmeno', label: 'Jméno a příjmení dítěte', type: 'text', placeholder: 'Lukáš Novák' },
      { name: 'dite_narozeni', label: 'Datum narození dítěte', type: 'text', placeholder: '3. 11. 2018' },
      { name: 'typ_pece', label: 'Typ péče', type: 'text', placeholder: 'střídavé péče v týdenním cyklu' },
      { name: 'vyzivne_otec', label: 'Výživné otce (Kč)', type: 'text', placeholder: '4000' },
      { name: 'vyzivne_matka', label: 'Výživné matky (Kč)', type: 'text', placeholder: '3000' }
    ]
  },
  {
    id: 'doc-2',
    title: 'Návrh na zahájení řízení o úpravu poměrů k nezletilému',
    description: 'Jednostranný návrh na svěření dítěte do péče a určení výživného, pokud se rodiče nedokázali dohodnout. Obsahuje zdůvodnění a doporučenou strukturu důkazů.',
    category: 'Návrhy k soudu',
    downloadCount: 98,
    fileContent: `OKRESNÍMU SOUDU V [Město soudu]

Navrhovatel/ka: [Jméno navrhovatele], nar. [Datum narození navrhovatele], bytem [Adresa navrhovatele]
Druhý rodič: [Jméno druhého rodiče], nar. [Datum narození druhého rodiče], bytem [Adresa druhého rodiče]

Nezletilý/á: [Jméno dítěte], nar. [Datum narození dítěte], bytem jako [Matka / Otec / Jiná adresa]

NÁVRH NA ÚPravu POMĚRŮ K NEZLETILÉMU DÍTĚTI PRO DOBU PŘED A PO ROZVODU

I.
Z manželství (či vztahu) rodičů pochází nezletilý/á [Jméno dítěte]. Rodiče spolu již delší dobu nežijí a nesdílejí společnou domácnost. Nezletilý je v současné době fakticky v péči [Kdo má dítě nyní].
Důkaz:
- Rodný list nezletilého
- Výslech obou rodičů

II.
Navrhovatel má eminentní zájem na podílení se na výchově dítěte formou [Navrhovaný typ péče]. Navrhovatel má pro péči o dítě plné zázemí, stabilní zaměstnání a časové možnosti přizpůsobené potřebám dítěte. Druhý rodič naopak brání vyváženému kontaktu (nebo: má odlišný názor na výchovu).
Důkaz:
- Zprávy z komunikace mezi rodiči
- Vyjádření školy/školky

III.
S ohledem na výše uvedené navrhuji, aby soud po provedeném dokazování vydal tento

R O Z S U D E K:

1. Nezletilý/á [Jméno dítěte] se svěřuje do [Typ péče] obou rodičů.
2. [Jméno otce] je povinen přispívat na výživu částkou [Výživné otec] Kč měsíčně. [Jméno matky] je povinna přispívat částkou [Výživné matka] Kč měsíčně.

V [Město], dne [Dnešní datum]

______________________
[Podpis navrhovatele]`,
    formFields: [
      { name: 'sud', label: 'Okresní soud', type: 'text', placeholder: 'Okresní soud v Brně' },
      { name: 'navrhovatel_jmeno', label: 'Vaše jméno', type: 'text', placeholder: 'Martin Dvořák' },
      { name: 'navrhovatel_narozeni', label: 'Vaše datum narození', type: 'text', placeholder: '5. 6. 1985' },
      { name: 'navrhovatel_adresa', label: 'Vaše adresa', type: 'text', placeholder: 'Náměstí Svobody 10, Brno' },
      { name: 'odpovedny_jmeno', label: 'Jméno druhého rodiče', type: 'text', placeholder: 'Kateřina Dvořáková' },
      { name: 'odpovedny_narozeni', label: 'Datum nar. druhého rodiče', type: 'text', placeholder: '18. 9. 1987' },
      { name: 'odpovedny_adresa', label: 'Adresa druhého rodiče', type: 'text', placeholder: 'Zahradní 14, Brno' },
      { name: 'dite_jmeno', label: 'Jméno dítěte', type: 'text', placeholder: 'Eliška Dvořáková' },
      { name: 'dite_narozeni', label: 'Datum narození dítěte', type: 'text', placeholder: '22. 2. 2021' },
      { name: 'navrhovana_pece', label: 'Navrhovaná péče', type: 'text', placeholder: 'střídavé péče' }
    ]
  }
];

export const INITIAL_ADVICE: AdviceItem[] = [
  {
    id: 'adv-1',
    title: 'Jednání s OSPOD: Jak se chovat a čeho se vyvarovat',
    content: `OSPOD (Orgán sociálně-právní ochrany dětí) vystupuje v soudním řízení jako opatrovník dítěte. Jeho úkolem je hájit zájmy dítěte, nikoliv zájmy matky nebo otce. Sociální pracovník vypracovává pro soud zprávu a dává doporučení.

### Klíčové zásady:
1. **Buďte konstruktivní a klidní**: Nikdy na OSPODu nekřičte, nebuďte agresivní a neútočte emotivně na druhého rodiče. Působilo by to dojmem, že nejste schopni spolupráce.
2. **Prezentujte zájem dítěte**: Nemluvte o tom, co je "vaše právo", ale o tom, co potřebuje vaše dítě (např. stabilní režim, kontakt s oběma rodinami, klidné prostředí).
3. **Připravte se na šetření v domácnosti**: Sociální pracovník navštíví vaše bydlení. Nemusíte mít sterilně čisto, ale prostředí musí být bezpečné, čisté a dítě musí mít svůj kout na hraní/učení a vlastní postel.
4. **Spolupracujte**: Pokud vám OSPOD doporučí mediaci nebo poradnu, neodmítejte to. Odmítnutí soudy vnímají jako neochotu řešit situaci ve prospěch dítěte.`,
    category: 'OSPOD',
    checklist: [
      'Domluvit si schůzku předem a přijít včas',
      'Připravit si stručné body své představy o péči',
      'Zajistit čisté a bezpečné zázemí pro dítě doma',
      'Nekritizovat druhého rodiče bez objektivních důkazů',
      'Souhlasit s doporučeným odborným poradenstvím'
    ]
  },
  {
    id: 'adv-2',
    title: 'Příprava na soudní opatrovnické řízení',
    content: `Soudní jednání v opatrovnických věcech bývá emočně vypjaté. Dobrá příprava vám pomůže udržet chladnou hlavu a prezentovat fakta jasně a přesvědčivě.

### Tipy pro přípravu:
* **Ujasněte si své cíle**: Mějte jasný a reálný návrh (např. přesný harmonogram střídavé péče včetně prázdnin a svátků).
* **Mluvte stručně a k věci**: Soudce řeší desítky případů týdně. Ocení, když budete odpovídat přímo na otázky a nebudete zabíhat do historických křivd, které s péčí nesouvisí.
* **Respektujte autoritu**: Oblečte se formálně a slušně. Oslovujte soudce "Vážený soude" nebo "Pane předsedo". Do řeči druhých vstupujte pouze tehdy, když vám soudce udělí slovo.`,
    category: 'Příprava na soud',
    checklist: [
      'Zvolit vhodné formální oblečení',
      'Připravit si kopie všech klíčových důkazů v trojím vyhotovení',
      'Sepsat si podrobný návrh péče o svátcích a prázdninách',
      'Nacvičit si klidné reakce na případné nepravdivé výroky protistrany'
    ]
  }
];

export const INITIAL_FORUM_CATEGORIES: ForumCategory[] = [
  { id: 'cat-1', name: 'Střídavá péče', description: 'Praktické zkušenosti, harmonogramy střídání, logistika a psychologie dětí.', iconName: 'Scale', postCount: 0 },
  { id: 'cat-2', name: 'Soudní řízení', description: 'Jak probíhá soud, délka řízení, znalecké posudky a odvolání.', iconName: 'FileText', postCount: 0 },
  { id: 'cat-3', name: 'Komunikace a OSPOD', description: 'Jak mluvit se sociálními pracovníky, jak komunikovat s expartnerem bez konfliktů.', iconName: 'MessageSquare', postCount: 0 },
  { id: 'cat-4', name: 'Výživné (Alimony)', description: 'Výpočet výživného, tabulky ministerstva spravedlnosti, vymáhání dlužného výživného.', iconName: 'Coins', postCount: 0 }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [];

export const INITIAL_STORIES: ExperienceStory[] = [];

export const INITIAL_CONTACTS: SupportContact[] = [
  {
    id: 'con-1',
    name: 'Mgr. Jan Procházka - Rodinné právo',
    type: 'právník',
    region: 'Praha',
    city: 'Praha 2',
    address: 'Vinohradská 45, 120 00 Praha 2',
    phone: '+420 777 123 456',
    email: 'prochazka@advokat-rodina.cz',
    website: 'www.advokat-rodina.cz',
    description: 'Advokát specializující se výhradně na rodinné právo, rozvody a opatrovnická řízení. Důraz na smírná řešení a zájem dítěte.',
    rating: 4.9
  },
  {
    id: 'con-2',
    name: 'Centrum pro rodinu a mediaci "SOUZNĚNÍ"',
    type: 'mediátor',
    region: 'Jihomoravský kraj',
    city: 'Brno',
    address: 'Údolní 18, 602 00 Brno',
    phone: '+420 608 987 654',
    email: 'info@souzneni-mediace.cz',
    website: 'www.souzneni-mediace.cz',
    description: 'Akreditovaní rodinní mediátoři pomáhající rodičům najít společnou řeč a sestavit stabilní dohodu o péči bez soudních bojů.',
    rating: 4.8
  },
  {
    id: 'con-3',
    name: 'PhDr. Kamil Soukup - Dětská psychoterapie',
    type: 'psycholog',
    region: 'Moravskoslezský kraj',
    city: 'Ostrava',
    address: 'Nádražní 102, 702 00 Ostrava',
    phone: '+420 596 111 222',
    email: 'soukup@detska-duse.cz',
    website: 'www.detska-duse.cz',
    description: 'Psychologická pomoc pro děti procházející rozchodem rodičů. Poradenství pro rodiče, jak komunikovat s traumatizovaným dítětem.',
    rating: 5.0
  },
  {
    id: 'con-4',
    name: 'Aperio - Společnost pro zdravé rodičovství',
    type: 'organizace',
    region: 'Celá ČR',
    city: 'Praha / Online',
    address: 'Plzeňská 4, 150 00 Praha 5',
    phone: '+420 774 411 411',
    email: 'poradna@aperio.cz',
    website: 'www.aperio.cz',
    description: 'Nezisková organizace poskytující bezplatnou právní a psychologickou poradnu pro rodiče v nouzi a samoživitele.',
    rating: 4.7
  }
];

export const INITIAL_COMMENTS: Comment[] = [];

export const INITIAL_DONATIONS: Donation[] = [];

// Helper to initialize and manage localStorage state safely
export function getStoredState<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`synthesis_hub_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setStoredState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`synthesis_hub_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
  }
}
