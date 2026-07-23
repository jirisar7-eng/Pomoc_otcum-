/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  BookOpen, 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  Share2, 
  ChevronRight, 
  Copy, 
  Check, 
  Layers, 
  FolderCheck, 
  ShieldAlert,
  Search,
  CheckCircle2,
  Tv,
  Users,
  Award,
  Compass,
  FileSpreadsheet,
  HeartPulse,
  Briefcase,
  AlertTriangle
} from 'lucide-react';

import { 
  HUB_CATEGORIES, 
  HUB_ARTICLES, 
  HUB_JUDGMENTS, 
  HUB_STUDIES, 
  HUB_TEMPLATES,
  HubCategory,
  HubArticle,
  HubJudgment,
  HubStudy,
  HubTemplate
} from '../data/contentHub';
import { INITIAL_ARTICLES } from '../initialState';
import { User } from '../types';

interface CategoryDetailViewProps {
  categorySlug: string;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
}

export interface CategoryBlueprint {
  purpose: string;
  keyPoints: { title: string; detail: string }[];
  aiPrompts: string[];
}

// Complete SYNTHESIS AI v7.0 Content Blueprint for all 21 categories
export const CATEGORY_BLUEPRINTS: Record<string, CategoryBlueprint> = {
  'pravni-rad': {
    purpose: 'Srozumitelný výklad zákona o rodině, občanského zákoníku (NOZ) a mezinárodních úmluv v praxi opatrovnického soudnictví.',
    keyPoints: [
      {
        title: 'Základní práva a povinnosti rodičů',
        detail: 'Rodičovská odpovědnost dle občanského zákoníku (§ 865 NOZ) náleží oběma rodičům stejně. Zahrnuje péči o dítě, jeho osobnostní vývoj, zastupování a správu jmění.'
      },
      {
        title: 'Rovnost rodičů a nejlepší zájem dítěte',
        detail: 'Princip nejlepšího zájmu dítěte (§ 888 NOZ) vyžaduje zachování rovnocenného vztahu k oběma rodičům. Žádný rodič nemá ze zákona přednostní právo na péči.'
      },
      {
        title: 'Zákaz diskriminace otců v rodinném právu',
        detail: 'Předsudky o "přirozené primární péči matky" nemají oporu v zákoně. Opatrovnický soud je povinen zkoumat reálné rodičovské předpoklady bez genderových stereotypů.'
      }
    ],
    aiPrompts: [
      'Jaké jsou základní paragrafy občanského zákoníku upravující rodičovskou odpovědnost otce?',
      'Jak interpretovat princip nejlepšího zájmu dítěte u opatrovnického soudu?',
      'Jak namítnout diskriminaci otce na základě pohlaví v opatrovnickém řízení?'
    ]
  },
  'judikatura': {
    purpose: 'Znalost klíčových rozhodnutí Ústavního soudu ČR, Nejvyššího soudu a ESLP, která tátům otevírají dveře k rovnocenné péči.',
    keyPoints: [
      {
        title: 'Nálezy Ústavního soudu o rovnocennosti péče',
        detail: 'Zlomové nálezy (např. IV. ÚS 805/14, I. ÚS 2482/13, II. ÚS 1835/12) stanovují, že svěření dítěte do střídavé péče má být pravidlem, pokud jsou oba rodiče způsobilí.'
      },
      {
        title: 'Právní věty přeložené do lidské řeči',
        detail: 'Praktické návody, jak správně citovat judikaturu v návrzích a odvoláních tak, aby opatrovnický soudce nemohl smést argumenty ze stolu.'
      },
      {
        title: 'Judikatura ESLP (Štrasburk) k právu na rodinný život',
        detail: 'Aplikace Článku 8 Úmluvy o ochraně lidských práv – povinnost státu aktivně konat k zachování rodinných vazeb a zamezení průtahům.'
      }
    ],
    aiPrompts: [
      'Jak použít nález Ústavního soudu IV. ÚS 805/14 v odvolání proti výhradní péči matky?',
      'Které judikáty Ústavního soudu ČR výslovně zakazují paušální zamítání střídavé péče?',
      'Jak citovat judikaturu ESLP týkající se průtahů soudu a maření styku?'
    ]
  },
  'stridava-pece': {
    purpose: 'Odborná a právní podpora pro nejlepší model uspořádání péče po rozvodu nebo rozchodu rodičů.',
    keyPoints: [
      {
        title: 'Mýty a fakta o střídavé péči',
        detail: 'Vyvrácení falešných tvrzení o "dvoji domově jako traumatu". Vědecké výzkumy ukazují, že děti ve střídavé péči dosahují nejlepších psychických i akademických výsledků.'
      },
      {
        title: 'Adaptabilní modely střídání podle věku',
        detail: 'Harmonogramy 2-2-3 pro nejmenší děti, týden/týden pro školáky, čtrnáctidenní cykly pro dospívající a asymetrické modely uzpůsobené směnovému provozu.'
      },
      {
        title: 'Budování stabilního dvojího domova',
        detail: 'Praktická pravidla pro paralelní rodičovství, logistiku, předávání osobních věcí, oblečení a školních potřeb bez zbytečného napětí.'
      }
    ],
    aiPrompts: [
      'Jaké jsou podle judikatury Ústavního soudu ČR hlavní věcné argumenty pro střídavou péči?',
      'Jak sestavit stabilní harmonogram předávání dětí při střídavé péči na vzdálenost 30 km?',
      'Jak vyvrátit tvrzení matky u soudu, že pro střídavou péči chybí vzájemná dohoda rodičů?'
    ]
  },
  'nocni-pece': {
    purpose: 'Odborná vědecká munice proti argumentům, že kojenec nebo batole nemůže spát u otce.',
    keyPoints: [
      {
        title: 'Význam noční péče pro bezpečný attachment',
        detail: 'Přespávání u otce vytváří hlubokou neurobiologickou vazbu skrze večerní rituály, uklidňování při pláči a ranní buzení. Konsenzus 110 světových odborníků (Warshak 2014).'
      },
      {
        title: 'Praktický manuál pro postupné zvykání',
        detail: 'Harmonogram přechodu od půldenních pobytů k jedné noci a postupně plné noční péči. Zvládání dokrmování, nočního pláče a spánkového režimu.'
      },
      {
        title: 'Demontáž zastaralých mýtů OSPOD',
        detail: 'Právní a znalecké repliky proti tvrzením, že "před 3. rokem věku dítě nesmí být bez matky přes noc".'
      }
    ],
    aiPrompts: [
      'Jak na základě konsensuální studie Warshak 2014 odůvodnit přespávání kojence u otce?',
      'Jak formulovat návrh na předběžné opatření pro noční péči o dvouleté dítě?',
      'Jaké jsou nejčastější argumenty OSPOD proti noční péči u batolat a jak na ně reagovat?'
    ]
  },
  'psychologie-attachment': {
    purpose: 'Pochopení vnitřního světa dítěte, citové vazby a nutnosti obou rodičů pro zdravý vývoj mozku a osobnosti.',
    keyPoints: [
      {
        title: 'Otec jako rovnocenná attachmentová figura',
        detail: 'Teorie citové vazby (Bowlby, Ainsworth, Lamb) dokazuje, že děti vytvářejí nezávislé bezpečné vazby k oběma rodičům. Otec není jen "herní společník".'
      },
      {
        title: 'Neurologické dopady odloučení od otce',
        detail: 'Absence otce zvyšuje riziko úzkostí, depresí, poruch chování a emoční dysregulace v dospívání i dospělosti.'
      },
      {
        title: 'Zvládání přechodů a separační úzkosti',
        detail: 'Jak pomoci dítěti při předávání mezi domovy, vytvořit uklidňující rituály a nečíst pláč při loučení jako "odmítání otce".'
      }
    ],
    aiPrompts: [
      'Jak odborně vysvětlit soudu pojem sekundární bezpečné vazby (attachment) k otci?',
      'Jaké jsou dopady izolace od otce na neurologický a emocionální vývoj dítěte?',
      'Jak psychologicky připravit dítě na přechod mezi dvěma domovy bez stresu?'
    ]
  },
  'rodicovska-alienace': {
    purpose: 'Včasná detekce a právní obrana proti psychické manipulaci, očerňování a zavrhování jednoho z rodičů (PAS).',
    keyPoints: [
      {
        title: 'Rozpoznání syndromu zavrženého rodiče (PAS)',
        detail: 'Typické projevy u dítěte: přejímání frází druhého rodiče, absence pocitu viny, bezdůvodná nenávist k otci a jeho širší rodině.'
      },
      {
        title: 'Důkazní strategie pro soud a OSPOD',
        detail: 'Sběr objektivních důkazů: nahrávky předávání, písemná komunikace, znalecké posudky a znalecké zkoumání manipulativního jednání.'
      },
      {
        title: 'Sankcionování maření styku a změna péče',
        detail: 'Právní kroky od pokut za neplatné výmluvy až po návrh na změnu výchovného prostředí podle § 888 NOZ a judikatury ÚS.'
      }
    ],
    aiPrompts: [
      'Jak identifikovat první příznaky rodičovské alienace (PAS) u sedmiletého dítěte?',
      'Jaké důkazy a znalecké posudky jsou nutné pro prokázání maření styku ze strany matky?',
      'Jak formulovat návrh na výkon rozhodnutí (pokuty) při neustálém neodpovídání na zprávy?'
    ]
  },
  'jednani-ospod': {
    purpose: 'Praktický průvodce pro úspěšnou, věcnou a bezpečnou komunikaci na orgánu sociálně-právní ochrany dětí (OSPOD).',
    keyPoints: [
      {
        title: 'Příprava na první schůzku na OSPOD',
        detail: 'Pravidlo klidu a věcnosti. Zaměření výhradně na potřeby dítěte, nikoliv na spory s bývalou partnerkou. Záznamy z jednání a protokoly.'
      },
      {
        title: 'Práva otce a povinnosti sociálních pracovníků',
        detail: 'Právo na nahlížení do spisu, pořizování kopií, audiozáznamu podle správního řádu a vyžadování objektivního přešetření poměrů.'
      },
      {
        title: 'Obrana proti zaujatosti a podjatosti',
        detail: 'Jak podat formální námitku podjatosti pracovnice OSPOD, stížnost vedoucímu odboru nebo podnět na krajský úřad a veřejného ochránce práv.'
      }
    ],
    aiPrompts: [
      'Jak napsat námitku podjatosti vůči sociální pracovnici OSPOD, která straní matce?',
      'Jaké mám zákonné právo na pořízení audiozáznamu či zápisu z jednání na OSPOD?',
      'Jak dosáhnout objektivního přešetření spisu OSPOD u krajského úřadu či ombudsmana?'
    ]
  },
  'vzory-podani': {
    purpose: 'Okamžitě použitelné, procesně přesné právní dokumenty vytvořené podle aktuální judikatury a soudní praxe.',
    keyPoints: [
      {
        title: 'Návrhy na zahájení opatrovnického řízení',
        detail: 'Vzory návrhů na svěření do střídavé péče, úpravu styku, stanovení přiměřeného výživného a změnu předchozího rozsudku.'
      },
      {
        title: 'Odvolání a mimořádné opravné prostředky',
        detail: 'Strukturovaná odvolání proti chybujícím rozsudkům okresních soudů, návrhy na vydání předběžného opatření dle § 452 z.ř.s.'
      },
      {
        title: 'Procesní stížnosti a žadosti',
        detail: 'Žádosti o nahlédnutí do soudního spisu, stížnosti na průtahy v řízení adresované předsedovi soudu a ústavní stížnosti.'
      }
    ],
    aiPrompts: [
      'Jak správně strukturovat návrh na změnu péče z výhradní na střídavou?',
      'Jak napsat odvolání proti zamítnutí předběžného opatření na úpravu styku?',
      'Jak formulovat žádost o kopii celého spisu u opatrovnického soudu?'
    ]
  },
  'vyzivne-majetek': {
    purpose: 'Férové, transparentní nastavení finančních podmínek bez emocí na základě dat a doporučujících tabulek MS ČR.',
    keyPoints: [
      {
        title: 'Kritéria pro výpočet přiměřeného výživného',
        detail: 'Doporučující tabulky Ministerstva spravedlnosti ČR, započtení rozsahu osobní péče, čistého příjmu a odůvodněných potřeb dítěte.'
      },
      {
        title: 'Mimořádné náklady vs. běžné výživné',
        detail: 'Právní posouzení nákladů na kroužky, tábory, rovnátka a lyžařské výcviky. Co spadá do stanoveného výživného a kdy je nutná dohoda.'
      },
      {
        title: 'Majetkové vyrovnání SJM a bydlení',
        detail: 'Vypořádání společného jmění manželů, hypotéky, nájemního práva a zápočtu péče o dítě při majetkovém dělení.'
      }
    ],
    aiPrompts: [
      'Jak spočítat výživné při střídavé péči podle doporučujících tabulek MS ČR?',
      'Jak se posuzují nadstandardní náklady a mimořádné potřeby dítěte u soudu?',
      'Jak podat návrh na snížení výživného při změně mého příjmu nebo zvýšení podílu péče?'
    ]
  },
  'zdravi-vyvoj': {
    purpose: 'Zajištění plnohodnotného, rovnoprávného přístupu otce k lékařské péči, informacím a rozhodování o zdraví dítěte.',
    keyPoints: [
      {
        title: 'Právo otce na zdravotnickou dokumentaci',
        detail: 'Lékařské tajemství neplatí vůči rodiči s rodičovskou odpovědností (§ 865 NOZ). Pediatr i specialisté jsou povinni poskytovat otci všechny zprávy.'
      },
      {
        title: 'Rozhodování o významných zdravotních zákrocích',
        detail: 'Očkování, operace, změna pediatra či psychiatrická péče vyžadují souhlas obou rodičů. Při neshodě rozhoduje opatrovnický soud.'
      },
      {
        title: 'Péče o nemocné dítě a ošetřování (OČR)',
        detail: 'Právo otce na ošetřování člena rodiny (OČR) v době jeho péče a povinnost předávat léky a zdravotní instrukce mezi rodiči.'
      }
    ],
    aiPrompts: [
      'Jak vynutit u pediatra poskytování zdravotních informací a zpráv o dítěti otci?',
      'Jak řešit situaci, kdy matka odmítá součinnost při očkování nebo léčbě dítěte?',
      'Jak právně ošetřit neshodu rodičů o změně ošetřujícího lékaře dítěte?'
    ]
  },
  'vzdelavani-cas': {
    purpose: 'Aktivní zapojení otce do školního a zájmového života dítěte bez blokací ze strany druhého rodiče.',
    keyPoints: [
      {
        title: 'Komunikace se školou a e-žákovskou knížkou',
        detail: 'Škola je povinna zřídit otci samostatný přístup do systémů Bakaláři / Edookit a zasílat pozvánky na třídní schůzky.'
      },
      {
        title: 'Výběr školy, školky a kroužků',
        detail: 'Výběr vzdělávací instituce je podstatnou záležitostí. Jednostranný zápis matkou bez souhlasu otce je napadnutelný u soudu.'
      },
      {
        title: 'Vyzvedávání ze školy a zájmová činnost',
        detail: 'Soudní úprava oprávnění vyzvedávat dítě ze školní družiny, účastnit se besídek a doprovázet ho na sportovní tréninky.'
      }
    ],
    aiPrompts: [
      'Jak získat přístup do školního systému (Bakaláři) pokud škola komunikuje jen s matkou?',
      'Jak postupovat při neshodě rodičů o výběru základní školy nebo školky pro dítě?',
      'Jak upravit vyzvedávání dítěte ze školní družiny v rozsudku o péči?'
    ]
  },
  'komunikace-rodice': {
    purpose: 'Snížení napětí, eliminace provokací a vytvoření stabilní, dokumentovatelné komunikační linie.',
    keyPoints: [
      {
        title: 'Asertivní Metoda BIFF v praxi',
        detail: 'Pravidlo BIFF: Brief (stručné), Informative (informativní), Friendly (přátelské), Firm (pevné). Jak eliminovat emoční útoky.'
      },
      {
        title: 'Využití specializovaných rodičovských aplikací',
        detail: 'Zavedení platforem typu CoParenter nebo 2houses pro sdílení kalendáře, výdajů a neupravitelnou historii zpráv pro soud.'
      },
      {
        title: 'Dokumentace komunikace pro opatrovnický spis',
        detail: 'Přehledná archivace e-mailů a SMS do časových os. Jak prokázat, že otec komunikuje konstruktivně a matka konflikt eskaluje.'
      }
    ],
    aiPrompts: [
      'Jak odpovědět na útočný a manipulativní e-mail matky metodou BIFF?',
      'Jak navrhnout soudu povinnost komunikovat výhradně přes rodičovskou aplikaci?',
      'Jak dokumentovat komunikaci pro účely opatrovnického soudu bez nařčení ze špionáže?'
    ]
  },
  'krizova-pomoc': {
    purpose: 'Okamžitá záchranná síť v akutní nouzi – bezdůvodné odepření styku, zásah PČR, psychický kolaps a SOS postupy.',
    keyPoints: [
      {
        title: 'Postup při odmítnutí předání dítěte',
        detail: 'Kroky přímo na místě: zachovat absolutní klid, sepsat časový záznam, přizvat svědky, neprovokovat fyzické konflikty.'
      },
      {
        title: 'Součinnost s Policií ČR a úřední záznam',
        detail: 'Kdy volat tísňovou linku 158. Policie na místě neprovádí výkon rozhodnutí, ale je povinna sepsat úřední záznam o maření styku.'
      },
      {
        title: 'Akutní předběžná opatření a krizová intervence',
        detail: 'Podání rychlého návrhu na předběžné opatření do 24 hodin a kontakty na krizové linky psychologické pomoci pro táty.'
      }
    ],
    aiPrompts: [
      'Co přesně říci hlídce Policie ČR, když matka odmítá předat dítě v čase předání?',
      'Jak podat akutní návrh na předběžné opatření při náhlém zamezení styku s dítětem?',
      'Jaké jsou kontakty a postupy při akutní psychické krizi z odloučení od dítěte?'
    ]
  },
  'falesna-obvineni': {
    purpose: 'Rychlá a účinná právní obrana proti zneužívání trestního práva a vykonstruovaným obviněním z domácího násilí.',
    keyPoints: [
      {
        title: 'První kroky při podání křivého vysvětlení na PČR',
        detail: 'Nevypovídat bez přítomnosti advokáta. Trvat na protokolu se všemi detaily, předložit důkazní materiál (SMS, geolokace, svědectví).'
      },
      {
        title: 'Využití digitální stopy a alibi',
        detail: 'Systematická rekonstrukce časové osy: výpisy hovorů, fotky s časovým razítkem, bankovní transakce a záznamy z kamer.'
      },
      {
        title: 'Protiútok: Trestní oznámení pro křivé obvinění',
        detail: 'Podání trestního oznámení dle § 345 Trestního zákoníku (křivé obvinění) a vymáhání náhrady nemajetkové újmy.'
      }
    ],
    aiPrompts: [
      'Jak se bránit u Policie ČR při účelovém obvinění z domácího násilí během rozvodu?',
      'Jak využít krizový protokol a časové osy komunikace pro prokázání neviny?',
      'Jak podat trestní oznámení pro křivé obvinění a poškozování cizích práv?'
    ]
  },
  'mezinarodni-pravo': {
    purpose: 'Právní řešení situací, kdy jeden z rodičů chce odcestovat nebo bez souhlasu odstěhovat dítě do zahraničí.',
    keyPoints: [
      {
        title: 'Haagská úmluva o mezinárodních únosech dětí',
        detail: 'Právní mechanismy pro okamžitý návrat nelegálně přemístěného dítěte zpět do země obvyklého bydliště skrze ÚMPOD Brno.'
      },
      {
        title: 'Preventivní opatření proti zavlečení do ciziny',
        detail: 'Podání nesouhlasu s vydáním cestovního pasu, předběžná opatření zakazující vycestování a zablokování únosu.'
      },
      {
        title: 'Přeshraniční styk a evropská nařízení',
        detail: 'Uplatnění Nařízení Brusel IIb v EU pro uznání a výkon českých rozsudků o péči a styku v ostatních členských státech.'
      }
    ],
    aiPrompts: [
      'Jak zabránit matce v nelegálním odstěhování dítěte do zahraničí bez mého souhlasu?',
      'Jak funguje ÚMPOD Brno při mezinárodním únosu dítěte druhým rodičem?',
      'Jak formulovat písemný nesouhlas s trvalým přemístěním dítěte do ciziny?'
    ]
  },
  'sirsi-rodina': {
    purpose: 'Ochrana a udržení vazeb dítěte s prarodiči, sourozenci, strýci a tetičkami z otcovy strany.',
    keyPoints: [
      {
        title: 'Zákonné právo prarodičů na styk podle § 927 NOZ',
        detail: 'Prarodiče mají samostatné právní nároky na úpravu styku s vnoučaty, pokud je to v zájmu dítěte a dlouhodobě spolu vztah pěstovali.'
      },
      {
        title: 'Zachování sourozenecké vazby',
        detail: 'Soudy nesmí bez mimořádně závažných důvodů trhat sourozence nebo jim bránit v kontaktu s nevlastními sourozenci u otce.'
      },
      {
        title: 'Samostatný návrh prarodičů k soudu',
        detail: 'Návod pro babičky a dědečky, jak sepsat a podat k opatrovnickému soudu vlastní návrh na úpravu styku.'
      }
    ],
    aiPrompts: [
      'Jak mohou prarodiče podat k opatrovnickému soudu návrh na úpravu styku s vnoučetem?',
      'Jaké jsou judikáty garantující právo dítěte na kontakt s prarodiči z otcovy strany?',
      'Jak bránit zpřetrhání vazeb mezi sourozenci z různých vztahů u soudu?'
    ]
  },
  'znalecke-posudky': {
    purpose: 'Příprava na soudní znalecké zkoumání v oboru klinické psychologie a psychiatrie bez osudových chyb.',
    keyPoints: [
      {
        title: 'Průběh znaleckého vyšetření rodiny',
        detail: 'Diagnostické psychotesty, rozhovory o výchově, sledování interakce rodiče s dítětem v ordinaci a rozbor osobnosti.'
      },
      {
        title: 'Klíčové zásady pro otce u znalce',
        detail: 'Zachovat absolutní klid, neosočovat matku, soustředit se na potřeby dítěte, projevovat vřelost a nepřicházet se naučenými frázemi.'
      },
      {
        title: 'Námitky proti posudku a revizní znalecké zkoumání',
        detail: 'Jak odhalit metodické chyby v posudku, podat procesní námitky a dosáhnout vypracování revizního posudku ústavem.'
      }
    ],
    aiPrompts: [
      'Jak se připravit na psychologické vyšetření u soudního znalce v opatrovnickém sporu?',
      'Jaké jsou hlavní metodické chyby v psychologických posudcích a jak podat námitky?',
      'Jak formulovat otázky pro soudního znalce zaměřené na rodičovskou způsobilost otce?'
    ]
  },
  'kritika-studii': {
    purpose: 'Demontáž zastaralých, metodicky chybných prací a názorů používaných v opatrovnických sporech proti otcům.',
    keyPoints: [
      {
        title: 'Metodické chyby studie McIntosh (2010)',
        detail: 'Prokázání, že studie McIntosh trpěla nereprezentativním vzorkem sociálně rizikových rodin a byla odsouzena světovou vědeckou obcí.'
      },
      {
        title: 'Kritika práce Solomon & George (1999)',
        detail: 'Vysvětlení, proč závěry o "vlivu přespávání na úzkost kojenců" byly zkresleny konfliktem rodičů, nikoliv samotnou noční péčí.'
      },
      {
        title: 'Moderní vědecký konsenzus (Warshak 2014, Nielsen 2018)',
        detail: 'Předložení důkazů potvrzených více než 110 světovými experty o přínosu péče obou rodičů od nejranějšího věku.'
      }
    ],
    aiPrompts: [
      'Jak u soudu odmítnout argumentaci opírající se o překonanou studii McIntosh 2010?',
      'Které mezinárodní vědecké konsenzy (Warshak 2014) potvrzují bezpečnost péče obou rodičů?',
      'Jak napsat námitku proti znaleckému posudku, který tvrdí, že batole potřebuje jen matku?'
    ]
  },
  'technologie-ai': {
    purpose: 'Využití moderních digitálních nástrojů, generativní AI a správců spisu pro efektivní vedení sporu.',
    keyPoints: [
      {
        title: 'Chytrá archivace a strukturování důkazů',
        detail: 'Nástroje pro automatickou zálohu WhatsAppu, SMS, e-mailů a časové označení audiomateriálů bez rizika ztráty.'
      },
      {
        title: 'AI analýza soudních protokolů a rozsudků',
        detail: 'Použití AI asistenta pro rychlé výtahy z rozsáhlých soudních spisů, hledání rozporů ve výpovědích a generování argumentů.'
      },
      {
        title: 'Digitální správa kalendáře péče a nákladů',
        detail: 'Automatická evidence docházky, nákladů na dítě a příprava přehledných podkladů pro soudní jednání.'
      }
    ],
    aiPrompts: [
      'Jak správně strukturovat časovou osu komunikace a předávání pro opatrovnický soud?',
      'Jak využít AI pro převod audiozáznamu z jednání s OSPOD na strukturovaný zápis?',
      'Jaké jsou nejlepší aplikace pro bezpečné ukládání důkazů v rodinně-právním sporu?'
    ]
  },
  'komunita-zkusenosti': {
    purpose: 'Síla vzájemné psychické, právní i lidské podpory tátů, kteří si prošli stejnou životní zkouškou.',
    keyPoints: [
      {
        title: 'Osobní příběhy a ověřená praxe tátů',
        detail: 'Reálné zkušenosti otců, kteří úspěšně vybojovali střídavou péči nebo obhájili svá práva proti nespravedlivému systému.'
      },
      {
        title: 'Pravidla konstruktivní a bezpečné komunity',
        detail: 'Kultivovaná diskuse bez toxické zášti. Soustředění na právní řešení, psychickou stabilitu a dobro dětí.'
      },
      {
        title: 'Mentoring a lokální otcovské skupiny',
        detail: 'Možnost projení s táty ve stejném kraji, osobní konzultace a sdílení prověřených kontaktů na advokáty a psychology.'
      }
    ],
    aiPrompts: [
      'Jaké jsou zkušenosti ostatních tátů s přechodem z výhradní péče na střídavou?',
      'Jak zvládnout syndrom vyhoření a obrovský stres během dlouholetého opatrovnického sporu?',
      'Jak najít v mém kraji otcovskou podpůrnou skupinu nebo mentora?'
    ]
  },
  'statistiky-vyzkumy': {
    purpose: 'Tvrdá data, oficiální statistiky a vědecké výzkumy z ČR i zahraničí pro neprůstřelnou argumentaci u soudu.',
    keyPoints: [
      {
        title: 'Statistiky Ministerstva spravedlnosti ČR',
        detail: 'Oficiální čísla o podílu střídavé, výhradní a společné péče schvalované českými soudy v posledních letech.'
      },
      {
        title: 'Srovnávací studie dětského prospívání',
        detail: 'Data z výzkumů ČSÚ, OECD, UNICEF a APA dokazující vyšší životní spokojenost dětí vyrůstajících v péči obou rodičů.'
      },
      {
        title: 'Ekonomické a sociální dopady otcovské péče',
        detail: 'Výzkumy potvrzující, že zapojení otce výrazně snižuje riziko chudoby, školního selhávání a delikvence u dětí.'
      }
    ],
    aiPrompts: [
      'Jaká jsou aktuální data Ministerstva spravedlnosti ČR o schvalování střídavé péče soudy?',
      'Jaké statistiky potvrzují lépe prosperující děti ve střídavé péči oproti péči jednoho rodiče?',
      'Jak citovat výzkumy sociologie a psychologie o přínosu otce pro společnost u soudu?'
    ]
  }
};

