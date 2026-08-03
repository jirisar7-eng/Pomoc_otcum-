export interface Situace {
  slug: string;
  title: string;
  description: string;
  icon: string;
  content: string;
}

export const situaceData: Situace[] = [
  {
    slug: 'sjm',
    title: 'SJM & Majetkové vypořádání',
    description: 'Ochrana před vybráním společných účtů (§ 710, § 736 OZ), krizový osobní rozpočet, tabulky výživného MS ČR, výživné na manžela (§ 760 OZ) a řešení neoprávněných dluhů.',
    icon: 'Wallet',
    content: `
### Krizová opatření při vypořádání SJM a ochraně financí

Při rozpadu manželství nebo partnerského soužití je jedním z nejakutnějších kroků okamžitá stabilizace finančního zázemí a ochrana majetkových hodnot. Společné jmění manželů (SJM) zahrnuje veškerý majetek i závazky nabyté za trvání manželství s výjimkou dědictví či darů.

#### 1. Ochrana před vybráním společných účtů (§ 710, § 736 OZ)
* **Odebrání dispozičních práv:** Okamžitě odeberte plné moci a dispoziční práva druhého manžela k vašim osobním účtům u všech bankovních ústavů.
* **Zřízení nového samostatného účtu:** Požádejte zaměstnavatele o zasílání mzdy na nový bankovní účet vedený výhradně na vaše jméno u jiné banky.
* **Společné účty a kreditní karty:** Písemně požádejte banku o blokaci kontokorentů, kreditních karet a zamezení čerpání nových úvěrů bez souhlasu obou manželů. Všechny neoprávněné výběry ze společných účtů pečlivě zdokumentujte pro vypořádání SJM (§ 736 OZ).

#### 2. Krizový osobní rozpočet a tabulky výživného MS ČR
* **Sestavení krizového rozpočtu:** Zmapujte všechny fixní náklady na bydlení, energii, potraviny, zdravotní péči a kroužky dětí. Vytvořte rezervu na neplánované výdaje spojené s právním zastoupením.
* **Doporučující tabulky výživného MS ČR:** Pro stanovení reálné výše výživného vycházejte z oficiální metodiky Ministerstva spravedlnosti ČR. Výživné se pohybuje v rozmezí 14 % až 20 % čistého příjmu povinného rodiče podle věku dítěte (např. 14–16 % pro věk 0–5 let, 16–18 % pro 6–9 let, 18–20 % pro 10–14 let a 20–22 % pro 15 a více let).
* **Zohlednění střídavé péče:** Při střídavé péči se výživné určuje oběma rodičům se zohledněním rozsahu péče a jejich příjmových poměrů.

#### 3. Výživné na rozvedeného manžela (§ 760 OZ)
* Rozvedený manžel, který není schopen sám se živit a tato neschopnost má svůj původ v manželství nebo v souvislosti s ním (např. dlouhodobá péče o společné děti), má právo požadovat přiměřené výživné od druhého manžela.
* Právo na výživné rozvedeného manžela zaniká uzavřením nového manželství nebo vstupem do registrovaného partnerství.

#### 4. Neoprávněné dluhy a řešení společné hypotéky
* **Prevence neoprávněných dluhů (§ 710 OZ):** Závazky převzaté jedním manželem bez souhlasu druhého zakládají povinnost pouze tohoto manžela, pokud přesahují míru odpovídající majetkovým poměrům rodiny. Pokud zjistíte neodůvodněné zadlužování druhým manželem, písemně vyjádřete nesouhlas vůči věřiteli bez zbytečného odkladu.
* **Hrazení hypotéky po rozchodu:** Pokud jeden z manželů zůstává v nemovitosti a hradí hypotéku sám, tyto platby se započítávají v rámci konečného vypořádání SJM jako vnos či zápočet (§ 742 OZ).
`
  },
  {
    slug: 'psychicka-podpora',
    title: 'Psychická podpora & Prevence',
    description: 'Zvládání krizového stresu, pravidlo 24 hodin na zprávy, odkaz na judikaturu ÚS II. ÚS 2943/14, kontakty na krizové linky (116 123) a psychohygiena.',
    icon: 'Brain',
    content: `
### Psychická stabilizace v krizovém období rozchodu

Rozchod a opatrovnické spory představují extrémní zátěž pro psychiku rodiče. Zachování chladné hlavy, emoční vyrovnanosti a fyzického zdraví je zásadním předpokladem pro úspěšné zvládnutí opatrovnického řízení i pro vytvoření bezpečného prostředí pro vaše děti.

#### 1. Zvládání krizového stresu a seberegulace
* Emoční vypětí v krizovém období narušuje racionální úsudek. Využívejte dechová cvičení, krátké pauzy před reakcí a fyzickou aktivitu k vyplavení stresových hormonů.
* Nenechte se vmanipulovat do hněvivých konfliktů před dětmi ani v písemné komunikaci.

#### 2. Pravidlo 24 hodin na odpověď
* Na konfrontační, útočné nebo provokativní zprávy druhého rodiče **nikdy neodpovídejte v afektu**.
* Počkejte 24 hodin, až emoce opadnou, a zprávu zformulujte věcně, stručně a neutrálně podle BIFF metody.
* Pamatujte, že veškerá písemná komunikace může být předložena opatrovnickému soudu nebo OSPOD jako důkaz o vašich výchovných předpokladech.

#### 3. Judikatura Ústavního soudu ČR (Nález II. ÚS 2943/14)
* Ústavní soud ČR v Nálezu II. ÚS 2943/14 zdůraznil právo obou rodičů na rovnocennou péči o dítě a povinnost obecných soudů chránit duševní integritu rodičů i dětí před svévolnými zásahy a mařením rodičovského kontaktu.
* Důležité je nevzdávat se a vyžadovat dodržování právních garancí péče.

#### 4. Kontakty na krizové linky a odborná pomoc
* **Linka první psychické pomoci:** Bezplatná anonymní linka 116 123 dostupná 24/7.
* **Linka bezpečí (pro děti a mládež):** 116 111.
* **Krizová centra a psychoterapie:** Vyhledání odborné psychologické péče je znakem zralosti a odpovědnosti rodiče, nikoliv slabosti.

#### 5. Fyzická psychohygiena a podpora
* Udržujte pravidelný spánkový režim, kvalitní stravování a každodenní fyzický pohyb.
* Budujte síť podpory mezi přáteli a rodinou, ale vyvarujte se rozebírání detailů soudu před dětmi.
`
  },
  {
    slug: 'jak-mluvit-s-ditetem',
    title: 'Jak mluvit s dítětem',
    description: 'Citlivá komunikace o rozchodu, věkově přiměřené vysvětlení situace, ochrana před vtažením dětí do sporu rodičů a sejmutí pocitu viny.',
    icon: 'Heart',
    content: `
### Průvodce citlivým rozhovorem s dítětem o rozchodu

Dítě nesmí se stát rukojmím ani nástrojem v boji dospělých. Způsob, jakým mu rozchod rodičů vysvětlíte, zásadně ovlivní jeho psychický vývoj, pocit bezpečí a důvěru k oběma rodičům.

#### 1. Základní principy komunikace a sejmutí pocitu viny
* **Absolutní ujištění o lásce:** Dítě musí slyšet a cítit: „Oba tě máme moc rádi a vždycky pro tebe zůstaneme mámou a tátou.“
* **Sejmutí pocitu viny:** Děti mají tendenci přikládat rozpad rodiny za vinu sobě. Opakovaně jim zdůrazňujte: „Ty za nic nemůžeš, je to rozhodnutí dospělých.“
* **Ochrana před vtažením do sporu:** Nikdy nevystavujte dítě soudním dokumentům, nepředávejte přes ně vzkazy a nezpovídávejte je z toho, co se děje u druhého rodiče.

#### 2. Formulace přiměřené věku dítěte
* **Předškolní věk (3–6 let):** „Máma a táta budou teď bydlet ve dvou domech. Budeš mít svůj pokojíček u mámy i u táty a oba s tebou budeme pořád. Naše láska k tobě se vůbec nemění.“
* **Školní věk (7–11 let):** „S mámou jsme se rozhodli žít odděleně, protože se už nedokážeme dohodnout jako dospělí. Ale oba zůstáváme tvými rodiči naplno. O tvé škole, kroužcích i prázdninách se budeme domlouvat tak, aby ti nic nechybělo.“
* **Dospívající (12–16 let):** „Chápeme, že je to pro tebe těžké a možná se zlobíš. Respektujeme tvůj názor i tvé zájmy. Naše dospělé spory jsou naše věc a nechceme tě do nich zatahovat. Kdykoliv budeš potřebovat, jsem tu pro tebe.“

#### 3. Zákaz očerňování druhého rodiče
* Nikdy nezpochybňujte autoritu ani lásku druhého rodiče před dětmi. Podpora dobrého vztahu k druhému rodiči je zákonnou i morální povinností.
`
  },
  {
    slug: 'pas',
    title: 'Ochrana před manipulací (PAS)',
    description: 'Rozpoznání syndromu zavrhovaného rodiče (PAS), varovné signály v chování, právní obrana a včasná předběžná opatření.',
    icon: 'Shield',
    content: `
### Právní a psychologická obrana před manipulací a zavrhováním rodiče (PAS)

Popouzení dítěte proti druhému rodiči, bezdůvodné rušení předávání dětí a vytváření fiktivních překážek ve styku představuje závažné porušení rodičovské odpovědnosti a práva dítěte na péči obou rodičů.

#### 1. Rozpoznání syndromu zavrhovaného rodiče (PAS) a varovné signály
* **Naučené fráze dospělých:** Dítě opakuje nepřirozené obraty a tvrzení, která neodpovídají jeho věku ani reálným zážitkům s otcem.
* **Extrémní odmítání bez racionálního důvodu:** Dítě projevuje náhlý chlad nebo strach, ačkoliv předtím mělo s otcem vřelý a radostný vztah.
* **Sekundární zisky a manipulace:** Druhý rodič blokuje telefonní hovory, ruší styk pod záminkou „nemoci“ bez lékařského potvrzení nebo vytváří dítěti program v době tátova styku.

#### 2. Právní obrana a včasná předběžná opatření (§ 452 o.s.ř.)
* **Pečlivá dokumentace:** Vedete si přesný deník všech předání, telefonátů, zpráv a případných odmítnutí s časovými razítky a svědectvími.
* **Podání návrhu na předběžné opatření (§ 452 o.s.ř.):** V případě akutního zamezení kontaktu okamžitě podávejte návrh na soudní úpravu styku nebo výkon rozhodnutí uložením pokuty či nařízením odborné péče.
* **Součinnost OSPOD a odborná terapie:** Bezodkladně informujte OSPOD o bránění ve styku a navrhněte mediaci či rodinnou terapii zaměřenou na obnovu vazeb.

#### 3. Klíčová judikatura Ústavního soudu ČR
* **Nález ÚS IV. ÚS 1921/17:** Orgány veřejné moci mají povinnost aktivně konat k obnovení vazeb mezi rodičem a dítětem a nezostávat pasivní.
* **Nález ÚS III. ÚS 149/20:** Systematické popouzení dětí a bránění ve styku je hrubým porušením rodičovských povinností a je právním důvodem pro změnu výchovného prostředí a svěření dítěte do péče druhého rodiče.
`
  },
  {
    slug: 'novy-domov-ospod',
    title: 'Nové bydlení & OSPOD',
    description: 'Standardy nového bydlení pro děti, příprava dětského pokoje, konstruktivní komunikace a součinnost při šetření OSPOD.',
    icon: 'Home',
    content: `
### Příprava nového bydlení, místní šetření OSPOD a státní podpora

Kvalitní a bezpečné bytové zázemí pro děti je základním předpokladem pro přiznání střídavé či společné péče opatrovnickým soudem. Orgán sociálně-právní ochrany dětí (OSPOD) provádí místní šetření za účelem ověření podmínek pro výchovu dětí.

#### 1. Standardy nového bydlení pro děti
* **Samostatné stálé lůžko:** Každé dítě musí mít v novém bydlení vlastní kvalitní postel s matrací, roštem a lůžkovinami.
* **Studijní koutek:** Psací stůl se židlí, adekvátním osvětlením a úložným prostorem pro školní potřeby a knihy.
* **Skříň a osobní věci:** Dostatek úložného prostoru pro oblečení, obuv, hračky a osobní hygienické potřeby.
* **Hygiena a bezpečnost:** Čistá koupelna, zabezpečená okna, lékárnička, nezávadný stav nemovitosti a dostatečná zásoba potravin.

#### 2. Příprava dětského pokoje a konstruktivní součinnost OSPOD
* **Průběh místního šetření:** Sociální pracovnice hodnotí celkovou stabilizaci prostředí, bezpečnost, hygienu a připravenost pokoje.
* **Konstruktivní tón:** Zachovejte klid, vstřícnost a otevřenost. Ukažte připravené prostory, dětský pokoj i zásobu potravin.
* **Doklady:** Připravte si zprávy ze školy, potvrzení o kroužcích, kontakty na pediatra a přehled denního režimu dítěte.

#### 3. Státní sociální podpora MPSV (Portál JENDA)
* **Příspěvek na bydlení:** Pokud vaše náklady na bydlení (nájem + energie) přesahují 30 % rozhodného čistého příjmu, máte nárok na státní příspěvek na bydlení.
* **Mimořádná okamžitá pomoc (MOP):** Lze zažádat na Úřadu práce pro úhradu kauce na nový byt nebo nákup základního vybavení pro děti.
* **Portál JENDA:** Veškeré žádosti o dávky MPSV lze pohodlně vyřídit online přes klientský portál jenda.mpsv.cz s využitím Identity občana.
`
  },
  {
    slug: 'mediace',
    title: 'Rodinná mediace & Dohoda',
    description: 'Mimosoudní řešení sporů, tvorba rodičovského plánu a využití BIFF metody pro deeskalaci konfliktu s protistranou.',
    icon: 'HeartHandshake',
    content: `
### Rodinná mediace, tvorba dohody o dětech a deeskalace sporů

Dohoda rodičů schválená opatrovnickým soudem je nejlepším a nejstabilnějším řešením pro budoucnost dětí. Rodinná mediace poskytuje bezpečný prostor pro vyjednání udržitelného kompromisu bez zdlouhavých a nákladných soudních bitev.

#### 1. Mimosoudní řešení sporů a zapsaný mediátor
* **Princip mediace:** Zapsaný mediátor je nezávislý a odborně vyškolený profesionál, který neříká, kdo má pravdu, ale pomáhá rodičům nalézt oboustranně přijatelné kompromisy.
* **První setkání se zapsaným mediátorem (§ 100 o.s.ř.):** Opatrovnický soud může rodičům nařídit první setkání s mediátorem v rozsahu 3 hodin, aby získali prostor pro dohodu mimo soudní síň.

#### 2. Tvorba rodičovského plánu a náležitosti dohody
* **Harmonogram péče:** Přesně stanovené dny, hodiny a místa předávání dětí pro běžný školní rok.
* **Prázdniny a svátky:** Rovnoměrné a spravedlivé střídání Letních prázdnin, Vánoc, Velikonoc, podzimních a jarních prázdnin.
* **Finanční ujednání:** Stanovení výživného a klíč pro úhradu mimorozpočtových výdajů (kroužky, lyžařské výcviky, rovnátka, tábory).

#### 3. Využití BIFF metody pro deeskalaci konfliktu s protistranou
* **B – Brief (Stručná):** Zpráva do 2–5 věty, bez citového balastu a minulých výčitek.
* **I – Informative (Informativní):** Pouze fakta, časy, místa a logistické otázky ohledně dětí.
* **F – Friendly (Zdvořilá):** Zachování běžné lidské slušnosti („Dobrý den“, „S pozdravem“).
* **F – Firm (Pevná):** Jasné stanovisko nebo odpověď bez otevírání nekonečných diskusí.
`
  }
];
