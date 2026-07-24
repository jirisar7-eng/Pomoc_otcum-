/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from './translations';

export interface TranslationItem {
  cs: string;
  sk: string;
  en: string;
}

export const DYNAMIC_TRANSLATIONS: Record<string, Record<string, TranslationItem>> = {
  // Articles
  'art-1': {
    title: {
      cs: "Střídavá péče u dětí do tří let",
      sk: "Striedavá starostlivosť u detí do troch rokov",
      en: "Joint Physical Custody for Children Under Three"
    },
    excerpt: {
      cs: "Praktický průvodce s vědeckými argumenty a judikaturou vyvracející mýty o nemožnosti střídavé péče u malých dětí (kojenců a batolat).",
      sk: "Praktický sprievodca s vedeckými argumentmi a judikatúrou vyvracajúcou mýty o nemožnosti striedavej starostlivosti u malých detí (dojčiat a batoliat).",
      en: "A practical guide with scientific arguments and case law debunking myths about the impossibility of joint physical custody for toddlers and infants."
    },
    content: {
      cs: `Častým argumentem opatrovnických soudů i pracovníků OSPOD bývá tvrzení, že dítě do tří let věku je biologicky fixováno výhradně na matku a střídavá péče nebo přespávání u otce by mohlo vážně narušit jeho zdravý psychický vývoj. Moderní věda a judikatura Ústavního soudu však hovoří zcela jinak.

Základní psychologický koncept "attachmentu" (citové vazby) definuje, že dítě si vytváří bezpečnou vazbu k osobám, které o něj dlouhodobě pečují a citlivě reagují na jeho potřeby. Otec je schopen vybudovat si stejně kvalitní a bezpečnou vazbu jako matka.

Vědecká konsensuální zpráva Dr. Richarda Warshaka (2014) podpořená 110 mezinárodními experty jasně doporučuje přespávání dětí u otců od útlého věku. Omezení kontaktu s otcem na pár hodin týdně naopak vede k odcizení a zhoršení budoucího vývoje dítěte.

Soudy jsou povinny zkoumat individuální situaci, nikoliv uplatňovat obecné předsudky o věku dítěte.`,
      sk: `Častým argumentom opatrovníckych súdov aj pracovníkov OSPOD býva tvrdenie, že dieťa do troch rokov veku je biologicky fixované výhradne na matku a striedavá starostlivosť alebo prespávanie u otca by mohlo vážne narušiť jeho zdravý psychický vývoj. Moderná veda a judikatúra Ústavného súdu však hovoria úplne inak.

Základný psychologický koncept "attachmentu" (citovej väzby) definuje, že dieťa si vytvára bezpečnú väzbu k osobám, ktoré sa oň dlhodobo starajú a citlivo reagujú na jeho potreby. Otec je schopný vybudovať si rovnako kvalitnú a bezpečnú väzbu ako matka.

Vedecká konsenzuálna správa Dr. Richarda Warshaka (2014) podporená 110 medzinárodnými expertmi jasne odporúča prespávanie detí u otcov od útleho veku. Obmedzenie kontaktu s otcom na pár hodín týždenne naopak vedie k odcudzeniu a zhoršeniu budúceho vývoja dieťaťa.

Súdy sú povinné skúmať individuálnu situáciu, nie uplatňovať všeobecné predsudky o veku dieťaťa.`,
      en: `A frequent argument made by custody courts and social workers (OSPOD) is the claim that a child under three is biologically attached exclusively to the mother, and that joint custody or overnight stays with the father would severely disrupt healthy psychological development. Modern science and the case law of the Constitutional Court, however, state otherwise.

The core psychological concept of "attachment" defines that a child forms a secure bond with individuals who provide long-term care and respond sensitively to their needs. A father is fully capable of building an equally secure and high-quality bond as the mother.

The scientific consensus report by Dr. Richard Warshak (2014), supported by 110 international experts, clearly recommends overnight stays with fathers from infancy. Restricting contact to a few hours a week instead leads to alienation and compromises the child's future development.

Courts are required to examine individual circumstances rather than apply general prejudices based solely on the child's age.`
    }
  },
  'art-2': {
    title: {
      cs: "Jak čelit manipulativním technikám u soudu",
      sk: "Ako čeliť manipulatívnym technikám na súde",
      en: "How to Counter Manipulative Tactics in Court"
    },
    excerpt: {
      cs: "Průvodce pro otce, jak reagovat na falešná obvinění ze syndromu odcizení, násilí nebo zanedbávání péče s chladnou hlavou a věcnými důkazy.",
      sk: "Sprievodca pre otcov, ako reagovať na falošné obvinenia zo syndrómu odcudzenia, násilia alebo zanedbávania starostlivosti s chladnou hlavou a vecnými dôkazmi.",
      en: "A guide for fathers on how to respond to false accusations of alienation, violence, or neglect with a calm head and objective evidence."
    },
    content: {
      cs: `Opatrovnické spory jsou bohužel často plné emocí a neférových taktik. Jednou z nejčastějších strategií je snaha vykreslit otce jako tyrana, alkoholika nebo emočně nestabilního člověka.

Jak reagovat?
1. Zachovejte absolutní klid a emočně nereagujte. Jakýkoliv výbuch hněvu u soudu bude použít proti vám jako důkaz vaší "agresivity".
2. Předkládejte věcné důkazy. Komunikujte s matkou výhradně písemně (SMS, e-mail) a veškerou komunikaci si archivujte.
3. Používejte moderní monitorovací nástroje (sdílený Google Kalendář, aplikace pro spolurodičovství) k dokládání vašich snah o dohodu.

Pamatujte, že soudce hodnotí vaši schopnost povznést se nad konflikt a jednat výhradně v zájmu dětí.`,
      sk: `Opatrovnícke spory sú, žiaľ, často plné emócií a neférových taktík. Jednou z najčastejších stratégií je snaha vykresliť otca ako tyrana, alkoholika alebo emočne nestabilného človeka.

Ako reagovať?
1. Zachovajte absolútny pokoj a emočne nereagujte. Akýkoľvek výbuch hnevu na súde bude použitý proti vám ako dôkaz vašej "agresivity".
2. Predkladajte vecné dôkazy. Komunikujte s matkou výhradne písomne (SMS, e-mail) a všetku komunikáciu si archivujte.
3. Používajte moderné monitorovacie nástroje (zdieľaný Google Kalendár, aplikácie pre spolurodičovstvo) na dokladanie vašich snáh o dohodu.

Pamätajte, že sudca hodnotí vašu schopnosť povzniesť sa nad konflikt a konať výhradne v záujme detí.`,
      en: `Custody disputes are, unfortunately, often filled with intense emotions and unfair tactics. One of the most common strategies is attempting to paint the father as abusive, alcoholic, or emotionally unstable.

How to respond?
1. Maintain absolute calm and do not react emotionally. Any outburst of anger in court will be weaponized against you as proof of "aggressiveness".
2. Present objective evidence. Communicate with the mother strictly in writing (SMS, email) and archive all communications.
3. Use modern monitoring tools (shared Google Calendars, co-parenting apps) to document your constant efforts to reach an agreement.

Remember, the judge evaluates your capacity to rise above the conflict and act solely in the best interest of the children.`
    }
  },
  'art-3': {
    title: {
      cs: "Práva otce při šetření OSPOD v domácnosti",
      sk: "Práva otca pri šetrení OSPOD v domácnosti",
      en: "Father's Rights During OSPOD Home Investigations"
    },
    excerpt: {
      cs: "Co může a nemůže sociální pracovnice při kontrole vašeho obydlí, jak se na návštěvu připravit a co zapsat do protokolu.",
      sk: "Čo môže a nemôže sociálna pracovníčka pri kontrole vášho obydlia, ako sa na návštevu pripraviť a čo zapísať do protokolu.",
      en: "What a social worker can and cannot do during a home check, how to prepare for the visit, and what to record in the official report."
    },
    content: {
      cs: `Návštěva kolizního opatrovníka (OSPOD) u vás doma je jedním z nejdůležitějších momentů celého řízení. Pracovnice hodnotí nejen materiální zázemí, ale zejména váš vztah s dětmi a úroveň hygieny.

Důležitá pravidla:
- Na návštěvu se předem domluvte. OSPOD může přijít i neohlášeně, ale jde o výjimečné případy.
- Zajistěte pro dítě vlastní zařízený kout nebo pokoj (postel, hračky, studijní stůl).
- Buďte k pracovnici slušní, ale asertivní. Máte právo na pořízení kopie zápisu z domácího šetření a vyjádření se k němu.
- Pokud máte podezření na podjatost, podejte písemnou stížnost vedoucímu odboru.`,
      sk: `Návšteva kolízneho opatrovníka (OSPOD) u vás doma je jedným z najdôležitejších momentov celého konania. Pracovníčka hodnotí nielen materiálne zázemie, ale najmä váš vzťah s deťmi a úroveň hygieny.

Dôležité pravidlá:
- Na návšteve sa vopred dohodnite. OSPOD môže prísť aj neohlásene, ale ide o výnimočné prípady.
- Zaistite pre dieťa vlastný zariadený kútik alebo izbu (posteľ, hračky, písací stôl).
- Buďte k pracovníčke slušní, ale asertívni. Máte právo na obstaranie kópie zápisu z domáceho šetrenia a vyjadrenie sa k nemu.
- Ak máte podozrenie na podjatosť, podajte písomnú sťažnosť vedúcemu odboru.`,
      en: `A home visit from the guardian (OSPOD) is one of the most critical junctures of the entire proceedings. The social worker evaluates not only the material conditions, but particularly your emotional relationship with the children and household hygiene.

Crucial rules:
- Schedule the visit in advance. OSPOD can show up unannounced, but this is reserved for exceptional emergencies.
- Secure a dedicated, furnished space or room for the child (bed, toys, study desk).
- Be polite but assertive with the worker. You have a legal right to obtain a copy of the official home visit report and submit formal comments on it.
- If you suspect bias, file a written complaint to the head of the social services department.`
    }
  },

  // Courses
  'course-1': {
    title: {
      cs: "Komunikační detox: Jak komunikovat s ex-partnerem bez konfliktů",
      sk: "Komunikačný detox: Ako komunikovať s ex-partnerom bez konfliktov",
      en: "Communication Detox: How to Talk with an Ex-Partner Without Conflict"
    },
    description: {
      cs: "Praktický průvodce komunikací v krizových situacích. Naučíte se metodu B.I.F.F. (Brief, Informative, Friendly, Firm), jak odpovídat na útočné SMS a jak izolovat dítě od rodičovských sporů.",
      sk: "Praktický sprievodca komunikáciou v krízových situáciách. Naučíte sa metódu B.I.F.F. (Brief, Informative, Friendly, Firm), ako odpovedať na útočné SMS a ako izolovať dieťa od rodičovských sporov.",
      en: "A practical guide to communication in crisis situations. Learn the B.I.F.F. method (Brief, Informative, Friendly, Firm), how to respond to hostile text messages, and how to insulate your child from parental disputes."
    }
  },
  'course-2': {
    title: {
      cs: "Soudní síň: Jak vystupovat před soudcem a opatrovníkem",
      sk: "Súdna sieň: Ako vystupovať pred sudcom a opatrovníkom",
      en: "The Courtroom: How to Present Before a Judge and Guardian"
    },
    description: {
      cs: "Detailní příprava na soudní jednání. Co si obléknout, jak správně oslovovat soudce, jak věcně odpovídat bez emocí a jak reagovat na provokační otázky protistrany.",
      sk: "Detailná príprava na súdne pojednávanie. Čo si obliecť, ako správne oslovovať sudcu, ako vecne odpovedať bez emócií a ako reagovať na provokačné otázky protistrany.",
      en: "In-depth preparation for court hearings. What to wear, how to correctly address the judge, how to answer objectively without emotion, and how to react to baiting questions from the opposing side."
    }
  },
  'course-3': {
    title: {
      cs: "OSPOD šetření v domácnosti: Práva, povinnosti a strategie",
      sk: "OSPOD šetrenie v domácnosti: Práva, povinnosti a stratégie",
      en: "OSPOD Home Investigation: Rights, Duties, and Strategies"
    },
    description: {
      cs: "Kompletní taktická příprava na domácí návštěvu sociální pracovnice. Co kontrolovat v bytě, jak mluvit s dítětem před návštěvou a jaká jsou vaše nezadatelná ústavní práva.",
      sk: "Kompletná taktická príprava na domácu návštevu sociálnej pracovníčky. Čo kontrolovať v byte, ako hovoriť s dieťaťom pred návštevou a aké sú vaše nezadatateľné ústavné práva.",
      en: "A comprehensive tactical preparation for a social worker's home visit. What to audit in the apartment, how to prepare the child beforehand, and what your inalienable constitutional rights are."
    }
  },

  // Judgments
  'jud-1': {
    title: {
      cs: "Priorita střídavé péče při splnění zákonných kritérií",
      sk: "Priorita striedavej starostlivosti pri splnení zákonných kritérií",
      en: "Priority of Joint Custody Upon Meeting Legal Criteria"
    },
    excerpt: {
      cs: "Svěření dítěte do střídavé péče musí být prioritním řešením, pokud jsou oba rodiče způsobilí o dítě pečovat a mají o péči zájem.",
      sk: "Zverenie dieťaťa do striedavej starostlivosti musí byť prioritným riešením, ak sú obaja rodičia spôsobilí o dieťa sa starať a majú o starostlivosť záujem.",
      en: "Awarding joint physical custody must be the priority resolution if both parents are fit and willing to care for the child."
    },
    fullAnalysis: {
      cs: "Tento klíčový nález Ústavního soudu definuje, že střídavá péče je základním východiskem po rozpadu rodiny. Pokud oba rodiče vyjadřují upřímný zájem o péči, mají k ní odpovídající podmínky a jsou výchovně způsobilí, je soud povinen střídavou péči nařídit. Výjimku tvoří pouze závažné důvody ohrožující nejlepší zájem dítěte, které musí být soudem řádně a individuálně prokázány, nikoliv pouze předjímány.",
      sk: "Tento kľúčový nález Ústavného súdu definuje, že striedavá starostlivosť je základným východiskom po rozpadu rodiny. Ak obaja rodičia vyjadrujú úprimný záujem o starostlivosť, majú na ňu zodpovedajúce podmienky a sú výchovne spôsobilí, je súd povinný striedavú starostlivosť nariadiť. Výnimku tvoria iba závažné dôvody ohrozujúce najlepší záujem dieťaťa, ktoré musia byť súdom riadne a individuálne preukázané, nie iba predpokladané.",
      en: "This landmark ruling of the Constitutional Court establishes that joint physical custody is the baseline resolution following family breakdown. If both parents express genuine interest in caring, have adequate facilities, and are educationally capable, the court is obligated to order joint custody. Exceptions are reserved only for severe grounds threatening the child's best interests, which must be properly and individually proven by the court."
    }
  },
  'jud-2': {
    title: {
      cs: "Střídavá péče u dětí útlého věku (kojenec/batole)",
      sk: "Striedavá starostlivosť u detí útleho veku (dojča/batoľa)",
      en: "Joint Physical Custody for Tender-Age Children (Infants/Toddlers)"
    },
    excerpt: {
      cs: "Nízký věk dítěte (v tomto případě 2 roky) sám o sobě nemůže být překážkou pro nařízení střídavé péče, pokud jsou oba rodiče dostatečně citově navázáni.",
      sk: "Nízky vek dieťaťa (v tomto prípade 2 roky) sám o sebe nemôže byť prekážkou pre nariadenie striedavej starostlivosti, ak sú obaja rodičia dostatočne citovo naviazaní.",
      en: "The tender age of a child (in this case 2 years old) cannot, on its own, constitute an obstacle to joint physical custody, provided both parents have a secure emotional attachment."
    },
    fullAnalysis: {
      cs: "Soud vyvrátil dřívější dogma, že malé děti patří výhradně matce. Rozhodující je kvalita citové vazby k oběma rodičům a jejich schopnost citlivě reagovat na potřeby dítěte. Ústavní soud zdůraznil, že budování bezpečné vazby (attachment) k otci v útlém věku je klíčové pro budoucí psychický vývoj dítěte, a proto je střídavá nebo velmi široká péče u batolat žádoucí.",
      sk: "Súd vyvrátil skoršie dogma, že malé deti patria výhradne matke. Rozhodujúca je kvalita citovej väzby k obom rodičom a ich schopnosť citlivo reagovať na potreby dieťaťa. Ústavný súd zdôraznil, že budovanie bezpečnej väzby (attachmentu) k otcovi v útlom veku je kľúčové pre budúci psychický vývoj dieťaťa, a preto je striedavá alebo veľmi široká starostlivosť u batoliat žiaduca.",
      en: "The court dismantled the previous dogma that young children belong exclusively to their mothers. The deciding factor is the quality of emotional attachment to both parents and their capacity to respond sensitively to the child's needs. The Constitutional Court emphasized that building a secure attachment with the father during early childhood is critical to the child's future psychological development; hence, joint custody is highly desirable."
    }
  },
  'jud-3': {
    title: {
      cs: "Nesouhlas jednoho z rodičů jako překážka střídavé péče",
      sk: "Nesúhlas jedného z rodičov ako prekážka striedavej starostlivosti",
      en: "Disagreement of One Parent as a Barrier to Joint Custody"
    },
    excerpt: {
      cs: "Pouhý iracionální nesouhlas matky nebo otce se střídavou péčí nemůže být důvodem pro její vyloučení. Soudy musí zkoumat motivaci tohoto nesouhlasu.",
      sk: "Pouhý iracionálny nesúhlas matky alebo otca so striedavou starostlivosťou nemôže byť dôvodom na jej vylúčenie. Súdy musia skúmať motiváciu tohto nesúhlasu.",
      en: "The mere irrational opposition of either mother or father to joint physical custody cannot constitute a valid reason for its exclusion. Courts must investigate the motivation behind such opposition."
    },
    fullAnalysis: {
      cs: "Pokud jeden z rodičů blokuje dohodu a odmítá střídavou péči pouze z důvodu osobní animozity, finančních motivů (snaha udržet si vysoké výživné) nebo snahy o exkluzivitu, nesmí soudy tomuto vetu ustupovat. Naopak, takové chování může svědčit o snížené výchovné způsobilosti dotčeného rodiče respektovat roli druhého rodiče v životě dítěte.",
      sk: "Ak jeden z rodičov blokuje dohodu a odmieta striedavú starostlivosť len z dôvodu osobnej animozity, finančných motívov (snaha udržať si vysoké výživné) alebo snahy o exkluzivitu, nesmú súdy tomuto vetu ustupovať. Naopak, takéto správanie môže svedčiť o zníženej výchovnej spôsobilosti dotknutého rodiča rešpektovať rolu druhého rodiča v živote dieťaťa.",
      en: "If one parent blocks an agreement and rejects joint custody solely due to personal animosity, financial motives (attempting to preserve high child support), or a drive for parenting exclusivity, courts must not capitulate to this veto. On the contrary, such behavior may signal diminished parenting capacity to respect the role of the other parent in the child's life."
    }
  },

  // Templates
  'tpl-1': {
    title: {
      cs: "Návrh na svěření nezletilého do střídavé péče rodičů",
      sk: "Návrh na zverenie maloletého do striedavej starostlivosti rodičov",
      en: "Motion to Award Joint Physical Custody of a Minor"
    },
    desc: {
      cs: "Základní vzor žaloby k opatrovnickému soudu o úpravu poměrů pro střídavou péči. Obsahuje doporučenou právní argumentaci a odkaz na nález Ústavního soudu.",
      sk: "Základný vzor žaloby k opatrovníckemu súdu o úpravu pomerov pre striedavú starostlivosť. Obsahuje odporúčanú právnu argumentáciu a odkaz na nález Ústavného súdu.",
      en: "Standard courtroom motion template for adjusting minor custody arrangements to joint physical custody. Includes recommended legal reasoning and references to Constitutional Court landmark decisions."
    }
  },
  'tpl-2': {
    title: {
      cs: "Vyjádření otce k návrhu matky na výhradní péči",
      sk: "Vyjadrenie otca k návrhu matky na výhradnú starostlivosť",
      en: "Father's Formal Answer to Mother's Motion for Sole Custody"
    },
    desc: {
      cs: "Nesouhlasné stanovisko s výhradní péčí matky. Navrhuje střídavou péči jako jedinou ústavně konformní alternativu chránící zájem dítěte.",
      sk: "Nesúhlasné stanovisko s výhradnou starostlivosťou matky. Navrhuje striedavú starostlivosť ako jedinú ústavne konformnú alternatívu chrániacu záujem dieťaťa.",
      en: "Form expressing strong disagreement with sole custody by the mother. Proposes joint physical custody as the only constitutionally conformant alternative protecting the child's welfare."
    }
  },
  'tpl-3': {
    title: {
      cs: "Stížnost na neprofesionální postup kolizního opatrovníka (OSPOD)",
      sk: "Sťažnosť na neprofesionálny postup kolízneho opatrovníka (OSPOD)",
      en: "Formal Complaint Regarding Unprofessional Social Services (OSPOD) Conduct"
    },
    desc: {
      cs: "Formální stížnost vedoucímu odboru sociálních věcí na podjatost, ignorování důkazů nebo genderově stereotypní přístup sociální pracovnice.",
      sk: "Formálna sťažnosť vedúcemu odboru sociálnych vecí na podjatosť, ignorovanie dôkazov alebo rodovo stereotypný prístup sociálnej pracovníčky.",
      en: "A formal complaint addressed to the head of social services regarding bias, discounting of evidence, or gender-stereotyped approaches by the social worker."
    }
  }
};

