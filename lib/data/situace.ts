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
    description: 'Ochrana financí, vypořádání společného jmění manželů, rozdělení dluhů, úvěrů a společných bankovních účtů.',
    icon: 'Wallet',
    content: `
### Krizová opatření při vypořádání SJM a ochraně financí

Při rozpadu manželství nebo partnerského soužití je jedním z nejakutnějších kroků okamžitá stabilizace finančního zázemí a ochrana majetkových hodnot. Společné jmění manželů (SJM) zahrnuje veškerý majetek i závazky nabyté za trvání manželství s výjimkou dědictví či darů.

#### 1. Okamžitá blokace a oddělení bankovních účtů
* **Odebrání dispozičních práv:** Zrušte veškerá dispoziční práva druhého manžela k vašim osobním účtům u všech bank.
* **Zřízení nového soukromého účtu:** Požádejte zaměstnavatele o zasílání mzdy na nový účet zřízený u jiné bankovní instituce.
* **Společné účty a kreditní karty:** Písemně požádejte banku o blokaci kontokorentů, kreditních karet a zamezení čerpání nových úvěrů bez souhlasu obou manželů.

#### 2. Řešení společné hypotéky a nemovitosti
* **Hrazení splátek po rozchodu:** Pokud jeden z manželů zůstává v nemovitosti a hradí hypotéku sám, tyto platby se započítávají v rámci konečného vypořádání SJM jako vnos či zápočet (§ 742 Občanského zákoníku).
* **Jednání s bankou:** Informujte hypoteční banku o probíhajícím rozvodovém řízení a projednejte možnosti převzetí dluhu nebo prodeje nemovitosti.

#### 3. Prevence neoprávněných dluhů (§ 710 OZ)
* Závazky převzaté jedním manželem bez souhlasu druhého zakládají povinnost pouze tohoto manžela, pokud přesahují míru odpovídající majetkovým poměrům rodiny.
* Pokud se dozvíte o neodůvodněném zadlužování druhým manželem, písemně vyjádřete nesouhlas vůči věřiteli bez zbytečného odkladu.
`
  },
  {
    slug: 'psychika',
    title: 'Psychická podpora & Prevence',
    description: 'Zvládání akutního krizového stresu, seberegulace v konfliktech, pravidlo 24 hodin a psychohygiena.',
    icon: 'Brain',
    content: `
### Psychická stabilizace v krizovém období rozchodu

Rozchod a opatrovnické spory představují extrémní zátež pro psychiku rodiče. Zachování chladné hlavy, emocní vyrovnanosti a fyzického zdraví je zásadním předpokladem pro úspěšné zvládnutí opatrovnického řízení i pro vytvoření bezpečného prostředí pro vaše děti.

#### 1. Pravidlo 24 hodin na odpověď
* Na konfrontační, útočné nebo provokativní zprávy druhého rodiče **nikdy neodpovídejte v afektu**.
* Počkejte 24 hodin, emoce opadnou a zprávu zformulujte věcně, stručně a neutrálně podle BIFF metody.
* Pamatujte, že veškerá písemná komunikace může být předložena opatrovnickému soudu nebo OSPOD jako důkaz o vašich výchovných předpokladech.

#### 2. Profesionální krizová podpora
* Nebojte se vyhledat individuální psychoterapii nebo krizovou intervenci.
* Využijte anonymní Linku První psychické pomoci (116 123) dostupné zdarma 24/7.
* Vyhledání odborné psychologické péče je znakem zralosti a odpovědnosti rodiče, nikoliv slabosti.

#### 3. Fyzická psychohygiena a denní režim
* Udržujte pravidelný spánkový režim, kvalitní stravování a každodenní fyzický pohyb (chůze, sport).
* Budujte síť podpory mezi přáteli a rodinou, ale vyvarujte se rozebírání detailů soudu před dětmi.
`
  },
  {
    slug: 'deti',
    title: 'Jak mluvit s dítětem',
    description: 'Komunikace o rozchodu přiměřená věku, ujištění o lásce obou rodičů a ochrana před konfliktem loajality.',
    icon: 'Heart',
    content: `
### Průvodce citlivým rozhovorem s dítětem o rozchodu

Dítě nesmí se stát rukojmím ani nástrojem v boji dospělých. Způsob, jakým mu rozchod rodičů vysvětlíte, zásadně ovlivní jeho psychický vývoj, pocit bezpečí a důvěru k oběma rodičům.

#### 1. Základní principy komunikace
* **Absolutní ujištění o lásce:** Dítě musí slyšet a cítit: „Oba tě máme moc rádi a vždycky pro tebe zůstaneme mámou a tátou.“
* **Sejmutí pocitu viny:** Děti mají tendenci přikládat rozpad rodiny za vinu sobě. Opakovaně jim zdůrazňujte: „Ty za nic nemůžeš, je to rozhodnutí dospělých.“
* **Žádné očerňování druhého rodiče:** Nikdy nezpochybňujte autoritu ani lásku druhého rodiče před dětmi.

#### 2. Formulace podle věkových skupin
* **Předškolní věk (3–6 let):** „Máma a táta budou teď bydlet ve dvou domech. Budeš mít svůj pokojíček u mámy i u táty a oba s tebou budeme pořád.“
* **Školní věk (7–11 let):** „S mámou jsme se rozhodli žít odděleně, ale oba zůstáváme tvými rodiči naplno. O tvé škole, kroužcích i prázdninách se budeme domlouvat společně.“
* **Dospívající (12–16 let):** „Chápeme, že je to pro tebe těžké. Respektujeme tvůj názor i tvé zájmy. Naše dospělé spory jsou naše věc a nechceme tě do nich zatahovat.“
`
  },
  {
    slug: 'obrana-pas',
    title: 'Ochrana před manipulací',
    description: 'Rozpoznání syndromu zavrhovaného rodiče (PAS), obrana proti bránění ve styku a judikatura Ústavního soudu.',
    icon: 'Shield',
    content: `
### Právní a psychologická obrana před manipulací a zavrhováním rodiče (PAS)

Popouzení dítěte proti druhému rodiči, bezdůvodné rušení předávání dětí a vytváření fiktivních překážek ve styku představuje závažné porušení rodičovské odpovědnosti a práva dítěte na péči obou rodičů.

#### 1. Projevy a rozpoznání syndromu PAS
* Dítě opakuje naučené fráze dospělých, které neodpovídají jeho věku ani reálným zkušenostem s otcem.
* Dítě projeví extrémní odmítání bez racionálního důvodu, zatímco v minulosti mělo s otcem vřelý vztah.
* Druhý rodič blokuje telefonní hovory, ruší styk pod záminkou „nemoci“ bez lékařské zprávy nebo vytváří překážky.

#### 2. Doporučená právní obrana a postupy
* **Pečlivá dokumentace:** Vedete si přesný deník všech předání, telefonátů, zpráv a případných odmítnutí s časovými razítky.
* **Součinnost OSPOD:** Bezodkladně informujte OSPOD o bránění ve styku a navrhněte odbornou rodinnou terapii či krizovou mediaci.
* **Návrh na předběžné opatření (§ 452 o.s.ř.):** V případě akutního zamezení kontaktu podávejte návrhy na soudní úpravu styku nebo výkon rozhodnutí uložením pokuty.

#### 3. Klíčová judikatura Ústavního soudu ČR
* **Nález ÚS IV. ÚS 1921/17:** Orgány veřejné moci mají povinnost aktivně konat k obnovení vazeb mezi rodičem a dítětem.
* **Nález ÚS III. ÚS 149/20:** Systematické popouzení dětí a bránění ve styku je důvodem pro změnu výchovného prostředí a svěření dítěte do péče druhého rodiče.
`
  },
  {
    slug: 'bydleni-ospod',
    title: 'Nové bydlení & OSPOD',
    description: 'Příprava nového domova pro střídavou péči, místní šetření OSPOD a státní sociální podpora (JENDA).',
    icon: 'Home',
    content: `
### Příprava nového bydlení, místní šetření OSPOD a státní podpora

Kvalitní a bezpečné bytové zázemí pro děti je základním předpokladem pro přiznání střídavé či společné péče opatrovnickým soudem. Orgán sociálně-právní ochrany dětí (OSPOD) provádí místní šetření za účelem ověření podmínek pro výchovu dětí.

#### 1. Standardy vybavení pro místní šetření OSPOD
* **Samostatné stálé lůžko:** Každé dítě musí mít vlastní kvalitní postel s matrací a lůžkovinami.
* **Studijní a hrací koutek:** Psací stůl se židlí, osvětlením a úložným prostorem pro školní pomůcky.
* **Skříň a osobní věci:** Dostatek úložného prostoru pro oblečení, hračky a osobní hygienické potřeby.
* **Hygiena a bezpečnost:** Čistá koupelna, zabezpečené okno/balkón, lékárnička a nezávadné prostředí.

#### 2. Průběh návštěvy sociální pracovnice OSPOD
* Zachovejte klid, vstřícnost a otevřenost.
* Ukažte připravené prostory, dětský pokoj a zásoby potravin.
* Připravte si zprávy ze školy, potvrzení o kroužcích a kontakty na pediatra.

#### 3. Státní sociální podpora MPSV (Portál JENDA)
* **Příspěvek na bydlení:** Pokud vaše náklady na bydlení (nájem + energie) přesahují 30 % rozhodného příjmu, máte nárok na státní příspěvek.
* **Mimořádná okamžitá pomoc (MOP):** Lze zažádat na Úřadu práce pro úhradu kauce na nový byt nebo základního vybavení.
* **Podání žádosti:** Veškeré žádosti lze vyřídit online přes portál mpsv.cz s Identitou občana.
`
  },
  {
    slug: 'mediace',
    title: 'Rodinná mediace & Dohoda',
    description: 'Mimosoudní řešení sporů, tvorba stabilní rodičovské dohody a deeskalace konfliktů pomocí BIFF metody.',
    icon: 'HeartHandshake',
    content: `
### Rodinná mediace, tvorba dohody o dětech a deeskalace sporů

Dohoda rodičů schválená opatrovnickým soudem je nejlepším a nejstabilnějším řešením pro budoucnost dětí. Rodinná mediace poskytuje bezpečný prostor pro vyjednání udržitelného kompromisu bez zdlouhavých a nákladných soudních bitev.

#### 1. Jak funguje rodinná mediace
* Zapsaný mediátor je nezávislý odborník, který neříká, kdo má pravdu, ale pomáhá rodičům najít společné řešení.
* Mediace se zaměřuje výhradně na potřeby dětí, úpravu péče, styk, výživné, prázdniny a kroužky.
* První setkání se zapsaným mediátorem může nařídit i opatrovnický soud podle § 100 o.s.ř.

#### 2. Náležitosti kvalitní Rodičovské dohody
* **Přesný harmonogram péče:** Jasně stanovené dny a časy předávání dětí včetně místa předání.
* **Úprava svátků a prázdnin:** Rovnoměrné rozdělení Letních prázdnin, Vánoc, Velikonoc a školních volna.
* **Výživné a kroužky:** Stanovení měsíčního výživného a klíč pro úhradu mimorozpočtových výdajů (kroužky, tábory, rovnátka).

#### 3. Metoda BIFF pro písemnou komunikaci
* **Brief (Stručná):** Krátká zpráva bez omáčky a minulých výčitek.
* **Informative (Informativní):** Pouze data, fakta, termíny a otázky ohledně dětí.
* **Friendly (Zdvořilá):** Zachování běžné lidské slušnosti („Dobrý den“, „S pozdravem“).
* **Firm (Pevná):** Jasný návrh či odpověď bez otevírání nekonečných diskusí.
`
  }
];
