/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AnonymizedDocument {
  id: string;
  pageNumber: number; // 1 to 20 ("Jeden dokument jedna stránka")
  title: string;
  category: 'soudni-podani' | 'soudni-usneseni' | 'ospod-meu' | 'mpsv-ombudsman' | 'charita-sluzby';
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
    title: 'Odvolání otce proti usnesení o nepřihlížení k návrhu na prozatímní rozhodnutí',
    category: 'soudni-podani',
    categoryLabel: 'Soudní podání otce',
    issuingBody: 'Navrhovatel (Otec)',
    targetBody: 'Krajský soud v [KRAJSKÉ MĚSTO] (přes Okresní soud)',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Právně argumentované odvolání proti usnesení podle § 465d odst. 2 z.ř.s. Poukazuje na vnitřní rozpor v odůvodnění soudu (rozpor s citovanými vědeckými poznatky) a na změnu poměrů spočívající v obcházení dohod a transportu nemocného dítěte.',
    legalTakeaway: 'Pokud soud v odůvodnění cituje moderní výzkumy o potřebě kontinuity vazeb k oběma rodičům, ale výrokově rozhodne v rozporu s nimi, zakládá to vnitřní rozpor a nepřezkoumatelnost rozhodnutí.',
    content: `KRAJSKÝ SOUD V [KRAJSKÉ MĚSTO]
(prostřednictvím Okresního soudu v [OKRESNÍ MĚSTO])

Sp. zn.: [SPIS. ZN. 13 Nc XX/2026]
Věc: Odvolání proti usnesení o nepřihlížení k návrhu na vydání prozatímního rozhodnutí

Navrhovatel (Otec): [OTEC], nar. [DATUM], bytem [OBEC A], pobytem [OBEC B]
Matka: [MATKA], nar. [DATUM], bytem [OBEC C]
Nezletilý: [NEZLETILÝ SYN A], nar. [DATUM]

I.
Proti usnesení Okresního soudu v [OKRESNÍ MĚSTO] ze dne [DATUM], č. j. [SPIS. ZN.], kterým bylo rozhodnuto, že se k mému návrhu na vydání prozatímního rozhodnutí ze dne [DATUM] nepřihlíží, podávám v zákonné lhůtě toto odvolání.

II. DŮVODY ODVOLÁNÍ
Napadené rozhodnutí soudu prvního stupně je věcně nesprávné, vnitřně rozporné, nepřezkoumatelné a je v přímém rozporu s nejlepším zájmem nezletilého syna [NEZLETILÝ SYN A]. V odůvodnění usnesení shledávám následující zásadní pochybení:

1. Vnitřní rozpor a rozpor s vědeckými poznatky:
Soud v odůvodnění svého rozhodnutí správně cituje moderní vědecké poznatky o potřebách nezletilého dítěte a nutnosti kontinuity vazeb. Následně však svým výrokem rozhodl v přímém rozporu s těmito citovanými závěry. Pokud soud sám konstatuje, že pro zdravý vývoj dítěte je nezbytná stabilita a vyrovnaný kontakt s oběma rodiči, pak odmítnutí projednání mého návrhu na rozšíření péče přímo popírá vědecké standardy, na které se soud sám odvolává. Toto rozhodnutí je vnitřně rozporné a nepřezkoumatelné.

2. Nesprávné posouzení změny poměrů a ignorování reálného stavu:
Soud nesprávně aplikuje ustanovení § 465d odst. 2 z.ř.s. a nepřihlíží k novému návrhu, přestože od vydání původního rozhodnutí došlo k zásadnímu zhoršení situace. Dochází k aktivní sabotáži spolupráce ze strany terénní sociální služby, která spolupracuje výhradně s matkou a zatajuje mi sociální dokumentaci.

3. Ohrožení zdraví a psychiky nezletilého:
V průběhu června a července byly doloženy případy rizikového transportu nezletilého v době jeho nemoci (horečky, plané neštovice), čímž matka a asistující pracovnice porušily klidový režim nutný pro zdraví dítěte. OSPOD navíc ve svém vyjádření přiznal, že při návrzích vědomě ignoruje sourozenecké vazby, čímž poškozuje psychosociální vývoj nezletilého. Přestože soud odkazoval na odbornou pomoc, matka odmítá jakoukoli komunikaci mimo rigidní rámec.

III. NÁVRH NA ÚPRAVU POMĚRŮ A SYSTÉMOVÉ ŘEŠENÍ
Současný režim „lichého týdne“ je pro nezletilého [NEZLETILÝ SYN A] i pro mne naprosto nevyhovující. Působí jako neustálý koloběh balení a transportu, kdy dítě nemá prostor pro adaptaci a já nemám možnost plnohodnotně naplnit svou roli. Tento systém je prokazatelně nevhodný i pro matku, která v domácnosti pečuje o druhého syna [NEZLETILÝ SYN B] se speciálními potřebami (autismus), kde časté předávací cykly narušují potřebný klid.

Jediným smysluplným řešením pro zajištění klidu všech dětí i rodičů je úprava na režim minimálně dvou nocí v týdnu. Tento model:
• Eliminuje matčinu nevůli ke kooperaci v rámci společné péče a nastavuje jasná pravidla.
• Vyřeší kritické logistické problémy a odstraní diskriminační překážky spojené s dopravou.
• Zajistí nezbytný klid pro [NEZLETILÝ SYN A] a stabilitu pro ostatní děti v rodinách ([NEZLETILÝ SYN B] a [NEZLETILÝ SYN C]).
• Zruší zbytečnou asistenci sociální služby, jejíž činnost vykazuje podjatost.

IV. ZÁVĚR
S ohledem na výše uvedené skutečnosti navrhuji, aby Krajský soud v [KRAJSKÉ MĚSTO] napadené usnesení Okresního soudu v [OKRESNÍ MĚSTO] zrušil a věc vrátil k dalšímu řízení, případně vydal nové prozatímní rozhodnutí, kterým se upravuje stávající režim péče dle tohoto odvolání.

DŮKAZY:
• Vyjádření OSPOD ze dne [DATUM]
• Záznamy o komunikaci a předávání
• Dřívější podání a fotodokumentace založené ve spisu

V [OBEC B], dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-02',
    pageNumber: 2,
    title: 'Odvolání otce proti usnesení o zamítnutí návrhu na prozatímní rozhodnutí',
    category: 'soudni-podani',
    categoryLabel: 'Soudní podání otce',
    issuingBody: 'Navrhovatel (Otec)',
    targetBody: 'Krajský soud v [KRAJSKÉ MĚSTO]',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Odvolání napadající zamítnutí prozatímní úpravy styku u kojence. Zpochybňuje argumentaci soudu prvního stupně o údajné neprokázanosti změny poměrů.',
    legalTakeaway: 'Nové události po vyhlášení rozsudku (obstrukce při předávání, onemocnění dítěte a odmítnutí dohodnuté adaptace) představují kvalifikovanou změnu poměrů, o které je soud povinen věcně rozhodnout.',
    content: `KRAJSKÝ SOUD V [KRAJSKÉ MĚSTO]
(prostřednictvím Okresního soudu v [OKRESNÍ MĚSTO])

Sp. zn.: [SPIS. ZN. 13 Nc XX/2026]
Věc: Odvolání proti usnesení o zamítnutí návrhu na vydání prozatímního rozhodnutí

Navrhovatel (Otec): [OTEC], nar. [DATUM], bytem [OBEC A], pobytem [OBEC B]
Matka: [MATKA], nar. [DATUM], bytem [OBEC C]
Nezletilý: [NEZLETILÝ SYN A], nar. [DATUM]

I.
Proti usnesení Okresního soudu v [OKRESNÍ MĚSTO] ze dne [DATUM], č. j. [SPIS. ZN.], kterým byl zamítnut můj návrh na vydání prozatímního rozhodnutí, podávám v zákonné lhůtě toto odvolání.

II. DŮVODY ODVOLÁNÍ
Napadené rozhodnutí soudu prvního stupně je věcně nesprávné, vnitřně rozporné, nepřezkoumatelné a je v přímém rozporu s nejlepším zájmem nezletilého syna [NEZLETILÝ SYN A].

1. Vnitřní rozpor a rozpor s vědeckými poznatky:
Soud v odůvodnění svého rozhodnutí správně cituje moderní vědecké poznatky o potřebách nezletilého dítěte a nutnosti kontinuity vazeb. Následně však svým výrokem rozhodl v přímém rozporu s těmito citovanými závěry. Odmítnutí mého návrhu na rozšíření péče přímo popírá vědecké standardy, na které se soud sám odvolává.

2. Nesprávné posouzení změny poměrů a ignorování reálného stavu:
Soud v odůvodnění nesprávně uvádí, že jsem neprokázal změnu poměrů. Od vydání původního rozhodnutí přitom došlo k zásadnímu zhoršení situace, kdy dochází k aktivní sabotáži spolupráce ze strany terénní služby, která spolupracuje výhradně s matkou a zatajuje mi sociální dokumentaci.

3. Ohrožení zdraví a psychiky nezletilého:
V průběhu června a července byly doloženy případy rizikového transportu nezletilého v době jeho nemoci (horečky, plané neštovice), čímž matka a asistující pracovnice porušily klidový režim. OSPOD navíc ve svém vyjádření přiznal, že při návrzích vědomě ignoruje sourozenecké vazby.

III. NÁVRH NA ÚPRAVU POMĚRŮ A SYSTÉMOVÉ ŘEŠENÍ
Současný režim „lichého týdne“ je pro nezletilého [NEZLETILÝ SYN A] i pro mne naprosto nevyhovující. Působí jako neustálý koloběh balení a transportu. Tento systém je prokazatelně nevhodný i pro matku, která v domácnosti pečuje o druhého syna [NEZLETILÝ SYN B] se speciálními potřebami (autismus).

Jediným smysluplným řešením pro zajištění klidu všech dětí i rodičů je úprava na režim minimálně dvou nocí v týdnu.

IV. ZÁVĚR
Navrhuji, aby Krajský soud v [KRAJSKÉ MĚSTO] napadené usnesení Okresního soudu v [OKRESNÍ MĚSTO] zrušil a věc vrátil k dalšímu řízení, případně vydal nové prozatímní rozhodnutí.

V [OBEC B], dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-03',
    pageNumber: 3,
    title: 'Usnesení Okresního soudu – Nepřihlížení k novému návrhu podle § 465d odst. 2 z.ř.s.',
    category: 'soudni-usneseni',
    categoryLabel: 'Soudní usnesení & rozsudky',
    issuingBody: 'Okresní soud v [OKRESNÍ MĚSTO]',
    targetBody: 'Účastníci řízení',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Oficiální usnesení okresního soudu, kterým soud odmítá přihlížet k opakovánému návrhu otce na prozatímní rozhodnutí z důvodu neuplynutí 3měsíční blokační lhůty dle § 465d odst. 2 z.ř.s.',
    legalTakeaway: 'K novému návrhu na prozatímní rozhodnutí podanému do 3 měsíců od právní moci zamítnutí soud ze zákona nepřihlíží, ledaže jsou tvrditelné zcela nové podstatné skutečnosti zakládající nový nárok.',
    content: `OKRESNÍ SOUD V [OKRESNÍ MĚSTO]
Sp. zn.: [SPIS. ZN. 13 Nc XX/2026]

USNESENÍ

Okresní soud v [OKRESNÍ MĚSTO] rozhodl samosoudkyní [JUDr. SOUDCE] ve věci

nezletilého: [NEZLETILÝ SYN A], nar. [DATUM], bytem [OBEC C]
zastoupený opatrovníkem [MĚSTSKÝ ÚŘAD]
dítěte rodičů: [MATKA], nar. [DATUM], bytem [OBEC C]
[OTEC], nar. [DATUM], bytem [OBEC A], pobytem [OBEC B]

o návrhu na vydání prozatímního rozhodnutí

takto:
K návrhu otce na vydání prozatímního rozhodnutí ve věci nezletilého [NEZLETILÝ SYN A] ze dne [DATUM], se nepřihlíží.

Odůvodnění:
Otec se návrhem na vydání prozatímního rozhodnutí ze dne [DATUM] domáhal změny péče o nezletilého tak, aby jej měl v péči minimálně dvě noci v každém týdnu. Stejné změny péče se však již domáhal návrhem na vydání prozatímního rozhodnutí, který byl usnesením zdejšího soudu č.j. [SPIS. ZN.] ze dne [DATUM] zamítnut (právní moc dne [DATUM]).

Podle § 465d odst. 2 zákona č. 292/2013 Sb., o zvláštních řízeních soudních (dále jen „z.ř.s.“): byl-li návrh na vydání prozatímního rozhodnutí odmítnut pro zjevnou bezdůvodnost nebo zamítnut, může jej navrhovatel, požaduje-li ve věci týchž účastníků z obdobných důvodů stejnou nebo obdobnou prozatímní úpravu poměrů, opakovat až po uplynutí 3 měsíců ode dne nabytí právní moci odmítavého nebo zamítavého rozhodnutí. K návrhu podaném před uplynutím této doby se nepřihlíží. O tom, že se k návrhu nepřihlíží, vyrozumí soud navrhovatele usnesením, proti němuž není opravný prostředek přípustný.

Protože nový návrh se týkal týchž účastníků a byl podán ze stejného důvodu, aniž by uplynula zákonná doba k jeho podání, soud k tomuto novému návrhu nepřihlíží.

Poučení:
Proti tomuto usnesení není odvolání přípustné (§ 465d odst. 2 z.ř.s.).

V [OKRESNÍ MĚSTO] dne [DATUM]
[JUDr. SOUDCE] v.r.
samosoudkyně`
  },
  {
    id: 'doc-04',
    pageNumber: 4,
    title: 'Usnesení Okresního soudu – Zamítnutí návrhu na nařízení výkonu rozhodnutí (exekuce styku při nemoci)',
    category: 'soudni-usneseni',
    categoryLabel: 'Soudní usnesení & rozsudky',
    issuingBody: 'Okresní soud v [OKRESNÍ MĚSTO]',
    targetBody: 'Účastníci řízení',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Soud zamítá návrh otce na nařízení výkonu rozhodnutí (pokutu matce) za neumožnění návštěvy u matky doma v době nemoci dítěte. Odůvodňuje tím, že mimosoudní dohoda rodičů nepředstavuje vykonatelný titul.',
    legalTakeaway: 'Pouze dohoda schválená soudem nebo přímý výrok rozsudku je vykonatelným titulem pro exekuci styku (výkon rozhodnutí dle § 501 z.ř.s.). Mimosoudní písemné dohody nelze vymáhat soudní exekucí.',
    content: `OKRESNÍ SOUD V [OKRESNÍ MĚSTO]
Sp. zn.: [SPIS. ZN. 13 Nc XX/2026]

USNESENÍ

Okresní soud v [OKRESNÍ MĚSTO] rozhodl samosoudkyní [JUDr. SOUDCE] ve věci

nezletilého: [NEZLETILÝ SYN A], nar. [DATUM], bytem [OBEC C]
zastoupený opatrovníkem [MĚSTSKÝ ÚŘAD]
dítěte rodičů: [MATKA], nar. [DATUM], bytem [OBEC C]
[OTEC], nar. [DATUM], bytem [OBEC A], pobytem [OBEC B]

o výkon rozhodnutí

takto:
I. Návrh otce na nařízení výkonu rozhodnutí ze dne [DATUM] se zamítá.
II. Žádný z účastníků nemá právo na náhradu nákladů řízení.

Odůvodnění:
Otec se návrhem ze dne [DATUM] domáhal, aby matce byla uložena povinnost vyplývající z rozsudku Okresního soudu ze dne [DATUM] a dohody rodičů ze dne [DATUM] a umožnila otci řádný výkon péče o nezletilého s využitím dohodnutého mechanismu osobních návštěv v místě současného bydliště nezletilého, aby nezletilý nemusel v době nemoci cestovat.

Návrh odůvodnil tím, že vedle rozsudku si rodiče péči upravili dohodou ze dne [DATUM]. V tento den byl nezletilý nemocný (plané neštovice) a otci bylo zřejmé, že převoz veřejnou dopravou není vhodný. Podle dohody otec navrhl návštěvu u matky doma, což matka odmítla.

Soud zaslal OSPOD žádost o součinnost. Z vyjádření OSPOD vyplývá, že neevidují skutečnosti nasvědčující úmyslnému maření. Dohoda uzavřená rodiči dne [DATUM], která nebyla schválena soudem, nepředstavuje vykonatelný titul. Návrhem na výkon rozhodnutí se nelze domáhat výkonu povinnosti, která není vykonatelným titulem uložena. Ze strany matky nedošlo k porušení soudem stanovených povinností.

Poučení:
Proti tomuto usnesení lze podat odvolání do 15 dnů ode dne doručení písemně k Krajskému soudu v [KRAJSKÉ MĚSTO].

V [OKRESNÍ MĚSTO] dne [DATUM]
[JUDr. SOUDCE] v.r.
samosoudkyně`
  },
  {
    id: 'doc-05',
    pageNumber: 5,
    title: 'Vyřízení stížnosti Charitou na postup sociální pracovnice',
    category: 'charita-sluzby',
    categoryLabel: 'Stanoviska sociálních služeb',
    issuingBody: 'Charita [MĚSTO X] ([Ing. ŘEDITELKA CHARITY])',
    targetBody: '[OTEC]',
    dateStr: '[DATUM]',
    caseRef: 'Stížnost na postup ze dne [DATUM]',
    summary: 'Oficiální odpověď neziskové sociální organizace zamítající stížnost otce na terénní sociální pracovnici s tím, že pochybení nebylo shledáno.',
    legalTakeaway: 'Neziskové sociální služby často argumentují, že jejich jediným smluvním klientem je matka, což využívají k odmítání stížností druhého rodiče.',
    content: `CHARITA [MĚSTO X]
Pražská 14, [PSČ MĚSTO X]

tel.: +420 XXX XXX XXX
email: info@[ANONYMIZOVÁNO].cz
web: [ANONYMIZOVÁNO].cz

Vážený pan [OTEC]
[OBEC A]

V [MĚSTO X] dne [DATUM]

VĚC: Vyřízení stížnosti na postup pracovnice ze dne [DATUM]

Vážený pane,

obdrželi jsme Vaši stížnost ze dne [DATUM] včetně jejího doplnění a provedli jsme její prošetření.

V rámci šetření jsme vyhodnotili Vaši stížnost, písemné vyjádření pracovnice i vyjádření uživatelky sociální služby (matky). Na základě těchto podkladů nebyly tvrzení uvedená ve Vaší stížnosti potvrzena ani nebylo zjištěno pochybení pracovnice při poskytování sociální služby.

Tímto považujeme Vaši stížnost za vyřízenou.

S pozdravem

__________________________
[Ing. ŘEDITELKA CHARITY]
ředitelka Charita [MĚSTO X]`
  },
  {
    id: 'doc-06',
    pageNumber: 6,
    title: 'Vyřízení opakované žádosti Charitou o zpřístupnění sociální dokumentace',
    category: 'charita-sluzby',
    categoryLabel: 'Stanoviska sociálních služeb',
    issuingBody: 'Charita [MĚSTO X]',
    targetBody: '[OTEC]',
    dateStr: '[DATUM]',
    caseRef: 'Žádost o dokumentaci ze dne [DATUM]',
    summary: 'Odpověď sociální služby odmítající zpřístupnit kompletní složku rodinného poradenství s odkazem na povinnost mlčenlivosti a soukromí matky.',
    legalTakeaway: 'Zákony o sociálních službách tvoří napětí s rodičovskou odpovědností. Otec má právo na informace o dítěti, ale poskytovatel odmítá zpřístupnit záznamy ze sezení s matkou.',
    content: `CHARITA [MĚSTO X]
Pražská 14, [PSČ MĚSTO X]

tel.: +420 XXX XXX XXX
email: info@[ANONYMIZOVÁNO].cz

Vážený pan [OTEC]
[OBEC A]

V [MĚSTO X] dne [DATUM]

VĚC: Vyřízení opakované žádosti o zpřístupnění dokumentace

Vážený pane,

Vaši opakovanou žádost jsme posoudili. Neshledali jsme žádné nové skutečnosti, které by odůvodňovaly změnu našeho dosavadního postupu.

Již jsme Vám poskytli informace vztahující se k nezletilému v rozsahu, který umožňují právní předpisy. Kompletní sociální dokumentace je vedena o uživatelce sociální služby a její zpřístupnění proto není možné.

Na našem stanovisku nadále setrváváme.

S pozdravem

__________________________
[Ing. ŘEDITELKA CHARITY]
ředitelka Charita [MĚSTO X]`
  },
  {
    id: 'doc-07',
    pageNumber: 7,
    title: 'Doplnění návrhu na vydání předběžného opatření – Návrh čtyřtýdenního režimu péče',
    category: 'soudni-podani',
    categoryLabel: 'Soudní podání otce',
    issuingBody: 'Navrhovatel (Otec)',
    targetBody: 'Okresní soud v [OKRESNÍ MĚSTO]',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Písemné doplnění návrhu na předběžné opatření doplňující důkazy o selhání komunikace a navrhující strukturovaný 4týdenní režim péče.',
    legalTakeaway: 'Při nefunkční komunikaci rodičů je nutné navrhovat matematicky přesný, předvídatelný režim péče bez volných flexibilních dohod, které druhý rodič blokuje.',
    content: `Doplnění návrhu na vydání předběžného opatření

Věc: Doplnění návrhu na vydání předběžného opatření – sp. zn. [SPIS. ZN. 13 Nc XX/2026]

Navrhovatel: [OTEC], bytem [OBEC B]

Doplnění návrhu o nové skutečnosti a návrh systémového řešení

Tímto doplňuji svůj návrh na vydání předběžného opatření o nové skutečnosti, které nastaly dne [DATUM] a které dokládají, že stávající model „společné péče“ je v praxi zneužíván k omezování mých práv a vytváření neúnosné zátěže pro nezletilého [NEZLETILÝ SYN A].

1. Absence kooperace a zneužívání rigidního výkladu rozsudku:
I přes deklarovanou „společnou péči“ matka odmítá jakoukoli flexibilitu při předávání. Matka striktně odmítala návrhy na zjednodušení předání, namísto zájmu dítěte upřednostňovala rigidní lpění na časových limitech.

2. Důkaz o nefunkčnosti komunikace:
Přiložená konverzace ze dne [DATUM] dokládá, že matka jednostranně určuje podmínky předávání a odmítá návrhy na zlepšení logistiky. Komunikace se opakovaně mění v osobní útoky.

3. Návrh systémového řešení: Čtyřtýdenní režim:
Jako jediné smysluplné řešení pro zajištění klidu všech dětí i rodičů navrhuji zavedení čtyřtýdenního režimu péče. Tento model:
• Eliminuje matčinu nevůli ke skutečné kooperaci v rámci společné péče.
• Vyřeší stávající kritické logistické problémy.
• Zajistí nezbytný klid pro nezletilého [NEZLETILÝ SYN A].
• Zajistí potřebnou stabilitu i pro další děti v rodinách obou rodičů ([NEZLETILÝ SYN B] a [NEZLETILÝ SYN C]).

4. Závěr pro soud:
Současný stav bez jasně nastaveného režimu je dlouhodobě neudržitelný a vytváří emočně vypjaté prostředí.

Důkazy: Screenshoty konverzace z [DATUM].

V [OBEC B], dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-08',
    pageNumber: 8,
    title: 'Vyřízení stížnosti Krajským úřadem na Poradnu pro rodinu (§ 175 správního řádu)',
    category: 'ospod-meu',
    categoryLabel: 'Stížnosti & Odpovědi OSPOD / MěÚ',
    issuingBody: 'Krajský úřad [KRAJSKÝ ÚRÁD] (Odbor sociálních věcí)',
    targetBody: '[OTEC]',
    dateStr: '[DATUM]',
    caseRef: '[ČÍSLO JEDNACÍ: KUPA-XXXXX/2026]',
    summary: 'Rozsáhlé vyrozumění krajského úřadu o prošetření stížnosti na Poradnu pro rodinu. Rozlišuje poradenské služby od soudní mediace a obhajuje postup poradny.',
    legalTakeaway: 'Při neformálním poradenství (OSP) nejde o vykonatelnou mediaci dle zákona č. 202/2012 Sb. Zajištění nezávislého pozorovatele je ze strany úřadu hodnoceno jako posílení transparentnosti.',
    content: `Krajský úřad [KRAJSKÝ ÚRÁD]
odbor sociálních věcí
oddělení sociálně-právní ochrany dětí

Číslo jednací: [KUPA-XXXXX/2026]
Vyřizuje: [Mgr. REF. KRAJSKÉHO ÚRÁDU]
Datum: [DATUM]

Vážený pan [OTEC]
[OBEC B]

Vážený pane,

Krajský úřad obdržel Vaši „Stížnost na postup a odborné pochybení Poradny pro rodinu“. Vaše stížnost byla prošetřena v souladu s § 175 zákona č. 500/2004 Sb., správní řád.

1. Charakter poskytované sociální služby:
Z vyjádření Poradny vyplývá, že Vám byla poskytnuta služba odborného sociálního poradenství podle zákona č. 108/2006 Sb. o sociálních službách, nikoliv mediace ve smyslu zákona č. 202/2012 Sb. Účast ve službě byla založena na základě Vaší vlastní žádosti a dohody.

2. Odborná kvalifikace pracovnice:
Pracovnice působí na pozici sociální pracovnice a splňuje kvalifikační požadavky dle zákona o sociálních službách včetně výcviku krizové intervence a mediace.

3. Námitka maření výkonu soudního rozhodnutí:
Sociální pracovnice se snažila zasadit situaci do širšího kontextu vývojové psychologie a potřeb kojence. Postup pracovnice lze hodnotit jako snahu o odbornou edukaci rodičů.

4. Námitka nepřípustného zasahování do otázky výživného:
Téma výživného bylo otevřeno matkou jako jedno z prioritních témat. Úloha pracovnice spočívala v moderaci diskuse, nikoliv v rozhodování o výživném.

5. Nestrannost pracovnice a přítomnost nadřízeného:
Skutečnost, že vedení Poradny zajistilo přítomnost [PhDr. OBSERVER] jako nezávislého pozorovatele, hodnotí krajský úřad jako krok k posílení transparentnosti.

Stížnost byla vyhodnocena jako nedůvodná.

S pozdravem

__________________________
[Ing. VEDOUCÍ ODBORU]
vedoucí odboru sociálních věcí`
  },
  {
    id: 'doc-09',
    pageNumber: 9,
    title: 'Návrh otce na prozatímní rozhodnutí – Doplnění o nové skutečnosti po 1. 6. 2026',
    category: 'soudni-podani',
    categoryLabel: 'Soudní podání otce',
    issuingBody: 'Navrhovatel (Otec)',
    targetBody: 'Okresní soud v [OKRESNÍ MĚSTO]',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Detailní argumentační podání otce rozebírající logické rozpory v rozsudku prvního stupně, ignorování sourozeneckých vazeb OSPODem a zdravotní rizika transportu.',
    legalTakeaway: 'Při sepisování návrhu je nutné explicitně bod po bodu strukturovat: Rozpor s vědeckými poznatky, Věcnou nesprávnost, Sabotáž spolupráce a Ohrožení zdraví dítěte.',
    content: `Okresní soud v [OKRESNÍ MĚSTO]
[ADRESA SOUDU]

Věc: Návrh na vydání prozatímního rozhodnutí (Doplněný o nové skutečnosti po 1. 6. 2026)

Účastníci:
[OTEC], nar. [DATUM]
[MATKA], nar. [DATUM]
Nezl. [NEZLETILÝ SYN A], nar. [DATUM]

I. Odůvodnění (Nové skutečnosti a logický rozpor v rozhodnutí soudu)
Od [DATUM] došlo k zásadní změně poměrů a zároveň poukazuji na zásadní věcný a logický rozpor v odůvodnění usnesení ze dne [DATUM]:

• Rozpor s vědeckými poznatky: Soudkyně v odůvodnění svému rozhodnutí cituje moderní vědecké poznatky o potřebách nezletilého dítěte a nutnosti kontinuity vazeb. Následně však svým výrokem rozhodla v přímém rozporu s těmito citovanými závěry.
• Věcná nesprávnost skutkových zjištění: Soud uvádí, že jsem neprokázal změnu poměrů, přestože jsem doložil fakta o aktivitách terénní služby a OSPODu.
• Aktivní sabotáž spolupráce: Dochází k systematickému vylučování otce z procesu péče prostřednictvím terénní služby, která spolupracuje výhradně s matkou.
• Ohrožení zdraví nezletilého: Byla zaznamenána doprava nezletilého v době nemoci (horečky), čímž matka prokazatelně porušila klidový režim.
• Zpřetrhání vazeb: OSPOD ve svém vyjádření přiznal, že při návrzích vědomě ignoruje sourozenecké vazby s [NEZLETILÝ SYN C].
• Absence snahy o dohodu: Matka odmítá jakoukoli konstruktivní komunikaci mimo striktně daný rámec.

II. Návrh na úpravu poměrů
Navrhuji úpravu na režim minimálně dvou nocí v každém týdnu, odstranění diskriminačních překážek spojených s dopravou a zrušení asistence třetích osob.

III. Návrh na provedení důkazů
- Důkaz: Vyjádření OSPOD ze dne [DATUM]
- Důkaz: Záznamy o komunikaci/předávání
- Důkaz: Návrh na vypracování znaleckého posudku k výchovným postojům matky

S pozdravem,
[OTEC]`
  },
  {
    id: 'doc-10',
    pageNumber: 10,
    title: 'Usnesení Okresního soudu – Zamítnutí prozatímního rozhodnutí o čtyřtýdenním cyklu',
    category: 'soudni-usneseni',
    categoryLabel: 'Soudní usnesení & rozsudky',
    issuingBody: 'Okresní soud v [OKRESNÍ MĚSTO]',
    targetBody: 'Účastníci řízení',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Rozhodnutí okresního soudu zamítající návrh otce na úpravu péče ve 4týdenním cyklu s přespáváním. Soud konstatuje, že nebyly prokázány nové podstatné skutečnosti.',
    legalTakeaway: 'Soudy posuzují prozatímní rozhodnutí dle § 465f z.ř.s. přísně. Pouhá nespokojenost jednoho rodiče s nastaveným rozsudkem nestačí – je nutné neprůstřelně prokázat změnu poměrů.',
    content: `OKRESNÍ SOUD V [OKRESNÍ MĚSTO]
Sp. zn.: [SPIS. ZN. 13 Nc XX/2026]

USNESENÍ

Okresní soud v [OKRESNÍ MĚSTO] rozhodl samosoudkyní [JUDr. SOUDCE] ve věci

nezletilého: [NEZLETILÝ SYN A], nar. [DATUM], bytem [OBEC C]
dítěte rodičů: [MATKA], nar. [DATUM] a [OTEC], nar. [DATUM]

o návrhu na vydání prozatímního rozhodnutí

takto:
I. Návrh otce na vydání prozatímního rozhodnutí doručený Okresnímu soudu dne [DATUM], se zamítá.

Odůvodnění:
Otec podal návrh na vydání prozatímního rozhodnutí. Domáhal se určení péče o nezletilého v pravidelném čtyřtýdenním cyklu (středa až pátek a ucelené víkendy). Návrh odůvodnil tím, že na OSPOD došlo k dohodě o předávání v bydlišti a že režim rozvíjí sourozeneckou vazbu.

Matka i opatrovník s návrhem nesouhlasili. Opatrovník uvedl, že rozsudek stanovuje jasný rámec péče a doporučil odbornou pomoc.

Soud po přezkoumání dospěl k závěru, že institut prozatímního rozhodnutí by neměl být využíván v situaci, kdy účastník není spokojen s faktickou situací nastavenou rozsudkem. Otec neprokázal žádné nové skutečnosti, které nastaly po vyhlášení rozhodnutí ve věci samé. Návrh byl proto zamítnut.

Poučení:
Proti tomuto usnesení nelze podat odvolání (§ 465g odst. 4 z.ř.s.).

V [OKRESNÍ MĚSTO] dne [DATUM]
[JUDr. SOUDCE] v.r.
samosoudkyně`
  },
  {
    id: 'doc-11',
    pageNumber: 11,
    title: 'Souhrnné vyjádření OSPOD Městského úřadu k podáním otce',
    category: 'ospod-meu',
    categoryLabel: 'Stížnosti & Odpovědi OSPOD / MěÚ',
    issuingBody: 'Městský úřad [MĚSTO X] (OSPOD)',
    targetBody: '[OTEC]',
    dateStr: '[DATUM]',
    caseRef: '[Ko XX/2026]',
    summary: 'Oficiální sdělení OSPODu, že kolizní opatrovník není oprávněn řešit běžná nedorozumění rodičů a neformální dohody rodičů nejsou zakládány do soudního spisu.',
    legalTakeaway: 'OSPOD odmítá vystupovat jako arbitr v průběžných sporech rodičů. Všechna zásadní pochybení druhé strany je nutné protokolovat a předkládat soudu v rámci výkonu rozhodnutí.',
    content: `MĚSTSKÝ ÚRÁD [MĚSTO X]
ODBOR SOCIÁLNÍ – Oddělení sociálně-právní ochrany dětí

VÁŠ DOPIS ZN:
NAŠE ZNAČKA: [Ko XX/2026]
VYŘIZUJE: [Bc. SOCIÁLNÍ PRACOVNICE]
DATUM: [DATUM]

nezl. [NEZLETILÝ SYN A], nar. [DATUM] - souhrnné vyjádření

Vážený pane [OTEC],

reaguji na Vaše opakovaná podání týkající se aktuální situace mezi Vámi a matkou nezletilého [NEZLETILÝ SYN A].

Dne [DATUM] byl ve věci vyhlášen rozsudek, kterým byly upraveny poměry nezletilého s předběžnou vykonatelností. Z Vámi doložené komunikace je zřejmé, že jste byli s matkou po určitou dobu schopni se na péči domlouvat i odlišně od soudního rozhodnutí. Taková dohoda je možná, musí však být oboustranná. V případě, že jeden z rodičů tuto dohodu přestane akceptovat, je třeba se vrátit k úpravě stanovené soudním rozhodnutím.

Není v našich možnostech a kompetencích řešit jednotlivá dílčí nedorozumění mezi rodiči ani zasahovat do konkrétní realizace předávání dítěte. Oba rodiče máte plnou rodičovskou odpovědnost. Není úkolem kolizního opatrovníka rodiče kárně hodnotit.

Současně uvádím, že vzájemná běžná komunikace rodičů není zakládána do spisu kolizního opatrovníka. Tento spis slouží k evidenci podstatných skutečností a stanovisek významných pro řízení.

S pozdravem
[Bc. SOCIÁLNÍ PRACOVNICE]          [VEDOUCÍ ODBORU]
sociální pracovník                 vedoucí odboru`
  },
  {
    id: 'doc-12',
    pageNumber: 12,
    title: 'Návrh Krajskému soudu na určení lhůty k provedení procesního úkonu (§ 174a z.o.s.s.)',
    category: 'soudni-podani',
    categoryLabel: 'Soudní podání otce',
    issuingBody: 'Navrhovatel (Otec)',
    targetBody: 'Krajský soud v [KRAJSKÉ MĚSTO]',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 P a Nc XX/2026]',
    summary: 'Stížnostní návrh vyššímu krajskému soudu na určení lhůty z důvodu nečinnosti okresního soudu při nerozhodnutí o předběžném/prozatímním opatření ve 7denní lhůtě.',
    legalTakeaway: 'Ustanovení § 174a zákona č. 6/2002 Sb. je účinným procesním nástrojem proti průtahům soudu prvního stupně, pokud soud překročí zákonnou 7denní lhůtu pro rozhodnutí.',
    content: `Krajskému soudu v [KRAJSKÉ MĚSTO]
prostřednictvím Okresního soudu v [OKRESNÍ MĚSTO]

Ke sp. zn.: [SPIS. ZN. 13 P a Nc XX/2026]

Navrhovatel: [OTEC], nar. [DATUM], bytem [OBEC A], pobytem [OBEC B]
Matka: [MATKA], nar. [DATUM], bytem [OBEC C]
Nezletilý: [NEZLETILÝ SYN A], nar. [DATUM]

NÁVRH NA URČENÍ LHŮTY K PROVEDENÍ PROCESNÍHO ÚKONU
podle § 174a zákona č. 6/2002 Sb., o soudech a soudcích

I.
Dne [DATUM] podal otec u Okresního soudu v [OKRESNÍ MĚSTO] Návrh na prozatímní úpravu styku s nezletilým [NEZLETILÝ SYN A]. Důvodem podání byly zcela nové skutečnosti (dohoda rodičů a propuknutí dětského onemocnění), které prokázaly neudržitelnost stávajícího stavu.

II.
Podle ustanovení občanského soudního řádu / z.ř.s. je soud povinen o návrhu na předběžné / prozatímní opatření rozhodnout bezodkladně, nejpozději do 7 dnů od jeho podání. Ke dnešnímu dni uplynulo již 20 kalendářních dnů a Okresní soud o návrhu doposud nerozhodl. Postojem soudu dochází k průtahům v řízení a k poškozování zdravého vývoje sedmiměsíčního kojence.

III.
Otec vyčerpal ostatní prostředky ochrany, když podal stížnost předsedkyni Okresního soudu, ta však stížnost odložila s poukazem na nezávislost rozhodování.

IV.
S ohledem na výše uvedené otec navrhuje, aby Krajský soud v [KRAJSKÉ MĚSTO] vydal toto

U S N E S E N Í :
Okresnímu soudu v [OKRESNÍ MĚSTO] se určuje lhůta 3 pracovních dnů od doručení tohoto usnesení k rozhodnutí o návrhu otce ze dne [DATUM].

V [OBEC B], dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-13',
    pageNumber: 13,
    title: 'Podnět Stálé komisi pro rodinu a rovné příležitosti PS PČR',
    category: 'mpsv-ombudsman',
    categoryLabel: 'Inspekce MPSV & Ombudsman',
    issuingBody: '[OTEC]',
    targetBody: 'Stálá komise pro rodinu PS PČR',
    dateStr: '[DATUM]',
    caseRef: 'Podnět k systému OSPOD/MPSV',
    summary: 'Systémový podnět poslancům Parlamentu ČR poukazující na genderovou předpojatost OSPODu, ignorování sourozeneckých vazeb u kojenců a selhání dozoru MPSV.',
    legalTakeaway: 'Podněty parlamentním komisím a poslancům slouží k dokumentaci systémového selhání státu v ochraně práv otců a dětí pro systémové legislativní změny.',
    content: `[OTEC]
[OBEC A]

Stálá komise pro rodinu a rovné příležitosti
Poslanecká sněmovna Parlamentu ČR
Sněmovní 4, 118 26 Praha 1 - Malá Strana

Věc: Podnět k prošetření systémového selhávání orgánů sociálně-právní ochrany dětí (OSPOD) a MPSV při hájení zájmů nezletilých dětí a principu rovného rodičovství

Vážená paní předsedkyně, vážené poslankyně, vážení poslanci,

obracím se na Stálou komisi pro rodinu s podnětem, který ukazuje na závažný a dlouhodobý systémový problém v postupu OSPOD a na selhání Ministerstva práce a sociálních věcí (MPSV) při jejich metodickém vedení.

Jako otec narážím při jednání s lokálním úřadem na nedostatek objektivity, ignorování zájmů dítěte a diskriminaci otců. Podal jsem stížnost na OSPOD [MĚSTO X], kde jsem upozorňoval, že pracovnice postupují jednostranně a ignorují sourozenecké vazby mezi mým starším synem [NEZLETILÝ SYN C] v mé péči a mladším synem [NEZLETILÝ SYN A].

Klíčové body selhání:
1. Selhání metodického vedení MPSV: Úřednice na lokální úrovni uplatňují zastaralé stereotypy a ignorují judikaturu Ústavního soudu o budování sourozeneckých vazeb od nejútlejšího věku.
2. Absence funkčního kontrolního mechanismu: Nadřízený úředník pouze formálně kryje své podřízené bez přezkumu objektivity.
3. Tolerance formalismu: Návrhy na předávání dítěte „na autobusové zastávce“ v rozsahu 3 hodin odpoledne znemožňují odvézt dítě do rodinného bydliště otce.

Děkuji za pozornost, kterou tomuto podnětu budete věnovat.

S pozdravem,
[OTEC]`
  },
  {
    id: 'doc-14',
    pageNumber: 14,
    title: 'Vyjádření MPSV k podnětu k výkonu inspekce sociálních služeb',
    category: 'mpsv-ombudsman',
    categoryLabel: 'Inspekce MPSV & Ombudsman',
    issuingBody: 'Ministerstvo práce a sociálních věcí (MPSV)',
    targetBody: '[OTEC]',
    dateStr: '[DATUM]',
    caseRef: '[SZ/MPSV-2026/XXXXXX]',
    summary: 'Stanovisko ředitelky odboru inspekcí MPSV odmítající provést inspekci v neziskové Charitě. Argumentuje tím, že otec není přímým klientem sociální služby.',
    legalTakeaway: 'MPSV rozlišuje mezi klientem sociální služby (matka) a rodinným příslušníkem. Kontrolní činnost inspekce je prováděna z moci úřední a na její zahájení není subjektivní právní nárok.',
    content: `MINISTERSTVO PRÁCE A SOCIÁLNÍCH VĚCÍ
Na Poříčním právu 376/1, 128 00 Praha 2

V Praze dne [DATUM]
Číslo jednací: [MPSV-2026/XXXXXX]
Spisová značka: [SZ/MPSV-2026/XXXXXX]

Mgr. Bc. Emilie Kalová
ředitelka odboru inspekcí, výkonu akreditací, financování v oblasti sociálních služeb, sociálněprávní ochrany dětí a sociální práce

Vážený pan [OTEC]
[OBEC A]

Vážený pane,

Ministerstvo práce a sociálních věcí obdrželo Vaše podání týkající se činnosti poskytovatele sociálních služeb Charita [MĚSTO X].

Studiem obsahu Vašeho podání a jeho příloh bylo zjištěno, že v tuto chvíli není k provedení kontrolní činnosti (inspekce) ze strany ministerstva relevantní důvod. Klientkou sociální služby je matka Vašeho dítěte, nikoliv Vy. Poskytovatel je v této situaci oprávněn a zároveň povinen Vám poskytnout jen ty části spisové dokumentace, které se týkají Vašeho dítěte.

Z Vašeho podání nejsou zřejmé skutečnosti, které by odůvodňovaly podezření, že se poskytovatel dopustil porušení zákona č. 108/2006 Sb. Podklady či informace můžete doplnit.

Máte-li výhrady, můžete se na poskytovatele obrátit se stížností podle § 99a zákona o sociálních službách.

S pozdravem
Mgr. Bc. Emilie Kalová`
  },
  {
    id: 'doc-15',
    pageNumber: 15,
    title: 'Podrobné doplnění námitek u Okresního soudu – Matematická analýza péče a znalecký posudek',
    category: 'soudni-podani',
    categoryLabel: 'Soudní podání otce',
    issuingBody: 'Navrhovatel (Otec)',
    targetBody: 'Okresní soud v [OKRESNÍ MĚSTO]',
    dateStr: '[DATUM]',
    caseRef: '[SPIS. ZN. 13 Nc XX/2026]',
    summary: 'Písemný rozbor dokazující matematickou nepřesnost rozsudku v deklarovaných dnech péče oproti hodinové skutečnosti (28,8 hodin týdně) a žádost o psychologický posudek matky.',
    legalTakeaway: 'Při sporech o péči je nutné soudu doložit přesnou hodinovou bilanci (časovou dotaci), nikoliv jen počítat kalendářní dny, ve kterých se dítě byť na 2 hodiny potká s otcem.',
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

Závěr a návrh:
Žádám nápravu diskriminačních prvků rozsudku a vypracování znaleckého posudku.

S pozdravem,
[OTEC]`
  },
  {
    id: 'doc-16',
    pageNumber: 16,
    title: 'Odpověď předsedkyně Okresního soudu na stížnost na postup samosoudkyně',
    category: 'soudni-usneseni',
    categoryLabel: 'Soudní usnesení & rozsudky',
    issuingBody: 'Okresní soud v [OKRESNÍ MĚSTO] ([JUDr. PŘEDSEDKYNĚ SOUDU])',
    targetBody: '[OTEC]',
    dateStr: '[DATUM]',
    caseRef: '[43 St X/2026]',
    summary: 'Předsedkyně okresního soudu odkládá stížnost otce na soudkyni. Vymezuje, že předseda soudu nesmí zasahovat do nezávislé rozhodovací pravomoci soudce.',
    legalTakeaway: 'Stížnost dle § 164 zákona o soudech a soudcích slouží pouze pro nevhodné chování nebo průtahy. Námitky proti právnímu posouzení a dokazování soudce lze uplatnit výhradně odvoláním.',
    content: `OKRESNÍ SOUD V [OKRESNÍ MĚSTO]
[ADRESA SOUDU]

NAŠE ZNAČKA: [43 St X/2026]
VYŘIZUJE: [JUDr. PŘEDSEDKYNĚ SOUDU]
DATUM: [DATUM]

Vážený pan [OTEC]
[OBEC A]

Věc: Stížnost na rozhodování a postup soudce

Vážený pane,

obdržela jsem Vaše podání označené jako stížnost na postup soudkyně v řízení vedeném pod sp. zn. [SPIS. ZN. 13 Nc XX/2026].

Dle § 164 odstavever 1 zákona č. 6/2002 Sb., o soudech a soudcích, jsou fyzické osoby oprávněny obracet se na orgány státní správy soudů se stížnostmi jen, jde-li o průtahy v řízení nebo o nevhodné chování soudních osob.

Dle § 164 odst. 2 zákona č. 6/2002 Sb. se stížností nelze domáhat přezkoumání postupu soudu při výkonu jeho nezávislé rozhodovací pravomoci. Předseda soudu není oprávněn komentovat nebo přezkoumávat správnost provádění důkazního řízení či rozhodnutí soudce. Takový postup by odporoval ústavnímu principu nezávislosti soudnictví (čl. 81 Ústavy).

Nesouhlasíte-li s postupem soudkyně a hodnocením důkazů, formou obrany je využití řádných opravných prostředků (podání odvolání), což jste učinil.

Vaši stížnost tedy odkládám jako nedůvodnou.

S pozdravem

__________________________
[JUDr. PŘEDSEDKYNĚ SOUDU] v.r.
předsedkyně okresního soudu`
  },
  {
    id: 'doc-17',
    pageNumber: 17,
    title: 'Podnět Kanceláři Veřejného ochránce práv – Doplnění po vyjádření Městského úřadu',
    category: 'mpsv-ombudsman',
    categoryLabel: 'Inspekce MPSV & Ombudsman',
    issuingBody: '[OTEC]',
    targetBody: 'Kancelář Veřejného ochránce práv (Brno)',
    dateStr: '[DATUM]',
    caseRef: '[Ko XX/2026]',
    summary: 'Doplnění podnětu Ombudsmanovi napadající alibismus Městského úřadu při obhajobě návrhu OSPOD předávat dítě na autobusové zastávce a ignorovat sourozeneckou vazbu.',
    legalTakeaway: 'Veřejný ochránce práv (Ombudsman) zkoumá nezákonnost a neobjektivitu v postupu OSPOD. Klíčem je doložit konkrétní písemná přiznání úřadu o ignorování sourozeneckých vazeb.',
    content: `ADRESÁT: Kancelář veřejného ochránce práv, Údolní 39, 602 00 Brno
STĚŽOVATEL: [OTEC], nar. [DATUM], bytem [OBEC B]

Podnět k prošetření postupu orgánu sociálně-právní ochrany dětí
DOPLNĚNÍ PO VYJÁDŘENÍ ÚŘADU

VĚC: Podnět k šetření postupu OSPOD [MĚSTO X] – reakce na sdělení Městského úřadu ze dne [DATUM]
Spisová značka OSPOD: [Ko XX/2026]
Soudní řízení: sp. zn. [SPIS. ZN. 13 Nc XX/2026]

V návaznosti na můj předchozí podnět doplňuji zásadní skutečnosti. Dne [DATUM] mi bylo doručeno vyjádření tajemnice úřadu [Ing. TAJEMNICE], která stížnost označila za nedůvodnou.

I. K argumentaci úřadu ohledně „autobusové zastávky“:
Tajemnice úřadu obhajuje návrh OSPOD tvrzením, že autobusová zastávka byla uvedena pouze jako příklad neutrálního místa předání. Pokud však OSPOD navrhl styk se synem [NEZLETILÝ SYN A] v rozsahu pouhých 3 hodin v odpoledním čase (14:00–17:00), pak mě tento model nutí trávit čas s kojencem na ulici, v provizorních podmínkách, bez možnosti odvézt ho do rodinného bydliště k bratru [NEZLETILÝ SYN C].

II. Oficiální přiznání úřadu k ignorování sourozenecké vazby:
Tajemnice uvádí: „Pokud jde o námitku zohlednění sourozeneckých vazeb, OSPOD se zaměřil především na aktuální potřeby šestiměsíčního dítěte...“ Úřad tím oficiálně přiznal, že rezignoval na multikriteriální posuzování zájmů dítěte a vědomě upřednostnil izolovaný zájem matky na úkor sourozeneckých vazeb.

Podle vývojové psychologie (např. studie prof. Richarda A. Warshaka) se sourozenecká vazba buduje společným prožíváním každodenních rutin. Věk dítěte (6 měsíců) nemůže být důvodem pro odříznutí sourozence.

Žádám Veřejného ochránce práv o neodkladné zahájení šetření.

V [OBEC B], dne [DATUM]
__________________________
[OTEC]`
  },
  {
    id: 'doc-18',
    pageNumber: 18,
    title: 'Odpověď tajemnice Městského úřadu na stížnost podle § 175 správního řádu',
    category: 'ospod-meu',
    categoryLabel: 'Stížnosti & Odpovědi OSPOD / MěÚ',
    issuingBody: 'Městský úřad [MĚSTO X] ([Ing. TAJEMNICE])',
    targetBody: '[OTEC]',
    dateStr: '[DATUM]',
    caseRef: 'Vyřízení stížnosti dle § 175 správního řádu',
    summary: 'Oficiální rozhodnutí vedení Městského úřadu zamítající stížnost na OSPOD. Tvrdí, že doporučení OSPODu jsou odborným hodnocením pro soud.',
    legalTakeaway: 'Vedení Městských úřadů téměř bez výjimky stížnosti podle § 175 správního řádu odmítá. Je proto nutné současně podávat žádost o přešetření Krajskému úřadu a podnět Ombudsmanovi.',
    content: `Město [MĚSTO X]
[Ing. TAJEMNICE], tajemnice

Československé armády 1665, [PSČ MĚSTO X]

Vážený pan [OTEC]
[OBEC A]

V [MĚSTO X] dne [DATUM]

Věc: Odpověď na stížnost na postup OSPOD [MĚSTO X] – Vyřízení stížnosti podle § 175 správního řádu

Vážený pane,

dne [DATUM] obdržel Městský úřad Vaši stížnost na postup Orgánu sociálně-právní ochrany dětí Městského úřadu [MĚSTO X]. Namítáte zejména neobjektivní postup OSPOD a nedostatečné zohlednění sourozeneckých vazeb.

Po přezkoumání stížnosti, spisového materiálu a vyjádření zaměstnankyň odboru sociálního bylo zjištěno:

OSPOD vystupuje jako kolizní opatrovník nezletilého dítěte, jehož povinností je hájit zájmy dítěte. Při formulaci návrhu vycházel z posouzení potřeb šestiměsíčního dítěte a potřeby stability prostředí. Ze spisu nevyplývá, že by pracovnice postupovaly jednostranně.

Námitka předávání na autobusové zastávce nebyla shledána důvodnou; zastávka byla uvedena pouze jako příklad neutrálního místa předání.

Hodnocení sourozeneckých vazeb náleží do působnosti kolizního opatrovníka a následně soudu. Skutečnost, že zastáváte odlišný rodičovský názor na rozsah péče, nezakládá pochybení OSPOD.

Stížnost podle § 175 správního řádu byla vyhodnocena jako nedůvodná.

S pozdravem

__________________________
[Ing. TAJEMNICE]
tajemnice Městského úřadu [MĚSTO X]`
  },
  {
    id: 'doc-19',
    pageNumber: 19,
    title: 'Vyřízení stížnosti Charitou (13. 4. 2026) – WhatsApp komunikace a mlčenlivost',
    category: 'charita-sluzby',
    categoryLabel: 'Stanoviska sociálních služeb',
    issuingBody: 'Charita [MĚSTO X]',
    targetBody: '[OTEC]',
    dateStr: '[DATUM]',
    caseRef: 'Vyřízení stížnosti ze dne [DATUM]',
    summary: 'Písemná odpověl Charity vysvětlující pravidla neformální komunikace přes WhatsApp a důvody odmítnutí změny klíčové pracovnice.',
    legalTakeaway: 'Sociální pracovnice mají právo omezit soukromé zprávy na WhatsApp a vyžadovat oficiální e-mail/telefonát. Požadavek na změnu klíčového pracovníka vyžaduje souhlas uživatelky (matky).',
    content: `CHARITA [MĚSTO X]
Pražská 14, [PSČ MĚSTO X]

tel.: +420 XXX XXX XXX
email: info@[ANONYMIZOVÁNO].cz

Vážený pan [OTEC]
[OBEC A]

V [MĚSTO X] dne [DATUM]

VĚC: Vyřízení stížnosti na postup pracovnice

Vážený pane,

obdrželi jsme Vaši stížnost týkající se postupu vedoucí sociální služby a Vaše požadavky na změnu klíčové pracovnice a zpřístupnění dokumentace.

Po posouzení uvádíme:

1. Postavení stěžovatele a rozsah informací:
Sociální služba je poskytována matce dítěte jako její uživatelce. Vy ani dítě nejste uživateli této služby. Vaše právo na informace o dítěti jako zákonného zástupce bylo naplněno poskytnutím výpisu ze sociální dokumentace dle § 100 zákona o sociálních službách a GDPR.

2. Komunikace s pracovníkem služby:
Omezení komunikace prostřednictvím neformálních nástrojů (aplikace WhatsApp) je v souladu s profesionálními standardy sociální práce a nelze jej považovat za porušení povinností.

3. Požadavek na změnu klíčové pracovnice:
Požadavek nepovažujeme za důvodný. O personálním zajištění rozhoduje poskytovatel ve spolupráci s uživatelkou. Uživatelka vyjádřila spokojenost a změnu si nepřeje.

4. Vedení a ochrana dokumentace:
Odmítáme tvrzení o manipulaci. Sociální dokumentace je vedena řádně v souladu s právními předpisy.

S pozdravem

__________________________
[Ing. ŘEDITELKA CHARITY]
ředitelka Charita [MĚSTO X]`
  },
  {
    id: 'doc-20',
    pageNumber: 20,
    title: 'Doplnění podnětu MPSV – Důkazy o incidentu při odvozu nemocného dítěte a zatajování spisu',
    category: 'mpsv-ombudsman',
    categoryLabel: 'Inspekce MPSV & Ombudsman',
    issuingBody: '[OTEC]',
    targetBody: 'Ministerstvo práce a sociálních věcí (MPSV)',
    dateStr: '[DATUM]',
    caseRef: '[SZ/MPSV-2026/XXXXXX]',
    summary: 'Reakce otce na zamítnutí inspekce od MPSV doplňující nezvratné důkazy: oficiální doručenku z datové schránky dokazující, že rozsudek nebyl v době zásahu vykonatelný.',
    legalTakeaway: 'Rozsudek nabývá účinků vůči účastníkovi až okamžikem doručení do jeho Datové schránky. Terénní odebrání dítěte před doručením je svémocným jednáním bez právního titulu.',
    content: `MINISTERSTVO PRÁCE A SOCIÁLNÍCH VĚCÍ
Odbor inspekcí, výkonu akreditací a SPOD
Mgr. Bc. Emilie Kalová, ředitelka odboru
Na Poříčním právu 376/1, 128 00 Praha 2

ID datové schránky: [ANONYMIZOVÁNO]
Spisová značka: [SZ/MPSV-2026/XXXXXX]
Datum: [DATUM]

ODESÍLATEL: [OTEC], nar. [DATUM], bytem [OBEC B]
(jako otec a zákonný zástupce nezletilého [NEZLETILÝ SYN A])

Věc: Doplnění podnětu k výkonu inspekce u poskytovatele sociálních služeb Charita [MĚSTO X] – doložení nových zásadních skutečností a vědomé spoluúčasti na protiprávním jednání

Vážená paní ředitelko,

reaguji na Vaše vyjádření ze dne [DATUM] a v souladu s Vaší výzvou zasílám klíčové důkazy:

I. DŮKAZ O ZÁMĚRNÉM ZATAJOVÁNÍ DOKUMENTACE
Rozsudek Okresního soudu ze dne [DATUM] výslovně uvádí, že podle zprávy samotné Charity bylo cílem mimosoudní dohoda s otcem a ujasnění péče o syna [NEZLETILÝ SYN A]. Charita tedy oficiálně deklarovala, že náplní práce bylo koncepční řešení péče o mého syna. Záznamy se tedy přímo týkají mého dítěte a jako zákonný zástupce mám právo do nich nahlížet.

II. DŮKAZ O VĚDOMÉ SPOLUÚČASTI NA PROTIPRÁVNÍM JEDNÁNÍ (Incident ze dne [DATUM])
Terénní pracovnice Charity doprovodila dopoledne matku do mého obydlí k odvozu nezletilého [NEZLETILÝ SYN A]. Nový rozsudek mi však byl doručen do mé datové schránky až odpoledne ve 13:21 hod. (viz přiložený oficiální výpis doručenky). V době dopoledního incidentu tak tento rozsudek z pohledu zákona vůči mně vůbec neexistoval a platil předchozí schválený soudní protokol, dle kterého mělo mít dítě v době nemoci (teplota nad 37 °C, plané neštovice) klidový režim v mé péči.

Sociální pracovnice tak vědomě asistovala u protiprávního odvozu nemocného kojence bez vykonatelného právního titulu.

ZÁVĚR
Žádám MPSV o přehodnocení stanoviska a o urychlené zahájení inspekce poskytování sociálních služeb.

S pozdravem,

__________________________
[OTEC]
(vlastnoruční podpis)

PŘÍLOHY:
1. Rozsudek Okresního soudu v [OKRESNÍ MĚSTO]
2. Výpis z portálu občana dokládající čas doručení do DS ([DATUM] ve 13:21)
3. Kopie oficiálního soudního protokolu s pravidlem o nemoci nad 37 °C
4. Fotodokumentace akutního zdravotního stavu nezletilého`
  }
];
