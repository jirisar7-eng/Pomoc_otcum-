/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AnonymizedDocument {
  id: string;
  pageNumber: number; // 1 to 25 ("Jeden dokument jedna stránka")
  title: string;
  category: 'soudni-podani' | 'soudni-usneseni' | 'ospod-meu' | 'mpsv-ombudsman' | 'charita-sluzby' | 'zpravy-dokazy';
  categoryLabel: string;
  issuingBody: string;
  targetBody: string;
  dateStr: string;
  caseRef: string;
  summary: string;
  legalTakeaway: string;
  content: string;
}

export const MY_ANONYMIZED_DOCUMENTS: AnonymizedDocument[] = [
  {
    id: 'doc-01',
    pageNumber: 1,
    title: 'Rozsudek Okresního soudu o péči a výživném (9. 6. 2026)',
    category: 'soudni-usneseni',
    categoryLabel: 'Soudní usnesení & rozsudky',
    issuingBody: 'Okresní soud v [OKRESNÍ MĚSTO]',
    targetBody: 'Účastníci řízení ([OTEC], [MATKA])',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Klíčový rozsudek prvostupňového soudu, který svěřil 6měsíční kojence do společné péče rodičů, ale péči otce v lichém týdnu rozdrobil na 3 samostatné denní úseky bez přespávání s povinností předávat dítě na železniční stanici.',
    legalTakeaway: 'Prvostupňový rozsudek sice formálně deklaruje společnou péči, ale praktickým nastavením bez nocí a s neustálým pendlováním vytváří logisticky neudržitelný stav, který je nutné napadnout odvoláním k krajskému soudu.',
    content: `ČESKÁ REPUBLIKA
ROZSUDEK JMÉNEM REPUBLIKY

Okresní soud v [OKRESNÍ MĚSTO] rozhodl samosoudkyní [JUDr. SOUDCE] ve věci
nezletilého: [NEZLETILÝ SYN A], nar. [DATUM]
bytem [OBEC C], zastoupený opatrovníkem [MĚSTSKÝ ÚŘAD MĚSTA X]
dítěte rodičů: [MATKA], nar. [DATUM], bytem [OBEC C]
a [OTEC], nar. [DATUM], bytem [OBEC A], pobytem [OBEC B]

o určení péče a výživného
takto:

I. Nezletilý [NEZLETILÝ SYN A] se svěřuje do společné péče rodičů tak, že matka je povinna a oprávněna pečovat po celý kalendářní rok s výjimkou, kdy je povinen a oprávněn pečovat otec.

II. Otec je povinen a oprávněn pečovat o nezletilého:
- v sudém kalendářním týdnu od pondělí 8:45 hod do úterý 15:30 hodin a v pátek od 8:45 hodin do 15:30 hodin,
- v lichém kalendářním týdnu v pondělí, středu a pátek vždy od 8:45 hod do 15:30 hod.

III. K předávání nezletilého bude docházet v [MĚSTO X], železniční stanici.

IV. Matka a otec jsou povinni v době, kdy pečují o nezletilého, 1x denně zaslat informativní zprávu o nezletilém druhému rodiči.

V. Otec je povinen platit výživné na nezletilého [NEZLETILÝ SYN A] ve výši 1 500 Kč měsíčně k rukám matky.

VI. Návrh na vydání předběžného opatření se zamítá.
VII. Vyslovuje se předběžná vykonatelnost výroků I., II., III., IV., V.

Odůvodnění (stručný výtah):
Soud dospěl k závěru, že oba rodiče jsou plně výchovně kompetentní a mají o dítě zájem. Nicméně vzhledem k nízkému věku kojence a reakcím dítěte po návratu od otce (neklid, vyšší potřeba fyzického kontaktu) stanoven zatím rozsah noční péče bez přespávání v lichém týdnu.

Poučení: Proti tomuto rozsudku lze podat odvolání do 15 dnů ode dne doručení ke Krajskému soudu.

V [OKRESNÍ MĚSTO] dne [DATUM]
[JUDr. SOUDCE] v.r., samosoudkyně`
  },
  {
    id: 'doc-02',
    pageNumber: 2,
    title: 'Protokol o soudním jednání u Okresního soudu (9. 6. 2026)',
    category: 'soudni-usneseni',
    categoryLabel: 'Soudní usnesení & rozsudky',
    issuingBody: 'Okresní soud v [OKRESNÍ MĚSTO]',
    targetBody: 'Soudní spis [SPIS. ZN. 13 Nc XX/2026]',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Oficiální soudní zápis z ústního jednání, kde matka vznášela námitky ohledně 200 Kč dlužného výživného, OSPOD doporučoval omezení styku a otec přednášel návrh na 2 noci týdně a víkend.',
    legalTakeaway: 'Soudní protokol zachycuje reálnou dynamiku soudní síně. Je zásadním podkladem pro odvolání, neboť dokazuje, že otec již na místě vyjádřil nesouhlas a podal odvolání přímo do zápisu.',
    content: `PROTOKOL O JEDNÁNÍ PŘED SOUDEM I. STUPNĚ

Sp. zn.: [SPIS. ZN. 13 Nc XX/2026]
Samosoudkyně: [JUDr. SOUDCE]
Zapisovatelka: [Mgr. ZAPISOVATELKA]
Jednání se konalo dne: [DATUM] v 10:10 hodin.

Přítomni:
1. Matka: [MATKA], osobně
2. Právní zástupkyně matky: [Mgr. ADVOKÁTKA], osobně
3. Otec: [OTEC], osobně
4. Opatrovník (OSPOD): [MĚSTSKÝ ÚŘAD MĚSTO X] - [Bc. SOCIÁLNÍ PRACOVNICE], osobně
Veřejnost: Klíčová pracovnice Charity [MĚSTO X].

Průběh jednání:
Matka uvádí: Otec z dlužného výživného za květen zaplatil 300 Kč z 500 Kč, 200 Kč dluží. Při předání byl konfliktní. Matka si předávání nahrává.
Otec k tomu uvádí: Není pravda vše, co uvádí matka. Strany komunikují.

Dokazování: Čtena zpráva z Poradny pro rodinu. Otec uvádí, že při poradně cítil zaujatost pracovníků ve prospěch matky.

Závěrečné návrhy:
- PZ matky: Navrhuje péči otce v rozsahu odpoledních hodin bez přespávání.
- Otec: Navrhuje péči v rozsahu 2 nocí v týdnu + 1 ucelený víkend v měsíci s ohledem na bratra [NEZLETILÝ SYN C].
- Opatrovník (OSPOD): Připojuje se k návrhu na omezení přespávání u kojence.

Vyhlášen ROZSUDEK (viz č. l. 169).
Otec podává rovnou do protokolu odvolání proti výroku o péči.

Jednání skončeno v 11:07 hodin.

[JUDr. SOUDCE] v.r.
samosoudkyně`
  },
  {
    id: 'doc-03',
    pageNumber: 3,
    title: 'Zpráva Poradny pro rodinu o odborném sociálním poradenství (8. 6. 2026)',
    category: 'charita-sluzby',
    categoryLabel: 'Stanoviska sociálních služeb',
    issuingBody: 'Poradna pro rodinu [KRAJSKÝ ÚRÁD]',
    targetBody: 'Okresní soud v [OKRESNÍ MĚSTO]',
    dateStr: '[DATUM]',
    caseRef: '[PPR XX/2026]',
    summary: 'Zpráva z 2 konzultací rodičů. Poradna konstatuje, že matka pociťuje úzkost ("bojím se o dítě"), zatímco otec zdůrazňuje své rodičovské kompetence a přítomnost staršího bratra.',
    legalTakeaway: 'Poradny pro rodinu často aplikují teorii "primárního pečujícího rodiče" (matky), což může vést k potlačování role otce. Otec musí u soudu aktivně argumentovat novodobými poznatky o vícečetném attachmentu.',
    content: `PORADNA PRO RODINU [KRAJSKÝ ÚRÁD]
Č.j.: PPR XX/2026
Adresát: Okresní soud v [OKRESNÍ MĚSTO]

Podání zprávy ze spolupráce s rodiči: [MATKA] a [OTEC]

Na základě žádosti soudu sdělujeme: Rodiče se zúčastnili dvou konzultací mediačního charakteru v rámci sociální služby odborného sociálního poradenství (14. 4. 2026 a 21. 5. 2026).

1. Konzultace (14. 4. 2026):
Matka formuluje zakázku: chce postupné navykání syna [NEZLETILÝ SYN A], snížit rozsah styku a vyřešit výživné. Vyjadřuje obavy o projevy syna po návratu (neklid, vyžadování fyzické blízkosti matky).
Otec formuluje zakázku: zachování a rozšíření péče (ideálně 7x7 dní), zdůrazňuje, že u něj syn spí klidně, usmívá se a nepláče. Otec poukazuje na přítomnost staršího syna [NEZLETILÝ SYN C].

Pracovnice provedla edukační náhled k vývojové psychologii 4měsíčního kojence a významu primární pečující osoby (matky). Otec tento pohled hodnotil jako zaujatý a preferující matku.

2. Konzultace (21. 5. 2026):
Přítomni Mgr. [PORADCE A] a PhDr. [PORADCE B] jako nezávislý pozorovatel.
Rodiče nedošli k dohodě. Matka trvá na péči převážně u ní bez nocí. Osec ustoupil ze střídavé péče na rozšířenou péči s noclehama.

Závěr: Rodičům nebylo možné zprostředkovat dohodu. Doporučujeme zohlednit vývojové potřeby kojence a kontinuitu péče.

PhDr. [PORADCE B]
vedoucí pracoviště Poradny pro rodinu`
  },
  {
    id: 'doc-04',
    pageNumber: 4,
    title: 'Cenzurovaný výpis ze sociální dokumentace Charity (10. 4. 2026)',
    category: 'charita-sluzby',
    categoryLabel: 'Stanoviska sociálních služeb',
    issuingBody: 'Charita [MĚSTO X]',
    targetBody: '[OTEC]',
    dateStr: '[DATUM]',
    caseRef: '[Č.J. 210/2026]',
    summary: 'Jednostránkový úřední výpis, který Charita poskytla otci až na základě souhlasu matky. Obsahuje pouze 7 banálních větiček vytržených z kontextu 20 terénních setkání.',
    legalTakeaway: 'Klasická ukázka informační blokády: Charita provedla s matkou 20 terénních schůzek o formě péče pro soud, ale otci jako zákonnému zástupci vydala jen zcenzurovaný 1stránkový výtah.',
    content: `VÝPIS ZE SOCIÁLNÍ DOKUMENTACE

Poskytovatel: Charita [MĚSTO X], IČO: [ANONYMIZOVÁNO]
Identifikace nezletilého: [NEZLETILÝ SYN A], nar. [DATUM]
Identifikace uživatelky: [MATKA]

Účel dokumentu: Výpis vydán na základě žádosti otce a se souhlasem uživatelky sociální služby. Obsahuje pouze faktické zmínky o nezletilém.

Faktické zmínky o nezletilém dítěti zaznamenané v dokumentaci:

Datum setkání | Záznam vztahující se k dítěti
------------------------------------------------------------
19.1.2026      | [NEZLETILÝ SYN A] celou cestu tam i zpět spí.
2.2.2026       | Uživatelka ještě krmí [NEZLETILÝ SYN A].
12.2.2026      | [NEZLETILÝ SYN A] se krmí a chová, je spokojený.
19.2.2026      | [NEZLETILÝ SYN A] uživatelka krmí z lahve, vypadá spokojeně.
24.2.2026      | [NEZLETILÝ SYN A] je klidný, usměvavý.
11.3.2026      | [NEZLETILÝ SYN A] se také najedl, vypadá spokojeně.
25.3.2026      | [NEZLETILÝ SYN A] je veselý, usmívá se, později usne mamince na klíně.

Závěrečné ustanovení: Výpis vyhotoven v souladu s § 100 zákona č. 108/2006 Sb. Kompletní dokumentace podléhá mlčenlivosti.

V [MĚSTO X] dne [DATUM]
[Ing. ŘEDITELKA CHARITY], MBA
ředitelka Charity [MĚSTO X]`
  },
  {
    id: 'doc-05',
    pageNumber: 5,
    title: 'Urgentní oznámení OSPODu o svévolném odebrání nemocného dítěte (24. 6. 2026)',
    category: 'ospod-meu',
    categoryLabel: 'Stížnosti & Odpovědi OSPOD / MěÚ',
    issuingBody: '[OTEC]',
    targetBody: 'OSPOD [MĚSTO X] ([Bc. SOCIÁLNÍ PRACOVNICE])',
    dateStr: '[DATUM]',
    caseRef: 'Urgentní incident v péči',
    summary: 'Podání otce oznamující kritický incident: matka za doprovodu terénní pracovnice Charity vtrhla do obydlí otce a odebrala spící 6měsíční dítě s horečkou 37,6 °C a masivními planými neštovicemi.',
    legalTakeaway: 'Kritické incidenty ohrožující zdraví dítěte (převoz v akutní infekční fázi s horečkou v rozporu s dohodou o klidovém režimu) je nutné okamžitě písemně zaevidovat na OSPOD i k soudu.',
    content: `Vážená paní [Bc. SOCIÁLNÍ PRACOVNICE],

tímto Vás urgentně informuji o kritickém vývoji situace a hrubém porušení uzavřených dohod ze strany matky [MATKA], ke kterému došlo dnes, [DATUM].

Nezletilý [NEZLETILÝ SYN A] má v současné době prokazatelně vysoké horečky (naměřeno 37,6 °C) a prochází velmi těžkým průběhem akutního infekčního onemocnění (plané neštovice s masivním výsevem po celém těle a hlavě).

Podle platného protokolu a výslovné dohody z OSPOD ze dne [DATUM], že v případě nemoci zůstává syn v péči toho rodiče, u kterého se zrovna nachází, měl syn zůstat v klidovém režimu v mém bydlišti v [OBEC B], aby se zamezilo komplikacím a šíření nákazy.

Matka však dnes osobním automobilem dorazila do mého bydliště za doprovodu terénní pracovnice Charity [Bc. SOCIÁLNÍ PRACOVNICE CHARITY], chovala se extrémně agresivně a vulgárně a těžce nemocné, spící dítě mi z postýlky fyzicky odebrala.

Tímto jednáním matka zcela ignorovala zdravotní stav syna i platná ujednání a vystavila šestiměsíčního kojence nebezpečnému transportu v akutní fázi nemoci.

Žádám OSPOD o okamžitý zásah a zaevidování tohoto incidentu do spisu nezletilého.

S pozdravem,
[OTEC]`
  },
  {
    id: 'doc-06',
    pageNumber: 6,
    title: 'Odpověď Kanceláře Dětského ombudsmana na podnět otce (24. 6. 2026)',
    category: 'mpsv-ombudsman',
    categoryLabel: 'Inspekce MPSV & Ombudsman',
    issuingBody: 'Kancelář Veřejného ochránce práv – Dětský ombudsman (Brno)',
    targetBody: '[OTEC]',
    dateStr: '[DATUM]',
    caseRef: '[KVOP-XXXXX/2026]',
    summary: 'Oficiální dopis zástupkyně Dětského ombudsmana vysvětlující postupy a podmínky pro přešetření OSPODu. Vyžaduje předložení zamítavé odpovědi tajemníka Městského úřadu.',
    legalTakeaway: 'Dětský ombudsman nemůže zasáhnout do živého soudního sporu, dokud stěžovatel nevyčerpá řádné opravné prostředky u vedoucích úřadu (tajemníka MěÚ dle § 175 správního řádu).',
    content: `OCHRÁNCE PRÁV DĚTÍ
Údolní 39, 602 00 Brno
Sp. zn.: [926/2026/DO/DS]
Č. j.: [KVOP-XXXXX/2026]
Datum: [DATUM]

Vážený pan [OTEC]
[OBEC A]

Vážený pane,

odpovídám na Váš podnět dětskému ombudsmanovi týkající se postupu Městského úřadu [MĚSTO X] (OSPOD) při výkonu kolizního opatrovnictví Vašeho syna [NEZLETILÝ SYN A]. Ve stížnosti uvádíte, že OSPOD v závěrečném návrhu ignoroval sourozeneckou vazbu se starším bratrem [NEZLETILÝ SYN C] v Vaší péči.

Dětský ombudsman Vám v tuto chvíli nemůže účinně pomoci. Vysvětlím proč.

Dětský ombudsman působí k ochraně před nezákonným či nesprávným jednáním úřadů. Nezbytnou náležitostí každého podnětu je však doklad o tom, že úřad, jehož se podnět týká, byl neúspěšně vyzván k nápravě.

Součástí Vašeho podnětu je stížnost adresovaná tajemníkovi úřadu. Aby mohla kancelář postup posoudit, potřebujeme znát oficiální odpověď tajemníka MěÚ. Tajemník má na vyřízení 60 dnů.

V případě, že nebudete spokojen s vyřízením stížnosti ze strany MěÚ, můžete se na dětského ombudsmana obrátit znovu s novým podnětem a přiložit odpověď úřadu.

S pozdravem,
[Mgr. ZÁSTUPKYNĚ OMBUDSMANA]
zástupkyně ředitelky právní sekce pro agendy dětského ombudsmana`
  },
  {
    id: 'doc-07',
    pageNumber: 7,
    title: 'Písemný přepis Messenger komunikace – Uznání neudržitelnosti rozsudku matkou',
    category: 'zpravy-dokazy',
    categoryLabel: 'Důkazní konverzace & chaty',
    issuingBody: 'Komunikace mezi rodiči ([MATKA] a [OTEC])',
    targetBody: 'Soudní spis / OSPOD',
    dateStr: '[DATUM]',
    caseRef: 'Důkazní materiál k odvolání',
    summary: 'Autentický přepis textových zpráv z Messengeru, kde matka sama výslovně označuje prvostupňový rozsudek o pendlování za "šílenost na tak malé dítě" a navrhuje změnu dojednáním.',
    legalTakeaway: 'Písemné přiznání druhého rodiče v chatové komunikaci, že soudní rozsudek je nelogický a špatně nastavený, představuje klíčový důkaz pro odvolací soud k reformě rozhodnutí.',
    content: `DŮKAZNÍ MATERIÁL PRO SOUDNÍ ŘÍZENÍ
Doslovný přepis textové komunikace (aplikace Messenger)

Matka: „Hele jsme rodiče ten rozsudek se mi zdá spravedlivý pro oba ale nelíbí se mi to dojíždění do Přelouče... To od soudkyně je trochu moc šílené na tak malé dítě a furt pendlovat.“

Otec: „Mě ten rozsudek se nelíbí vůbec... takhle bude víc na cestách než u mě... Hlavně ten čas v 8:45 je úplně na nic. Za mě je nejlepší možnost zachovat přespávání tak jak to bylo.“

Matka: „Můžeme se domluvit že klidně ti ho můžu dovézt nebo ty mě nemusí být vždy předání v Přelouči... Na odvolací soud jít nechci tam si nedělám žádné naděje... Ten lichý týden chci upravit i v časy kvůli Jiříkovi jsme rodiče. Klidně si tu zprávu ulož jako důkaz nemám s tím problém.“

Otec: „Musíme to u soudu nebo na OSPODu změnit oficiálně, ať máme právní jistotu.“

Matka: „Ok ale platí jen to předání že to nemusí být v Přelouči... hlavně že oba jsme se na tom shodli oba dva ho milujeme.“

Předloženo soudu a OSPOD jako důkaz o oboustranné shodě na nefunkčnosti rozhodnutí I. stupně.`
  },
  {
    id: 'doc-08',
    pageNumber: 8,
    title: 'Druhé doplnění odvolání otce – Vědecké zdůvodnění nocování u kojenců (17. 6. 2026)',
    category: 'soudni-podani',
    categoryLabel: 'Soudní podání otce',
    issuingBody: 'Navrhovatel (Otec)',
    targetBody: 'Krajský soud v [KRAJSKÉ MĚSTO]',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Argumentované doplnění odvolání opírající se o mezinárodní konsenzuální studii Dr. Warshaka (2014) a prof. Fabriciuse (2016) prokazující škodlivost odkládání nocování u otců.',
    legalTakeaway: 'Odkaz na mezinárodní vědecké studie (110 odborníků) vyvrací mýtus, že kojenci nesmí přes noc spát u pečujícího otce. Naopak, noční péče buduje celoživotní psychickou odolnost.',
    content: `KRAJSKÉMU SOUDU V [KRAJSKÉ MĚSTO]
prostřednictvím Okresního soudu v [OKRESNÍ MĚSTO]

Ke sp. zn.: [SPIS. ZN. 13 Nc XX/2026]
Odvolatel (Otec): [OTEC]
Matka: [MATKA]
Nezletilý: [NEZLETILÝ SYN A]

DRUHÉ DOPLNĚNÍ ODVOLÁNÍ OTCE
– Vědecké zdůvodnění navrženého modelu péče a reakce na procesní vývoj

Cílem tohoto doplnění je poskytnout odvolacímu soudu exaktní vědecké zdůvodnění navrženého 4týdenního cyklu a doložit, že odkládání nocování je v rozporu s vývojovou psychologií.

I. Vědecká opora pro navržený čtyřtýdenní cyklus otce:
1. Dr. Richard A. Warshak – „Social Science and Parenting Plans for Young Children: A Consensus Report“ (2014), podepsaná 110 předními světovými odborníky:
Výslovně uvádí, že u kojenců neexistuje žádný vědecký důvod pro odpírání přespávání u otce. Naopak, odkládání nocování do vyššího věku dítě poškozuje, neboť ho izoluje od noční rutiny s otcem (večerní ukládání, tišení, ranní vstávání), která je pro budování bezpečné vazky (attachmentu) kriticky důležitá.

2. Prof. William V. Fabricius (Arizona State University, 2016):
Prokázal na tvrdých datech, že přespávání u otce v kojeneckém věku (pod 1 rok) má přímý pozitivní vliv na kvalitu budoucího vztahu v dospělosti, aniž by jakkoliv utrpěla vazba k matce.

II. Závěr:
Žádám Krajský soud, aby změnil výrok II. rozsudku a určil péči otce v ucelených blocích včetně nocí.

V [OBEC B], dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-09',
    pageNumber: 9,
    title: 'Návrh oprávněného otce na zahájení řízení o výkonu rozhodnutí (26. 6. 2026)',
    category: 'soudni-podani',
    categoryLabel: 'Soudní podání otce',
    issuingBody: 'Oprávněný (Otec)',
    targetBody: 'Okresní soud v [OKRESNÍ MĚSTO]',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Návrh na soudní exekuci styku / péče podle § 500 z.ř.s. podaný poté, co matka odmítla vydat dítě na páteční styk v době nemoci a odmítla dohodnutou návštěvu otce v jejím bydlišti.',
    legalTakeaway: 'Pokud matka jednostranně zmaří vykonatelný styk určený předběžně vykonatelným rozsudkem, je otec povinen podat návrh na výkon rozhodnutí uložením pokuty dle § 501 z.ř.s.',
    content: `OKRESNÍ SOUD V [OKRESNÍ MĚSTO]
[ADRESA SOUDU]

Oprávněný: [OTEC], nar. [DATUM], bytem [OBEC A], pobytem [OBEC B]
Povinná: [MATKA], nar. [DATUM], bytem [OBEC C]
Nezletilý: [NEZLETILÝ SYN A], nar. [DATUM]

NÁVRH OPRÁVNĚNÉHO NA ZAHÁJENÍ ŘÍZENÍ O VÝKONU ROZHODNUTÍ
podle § 500 a násl. zákona č. 292/2013 Sb., o zvláštních řízeních soudních

I.
Rozsudkem Okresního soudu ze dne [DATUM], č. j. [SPIS. ZN.], byla určena péče o nezletilého [NEZLETILÝ SYN A] s předběžnou vykonatelností. Podle tohoto rozsudku a navazující dohody z OSPOD ze dne [DATUM] byl oprávněný otec povinen a oprávněn vykonat péči o nezletilého v pátek dne [DATUM].

II.
Povinná matka však vědomě a bezdůvodně povinnost stanovenou soudním rozhodnutím nesplnila. Oprávněný nabídl, že vzhledem k nemoci dítěte (plané neštovice) vykoná návštěvu v místě bydliště matky v [OBEC C], aby dítě necestovalo. Povinná matka to však písemně odmítla se slovy „teď návštěvy nechceme“ a styk zcela zmařila.

III.
Oprávněný navrhuje, aby Okresní soud v [OKRESNÍ MĚSTO]ydal toto

U S N E S E N Í :
Soud ukládá povinné [MATKA], aby plnila povinnosti vyplývající z rozsudku ze dne [DATUM] a umožnila oprávněnému [OTEC] řádný výkon péče o nezletilého [NEZLETILÝ SYN A] v místě současného bydliště dítěte.

V [OBEC B] dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-10',
    pageNumber: 10,
    title: 'Stížnost na neprofesionální a protiprávní postup terénní pracovnice Charity (25. 6. 2026)',
    category: 'charita-sluzby',
    categoryLabel: 'Stanoviska sociálních služeb',
    issuingBody: '[OTEC]',
    targetBody: 'Charita [MĚSTO X] ([Ing. ŘEDITELKA CHARITY])',
    dateStr: '[DATUM]',
    caseRef: 'Stížnost na incident ze dne [DATUM]',
    summary: 'Oficiální stížnost ředitelce Charity na terénní pracovnici, která asistovala matce při neoprávněném vniknutí do obydlí otce a vytržení spícího nemocného kojence z postýlky.',
    legalTakeaway: 'Sociální pracovník neziskové organizace nesmí sloužit jako "fyzický doprovod" k svémocnému odebrání dítěte bez vykonatelného titulu. Takové chování zakládá porušení etického kodexu a Standardu č. 1.',
    content: `ADRESÁT: Charita [MĚSTO X], k rukám ředitelky [Ing. ŘEDITELKA CHARITY], MBA
PODAVATEL: [OTEC], nar. [DATUM], bytem [OBEC B]
NA VĚDOMÍ: Ministerstvo práce a sociálních věcí, OSPOD

Věc: STÍŽNOST NA NEPROFESIONÁLNÍ A PROTIPRÁVNÍ POSTUP ZAMĚSTNANKYNĚ ([Bc. SOCIÁLNÍ PRACOVNICE CHARITY]) PŘI ASISTENCI U NEZLETILÉHO [NEZLETILÝ SYN A] – OHROŽENÍ ZDRAVÍ DÍTĚTE A MAŘENÍ VÝKONU ROZHODNUTÍ

Vážená paní ředitelko,

tímto podávám oficiální stížnost na postup Vaší zaměstnankyně [Bc. SOCIÁLNÍ PRACOVNICE CHARITY], která dne [DATUM] v dopoledních hodinách asistovala při incidentu v mém bydlišti v [OBEC B].

Jmenovaná pracovnice se dostavila jako doprovod matky [MATKA] a poskytla jí krytí k následujícímu jednání:
1. Asistence u porušení domovní svobody: Vstoupila bez mého souhlasu do mého obydlí a nečinně přihlížela vulgárnímu napadání mé osoby ze strany matky.
2. Nečinnost při svémocném odebrání nemocného dítěte: Můj syn v klidu spal v postýlce s horečkou 37,6 °C v akutní fázi neštovic. Matka ho z postýlky hrubě vytrhla a odvezla. Pracovnice nijak nezasáhla.
3. Absence právního titulu: V danou dobu mi nový rozsudek ještě nebyl doručen do datové schránky (doručen až ve 13:21 hod), tudíž platil původní protokol a péče otce.

Žádám vyvázání [Bc. SOCIÁLNÍ PRACOVNICE CHARITY] z asistence u naší rodiny a kárné opatření.

V [OBEC B] dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-11',
    pageNumber: 11,
    title: 'Druhé doplnění podnětu MPSV – Asistence u ohrožení zdraví dítěte Charitou (25. 6. 2026)',
    category: 'mpsv-ombudsman',
    categoryLabel: 'Inspekce MPSV & Ombudsman',
    issuingBody: '[OTEC]',
    targetBody: 'Ministerstvo práce a sociálních věcí ([Mgr. REDITELKA ODBORU MPSV])',
    dateStr: '[DATUM]',
    caseRef: '[SZ/MPSV-2026/XXXXXX]',
    summary: 'Naléhavé doplnění podnětu ministerstvu doplňující důkazy o tom, že Charita neposkytuje neutrální službu, ale funguje jako mocenský nástroj matky při asistenci u svémocných kroků.',
    legalTakeaway: 'Pokud terénní pracovník asistuje u odebrání nemocného kojence před doručením rozsudku, jedná se o fatální selhání poskytovatele sociální služby podléhající inspekci MPSV.',
    content: `MINISTERSTVO PRÁCE A SOCIÁLNÍCH VĚCÍ
Odbor inspekcí sociálních služeb
[Mgr. REDITELKA ODBORU MPSV], ředitelka odboru
Na Poříčním právu 376/1, 128 00 Praha 2

Číslo jednací: [MPSV-2026/XXXXXX]
Spisová značka: [SZ/MPSV-2026/XXXXXX]

Podavatel: [OTEC], nar. [DATUM], bytem [OBEC B]

Věc: DRUHÉ DOPLNĚNÍ PODKLADŮ A DŮKAZŮ K PODNĚTU – STRANICKOST, PORUŠOVÁNÍ STANDARDŮ KVALITY A ASISTENCE U OHROŽENÍ ZDRAVÍ DÍTĚTE POSKYTOVATELEM CHARITA [MĚSTO X]

Vážená paní ředitelko,

v návaznosti na můj dnešní přípis Vám předkládám další zásadní důkaz o systémovém selhání Charity [MĚSTO X].

V příloze zasílám kopii stížnosti na incident ze dne [DATUM], při kterém terénní pracovnice [Bc. SOCIÁLNÍ PRACOVNICE CHARITY] asistovala matce při vniknutí do mého obydlí a svémocném vytržení spícího 6měsíčního kojence s neštovicemi a horečkou 37,6 °C.

K tomuto odebrání došlo v dopoledních hodinách, kdy nový rozsudek nebyl vypraven ani doručen do mé datové schránky (k doručení došlo až ve 13:21 hod). Pracovnice charity tak asistovala u protiprávního odnětí dítěte bez vykonatelného titulu.

Tento incident dokazuje, že Charita neposkytuje neutrální službu, ale funguje jako fyzický doprovod matky k provádění svémocných kroků.

Opětovně žádám o neprodlené zahájení inspekce sociálních služeb.

V [OBEC B] dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-12',
    pageNumber: 12,
    title: 'Žádost otce o společnou schůzku rodičů na OSPODu (10. 6. 2026)',
    category: 'ospod-meu',
    categoryLabel: 'Stížnosti & Odpovědi OSPOD / MěÚ',
    issuingBody: '[OTEC]',
    targetBody: 'OSPOD [MĚSTO X] ([Bc. SOCIÁLNÍ PRACOVNICE])',
    dateStr: '[DATUM]',
    caseRef: 'Žádost o zprostředkování dohody',
    summary: 'Oficiální dopis otce na OSPOD zaslaný hned druhý den po soudním jednání s žádostí o svolání schůzky k sepsání rodičovské dohody o závozu dítěte namísto pendlování.',
    legalTakeaway: 'Proaktivní snaha otce vyřešit logistické problémy smírnou dohodou na půdě OSPODu dokazuje jeho vysokou rodičovskou zralost a konstrukce pro soudní řízení.',
    content: `Odesílatel: [OTEC], bytem [OBEC B]
Adresát: OSPOD [MĚSTO X], k rukám [Bc. SOCIÁLNÍ PRACOVNICE]

V [OBEC B] dne [DATUM]

Věc: Žádost o společnou schůzku rodičů – nezl. [NEZLETILÝ SYN A] (nar. [DATUM])

Vážená paní [Bc. SOCIÁLNÍ PRACOVNICE],

obracím se na Vás jako na kolizního opatrovníka nášho syna [NEZLETILÝ SYN A]. Dne [DATUM] proběhlo u Okresního soudu jednání, které určilo rozvrh péče.

Hned po jednání jsme situaci s matkou [MATKA] v klidu probírali. Oba se jednoznačně shodujeme na tom, že soudem nastavené pendlování (předávání 3x týdně na nádraží) je pro 6měsíční dítě extrémně náročné a neudržitelné. Matka sama situaci označila za „šílenou na tak malé dítě“. Shodli jsme se na zrušení předávání na nádraží a jeho nahrazení přímým závozem do bydliště.

Rádi bychom Vás požádali o zprostředkování společné schůzky na OSPODu v [MĚSTO X]. Naším cílem je sepsat oficiální rodičovskou dohodu o úpravě časů a místa předávání, kterou následně předložíme odvolacímu soudu ke schválení.

Moc Vás prosím o navržení nejbližšího možného termínu. Matka s tímto postupem souhlasí.

S pozdravem,
__________________________
[OTEC]`
  },
  {
    id: 'doc-13',
    pageNumber: 13,
    title: 'Urgence vyřízení podnětu na inspekci u MPSV (13. 6. 2026)',
    category: 'mpsv-ombudsman',
    categoryLabel: 'Inspekce MPSV & Ombudsman',
    issuingBody: '[OTEC]',
    targetBody: 'Ministerstvo práce a sociálních věcí ([Mgr. REDITELKA ODBORU MPSV])',
    dateStr: '[DATUM]',
    caseRef: '[SZ/MPSV-2026/XXXXXX]',
    summary: 'Písemná urgence otce adresovaná ministerstvu po marném uplynutí 30denní lhůty pro vyřízení podnětu na inspekci sociální služby Charita.',
    legalTakeaway: 'Při průtazích státních orgánů je nutné podávat formální urgence s odkazem na marné uplynutí zákonných lhůt a doplňovat nové procesní události ze soudu.',
    content: `ADRESÁT: Ministerstvo práce a sociálních věcí, Odbor inspekce sociálních služeb
[Mgr. REDITELKA ODBORU MPSV], ředitelka odboru, Na Poříčním právu 1/376, 128 01 Praha 2
PODAVATEL: [OTEC], nar. [DATUM], bytem [OBEC B]

VĚC: URGENCE VYŘÍZENÍ PODNĚTU ZE DNE [DATUM] A DOPLNĚNÍ NOVÝCH SKUTEČNOSTÍ

Vážení,

dne [DATUM] jsem k Vašemu úřadu podal Podnět k provedení inspekce sociálních služeb a stížnost na systémové pochybení poskytovatele Charita [MĚSTO X]. Vzhledem k tomu, že zákonná lhůta pro vyřízení již marně uplynula, tímto urguji vyřízení a doplňuji nové skutečnosti:

I. Doplnění podnětu – Účast zástupce poskytovatele u soudního jednání:
Dne [DATUM] proběhlo u Okresního soudu v [OKRESNÍ MĚSTO] jednání ve věci péče. Z oficiálního soudního protokolu vyplývá, že se jednání jako veřejnost aktivně účastnila klíčová pracovnice z Charity [MĚSTO X].

Tato osobní účast pouze potvrzuje nadstandardní a neobjektivní zapojení poskytovatele do rodinného sporu ve prospěch matky. Pracovníci Charity mi nadále systematicky blokují přístup k informacím o synovi a odpírají nahlížení do originálního spisu, což porušuje Standard č. 1 (Ochrana práv osob).

Žádám o sdělení stavu řízení obratem do mé datové schránky.

V [OBEC B] dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-14',
    pageNumber: 14,
    title: 'Podnět k inspekci sociálních služeb u Charity (20. 4. 2026)',
    category: 'mpsv-ombudsman',
    categoryLabel: 'Inspekce MPSV & Ombudsman',
    issuingBody: '[OTEC]',
    targetBody: 'Ministerstvo práce a sociálních věcí (MPSV)',
    dateStr: '[DATUM]',
    caseRef: 'Podnět k inspekci Charity',
    summary: 'Původní rozsáhlý podnět otce k MPSV napadající neprofesionalitu a podjatost terénní pracovnice Charity a odmítání zpřístupnění originálního spisu syna.',
    legalTakeaway: 'Pokud poskytovatel sociálních služeb podmiňuje přístup otce k informacím o dítěti "souhlasem matky", porušuje § 890 občanského zákoníku i zákon o sociálních službách.',
    content: `Věc: PODNĚT K PROVEDENÍ INSPEKCE SOCIÁLNÍCH SLUŽEB A STÍŽNOST NA SYSTÉMOVÉ POCHYBENÍ POSKYTOVATELE

Podavatel: [OTEC], nar. [DATUM], bytem [OBEC B]
Proti poskytovateli: Charita [MĚSTO X] (IČO: [ANONYMIZOVÁNO]), ředitelka [Ing. ŘEDITELKA CHARITY], klíčová pracovnice [Bc. SOCIÁLNÍ PRACOVNICE CHARITY]

I. Předmět podnětu
Podávám tento podnět k prošetření postupů Charity [MĚSTO X]. Stížnost směřuje proti neprofesionálnímu vedení sociální dokumentace a porušování Standardů kvality sociálních služeb. Namítám podjatost klíčové pracovnice [Bc. SOCIÁLNÍ PRACOVNICE CHARITY] a krytí těchto postupů vedením.

II. Konkrétní pochybení
1. Neprofesionalita a podjatost: Pracovnice nepostupuje nestranně, selektivně upravuje informace předávané otci a vyvolává dojem, že jedná výhradně v zájmu matky.
2. Odpírání nahlížení do dokumentace: Ředitelka mi protiprávně odmítá umožnit nahlédnutí do originálního spisu syna a nutí mi subjektivně upravený 1stránkový „Výpis“. Tvrdí, že přístup k dokumentaci syna je podmíněn „souhlasem matky“, což je v rozporu s § 890 o.z.
3. Porušení Standardů kvality č. 1 (Ochrana práv) a č. 15 (Vyřizování stížností).

III. Návrh na opatření
Žádám MPSV, aby v rámci inspekce prověřilo meze dokumentace a uložilo povinnost zpřístupnit úplný originál spisu.

V [OBEC B] dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-15',
    pageNumber: 15,
    title: 'Stížnost na postup OSPODu podle § 175 správního řádu (15. 6. 2026)',
    category: 'ospod-meu',
    categoryLabel: 'Stížnosti & Odpovědi OSPOD / MěÚ',
    issuingBody: '[OTEC]',
    targetBody: 'Městský úřad [MĚSTO X] (Tajemník úřadu) / Ombudsman',
    dateStr: '[DATUM]',
    caseRef: '[Ko XX/2026]',
    summary: 'Oficiální stížnost tajemníkovi Městského úřadu na sociální pracovnice OSPODu, které v závěrečném návrhu navrhly setkávání s kojencem na autobusové zastávce bez zohlednění bratra.',
    legalTakeaway: 'Stížnost dle § 175 správního řádu podaná vedení úřadu je povinným předchozím krokem pro to, aby se věcí mohl následně zabývat Veřejný ochránce práv (Ombudsman).',
    content: `STÍŽNOST NA POSTUP OSPOD A PODNĚT K ŠETŘENÍ

Adresát 1: Městský úřad [MĚSTO X] – k rukám tajemníka úřadu
Adresát 2: Kancelář veřejného ochránce práv (ombudsman), Údolní 39, Brno
Stěžovatel: [OTEC], nar. [DATUM], bytem [OBEC B]

Spisová značka OSPOD: [Ko XX/2026]
Soudní řízení: sp. zn. [SPIS. ZN. 13 Nc XX/2026]

VĚC: Stížnost na postup OSPOD [MĚSTO X] podle § 175 správního řádu a podnět k šetření Veřejnému ochránci práv

Tímto podávám oficiální stížnost na postup OSPOD [MĚSTO X], konkrétně pracovnic [Ing. SOCIÁLNÍ PRACOVNICE] a [DiS. VEDOUCÍ ODBORU], které vypracovaly závěrečný návrh opatrovníka ze dne [DATUM].

I. POPIS POCHYBENÍ OSPOD
1. Úplné ignorování sourozenecké vazby: OSPOD navrhl omezit můj kontakt se synem [NEZLETILÝ SYN A] na odpolední hodiny na ulici / autobusové zastávce v [MĚSTO X]. Tento režim zcela vylučuje kontakt se starším bratrem [NEZLETILÝ SYN C], který v té době plní školní docházku.
2. Mechanické přebírání postojů matky: Pracovnice nepostupovaly jako neutralní orgán, ale převzaly požadavek matky bez ohledu na mé osvědčené péče o starší dítě.

II. ROZPOR S VĚDECKÝMI POZNATKY
OSPOD argumentuje dogmatem o „kojeneckém období“, což je v rozporu se studii Prof. Warshaka.

Žádám tajemníka MěÚ o přešetření a nápravu.

V [OBEC B] dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-16',
    pageNumber: 16,
    title: 'Doplňující odvolání otce – Důkazy o zanedbávání hygieny a citovém vydírání (22. 6. 2026)',
    category: 'soudni-podani',
    categoryLabel: 'Soudní podání otce',
    issuingBody: 'Odvolatel (Otec)',
    targetBody: 'Krajský soud v [KRAJSKÉ MĚSTO]',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Rozsáhlé odvolací podání doplňující fotodokumentaci zaslanou samotnou matkou (terasa znečištěná exkrementy, s nimiž si hraje batole) a důkazy o vyhlašování informačního embarga.',
    legalTakeaway: 'Zdokumentované nehygienické prostředí u matky v kombinaci s infekčním onemocněním druhého dítěte představuje akutní epidemiologické riziko, které odvolací soud musí posoudit.',
    content: `KRAJSKÉMU SOUDU V [KRAJSKÉ MĚSTO]
prostřednictvím Okresního soudu v [OKRESNÍ MĚSTO]

Ke sp. zn.: [SPIS. ZN. 13 Nc XX/2026]
Matka: [MATKA]
Otec: [OTEC]
Nezletilý: [NEZLETILÝ SYN A]

DOPLNĚNÍ ODVOLÁNÍ OTCE – PŘEDLOŽENÍ NOVÝCH DŮKAZŮ O VÝCHOVNÉ NEZPŮSOBILOSTI MATKY, ZANEDBÁVÁNÍ HYGIENY A CITOVÉM VYDÍRÁNÍ

Otec předkládá odvolacímu soudu zásadní nově vzniklé důkazy (chatovou komunikaci a fotodokumentaci ze dnů 21. a 22. 6. 2026):

I. Účelové rušení dohod a výmluvy matky: Matka nejdříve souhlasila s azylem nemocného syna s neštovicemi u otce, následně dohodu zrušila s odkazem na únavu ze slunce a výměnu čerpadla u známého.
II. Negativní dopad na staršího syna [NEZLETILÝ SYN C]: Matka odmítla součinnost při logistice školní akce staršího bratra.
III. Záměrná sabotáž komunikace: Matka vyhlásila sankční režim „jedné zprávy denně“ jako pomstu za to, že otec konzultoval stav s dětskou lékařkou.
IV. Zanedbávání hygienických standardů: Matka otci zaslala fotografii terasy znečištěné exkrementy s textem: „[NEZLETILÝ SYN B] teď měl srajdu... Si s tím hrál na terase“. V situaci, kdy [NEZLETILÝ SYN A] má otevřené rány po neštovicích, jde o vážné ohrožení zdraví.
V. Otevřené citové vydírání: Matka píše: „Jestli se mě ještě jednou zkusíš někde obejít tak konec a víc pomáhat nebudu.“

Navrhuji zrušení rozsudku prvního stupně a schválení pevného 4týdenního cyklu otce.

V [OBEC B] dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-17',
    pageNumber: 17,
    title: 'Informace pro OSPOD o zmaření péče a podání exekučního návrhu (26. 6. 2026)',
    category: 'ospod-meu',
    categoryLabel: 'Stížnosti & Odpovědi OSPOD / MěÚ',
    issuingBody: '[OTEC]',
    targetBody: 'OSPOD [MĚSTO X] ([Bc. SOCIÁLNÍ PRACOVNICE])',
    dateStr: '[DATUM]',
    caseRef: 'Vyrozumění o maření péče',
    summary: 'Sdělení OSPODu, že matka zmařila páteční péči otce a odmítla ho pustit do objektu i na dohodnutou návštěvu nemocného syna, pročež byl podán návrh na výkon rozhodnutí.',
    legalTakeaway: 'OSPOD musí být okamžitě písemně vyrozuměn o každém podaném návrhu na výkon rozhodnutí (exekuci styku), aby tyto skutečnosti promítl do své spisové dokumentace.',
    content: `Odesílatel: [OTEC], bytem [OBEC B]
Adresát: OSPOD [MĚSTO X], k rukám [Bc. SOCIÁLNÍ PRACOVNICE]

Věc: Informace o zmaření péče ze strany matky a podání návrhu k soudu
Nezletilý: [NEZLETILÝ SYN A], nar. [DATUM]
Datum: [DATUM]

Vážená paní [Bc. SOCIÁLNÍ PRACOVNICE],

informuji Vás, že ze strany matky došlo k úplnému zmaření mého výkonu péče o syna [NEZLETILÝ SYN A], který měl proběhnout dnes, v pátek [DATUM].

Matka odmítla syna předat s odkazem na plané neštovice. Naše dohoda ze dne [DATUM] však výslovně stanoví mechanismus pro případ nemoci, že „přijede otec do bydliště matky“. Matce jsem prokazatelně nabídl, že v zájmu syna vykonám návštěvu v jejím bydlišti v [OBEC C], aby syn necestoval. Matka to však striktně odmítla se slovy „teď návštěvy nechceme“.

Vzhledem k tomu, že jde o svévolné maření platné dohody i vykonatelného rozsudku, podal jsem dnes Okresnímu soudu Návrh na zahájení řízení o výkonu rozhodnutí.

V příloze zasílám toto podání i screeny komunikace pro Vaši evidenci ve spisu.

S pozdravem,
__________________________
[OTEC]`
  },
  {
    id: 'doc-18',
    pageNumber: 18,
    title: 'Nalévavé doplnění odvolání – Incident ze dne 24. 6. 2026 a neštovice',
    category: 'soudni-podani',
    categoryLabel: 'Soudní podání otce',
    issuingBody: 'Odvolatel (Otec)',
    targetBody: 'Krajský soud v [KRAJSKÉ MĚSTO]',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Urgentní odvolací podání předkládající fotografie masivního výsevu neštovic a horečky 37,6 °C a popisující fyzické odebrání dítěte matkou za asistence Charity.',
    legalTakeaway: 'Důkazní fotografie zdravotního stavu dítěte (teploměr, výsev neštovic) přiložené k podání jednoznačně dokazují nezodpovědný přístup matky k transportu nemocného kojence.',
    content: `KRAJSKÉMU SOUDU V [KRAJSKÉ MĚSTO]
prostřednictvím Okresního soudu v [OKRESNÍ MĚSTO]

Spisová značka: [SPIS. ZN. 13 Nc XX/2026]
Otec: [OTEC]
Matka: [MATKA]
Nezletilý: [NEZLETILÝ SYN A]

VĚC: NALÉHAVÉ DOPLNĚNÍ ODVOLÁNÍ OTCE – OZNÁMENÍ O MAŘENÍ DOHOD, OHROŽENÍ ZDRAVÍ NEZLETILÉHO A UPŘESNĚNÍ VÝCHOVNÉHO NÁVRHU NA ČTYŘTÝDENNÍ REŽIM PÉČE (Incident ze dne [DATUM])

Otec předkládá přímé důkazy o naprostém selhání stávajícího provizorního uspořádání péče:

I. Skutkový stav: Nezletilý [NEZLETILÝ SYN A] (6 měsíců) prochází velmi těžkým průběhem planých neštovic s horečkou 37,6 °C (viz přiložené fotografie teploměru a výsevu). Podle dohody mělo dítě zůstat v klidovém režimu u otce.

II. Popis incidentu: Matka krizové pravidlo ignorovala. Osobně dorazila do bydliště otce v [OBEC B], kde verbálně eskalovala situaci, otci vulgárně nadávala a těžce nemocného kojence v horečkách otci fyzicky odebrala.

III. Upřesněný návrh: Jakýkoliv model vyžadující neustálou operativní domluvu je kvůli agresivní reaktivitě matky dlouhodobě neudržitelný. Navrhuji zavedení pevného 4týdenního cyklu a striktní pravidlo, že při nemoci dítě zůstává u toho rodiče, u kterého onemocnělo.

Důkazy: Fotografie teploměru 37,6 °C, fotografie výsevu neštovic.

V [OBEC B] dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-19',
    pageNumber: 19,
    title: 'Doplnění urgentního oznámení pro OSPOD a soud – Popis incidentu z 24. 6. 2026',
    category: 'ospod-meu',
    categoryLabel: 'Stížnosti & Odpovědi OSPOD / MěÚ',
    issuingBody: '[OTEC]',
    targetBody: 'OSPOD [MĚSTO X] / Okresní soud',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Podrobná rekapitulace právního stavu v době dopoledního incidentu dokazující, že rozsudek byl vypraven až ve 12:05 hod., tudíž matka neměla žádný vykonatelný titul.',
    legalTakeaway: 'Právní argumentace časem doručení: Rozsudek podepsaný asistentkou v 12:05 nedává matce právo dopoledne vtrhnout do domu otce a odebrat dítě.',
    content: `ADRESÁT: OSPOD [MĚSTO X] / Okresní soud v [OKRESNÍ MĚSTO]
K rukám: [Bc. SOCIÁLNÍ PRACOVNICE]
ODESÍLATEL: [OTEC], bytem [OBEC B]
DATUM: [DATUM]

VĚC: DOPLNĚNÍ URGENTNÍHO OZNÁMENÍ O PORUŠENÍ DOHOD A OHROŽENÍ ZDRAVÍ NEZLETILÉHO [NEZLETILÝ SYN A] ZE DNE [DATUM]

Vážená paní [Bc. SOCIÁLNÍ PRACOVNICE],

doplňuji popis skutkového děje, ke kterému došlo dne [DATUM] v dopoledních hodinách v mém bydlišti v [OBEC B].

1. Právní stav v době incidentu (Absence právního titulu matky):
K incidentu došlo v dopoledních hodinách dne [DATUM]. V této době byl pro oba rodiče stále plně závazný protokol z jednání ze dne [DATUM], podle kterého měla má péče trvat až do středy. Nový rozsudek Okresního soudu byl asistentkou soudkyně digitálně podepsán a vypraven až téhož dne ve 12:05 hodin. V momentě, kdy matka vtrhla do mého obydlí, neměla v ruce žádný nový vykonatelný titul. Její jednání bylo čistě svémocné.

2. Skutkový děj:
Matka přistoupila k dětské postýlce, kde nemocný [NEZLETILÝ SYN A] s horečkou 37,6 °C spal, a spící dítě z postýlky vytrhla. Z mé strany nedošlo k fyzickému odporu výhradně z důvodu ochrany zdraví kojence před zraněním a z respektu k přítomné pracovnici Charity.

3. Zneužití doprovázející organizace:
Matka zmanipulovala Charitu a použila ji jako ochranný štít.

Žádám OSPOD o neprodlené zaevidování tohoto popisu do spisu nezletilého.

S pozdravem,
__________________________
[OTEC]`
  },
  {
    id: 'doc-20',
    pageNumber: 20,
    title: 'Odpověď tajemnice Městského úřadu na stížnost dle § 175 správního řádu',
    category: 'ospod-meu',
    categoryLabel: 'Stížnosti & Odpovědi OSPOD / MěÚ',
    issuingBody: 'Městský úřad [MĚSTO X] ([Ing. TAJEMNICE])',
    targetBody: '[OTEC]',
    dateStr: '[DATUM]',
    caseRef: 'Vyřízení stížnosti na OSPOD',
    summary: 'Oficiální rozhodnutí vedení radnice odmítající stížnost otce na OSPOD. Tajemnice tvrdí, že autobusová zastávka byla uvedena jen jako příklad neutrálního místa.',
    legalTakeaway: 'Kroky vedení městských úřadů téměř vždy stížnosti na podřízený OSPOD odmítají. Tento dokument je však nutnou prerekvizitou k podání podnětu Krajskému úřadu a Ombudsmanovi.',
    content: `MĚSTSKÝ ÚRÁD [MĚSTO X]
[Ing. TAJEMNICE], tajemnice
Československé armády 1665, [MĚSTO X]

Vážený pan [OTEC]
[OBEC A]

V [MĚSTO X] dne [DATUM]

Věc: Odpověď na stížnost na postup OSPOD [MĚSTO X] – Vyřízení stížnosti podle § 175 správního řádu

Vážený pane,

dne [DATUM] obdržel Městský úřad Vaši stížnost na postup Orgánu sociálně-právní ochrany dětí Městského úřadu [MĚSTO X]. Namítáte zejména neobjektivní postup OSPOD a nedostatečné zohlednění sourozeneckých vazeb.

Po přezkoumání stížnosti a vyjádření zaměstnankyň odboru sociálního bylo zjištěno:

OSPOD vystupuje jako kolizní opatrovník nezletilého dítěte. Při formulaci návrhu vycházel z posouzení potřeb 6měsíčního dítěte a potřeby stability prostředí. Ze spisu nevyplývá, že by pracovnice postupovaly jednostranně.

Námitka předávání na autobusové zastávce nebyla shledána důvodnou; zastávka byla uvedena pouze jako příklad neutrálního místa předání.

Hodnocení sourozeneckých vazeb náleží do působnosti kolizního opatrovníka a následně soudu.

Stížnost podle § 175 správního řádu byla vyhodnocena jako nedůvodná.

S pozdravem,
__________________________
[Ing. TAJEMNICE]
tajemnice Městského úřadu [MĚSTO X]`
  },
  {
    id: 'doc-21',
    pageNumber: 21,
    title: 'Vyřízení stížnosti Charitou (13. 4. 2026) – WhatsApp a mlčenlivost',
    category: 'charita-sluzby',
    categoryLabel: 'Stanoviska sociálních služeb',
    issuingBody: 'Charita [MĚSTO X] ([Ing. ŘEDITELKA CHARITY])',
    targetBody: '[OTEC]',
    dateStr: '[DATUM]',
    caseRef: 'Vyřízení stížnosti ze dne [DATUM]',
    summary: 'Odpověď ředitelky Charity obhajující odmítnutí komunikace přes WhatsApp a zamítající požadavek otce na změnu klíčové sociální pracovnice.',
    legalTakeaway: 'Neziskové organizace se odvolávají na přání své primární klientky (matky). Pokud matka změnu pracovnice nechce, organizace stížnosti druhého rodiče nevyhoví.',
    content: `CHARITA [MĚSTO X]
Pražská 14, [PSČ MĚSTO X]

Vážený pan [OTEC]
[OBEC A]

V [MĚSTO X] dne [DATUM]

VĚC: Vyřízení stížnosti na postup pracovnice

Vážený pane,

obdrželi jsme Vaši stížnost týkající se postupu vedoucí sociální služby [Bc. SOCIÁLNÍ PRACOVNICE CHARITY] a Vaše požadavky na změnu klíčové pracovnice a zpřístupnění dokumentace.

Po posouzení uvádíme:
1. Postavení stěžovatele: Sociální služba je poskytována matce jako její uživatelce. Vy ani dítě nejste uživateli. Vaše právo na informace o dítěti bylo naplněno poskytnutím výpisu.
2. Komunikace: Omezení neformální komunikace přes WhatsApp je v souladu s profesionálními standardy sociální práce.
3. Změna pracovnice: Požadavek nepovažujeme za důvodný. Uživatelka si změnu nepřeje.
4. Dokumentace: Kompletní dokumentace obsahuje informace o uživatelce a podléhá mlčenlivosti.

Tímto považujeme Vaši stížnost za vyřízenou.

S pozdravem,
__________________________
[Ing. ŘEDITELKA CHARITY]
ředitelka Charity [MĚSTO X]`
  },
  {
    id: 'doc-22',
    pageNumber: 22,
    title: 'Doplnění podnětu MPSV – Doložení doručenky z Datové schránky (13:21 hod)',
    category: 'mpsv-ombudsman',
    categoryLabel: 'Inspekce MPSV & Ombudsman',
    issuingBody: '[OTEC]',
    targetBody: 'Ministerstvo práce a sociálních věcí (MPSV)',
    dateStr: '[DATUM]',
    caseRef: '[SZ/MPSV-2026/XXXXXX]',
    summary: 'Doplňující důkaz pro MPSV obsahující přesný časový výpis doručení rozsudku do Datové schránky otce (13:21 hod.), čímž je dokázáno, že dopolední odvoz dítěte byl bez právního titulu.',
    legalTakeaway: 'Klíčový důkazní prvek v procesním právu: Výpis z Portálu občana / Datové schránky dokazuje přesnou sekundu doručení. Všechny předchozí úkony třetích osob jsou protiprávní.',
    content: `MINISTERSTVO PRÁCE A SOCIÁLNÍCH VĚCÍ
Odbor inspekcí sociálních služeb
[Mgr. REDITELKA ODBORU MPSV], ředitelka odboru

Spisová značka: [SZ/MPSV-2026/XXXXXX]
Odesílatel: [OTEC], nar. [DATUM], bytem [OBEC B]

Věc: Doplnění podnětu k výkonu inspekce – doložení doručenky z Datové schránky

Vážená paní ředitelko,

v návaznosti na Vaše stanovisko ze dne [DATUM] dokládám klíčový listinný důkaz:

Oficiální výpis doručenky z Datové schránky stěžovatele ([ID DATOVÉ SCHRÁNKY]):
- Rozsudek Okresního soudu v [OKRESNÍ MĚSTO], č. j. [SPIS. ZN. 13 Nc XX/2026-169], byl do datové schránky otce doručen dne [DATUM] přesně ve 13:21:05 hodin.

Tento časový údaj neprůstřelně dokazuje, že v době dopoledního incidentu (přibližně v 10:30 hodin téhož dne), kdy terénní pracovnice Charity [Bc. SOCIÁLNÍ PRACOVNICE CHARITY] asistovala matce při odvozu spícího nemocného kojence, nový rozsudek vůči otci neexistoval.

Pracovnice Charity tak vědomě asistovala u protiprávního odnětí dítěte bez vykonatelného právního titulu.

Žádám o zahájení inspekce.

Příloha: Výpis doručenky z Datové schránky.

V [OBEC B] dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-23',
    pageNumber: 23,
    title: 'Vyrozumění exekutora o zápisu doložky provedení exekuce (15. 6. 2026)',
    category: 'soudni-usneseni',
    categoryLabel: 'Soudní usnesení & rozsudky',
    issuingBody: 'Exekuční úřad [OKRESNÍ MĚSTO] ([Mgr. SOUDNÍ EXEKUTOR])',
    targetBody: 'Peněžní ústav / Oprávněný ([OTEC])',
    dateStr: '[DATUM]',
    caseRef: '[Č.J. 211 EX XXX/25]',
    summary: 'Oficiální vyrozumění soudního exekutora o zápisu doložky exekuce na základě exekučního titulu pro vymožení pohledávky.',
    legalTakeaway: 'Dokument z exekučního řízení dokládá využití právních prostředků k vymožení stanovených povinností a finančních nároků spojených s výživným a náklady.',
    content: `EXEKUTORSKÝ ÚŘAD [OKRESNÍ MĚSTO]
[Mgr. SOUDNÍ EXEKUTOR], soudní exekutor
[ADRESA EXEKUTORSKÉHO ÚŘADU]

Č. j.: 211 EX XXX/25-35
Datum: [DATUM]

Vyrozumění o tom, že doložka provedení exekuce byla zapsána do RZE

Soudní exekutor [Mgr. SOUDNÍ EXEKUTOR], Exekučního úřadu v [OKRESNÍ MĚSTO], podává vyrozumění, že ve věci exekuce vedené

na návrh oprávněného: [OTEC], bytem [OBEC B], zastoupený [OTEC]
proti
povinnému: [DLUŽNÍK], bytem [OBEC X]

byla doložka provedení exekuce zapsána do rejstříku zahájených exekucí.
Na základě exekučního příkazu byla exekuce prováděna přikázáním pohledávky z účtu povinného.

Plnění nechť je poukázáno na účet exekutorského úřadu.

[Mgr. SOUDNÍ EXEKUTOR] v. r.
soudní exekutor`
  },
  {
    id: 'doc-24',
    pageNumber: 24,
    title: 'Podnět Stálé komisi pro rodinu a rovné příležitosti PS PČR (Systemový rozbor)',
    category: 'mpsv-ombudsman',
    categoryLabel: 'Inspekce MPSV & Ombudsman',
    issuingBody: '[OTEC]',
    targetBody: 'Stálá komise pro rodinu Poslanecké sněmovny PČR',
    dateStr: '[DATUM]',
    caseRef: 'Podnět k systémovému selhání OSPOD',
    summary: 'Systémové podání poslancům ČR rozebírající selhávání OSPODů v ochraně rovnoprávného rodičovství otců, ignorování sourozeneckých vazeb u kojenců a alibismus MPSV.',
    legalTakeaway: 'Systémová podání parlamentním výborům pomáhají vytvářet veřejný a legislativní tlak na reformu opatrovnického soudnictví a metodik OSPOD.',
    content: `[OTEC]
[OBEC A]

Stálá komise pro rodinu a rovné příležitosti
Poslanecká sněmovna Parlamentu ČR
Sněmovní 4, 118 26 Praha 1 - Malá Strana

Věc: Podnět k prošetření systémového selhávání orgánů sociálně-právní ochrany dětí (OSPOD) a MPSV při hájení zájmů nezletilých dětí a principu rovného rodičovství

Vážená paní předsedkyně, vážené poslankyně, vážení poslanci,

obracím se na Stálou komisi pro rodinu s podnětem ukazujícím na závažný a dlouhodobý systémový problém v postupu OSPOD a na selhání Ministerstva práce a sociálních věcí (MPSV) při jejich metodickém vedení.

Jako otec narážím při jednání s lokálním úřadem na nedostatek objektivity, ignorování zájmů dítěte a diskriminaci otců. Podal jsem stížnost na OSPOD [MĚSTO X], kde jsem upozorňoval, že pracovnice postupují jednostranně a ignorují sourozenecké vazby mezi mým starším synem [NEZLETILÝ SYN C] v mé péči a mladším synem [NEZLETILÝ SYN A].

Klíčové body selhání:
1. Selhání metodického vedení MPSV: Úřednice uplatňují zastaralé stereotypy a ignorují judikaturu Ústavního soudu o budování sourozeneckých vazeb.
2. Absence kontrolního mechanismu: Nadřízený úředník pouze formálně kryje podřízené bez přezkumu objektivity.
3. Tolerance formalismu: Návrhy na předávání dítěte „na autobusové zastávce“ v rozsahu 3 hodin odpoledne znemožňují odvézt dítě do rodinného bydliště otce.

Děkuji za pozornost, kterou tomuto podnětu budete věnovat.

S pozdravem,
__________________________
[OTEC]`
  },
  {
    id: 'doc-25',
    pageNumber: 25,
    title: 'Podrobné doplnění námitek u Okresního soudu – Hodinová analýza a znalecký posudek',
    category: 'soudni-podani',
    categoryLabel: 'Soudní podání otce',
    issuingBody: 'Navrhovatel (Otec)',
    targetBody: 'Okresní soud v [OKRESNÍ MĚSTO]',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Rozbor ukazující matematický klam rozsudku v deklarovaných "12 dnech v měsíci" oproti reálným 28,8 hodinám týdně a požadavek na psychologický posudek výchovných postojů matky.',
    legalTakeaway: 'Matematický přepočet hodinové dotace péče dokazuje, že deklarovaná "společná péče" v rozsudku je ve skutečnosti jen necelých 29 hodin týdně bez nocí.',
    content: `Okresní soud v [OKRESNÍ MĚSTO]
[ADRESA SOUDU]

Věc: Podrobné doplnění námitek, návrh na provedení důkazů a podnět k prověření systémového selhání ve věci sp. zn. [SPIS. ZN. 13 Nc XX/2026]

Vážený pane soudce / Vážená paní soudkyně,

jako otec nezletilého [NEZLETILÝ SYN A] předkládám podrobné doplnění k probíhajícímu řízení:

1. Matematická analýza a procesní omyl v určení rozsahu péče:
Rozsudek operuje s deklarovaným rozsahem péče „12 dnů v měsíci“. Tento údaj je v přímém rozporu se skutečnou časovou dotací. Při přepočtu na reálné hodiny v rámci dvoutýdenního cyklu činí celková bilance 57 hodin a 45 minut, což v průměru na jeden týden představuje pouhých 28 hodin a 52 minut. Faktická časová dotace nedosahuje ani poloviny deklarovaného rozsahu.

2. OSPOD: Aktivní sabotáž rodinných vazeb:
Ve vyjádření OSPOD explicitně přiznal, že při návrhu péče záměrně ignoroval sourozenecké vazby se starším bratrem [NEZLETILÝ SYN C] v mé péči a upřednostnil izolovaný pohled na kojence.

3. Diskriminace na základě sociálního statusu a dopravy:
Soud se nechal ovlivnit absencí osobního automobilu otce. Kvalita rodičovství se neodvíjí od vlastnictví vozu, ale od osobní vazby a péče.

4. Návrh na vypracování znaleckého posudku k výchovným postojům matky:
Navrhuji, aby soud nechal vypracovat znalecký posudek z oboru psychologie se zaměřením na výchovné postoje matky a zjištění, zda její jednání nenese znaky psychické manipulace dítěte proti otci.

S pozdravem,
__________________________
[OTEC]`
  }
];