/**
 * Universal text translation assistant for dynamic rendering.
 * Provides fallback-free translation lookup for static data blocks, sitemap items,
 * and smart rules for everything else.
 */
export function translateText(text: string, lang: Language): string {
  if (!text) return '';
  if (lang === 'cs') return text;

  // Let's check common structural translations
  const lowerText = text.trim().toLowerCase();

  // Simple key translations
  const commonDict: Record<string, Record<Language, string>> = {
    'celkový stav platformy:': {
      cs: 'Celkový stav platformy:',
      sk: 'Celkový stav platformy:',
      en: 'Overall Platform Status:'
    },
    'systémový audit': {
      cs: 'Systémový audit',
      sk: 'Systémový audit',
      en: 'System Audit'
    },
    'aktuální stav & architektura synthesis os core': {
      cs: 'Aktuální stav & Architektura Synthesis OS Core',
      sk: 'Aktuálny stav & Architektúra Synthesis OS Core',
      en: 'Current Status & Synthesis OS Core Architecture'
    },
    'produkční moduly': {
      cs: 'Produkční Moduly',
      sk: 'Produkčné Moduly',
      en: 'Production Modules'
    },
    'databáze & ledger': {
      cs: 'Databáze & Ledger',
      sk: 'Databáza & Ledger',
      en: 'Database & Ledger'
    },
    'vývoj & beta': {
      cs: 'Vývoj & Beta',
      sk: 'Vývoj & Beta',
      en: 'Development & Beta'
    },
    'ai orchestrátor': {
      cs: 'AI Orchestrátor',
      sk: 'AI Orchestrátor',
      en: 'AI Orchestrator'
    },
    'připraven': {
      cs: 'Připraven',
      sk: 'Pripravený',
      en: 'Ready'
    },
    'aktivní': {
      cs: 'Aktivní',
      sk: 'Aktívny',
      en: 'Active'
    },
    'zde se automaticky vygeneruje stručný popis a klíčové dopady doloženého dokumentu...': {
      cs: 'Zde se automaticky vygeneruje stručný popis a klíčové dopady doloženého dokumentu...',
      sk: 'Tu sa automaticky vygeneruje stručný popis a kľúčové dopady doloženého dokumentu...',
      en: 'A concise description and key impacts of the submitted document will be automatically generated here...'
    },
    'generování automatického popisu a výtahu...': {
      cs: 'Generování automatického popisu a výtahu...',
      sk: 'Generovanie automatického popisu a výťahu...',
      en: 'Generating automatic description and extract...'
    },
    'ai popisuje soubor...': {
      cs: 'AI popisuje soubor...',
      sk: 'AI popisuje súbor...',
      en: 'AI is describing file...'
    },
    'poznámka / shrnutí klíčových informací:': {
      cs: 'Poznámka / shrnutí klíčových informací:',
      sk: 'Poznámka / zhrnutie kľúčových informácií:',
      en: 'Notes / key information summary:'
    },
    'typ záznamu:': {
      cs: 'Typ záznamu:',
      sk: 'Typ záznamu:',
      en: 'Record type:'
    },
    'otevřít modul': {
      cs: 'Otevřít modul',
      sk: 'Otvoriť modul',
      en: 'Open module'
    },
    'rychlá konzultace': {
      cs: 'Rychlá konzultace',
      sk: 'Rýchla konzultácia',
      en: 'Quick consultation'
    },
    'ke stažení': {
      cs: 'Ke stažení',
      sk: 'Na stiahnutie',
      en: 'Download'
    },
    'měsíční rozpočet': {
      cs: 'Měsíční rozpočet',
      sk: 'Mesačný rozpočet',
      en: 'Monthly budget'
    },
    'otevřít kapitolu': {
      cs: 'Otevřít kapitolu',
      sk: 'Otvoriť kapitolu',
      en: 'Open chapter'
    },
    'detail okruhu': {
      cs: 'Detail okruhu',
      sk: 'Detail okruhu',
      en: 'Topic detail'
    },
    'inteligentní ai': {
      cs: 'Inteligentní AI',
      sk: 'Inteligentná AI',
      en: 'Smart AI'
    },
    'formuláře': {
      cs: 'Formuláře',
      sk: 'Formuláre',
      en: 'Forms'
    },
    'rychlá pomoc': {
      cs: 'Rychlá pomoc',
      sk: 'Rýchla pomoc',
      en: 'Quick Help'
    },
    'vzory podání': {
      cs: 'Vzory podání',
      sk: 'Vzory podaní',
      en: 'Document Templates'
    },
    'ai právní asistent': {
      cs: 'AI Právní asistent',
      sk: 'AI Právny asistent',
      en: 'AI Legal Assistant'
    },
    'podpora projektu': {
      cs: 'Podpora projektu',
      sk: 'Podpora projektu',
      en: 'Project Support'
    },
    'krizová pomoc & sos': {
      cs: 'Krizová pomoc & SOS',
      sk: 'Krízová pomoc & SOS',
      en: 'Crisis Support & SOS'
    },
    'mohlo by vás zajímat & související materiály': {
      cs: 'Mohlo by vás zajímat & Související materiály',
      sk: 'Mohlo by vás zaujímať & Súvisiace materiály',
      en: 'You Might Be Interested In & Related Materials'
    },
    'doporučené hlavní moduly pro váš nejlepší start v portálu.': {
      cs: 'Doporučené hlavní moduly pro váš nejlepší start v portálu.',
      sk: 'Odporúčané hlavné moduly pre váš najlepší štart v portáli.',
      en: 'Recommended core modules for your best start on the portal.'
    },
    'doporučené navazující kroky, vzory a nástroje pro váš procesní úspěch.': {
      cs: 'Doporučené navazující kroky, vzory a nástroje pro váš procesní úspěch.',
      sk: 'Odporúčané nadväzujúce kroky, vzory a nástroje pre váš procesný úspech.',
      en: 'Recommended follow-up steps, templates, and tools for your procedural success.'
    },
    'kontext: úvodní stránka': {
      cs: 'Kontext: Úvodní stránka',
      sk: 'Kontext: Úvodná stránka',
      en: 'Context: Home Page'
    },
    'kontext: doporučené moduly': {
      cs: 'Kontext: Doporučené moduly',
      sk: 'Kontext: Odporúčané moduly',
      en: 'Context: Recommended Modules'
    },
    'dynamická kontextová synchronizace v4.2': {
      cs: 'Dynamická kontextová synchronizace v4.2',
      sk: 'Dynamická kontextová synchronizácia v4.2',
      en: 'Dynamic Context Sync v4.2'
    },
    'právní řád a legislativa': {
      cs: 'Právní řád a legislativa',
      sk: 'Právny poriadok a legislatíva',
      en: 'Legal System & Legislation'
    },
    'judikatura a precedenty': {
      cs: 'Judikatura a precedenty',
      sk: 'Judikatúra a precedenty',
      en: 'Case Law & Precedents'
    },
    'střídavá a společná péče': {
      cs: 'Střídavá a společná péče',
      sk: 'Striedavá a spoločná starostlivosť',
      en: 'Joint & Shared Custody'
    },
    'noční péče a přespávání kojenců': {
      cs: 'Noční péče a přespávání kojenců',
      sk: 'Nočná starostlivosť a prespávanie dojčiat',
      en: 'Overnight Care for Infants'
    },
    'psychologie dítěte & attachment': {
      cs: 'Psychologie dítěte & Attachment',
      sk: 'Psychológia dieťaťa & Attachment',
      en: 'Child Psychology & Attachment'
    },
    'rodičovská alienace (pas)': {
      cs: 'Rodičovská alienace (PAS)',
      sk: 'Rodičovská alienácia (PAS)',
      en: 'Parental Alienation (PAS)'
    },
    'jednání s ospod a úřady': {
      cs: 'Jednání s OSPOD a úřady',
      sk: 'Konanie s OSPOD a úradmi',
      en: 'Interactions with Child Protection (OSPOD)'
    },
    'vzory podání a žalob': {
      cs: 'Vzory podání a žalob',
      sk: 'Vzory podaní a žalôb',
      en: 'Templates of Motions & Lawsuits'
    },
    'výživné a majetkové vyrovnání': {
      cs: 'Výživné a majetkové vyrovnání',
      sk: 'Výživné a majetkové vyrovnanie',
      en: 'Child Support & Asset Settlement'
    },
    'zdraví, vývoj a péče': {
      cs: 'Zdraví, vývoj a péče',
      sk: 'Zdravie, vývoj a starostlivosť',
      en: 'Health, Development & Care'
    },
    'vzdělávání a volný čas': {
      cs: 'Vzdělávání a volný čas',
      sk: 'Vzdelávanie a voľný čas',
      en: 'Education & Leisure'
    },
    'komunikace s druhým rodičem': {
      cs: 'Komunikace s druhým rodičem',
      sk: 'Komunikácia s druhým rodičom',
      en: 'Communication with the Other Parent'
    },
    'krizová pomoc a sos': {
      cs: 'Krizová pomoc a SOS',
      sk: 'Krízová pomoc a SOS',
      en: 'Crisis Support & SOS'
    },
    'falešná obvinění a ochrana práv': {
      cs: 'Falešná obvinění a ochrana práv',
      sk: 'Falošné obvinenia a ochrana práv',
      en: 'False Accusations & Protection of Rights'
    },
    'mezinárodní právo a stěhování dětí': {
      cs: 'Mezinárodní právo a stěhování dětí',
      sk: 'Medzinárodné právo a sťahovanie detí',
      en: 'International Law & Child Relocation'
    },
    'význam širší rodiny a prarodičů': {
      cs: 'Význam širší rodiny a prarodičů',
      sk: 'Význam širšej rodiny a starých rodičov',
      en: 'Role of Extended Family & Grandparents'
    },
    'znalecké posudky a psychologové': {
      cs: 'Znalecké posudky a psychologové',
      sk: 'Znalecké posudky a psychológovia',
      en: 'Expert Opinions & Psychologists'
    },
    'kritika překonaných studií': {
      cs: 'Kritika překonaných studií',
      sk: 'Kritika prekonaných štúdií',
      en: 'Critique of Outdated Studies'
    },
    'technologie a ai pro táty': {
      cs: 'Technologie a AI pro táty',
      sk: 'Technológie a AI pre otcov',
      en: 'Technology & AI for Fathers'
    },
    'komunita a sdílení zkušeností': {
      cs: 'Komunita a sdílení zkušeností',
      sk: 'Komunita a zdieľanie skúseností',
      en: 'Community & Experience Sharing'
    },
    'statistiky a výzkumy': {
      cs: 'Statistiky a výzkumy',
      sk: 'Štatistiky a výskumy',
      en: 'Statistics & Research'
    }
  };

  // Check exact lookup in the common dictionary
  if (commonDict[lowerText]) {
    return commonDict[lowerText][lang];
  }

  // Iterate over common words and translate if they are part of sitemap or headers
  let translated = text;

  // Slovak is extremely similar to Czech. We can use clean regular expression mappings for highly accurate Slovak translation if no explicit lookup matches
  if (lang === 'sk') {
    // Apply Czech to Slovak translation mapping rules
    translated = translated
      .replace(/péče/g, 'starostlivosť')
      .replace(/Péče/g, 'Starostlivosť')
      .replace(/řízení/g, 'konanie')
      .replace(/Řízení/g, 'Konanie')
      .replace(/soudní/g, 'súdne')
      .replace(/Soudní/g, 'Súdne')
      .replace(/výživné/g, 'výživné')
      .replace(/Výživné/g, 'Výživné')
      .replace(/dítě/g, 'dieťa')
      .replace(/Dítě/g, 'Dieťa')
      .replace(/děti/g, 'deti')
      .replace(/Děti/g, 'Deti')
      .replace(/otce/g, 'otca')
      .replace(/Otce/g, 'Otca')
      .replace(/otci/g, 'otcovi')
      .replace(/matky/g, 'matky')
      .replace(/Matky/g, 'Matky')
      .replace(/případ/g, 'prípad')
      .replace(/Případ/g, 'Prípad')
      .replace(/důkaz/g, 'dôkaz')
      .replace(/Důkaz/g, 'Dôkaz')
      .replace(/důkazní/g, 'dôkazný')
      .replace(/Důkazní/g, 'Dôkazný')
      .replace(/vzor/g, 'vzor')
      .replace(/Vzor/g, 'Vzor')
      .replace(/střídavá/g, 'striedavá')
      .replace(/Střídavá/g, 'Striedavá')
      .replace(/přespávání/g, 'prespávanie')
      .replace(/Přespávání/g, 'Prespávanie')
      .replace(/žaloba/g, 'žaloba')
      .replace(/Žaloba/g, 'Žaloba')
      .replace(/návrh/g, 'návrh')
      .replace(/Návrh/g, 'Návrh')
      .replace(/složka/g, 'priečinok')
      .replace(/Složka/g, 'Priečinok')
      .replace(/pracovna/g, 'pracovňa')
      .replace(/Pracovna/g, 'Pracovňa')
      .replace(/Zpět/g, 'Späť')
      .replace(/zpět/g, 'späť')
      .replace(/Uložit/g, 'Uložiť')
      .replace(/uložit/g, 'uložiť')
      .replace(/Smazat/g, 'Zmazať')
      .replace(/smazat/g, 'zmazať')
      .replace(/Zrušit/g, 'Zrušiť')
      .replace(/zrušit/g, 'zrušiť')
      .replace(/Přidat/g, 'Pridať')
      .replace(/přidat/g, 'pridať')
      .replace(/Upravit/g, 'Upraviť')
      .replace(/upravit/g, 'upraviť')
      .replace(/Zavřít/g, 'Zatvoriť')
      .replace(/zavřít/g, 'zatvoriť')
      .replace(/Odeslat/g, 'Odoslať')
      .replace(/odeslat/g, 'odoslať')
      .replace(/Zákony/g, 'Zákony')
      .replace(/Soudy/g, 'Súdy')
      .replace(/Psychologie/g, 'Psychológia')
      .replace(/Ústavní soud/g, 'Ústavný súd')
      .replace(/Nejvyšší soud/g, 'Najvyšší súd')
      .replace(/střídání/g, 'striedanie')
      .replace(/Střídání/g, 'Striedanie')
      .replace(/analýza/g, 'analýza')
      .replace(/Analýza/g, 'Analýza')
      .replace(/přehled/g, 'prehľad')
      .replace(/Přehled/g, 'Prehľad')
      .replace(/soubor/g, 'súbor')
      .replace(/Soubor/g, 'Súbor')
      .replace(/dokument/g, 'dokument')
      .replace(/Dokument/g, 'Dokument')
      .replace(/vyjádření/g, 'vyjadrenie')
      .replace(/Vyjádření/g, 'Vyjadrenie')
      .replace(/stížnost/g, 'sťažnosť')
      .replace(/Stížnost/g, 'Sťažnosť')
      .replace(/komunikace/g, 'komunikácia')
      .replace(/Komunikace/g, 'Komunikácia')
      .replace(/rodičů/g, 'rodičov')
      .replace(/Rodičů/g, 'Rodičov')
      .replace(/stabilní/g, 'stabilný')
      .replace(/připraven/g, 'pripravený')
      .replace(/aktivní/g, 'aktívny')
      .replace(/celkový/g, 'celkový')
      .replace(/funkčnost/g, 'funkčnosť')
      .replace(/složky/g, 'priečinka')
      .replace(/nahrát/g, 'nahrať')
      .replace(/Nahrát/g, 'Nahrať')
      .replace(/úložiště/g, 'úložisko')
      .replace(/Úložiště/g, 'Úložisko')
      .replace(/časová osa/g, 'časová os')
      .replace(/Časová osa/g, 'Časová os');
  } else if (lang === 'en') {
    // Apply key terminology translations to English
    translated = translated
      .replace(/střídavá péče/gi, 'joint custody')
      .replace(/výhradní péče/gi, 'sole custody')
      .replace(/péče o dítě/gi, 'child care')
      .replace(/soudní řízení/gi, 'court proceedings')
      .replace(/výživné/gi, 'child support')
      .replace(/dítě/gi, 'child')
      .replace(/děti/gi, 'children')
      .replace(/otec/gi, 'father')
      .replace(/otce/gi, 'father')
      .replace(/matka/gi, 'mother')
      .replace(/matky/gi, 'mother')
      .replace(/případ/gi, 'case')
      .replace(/důkaz/gi, 'evidence')
      .replace(/vzor/gi, 'template')
      .replace(/přespávání/gi, 'overnights')
      .replace(/žaloba/gi, 'lawsuit')
      .replace(/návrh/gi, 'motion')
      .replace(/složka/gi, 'folder')
      .replace(/pracovna/gi, 'workspace')
      .replace(/Zpět/gi, 'Back')
      .replace(/Uložit/gi, 'Save')
      .replace(/Smazat/gi, 'Delete')
      .replace(/Zrušit/gi, 'Cancel')
      .replace(/Přidat/gi, 'Add')
      .replace(/Upravit/gi, 'Edit')
      .replace(/Zavřít/gi, 'Close')
      .replace(/Odeslat/gi, 'Send')
      .replace(/Ústavní soud/gi, 'Constitutional Court')
      .replace(/Nejvyšší soud/gi, 'Supreme Court')
      .replace(/analýza/gi, 'analysis')
      .replace(/přehled/gi, 'overview')
      .replace(/soubor/gi, 'file')
      .replace(/dokument/gi, 'document')
      .replace(/vyjádření/gi, 'statement')
      .replace(/stížnost/gi, 'complaint')
      .replace(/komunikace/gi, 'communication')
      .replace(/rodičů/gi, 'parents')
      .replace(/nahrát/gi, 'upload')
      .replace(/úložiště/gi, 'vault')
      .replace(/časová osa/gi, 'timeline');
  }

  return translated;
}

/**
 * Automatically translates fields of an object using defined lookups or fallback rules.
 */
export function getTranslatedObject<T extends Record<string, any>>(
  id: string,
  obj: T,
  lang: Language
): T {
  if (lang === 'cs') return obj;

  const overrides = DYNAMIC_TRANSLATIONS[id];
  const translated = { ...obj } as any;

  for (const key of Object.keys(obj)) {
    if (overrides && overrides[key]) {
      translated[key] = overrides[key][lang] || overrides[key]['cs'];
    } else if (typeof obj[key] === 'string') {
      translated[key] = translateText(obj[key], lang);
    } else if (Array.isArray(obj[key])) {
      translated[key] = obj[key].map((item: any) => 
        typeof item === 'string' ? translateText(item, lang) : item
      );
    }
  }

  return translated as T;
}