export default function CategoryDetailView({
  categorySlug,
  setActiveTab,
  setSearchQuery,
  currentUser,
  onOpenAuth
}: CategoryDetailViewProps) {
  const [activeSection, setActiveSection] = useState<'all' | 'blueprint' | 'articles' | 'studies' | 'judgments' | 'templates' | 'ai'>('all');
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<HubTemplate | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HubArticle | null>(null);
  const [selectedJudgment, setSelectedJudgment] = useState<HubJudgment | null>(null);

  // 1. Resolve Category Metadata
  const category = useMemo(() => {
    const found = HUB_CATEGORIES.find(c => c.slug === categorySlug || c.id === categorySlug);
    if (found) return found;
    return HUB_CATEGORIES[0]; // fallback
  }, [categorySlug]);

  // 2. Resolve Category Blueprint & AI Prompts
  const blueprint = useMemo(() => {
    return CATEGORY_BLUEPRINTS[category.slug] || {
      purpose: category.description,
      keyPoints: [
        { title: 'Právní a faktický rámec', detail: 'Srozumitelný přehled pro orientaci otce v daném tématickém okruhu rodinného práva.' },
        { title: 'Praxe OSPOD a opatrovnických soudů', detail: 'Praktická doporučení pro efektivní jednání a obhajobu rodičovských práv.' },
        { title: 'Zájmy a potřeby dítěte', detail: 'Zajištění stability, emočního bezpečí a rozvoje dítěte s účastí obou rodičů.' }
      ],
      aiPrompts: [
        `Jaké jsou nejnovější právní předpisy a judikáty týkající se tématu: ${category.name}?`,
        `Jak připravit návrh k opatrovnickému soudu se zaměřením na ${category.name}?`,
        `Jaké jsou osvědčené praktické kroky pro otce v oblasti ${category.name}?`
      ]
    };
  }, [category]);

  // 3. Filter Content specifically matching this category
  const filteredArticles = useMemo(() => {
    const catSlug = category.slug.toLowerCase();
    const catName = category.name.toLowerCase();

    const fromHub = HUB_ARTICLES.filter(art => {
      if (art.category.toLowerCase() === catSlug || art.category.toLowerCase() === catName) return true;
      if (art.tags.some(t => t.toLowerCase().includes(catSlug) || catName.includes(t.toLowerCase()))) return true;
      if (art.title.toLowerCase().includes(catSlug) || art.content.toLowerCase().includes(catName)) return true;
      return false;
    });

    const fromInitial = INITIAL_ARTICLES.filter(art => {
      if (art.category.toLowerCase().includes(catSlug) || art.category.toLowerCase().includes(catName)) return true;
      if (art.tags.some(t => t.toLowerCase().includes(catSlug) || catName.includes(t.toLowerCase()))) return true;
      return false;
    }).map(art => ({
      id: art.id,
      title: art.title,
      category: category.slug,
      tags: art.tags,
      excerpt: art.summary,
      content: art.content,
      lastUpdated: art.date,
      relatedJudgments: [],
      relatedStudies: [],
      relatedTemplates: [],
      viewCount: art.likes * 15 + 100,
      wordCount: art.content.split(' ').length
    }));

    const combined = [...fromHub, ...fromInitial];
    // Deduplicate by ID
    const seen = new Set<string>();
    const result = combined.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

    // Fallback if none found directly
    if (result.length === 0) {
      return HUB_ARTICLES.slice(0, 2);
    }
    return result;
  }, [category]);

  const filteredJudgments = useMemo(() => {
    const catSlug = category.slug.toLowerCase();
    const catName = category.name.toLowerCase();

    const matched = HUB_JUDGMENTS.filter(jud => {
      if (jud.tags.some(t => t.toLowerCase().includes(catSlug) || catName.includes(t.toLowerCase()))) return true;
      if (jud.title.toLowerCase().includes(catName) || jud.excerpt.toLowerCase().includes(catName)) return true;
      if (catSlug.includes('judikatura') || catSlug.includes('pravni-rad') || catSlug.includes('stridava-pece') || catSlug.includes('nocni-pece')) return true;
      return false;
    });

    if (matched.length === 0) {
      return HUB_JUDGMENTS.slice(0, 2);
    }
    return matched;
  }, [category]);

  const filteredStudies = useMemo(() => {
    const catSlug = category.slug.toLowerCase();
    const catName = category.name.toLowerCase();

    const matched = HUB_STUDIES.filter(std => {
      if (std.tags.some(t => t.toLowerCase().includes(catSlug) || catName.includes(t.toLowerCase()))) return true;
      if (std.title.toLowerCase().includes(catName) || std.excerpt.toLowerCase().includes(catName)) return true;
      if (catSlug.includes('studii') || catSlug.includes('psychologie') || catSlug.includes('attachment') || catSlug.includes('nocni-pece')) return true;
      return false;
    });

    if (matched.length === 0) {
      return HUB_STUDIES.slice(0, 2);
    }
    return matched;
  }, [category]);

  const filteredTemplates = useMemo(() => {
    const catSlug = category.slug.toLowerCase();
    const catName = category.name.toLowerCase();

    const matched = HUB_TEMPLATES.filter(tpl => {
      if (tpl.title.toLowerCase().includes(catName) || tpl.desc.toLowerCase().includes(catName)) return true;
      if (catSlug.includes('vzory') || catSlug.includes('podani') || catSlug.includes('soud') || catSlug.includes('ospod')) return true;
      return false;
    });

    if (matched.length === 0) {
      return HUB_TEMPLATES.slice(0, 2);
    }
    return matched;
  }, [category]);

  const handleCopyTemplate = (template: HubTemplate) => {
    navigator.clipboard.writeText(template.defaultText);
    setCopiedTemplateId(template.id);
    setTimeout(() => setCopiedTemplateId(null), 2500);
  };

  const handleRunAiPrompt = (promptText: string) => {
    setSearchQuery(promptText);
    setActiveTab('ai-assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 animate-in fade-in duration-200">
      
      {/* 1. HERO CATEGORY HEADER */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden shadow-md">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-5 relative z-10">
          
          {/* Top Actions & Breadcrumb Trail */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 transition-all cursor-pointer font-bold shadow-3xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Zpět na hlavní přehled</span>
            </button>

            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>Odborný okruh</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-teal-300 font-bold">{category.name}</span>
            </div>
          </div>

          {/* Main Title Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-inner shrink-0">
                  {category.icon}
                </span>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    <span>Okruh #{category.slug}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight leading-tight mt-1">
                    {category.name}
                  </h1>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {category.description}
              </p>
            </div>

            {/* Quick Action Box */}
            <div className="shrink-0 flex flex-wrap md:flex-col gap-2.5 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/70 backdrop-blur-xs">
              <button
                onClick={() => handleRunAiPrompt(`Porad mi s tématem ${category.name} a jaké mám právní možnosti.`)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Položit dotaz AI Asistentovi</span>
              </button>

              <button
                onClick={() => {
                  const shareUrl = window.location.href;
                  if (navigator.share) {
                    navigator.share({ title: category.name, text: category.description, url: shareUrl });
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                    alert('Odkaz na téma byl zkopírován do schránky.');
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-600/60"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Sdílet okruh</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN CONTAINER & SUB-NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        
        {/* SUB-NAV TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Všechny podklady</span>
            <span className="px-1.5 py-0.2 bg-slate-700 text-white text-[9px] font-mono rounded-full">
              {filteredArticles.length + filteredStudies.length + filteredJudgments.length + filteredTemplates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('blueprint')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'blueprint'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
            <span>Obsahový plán & Pilíře</span>
          </button>

          <button
            onClick={() => setActiveSection('articles')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'articles'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-teal-500" />
            <span>Články ({filteredArticles.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('studies')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'studies'
                ? 'bg-indigo-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Vědecké studie ({filteredStudies.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('judgments')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'judgments'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-purple-500" />
            <span>Judikatura ({filteredJudgments.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('templates')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'templates'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FolderCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Vzory podání ({filteredTemplates.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('ai')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'ai'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Otázky ({blueprint.aiPrompts.length})</span>
          </button>
        </div>

        {/* 3. STRUCTURED BLUEPRINT SECTION */}
        {(activeSection === 'all' || activeSection === 'blueprint') && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6 shadow-3xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 tracking-wider">
                    Odborný plán a klíčový rámec
                  </span>
                  <h2 className="text-lg font-black text-slate-900 font-display">
                    Strategický přehled pro okruh: {category.name}
                  </h2>
                </div>
              </div>

              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold self-start sm:self-auto">
                ČR Právní řád & OSPOD praxe
              </span>
            </div>

            {/* Purpose */}
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-xs text-slate-800 leading-relaxed font-medium">
              <strong className="text-emerald-900 font-extrabold block mb-1 uppercase text-[10px] tracking-wider">Účel a cíl podporované oblasti:</strong>
              {blueprint.purpose}
            </div>

            {/* Key Blueprint Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {blueprint.keyPoints.map((point, pIdx) => (
                <div 
                  key={pIdx}
                  className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black font-mono bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        {pIdx + 1}
                      </span>
                      <h3 className="text-xs font-black text-slate-900 font-display">
                        {point.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {point.detail}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-bold border-t border-slate-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Metodika Táta má právo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. AI PROMPTS RECOMMENDATION CARDS */}
        {(activeSection === 'all' || activeSection === 'ai') && (
          <div className="bg-gradient-to-r from-amber-50/80 via-amber-50/40 to-indigo-50/60 p-5 rounded-3xl border border-amber-200/80 space-y-3.5 shadow-3xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900 font-display uppercase tracking-wider">
                  Doporučené AI Dotazy k tématice: {category.name}
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                Okamžitá analýza
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Klepněte na libovolný předpřipravený dotaz pro okamžité spuštění AI Právního asistenta s odbornou odpovědí k tomuto tématickému okruhu.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {blueprint.aiPrompts.map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunAiPrompt(promptText)}
                  className="flex flex-col justify-between p-3.5 bg-white hover:bg-amber-100/60 border border-amber-200 hover:border-amber-400 rounded-2xl text-left transition-all shadow-3xs cursor-pointer group"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md inline-block">
                      Prompt #{idx + 1}
                    </span>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-amber-950 leading-snug">
                      "{promptText}"
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-amber-700 mt-3 pt-2 border-t border-amber-100/80">
                    <span>Spustit dotaz</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. ARTICLES SECTION */}
        {(activeSection === 'all' || activeSection === 'articles') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-black text-slate-900 font-display">
                  Odborné články a průvodce ({filteredArticles.length})
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((art) => (
                <div 
                  key={art.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-teal-300 transition-all shadow-3xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md border border-teal-100">
                        {art.readTime || '5 min'} čtení
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Aktualizováno {art.lastUpdated}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 leading-snug hover:text-teal-700 transition-colors">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {art.tags.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="text-[9px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelectedArticle(art)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                    >
                      <span>Číst detail</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. JUDIKATURA SECTION */}
        {(activeSection === 'all' || activeSection === 'judgments') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-black text-slate-900 font-display">
                  Soudní judikatura a precedenty ({filteredJudgments.length})
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredJudgments.map((jud) => (
                <div 
                  key={jud.id}
                  className="bg-white p-5 rounded-3xl border border-purple-100 hover:border-purple-300 transition-all shadow-3xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-900 text-xs font-black font-mono rounded-xl">
                        {jud.fileNo}
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        {jud.court}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {jud.tags.map((tg, idx) => (
                        <span key={idx} className="text-[9px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {tg}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-base font-black text-slate-900">
                    {jud.title}
                  </h3>

                  <p className="text-xs font-medium text-slate-700 bg-purple-50/50 p-3 rounded-2xl border border-purple-100/60 leading-relaxed italic">
                    "{jud.excerpt}"
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => handleRunAiPrompt(`Vysvětli mi nález ${jud.fileNo} (${jud.title}) a jak ho mohu použít v mé věci.`)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Analýza judikátu AI</span>
                    </button>

                    <button
                      onClick={() => setSelectedJudgment(jud)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
                    >
                      <span>Zobrazit plný rozbor</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. SCIENTIFIC STUDIES SECTION */}
        {(activeSection === 'all' || activeSection === 'studies') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-black text-slate-900 font-display">
                  Vědecká rešerše a mezinárodní studie ({filteredStudies.length})
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudies.map((std) => (
                <div 
                  key={std.id}
                  className="bg-white p-5 rounded-3xl border border-indigo-100 hover:border-indigo-300 transition-all shadow-3xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-indigo-900 font-bold">
                      <span className="truncate max-w-[220px]">{std.authors}</span>
                      <span className="font-mono bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">Rok {std.year}</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {std.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {std.excerpt}
                    </p>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-teal-800 uppercase block">
                        Klíčový vědecký závěr:
                      </span>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        {std.conclusion}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {std.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] font-mono text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleRunAiPrompt(`Aké jsou hlavní závěry ze studie: ${std.title} (${std.authors}, ${std.year})?`)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Citovat studii</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. TEMPLATES SECTION */}
        {(activeSection === 'all' || activeSection === 'templates') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <FolderCheck className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900 font-display">
                  Doporučené vzory podání a návrhů ({filteredTemplates.length})
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((tpl) => (
                <div 
                  key={tpl.id}
                  className="bg-white p-5 rounded-3xl border border-blue-100 hover:border-blue-300 transition-all shadow-3xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-blue-900 px-2 py-0.5 rounded-md border border-blue-100">
                        {tpl.category === 'petitions' ? 'Návrh / Žaloba' : tpl.category === 'appeals' ? 'Vyjádření' : 'Stížnost'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Aktivní vzor
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {tpl.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {tpl.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyTemplate(tpl)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      {copiedTemplateId === tpl.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Zkopírováno</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Kopírovat text</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedTemplate(tpl)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-3xs transition-all cursor-pointer"
                    >
                      <FolderCheck className="w-3.5 h-3.5" />
                      <span>Otevřít vzor</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ARTICLE READER MODAL OVERLAY */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-mono font-bold text-teal-700 uppercase">Detail článku</span>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h2 className="text-xl font-black text-slate-900 leading-snug">
              {selectedArticle.title}
            </h2>

            <div className="text-xs text-slate-500 font-mono">
              Aktualizováno: {selectedArticle.lastUpdated}
            </div>

            <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {selectedArticle.content}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Zavřít článek
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JUDGMENT READER MODAL OVERLAY */}
      {selectedJudgment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-mono font-bold text-purple-700 uppercase">{selectedJudgment.court} | {selectedJudgment.fileNo}</span>
              <button 
                onClick={() => setSelectedJudgment(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h2 className="text-xl font-black text-slate-900">
              {selectedJudgment.title}
            </h2>

            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-xs font-semibold text-purple-900 italic">
              "{selectedJudgment.excerpt}"
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">Plný rozbor & Judikatorní věta:</span>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {selectedJudgment.fullAnalysis}
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  const query = `Analýza judikátu ${selectedJudgment.fileNo}: ${selectedJudgment.title}`;
                  setSelectedJudgment(null);
                  handleRunAiPrompt(query);
                }}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rozebrat v AI Asistentovi</span>
              </button>

              <button
                onClick={() => setSelectedJudgment(null)}
                className="px-4 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
              >
                Zavřít
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATE READER MODAL OVERLAY */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-mono font-bold text-blue-700 uppercase">Vzor právního podání</span>
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h2 className="text-lg font-black text-slate-900">
              {selectedTemplate.title}
            </h2>

            <p className="text-xs text-slate-600">
              {selectedTemplate.desc}
            </p>

            <div className="relative">
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto border border-slate-800">
                {selectedTemplate.defaultText}
              </pre>

              <button
                onClick={() => handleCopyTemplate(selectedTemplate)}
                className="absolute top-3 right-3 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedTemplateId === selectedTemplate.id ? 'Zkopírováno!' : 'Kopírovat'}</span>
              </button>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedTemplate(null);
                  setActiveTab('ke-stazeni');
                }}
                className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <FolderCheck className="w-3.5 h-3.5" />
                <span>Generovat v AI Generátoru</span>
              </button>

              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
              >
                Zavřít
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
