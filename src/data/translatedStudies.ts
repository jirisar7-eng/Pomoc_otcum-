/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslatedStudy {
  id: string;
  title: string;
  englishTitle: string;
  authors: string;
  journal: string;
  year: string;
  citation: string;
  abstract: string;
  introduction: string;
  methodology: string;
  keyFindings: string[];
  scientificDiscussion: string;
  policyImplications: string;
  conclusions: string;
  sections: {
    title: string;
    content: string;
  }[];
}

export const TRANSLATED_STUDIES: Record<'fabricius' | 'warshak', TranslatedStudy> = {
  fabricius: {
    id: 'fabricius',
    title: 'Měli by kojenci a batolata trávit častý čas přespáváním u otců? Debata o politice a nová data',
    englishTitle: 'Should Infants and Toddlers Have Frequent Overnight Parenting Time With Fathers? The Policy Debate and New Data',
    authors: 'William V. Fabricius, Go Woon Suh (Arizona State University)',
    journal: 'Psychology, Public Policy, and Law (American Psychological Association)',
    year: '2016 / 2017',
    citation: 'Psychology, Public Policy, and Law, Vol 23(1), Feb 2017, 68-84. DOI: 10.1037/law0000108',
    abstract: `Otázka, zda by děti odloučených rodičů ve věku do 2 let měly trávit časté noci (přespávat) u svých nerezidentních otců, byla předmětem mnoha debat, avšak s minimem empirických dat. Oproti některým předchozím tvrzením tato studie zjistila výrazné dlouhodobé přínosy pro oba rodičovské vztahy spojené s přespáváním u otce:
(a) až do a včetně rovnoměrného rozdělení nocí (50/50),
(b) pro dlouhodobou kvalitu vztahu dítěte s matkou i s otcem,
(c) jak u dětí, které přespávaly ve věku 2 let, tak u dětí mladších 1 roku.

Tyto benefity zůstaly stabilní i po statistickém očištění o pozdější rozsah péče otce v dětství a dospívání, vzdělání rodičů, míru konfliktu mezi rodiči do 5 let od rozchodu, pohlaví dítěte a jeho věk při rozchodu. Výsledky poskytují silnou podporu pro rodinnou politiku podporující časté přespávání nejmenších dětí u otců, neboť benefity se projevily jak u rodičů, kteří se na přespávání původně dohodli, tak u těch, kde byl režim nařízen soudem přes nesouhlas matky. Zjištěná fakta vyvracejí mýty o poškození vazby k matce a potvrzují, že zapojení otce do noční péče od nejranějšího věku rozvíjí jeho rodičovské kompetence a posiluje celoživotní psychické zdraví dítěte.`,
    introduction: `Debata o přespávání nejmenších dětí (infants and toddlers) u nerezidentních otců se rozhořela s plnou silou přibližně před 15 lety. Na jedné straně stála skupina psychologů zastávajících teorii monotropie (původně formulovanou Johnem Bowlbym), která tvrdí, že kojenec si musí nejprve vytvořit výhradní citovou vazbu (attachment) k jediné „primární“ osobě (zpravidla matce) a jakákoliv separace přes noc v raném věku riskuje závažné a trvalé poškození této primární vazby. Na základě této teorie někteří odborníci (např. Sroufe, McIntosh) doporučovali, aby přespávání dětí u otců před 18. měsícem věku bylo zcela výjimečné a střídavá péče se odkládala až na věk 6 až 8 let.

Na druhé straně stály výzkumy prokazující, že kojenci si běžně vytvářejí paralelní citové vazby k více pečovatelům najednou, pokud s nimi tráví dostatek času v různorodých situacích. Renomovaní odborníci na attachment (např. Everett Waters) upozornili, že sám Bowlby myšlenku monotropie v pozdní fázi své vědecké kariéry oslabil a že moderní věda nepodporuje rigidní hierarchii vztahů. Postponování (odkládání) noclehů u otce na pozdější věk navíc přináší obrovské riziko: dramaticky oslabuje odhodlání otců podílet se na výchově a často vede k jejich úplnému vymizení ze života dítěte.`,
    methodology: `Studie byla navržena tak, aby překonala zásadní nedostatky předchozího výzkumu, který sledoval pouze krátkodobé asociace a ignoroval dlouhodobé dopady. Výzkumníci rekrutovali 116 vysokoškolských studentů, jejichž rodiče se trvale rozešli předtím, než dítě dosáhlo věku 3 let. 

Sběr dat probíhal nezávisle:
1. Studenti (dnes mladí dospělí s průměrným věkem 19 let) retrospektivně hodnotili kvalitu svých současných vztahů k matce i otci pomocí pěti mezinárodně uznávaných a validovaných psychometrických škál.
2. Jejich rodiče (matky i otcové nezávisle) podrobně reportovali přesný počet nocí a denních návštěv v každém z prvních tří let života dítěte (do 1 roku, 1–2 roky, 2–3 roky).
3. Rodiče dále reportovali frekvenci vzájemných konfliktů před rozchodem a v období do 5 let po něm, úroveň svého vzdělání a míru shody/nesouhlasu ohledně uspořádání péče.

Statistická analýza využila vícenásobnou regresi a hierarchické modelování k očištění od rušivých faktorů, jako je konflikt rodičů, vzdělání, pohlaví dítěte a rozsah péče v pozdějším dětství (5–10 let a 10–15 let).`,
    keyFindings: [
      "Přímá úměra (Dose-Response Effect): Každá noc strávená u otce navíc v raném věku (do 1 roku i ve 2 letech) lineárně korelovala s vyšší kvalitou vztahu s otcem v dospělosti. Nejlepších výsledků bylo dosaženo při plně vyváženém přespávání (6 až 7 nocí ve 14denním cyklu u otce).",
      "Nulové poškození vztahu s matkou: Časté přespávání u otce v raném věku nemělo žádný negativní vliv na vztah dětí s jejich matkami v dospělosti. Naopak, přítomnost noclehů u otce předpovídala statisticky lepší a stabilnější vztahy s matkami (prahový efekt), což autoři vysvětlují tzv. 'respite effectem' – matky si mohly od náročné péče odpočinout, což zvýšilo jejich trpělivost a citlivost při následné péči.",
      "Účinnost i v konfliktu a při nesouhlasu: Pozitivní vliv přespávání se projevil zcela identicky u rodin s nízkým i extrémně vysokým konfliktem a rovněž v případech, kdy byl režim přespávání nařízen autoritativně soudem přes zásadní odpor matky.",
      "Nemožnost kompenzace: Ztracený čas přespávání v raném věku (do 3 let) nelze nijak dohnat ani kompenzovat zvýšenou péčí v pozdějším věku. Pokud dítě nespalo u otce v batolecím věku, deficit ve vztahu přetrval až do dospělosti bez ohledu na to, jak často se vídali později.",
      "Nulový přínos pouhých denních návštěv: Samotné denní návštěvy u otce (bez přespávání) nevykázaly žádnou statisticky významnou souvislost s kvalitou budoucího vztahu k otci. Společná noc a s ní spojené rituály (ukládání k spánku, noční probuzení, společné snídání) jsou pro budování vazby nenahraditelné."
    ],
    scientificDiscussion: `Výsledky této studie poskytují jasné vysvětlení, proč předchozí výzkumy (např. Solomon & George, 1999; Tornello et al., 2013) přicházely s rozporuplnými nebo negativními závěry. Tyto starší studie totiž měřily pouze krátkodobé adaptace dětí bezprostředně po rozchodu, kdy se u dětí mohla projevovat běžná, dočasná podrážděnost ze změny prostředí. Navíc používaly metodicky slabé nástroje, jako je Q-sort dotazník vyplňovaný samotnou matkou namísto nezávislých vyškolených pozorovatelů, což vedlo ke zkreslení dat v neprospěch otců.

Fabricius & Suh (2016) dokázali, že tyto krátkodobé výkyvy v chování nemají žádný trvalý vliv na psychický vývoj. Z dlouhodobého hlediska je pro dítě klíčové, aby mělo možnost prožívat s otcem běžný životní cyklus zahrnující noc. Během noční péče otec přebírá plnou zodpovědnost za konejšení, krmení, hygienu a ranní probouzení. Tím si osvojuje specifické rodičovské dovednosti, učí se jemně reagovat na signály dítěte a buduje si k němu hlubokou otcovskou identitu. Z pohledu dítěte noční přítomnost otce formuje hluboký pocit jistoty, že otec je spolehlivým, stálým a bezpečným přístavem, nikoliv jen víkendovým bavičem.`,
    policyImplications: `Tato studie má zásadní dopad na tvorbu rodinného práva a soudní praxi:
1. Vyvrací alibistické doporučení soudů a OSPODu začínat s minimem kontaktů bez přespávání a tyto „postupně navyšovat“. Tento přístup naopak rodící se vztah s otcem poškozuje. Přespávání by mělo být zavedeno ihned od rozchodu rodičů.
2. Vyvrací argumentaci vysokým konfliktem rodičů jako překážkou střídavé péče u malých dětí. Pokud soudy odmítají střídavou péči kvůli konfliktu, dávají tím jednomu z rodičů mocný nástroj, jak střídavou péči záměrně bojkotovat vyvoláváním konfliktů.
3. Poukazuje na to, že rodinná politika musí aktivně podporovat zapojení obou rodičů do noční péče od narození dítěte.`,
    conclusions: `„Naše data neposkytují žádnou podporu pro politiku odkládání nocování u otce. Naopak ukazují, že odepření přespávání u otce v kojeneckém a batolecím věku má za následek trvalé a nezvratné oslabení otcovského vztahu, které přetrvává až do dospělosti. V zájmu zdravého psychického vývoje dětí je nezbytné, aby soudy i rodiče podporovali časté a vyvážené přespávání u obou rodičů již od prvního roku života dítěte.“`,
    sections: [
      {
        title: "1. Úvod do problematiky a historická debata",
        content: "Historicky byla péče o nejmenší děti po rozchodu rodičů svěřována téměř výhradně matkám. Tato praxe se opírala o teorii monotropie Johna Bowlbyho, která předpokládala, že kojenec je schopen vytvořit si bezpečné citové pouto pouze k jedné osobě, obvykle matce. Jakékoliv přespávání u druhého rodiče bylo považováno za nebezpečné z důvodu separace od primární pečující osoby. V posledních patnácti letech však došlo k zásadnímu posunu ve výzkumu attachmentu. Moderní studie prokázaly, že děti si od narození vytvářejí citové vazby k oběma rodičům paralelně, pokud s nimi sdílejí každodenní rituály."
      },
      {
        title: "2. Metodologie, vzorek a statistické kontroly",
        content: "Výzkum pracoval se vzorkem 116 mladých dospělých (studentů vysoké školy), jejichž rodiče se rozvedli nebo rozešli před 3. rokem života dítěte. Sběr dat probíhal triangulační metodou – nezávisle odpovídali studenti, jejich matky i jejich otcové. Autoři podrobili data extrémně přísným statistickým kontrolám (hierarchická regrese). Kontroloval se vliv pozdějšího času stráveného s otcem (v dětství a dospívání), úroveň vzdělání rodičů, pohlaví dítěte, věk při rozchodu a míra rodičovského konfliktu do 5 let od rozpadu rodiny. Tím bylo zajištěno, že zjištěné benefity raného přespávání u otce jsou skutečně kauzálním faktorem a nikoliv pouze důsledkem přátelského vztahu rodičů."
      },
      {
        title: "3. Výsledky: Lineární vliv nocování na kvalitu vztahů v dospělosti",
        content: "Analýza prokázala silný efekt závislosti na dávce (dose-response effect). S každou nocí, kterou dítě v prvních dvou letech života strávilo u otce, se statisticky významně zvyšovala kvalita a hloubka vztahu k otci v mladé dospělosti. Tento efekt byl nejvýraznější u dětí, které u otce trávily polovinu času (6 až 7 nocí ze 14). Výsledky překvapivě ukázaly, že pouhé denní návštěvy (bez noclehů) neměly na budoucí kvalitu vztahu k otci vůbec žádný vliv. Noční péče je tedy z hlediska budování citové vazby kvalitativně odlišná a nenahraditelná."
      },
      {
        title: "4. Výsledky: Absence újmy na vztahu k matce a 'Respite Effect'",
        content: "Klíčovým argumentem odpůrců přespávání byla obava ze zničení vazby k matce. Výzkum Fabriciuse a Suha tuto obavu stoprocentně vyvrátil. Děti, které v raném dětství spaly u otce, vykazovaly v dospělosti stejně silné a bezpečné vazby k matkám jako děti, které spaly výhradně doma. Navíc byl u matek identifikován pozitivní prahový efekt (respite effect) – sdílení noční péče s otcem poskytlo matkám nezbytný čas na odpočinek a osobní regeneraci, což prokazatelně vedlo k tomu, že byly vůči dětem trpělivější, citlivější a méně trpěly rodičovským vyhořením."
      },
      {
        title: "5. Výsledky: Vliv konfliktu a nesouhlasu rodičů",
        content: "Studie zkoumala rodiny, kde rodiče spolupracovali, i ty, kde panovalo extrémní nepřátelství. Výsledky byly šokující pro opatrovnickou praxi: přínosy přespávání u otce v raném věku se projevily naprosto stejně u dětí ze spolupracujících rodin, tak u dětí, jejichž rodiče se drsně hádali, a dokonce i tam, kde bylo přespávání nařízeno soudem přes zuřivý nesouhlas matky. To znamená, že rodičovský konflikt ani jednostranné odmítání ze strany matky nejsou vědecky obhajitelným důvodem pro odepření noční péče otce."
      },
      {
        title: "6. Závěry a doporučení pro soudní rozhodování",
        content: "Autoři uzavírají, že odepření přespávání u otce v kojeneckém a batolecím věku má za následek trvalé a nezvratné oslabení otcovského vztahu, které nelze v pozdějším dětství dohnat. Soudy by měly opustit alibistický model 'postupného navyšování bez nocí' a naopak od samého počátku rozchodu rodičů nařizovat a podporovat střídavé přespávání nejmenších dětí u obou kompetentních rodičů jako výchozí standard nejlepšího zájmu dítěte."
      }
    ]
  },
  warshak: {
    id: 'warshak',
    title: 'Společenské vědy a plány péče o nejmenší děti: Konsenzuální zpráva',
    englishTitle: 'Social Science and Parenting Plans for Young Children: A Consensus Report',
    authors: 'Richard A. Warshak (University of Texas Southwestern Medical Center) a 110 mezinárodních signatářů',
    journal: 'Psychology, Public Policy, and Law (American Psychological Association)',
    year: '2014',
    citation: 'Psychology, Public Policy, and Law, Vol 20(1), Feb 2014, 46-67. DOI: 10.1037/law0000005',
    abstract: `Tato přelomová práce představuje oficiální konsenzuální stanovisko mezinárodní vědecké komunity k uspořádání péče o děti do 4 let věku. Zprávu podrobně prostudovalo, připomínkovalo a svými podpisy stvrdilo 110 předních světových vědců a klinických odborníků z oblasti raného dětského vývoje, psychiatrie, psychologie, sociální práce a rodinného práva.

Zpráva se zabývá dvěma ústředními otázkami:
1) Zda by čas nejmenších dětí měl být tráven převážně v péči jednoho rodiče, nebo rozdělen rovnoměrněji mezi oba rodiče.
2) Zda by děti mladší 4 let měly spát každou noc ve stejném domě, nebo trávit noci (přespávat) v domovech obou rodičů.

Široký mezinárodní vědecký konsenzus se shoduje, že za normálních okolností empirická data jednoznačně podporují střídavé uspořádání péče a pravidelné přespávání u obou rodičů u dětí do 4 let věku. Deprivování malých dětí o přespávání u otců vážně ohrožuje rozvoj a stabilitu otcovského vztahu, zvyšuje riziko úplného vymizení otce z výchovy a nepřináší dítěti žádné prokazatelné výhody. Neexistují vědecké důkazy pro odkládání noclehů u otce na pozdější věk a praktické i teoretické přínosy raného přespávání výrazně převyšují hypotetické obavy o narušení stability.`,
    introduction: `Opatrovnická řízení o nejmenších dětech bývají emočně nejvypjatější. Soudci, opatrovníci (OSPOD) a mediátoři v rodinném právu zoufale hledají jasné vědecké vodítko, jak nastavit plány péče. Bohužel, cesta od vědeckých laboratoří k legislativě a soudním síním je plná rizik, zkreslení a manipulací ze strany obhájců jednostranné mateřské péče. Ti často zneužívají izolovaná nebo metodicky chybná data k prosazování své ideologické agendy, která má za cíl vyloučit otce z péče o kojence a batolata.

Tento dokument vznikl s cílem zastavit vlnu dezinformací a poskytnout opatrovnickému systému – zákonodárcům, soudcům, mediátorům, kolizním opatrovníkům a terapeutům – ucelený, objektivní a mezinárodně schválený přehled výzkumu o plánech péče pro děti do 4 let, jejichž rodiče žijí odděleně. Dokument je podložen autoritou 110 špičkových světových expertů, kteří tvoří absolutní špičku v oboru dětského vývoje.`,
    methodology: `Zpráva představuje komplexní meta-analýzu a kritické zhodnocení veškeré dostupné vědecké literatury k tématu rané péče a attachmentu u dětí do 4 let, publikované do roku 2014. Richard A. Warshak vypracoval detailní návrh, který následně prošel rigorózním recenzním a připomínkovým řízením ze strany 110 mezinárodních odborníků (seznam signatářů je uveden v oficiální příloze zprávy a zahrnuje přednosty univerzitních kateder, editory odborných časopisů a lídry profesních asociací).

Zpráva podrobila detailnímu zkoumání 16 klíčových empirických studií porovnávajících děti vychovávané v uspořádáních s jedním dominantním pečovatelem (nad 65% času u jednoho rodiče) versus ve střídavé péči (podíl času mezi 35% až 50% pro každého). Hodnoceny byly metodické kvality výzkumů, reprezentativnost vzorků, validita měření a replikovatelnost výsledků. Zvláštní pozornost byla věnována vyvrácení zkreslení, kterých se dopustily některé 'outsiderské' studie odmítající přespávání u otců (např. McIntosh et al., 2010; Tornello et al., 2013).`,
    keyFindings: [
      "Zastaralost teorie monotropie: Představa, že dítě podléhá hierarchickému uspořádání s jedním jediným psychologickým rodičem (matkou), je vědecky neudržitelná. Kojenci a batolata si zcela přirozeně vytvářejí paralelní, nezávislé a stejně bezpečné citové vazby k matce i k otci.",
      "Střídavá péče jako výchozí norma: Vědecká data plně podporují střídavou péči (podíl času v rozmezí 35% až 50% pro každého rodiče) jako nejlepší výchozí standard pro děti všech věkových kategorií, včetně dětí do 4 let, pokud jsou oba rodiče kompetentní a schopeni péče.",
      "Nulový vědecký základ pro odkládání noclehů: Neexistuje absolutně žádný vědecký důkaz, který by obhajoval odložení pravidelného přespávání u otce na pozdější věk (např. po 3. či 5. roce). Teoretické a praktické přínosy raného přespávání pro rozvoj otcovského pouta jsou drtivě silnější než spekulativní obavy.",
      "Vulnerability father-child bond: Otcovský vztah k dítěti po rozchodu rodičů je extrémně zranitelný. Omezení kontaktu s otcem na pouhé hodiny během dne bez přespávání prokazatelně vede k postupnému odcizení a dramaticky zvyšuje riziko, že otec z výchovy dítěte časem zcela vypadne.",
      "Logistické a psychologické přínosy přespávání: Přespávání u otce odstraňuje stresující transfery dětí. Dvouhodinová návštěva během dne znamená pro malé dítě dva přesuny za den (stres z loučení a adaptace). Přespávání snižuje počet transferů na minimum a dává otci možnost prožívat s dítětem uklidňující večerní a ranní rituály, což posiluje pocit rodinné stability."
    ],
    scientificDiscussion: `Zpráva detailně rozebírá a metodicky diskredituje závěry studií, které odpůrci střídavé péče často citují k podpoře plošných zákazů přespávání u otců (zejména McIntosh, Smyth & Kelaher, 2010 a Tornello et al., 2013). 

Warshak a jeho 110 spolupodepsaných kolegů upozorňují na fatální metodická pochybení těchto studií:
- Studie McIntoshové (2010) pracovala s extrémně malým vzorkem kojenců, kteří skutečně zažívali střídavou péči (pouhých 11 dětí!), z čehož autorka vyvodila dalekosáhlé závěry pro celou populaci. Navíc použila nespolehlivou škálu 'vizuálního monitorování matky' (převzatou z testů řečové připravenosti) a paradoxně interpretovala zdravý zájem kojence o matku jako projev 'úzkosti a separace'.
- Studie Tornelloové (2013) zkoumala vzorek z projektu 'Fragile Families' (Křehké rodiny), který byl složen z 85 % z nesezdaných párů žijících pod hranicí chudoby v amerických ghettech, s obrovským výskytem zneužívání návykových látek, domácího násilí, a u poloviny rodin byl otec ve vězení. Závěry z takto patologického vzorku nelze nijak zobecňovat na běžné rozvádějící se rodiny.

Warshak zdůrazňuje, že zdravý vývoj dítěte závisí na kvalitě interakcí, nikoliv na fyzickém čase stráveném výhradně s matkou. Celodenní přítomnost matky není pro normální vývoj nutná, což dokazují desítky let výzkumů vlivu dětských jeslí a školek. Pokud dítě snese 40 hodin týdně v jeslích s cizími pečovatelkami bez jakékoliv újmy, je absurdní tvrdit, že by mu ublížil nocleh u vlastního milujícího otce.`,
    policyImplications: `Doporučení pro rodinnou politiku a zákonodárství:
1. Střídavá péče by měla být legislativně zakotvena jako primární právní domněnka (presumpce) u dětí všech věkových kategorií.
2. Soudy by měly aktivně odmítat pokusy matek využívat nízký věk kojence či batolete jako zástupný důvod k zablokování otcova podílu na péči a nocování.
3. Plány péče musí být šity na míru rodině, avšak s jasným cílem maximalizovat a chránit noční i denní čas dítěte s oběma rodiči. Režimy s méně než 6 dny v měsíci u jednoho rodiče prokazatelně rodící se vazbu devastují.`,
    conclusions: `„Společenskovědní výzkum vývoje dětí jednoznačně podporuje závěr, že pro kojence a batolata je nejlepším zájmem sdílená péče obou rodičů, včetně pravidelného přespávání u otce. Neexistuje žádné vědecké opodstatnění pro odkládání noclehů na pozdější věk. Zákonodárci a soudci by měli tyto poznatky brát jako základní stavební kámen moderního rodinného práva a chránit právo nejmenších dětí na plnohodnotný vztah s oběma rodiči.“`,
    sections: [
      {
        title: "1. Východiska zprávy a mezinárodní konsenzus",
        content: "Cílem této zprávy bylo poskytnout opatrovnickým soudům, mediátorům a sociálním pracovníkům objektivní přehled vědeckých poznatků o plánech péče pro děti do 4 let. Práce vznikla jako reakce na šíření dezinformací a zkreslených interpretací výzkumů ze strany odpůrců střídavé péče. Text podrobně připomínkovalo a svými podpisy podpořilo 110 předních světových vědců a klinických specialistů na dětský vývoj z celého světa, což zprávě dává status absolutního vědeckého standardu."
      },
      {
        title: "2. Vyvrácení teorie monotropie",
        content: "Opatrovnická praxe často vychází z dogmatu, že malé dítě má mít pouze jednoho 'primárního psychologického rodiče' (obvykle matku) a vztah s otcem je druhořadý. Tato představa (tzv. monotropie) byla moderní vědou zcela opuštěna. Výzkumy citových vazeb (attachmentu) prokázaly, že kojenci si běžně vytvářejí paralelní citová pouta k oběma rodičům současně. Kvalita těchto vazeb je nezávislá a oba rodiče přispívají k vývoji dítěte unikátním a nenahraditelným způsobem."
      },
      {
        title: "3. Výzkum o dopadech přespávání (Overnights)",
        content: "Zpráva detailně zhodnotila veškerou dostupnou literaturu k přespávání dětí u otců. Výsledky 16 identifikovaných studií shodně ukazují, že pravidelné přespávání u otce od nejranějšího věku přináší dětem významné benefity. Zajišťuje kontinuitu otcovské péče, zabraňuje jeho postupnému vyřazení z výchovy a dává otci prostor pro budování rodičovské identity skrze večerní a ranní pečující rituály. Žádný z výzkumů neprokázal, že by přespávání samo o sobě dětem škodilo."
      },
      {
        title: "4. Metodická diskreditace odmítavých studií",
        content: "Zpráva podrobila zdrcující vědecké kritice dvě studie, které jsou často zneužívány k omezování práv otců: studii McIntoshové (2010) a studii Tornelloové (2013). Warshak prokázal, že obě tyto práce trpí fatálními metodickými nedostatky – od zanedbatelného vzorku (pouhých 11 dětí ve střídavé péči u McIntoshové) přes zneužití nespolehlivých měřících škál až po zobecňování dat z patologického prostředí chudinských ghett na běžnou populaci. Tyto práce proto nemohou sloužit jako věrohodný základ pro rozhodování soudů."
      },
      {
        title: "5. Význam noční péče pro otcovskou identitu",
        content: "Nocování u otce má hluboký psychologický význam pro obě strany. Společný spánek, večerní pohádka, konejšení při nočním buzení a společné snídání vytvářejí kompletní rodičovský cyklus. Omezení styku na pouhé denní návštěvy degraduje otce na roli 'strýčka na hraní' a neumožňuje mu rozvinout skutečné rodičovské kompetence. Přespávání navíc logisticky ulevuje dítěti, které nemusí absolvovat neustálé stresující transporty tam a zpět během jednoho dne."
      },
      {
        title: "6. Doporučení pro opatrovnickou politiku",
        content: "Konsenzus 110 vědců doporučuje, aby střídavá péče s vyváženým přespáváním u obou rodičů byla standardním výchozím uspořádáním pro děti všech věkových kategorií, včetně dětí do 4 let. Rodičovský konflikt by neměl být zneužíván k vyloučení otce z výchovy, neboť to motivuje nespolupracující rodiče k umělému udržování sporu. Pouze závažné deficity (násilí, zneužívání, těžké zanedbávání) by měly vést k omezení péče jednoho z rodičů."
      }
    ]
  }
};
