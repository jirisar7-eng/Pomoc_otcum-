/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DictionaryCategory = 
  | 'process' 
  | 'subjects' 
  | 'custody' 
  | 'psychology' 
  | 'finance' 
  | 'technical';

export interface DictionaryTerm {
  id: string; // unique lowercase key
  term: string; // original English, Latin, or Czech term name
  czechTranslation: string; // Czech equivalent or subtitle
  shortDefinition: string; // A one-sentence definition
  definition: string; // Detailed description of the term
  importanceInCourt: string; // Practical importance in custody disputes (Jak to uplatnit u soudu)
  context: string; // Example context / studies / legal references
  category: DictionaryCategory;
}

export const DICTIONARY_TERMS: Record<string, DictionaryTerm> = {
  // ==========================================
  // 1. PROCESNÍ A PRÁVNÍ ZÁKLADY ŘÍZENÍ (1-20)
  // ==========================================
  "adhezni-rizeni": {
    id: "adhezni-rizeni",
    term: "1. Adhezní řízení",
    czechTranslation: "Současné projednání více rodinných věcí v jednom procesu",
    shortDefinition: "Řízení, ve kterém se v rámci jednoho soudního procesu řeší více souvisejících věcí (např. rozvod manželství a úprava poměrů k nezletilým dětem).",
    definition: "Adhezní řízení spojuje dvě či více souvisejících řízení do jednoho společného projednání. V rodinném právu se jedná o situaci, kdy se současně s rozvodovým řízením projednává úprava péče a výživného o děti. Dle české právní úpravy však musí být úprava poměrů k dětem schválena či rozhodnuta před samotným rozvodem manželství.",
    importanceInCourt: "Pro otce je klíčové pohlídat, aby dohoda či návrh na péči (např. střídavou péči) nebyl opomíjen nebo odkládán ve prospěch rychlého rozvodu. Úprava poměrů má zákonnou přednost a musí odrážet reálný zájem dětí.",
    context: "§ 755 a násl. zákona č. 89/2012 Sb., občanský zákoník (OZ); § 383 a násl. z.č. 292/2013 Sb. (ZŘS).",
    category: "process"
  },
  "rozsudek": {
    id: "rozsudek",
    term: "2. Rozsudek",
    czechTranslation: "Rozhodnutí soudu ve věci samé",
    shortDefinition: "Vynesené konečné rozhodnutí soudu ve věci samé, které je po nabytí právní moci autoritativně závazné a vykonatelné.",
    definition: "Rozsudek je nejvýznamnější forma soudního rozhodnutí, kterým soud autoritativně rozhoduje o péči, výživném, styku s dítětem či rozvodu manželství. Obsahuje záhlaví, výrokovou část (výrok), podrobné odůvodnění a poučení o možnosti podání odvolání.",
    importanceInCourt: "Otec musí po doručení rozsudku pečlivě zkontrolovat výrokovou část i odůvodnění. Pokud rozsudek neodpovídá provedenému dokazování nebo porušuje práva otce na střídavou péči, je nutné podat ve 15denní lhůtě odvolání ke krajskému soudu.",
    context: "§ 152 a násl. občanského soudního řádu (OSŘ); judikatura Ústavního soudu k náležitostem odůvodnění soudních rozhodnutí.",
    category: "process"
  },
  "predbezne-opatreni": {
    id: "predbezne-opatreni",
    term: "3. Předběžné opatření",
    czechTranslation: "Zrychlené dočasné rozhodnutí soudu (do 7 dnů)",
    shortDefinition: "Zrychlený institut soudu s povinností rozhodnout do 7 dnů k dočasné úpravě poměrů dětí v akutních a krizových situacích.",
    definition: "Předběžné opatření dle § 452 ZŘS nebo § 76 odst. 1 písm. b) OSŘ slouží k okamžitému zajištění péče a styku, pokud je dítě v ohrožení, nebo pokud jeden z rodičů jednostranně odřízl druhého rodiče od kontaktů s dítětem a vytváří tím škodlivý stav.",
    importanceInCourt: "Klíčová záchranná brzda pro otce, kterému matka brání v přítomnosti u dítěte po rozchodu. Dobře odůvodněný návrh na předběžné opatření s důkazy o dosavadní péči otce zamezí vytvoření nevratného 'statu quo' na straně matky.",
    context: "§ 76 odst. 1 písm. b) OSŘ; § 452 a násl. zákona o zvláštních řízeních soudních (ZŘS); judikáty Ústavního soudu k rychlé ochraně rodičovských práv.",
    category: "process"
  },
  "usneseni": {
    id: "usneseni",
    term: "4. Usnesení",
    czechTranslation: "Rozhodnutí soudu o procesních otázkách",
    shortDefinition: "Rozhodnutí soudu o procesních otázkách (např. o zamítnutí či ustanovení znalce, opatrovníka, odročení či předběžném opatření).",
    definition: "Usnesením soud rozhoduje o procesním průběhu řízení, o ustanovení znalce či opatrovníka OSPOD, o schválení rodičovského smíru či o návrzích na předběžné opatření. Na rozdíl od rozsudku řeší organizaci řízení nebo dílčí procesní kroky.",
    importanceInCourt: "Proti vybraným usnesením (např. zamítnutí předběžného opatření nebo uložení pokuty) se lze odvolat. Otec musí sledovat zákonné lhůty pro odvolání (zpravidla 15 dnů od doručení).",
    context: "§ 167 a násl. občanského soudního řádu (OSŘ).",
    category: "process"
  },
  "pravni-moc": {
    id: "pravni-moc",
    term: "5. Právní moc",
    czechTranslation: "Konečnost a nezměnitelnost rozhodnutí",
    shortDefinition: "Stav, kdy je rozhodnutí soudu konečné, nelze proti němu podat řádný opravný prostředek a je závazné pro účastníky i orgány.",
    definition: "Rozhodnutí nabývá právní moci uplynutím lhůty k podání odvolání (pokud odvolání nebylo podáno) nebo doručením rozhodnutí odvolacího soudu (krajského soudu). Od tohoto momentu vznikají účastníkům oficiální právní povinnosti a práva.",
    importanceInCourt: "Po nabytí právní moci rozsudku o péči se uspořádání stává právně závazným. Pokud matka nerespektuje pravomocný rozsudek, zakládá to možnost podání návrhu na výkon rozhodnutí (exekuci styku) a uložení sankčních pokut.",
    context: "§ 159 a § 160 občanského soudního řádu (OSŘ).",
    category: "process"
  },
  "vykonatelnost": {
    id: "vykonatelnost",
    term: "6. Vykonatelnost",
    czechTranslation: "Možnost vynutit plnění povinnosti",
    shortDefinition: "Vlastnost soudního rozhodnutí, na jejíž základě lze právně nařídit výkon rozhodnutí (pokuty, exekuce či asistovaný styk).",
    definition: "Vykonatelnost nastává buď současně s právní mocí, nebo uplynutím paritní lhůty k plnění. U předběžných opatření je usnesení vykonatelné okamžitě doručením nebo vyhlášením, i když ještě nenabylo právní moci.",
    importanceInCourt: "U předběžných opatření určujících styk s otcem je rozhodnutí vykonatelné ihned. Matka je povinna dítě k otci předat bez ohledu na to, zda proti předběžnému opatření podala odvolání.",
    context: "§ 161 OSŘ; § 495 a § 500 ZŘS (výkon rozhodnutí v péči o nezletilé).",
    category: "process"
  },
  "radny-opravny-prostredek": {
    id: "radny-opravny-prostredek",
    term: "7. Řádný opravný prostředek - Odvolání",
    czechTranslation: "Odvolání proti nepravomocnému rozsudku",
    shortDefinition: "Odvolání podané proti nepravomocnému rozhodnutí soudu prvního stupně u nadřízeného krajského soudu.",
    definition: "Odvolání je procesní nástroj, kterým účastník napadá rozsudek nebo usnesení okresního soudu. Podává se do 15 dnů od doručení písemného vyhotovení rozhodnutí u soudu, který rozhodnutí vydal, a rozhoduje o něm Krajský soud.",
    importanceInCourt: "Pokud okresní soud nezohlednil důkazy otce, ignoroval vědecké studie o střídavé péči nebo stranil matce, odvolání je šancí dosáhnout nápravy u Krajského soudu. Přezkumný odvolací senát často napravuje předsudky prvostupňových soudců.",
    context: "§ 201 a násl. občanského soudního řádu (OSŘ).",
    category: "process"
  },
  "mimoradny-opravny-prostredek": {
    id: "mimoradny-opravny-prostredek",
    term: "8. Mimořádný opravný prostředek - Dovolání",
    czechTranslation: "Dovolání k Nejvyššímu soudu či Ústavní stížnost",
    shortDefinition: "Právní nástroje (dovolání, žaloba na obnovu řízení, ústavní stížnost) směřující proti již pravomocným rozhodnutím.",
    definition: "Mimořádné opravné prostředky slouží k nápravě závažných právních pochybení. Dovolání se podává k Nejvyššímu soudu ČR (do 2 měsíců) při řešení zásadní právní otázky (§ 237 OSŘ), Ústavní stížnost k Ústavnímu soudu ČR (do 2 měsíců) při porušení základních lidských práv.",
    importanceInCourt: "Mnoho zásadních průlomů v oblasti střídavé péče a práv otců vzniklo právě na základě ústavních stížností podaných otci, kterým obecné soudy svévolně odepřely rovnocennou péči.",
    context: "§ 237 a násl. OSŘ (Dovolání); zákon č. 182/1993 Sb., o Ústavním soudu.",
    category: "process"
  },
  "datova-schranka": {
    id: "datova-schranka",
    term: "9. Doručování do datové schránky",
    czechTranslation: "Oficiální elektronické doručování soudních písemností",
    shortDefinition: "Oficiální elektronická forma doručování úředních a soudních písemností, která má přednost před listovní poštou.",
    definition: "Pokud má otec zřízenou datovou schránku fyzické osoby, soudy a úřady (OSPOD) jsou povinny mu doručovat veškeré písemnosti elektronicky. Písemnost je doručena okamžikem přihlášení do datové schránky, nejpozději však 10. dnem od vložení (tzv. fikce doručení).",
    importanceInCourt: "Datová schránka zajišťuje otci okamžitý přehled o soudním spisu, šetří čas a garantuje, že nepromešká 15denní odvolací lhůty z důvodu zatoulané pošty.",
    context: "Zákon č. 300/2008 Sb., o elektronických úkonech a autorizované konverzi dokumentů.",
    category: "process"
  },
  "protokol-o-jednani": {
    id: "protokol-o-jednani",
    term: "10. Protokol o jednání",
    czechTranslation: "Oficiální úřední záznam o průběhu soudního jednání",
    shortDefinition: "Oficiální úřední záznam o tom, co se přesně odehrálo u soudního jednání, jak vypovídali svědci a co přednesli účastníci.",
    definition: "Protokol zapisuje zapisovatelka na pokyn soudce. Obsahuje výpovědi otce, matky, OSPOD, znalců i svědků, jakož i procesní návrhy a rozhodnutí vyhlášená při jednání v soudní síni.",
    importanceInCourt: "Otec musí po skončení jednání (nebo nahlédnutím do spisu) protokol pečlivě přečíst. Pokud zapisovatelka opomněla klíčové výpovědi nebo je překroutila v neprospěch otce, otec má právo podat do 3 dnů námitky proti protokolu.",
    context: "§ 40 a násl. občanského soudního řádu (OSŘ).",
    category: "process"
  },
  "mistni-prislusnost": {
    id: "mistni-prislusnost",
    term: "11. Místní příslušnost soudu",
    czechTranslation: "Určení okresního soudu podle obvyklého bydliště dítěte",
    shortDefinition: "Pravidlo určující, který konkrétní okresní soud je oprávněný a povinný projednat opatrovnickou věc dítěte.",
    definition: "Místní příslušnost opatrovnického soudu se řídí obvodem, v němž má nezletilé dítě na základě dohody rodičů nebo rozhodnutí soudu své obvyklé bydliště. Jednostranné odstěhování dítěte matkou bez souhlasu otce zakládá protiprávní stav a nemění původní místní příslušnost soudu.",
    importanceInCourt: "Pokud matka odveze dítě na druhý konec republiky, otec musí okamžitě namítnout místní nepříslušnost nového soudu a žádat vrácení věci původnímu soudu v místě obvyklého bydliště.",
    context: "§ 464 zákona č. 292/2013 Sb. (ZŘS); § 88 občanského soudního řádu (OSŘ).",
    category: "process"
  },
  "vecna-prislusnost": {
    id: "vecna-prislusnost",
    term: "12. Věcná příslušnost soudu",
    czechTranslation: "Určení stupně soudu rozhodujícího v první instanci",
    shortDefinition: "Rozřazení soudní agendy určující, který stupeň soudu (okresní vs. krajský) projednává věc v prvním stupni.",
    definition: "V opatrovnických věcech péče o nezletilé děti jsou v prvním stupni vždy věcně příslušné okresní soudy (v Praze obvodní soudy, v Brně Městský soud v Brně). Krajské soudy působí jako odvolací soudy druhého stupně.",
    importanceInCourt: "Návrh na úpravu péče, výživného či předběžného opatření podává otec vždy k okresnímu soudu. Podání ke krajskému soudu v 1. stupni by vedlo k odmítnutí pro věcnou nepříslušnost.",
    context: "§ 9 zákona č. 6/2002 Sb., o soudech a soudcích; § 9 občanského soudního řádu (OSŘ).",
    category: "process"
  },
  "nezavislost-soudce": {
    id: "nezavislost-soudce",
    term: "13. Nezávislost a nestrannost soudce",
    czechTranslation: "Ústavní garance spravedlivého procesu bez podjatosti",
    shortDefinition: "Základní ústavní princip, podle kterého jsou soudci při rozhodování vázáni pouze zákonem a jsou zcela nezávislí na jakýchkoliv tlacích či předsudcích.",
    definition: "Nezávislost a nestrannost soudce garantuje, že opatrovnický soudce přistupuje k oběma rodičům bez genderových či osobních předsudků. Pokud má soudce osobní poměr k věci, účastníkům nebo jejich zástupcům, je vyloučen z projednávání věci (podjatost).",
    importanceInCourt: "Pokud soudce projevuje otevřené předsudky vůči otcům nebo udržuje neformální vztahy s právním zástupcem matky, otec má právo uplatnit námitku podjatosti dle § 14 OSŘ.",
    context: "Čl. 82 Ústavy ČR; Čl. 36 Listiny základních práv a svobod; § 14 až § 16 OSŘ.",
    category: "process"
  },
  "dokazovani": {
    id: "dokazovani",
    term: "14. Dokazování",
    czechTranslation: "Proces zjišťování skutkového stavu věci soudem",
    shortDefinition: "Zákonem stanovený postup, při kterém soud provádí navržené důkazy k ověření pravdivosti tvrzení účastníků.",
    definition: "V dokazování soud provádí výslechy účastníků, svědků, zprávy OSPODu, škol a lékařů, znalecké posudky a listinné důkazy. V opatrovnickém řízení soud hodnotí důkazy podle své volné úvahy, avšak důkazy nesmí opomenout.",
    importanceInCourt: "Otec musí každé své tvrzení (např. o plné schopnosti pečovat, o maření styku matkou) doložit konkrétním důkazem (fotografie, komunikace, výpověď svědků, záznamy). Sám slib nebo tvrzení bez důkazu nestačí.",
    context: "§ 120 a násl. OSŘ; § 20 ZŘS; § 132 OSŘ (volné hodnocení důkazů).",
    category: "process"
  },
  "bremeno-tvrzeni-a-dukazni": {
    id: "bremeno-tvrzeni-a-dukazni",
    term: "15. Břemeno tvrzení a břemeno důkazní",
    czechTranslation: "Povinnost uvádět rozhodná fakta a navrhovat k nim důkazy",
    shortDefinition: "Procesní povinnost účastníka uvést všechna fakta důležitá pro rozhodnutí a navrhnout důkazy k jejich prokázání.",
    definition: "Pokud otec tvrdí, že matka maří kontakt s dítětem nebo že otec disponuje skvělými podmínkami pro střídavou péči, nese břemeno tvrzení (musí to do návrhu napsat) a břemeno důkazní (musí označit důkazy). Pokud důkazy nenavrhne, vystavuje se riziku neúspěchu ve věci.",
    importanceInCourt: "Nestačí pasivně čekat na OSPOD. Otec musí aktivně formulovat tvrzení a předkládat důkazní návrhy již v prvním písemném podání.",
    context: "§ 101 odst. 1 a § 120 odst. 1 občanského soudního řádu (OSŘ).",
    category: "process"
  },
  "zasada-projednaci-vysetrovaci": {
    id: "zasada-projednaci-vysetrovaci",
    term: "16. Zásada projednací vs. vyšetřovací",
    czechTranslation: "Povinnost soudu zjišťovat zájem dítěte i nad rámec návrhů rodičů",
    shortDefinition: "Princip v opatrovnickém řízení (§ 20 ZŘS), podle kterého je soud povinen zjistit skutečný stav věci a provést i jiné důkazy než navržené účastníky.",
    definition: "Na rozdíl od sporného řízení (kde platí čistá zásada projednací) platí v opatrovnických věcech dětí vyšetřovací zásada. Soud není vázán pouze návrhy rodičů a musí sám aktivně vyhledávat důkazy, které jsou nezbytné pro ochranu nejlepšího zájmu dítěte.",
    importanceInCourt: "Pokud otec opomene navrhnout klíčový důkaz nebo OSPOD selže, otec se může odvolat na vyšetřovací zásadu a žádat, aby soud z úřední povinnosti opatřil zprávy psychologa či školy.",
    context: "§ 20 odst. 1 ZŘS; nález Ústavního soudu II. ÚS 1918/16.",
    category: "process"
  },
  "soudni-poplatek": {
    id: "soudni-poplatek",
    term: "17. Soudní poplatek",
    czechTranslation: "Osvobození opatrovnických řízení od soudních poplatků",
    shortDefinition: "Zákonný poplatek za zahájení soudního řízení, od kterého jsou věci péče o nezletilé děti ze zákona osvobozeny.",
    definition: "Řízení o úpravě poměrů k nezletilým dětem (péče, výživné, styk, určení otcovství) jsou osvobozena od soudních poplatků. Návrh na zahájení řízení o péči o dítě tudíž otec podává bez jakéhokoliv kolku či poplatku.",
    importanceInCourt: "Otec se nemusí obávat finančních poplatků státu při podání návrhu na střídavou péči nebo předběžné opatření k péči o dítě.",
    context: "§ 11 odst. 1 písm. a) zákona č. 549/1991 Sb., o soudních poplatcích.",
    category: "process"
  },
  "nahrada-nakladu-rizeni": {
    id: "nahrada-nakladu-rizeni",
    term: "18. Náhrada nákladů řízení",
    czechTranslation: "Pravidla pro hrazení nákladů advokáta a znalců v opatrovnických věcech",
    shortDefinition: "Úprava přiznávání nákladů řízení, kde v opatrovnickém řízení platí zásada, že žádný z účastníků nemá právo na náhradu nákladů, pokud soud nerozhodne jinak.",
    definition: "Dle § 23 ZŘS v opatrovnických věcech dětí zpravidla žádný z účastníků nemá právo na náhradu nákladů řízení (každý rodič si platí svého advokáta). Soud však může výjimečně přiznat náhradu nákladů, pokud to vyžadují okolnosti případu (např. při šikanózních či svévolných návrzích jednoho rodiče).",
    importanceInCourt: "Pokud matka podává opakované smyšlené návrhy nebo maří řízení, otec navrhuje, aby jí soud uložil povinnost uhradit otci náklady zastoupení advokátem.",
    context: "§ 23 zákona č. 292/2013 Sb. (ZŘS); § 142 a § 150 občanského soudního řádu (OSŘ).",
    category: "process"
  },
  "ex-offo": {
    id: "ex-offo",
    term: "19. Ex offo - Z úřední povinnosti",
    czechTranslation: "Postup a konání soudu z vlastní úřední povinnosti",
    shortDefinition: "Procesní postup soudu, kdy koná z úřední povinnosti bez nutnosti formálního návrhu účastníků.",
    definition: "Opatrovnické řízení o děti je řízením nesporným, které může soud zahájit i bez návrhu (ex offo) na základě podnětu OSPODu, školy, lékaře nebo jakéhokoliv občana, pokud je dítě v ohrožení nebo je nutné upravit jeho poměry.",
    importanceInCourt: "Pokud otec ještě nestihl podat formální žalobu, ale doručí soudu podnět k zahájení řízení z důvodu bránění ve styku, soud může řízení zahájit z úřední povinnosti.",
    context: "§ 13 a § 15 zákona o zvláštních řízeních soudních (ZŘS).",
    category: "process"
  },
  "promlceni-prekluze": {
    id: "promlceni-prekluze",
    term: "20. Promlčení a prekluze v rodinném právu",
    czechTranslation: "Trvalost a nepromlčitelnost rodičovských práv a výživného",
    shortDefinition: "Právní principy určující časové omezení uplatnění práv, přičemž rodičovská rights a právo na výživné se nepromlčují.",
    definition: "Právo na péči o dítě, rodičovská odpovědnost a právo na výživné se nepromlčují (§ 613 OZ). Promlčují se pouze jednotlivá sprofanovaná plnění dlužného výživného (v 3leté promlčecí lhůtě). Právo žádat střídavou péči trvá po celou dobu nezletilosti dítěte.",
    importanceInCourt: "Matka nemůže tvrdit, že otec 'ztratil právo' na střídavou péči, protože ji nepožadoval před rokem. Otec může návrh na střídavou péči podat kdykoliv při změně poměrů.",
    context: "§ 610, § 613 a § 921 občanského zákoníku (OZ).",
    category: "process"
  },

  // ==========================================
  // 2. SUBJEKTY A ÚČASTNÍCI ŘÍZENÍ (21-40)
  // ==========================================
  "nezletily-ucastnik": {
    id: "nezletily-ucastnik",
    term: "21. Nezletilý účastník - Dítě",
    czechTranslation: "Ústřední subjekt opatrovnického řízení s plnými právními nároky",
    shortDefinition: "Nezletilé dítě, o jehož právech, péči, výživném a výchovném prostředí soud autoritativně rozhoduje.",
    definition: "Dítě je plnohodnotným účastníkem opatrovnického řízení (§ 31 ZŘS). Vzhledem ke svému věku je v řízení zastoupeno kolizním opatrovníkem (OSPOD). Od určitého stupně rozumové a emočné vyspělosti má právo vyjádřit svůj názor.",
    importanceInCourt: "Přání a zájem dítěte nesmí být zaměňovány s manipulativním dikotátem jednoho rodiče. Soud musí zkoumat, zda je vyjádřený názor dítěte autonomní, nebo je výsledkem psychického navádění matkou.",
    context: "§ 30 OZ; § 31 ZŘS; čl. 12 Úmluvy o právech dítěte; judikatura ÚS k samostatnému názoru dítěte.",
    category: "subjects"
  },
  "kolizni-opatrovnik": {
    id: "kolizni-opatrovnik",
    term: "22. Kolizní opatrovník - OSPOD",
    czechTranslation: "Soudem jmenovaný orgán zástupce zájmů dítěte u soudu",
    shortDefinition: "Orgán sociálně-právní ochrany dětí (OSPOD) jmenovaný soudem k nestrannému hájení nejlepších zájmů dítěte v řízení.",
    definition: "Jelikož v opatrovnickém sporu mohou být zájmy rodičů v kolizi se zájmy dětí, soud jmenuje orgán OSPOD jako kolizního opatrovníka. Pracovnice OSPOD provádí šetření v rodině, navštěvuje domácnost a předkládá soudu doporučení.",
    importanceInCourt: "Doporučení OSPOD má pro soud váhu, avšak OSPOD NENÍ soudce. Pokud OSPOD podléhá genderovým předsudkům nebo prosazuje výhradní péči matky, otec musí předložit vědecké studie (Warshak, Fabricius) a podat námitky proti nestrannosti.",
    context: "§ 469 ZŘS; zákon č. 359/1999 Sb., o sociálně-právní ochraně dětí; nález ÚS I. ÚS 2482/13.",
    category: "subjects"
  },
  "soudni-znalec": {
    id: "soudni-znalec",
    term: "23. Soudní znalec - Klinická psychologie / Psychiatrie",
    czechTranslation: "Znalecké posuzování rodičovských kompetencí a psychiky rodiny",
    shortDefinition: "Odborník pověřený soudem k vypracování exaktního znaleckého posudku na rodičovské kompetence a psychiku rodiny.",
    definition: "Znalec z oboru zdravotnictví nebo školství/psychologie zpracovává na základě usnesení soudu kompletní diagnostiku osobnosti obou rodičů, zkoumá vazby dětí a doporučuje nejvhodnější model péče a rozsah styku.",
    importanceInCourt: "Znalecký posudek bývá klíčovým důkazem. Otec se na psychologické vyšetření musí pečlivě připravit, zachovat klid, neútočit na matku a vystupovat věcně, zrale a pro-dítětně.",
    context: "Zákon č. 254/2019 Sb., o znalcích, znaleckých kancelářích a znaleckých ústavech; § 127 OSŘ.",
    category: "subjects"
  },
  "soudni-znalec-pedopsychiatrie": {
    id: "soudni-znalec-pedopsychiatrie",
    term: "24. Soudní znalec z oboru pedopsychiatrie",
    czechTranslation: "Dětský psychiatr posuzující závažné psychické poruchy a trauma dětí",
    shortDefinition: "Specializovaný lékař-znalec posuzující závažné dětské psychické poruchy, trauma, reakce na manipulaci či podezření na zneužívání.",
    definition: "Pedopsychiatr posuzuje klinické psychopatologie dětí v krizových situacích, kdy hrozí závažné psychické poškození dítěte v důsledku syndromu zavrženého rodiče, traumatu z rozvodu nebo zneužití taktických falešných obvinění.",
    importanceInCourt: "Pokud matka tvrdí, že dítě trpí těžkými psychosomatickými reakcemi z otce, otec navrhuje pedopsychiatra k odhalení, že symptom vznikl z tlaku matky.",
    context: "Zákon č. 254/2019 Sb.; vyhláška č. 505/2020 Sb.; znalecká diagnostika v pedopsychiatrii.",
    category: "subjects"
  },
  "advokat-zmocnenec": {
    id: "advokat-zmocnenec",
    term: "25. Advokát a zmocněnec",
    czechTranslation: "Právní zástupce otce před soudem a úřady",
    shortDefinition: "Právní profesionál zapsaný v České advokátní komoře zastupující účastníka řízení před soudem a úřady.",
    definition: "Advokát koncipuje soudní podání, návrhy na střídavou péči, vyjadřuje se k důkazům protistrany a zastupuje otce při ústních jednáních. Zmocněncem může být i jakýkoliv zletilý občan s plnou mocí.",
    importanceInCourt: "Výběr advokáta specializovaného na rodinné právo a střídavou péči je pro otce zásadní. Advokát by měl razit konstruktivní, ale neústupnou strategii důsledné ochrany otcovských práv.",
    context: "Zákon č. 85/1996 Sb., o advokacii; § 24 a násl. občanského soudního řádu (OSŘ).",
    category: "subjects"
  },
  "soudce-opatrovnicky": {
    id: "soudce-opatrovnicky",
    term: "26. Opatrovnický soudce",
    czechTranslation: "Specializovaný soudce rozhodující rodinněprávní agendu",
    shortDefinition: "Jediný zákonný soudce pověřený opatrovnickou agendou, který provádí dokazování a vynáší autoritativní rozsudek o dítěti.",
    definition: "Soudce řídí jednání, rozhoduje o připuštění důkazů, pokládá otázky svědkům a znalcům a na základě volného hodnocení důkazů vydává rozsudek jménem republiky.",
    importanceInCourt: "Vystupování otce před soudcem musí být vysoce kultivované, bez emočních výpadků vůči matce, zaměřené výhradně na potřeby a zájem dítěte.",
    context: "Čl. 81 a 82 Ústavy ČR; § 9 a § 32 zákona č. 6/2002 Sb., o soudech a soudcích.",
    category: "subjects"
  },
  "slyseni-nazoru-ditete": {
    id: "slyseni-nazoru-ditete",
    term: "27. Slyšení názoru dítěte",
    czechTranslation: "Přímý rozhovor soudce s dítětem v bezpečí bez přítomnosti rodičů",
    shortDefinition: "Protokolovaný výslech nezletilého dítěte prováděný soudcem v adaptační místnosti k zjištění jeho přání a názoru.",
    definition: "Soudce zjišťuje názor dítěte přímo rozhovorem. Dítě nad 12 let má silnou domněnku vyspělosti, avšak dle judikatury ÚS je nutné zjišťovat názor i u dětí mladdších (8-10 let) přiměřeným způsobem.",
    importanceInCourt: "Otec má právo se se zápisem ze slyšení seznámit. Pokud dítě opakuje nepřirozené naučené fráze matky, otec navrhuje psychologické přezkoumání manipulace.",
    context: "§ 867 odst. 2 OZ; čl. 12 Úmluvy o právech dítěte; stanovisko pléna Ústavního soudu Pl. ÚS-st. 43/16.",
    category: "subjects"
  },
  "svedek": {
    id: "svedek",
    term: "28. Svědek",
    czechTranslation: "Osoba vypovídající o osobně vnímaných skutečnostech",
    shortDefinition: "Fyzická osoba předvolaná soudem, která vypovídá o skutečnostech, které sama osobně viděla nebo slyšela.",
    definition: "Svědkem v opatrovnickém řízení bývají prarodiče, učitelky z MŠ/ZŠ, dětský lékař, sousedé či rodinní známí. Svědek je povinen mluvit pravdu a nic nezamlčet pod hrozbou trestního stíhání.",
    importanceInCourt: "Otec navrhuje svědky, kteří mohou potvrdit jeho aktivní zapojení do péče, ranní a večerní rituály, zdravý vztah dítěte k otci i případné maření styku ze strany matky.",
    context: "§ 126 občanského soudního řádu (OSŘ).",
    category: "subjects"
  },
  "osoba-blizka": {
    id: "osoba-blizka",
    term: "29. Osoba blízká",
    czechTranslation: "Příbuzní v přímé řadě, sourozenci a širší rodina",
    shortDefinition: "Příbuzný v řadě přímé (prarodiče, sourozenci), jakož i jiné osoby v poměru rodinném, jejichž újmu by druhý pociťoval jako vlastní.",
    definition: "Právo dětí na zachování vazeb se širší rodinou (zejména s prarodiči ze strany otce) je chráněno zákony i mezinárodními úmluvami. Prarodiče mají samostatné právní právo na styk s vnoučetem.",
    importanceInCourt: "Prarodiče ze strany otce mohou podat samostatný návrh na úpravu styku s vnoučetem, pokud matka izoluje celé otcovo příbuzenstvo.",
    context: "§ 22 občanského zákoníku (OZ); § 927 OZ (styk příbuzných s dítětem).",
    category: "subjects"
  },
  "prizvany-odbornik": {
    id: "prizvany-odbornik",
    term: "30. Přizvaný odborný konzultant / Poradce",
    czechTranslation: "Odborný poradce strany či soukromý znalec předkládající revizní posudek",
    shortDefinition: "Nezávislý psycholog či odborník přizvaný otcem k oponentuře znaleckého posudku nebo přípravě na jednání.",
    definition: "Otec má právo konzultovat případ se soukromým dětským psychologem či odborníkem na rodičovskou alienaci, který vypracuje revizní odborné stanovisko k pochybením soudního znalce.",
    importanceInCourt: "Soukromý posudek předložený otcem dle § 127a OSŘ má status listinného důkazu a nutí soudce vypořádat se s vědeckými protiklady v posudku soudního znalce.",
    context: "§ 127a občanského soudního řádu (OSŘ).",
    category: "subjects"
  },
  "mediator": {
    id: "mediator",
    term: "31. Mediátor",
    czechTranslation: "Nezávislý odborník vedoucí rodiče k mimosoudní dohodě",
    shortDefinition: "Zapsaný odborník vedoucí strukturované mimosoudní jednání mezi rodiči s cílem uzavřít rodinnou dohodu.",
    definition: "Soud může rodičům nařídit první setkání s mediátorem v rozsahu 3 hodin (§ 100 odst. 3 OSŘ). Mediátor nepředkládá řešení, ale pomáhá oběma stranám obnovit komunikaci.",
    importanceInCourt: "Otec by se mediaci neměl vyhýbat. Aktivní účast na mediaci dokazuje pro-klientský postoj otce a jeho vysokou výchovnou toleranci.",
    context: "Zákon č. 202/2012 Sb., o mediaci; § 100 odst. 3 OSŘ.",
    category: "subjects"
  },
  "ospod-organ": {
    id: "ospod-organ",
    term: "32. OSPOD - Orgán sociálně-právní ochrany dětí",
    czechTranslation: "Městský či obecní úřad vykonávající ochranu dětí",
    shortDefinition: "Specializovaný orgán státní správy vyčleněný na obecních úřadech s rozšířenou působností k ochraně práv dětí.",
    definition: "OSPOD plní roli kolizního opatrovníka u soudu, provádí preventivní a poradenskou činnost, navštěvuje rodiny a podává soudu zprávy o poměrech nezletilých dětí.",
    importanceInCourt: "Klíčový aktér řízení. Otec s OSPODem komunikuje profesionálně, písemně, vždy pro-klientsky a doloží své zázemí i péči.",
    context: "Zákon č. 359/1999 Sb., o sociálně-právní ochraně dětí; Instrukce MPSV.",
    category: "subjects"
  },
  "socialni-pracovnik-ospod": {
    id: "socialni-pracovnik-ospod",
    term: "33. Sociální pracovník OSPOD",
    czechTranslation: "Konkrétní referent pověřený vedením spisu rodiny",
    shortDefinition: "Pověřený zaměstnanec OSPOD, který provádí terénní šetření v domácnostech rodičů a zastupuje dítě v soudní síni.",
    definition: "Sociální pracovník navštěvuje byt otce i matky, hovoří s dětmi, komunikuje se školou a vypracovává písemnou zprávu o poměrech s doporučením pro soud.",
    importanceInCourt: "Při návštěvě sociálního pracovníka v bytě otce je nutné mít připravený čistý dětský pokoj, studijní koutek, hračky a uvolněnou přátelskou atmosféru.",
    context: "Standardy kvality sociálně-právní ochrany dětí (příloha č. 1 vyhlášky č. 473/2012 Sb.).",
    category: "subjects"
  },
  "kurator-pro-mladez": {
    id: "kurator-pro-mladez",
    term: "34. Kurátor pro mládež",
    czechTranslation: "Specializovaný pracovník OSPOD pro dospívající a poruchy chování",
    shortDefinition: "Specialista OSPOD zabývající se dětmi se závažnými poruchami chování, záškoláctvím či výchovnými problémy.",
    definition: "Kurátor vstupuje do případu, pokud dospívající dítě vykazuje závažné poruchy chování, útěky z domova nebo pokud je obětí těžké manipulace ze strany jednoho z rodičů.",
    importanceInCourt: "Otec může žádat součinnost kurátora pro mládež v případech, kdy starší dítě pod vlivem matky odmítá chodit do školy nebo do otcovy péče.",
    context: "§ 31 a násl. zákona č. 359/1999 Sb.; zákon č. 218/2003 Sb.",
    category: "subjects"
  },
  "probacni-a-mediacni-sluzba": {
    id: "probacni-a-mediacni-sluzba",
    term: "35. Probační a mediační služba (PMS)",
    czechTranslation: "Státní orgán zprostředkovávající řešení konfliktů a mediaci",
    shortDefinition: "Státní instituce působící v resortu spravedlnosti zaměřená na mimosoudní urovnání konfliktů a probaci.",
    definition: "PMS nabízí bezplatné mediace a rodinné konzultace v případech, kdy mezi rodiči dochází ke konfliktům s trestněprávním přesahem (např. neplacení výživného nebo hrozba křivého obvinění).",
    importanceInCourt: "Otec čelící trestnímu stíhání pro neplacení výživného může prostřednictvím PMS dojednat splátkový kalendář a urovnání sporu.",
    context: "Zákon č. 257/2000 Sb., o Probační a mediační službě.",
    category: "subjects"
  },
  "zapsany-spolek-otci": {
    id: "zapsany-spolek-otci",
    term: "36. Zapsaný spolek na ochranu práv otců",
    czechTranslation: "Neziskové organizace a důvěrníci podporující otce u soudu",
    shortDefinition: "Nezisková organizace či spolek (např. Unie otců, Střídavka, Táta má právo) poskytující poradenství a podporu otcům.",
    definition: "Spolky poskytují právní a psychologickou osvětu, metodickou pomoc, organizují vzájemnou podporu otců a zástupci spolku mohou vystupovat jako důvěrníci u soudního jednání (§ 21 OSŘ).",
    importanceInCourt: "Otec si může k soudnímu jednání přivést zástupce spolku jako důvěrníka, což zvyšuje psychickou jistotu otce v soudní síni.",
    context: "§ 214 a násl. občanského zákoníku (OZ); § 21 občanského soudního řádu (OSŘ).",
    category: "subjects"
  },
  "detsky-klinicky-psycholog": {
    id: "detsky-klinicky-psycholog",
    term: "37. Dětský klinický psycholog",
    czechTranslation: "Zdravotnický odborník diagnostikující dětskou psychiku a trauma",
    shortDefinition: "Atestovaný zdravotnický pracovník specializovaný na psychologickou diagnostiku a terapii dětí.",
    definition: "Dětský klinický psycholog provádí odbornou diagnostiku psychického stavu dítěte na základě doporučení pediatra nebo OSPODu. Poskytuje terapii a zprávy pro soud.",
    importanceInCourt: "Zpráva nezávislého dětského klinického psychologa o výborném psychickém stavu dítěte u otce je silným důkazem vyvracejícím tvrzení matky o 'traumatu z otce'.",
    context: "Zákon č. 372/2011 Sb., o zdravotních službách; zákon č. 96/2004 Sb.",
    category: "subjects"
  },
  "specialni-pedagog": {
    id: "specialni-pedagog",
    term: "38. Speciální pedagog a psychopedagog",
    czechTranslation: "Školský odborník na vývojové poruchy učení a adaptaci dětí",
    shortDefinition: "Odborník z pedagogicko-psychologické poradny (PPP) posuzující školní zralost, specifické poruchy učení a chování dětí.",
    definition: "Vypracovává zprávy o školní adaptaci dětí, připravenosti na školní docházku a vlivu rodinného prostředí na vzdělávací výsledky dětí.",
    importanceInCourt: "Pokud otec se školním odborníkem aktivně spolupracuje a doučuje dítě, zpráva PPP potvrzuje vynikající výchovné kompetence otce.",
    context: "Zákon č. 561/2004 Sb. (Školský zákon); vyhláška č. 27/2016 Sb.",
    category: "subjects"
  },
  "statutarni-zastupce-ospod": {
    id: "statutarni-zastupce-ospod",
    term: "39. Statutární zástupce opatrovnického úřadu",
    czechTranslation: "Starosta nebo vedoucí odboru pověřený oficiálním zastupováním OSPODu",
    shortDefinition: "Oficiální představitel obce či městské části, v jehož jménu OSPOD vystupuje v soudním řízení.",
    definition: "Písemná plná moc k zastupování kolizního opatrovníka vychází od statutárního orgánu obce. Při pochybení OSPODu směřují stížnosti vedoucímu odboru nebo tajemníkovi úřadu.",
    importanceInCourt: "Při nezákonném postupu referentky OSPOD podává otec oficiální stížnost přímo vedení úřadu a žádá změnu konkrétního pracovníka.",
    context: "Zákon č. 128/2000 Sb., o obcích; zákon č. 359/1999 Sb.",
    category: "subjects"
  },
  "ucastnik-rizeni-vedlejsi": {
    id: "ucastnik-rizeni-vedlejsi",
    term: "40. Účastník řízení vedlejší",
    czechTranslation: "Osoba vstupující do řízení na podporu jedné ze stran z právního zájmu",
    shortDefinition: "Třetí osoba, která má právní zájem na výsledku řízení a vstoupí do sporu na stranu otce nebo matky.",
    definition: "Vedlejší účastník pomáhá straně, na jejíž straně vystupuje, má právo nahlížet do spisu, navrhovat důkazy a podávat vyjádření (§ 93 OSŘ).",
    importanceInCourt: "Výjimečný institut, který lze využít v navazujících sporných řízeních (např. o náhradu škody způsobené mařením styku).",
    context: "§ 93 občanského soudního řádu (OSŘ).",
    category: "subjects"
  },

  // ==========================================
  // 3. FORMY PÉČE A RODIČOVSKÁ PRÁVA (41-50)
  // ==========================================
  "rodicovska-odpovednost": {
    id: "rodicovska-odpovednost",
    term: "41. Rodičovská odpovědnost",
    czechTranslation: "Souhrn práv a povinností obou rodičů trvající bez ohledu na rozvod",
    shortDefinition: "Souhrn povinností a práv zahrnující péči o zdraví, vývoj, vzdělání, zastupování a správu majetku dítěte.",
    definition: "Rodičovská odpovědnost náleží rovným dílem oběma rodičům od narození dítěte. Trvá i po rozvodu či rozchodu. Svěření dítěte do výhradní péče jednoho rodiče NEZBAVUJE druhého rodiče jeho rodičovské odpovědnosti.",
    importanceInCourt: "Otec s rodičovskou odpovědností má plné právo spolurozhodovat o výběru školy, lékařské péči, vydání pasu či změně bydliště dítěte. Matka nesmí tyto zásadní věci rozhodovat sama.",
    context: "§ 858 a násl. občanského zákoníku (OZ); nález Ústavního soudu IV. ÚS 805/14.",
    category: "custody"
  },
  "stridava-pece": {
    id: "stridava-pece",
    term: "42. Střídavá péče",
    czechTranslation: "Rovnocenná péče obou rodičů v rovném či přibližně rovném rozsahu",
    shortDefinition: "Model péče, kdy oba rodiče pečují o dítě ve stejných nebo přibližně stejných časových intervalech (např. 7/7, 14/14, 2-2-3).",
    definition: "Střídavá péče garantuje zachování plnohodnotné výchovné role obou rodičů. Podle judikatury Ústavního soudu ČR je střídavá péče primárním modelem, pokud jsou oba rodiče způsobilí a mají o péči zájem.",
    importanceInCourt: "Základní cíl uvědomělého otce. Střídavá péče poskytuje dítěti dvě rovnocenná stabilní zázemí a chrání ho před otcovskou deprivací a traumatem ze ztráty jednoho rodiče.",
    context: "§ 907 odst. 2 OZ; nálezy Ústavního soudu I. ÚS 2482/13, I. ÚS 1506/13, III. ÚS 1206/09, I. ÚS 3216/19.",
    category: "custody"
  },
  "spolecna-pece": {
    id: "spolecna-pece",
    term: "43. Společná péče",
    czechTranslation: "Péče bez pevně stanoveného harmonogramu založená na dohodě",
    shortDefinition: "Uspořádání, kdy rodiče nerozdělují pevný časový harmonogram, ale řeší péči průběžně na základě dohod a potřeb dětí.",
    definition: "Předpokládá vysokou míru komunikace a schopnosti kooperace mezi rodiči. Často funguje v situacích, kdy rodiče žijí blízko sebe nebo mají nadstandardně přátelské vztahy.",
    importanceInCourt: "Ideální model, pokud matka neblokuje dohody. Pokud se však komunikace zhroutí, je nutné přejít na formálně ukotvenou střídavou péči s přesným harmonogramem.",
    context: "§ 907 odst. 1 občanského zákoníku (OZ).",
    category: "custody"
  },
  "vyhradni-pece": {
    id: "vyhradni-pece",
    term: "44. Výhradní (výlučná) péče",
    czechTranslation: "Svěření dítěte do péče jediného rodiče s vymezením pouze styku",
    shortDefinition: "Svěření dítěte do výhradní péče jednoho z rodičů (zpravidla matky) s vymezením pouze styku pro druhého rodiče.",
    definition: "Tradiční asymetrické uspořádání 20. století, které druhého rodiče degraduje na pouhého návštěvníka. Dle judikatury Ústavního soudu je výhradní péče odůvodněna pouze tehdy, existují-li závažné překážky pro střídavou péči.",
    importanceInCourt: "Otec by se měl bránit výhradní péči matky a dokazovat, že střídavá péče je v nejlepším zájmu dítěte.",
    context: "§ 907 odst. 2 OZ; nález ÚS I. ÚS 2482/13; metaanalýzy Bausermana (2002) a Nielsena (2018).",
    category: "custody"
  },
  "styk-s-ditetem": {
    id: "styk-s-ditetem",
    term: "45. Styk s dítětem",
    czechTranslation: "Právo a povinnost osobního i elektronického kontaktu nepečujícího rodiče",
    shortDefinition: "Zákonné právo a povinnost rodiče se s dítětem pravidelně stýkat a trávit s ním osobní čas.",
    definition: "Styk zahrnuje osobní setkávání, víkendové i všední přespávání, prázdniny, svátky, jakož i telefonický a elektronický kontakt. Styk slouží k udržení citové vazby.",
    importanceInCourt: "Pokud soud nesvěří dítě do střídavé péče, styk otce musí být stanoven co nejšířeji, včetně noční péče a polovičních prázdnin.",
    context: "§ 887 a § 888 občanského zákoníku (OZ).",
    category: "custody"
  },
  "zakaz-braneni-ve-styku": {
    id: "zakaz-braneni-ve-styku",
    term: "46. Zákaz bránění ve styku",
    czechTranslation: "Zákonná povinnost pečujícího rodiče podporovat vztah k druhému rodiči",
    shortDefinition: "Kategorický zákonný příkaz pečujícímu rodiči zdržet se všeho, co brání styku dítěte s druhým rodičem.",
    definition: "Rodič, který má dítě v péči, je povinen dítě na styk řádně připravit, předat ho včas a podporovat kladný vztah dítěte k druhému rodiči. Bezdůvodné bránění ve styku je porušením zákona.",
    importanceInCourt: "Opakované bránění ve styku je důvodem pro novou úpravu péče a svěření dítěte do péče otce z důvodu vyšší výchovné tolerance otce.",
    context: "§ 889 občanského zákoníku (OZ); § 907 odst. 2 OZ (kritérium výchovné tolerance).",
    category: "custody"
  },
  "dohoda-rodicu": {
    id: "dohoda-rodicu",
    term: "47. Dohoda rodičů o úpravě poměrů",
    czechTranslation: "Konsensuální dohoda otce a matky schvalovaná opatrovnickým soudem",
    shortDefinition: "Písemná dohoda otce a matky o úpravě poměrů dětí, kterou schvaluje opatrovnický soud.",
    definition: "Dohoda rodičů má přednost před autoritativním rozsudkem soudu. Pokud je dohoda v souladu se zájmy dětí, soud je povinen ji schválit bez rozsáhlého dokazování.",
    importanceInCourt: "Nejrychlejší a nejméně traumatizující cesta. Otec však musí dbát na to, aby dohoda byla precizně formulovaná, vymahatelná a obsahovala střídavé přespávání.",
    context: "§ 906 občanského zákoníku (OZ); § 471 ZŘS.",
    category: "custody"
  },
  "zakonny-zastupce": {
    id: "zakonny-zastupce",
    term: "48. Zákonný zástupce",
    czechTranslation: "Osoba oprávněná činit za dítě veškerá právní jednání",
    shortDefinition: "Rodič oprávněný činit za nezletilé dítě veškerá právní jednání, ke kterým není dítě vzhledem ke svému věku způsobilé.",
    definition: "Oba rodiče jsou zákonnými zástupci svých dětí. Zastupují dítě při zápisu do školy, jednání s lékaři, úřady či finančními institucemi.",
    importanceInCourt: "Otec má plné právo nahlížet do zdravotní dokumentace dětí, komunikovat se školou a vyžadovat informace od lékařů bez souhlasu matky.",
    context: "§ 892 a násl. občanského zákoníku (OZ).",
    category: "custody"
  },
  "zajem-ditete": {
    id: "zajem-ditete",
    term: "49. Nejlepší zájem dítěte",
    czechTranslation: "Nadřazené kritérium v opatrovnickém právu zaručující právo na oba rodiče",
    shortDefinition: "Základní a nadřazený princip rodinného práva zakotvený v Úmluvě o právech dítěte, který má přednost před zájmy rodičů.",
    definition: "Zájem dítěte vyžaduje zachování bezpečných vazeb k oběma rodičům, právo na péči obou rodičů, stabilní prostředí, rozvoj vzdělání a zdravý fyzický i psychický vývoj.",
    importanceInCourt: "Otec musí veškeré své argumenty stavět na zájmu dítěte. Ukázat, že střídavá péče chrání dítě před ztrátou jednoho rodiče.",
    context: "Čl. 3 Úmluvy o právech dítěte; § 3 ZŘS; § 866 OZ; judikatura Ústavního soudu.",
    category: "custody"
  },
  "misto-obvykleho-bydliste": {
    id: "misto-obvykleho-bydliste",
    term: "50. Místo obvyklého bydliště",
    czechTranslation: "Faktické centrum života dítěte určující mezinárodní a místní příslušnost",
    shortDefinition: "Místo, kde dítě fakticky žije, má své sociální centrum, školku, přátele a rodinné zázemí.",
    definition: "Určuje místní příslušnost opatrovnického soudu a je zásadní v případech mezinárodního únosu dětí (Haagská úmluva). Jednostranné odstěhování dítěte matkou bez souhlasu otce je protiprávní.",
    importanceInCourt: "Pokud se matka pokusí s dítětem svévolně odstěhovat na druhý konec republiky nebo do zahraničí, otec musí okamžitě podat návrh na předběžné opatření k navrácení dítěte.",
    context: "Nařízení Rady (EU) 2019/1111 (Brusel IIb); Haagská úmluva o občanskoprávních aspektech mezinárodních únosů dětí.",
    category: "custody"
  },

  // ==========================================
  // 4. FORMY PÉČE, PRÁVA A ZÁSADY (51–65)
  // ==========================================
  "nocni-pece-a-prespavani": {
    id: "nocni-pece-a-prespavani",
    term: "51. Noční péče a přespávání (nález II. ÚS 1918/16)",
    czechTranslation: "Péče o dítě v nočních hodinách a všedních dnech od útlého věku",
    shortDefinition: "Právo a schopnost otce zajišťovat kompletní péči o dítě včetně večerních rituálů, nočního vstávání a přespávání od nejnižšího věku.",
    definition: "Noční péče představuje klíčový prvek pro budování hlubokého a bezpečného citového pouta (attachmentu). Přespávání u otce umožňuje dítěti zažít běžný denní i noční režim, večerní zklidnění, ranní vstávání a přípravu do školy či školky. Ústavní soud ČR opakovaně judikoval, že věk dítěte ani kojení (pokud již není jediným zdrojem výživy) nepředstavuje automatickou překážku pro přespávání u otce.",
    importanceInCourt: "Otec musí zdůraznit, že omezení péče na pouhá odpoledne bez přespávání znemožňuje plnohodnotné výchovné působení a vytváří z otce 'víkendového bavitele'. Poukázání na nález II. ÚS 1918/16 vyvrací mýtus OSPODu, že malé děti nesmí u otce přespávat.",
    context: "Nález Ústavního soudu sp. zn. II. ÚS 1918/16; konsensuální zpráva prof. Richarda Warshaka (2014) podpořená 110 mezinárodními odborníky.",
    category: "custody"
  },
  "asistovany-styk": {
    id: "asistovany-styk",
    term: "52. Asistovaný styk (§ 889 odst. 2 OZ)",
    czechTranslation: "Kontakt dítěte s rodičem za přítomnosti odborníka či třetí osoby",
    shortDefinition: "Dočasná forma styku dítěte s rodičem probíhající za přítomnosti odborníka (psychologa, sociálního pracovníka) v bezpečném prostředí.",
    definition: "Asistovaný styk slouží jako krizový či překlenovací institut v situacích, kdy mezi dítětem a rodičem došlo k dlouhodobému přerušení kontaktu, nebo v případech důvodného podezření na ohrožení dítěte. Probíhá v krizovém centru nebo neziskové organizaci a jeho cílem je postupné obnovení důvěry a přechod k běžnému neasistovanému styku.",
    importanceInCourt: "Pokud matka zcela zablokovala kontakt otce s dítětem a dítě je pod vlivem manipulace, asistovaný styk může být prvním krokem k prolomení barikády. Otec však musí trvat na tom, aby asistovaný styk byl časově omezen na nejnutnější dobu a měl jasný plán přechodu k běžné péči.",
    context: "§ 889 odst. 2 občanského zákoníku (OZ); § 503 zákona o zvláštních řízeních soudních (ZŘS).",
    category: "custody"
  },
  "zmena-pomeru": {
    id: "zmena-pomeru",
    term: "53. Změna poměrů (§ 990 OZ)",
    czechTranslation: "Zásadní změna okolností odůvodňující nové rozhodnutí soudu",
    shortDefinition: "Podstatná změna v životních, věkových, majetkových či výchovných poměrech, která zakládá právo na přezkum a novou úpravu péče či výživného.",
    definition: "Rozsudky v opatrovnických věcech nemají charakter absolutní nezměnitelnosti (rebus sic stantibus). Pokud dojde k podstatné změně poměrů – např. dospívání dítěte, nástup do školy, změna bydliště rodiče, ztráta nebo zvýšení příjmů, či neschopnost pečujícího rodiče zajišťovat řádnou výchovu – soud zahájí nové řízení a vydá nové rozhodnutí.",
    importanceInCourt: "Otec, kterému byl v minulosti stanoven pouze úzký styk z důvodu nízkého věku dítěte, podává návrh na změnu poměrů s odkazem na věk dítěte, jeho potřeby a stabilizaci svých podmínek s cílem získat střídavou péči.",
    context: "§ 990 občanského zákoníku (OZ); § 475 zákona o zvláštních řízeních soudních (ZŘS).",
    category: "process"
  },
  "rodinna-porada-konference": {
    id: "rodinna-porada-konference",
    term: "54. Rodinná porada / Konference",
    czechTranslation: "Mimosoudní setkání širší rodiny za účelem řešení péče o dítě",
    shortDefinition: "Strukturované setkání širší rodiny, odborníků a OSPODu zaměřené na nalezení autonomního rodinného řešení bez autoritativního zásahu soudu.",
    definition: "Rodinná skupinová konference (RSK) je moderní metoda sociální práce, kde se rodina (rodiče, prarodiče, příbuzní) za pomoci nezávislého koordinátora sejde k projednání budoucího uspořádání péče o dítě. Klade důraz na vlastní odpovědnost rodiny a aktivní zapojení širšího rodinného zázemí.",
    importanceInCourt: "Návrh otce na uspořádání rodinné konference dokazuje soudu jeho konstruktivní snahu o dohodu a aktivní zapojení prarodičů. Pokud matka účast odmítne, prokazuje to její nesoučinnost.",
    context: "§ 926 občanského zákoníku (OZ); Metodické pokyny MPSV pro práci OSPOD.",
    category: "subjects"
  },
  "porucnictvi": {
    id: "porucnictvi",
    term: "55. Poručnictví (§ 934 OZ)",
    czechTranslation: "Zákonné zastoupení dítěte v případě absence či neschopnosti obou rodičů",
    shortDefinition: "Právní institut ustanovení poručníka dítěti, jehož rodiče zemřeli, byli zbaveni rodičovské odpovědnosti nebo nemají plnou svéprávnost.",
    definition: "Poručník je soudem jmenovaná osoba, která má vůči dítěti povinnosti a práva jako rodič, avšak nemá k němu vyživovací povinnost. Poručníkem bývá zpravidla příbuzný (např. prarodič nebo teta/strýc).",
    importanceInCourt: "Uplatní se v krizových situacích, kdy např. matka trpí závažnou duševní poruchou či je hospitalizována a otec usiluje o přechod péče na sebe či ustanovení poručníka ze své strany rodiny.",
    context: "§ 928 až § 942 občanského zákoníku (OZ).",
    category: "custody"
  },
  "pestounska-pece": {
    id: "pestounska-pece",
    term: "56. Pěstounská péče (§ 958 OZ)",
    czechTranslation: "Náhradní rodinná péče o dítě, o které se rodiče nemohou starat",
    shortDefinition: "Forma náhradní rodinné péče financovaná a podporovaná státem, kdy pěstoun osobní péčí nahrazuje péči biologických rodičů.",
    definition: "Pěstounská péče nastupuje tam, kde biologičtí rodiče nemohou ze závažných důvodů (zdravotních, sociálních, trestních) zajistit výchovu dítěte. Biologickým rodičům zůstává rodičovská odpovědnost v základních věcech a právo na styk s dítětem.",
    importanceInCourt: "Biologický otec má vždy přednost před cizí pěstounskou péčí. Pokud se matka o dítě nedokáže starat, stát je povinen nabídnout péči nejprve otci.",
    context: "§ 958 a násl. občanského zákoníku (OZ); zákon č. 359/1999 Sb., o sociálně-právní ochraně dětí.",
    category: "custody"
  },
  "osvojeni-adopce": {
    id: "osvojeni-adopce",
    term: "57. Osvojení / Adopce (§ 794 OZ)",
    czechTranslation: "Vznik právně rodinného poměru mezi osvojitelem a osvojencem",
    shortDefinition: "Právní akt, kterým přijímá osvojitel zletilé či nezletilé dítě za vlastní, přičemž zanikají příbuzenské vazby k původní rodině.",
    definition: "Osvojením vzniká mezi osvojitelem a osvojeným dítětem stejný poměr, jako je mezi rodiči a dětmi. K osvojení nezletilého dítěte je vyžadován souhlas obou biologických rodičů, ledaže o dítě dlouhodobě nejeví opravdový zájem.",
    importanceInCourt: "Varování pro otce: Pokud otec dlouhodobě neplatí výživné a neudržuje kontakt, matka a její nový partner mohou navrhnout osvojení dítěte nevlastním otcem. Otec musí aktivně prokazovat zájem o dítě.",
    context: "§ 794 až § 854 občanského zákoníku (OZ).",
    category: "custody"
  },
  "pravo-na-informace-o-diteti": {
    id: "pravo-na-informace-o-diteti",
    term: "58. Právo na informace o dítěti (§ 888 OZ)",
    czechTranslation: "Zákonný nárok nepečujícího rodiče na informace ze školy, od lékařů a úřadů",
    shortDefinition: "Zákonné právo druhého rodiče na poskytnutí veškerých informací o zdravotním stavu, vzdělávání a vývoji dítěte.",
    definition: "Oba rodiče s rodičovskou odpovědností mají plné a rovnocenné právo dostávat informace o dítěti od školek, škol, pediatrů, specialistů i kroužků. Pečující rodič je povinen tyto informace druhému rodiči nezamlčovat. Školní i zdravotnická zařízení jsou povinna odpovídat otci přímo.",
    importanceInCourt: "Školy a lékaři často chybují, když tvrdí, že 'informace dávají jen matce'. Ostatním institucím otec předloží rozsudek/rodný list s odkazem na § 888 OZ a trvá na zasílání známek, zpráv a lékařských nálezů.",
    context: "§ 888 občanského zákoníku (OZ); § 35 zákona č. 372/2011 Sb., o zdravotních službách.",
    category: "custody"
  },
  "zasada-rovnosti-rodicu": {
    id: "zasada-rovnosti-rodicu",
    term: "59. Zásada rovnosti rodičů (Čl. 32 Listiny, nález IV. ÚS 805/14)",
    czechTranslation: "Ústavní princip rovnoprávnosti obou rodičů při výchově a péči",
    shortDefinition: "Základní ústavní zakotvení rovných práv a povinností otce i matky bez ohledu na pohlaví či rodinný stav.",
    definition: "Článek 32 odst. 4 Listiny základních práv a svobod stanoví, že péče o děti a jejich výchova je právem rodičů; děti mají právo na rodičovskou výchovu a péči. Ústavní soud zdůrazňuje, že jakékoliv upřednostňování matky z genderových důvodů představuje diskriminaci a porušení ústavního pořádku.",
    importanceInCourt: "Základní kámen obhajoby otce. Pokud OSPOD nebo soud zlehčuje otcovu roli nebo uplatňuje stereotyp 'matka je matka', otec namítá porušení zásady rovnosti dle Čl. 32 Listiny a nálezu IV. ÚS 805/14.",
    context: "Čl. 32 odst. 4 Listiny základních práv a svobod; nález Ústavního soudu sp. zn. IV. ÚS 805/14; nález sp. zn. I. ÚS 2482/13.",
    category: "custody"
  },
  "zasada-minimalizace-zasahu": {
    id: "zasada-minimalizace-zasahu",
    term: "60. Zásada minimalizace zásahů (Čl. 8 EÚLP)",
    czechTranslation: "Povinnost státu nezasahovat nepřiměřeně do rodinného života",
    shortDefinition: "Princip vyžadující, aby státní orgány a soudy zasahovaly do rodinného života rodičů a dětí pouze v nezbytně nutné míře.",
    definition: "Podle článku 8 Evropské úmluvy o lidských právech má každý právo na respektování svého soukromého a rodinného života. Státní orgány (soudy, OSPOD) nesmí svévolně omezovat vazbu mezi otcem a dítětem, pokud pro to neexistují závažné, odborně prokázané důvody.",
    importanceInCourt: "Soudy nesmí bezdůvodně přetahovat soudní řízení nebo zakazovat styk bez důkazů. Otec argumentuje Čl. 8 EÚLP při neúměrně zdlouhavém rozhodování soudu.",
    context: "Článek 8 Evropské úmluvy o lidských právech (EÚLP); judikatura Evropského soudu pro lidská práva (ESLP) ve Štrasburku.",
    category: "process"
  },
  "pravo-ditete-na-oba-rodice": {
    id: "pravo-ditete-na-oba-rodice",
    term: "61. Právo dítěte na oba rodiče (Čl. 9 ÚPD)",
    czechTranslation: "Mezinárodně garantované právo dítěte udržovat osobní styky s oběma rodiči",
    shortDefinition: "Základní lidskoprávní princip zaručující dítěti oddělenému od jednoho nebo obou rodičů právo udržovat pravidelné osobní styky s oběma.",
    definition: "Úmluva o právech dítěte v Článku 9 odst. 3 stanoví, že smluvní státy budou uznávat právo dítěte odděleného od jednoho nebo obou rodičů udržovat pravidelné osobní styky a přímý kontakt s oběma rodiči, ledaže je to v rozporu se zájmy dítěte.",
    importanceInCourt: "Základní argument pro střídavou péči. Zdůrazňuje, že právo na oba rodiče není právem otce, ale nezadatelným právem samotného dítěte.",
    context: "Článek 9 odst. 3 Úmluvy o právech dítěte (vyhlášená pod č. 104/1991 Sb.); nález ÚS I. ÚS 2482/13.",
    category: "custody"
  },
  "vychovne-opatreni-soudu": {
    id: "vychovne-opatreni-soudu",
    term: "62. Výchovné opatření soudu (§ 926 OZ)",
    czechTranslation: "Autoritativní rozhodnutí soudu k usměrnění rodiče nebo dítěte",
    shortDefinition: "Právní nástroj soudu (např. napomenutí, dohled, nařízení terapie), kterým soud zasahuje při nedostatcích ve výchově nebo maření styku.",
    definition: "Soud může dle § 925 a § 926 OZ uložit napomenutí rodiči, stanovit dohled nad výchovou, nařídit rodičům odbornou poradenskou péči nebo mediaci. Využívá se při selhání komunikace mezi rodiči nebo při lehčích poruchách výchovy.",
    importanceInCourt: "Pokud matka soustavně vytváří překážky ve styku, otec navrhuje uložení výchovného opatření dle § 926 OZ spočívajícího v povinné odborné terapii nebo dohledu OSPODu.",
    context: "§ 925 a § 926 občanského zákoníku (OZ); § 468 zákona o zvláštních řízeních soudních (ZŘS).",
    category: "process"
  },
  "omezeni-rodicovske-odpovednosti": {
    id: "omezeni-rodicovske-odpovednosti",
    term: "63. Omezení rodičovské odpovědnosti (§ 869 OZ)",
    czechTranslation: "Soudní zúžení rozsahu práv a povinností rodiče z důvodu ohrožení dítěte",
    shortDefinition: "Rozhodnutí soudu o zúžení výkonu rodičovské odpovědnosti rodiče, který ji nevynakládá řádně nebo ji zneužívá.",
    definition: "Pokud rodič nevykonává řádně své povinnosti a vyžaduje to zájem dítěte, soud jeho rodičovskou odpovědnost omezí nebo omezí její výkon a stanoví rozsah tohoto omezení. Důvodem bývá závislost, zanedbávání nebo psychická patologie.",
    importanceInCourt: "Krajní institut. Pokud jeden z rodičů ohrožuje vývoj dítěte závažnou patologií, druhý rodič může žádat omezení jeho rodičovské odpovědnosti v konkrétních oblastech.",
    context: "§ 869 občanského zákoníku (OZ).",
    category: "custody"
  },
  "zbaveni-rodicovske-odpovednosti": {
    id: "zbaveni-rodicovske-odpovednosti",
    term: "64. Zbavení rodičovské odpovědnosti (§ 871 OZ)",
    czechTranslation: "Nejpřísnější sankce odnětí rodičovských práv pro hrubé porušování povinností",
    shortDefinition: "Nejpřísnější občanskoprávní sankce, kdy soud odejme rodiči všechna práva a povinnosti tvořící rodičovskou odpovědnost (kromě vyživovací povinnosti).",
    definition: "Soud zbaví rodiče rodičovské odpovědnosti, pokud své povinnosti nebo práva zneužívá nebo je hrubým způsobem zanedbává (např. spáchání úmyslného trestného činu vůči dítěti, těžké týrání, absolutní nezájem). Rodiči však nadále zůstává vyživovací povinnost.",
    importanceInCourt: "Extrémní opatření reserved pro případy nejzávažnější kriminality a týrání. Zbavený rodič ztrácí právo spolurozhodovat o dítěti.",
    context: "§ 871 a § 872 občanského zákoníku (OZ).",
    category: "custody"
  },
  "pozastaveni-rodicovske-odpovednosti": {
    id: "pozastaveni-rodicovske-odpovednosti",
    term: "65. Pozastavení rodičovské odpovědnosti (§ 870 OZ)",
    czechTranslation: "Dočasné stavení výkonu rodičovských práv ze závažných objektivních důvodů",
    shortDefinition: "Dočasné pozastavení možnosti vykonávat rodičovskou odpovědnost z důvodu závažné překážky na straně rodiče.",
    definition: "Brání-li rodiči ve výkonu jeho rodičovské odpovědnosti závažná překážka (např. dlouhodobý výkon trestu odnětí svobody, těžké duševní onemocnění či nezvěstnost), soud výkon rodičovské odpovědnosti pozastaví.",
    importanceInCourt: "Využije se např. v situaci, kdy matka ze zdravotních či jiných důvodů nemůže vykonávat péči, což otci otevírá cestu k plnému převzetí péče bez nutnosti zbavení práv.",
    context: "§ 870 občanského zákoníku (OZ).",
    category: "custody"
  },

  // ==========================================
  // 5. PSYCHOLOGIE, PATOLOGIE A DŮKAZY (66–85)
  // ==========================================
  "attachment-citova-vazba": {
    id: "attachment-citova-vazba",
    term: "66. Attachment / Citová vazba (Bowlby, Lamb)",
    czechTranslation: "Emoční pouto dítěte k pečovatelům garantující pocity bezpečí",
    shortDefinition: "Vývojově psychologický koncept popisující tvorbu citového pouta mezi dítětem a jeho rodiči od nejranějšího věku.",
    definition: "Attachment (John Bowlby, Mary Ainsworth, Michael Lamb) je vrozený psychologický systém vyhledávání blízkosti. Dítě si vytváří citové vazby k oběma rodičům paralelně. Výzkumy Dr. Michaela Lamba potvrzují, že otcové budují stejně kvalitní attachment jako matky a přítomnost obou rodičů vytváří nejodolnější psychologické zázemí.",
    importanceInCourt: "Argumentace teorie attachmentu vyvrací zastaralé tvrzení, že dítě do 3 let potřebuje pouze matku. Otec prokazuje, že jeho zapojení od narození buduje bezpečný attachment.",
    context: "John Bowlby (1969); Michael Lamb (2002, 2010); Richard Warshak (2014).",
    category: "psychology"
  },
  "rodicovska-alienace-pas": {
    id: "rodicovska-alienace-pas",
    term: "67. Rodičovská alienace - PAS (judikatura soudů ČR)",
    czechTranslation: "Syndrom zavrženého rodiče způsobený systémovým popouzením",
    shortDefinition: "Patologický stav, kdy dítě bezdůvodně odmítá a nenávidí jednoho z rodičů v důsledku psychické manipulace druhým rodičem.",
    definition: "Rodičovská alienace (Parental Alienation) nastává, když rezidentní rodič soustavně očerňuje druhého rodiče, vyvolává v dítěti pocit viny za projevy lásky k otci a podsouvá dítěti falešné vzpomínky. Ústavní soud ČR judikuje, že pasivita soudů při alienaci zakládá porušení práv na rodinný život.",
    importanceInCourt: "Pokud dítě bez reálného důvodu náhle odmítá otce a používá nepřirozený dospělý slovník matky, otec navrhuje znalecké přezkoumání manipulace a okamžitou terapeutickou či soudní intervenci.",
    context: "Nálezy Ústavního soudu I. ÚS 2482/13, II. ÚS 3740/11, II. ÚS 1508/16; Dr. Richard Gardner, Dr. Amy Baker.",
    category: "psychology"
  },
  "mareni-styku-tz": {
    id: "mareni-styku-tz",
    term: "68. Maření styku (§ 396 TZ, § 502 ZŘS)",
    czechTranslation: "Soustavné protiprávní blokování kontaktů dětí s druhým rodičem",
    shortDefinition: "Úmyslné a opakované maření výkonu soudního rozhodnutí nebo schválené dohody o styku s dítětem.",
    definition: "Maření styku zahrnuje účelové vymýšlení nemocí bez lékařských zpráv, bezdůvodné odvážení dětí v době předání, neodpovídání na výzvy a ignorování soudních výroků. V závažných případech zakládá trestní odpovědnost pro trestný čin maření výkonu úředního rozhodnutí (§ 337 TZ).",
    importanceInCourt: "Každé jednotlivé zmaření styku musí otec ihned dokumentovat (zpráva matce, svědek, záznam Policie ČR) a podávat návrhy na výkon rozhodnutí s pokutami a návrh na změnu péče.",
    context: "§ 501 a násl. ZŘS; § 337 odst. 4 trestního zákoníku (TZ); § 907 odst. 2 OZ (výchovná tolerance).",
    category: "psychology"
  },
  "falesna-obvineni-v-rizeni": {
    id: "falesna-obvineni-v-rizeni",
    term: "69. Falešná obvinění v řízení (§ 345 TZ)",
    czechTranslation: "Účelová a smyšlená obvinění z násilí či zneužívání k odříznutí otce",
    shortDefinition: "Taktické vykonstruování lživých nařčení z domácího násilí, alkoholismu či zneužívání s cílem diskreditovat otce u soudu.",
    definition: "Jedna z nejnebezpečnějších neférových taktik v opatrovnickém boji. Matka podá trestní oznámení či podnět na OSPOD, čímž dosáhne pozastavení styku do vyšetření. Pokud je obvinění vědomě lživé, zakládá trestný čin křivého obvinění (§ 345 TZ) nebo křivé výpovědi (§ 346 TZ).",
    importanceInCourt: "Otec musí zachovat klid, plně spolupracovat s orgány činnými v trestním řízení, podrobit se dobrovolně psychologickému vyšetření a po očistění trvat na vyvození trestní i opatrovnické odpovědnosti vůči matce.",
    context: "§ 345 a § 346 trestního zákoníku (TZ); judikatura Nejvyššího soudu k trestnému činu křivého obvinění v rodinných sporech.",
    category: "psychology"
  },
  "znalecky-posudek-osr": {
    id: "znalecky-posudek-osr",
    term: "70. Znalecký posudek (§ 127 OSŘ)",
    czechTranslation: "Znalecké posouzení rodičovských kompetencí a psychiky rodiny",
    shortDefinition: "Klíčový odborný důkaz zpracovaný soudním znalcem v oboru zdravotnictví/psychologie k posouzení kompetencí rodičů a vazeb dětí.",
    definition: "Soudní znalec posuzuje osobnostní charakteristiky obou rodičů, přítomnost poruch osobnosti, kvalitu citových vazeb dětí, míru výchovné tolerance a navrhuje nejvhodnější úpravu péče. Znalec podléhá zákonu o znalcích č. 254/2019 Sb.",
    importanceInCourt: "Otec se musí na testování pečlivě připravit. Pokud posudek obsahuje metodické pochybení, otec předkládá odborné vyjádření revizního znalce dle § 127a OSŘ.",
    context: "§ 127 a § 127a OSŘ; zákon č. 254/2019 Sb., o znalcích, znaleckých kancelářích a znaleckých ústavech.",
    category: "psychology"
  },
  "otcovska-deprivace-studie": {
    id: "otcovska-deprivace-studie",
    term: "71. Otcovská deprivace (metaanalýzy Bauserman, Lamb)",
    czechTranslation: "Psychické a sociální strádání dítěte v důsledku absence otce",
    shortDefinition: "Závažný stav psychického strádání dítěte vyvolaný odříznutím nebo výrazným omezením přítomnosti a výchovného působení otce.",
    definition: "Rozsáhlé mezinárodní metaanalýzy (Bauserman 2002, Nielsen 2018, Lamb 2010) prokazují, že děti trpící otcovskou deprivací vykazují vyšší výskyt emocionálních poruch, nižší školní úspěšnost, vyšší riziko závislostí a poruch chování v dospívání. Přítomnost otce je nezastupitelným faktorem zdravé socializace.",
    importanceInCourt: "Argument proti výhradní péči matky. Otec prokazuje, že bránění v kontaktu způsobuje dítěti otcovskou deprivaci a nevratné psychické škody.",
    context: "Metaanalýza Dr. Roberta Bausermana (2002); studie prof. Lindy Nielsen (2018); výzkumy prof. Michaela Lamba.",
    category: "psychology"
  },
  "manipulace-s-ditetem-oz": {
    id: "manipulace-s-ditetem-oz",
    term: "72. Manipulace s dítětem (§ 858 OZ)",
    czechTranslation: "Psychický nátlak na dítě směřující k poškození vztahu k druhým rodiči",
    shortDefinition: "Zneužití závislosti dítěte k formování negativních postojů vůči druhému rodiči v rozporu s jeho nejlepším zájmem.",
    definition: "Manipulace zahrnuje podsouvání negativních hodnocení otce, vyvolávání strachu z otce, trestání dítěte za projev náklonnosti k otci a zneužívání dítěte jako 'zbraně' v dospělém sporu. Je v přímém rozporu s povinností pečovat o všestranný rozvoj dítěte.",
    importanceInCourt: "Identifikace manipulace dětským psychologem či znalcem je důvodem k okamžitému zásahu soudu, nařízení terapie nebo změně péče.",
    context: "§ 858 a § 889 občanského zákoníku (OZ).",
    category: "psychology"
  },
  "digitalni-dukazy-v-rizeni": {
    id: "digitalni-dukazy-v-rizeni",
    term: "73. Digitální důkazy v řízení (§ 125 OSŘ)",
    czechTranslation: "SMS, WhatsApp, e-maily, audio a video záznamy u soudu",
    shortDefinition: "Elektronická komunikace a audiovizuální nahrávky sloužící jako plnohodnotné důkazní prostředky v opatrovnickém řízení.",
    definition: "Podle § 125 OSŘ může za důkaz sloužit vše, co může přispět k objasnění věci. SMS zprávy, e-maily, zprávy z komunikačních aplikací (WhatsApp, Messenger), záznamy z kalendářů i audio/video nahrávky předávání dětí jsou soudy běžně akceptovány k prokázání maření styku nebo agresivity.",
    importanceInCourt: "Otec musí veškerou komunikaci ukládat a přepisovat. Slušná komunikace otce v kontrastu s vulgárními či odmítavými zprávami matky tvoří klíčový důkaz.",
    context: "§ 125 občanského soudního řádu (OSŘ); judikatura Ústavního soudu k použitelnosti zvukových nahrávek v opatrovnickém řízení.",
    category: "psychology"
  },
  "domaci-nasili-tz": {
    id: "domaci-nasili-tz",
    term: "74. Domácí násilí (§ 198, § 199 TZ)",
    czechTranslation: "Fyzické, psychické či ekonomické týrání osoby žijící ve společném obydlí",
    shortDefinition: "Trestný čin týrání osoby žijící ve společném obydlí nebo týrání svěřené osoby s těžkými dopady na rodinné prostředí.",
    definition: "Domácí násilí zahrnuje opakované fyzické napadání, psychický teror, zastrašování, ekonomickou izolaci či stalking. Pokud je dítě svědkem domácího násilí, jedná se o závažné ohrožení jeho psychického vývoje.",
    importanceInCourt: "Je nutné striktně rozlišovat skutečné domácí násilí od účelově smyšlených nařčení při rozvodu. Skutečný pachatel nemůže mít dítě ve výhradní péči bez terapeutické nápravy.",
    context: "§ 198 a § 199 trestního zákoníku (TZ); § 215a TZ; zákon č. 135/2006 Sb.",
    category: "psychology"
  },
  "terapeuticka-intervence-narizena": {
    id: "terapeuticka-intervence-narizena",
    term: "75. Terapeutická intervence nařízená soudem (§ 926 OZ)",
    czechTranslation: "Soudně uložená odborná psychologická či rodinná péče pro rodiče a děti",
    shortDefinition: "Soudní příkaz ukládající rodičům nebo dítěti povinnost podrobit se odborné psychologické terapii k obnově vztahů.",
    definition: "Pokud je vztah mezi dítětem a otcem narušen v důsledku manipulace nebo dlouhodobé odluky, soud uloží podle § 926 OZ výchovné opatření spočívající v povinné rodinné či individuální terapii v odborném pracovišti (např. poradna pro rodinu).",
    importanceInCourt: "Otec navrhuje toto opatření v případech, kdy matka odmítá dobrovolnou terapii. Nesoučinnost matky s terapeutem zakládá její procesní nepoctivost.",
    context: "§ 926 občanského zákoníku (OZ); § 100 odst. 3 občanského soudního řádu (OSŘ).",
    category: "psychology"
  },
  "syndrom-can": {
    id: "syndrom-can",
    term: "76. Syndrom CAN (ohrožení vývoje dítěte)",
    czechTranslation: "Syndrom týraného, zneužívaného a zanedbávaného dítěte",
    shortDefinition: "Child Abuse and Neglect – souhrnný odborný název pro jakékoliv nenáhodné, psychické, fyzické či sociální poškozování dítěte.",
    definition: "Syndrom CAN zahrnuje fyzické týrání, emocionální/psychické týrání (včetně závažné alienace a zatahování do konfliktů), sexuální zneužívání a zanedbávání péče. Psychická manipulace dítěte proti otci je uznávanou formou psychického týrání dle CAN.",
    importanceInCourt: "Poukaz na to, že soustavné vymazávání otce ze života dítěte spadá pod psychickou formu CAN a vyžaduje neodkladnou ochranu OSPODu a soudu.",
    context: "Klinická diagnostika v pedopsychiatrii a dětské psychologii; Standardy kvality OSPOD.",
    category: "psychology"
  },
  "resilience-psychicka-odolnost": {
    id: "resilience-psychicka-odolnost",
    term: "77. Resilience / Psychická odolnost dítěte",
    czechTranslation: "Schopnost dítěte zvládat zátěžové životní situace a adaptovat se",
    shortDefinition: "Psychologická schopnost dítěte adaptovat se na změny, překonávat stresové situace a rozvíjet se i při rozpadu rodiny.",
    definition: "Resilience popisuje psychickou odolnost dětí. Vědecké výzkumy (Nielsen 2018) ukazují, že děti ve střídavé péči vykazují vyšší míru resilience a lepší zvládání stresu než děti ve výhradní péči, jelikož mají oporu v obou rodičích.",
    importanceInCourt: "Argument proti tvrzení matky, že střídavá péče 'dítě traumatizuje a stěhování nezvládne'. Výzkumy prokazují, že dvě pečující náruče zvyšují odolnost dítěte.",
    context: "Prof. Linda Nielsen (2018); vývojová psychologie dětského stresu.",
    category: "psychology"
  },
  "konfliktni-rozvod": {
    id: "konfliktni-rozvod",
    term: "78. Konfliktní rozvod / High-conflict divorce",
    czechTranslation: "Vysoce konfliktní rozvod s intenzivními právními a osobními spory",
    shortDefinition: "Rozvodové a opatrovnické řízení charakterizované chronickým nepřátelstvím, opakovanými žalobami a neschopností kompromisu.",
    definition: "High-conflict divorce představuje stav, kdy rodiče nedokáží oddělit své partnerské zklamání od rodičovské role. Projevuje se záplavou podání, trestních oznámení, stížností na OSPOD a zneužíváním dětí jako rukojmích.",
    importanceInCourt: "Soudy často nesprávně zamítají střídavou péči s odkazem na 'konflikt mezi rodiči'. Ústavní soud však jasně judikoval, že samotný nesouhlas či konflikt způsobený jedním rodičem nesmí být důvodem k zamítnutí střídavé péče!",
    context: "Nálezy Ústavního soudu I. ÚS 2482/13, I. ÚS 1506/13, III. ÚS 1206/09.",
    category: "psychology"
  },
  "mediovana-dohoda": {
    id: "mediovana-dohoda",
    term: "79. Mediovaná dohoda (Zákon o mediaci)",
    czechTranslation: "Dobrovolná písemná dohoda rodičů dosáhnutá za účasti mediátora",
    shortDefinition: "Písemná dohoda upravující péči, styk či výživné dojednaná rodiči za pomoci zapsaného mediátora.",
    definition: "Mediovaná dohoda vzniká v procesu mediace dle zákona č. 202/2012 Sb. Pokud je následně předložena opatrovnickému soudu a schválena rozsudkem, stává se plně vykonatelným exekučním titulem.",
    importanceInCourt: "Aktivní přístup otce k mediaci je hodnocen vysoce pozitivně. Pokud je schválena soudem, poskytuje stabilní podklad pro budoucnost.",
    context: "Zákon č. 202/2012 Sb., o mediaci; § 906 občanského zákoníku (OZ).",
    category: "psychology"
  },
  "krizova-intervence": {
    id: "krizova-intervence",
    term: "80. Krizová intervence",
    czechTranslation: "Okamžitá odborná psychologická pomoc v akutní krizové situaci",
    shortDefinition: "Specializovaná psychologická a sociální pomoc poskytovaná bezprostředně po vysoce traumatizující události v rodině.",
    definition: "Krizová intervence je časově omezená odborná péče zaměřená na zklidnění, stabilizaci a zamezení rozvoje posttraumatického stresu u dítěte či rodiče (např. při náhlém odebrání dítěte, konfliktním předání či vyhnání z domova).",
    importanceInCourt: "Otec využívá krizová centra při náhlém odříznutí od dítěte k získání odborné zprávy o krizovém stavu a podporu pro podání předběžného opatření.",
    context: "Zákon č. 108/2006 Sb., o sociálních službách; krizová stanoviště a linky bezpečí.",
    category: "psychology"
  },
  "sekundarni-viktimizace-ditete": {
    id: "sekundarni-viktimizace-ditete",
    term: "81. Sekundární viktimizace dítěte (judikatura ÚS)",
    czechTranslation: "Druhotné zraňování dítěte opakovanými výslechy a zdlouhavým řízením",
    shortDefinition: "Zbytečné prohlubování traumatu dítěte opakovanými výslechy na policiích, OSPODech a soudech.",
    definition: "Sekundární viktimizace nastává, když orgány veřejné moci (soudy, policie, OSPOD) neodborným postupem, opakovanými výslechy a protahováním sporu vystavují dítě chronickému stresu a pocitům viny. Ústavní soud požaduje šetrný výslech dítěte na jednom bezpečném místě.",
    importanceInCourt: "Otec se staví proti zbytečným opakovaným výslechům dítěte na OSPODu či Policii ČR a žádá jednorázové šetrné slyšení za účasti odborníka.",
    context: "Nálezy Ústavního soudu k ochraně práv dítěte v soudním řízení; § 102 trestního řádu (TŘ).",
    category: "psychology"
  },
  "psychologicka-diagnostika-rodiny": {
    id: "psychologicka-diagnostika-rodiny",
    term: "82. Psychologická diagnostika rodiny",
    czechTranslation: "Odborné psychologické vyšetření vlastností a vztahů v rodině",
    shortDefinition: "Komplexní soubor psychodiagnostických metod určený k mapování osobnosti, inteligence a interakcí v rodině.",
    definition: "Zahrnuje projektivní testy (Rorschach, TAT, kresba rodiny), dotazníky osobnosti (MMPI-2, NEO), strukturované rozhovory a pozorování interakce rodiče s dítětem. Provádí ji dětský klinický psycholog nebo soudní znalec.",
    importanceInCourt: "Objektivní psychologická diagnostika dokáže odhalit poruchy osobnosti (např. hraniční porucha, narcismus) u manipulativního rodiče.",
    context: "Standardní klinicko-psychologická metodika vyžadovaná podle zákona č. 254/2019 Sb.",
    category: "psychology"
  },
  "psychiatricke-posouzeni-osobnosti": {
    id: "psychiatricke-posouzeni-osobnosti",
    term: "83. Psychiatrické posouzení osobnosti",
    czechTranslation: "Lékařské přezkoumání duševního zdraví a psychopatologie rodiče",
    shortDefinition: "Lékařské vyšetření prováděné psychiatrem zaměřené na přítomnost duševních nemocí, závislostí či klinických poruch.",
    definition: "Na rozdíl od psychologického posudku provádí psychiatrické vyšetření lékař-psychiatr. Zjišťuje přítomnost psychóz, bludných poruch, těžkých depresí, závislostí na alkoholu/drogách či demence, které by vylučovaly schopnost pečovat o dítě.",
    importanceInCourt: "Pokud matka vykazuje známky závažné psychické nemoci či závislosti, otec navrhuje ustanovení znalce z oboru zdravotnictví, odvětví psychiatrie.",
    context: "§ 127 občanského soudního řádu (OSŘ); znalecká odvětví psychiatrie.",
    category: "psychology"
  },
  "zapis-o-prubehu-setkani-pms": {
    id: "zapis-o-prubehu-setkani-pms",
    term: "84. Zápis o průběhu setkání - PMS",
    czechTranslation: "Oficiální zpráva Probační a mediační služby o výsledku jednání",
    shortDefinition: "Protokolovaný dokument vypracovaný střediskem Probační a mediační služby zachycující průběh a výsledky mimosoudního jednání.",
    definition: "PMS vyhotovuje zprávu pro soud nebo státního zástupce o tom, zda se rodiče dostavili, jaká byla jejich ochota ke kompromisu a zda byla uzavřena dohoda či splátkový kalendář dlužného výživného.",
    importanceInCourt: "Zpráva PMS dokládá konstruktivní přístup otce a jeho ochotu řešit spor smírnou cestou.",
    context: "Zákon č. 257/2000 Sb., o Probační a mediační službě.",
    category: "subjects"
  },
  "detsky-hnev-a-selektivni-mutismus": {
    id: "detsky-hnev-a-selektivni-mutismus",
    term: "85. Dětský hněv a selektivní mutismus (MKN-10/11)",
    czechTranslation: "Psychické reakce a bloky dětí vyvolané traumatickým konfliktem rodičů",
    shortDefinition: "Nervové a psychické poruchy dětí způsobené těžkým rozvodovým stresem a nátlakem rezidentního rodiče.",
    definition: "Selektivní mutismus (MKN-10 F94.0) je úzkostná porucha, kdy dítě ztratí schopnost mluvit v určitých situacích (např. u předávání nebo před soudem/OSPODem). Dětský hněv bývá obranným mechanismem dítěte vkleštěného do konfliktu loajality.",
    importanceInCourt: "Důkaz, že zaryté mlčení nebo hněv dítěte vůči otci není 'přirozeným odmítnutím', ale vážným psychosomatickým symptomerem psychického přetížení ze strany matky.",
    context: "Mezinárodní klasifikace nemocí MKN-10 / MKN-11; pedopsychiatrická diagnostika.",
    category: "psychology"
  },

  // ==========================================
  // 6. FINANCE, MAJETEK A VÝKON ROZHODNUTÍ (86–100)
  // ==========================================
  "vyzivne-alimenty-oz": {
    id: "vyzivne-alimenty-oz",
    term: "86. Výživné - Alimenty (§ 913 OZ)",
    czechTranslation: "Zákonná finanční vyživovací povinnost rodičů k dětem",
    shortDefinition: "Právně vymahatelná povinnost obou rodičů zabezpečovat výživu a životní úroveň dětí úměrně svým možnostem.",
    definition: "Výživné kryje stravu, bydlení, ošacení, vzdělávání, zdravotní potřeby a volnočasové aktivity. Dítě má právo podílet se na životní úrovni svých rodičů (§ 915 OZ). Ve střídavé péči se výživné určuje oběma rodičům se zohledněním času péče a příjmů.",
    importanceInCourt: "Ve střídavé péči otec trvá na spravedlivém stanovení výživného dle doporučujících tabulek Ministerstva spravedlnosti s přesným zápočtem dnů péče.",
    context: "§ 910 až § 923 občanského zákoníku (OZ); Doporučující tabulky MS ČR pro určování výše výživného.",
    category: "finance"
  },
  "oduvodnene-potreby-ditete": {
    id: "oduvodnene-potreby-ditete",
    term: "87. Odůvodněné potřeby dítěte (§ 915 OZ)",
    czechTranslation: "Rozsah finančních nákladů odpovídající věku a zájmům dítěte",
    shortDefinition: "Souhrn odůvodněných životních, vzdělávacích a zájmových potřeb dítěte zohledňovaný při výpočtu výživného.",
    definition: "Odůvodněné potřeby se odvíjí od věku dítěte, jeho zdravotního stavu, školních nároků, kroužků a talentu. Soud zkoumá, které výdaje jsou účelné a přiměřené majetkovým poměrům rodiny.",
    importanceInCourt: "Otec předkládá doklady o tom, co přesně dítěti přímo kupuje (oblečení, elektronika, kroužky, tábory), čímž snižuje měsíční platbu k rukám matky.",
    context: "§ 913 a § 915 občanského zákoníku (OZ).",
    category: "finance"
  },
  "schopnosti-moznosti-a-majetkove-pomery": {
    id: "schopnosti-moznosti-a-majetkove-pomery",
    term: "88. Schopnosti, možnosti a majetkové poměry rodiče (§ 913 odst. 2 OZ)",
    czechTranslation: "Celkový majetkový a výdělečný potenciál posuzovaný soudem",
    shortDefinition: "Kritérium posuzování příjmů, majetku a reálného výdělečného potenciálu rodiče bez ohledu na umělé snižování příjmů.",
    definition: "Soud nehodnotí pouze oficiální daňové přiznání či čistou mzdu, ale zkoumá celkový majetkový stav (nemovitosti, úspory, auta) a potenciál na trhu práce. Pokud se rodič bezdůvodně vzdá výhodného zaměstnání, soud vychází z možného příjmu.",
    importanceInCourt: "Pokud matka pracovat může, ale účelově se vyhýbá práci nebo pracuje načerno, otec navrhuje posouzení jejího výdělečného potenciálu.",
    context: "§ 913 odst. 2 občanského zákoníku (OZ); judikatura Ústavního soudu k potenciálu příjmů.",
    category: "finance"
  },
  "mimoradne-vydaje-na-dite": {
    id: "mimoradne-vydaje-na-dite",
    term: "89. Mimořádné výdaje na dítě (§ 915 odst. 1 OZ)",
    czechTranslation: "Nárazové vysoké náklady nad rámec běžného měsíčního výživného",
    shortDefinition: "Náklady vysoké hodnoty (rovnátka, zdravotní pomůcky, letní tábory, lyžařské kurzy), které přesahují běžné měsíční výživné.",
    definition: "Mimořádné výdaje nebyly předvídatelné při stanovení běžného výživného. Rodiče by se na jejich úhradě měli předem dohodnout a hradit je poměrně podle svých příjmů a majetku.",
    importanceInCourt: "Otec dbá na to, aby v rozsudku či dohodě byla přesně uvedena povinnost matky předem konzultovat a spolufinancovat mimořádné výdaje.",
    context: "§ 915 odst. 1 občanského zákoníku (OZ); judikatura k mimořádným výdajům.",
    category: "finance"
  },
  "vzajemne-zapocteni-vyzivneho": {
    id: "vzajemne-zapocteni-vyzivneho",
    term: "90. Vzájemné započtení výživného ve střídavé péči (rozsudek NS 20 Cdo 3524/2015)",
    czechTranslation: "Finanční vyrovnání alimentů mezi rodiči při rovnocenné péči",
    shortDefinition: "Právní mechanizmus započtení vzájemných vyživovacích povinností obou rodičů při rovnocenné střídavé péči.",
    definition: "Při střídavé péči 50/50 a srovnatelných příjmech rodičů soud buď stanovení výživného neuloží žádnému z rodičů, nebo určí výživné oběma rodičům navzájem, přičemž dochází k finančnímu vyrovnání či nulovému saldu.",
    importanceInCourt: "Prevence toho, aby otec při plné střídavé péči ještě platil matce horentní sumy. Poukázání na judikaturu NS 20 Cdo 3524/2015 chránící spravedlivé rozdělení nákladů.",
    context: "Rozsudek Nejvyššího soudu ČR sp. zn. 20 Cdo 3524/2015; § 913 OZ.",
    category: "finance"
  },
  "vyporadani-sjm-oz": {
    id: "vyporadani-sjm-oz",
    term: "91. Vypořádání SJM (§ 736 OZ)",
    czechTranslation: "Majetkové vypořádání společného jmění manželů po rozvodu",
    shortDefinition: "Zákonný proces rozdělení společného majetku, nemovitostí, úspor a dluhů vzniklých za trvání manželství.",
    definition: "Vypořádání SJM se provádí dohodou rodičů nebo žalobou u soudu do 3 let od právní moci rozvodu. Vychází se ze zásady rovnosti podílů (disparity podílů pouze ze závažných důvodů). Společné jmění nesmí být zaměňováno s opatrovnickým řízením o děti.",
    importanceInCourt: "Oddělení majetku od dětí. Otec odmítá vydírání matky, která podmiňuje souhlas se střídavou péčí ustoupením od majetkových nároků v SJM.",
    context: "§ 736 až § 742 občanského zákoníku (OZ).",
    category: "finance"
  },
  "navrh-na-vykon-rozhodnuti-exekuce-styku": {
    id: "navrh-na-vykon-rozhodnuti-exekuce-styku",
    term: "92. Návrh na výkon rozhodnutí - Exekuce styku (§ 502 ZŘS)",
    czechTranslation: "Právní vynucení dodržování rozsudku o styku či péči přes soud",
    shortDefinition: "Soudní exekuční řízení k vynucení nepeněžité povinnosti předat dítě či umožnit styk podle vykonatelného titulu.",
    definition: "Pokud matka nerespectuje pravomocný či vykonatelný rozsudek a nepředává dítě otci, otec podá návrh na výkon rozhodnutí k opatrovnickému soudu dle § 500 a násl. ZŘS. Soud vydá výzvu k dobrovolnému plnění, následně ukládá pokuty a může nařídit odnětí dítěte.",
    importanceInCourt: "Rychlá a nekompromisní reakce na maření styku. Písemný návrh na výkon rozhodnutí je nutným krokem k vymáhání otcovských práv.",
    context: "§ 492 až § 507 zákona o zvláštních řízeních soudních (ZŘS).",
    category: "finance"
  },
  "sankcni-pokuty-za-mareni-styku": {
    id: "sankcni-pokuty-za-mareni-styku",
    term: "93. Sankční pokuty za maření styku (§ 351 OSŘ)",
    czechTranslation: "Finanční tresty ukládané soudem rodiči blokujícímu kontakt",
    shortDefinition: "Finanční majetkové sankce až do výše 50 000 Kč ukládané soudem rodiči, který opakovaně porušuje soudní rozhodnutí.",
    definition: "Při výkonu rozhodnutí v opatrovnických věcech může soud matce (či nepoctivému rodiči) uložit za každé jednotlivé zmaření styku pokutu až do 50 000 Kč. Pokuty připadají státu a lze je ukládat opakovaně.",
    importanceInCourt: "Sankční pokuty představují reálný ekonomický tlak na mařícího rodiče. Prokazují, že stát nenechá svévoli bez trestu.",
    context: "§ 502 zákona o zvláštních řízeních soudních (ZŘS); § 351 OSŘ.",
    category: "finance"
  },
  "nahrada-ujmy-zpusobena-marenim-styku": {
    id: "nahrada-ujmy-zpusobena-marenim-styku",
    term: "94. Náhrada újmy způsobená mařením styku (§ 2910 OZ)",
    czechTranslation: "Finanční odškodnění imateriální újmy a marných nákladů otce",
    shortDefinition: "Právní nárok otce na náhradu majetkové škody (marná cesta, storno pobytu) a nemajetkové újmy za maření styku.",
    definition: "Rodič, který protiprávním mařením styku způsobil druhému rodiči škodu (např. zbytečné náklady na benzín, zaplacený dětský tábor, storno dovolené) nebo zásah do osobnostních práv a citové vazby k dítěti, je povinen tuto újmu uhradit dle § 2910 a § 2956 OZ.",
    importanceInCourt: "Podání žaloby na náhradu škody a nemajetkové újmy proti matce je účinným sekundárním nástrojem stopujícím svévolné maření kontaktů.",
    context: "§ 2910, § 2951 a § 2956 občanského zákoníku (OZ); judikatura k náhradě imateriální újmy v rodinném právu.",
    category: "finance"
  },
  "exekucni-titul": {
    id: "exekucni-titul",
    term: "95. Exekuční titul (§ 40 Exekučního řádu)",
    czechTranslation: "Právně vykonatelný podklad pro exekuční či soudní výkon",
    shortDefinition: "Vykonatelné rozhodnutí soudu (rozsudek, usnesení, schválená dohoda, smír), které tvoří podklad pro exekuci.",
    definition: "Exekučním titulem v opatrovnictví je pravomocný či okamžitě vykonatelný rozsudek určující péči, styk či výživné, schválená rodičovská dohoda nebo vykonatelné předběžné opatření. Bez exekučního titulu nelze výkon rozhodnutí nařídit.",
    importanceInCourt: "Otec musí dbát na to, aby každý výrok dohody či rozsudku byl formulován zcela přesně (kdo, kdy, kde, v kolik hodin předává), aby byl exekučním titulem bez pochybností.",
    context: "§ 40 zákona č. 120/2001 Sb. (Exekuční řád); § 274 občanského soudního řádu (OSŘ).",
    category: "finance"
  },
  "dluh-na-vyzivnem": {
    id: "dluh-na-vyzivnem",
    term: "96. Dluh na výživném (§ 921 OZ, § 196 TZ)",
    czechTranslation: "Dlužné alimenty a trestněprávní důsledky neplacení",
    shortDefinition: "Neuhrazené výživné zakládající majetkovou exekuci a při delším neplacení trestní stíhání.",
    definition: "Pokud povinný rodič neplatí výživné stanovené v exekučním titulu, vzniká dluh na výživném. Při neplacení delším než 4 měsíce naplňuje jednání skutkovou podstatu trestného činu zanedbání povinné výživy (§ 196 TZ) s hrozbou nepodmíněného trestu.",
    importanceInCourt: "Otec musí výživné platit vždy řádně a včas na bankovní účet s jasným variabilním symbolem. Při výpadku příjmů musí okamžitě podat návrh na snížení výživného, aby nevznikal dluh.",
    context: "§ 921 občanského zákoníku (OZ); § 196 trestního zákoníku (TZ); exekuce srážkami ze mzdy či pozastavením řidičského oprávnění.",
    category: "finance"
  },
  "zmena-vyse-vyzivneho": {
    id: "zmena-vyse-vyzivneho",
    term: "97. Změna výše výživného (§ 923 OZ)",
    czechTranslation: "Úprava alimentů směrem nahoru či dolů při změně poměrů",
    shortDefinition: "Soudní úprava (zvýšení nebo snížení) výživného na základě prokázané změny poměrů dětí či rodičů.",
    definition: "Změní-li se poměry (např. ztráta zaměstnání rodiče, těžké onemocnění, nebo naopak výrazný růst potřeb dítěte či rozšíření péče otce), soud na návrh výživné upraví. Snížení výživného je možné i zpětně od okamžiku změny poměrů.",
    importanceInCourt: "Při přechodu z výhradní péče matky na střídavou péči otec okamžitě podává návrh na snížení/zrušení původního výživného placeného k rukám matky.",
    context: "§ 923 občanského zákoníku (OZ); § 475 ZŘS.",
    category: "finance"
  },
  "vyzivovaci-povinnost-k-zletilemu-diteti": {
    id: "vyzivovaci-povinnost-k-zletilemu-diteti",
    term: "98. Vyživovací povinnost k zletilému dítěti (§ 911, § 916 OZ)",
    czechTranslation: "Trvání výživného do doby, než je dítě schopno se samo živit",
    shortDefinition: "Vyživovací povinnost rodičů trvající po 18. roku věku až do doby, než je dítě schopno se samostatně živit.",
    definition: "Vyživovací povinnost nekončí automaticky v 18 letech ani v 26 letech, ale trvá po dobu soustavné přípravy na budoucí povolání (studium SŠ, VŠ). Po zletilosti dítěte se výživné platí přímo k rukám zletilého dítěte, nikoli k rukám matky.",
    importanceInCourt: "Po dovršení 18 let dítěte otec poukazuje výživné výhradně na bankovní účet zletilého syna/dcery, nikoliv matce. Případný spor o výživné probíhá přímo mezi otcem a zletilým dítětem.",
    context: "§ 911 a § 916 občanského zákoníku (OZ); judikatura k hranicím vyživovací povinnosti.",
    category: "finance"
  },
  "vyzivne-mezi-rozvedenymi-manzely": {
    id: "vyzivne-mezi-rozvedenymi-manzely",
    term: "99. Výživné mezi rozvedenými manžely (§ 760 OZ)",
    czechTranslation: "Zákonný nárok neprovdaného/neprovdané rozvedené manžela na výživné",
    shortDefinition: "Vyživovací povinnost mezi rozvedenými manžely, pokud jeden z nich není schopen se sám živit z důvodů majících původ v manželství.",
    definition: "Rozvedený manžel, který není schopen sám se živit a tato neschopnost má původ v manželství (např. celodenní péče o malé či postižené dítě), může žádat od bývalého manžela přiměřené výživné. Zpřísněné výživné (sankční) lze přiznat manželovi, který rozvod nezapříčinil a utrpěl vážnou újmu.",
    importanceInCourt: "Otec čelící přemrštěným finančním nárokům ex-manželky dokazuje její reálnou práceschopnost a možnosti uplatnění na trhu práce.",
    context: "§ 760 až § 763 občanského zákoníku (OZ).",
    category: "finance"
  },
  "nouzove-a-socialni-davky": {
    id: "nouzove-a-socialni-davky",
    term: "100. Nouzové a sociální dávky (Zákon č. 111/2006 Sb.)",
    czechTranslation: "Státní sociální podpora a dávky v hmotné nouzi pro samoživitele",
    shortDefinition: "Systém státní sociální podpory (přídavek na dítě, příspěvek na bydlení, rodičovský příspěvek) a pomoci v hmotné nouzi.",
    definition: "Sociální dávky slouží k zajištění základních životních potřeb rodin. Při střídavé péči mají oba rodiče nárok na uplatnění daňového zvýhodnění na dítě (např. střídavě po půlroce nebo na jedno z dětí) a na poměrné posuzování nároku na příspěvky.",
    importanceInCourt: "Otec ve střídavé péči má plné právo žádat státní orgány o daňové úlevy na dítě i sociální dávky a nenechat si tyto výhody monopolizovat matkou.",
    context: "Zákon č. 117/1995 Sb., o státní sociální podpoře; zákon č. 111/2006 Sb., o pomoci v hmotné nouzi; zákon č. 586/1992 Sb., o daních z příjmů (§ 35ba, § 35c).",
    category: "finance"
  },

  // ==========================================
  // 7. TECHNICKÉ A VĚDECKÉ POJMY
  // ==========================================
  "monotropy": {
    id: "monotropy",
    term: "Monotropy / Monotropie",
    czechTranslation: "Teorie jednoho výhradního pečovatele",
    shortDefinition: "Zastaralá a překonaná domněnka, že dítě je v raném věku biologicky naprogramováno se citově vázat pouze k jediné osobě (zpravidla matce).",
    definition: "Monotropie je koncept, který v 50. letech 20. století zavedl John Bowlby. Tvrdil, že kojenci mají vrozenou potřebu se vázat k jedné primární postavě. Moderní vývojová psychologie i sám Bowlby tento koncept opustili jako vědecky neobhájený.",
    importanceInCourt: "OSPOD a znalci staré školy skrytě monotropii uplatňují, když tvrdí, že 'dítě je příliš malé na to, aby bylo bez matky'. Argumentace vyvrácením monotropie (Warshak 2014) ukazuje neaktuálnost jejich dogmat.",
    context: "Warshak (2014) detailně popisuje historii monotropie a mezinárodní vědecký konsenzus odmítající tento koncept.",
    category: "psychology"
  },
  "respite-effect": {
    id: "respite-effect",
    term: "Respite Effect",
    czechTranslation: "Úlevový efekt pro rezidentního rodiče",
    shortDefinition: "Pozitivní psychologický dopad na matku, která si díky střídavému nocování dítěte u otce může odpočinout od nepřetržité péče.",
    definition: "Respite effect popisuje jev, kdy sdílení noční péče s otcem poskytuje matce nezbytný čas na odpočinek, regeneraci, spánek a budování vlastní kariéry. Snižuje riziko vyhoření matky.",
    importanceInCourt: "Soudy často střídavou péči zamítají s tím, že matku stresuje. Poukázáním na vědecky prokázaný 'respite effect' přesvědčíte soud, že střídavá péče pomáhá i matce.",
    context: "Prokázáno v empirické studii Fabricius & Suh (2017).",
    category: "psychology"
  },
  "gatekeeping": {
    id: "gatekeeping",
    term: "Gatekeeping",
    czechTranslation: "Bránění v přístupu k dítěti / 'strážení brány'",
    shortDefinition: "Chování jednoho z rodičů (častěji matky), který se staví do role výhradního strážce dítěte a omezuje či kontroluje přístup druhého rodiče.",
    definition: "Maternal Gatekeeping je psychologický jev, kdy matka vědomě či nevědomě reguluje, omezuje, kritizuje nebo zcela blokuje zapojení otce do péče o dítě.",
    importanceInCourt: "Pokud matka tvrdí, že otec neumí pečovat, přičemž mu sama brání v péči (odmítá dát dítě na noc), jedná se o restriktivní gatekeeping a nedostatek výchovné tolerance.",
    context: "Detailně zkoumáno v pracích Austin, Fieldstone & Pruett (2013).",
    category: "psychology"
  },
  "rbac": {
    id: "rbac",
    term: "RBAC (Role-Based Access Control)",
    czechTranslation: "Řízení přístupu na základě rolí",
    shortDefinition: "Bezpečnostní architektura správy uživatelských oprávnění v systému, kde jsou práva přidělována specifickým rolím.",
    definition: "RBAC zaručuje, že uživatelé mají přístup pouze k těm funkcím a datům, které jsou nezbytné pro výkon jejich role. V ekosystému Synthesis OS zajišťuje ochranu osobních údajů rodičů.",
    importanceInCourt: "Doklad profesionálního zabezpečení dat v souladu s GDPR na portálu Táta má právo.",
    context: "Technická specifikace zabezpečení backendu v administraci portálu Synthesis Hub.",
    category: "technical"
  },
  "api-first": {
    id: "api-first",
    term: "API-First Approach",
    czechTranslation: "Prioritní návrh rozhraní (API-first)",
    shortDefinition: "Architektonická strategie vývoje, kdy je celý systém nejprve navržen jako sada nezávislých rozhraní (API) umožňujících autonomní správy prostřednictvím AI.",
    definition: "API-first přístup umožňuje, aby celá platforma Synthesis OS komunikovala s externími AI agenty, kteří mohou autonomně analyzovat rozsudky a generovat podání.",
    importanceInCourt: "Architektonický pilíř autonomní správy Synthesis OS.",
    context: "Základní filozofie operačního rámce Synthesis OS.",
    category: "technical"
  },

  // Backwards compatibility aliases for unnumbered keys
  "attachment": {
    id: "attachment",
    term: "Attachment (Citová vazba)",
    czechTranslation: "Hluboké emoční pouto dítěte k rodičům",
    shortDefinition: "Hluboké, trvalé citové pouto, které si dítě vytváří ke svým pečovatelům, poskytující mu pocit bezpečí a jistoty.",
    definition: "Attachment je základní koncept moderní vývojové psychologie (Bowlby, Ainsworth). Popisuje, jakým způsobem si kojenci a batolata vytvářejí emocionální vazby k oběma rodičům paralelně. Bezpečný attachment k oběma rodičům je klíčem k odolnosti v dospělosti.",
    importanceInCourt: "Prokazování, že dítě si od prvních měsíců vytváří bezpečný attachment k otci prostřednictvím noční péče a koupání, je nejsilnějším argumentem proti snahám matky o exkluzivitu.",
    context: "Základní pilíř studií prof. Richarda A. Warshaka (2014) a prof. Williama Fabriciuse (2017).",
    category: "psychology"
  },
  "pas-alienace": {
    id: "pas-alienace",
    term: "Rodičovská alienace (PAS)",
    czechTranslation: "Syndrom zavrženého rodiče / popouzení",
    shortDefinition: "Psychický stav, kdy dítě pod vlivem manipulace jednoho rodiče systematicky, bezdůvodně a hluboce odmítá druhého rodiče.",
    definition: "Syndrom zavrženého rodiče (Parental Alienation Syndrome) vzniká v důsledku soustavného popouzení, očerňování a vymývání mozku dítěte ze strany rezidentního rodiče. Dítě přejímá negativní postoje bez vlastní reálné negativní zkušenosti.",
    importanceInCourt: "Těžká psychická patologie. Pokud matka způsobuje alienaci, otec musí vyžadovat okamžitou terapeutickou intervenci nebo změnu výchovného prostředí dětí.",
    context: "Práce Dr. Richarda Gardnera, Dr. Amy Baker; judikatura ÚS k maření kontaktů.",
    category: "psychology"
  },
  "mareni-styku": {
    id: "mareni-styku",
    term: "Maření styku",
    czechTranslation: "Účelové blokování kontaktů dětí s otcem",
    shortDefinition: "Účelové a systematické porušování soudního rozhodnutí nebo dohody ze strany jednoho rodiče, který brání otci v kontaktu s dítětem.",
    definition: "Zahrnuje omlouvání nemoci bez lékařského potvrzení, neodpovídání na telefony, odvážení dětí mimo bydliště v době styku či vyvolávání scén při předávání.",
    importanceInCourt: "Maření styku zakládá důvod pro podání návrhu na výkon rozhodnutí (pokuty), jakož i pro změnu úpravy péče ve prospěch otce pro nedostatek výchovné tolerance matky.",
    context: "§ 501 a násl. ZŘS; § 907 odst. 2 OZ (výchovná tolerance).",
    category: "psychology"
  },
  "falesna-obvineni": {
    id: "falesna-obvineni",
    term: "Falešná obvinění",
    czechTranslation: "Taktické osočení z týrání či zneužívání",
    shortDefinition: "Vykonstruovaná tvrzení z domácího násilí či zneužívání užívaná jako taktický nástroj k odříznutí otce od dítěte.",
    definition: "Častý fenomén vysoce konfliktních rozvodů. Matka podá trestní oznámení či podnět na OSPOD, čímž dosáhne pozastavení styku do doby vyšetření.",
    importanceInCourt: "Vyžaduje chladnou hlavu, okamžitou součinnost s Policií ČR, nabídnutí psychologického vyšetření a pedantskou archivaci veškeré komunikace.",
    context: "§ 345 trestního zákoníku (Křivé obvinění); znalecké dokazování v trestním i opatrovnickém řízení.",
    category: "psychology"
  },
  "znalecky-posudek": {
    id: "znalecky-posudek",
    term: "Znalecký posudek",
    czechTranslation: "Klíčový odborný důkaz v řízení",
    shortDefinition: "Odborný písemný dokument zpracovaný soudním znalcem hodnotící psychiku rodiny, osobnosti rodičů a vazby dětí.",
    definition: "Obsahuje nález, posudek a odpovědi na otázky položené soudem. Znalecký posudek hodnotí rodičovskou způsobilost, přítomnost patologie i nejvhodnější model péče.",
    importanceInCourt: "Pokud posudek obsahuje metodické chyby nebo opomíjí novou vědeckou literaturu, otec má právo žádat výsluch znalce u soudu a předložit oponentní odborné vyjádření.",
    context: "§ 127 a § 127a občanského soudního řádu (OSŘ).",
    category: "psychology"
  },
  "otcovska-deprivace": {
    id: "otcovska-deprivace",
    term: "Otcovská deprivace",
    czechTranslation: "Psychické strádání dětí bez přítomnosti otce",
    shortDefinition: "Psychické, emocionální a sociální strádání dětí v důsledku chybějící přítomnosti a výchovného působení otce.",
    definition: "Děti trpící otcovskou deprivací vykazují vyšší riziko poruch chování, úzkostí, horších školních výsledků a problémů s autoritou v dospívání.",
    importanceInCourt: "Poukazování na otcovskou deprivaci zdůrazňuje, že vytvoření 'otcovské odluky' poškozuje zdravý psychický vývoj dětí.",
    context: "Studie Bauserman (2002), Nielsen (2018), Warshak (2014).",
    category: "psychology"
  },
  "manipulace-s-ditetem": {
    id: "manipulace-s-ditetem",
    term: "Manipulace s dítětem",
    czechTranslation: "Psychický nátlak na dítě vůči druhému rodiči",
    shortDefinition: "Vědomé či nevědomé psychické ovlivňování dítěte rezidentním rodičem s cílem poškodit jeho vztah k otci.",
    definition: "Projevuje se vyvoláváním pocitů viny v dítěti, pokud projeví lásku k otci, předáváním informací z dospělého sporu dětí či odmítáním komunikace.",
    importanceInCourt: "Soudní znalec a OSPOD musí manipulaci identifikovat. Dítě, které odmítá otce bez objektivního důvodu, je obětí psychické manipulace.",
    context: "Práce z dětské psychopatologie; judikatura k ochraně osobnosti dítěte.",
    category: "psychology"
  },
  "digitalni-dukazy": {
    id: "digitalni-dukazy",
    term: "Digitální důkazy",
    czechTranslation: "Elektronická komunikace, SMS, e-maily a audio",
    shortDefinition: "Záznamy elektronické komunikace (SMS, WhatsApp, e-maily, audio/video nahrávky) dokládající realitu rodinných vztahů.",
    definition: "V opatrovnickém řízení hrají digitální důkazy obrovskou roli. Prokazují maření styku, agresivitu matky, nebo naopak faktickou péči otce a fotodokumentaci aktivit s dítětem.",
    importanceInCourt: "Otec musí veškerou komunikaci vést písemně (e-mail, WhatsApp) věcně a slušně. Archivované zprávy jsou neprůstřelným důkazem u soudu.",
    context: "§ 125 občanského soudního řádu (OSŘ - důkazní prostředky).",
    category: "psychology"
  },
  "domaci-nasili": {
    id: "domaci-nasili",
    term: "Domácí násilí",
    czechTranslation: "Fyzický, psychický či ekonomický nátlak v rodině",
    shortDefinition: "Fyzické, psychické, ekonomické či sexuální týrání mezi blízkými osobami v rodině.",
    definition: "V opatrovnických sporech bývá pojem nevážně nálepkován i na běžné partnerské hádky. Je nutné rozlišovat situaci reálného týrání od taktických nařčení.",
    importanceInCourt: "Otec, který čelí nepravdivému nařčení z domácího násilí, musí trvat na znaleckém zkoumání osobnosti obou partnerů a prověření věrohodnosti matky.",
    context: "Zákon č. 135/2006 Sb. (ochrana před domácím násilím); § 215a Trestního zákoníku.",
    category: "psychology"
  },
  "terapeuticka-intervence": {
    id: "terapeuticka-intervence",
    term: "Terapeutická intervence",
    czechTranslation: "Soudem nařízená rodinná či dětská terapie",
    shortDefinition: "Odborná psychologická péče nařízená soudem k obnově narušených vztahů a komunikace mezi dítětem a otcem.",
    definition: "Soud může dle § 920 OZ nařídit rodinnou terapii nebo odbornou péči v neziskové organizaci (např. Triangl, Centrum Locika) k překonání odcizení.",
    importanceInCourt: "Pokud dítě odmítá otce z důvodu manipulace, otec navrhuje soudní nařízení odborné rodinné terapie s povinností matky dítě vodit.",
    context: "§ 920 občanského zákoníku (OZ); § 100 odst. 3 OSŘ.",
    category: "psychology"
  },
  "vyzivne-alimenty": {
    id: "vyzivne-alimenty",
    term: "Výživné (Alimenty)",
    czechTranslation: "Zákonná finanční povinnost k dítěti",
    shortDefinition: "Zákonná povinnost rodičů přispívat na výživu a odůvodněné potřeby dětí dle svých možností a schopností.",
    definition: "Výživné se stanovuje s ohledem na odůvodněné potřeby dětí, majetkové poměry obou rodičů a rozsah péče. Ve střídavé péči se výživné určuje oběma rodičům nebo se vzájemně započítává.",
    importanceInCourt: "Otec musí předložit transparentní přehled příjmů a výdajů na dítě. Ve střídavé péči by výživné mělo odrážet rovnocenný čas strávený s dítětem.",
    context: "§ 910 a násl. občanského zákoníku (OZ); Doporučující tabulky Ministerstva spravedlnosti ČR.",
    category: "finance"
  },
  "schopnosti-a-moznosti": {
    id: "schopnosti-a-moznosti",
    term: "Schopnosti a možnosti rodiče",
    czechTranslation: "Reálný výdělečný a majetkový potenciál",
    shortDefinition: "Reálný majetkový, příjmový a výdělečný potenciál posuzovaný soudem při stanovování výživného.",
    definition: "Soud nehodnotí pouze aktuální čistou mzdu, ale zkoumá, zda se rodič bezdůvodně nevzdal výhodnějšího zaměstnání či majetku (tzv. potenciál příjmů).",
    importanceInCourt: "Pokud matka účelově nepracuje nebo skrývá příjmy, otec navrhuje posouzení jejího výdělečného potenciálu na trhu práce.",
    context: "§ 913 odst. 2 občanského zákoníku (OZ).",
    category: "finance"
  },
  "mimoradne-vydaje": {
    id: "mimoradne-vydaje",
    term: "Mimořádné výdaje",
    czechTranslation: "Náklady nad rámec běžného výživného",
    shortDefinition: "Náklady na letní tábory, rovnátka, lyžařský výcvik či specifickou zdravotní péči nad rámec běžného měsíčního výživného.",
    definition: "Představují nárazové výdaje vysoké hodnoty. Pokud se na nich rodiče nedohodnou, hradí se poměrně dle jejich příjmů nebo jsou zahrnuty v paušálním výživném.",
    importanceInCourt: "V rozsudku nebo dohodě je vhodné přesně definovat, co tvoří mimořádný výdaj a jaký souhlas rodičů je vyžadován před jeho vynaložením.",
    context: "Judikatura k § 913 OZ.",
    category: "finance"
  },
  "vyporadani-sjm": {
    id: "vyporadani-sjm",
    term: "Vypořádání SJM",
    czechTranslation: "Rozdělení společného jmění manželů po rozvodu",
    shortDefinition: "Rozdělení společného majetku a závazků vzniklých za trvání manželství po jeho rozvodu.",
    definition: "SJM lze vypořádat dohodou nebo soudním rozsudkem do 3 let od rozvodu. Dům, byt, úspory i dluhy se dělí rovným dílem, pokud nebylo dohodnuto jinak.",
    importanceInCourt: "SJM by nemělo být směšováno s opatrovnickým řízením o děti, matky však majetek často zneužívají jako páku pro ústupky v péči o děti.",
    context: "§ 736 a násl. občanského zákoníku (OZ).",
    category: "finance"
  },
  "vykon-rozhodnuti": {
    id: "vykon-rozhodnuti",
    term: "Návrh na výkon rozhodnutí",
    czechTranslation: "Exekuční vymáhání dodržování styku či péče",
    shortDefinition: "Soudní exekuční vymáhání plnění povinností stanovených v rozsudku (např. při maření styku nebo neplacení výživného).",
    definition: "Pokud matka nepředává dítě k otci v souladu s vykonatelným rozsudkem či předběžným opatřením, otec podává k okresnímu soudu návrh na výkon rozhodnutí dle § 500 ZŘS.",
    importanceInCourt: "Klíčový nástroj vynucení práva. Soud nejprve vyzve matku k dobrovolnému plnění, následně ukládá pokuty až do 50 000 Kč a může nařídit odnětí dítěte.",
    context: "§ 492 a násl. zákona o zvláštních řízeních soudních (ZŘS).",
    category: "finance"
  },
  "sankcni-pokuty": {
    id: "sankcni-pokuty",
    term: "Sankční pokuty",
    czechTranslation: "Finanční tresty za opakované maření styku",
    shortDefinition: "Finanční tresty ukládané soudem rodiči, který opakovaně a bezdůvodně maří styk dětí s druhým rodičem.",
    definition: "Soud může při výkonu rozhodnutí uložit mařícímu rodiči opakovaně pokutu až do výše 50 000 Kč za každé jednotlivé porušení rozsudku.",
    importanceInCourt: "Ukládání pokut matce je jasným signálem, že stát netoleruje svévoli a porušování práv dětí a otce na kontakt.",
    context: "§ 502 zákona o zvláštních řízeních soudních (ZŘS).",
    category: "finance"
  },
  "zmena-pomeru-alias": {
    id: "zmena-pomeru-alias",
    term: "Změna poměrů",
    czechTranslation: "Zákonný předpoklad pro nové rozhodnutí soudu",
    shortDefinition: "Zákonná podmínka (§ 990 OZ), za které lze podat nový návrh na změnu dřívějšího pravomocného rozhodnutí o péči nebo výživném.",
    definition: "Změnou poměrů je např. dospívání dětí, nástup do školy, změna příjmů rodičů, změna bydliště nebo zjištění, že stávající výhradní péče dětem neprospívá.",
    importanceInCourt: "Otec, který má v minulosti stanovený pouze úzký styk, může s odkazem na věk dětí a novou judikaturu podat návrh na změnu poměrů a svěření dětí do střídavé péče.",
    context: "§ 990 občanského zákoníku (OZ); § 475 ZŘS.",
    category: "finance"
  },

  // ==========================================
  // 6. TECHNICKÉ A VĚDECKÉ POJMY
  // ==========================================
  "monotropy-scientific": {
    id: "monotropy-scientific",
    term: "Monotropy / Monotropie",
    czechTranslation: "Teorie jednoho výhradního pečovatele",
    shortDefinition: "Zastaralá a překonaná domněnka, že dítě je v raném věku biologicky naprogramováno se citově vázat pouze k jediné osobě (zpravidla matce).",
    definition: "Monotropie je koncept, který v 50. letech 20. století zavedl John Bowlby. Tvrdil, že kojenci mají vrozenou potřebu se vázat k jedné primární postavě. Moderní vývojová psychologie i sám Bowlby tento koncept opustili jako vědecky neobhájený.",
    importanceInCourt: "OSPOD a znalci staré školy skrytě monotropii uplatňují, když tvrdí, že 'dítě je příliš malé na to, aby bylo bez matky'. Argumentace vyvrácením monotropie (Warshak 2014) ukazuje neaktuálnost jejich dogmat.",
    context: "Warshak (2014) detailně popisuje historii monotropie a mezinárodní vědecký konsenzus odmítající tento koncept.",
    category: "psychology"
  },
  "respite-effect-scientific": {
    id: "respite-effect-scientific",
    term: "Respite Effect",
    czechTranslation: "Úlevový efekt pro rezidentního rodiče",
    shortDefinition: "Pozitivní psychologický dopad na matku, která si díky střídavému nocování dítěte u otce může odpočinout od nepřetržité péče.",
    definition: "Respite effect popisuje jev, kdy sdílení noční péče s otcem poskytuje matce nezbytný čas na odpočinek, regeneraci, spánek a budování vlastní kariéry. Snižuje riziko vyhoření matky.",
    importanceInCourt: "Soudy často střídavou péči zamítají s tím, že matku stresuje. Poukázáním na vědecky prokázaný 'respite effect' přesvědčíte soud, že střídavá péče pomáhá i matce.",
    context: "Prokázáno v empirické studii Fabricius & Suh (2017).",
    category: "psychology"
  },
  "gatekeeping-scientific": {
    id: "gatekeeping-scientific",
    term: "Gatekeeping",
    czechTranslation: "Bránění v přístupu k dítěti / 'strážení brány'",
    shortDefinition: "Chování jednoho z rodičů (častěji matky), který se staví do role výhradního strážce dítěte a omezuje či kontroluje přístup druhého rodiče.",
    definition: "Maternal Gatekeeping je psychologický jev, kdy matka vědomě či nevědomě reguluje, omezuje, kritizuje nebo zcela blokuje zapojení otce do péče o dítě.",
    importanceInCourt: "Pokud matka tvrdí, že otec neumí pečovat, přičemž mu sama brání v péči (odmítá dát dítě na noc), jedná se o restriktivní gatekeeping a nedostatek výchovné tolerance.",
    context: "Detailně zkoumáno v pracích Austin, Fieldstone & Pruett (2013).",
    category: "psychology"
  },
  "rbac-technical": {
    id: "rbac-technical",
    term: "RBAC (Role-Based Access Control)",
    czechTranslation: "Řízení přístupu na základě rolí",
    shortDefinition: "Bezpečnostní architektura správy uživatelských oprávnění v systému, kde jsou práva přidělována specifickým rolím.",
    definition: "RBAC zaručuje, že uživatelé mají přístup pouze k těm funkcím a datům, které jsou nezbytné pro výkon jejich role. V ekosystému Synthesis OS zajišťuje ochranu osobních údajů rodičů.",
    importanceInCourt: "Doklad profesionálního zabezpečení dat v souladu s GDPR na portálu Táta má právo.",
    context: "Technická specifikace zabezpečení backendu v administraci portálu Synthesis Hub.",
    category: "technical"
  },
  "api-first-technical": {
    id: "api-first-technical",
    term: "API-First Approach",
    czechTranslation: "Prioritní návrh rozhraní (API-first)",
    shortDefinition: "Architektonická strategie vývoje, kdy je celý systém nejprve navržen jako sada nezávislých rozhraní (API) umožňujících autonomní správy prostřednictvím AI.",
    definition: "API-first přístup umožňuje, aby celá platforma Synthesis OS komunikovala s externími AI agenty, kteří mohou autonomně analyzovat rozsudky a generovat podání.",
    importanceInCourt: "Architektonický pilíř autonomní správy Synthesis OS.",
    context: "Základní filozofie operačního rámce Synthesis OS.",
    category: "technical"
  }
};
