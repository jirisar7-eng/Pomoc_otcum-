/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Download, Search, FileText, Copy, Check, Filter, Info, ShieldAlert, Printer, Edit, RefreshCw, FileDown } from 'lucide-react';

interface DocumentTemplate {
  id: string;
  title: string;
  category: 'court' | 'execution' | 'ospod' | 'complaint' | 'agreement';
  desc: string;
  meta: string;
  content: string;
  coResi: string;
  kdySePouzije: string;
  pravniZaklad: string;
}

const TEMPLATES: DocumentTemplate[] = [
  {
    id: 'doc-1',
    title: 'Návrh na svěření nezletilého do střídavé / společné péče',
    category: 'court',
    desc: 'Základní žalobní návrh podávaný k okresnímu soudu na zahájení opatrovnického řízení se žádostí o rovnocenné týdenní střídání.',
    meta: 'Formát TXT/Word • ZDARMA',
    coResi: 'Zahájení soudního řízení za účelem svěření nezletilého dítěte do střídavé péče obou rodičů s rovnocenným rozdělením času a spravedlivou úpravou výživného.',
    kdySePouzije: 'Před rozvodem manželství, po rozchodu rodičů nebo při potřebě změnit stávající uspořádání, pokud matka střídavou péči mimosoudně odmítá.',
    pravniZaklad: 'Ustanovení § 906 a § 907 zákona č. 89/2012 Sb., občanský zákoník, ve spojení s nálezy Ústavního soudu ČR o prioritě střídavé péče.',
    content: `Okresní soud v [Město]
[Adresa soudu]

Matka: [Jméno a Příjmení matky], narozená [Datum], bytem [Adresa matky]
Otec: [Jméno a Příjmení otce], narozený [Datum], bytem [Adresa otce]

Nezletilý/á: [Jméno a Příjmení dítěte], narozený/á [Datum], bytem [Adresa bydliště dítěte]

NÁVRH OTCE NA ÚPRAVU POMĚRŮ NEZLETILÉHO PRO DOBU PŘED A PO ROZVODU MANŽELSTVÍ
(svěření nezletilého do střídavé péče obou rodičů a stanovení výživného)

I.
Matka a otec uzavřeli manželství dne [Datum]. Z tohoto manželství se narodil nezletilý/á [Jméno dítěte]. Rodiče spolu od [Měsíc/Rok] nežijí ve společné domácnosti a jejich partnerský vztah je trvale rozvrácen. Nezletilé dítě se v současnosti nachází ve faktické péči [matky / otce].

II.
Otec se aktivně podílí na výchově a péči o nezletilého již od jeho narození. Má k dítěti silnou citovou vazbu, což potvrzuje i chování nezletilého. Otec má zajištěné stabilní nadstandardní bytové podmínky (vlastní byt se samostatným dětským pokojem) v blízkosti [školy / školky] nezletilého a jeho měsíční příjem činí přibližně [Částka] Kč čistého. Otec je plně schopen zajistit veškeré potřeby nezletilého.

III.
Vzhledem k tomu, že oba rodiče mají výborné výchovné předpoklady a nezletilý má silný citový vztah k oběma z nich, je v nejlepším zájmu dítěte střídavá péče. Ústavní soud ČR dlouhodobě judikuje, že střídavá péče je prioritní formou uspořádání poměrů po rozchodu rodičů, pokud jsou oba rodiče způsobilí o dítě pečovat a mají o péči zájem.

S ohledem na výše uvedené navrhuji, aby soud po provedeném dokazování vynesl tento

R O Z S U D E K:

1. Nezletilý/á [Jméno dítěte], narozený/á [Datum], se pro dobu před i po rozvodu manželství rodičů svěřuje do střídavé péče matky a otce v intervalu jednoho týdne, kdy střídání bude probíhat vždy v pátek v 16:00 hodin předáním v místě [školy/školky/bydliště].
2. Rodiči, u kterého se dítě v daném týdnu nenachází, se neukládá povinnost přispívat na výživu / OR se ukládá otci povinnost přispívat na výživu nezletilého částkou [Částka] Kč měsíčně a matce částkou [Částka] Kč měsíčně.
3. Žádný z účastníků nemá právo na náhradu nákladů řízení.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]`
  },
  {
    id: 'doc-2',
    title: 'Návrh na předběžné opatření (úprava poměrů)',
    category: 'court',
    desc: 'Použijte okamžitě v akutních situacích, např. když vám protistrana ze dne na den odmítá předávat dítě a zcela ho izoluje. Soud o něm musí rozhodnout do 7 dnů.',
    meta: 'Formát TXT/Word • Naléhavé • ZDARMA',
    coResi: 'Rychlá a neodkladná prozatímní úprava kontaktu otce s dítětem v situaci, kdy matka svévolně přerušila kontakt, odmítá dítě předávat a izoluje ho.',
    kdySePouzije: 'Při akutním ohrožení vztahu otce a dítěte, zejména bezprostředně po rozchodu nebo při jednostranném odepření styku ze strany matky.',
    pravniZaklad: 'Ustanovení § 74 a násl. zákona č. 99/1963 Sb., občanský soudní řád (OSŘ) ve spojení s ustanoveními zákona č. 292/2013 Sb., o zvláštních řízeních soudních.',
    content: `Okresní soud v [Město]
[Adresa soudu]

Žalobce (Otec): [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Žalovaná (Matka): [Jméno matky], narozená [Datum], bytem [Adresa matky]

Nezletilý: [Jméno dítěte], narozený [Datum]

NÁVRH NA NAŘÍZENÍ PŘEDBĚŽNÉHO OPATŘENÍ (§ 74 a násl. OSŘ)
(prozatímní úprava styku otce s nezletilým dítětem)

I.
Matka a otec jsou rodiči nezletilého [Jméno dítěte]. Dne [Datum rozchodu] došlo k faktickému rozpadu naší domácnosti. Od [Datum] matka zcela svévolně brání jakémukoliv osobnímu i telefonickému kontaktu otce s nezletilým synem. Otec se opakovaně pokoušel o smírné řešení, avšak matka na výzvy nereaguje a odpírá otci právo na péči.

II.
Dítě bylo doposud zvyklé na každodenní přítomnost otce. Náhlé a úplné přerušení kontaktu s otcem představuje pro nezletilé dítě závažné trauma a hrozí újma na jeho psychickém vývoji. Je proto dán naléhavý zájem na okamžité prozatímní úpravě poměrů.

III.
Z výše uvedených důvodů otec navrhuje, aby soud bezodkladně, nejpozději do 7 dnů, vydal toto

U S N E S E N Í:

1. Matka je povinna umožnit otci styk s nezletilým [Jméno dítěte] prozatímně tak, že otec je oprávněn mít nezletilého ve své péči každý sudý týden od pátku 15:00 hodin do neděle 18:00 hodin, kdy matka je povinna nezletilého otci v pátek v 15:00 v místě bydliště matky předat a otec je povinen nezletilého v neděli v 18:00 na témže místě matce vrátit.
2. Usnesení o předběžném opatření je vykonatelné jeho vyhlášením, a nedošlo-li k němu, jeho doručením.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]`
  },
  {
    id: 'doc-3',
    title: 'Odvolání proti rozsudku soudu prvního stupně',
    category: 'court',
    desc: 'Odvolání ke Krajskému soudu proti rozsudku okresního soudu, který nezákonně či svévolně zamítl střídavou péči nebo určil nepřiměřený rozsah péče a výživného.',
    meta: 'Formát TXT • Opravný prostředek • ZDARMA',
    coResi: 'Sepsání a podání odvolání ke krajskému soudu s oporou v judikatuře Ústavního soudu, pokud prvoinstanční soud nadržoval matce a porušil práva otce a dítěte.',
    kdySePouzije: 'Do 15 dnů od doručení písemného vyhotovení rozsudku okresního soudu. Podává se prostřednictvím soudu prvního stupně.',
    pravniZaklad: 'Ustanovení § 201 a násl. zákona č. 99/1963 Sb., občanský soudní řád (OSŘ) ve spojení se zákonem č. 292/2013 Sb., o zvláštních řízeních soudních (ZŘS).',
    content: `Krajský soud v [Město]
Prostřednictvím Okresního soudu v [Město]
[Adresa okresního soudu, který rozsudek vydal]

K sp. zn.: [Spisová značka okresního soudu, např. 12 P 123/2026]

Otec (Odvolatel): [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Matka: [Jméno matky], narozená [Datum], bytem [Adresa matky]

Nezletilý: [Jméno dítěte], narozený [Datum]

ODVOLÁNÍ OTCE PROTI ROZSUDKU OKRESNÍHO SOUDU V [Město]
ze dne [Datum vydání], č. j. [Číslo jednací rozsudku]

I.
Dne [Datum doručení rozsudku] mi byl doručen shora označený rozsudek Okresního soudu v [Město], kterým bylo rozhodnuto tak, že nezletilý [Jméno dítěte] se svěřuje do výlučné péče matky a otci se stanovuje výživné ve výši [Částka] Kč a rozsah styku pouze každý druhý víkend od soboty 9:00 do neděle 17:00 hodin. S tímto rozsudkem v celém rozsahu zásadně nesouhlasím a podávám v zákonné 15denní lhůtě toto ODVOLÁNÍ.

II.
Prvostupňový soud dospěl k nesprávným skutkovým zjištěním a nesprávnému právnímu posouzení věci. Soud zamítl můj návrh na zavedení střídavé péče s odůvodněním, že mezi rodiči panuje napjatá komunikace a konflikt. Ústavní soud ČR přitom ve své konstantní judikatuře (např. klíčové nálezy I. ÚS 1554/14 či I. ÚS 2482/13) jasně deklaruje, že pouhá existence napětí nebo nesouhlas jednoho z rodičů nemůže být důvodem pro vyloučení střídavé péče. Pokud by tomu tak bylo, mohl by jeden z rodičů (zde matka) střídavou péči záměrně bojkotovat a získat výlučnou péči, což se v tomto případě stalo.

III.
Soud navíc zcela ignoroval silné výchovné i bytové kompetence otce a zcela pominul zájem nezletilého na zachování silné sourozenecké vazby se starším bratrem, který žije v mé plné péči. Rozsudek degraduje otce na pouhého „víkendového návštěvníka“, což odporuje čl. 3 Úmluvy o právech dítěte.

IV.
S ohledem na výše uvedené navrhuji, aby Krajský soud v [Město] napadený rozsudek okresního soudu změnil tak, že se nezletilý svěřuje do rovnocenné střídavé péče obou rodičů v týdenním intervalu a výživné bude upraveno s ohledem na reálné příjmy a vyvážený podíl na výchově.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]
ID Datové schránky: [ID schránky]`
  },
  {
    id: 'doc-4',
    title: 'Návrh na změnu péče / úpravu styku (změna poměrů)',
    category: 'court',
    desc: 'Používá se, pokud stávající rozsudek prokazatelně nefunguje, matka jej sabotuje, nebo se změnily okolnosti (např. dítě povyrostlo, nastoupilo do školy nebo se ukázalo ignorování sourozeneckých vazeb).',
    meta: 'Formát TXT • Pro úpravu starších rozsudků • ZDARMA',
    coResi: 'Návrh na zrušení dosavadního nefungujícího či nespravedlivého rozsudku a stanovení nového režimu (střídavé péče) z důvodu změny poměrů.',
    kdySePouzije: 'Při podstatné změně okolností, stárnutí dítěte, nástupu do školy, soustavném maření styku nebo porušování práv dítěte na sourozence ze strany matky.',
    pravniZaklad: 'Ustanovení § 909 občanského zákoníku, podle kterého dojde-li ke změně poměrů, soud změní rozhodnutí týkající se výkonu povinností a práv vyplývajících z rodičovské odpovědnosti.',
    content: `Okresní soud v [Město]
[Adresa soudu]

Matka: [Jméno a Příjmení matky], narozená [Datum], bytem [Adresa matky]
Otec: [Jméno a Příjmení otce], narozený [Datum], bytem [Adresa otce]

Nezletilý/á: [Jméno a Příjmení dítěte], narozený/á [Datum], bytem [Adresa bydliště dítěte]

NÁVRH OTCE NA ZMĚNU ROZHODNUTÍ O PÉČI A STYKU PRO NEZLETILÉHO (§ 909 o.z.)

I.
Rozsudkem Okresního soudu v [Město] ze dne [Datum], sp. zn. [Spisová značka], byl nezletilý svěřen do výlučné péče matky a otci byl stanoven styk v rozsahu [Popis starého styku]. Tento rozsudek byl vynesen v době, kdy dítě mělo pouze několik měsíců věku a bylo plně závislé na matce.

II.
Od vynesení původního rozhodnutí však došlo k zásadní změně poměrů. Nezletilý dosáhl věku [Věk] let, navštěvuje [mateřskou / základní] školu, je plně samostatný a vyjadřuje silné přání trávit s otcem podstatně více času. Otec se o syna bez potíží stará, má vynikající zázemí a v jeho domácnosti žije také starší polorodý bratr nezletilého [Jméno bratra], což vytváří nenahraditelné sourozenecké pouto. Původní rozsudek v současné době brání řádnému rozvoji bratrského vztahu a neodpovídá potřebám dítěte.

III.
Zároveň je nucen otec uvést, že matka soustavně zneužívá výlučné péče a odmítá jakoukoliv flexibilní domluvu nad rámec striktního soudního rozvrhu. S ohledem na vývojový posun dítěte a jeho nejlepší zájem navrhuji, aby soud po provedeném dokazování vynesl tento

R O Z S U D E K:

1. Rozsudek Okresního soudu v [Město] ze dne [Datum], č. j. [Číslo jednací], se v částech o péči, styku a výživném mění.
2. Nezletilý [Jméno dítěte] se svěřuje do střídavé péče obou rodičů v intervalu 7 dnů, se střídáním vždy v pátek v 15:00 hodin ve školském zařízení.
3. Výživné se stanovuje s ohledem na vyváženou střídavou péči.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]`
  },
  {
    id: 'doc-5',
    title: 'Návrh na výkon rozhodnutí (výzva k plnění)',
    category: 'execution',
    desc: 'První právní krok, pokud matka svévolně ignoruje platný rozsudek nebo předběžné opatření a odmítá vám předávat dítě. Soud ji oficiálně vyzve k nápravě.',
    meta: 'Formát TXT • První krok výkonu • ZDARMA',
    coResi: 'Soudní výzva matce, aby začala respektovat platný rozsudek nebo předběžné opatření a předávala dítě otci podle stanoveného rozvrhu.',
    kdySePouzije: 'Bezprostředně po prvním či opakovaném bezdůvodném nepředání dítěte matkou v čase určeném soudem.',
    pravniZaklad: 'Ustanovení § 501 zákona č. 292/2013 Sb., o zvláštních řízeních soudních (ZŘS).',
    content: `Okresní soud v [Město]
[Adresa soudu]

K sp. zn.: [Spisová značka opatrovnického spisu]

Otec (Navrhovatel): [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Matka (Povinná): [Jméno matky], narozená [Datum], bytem [Adresa matky]

Nezletilý: [Jméno dítěte], narozený [Datum]

NÁVRH NA VÝKON ROZHODNUTÍ (§ 501 ZŘS)
(písemná výzva povinnému rodiči k plnění soudního rozhodnutí)

I.
Rozsudkem Okresního soudu v [Město] ze dne [Datum], č. j. [Číslo jednací], případně usnesením o předběžném opatření ze dne [Datum], sp. zn. [Značka], byla upravena péče a styk s nezletilým [Jméno dítěte] tak, že otec je oprávněn pečovat o nezletilého v [Popis rozsahu péče otce, např. každý sudý týden od pátku 15:00 do neděle 18:00]. Toto rozhodnutí je vykonatelné.

II.
Matka však povinnosti uložené soudním rozhodnutím dlouhodobě a záměrně neplní. V termínech [Doplňte konkrétní data nepředání dítěte, např. pátek 15. 5. 2026 a pátek 29. 5. 2026] se otec dostavil k předání dítěte do místa bydliště matky, avšak matka mu nezletilého odmítla vydat, dveře neotevřela a na telefonáty nereagovala. Otec o těchto mařeních informoval OSPOD i Policii ČR.

III.
Chování matky představuje závažný zásah do práv nezletilého dítěte na péči obou rodičů a dochází k maření úředního rozhodnutí. S ohledem na výše uvedené navrhuji, aby soud vydal toto

U S N E S E N Í:

1. Soud vyzývá matku [Jméno matky], aby dobrovolně plnila vykonatelné soudní rozhodnutí – rozsudek Okresního soudu v [Město] ze dne [Datum], č. j. [Číslo jednací], a řádně předávala nezletilého [Jméno dítěte] do péče otce v souladu s tímto rozhodnutím.
2. Soud upozorňuje matku, že v případě dalšího neplnění povinností přistoupí k ukládání opakovaných pokut až do výše 50 000 Kč za každé jednotlivé maření, případně k odnětí dítěte.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]`
  },
  {
    id: 'doc-6',
    title: 'Návrh na uložení pokuty za maření styku',
    category: 'execution',
    desc: 'Pokud matka i přes soudní výzvu nadále blokuje kontakt s dítětem, žádejte soud o uložení citelné pokuty (až 50 000 Kč za každé maření). Opakované pokuty jsou klíčovým důkazem pro změnu péče.',
    meta: 'Formát TXT • Finanční sankce • ZDARMA',
    coResi: 'Uložení soudní pokuty matce za svévolné nerespektování rozsudku a maření styku otce s dítětem.',
    kdySePouzije: 'Poté, co soud již matku vyzval podle § 501 ZŘS k dobrovolnému plnění, ale matka opětovně nepředala dítě.',
    pravniZaklad: 'Ustanovení § 502 zákona č. 292/2013 Sb., o zvláštních řízeních soudních (ZŘS).',
    content: `Okresní soud v [Město]
[Adresa soudu]

K sp. zn.: [Spisová značka spisu]

Otec (Navrhovatel): [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Matka (Povinná): [Jméno matky], narozená [Datum], bytem [Adresa matky]

Nezletilý: [Jméno dítěte], narozený [Datum]

NÁVRH NA ULOŽENÍ POKUTY ZA MAŘENÍ SOUDNÍHO ROZHODNUTÍ (§ 502 ZŘS)

I.
Usnesením Okresního soudu v [Město] ze dne [Datum], č. j. [Číslo jednací výzvy], byla matka vyzvána k plnění povinností vyplývajících z vykonatelného rozsudku sp. zn. [Značka], a byla poučena o možnosti uložení pokuty v případě dalšího nerespektování.

II.
Matka však soudní výstrahu zcela ignoruje. Dne [Datum maření] se otec opětovně dostavil k převzetí nezletilého v čase určeném rozsudkem. Matka mu však syna opět nevydala s tvrzením, že [uveďte výmluvu matky, např. dítě je unavené / nechce jet]. Otec disponuje videozáznamem z místa předávání a svědectvím třetí osoby. Matka maří styk systematicky a cíleně s úmyslem vymazat otce ze života dítěte.

III.
Navrhuji proto, aby soud bezodkladně rozhodl a vydal toto

U S N E S E N Í:

1. Soud ukládá matce [Jméno matky] pokutu ve výši [Navrhovaná částka, např. 10 000] Kč za maření styku otce s nezletilým [Jméno dítěte] dne [Datum maření].
2. Matka je povinna uloženou pokutu zaplatit na účet Okresního soudu v [Město] do 15 dnů od doručení tohoto usnesení.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]`
  },
  {
    id: 'doc-7',
    title: 'Návrh na nařízení asistovaného předávání',
    category: 'execution',
    desc: 'Využijte, pokud je předávání dítěte doprovázeno agresivními scénami, vulgarismy ze strany matky a těžkým stresem pro dítě. Asistence neutrální organizace zajistí bezpečnost a nestranné důkazy.',
    meta: 'Formát TXT • Pro vysoce konfliktní situace • ZDARMA',
    coResi: 'Nařízení soudně asistovaného předávání dítěte za účasti nezávislých odborníků (např. krizového centra, krizového sociálního pracovníka).',
    kdySePouzije: 'Pokud matka při předávání dítěte vyvolává konflikty, slovně napadá otce před dítětem, nebo předstírá, že se dítě "bojí" a odmítá jít.',
    pravniZaklad: 'Ustanovení § 504 zákona č. 292/2013 Sb., o zvláštních řízeních soudních (ZŘS).',
    content: `Okresní soud v [Město]
[Adresa soudu]

K sp. zn.: [Spisová značka spisu]

Otec (Navrhovatel): [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Matka: [Jméno matky], narozená [Datum], bytem [Adresa matky]

Nezletilý: [Jméno dítěte], narozený [Datum]

NÁVRH NA NAŘÍZENÍ ASISTOVANÉHO PŘEDÁVÁNÍ NEZLETILÉHO DÍTĚTE (§ 504 ZŘS)

I.
Rozsudkem Okresního soudu v [Město] ze dne [Datum] byla upravena péče o nezletilého [Jméno dítěte]. Předávání dítěte má probíhat v místě bydliště matky. Každé předání je však doprovázeno enormním napětím. Matka se chová k otci hrubě, křičí na něj, dehonestuje jeho otcovské kompetence před dítětem a záměrně syna stresuje, čímž u něj vyvolává obrannou reakci a pláč. Následně otce obviňuje ze zanedbávání péče.

II.
Tento stav je pro psychiku nezletilého neúnosný. Otec má zájem na tom, aby předávání probíhalo v klidném, neutrálním a bezpečném prostředí bez hysterických scén. Jediným možným řešením je nařízení asistence odborné nezávislé organizace, která zajistí hladký průběh a vyhotoví objektivní písemné zprávy o chování obou rodičů i dítěte.

III.
Navrhuji proto, aby soud nařídil asistenci a vydal toto

U S N E S E N Í:

1. Předávání nezletilého [Jméno dítěte] mezi matkou a otcem bude pro dobu [Doplňte čas, např. 6 měsíců] probíhat za asistence odborné organizace [Název organizace, např. Charita / Centrum pro rodinu / Krizové centrum].
2. Rodiče jsou povinni poskytnout asistující organizaci plnou součinnost a podřídit se jejím pokynům při předávání nezletilého.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]`
  },
  {
    id: 'doc-8',
    title: 'Oznámení o maření styku a žádost o součinnost OSPOD',
    category: 'ospod',
    desc: 'Oficiální dopis vaší sociální pracovnici na OSPOD. Oznamte každé nepředání dítěte písemně, aby úřad musel konat a zanést informaci do spisu (klíčové pro budoucí soud).',
    meta: 'Formát TXT • Hlášení pro OSPOD • ZDARMA',
    coResi: 'Písemné oznámení maření soudního rozhodnutí matkou a oficiální žádost, aby OSPOD vykonal pohovor s matkou a sjednal nápravu.',
    kdySePouzije: 'Okamžitě po každém zmařeném předání dítěte, abyste měli nezpochybnitelnou úřední stopu.',
    pravniZaklad: 'Zákon č. 359/1999 Sb., o sociálně-právní ochraně dětí (ZSPOD).',
    content: `K rukám sociální pracovnice [Jméno pracovnice, pokud ji znáte]
Městský úřad [Město] - Odbor sociálně-právní ochrany dětí (OSPOD)
[Adresa úřadu]

K sp. zn.: [Spisová značka OSPOD, např. Om 123/2026]

Odesílatel (Otec): [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Matka: [Jméno matky], narozená [Datum], bytem [Adresa matky]

Nezletilý: [Jméno dítěte], narozený [Datum]

OZNÁMENÍ OTCE O MAŘENÍ PEČE / STYKU ZE STRANY MATKY A ŽÁDOST O SOUČINNOST

Vážená paní magistro / inženýrko,

jako otec nezletilého [Jméno dítěte] se na Vás obracím se žádostí o naléhavou součinnost a zásah ve věci ochrany zájmů mého syna.

Dne [Datum maření] v [Přesný čas] mělo dojít k předání nezletilého do mé péče v souladu s platným rozsudkem soudu ze dne [Datum]. K předání jsem se dostavil řádně a včas na dohodnuté místo [Popis místa, např. vlakové nádraží Přelouč]. Matka se však k předání nedostavila / odmítla mi syna vydat s odůvodněním, že [Doplňte důvod matky, např. syn spí / nepůjde k vám].

Jedná se o opakované a svévolné porušování soudního rozhodnutí a mých rodičovských práv ze strany matky. Tento postup poškozuje vztah syna ke mně a hrubě narušuje jeho stabilitu.

Žádám Vás tímto, abyste:
1. Toto oznámení neprodleně zařadila do spisové dokumentace Om našeho syna.
2. Bezodkladně předvolala matku [Jméno matky] k pohovoru a důrazně ji upozornila na právní důsledky maření soudního rozhodnutí a porušování práv dítěte na péči obou rodičů.
3. Informovala mě písemně o krocích, které OSPOD v této věci podnikl.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]`
  },
  {
    id: 'doc-9',
    title: 'Žádost o nahlížení do spisové dokumentace OSPOD (Om-spis)',
    category: 'ospod',
    desc: 'Otec jako rodič má plné právo vidět, co na něj matka nebo úředníci do spisu píší. Zde se velmi často odhalí lži a podjatost, které pak můžete u soudu snadno vyvrátit.',
    meta: 'Formát TXT • Právo na informace • ZDARMA',
    coResi: 'Získání úplného přístupu ke spisu "Om" (včetně všech vyjádření matky, záznamů ze schůzek a interních doporučení OSPOD).',
    kdySePouzije: 'Pravidelně během opatrovnického řízení, abyste znali argumenty protistrany a věděli, zda sociální pracovnice postupuje objektivně.',
    pravniZaklad: 'Ustanovení § 55 odst. 5 zákona č. 359/1999 Sb., o sociálně-právní ochraně dětí.',
    content: `Městský úřad [Město] - Odbor sociálně-právní ochrany dětí (OSPOD)
[Adresa úřadu]

K sp. zn.: [Spisová značka OSPOD, např. Om 123/2026]

Odesílatel (Otec): [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Matka: [Jméno matky], bytem [Adresa matky]
Nezletilý: [Jméno dítěte], narozený [Datum]

ŽÁDOST RODIČE O NAHLÍŽENÍ DO SPISOVÉ DOKUMENTACE NEZLETILÉHO (§ 55 odst. 5 ZSPOD)

Vážená paní sociální pracovnice,

jako otec a zákonný zástupce nezletilého [Jméno dítěte], tímto v souladu s ustanovením § 55 odst. 5 zákona č. 359/1999 Sb., o sociálně-právní ochraně dětí, ve znění pozdějších předpisů, žádám o umožnění nahlížení do spisové dokumentace vedené k mému nezletilému synovi pod výše uvedenou spisovou značkou.

V rámci nahlížení do spisové dokumentace žádám o možnost pořídit si kopie, výpisy, případně fotodokumentaci jednotlivých listin obsažených ve spisu (zejména vyjádření matky, podkladů od pediatra, zpráv ze školských zařízení a záznamů z případových schůzek).

Navrhuji termín nahlížení dne [Doplňte navrhované datum, např. 22. 7. 2026] v [Čas] hodin, případně Vás žádám o sdělení jiného nejbližšího možného termínu.

Děkuji za vyřízení mé žádosti v zákonné lhůtě.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]
Email/Telefon: [Váš kontakt]`
  },
  {
    id: 'doc-10',
    title: 'Vyjádření k návrhům a zprávám OSPOD pro soud',
    category: 'ospod',
    desc: 'Nenechte lživá tvrzení bez reakce. Písemně rozporujte každé neobjektivní tvrzení sociální pracovnice dříve, než s ním začne pracovat soudce.',
    meta: 'Formát TXT • Obrana u soudu • ZDARMA',
    coResi: 'Písemná replika/vyjádření otce k zaujaté či neobjektivní zprávě, kterou opatrovník (OSPOD) zaslal soudu jako podklad pro rozhodnutí.',
    kdySePouzije: 'Před soudním jednáním, jakmile ze soudního spisu zjistíte, že OSPOD předložil neobjektivní zprávu nadržující matce.',
    pravniZaklad: 'Ustanovení § 101 odst. 1 zákona č. 99/1963 Sb., občanský soudní řád.',
    content: `Okresní soud v [Město]
[Adresa soudu]

K sp. zn.: [Spisová značka, např. 13 Nc 11/2026]

Otec: [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Matka: [Jméno matky], bytem [Adresa matky]
Nezletilý: [Jméno dítěte], narozený [Datum]

VYJÁDŘENÍ OTCE K PODÁNÍM A ZPRÁVĚ OPATROVNÍKA (OSPOD) ZE DNE [Datum zprávy]

I.
Ve zprávě ze dne [Datum zprávy] dospěl kolizní opatrovník (OSPOD) k závěru, že střídavá péče není v zájmu nezletilého s tvrzením, že 4měsíční kojenec má biologicky exkluzivní vazbu výhradně na matku a otec není schopen plnohodnotně zajistit noční péči. S tímto závěrem zásadně nesouhlasím. Považuji jej za neprofesionální, hrubě diskriminační a vědecky vyvrácený.

II.
Opatrovník zcela přehlíží faktický stav: otec o nezletilého pečuje od narození bez jakýchkoliv potíží, dítě v přítomnosti otce nepláče, spí klidně a radostně reaguje. Tvrzení opatrovníka o "exkluzivní mateřské biologii" je v přímém rozporu s nejnovějšími vědeckými studiemi (např. prof. Warshak, 2016), které potvrzují, že střídavé přespávání u obou kompetentních rodičů od nejranějšího věku je klíčem k rozvoji zdravé a vyvážené vazby k oběma z nich.

III.
Opatrovník navíc zcela ignoruje sourozeneckou vazbu se starším bratrem [Jméno bratra], který žije v mé plné péči. Návrh OSPODu na odepření noční péče otce fakticky znamená drastické rozdělení bratrů, což je v rozporu s judikaturou Ústavního soudu o ochraně rodinného života a nerozdělování sourozenců. Žádám soud, aby při svém rozhodování vycházel z reálných kompetencí rodičů a mezinárodních vědeckých konsenzů, nikoli z genderových předsudků kolizního opatrovníka.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]`
  },
  {
    id: 'doc-11',
    title: 'Námitka podjatosti sociální pracovnice OSPOD',
    category: 'ospod',
    desc: 'Pokud sociální pracovnice otevřeně nadržuje matce, ignoruje vaše důkazy, tyká si s protistranou nebo zjevně porušuje etický kodex, podejte tuto námitku jejímu nadřízenému.',
    meta: 'Formát TXT • Procesní obrana • ZDARMA',
    coResi: 'Vyloučení podjaté sociální pracovnice z opatrovnického případu a přidělení nového, objektivního referenta.',
    kdySePouzije: 'Při prokazatelném nadržování protistraně, ignorování sourozeneckých vazeb nebo hrubě neprofesionálním chování úřednice OSPOD.',
    pravniZaklad: 'Ustanovení § 14 zákona č. 500/2004 Sb., správní řád.',
    content: `K rukám vedoucí/ho Odboru sociálních věcí
Městský úřad [Město]
[Adresa úřadu]

K sp. zn.: [Spisová značka spisu Om]

Odesílatel (Otec): [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Nezletilý: [Jméno dítěte], narozený [Datum]

NÁMITKA PODJATOSTI SOCIÁLNÍ PRACOVNICE [Jméno pracovnice] (§ 14 správního řádu)

Vážená paní vedoucí / Vážený pane vedoucí,

jako otec nezletilého [Jméno dítěte] tímto v souladu s ustanovením § 14 zákona č. 500/2004 Sb., správní řád, uplatňuji námitku podjatosti vůči sociální pracovnici [Jméno a příjmení pracovnice], která je pověřena výkonem sociálně-právní ochrany v opatrovnické věci mého nezletilého syna.

DŮVODY:
Jmenovaná pracovnice dlouhodobě nepostupuje nestranně a objektivně. Z jejího jednání je zřejmý silně negativní poměr ke mně jako otci a bezdůvodné preferování matky. Konkrétně:
1. Při osobním jednání dne [Datum] odmítla do protokolu zanést mé vyjádření a důkazy o tom, že otec bez problémů pečuje o dítě.
2. Zcela vědomě ignoruje sourozenecké vazby a zájmy mého druhého syna [Jméno bratra], kterého mám v plné péči, a otevřeně mi sdělila, že "otec má pouze platit a o dítě se má starat matka, protože je to žena". Tento výrok považuji za hrubé porušení Ústavy ČR a Etického kodexu sociálního pracovníka.

Vzhledem k tomu, že mám vážné pochybnosti o nepodjatosti jmenované úřednice, žádám, aby byla z projednávání věci vyloučena a případ byl přidělen jinému, nestrannému pracovníku OSPOD.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]`
  },
  {
    id: 'doc-12',
    title: 'Stížnost na postup OSPOD (Tajemníkovi úřadu)',
    category: 'complaint',
    desc: 'Formální stížnost na protiprávní postup nebo nečinnost úřadu. Podává se tajemníkovi městského úřadu nebo Krajskému úřadu, který OSPOD metodicky řídí.',
    meta: 'Formát TXT • Oficiální stížnost • ZDARMA',
    coResi: 'Zjednání nápravy, prověření pochybení úředníků OSPOD a zavedení oficiální stížnosti do personálního spisu pracovníků.',
    kdySePouzije: 'Při hrubém porušení povinností sociální pracovnice (např. nepravdivé informace předané soudu, nečinnost při hlášení maření styku).',
    pravniZaklad: 'Ustanovení § 175 zákona č. 500/2004 Sb., správní řád.',
    content: `K rukám tajemníka Městského úřadu [Město]
[Adresa úřadu]

Odesílatel (Stěžovatel): [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Nezletilý: [Jméno dítěte], narozený [Datum]

STÍŽNOST NA NEPROFESIONÁLNÍ A PROTIPRÁVNÍ POSTUP OSPOD [Město] (§ 175 správního řádu)

Vážený pane tajemníku / Vážená paní tajemnice,

tímto podávám formální stížnost podle § 175 zákona č. 500/2004 Sb., správní řád, na postup Odboru sociálně-právní ochrany dětí (OSPOD) v [Město], konkrétně na činnost referentky [Jméno pracovnice], která vystupuje jako kolizní opatrovník mého syna.

Předmětem stížnosti je soustavné porušování povinností stanovených zákonem č. 359/1999 Sb., o sociálně-právní ochraně dětí. Referentka se dopustila těchto závažných pochybení:
1. Záměrně zkreslila informace podávané soudu, když zatajila zprávu pediatra potvrzující skvělý zdravotní stav dítěte v mé péči.
2. Zcela ignorovala písemná oznámení o soustavném maření styku ze strany matky a odmítla s matkou situaci projednat, čímž napomáhá protiprávnímu stavu.

Žádám Vás o podrobné prošetření postupu jmenované pracovnice, zjednání okamžité nápravy a písemné vyrozumění o výsledku šetření v zákonné 60denní lhůtě.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]`
  },
  {
    id: 'doc-13',
    title: 'Podnět Veřejnému ochránci práv (Ombudsmanovi)',
    category: 'complaint',
    desc: 'Pokud selhal OSPOD i stížnosti na úřadě, ombudsman je nejvyšší instance. Může podrobně prošetřit a oficiálně potrestat nezákonný nebo diskriminační postup sociálky.',
    meta: 'Formát TXT • Nejvyšší kontrola OSPOD • ZDARMA',
    coResi: 'Oficiální šetření Kanceláře Veřejného ochránce práv, které často odhalí fatální procesní chyby úřadů a donutí je změnit postoj k otci.',
    kdySePouzije: 'Pokud jste vyčerpali běžné stížnosti na OSPOD u tajemníka či kraje, ale sociálka nadále nadržuje matce a maří vaše práva.',
    pravniZaklad: 'Zákon č. 349/1999 Sb., o Veřejném ochránci práv.',
    content: `Kancelář Veřejného ochránce práv
Údolní 39
602 00 Brno

Odesílatel (Podavatel): [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Nezletilý: [Jméno dítěte], narozený [Datum]
Úřad, proti němuž podnět směřuje: Městský úřad [Město] - OSPOD

PODNĚT K PROŠETŘENÍ POSTUPU ORGÁNU SOCIÁLNĚ-PRÁVNÍ OCHRANY DĚTÍ (OSPOD)

Vážený pane veřejný ochránci práv,

obracím se na Vás s podnětem k prošetření činnosti OSPOD v [Město], který vystupuje jako kolizní opatrovník mého nezletilého syna [Jméno] v opatrovnickém řízení sp. zn. [Značka] u Okresního soudu v [Město].

Mám za to, že úřad svým postupem hrubě porušil povinnost hájit nejlepší zájmy dítěte a dopustil se přímé diskriminace mé osoby na základě pohlaví. Pracovníci OSPOD ignorovali má opakovaná písemná oznámení o maření styku matkou, odmítli mi umožnit zákonné nahlížení do spisu Om a ve svých zprávách pro soud bagatelizovali sourozenecké vazby mého syna se starším bratrem, kterého mám v plné péči.

Předchozí stížnosti podané k tajemníkovi úřadu i na Krajský úřad byly zamítnuty bez reálného prošetření věci, úřady se kryjí navzájem.

K podnětu přikládám:
1. Kopii původního rozsudku soudu a zpráv OSPOD.
2. Kopie mých stížností tajemníkovi a jeho vyjádření.

Žádám Vás o nezávislé prošetření postupu OSPOD a vydání zprávy o pochybení úřadu.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]`
  },
  {
    id: 'doc-14',
    title: 'Stížnost na chování soudce k předsedovi soudu',
    category: 'complaint',
    desc: 'Neřeší sice samotný rozsudek (proti tomu je odvolání), ale podává se, pokud se k vám soudce během jednání choval urážlivě, vyvíjel nátlak, skákal do řeči nebo byl zjevně podjatý.',
    meta: 'Formát TXT • Obrana proti aroganci soudců • ZDARMA',
    coResi: 'Oficiální prošetření vystupování soudce předsedou soudu, zápis do osobního spisu soudce, případně podání kárné žaloby.',
    kdySePouzije: 'Bezprostředně po soudním jednání, kde soudce hrubě porušil pravidla důstojnosti, neutrality a rovnosti účastníků řízení.',
    pravniZaklad: 'Ustanovení § 164 zákona č. 6/2002 Sb., o soudech a soudcích.',
    content: `K rukám předsedy Okresního soudu v [Město]
[Adresa soudu]

Odesílatel (Stěžovatel): [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Spisová značka řízení: [Např. 13 Nc 11/2026]
Soudce, proti němuž stížnost směřuje: [Jméno soudce, např. JUDr. Barbora Prázová]

STÍŽNOST NA NEVHODNÉ CHOVÁNÍ A NARUŠENÍ DŮSTOJNOSTI JEDNÁNÍ SOUDCEM (§ 164 zákona o soudech a soudcích)

Vážený pane předsedo / Vážená paní předsedkyně,

podávám tímto stížnost podle § 164 zákona č. 6/2002 Sb., o soudech a soudcích, na nevhodné chování samosoudkyně [Jméno soudce] při ústním jednání konaném dne [Datum jednání] ve věci péče o nezletilého [Jméno dítěte].

Samosoudkyně v průběhu jednání hrubým způsobem porušila etické standardy soudcovského stavu a zásadu rovnosti účastníků. Konkrétně:
1. Opakovaně mi skákala do řeči, zvyšovala hlas a otevřeně se mi vysmívala, když jsem argumentoval judikaturou Ústavního soudu o střídavé péči u kojenců.
2. Před vynesením rozsudku mi sdělila, že "otec nemá u malého dítěte co pohledávat a střídavou péči si prosazuji jen z ješitnosti", čímž prokázala naprostou ztrátu nestrannosti a neutrality.

Tyto výroky jsou zaznamenány v audiozáznamu z jednání, který přikládám. Chování soudkyně hluboce narušilo mou důvěru ve spravedlivý proces. Žádám Vás o prošetření věci a přijetí kárných opatření.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]`
  },
  {
    id: 'doc-15',
    title: 'Ústavní stížnost (porušení práva na rodinný život)',
    category: 'complaint',
    desc: 'Nejvyšší ústavní zbraň. Podává se do 2 měsíců od rozhodnutí Krajského soudu, pokud obecné soudy zcela ignorovaly nálezy Ústavního soudu o právu dítěte na oba rodiče.',
    meta: 'Formát TXT • Ústavní soud Brno • ZDARMA',
    coResi: 'Zrušení nespravedlivých rozsudků okresního a krajského soudu pro porušení základních práv rodiče a dítěte garantovaných Listinou práv a svobod.',
    kdySePouzije: 'Do 2 měsíců od doručení rozhodnutí odvolacího (Krajského) soudu. Vyžaduje povinné zastoupení advokátem (vzor slouží jako podklad pro přípravu).',
    pravniZaklad: 'Čl. 36 a čl. 32 Listiny základních práv a svobod, ve spojení se zákonem č. 182/1993 Sb., o Ústavním soudu.',
    content: `K rukám Ústavního soudu ČR
Joštova 8
660 83 Brno

Stěžovatel: [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Právní zástupce: [Jméno advokáta, adresa sídla] (na základě plné moci)

Nezletilý: [Jméno dítěte], narozený [Datum]

ÚSTAVNÍ STÍŽNOST
proti rozsudku Krajského soudu v [Město] ze dne [Datum], č. j. [Číslo jednací]
pro porušení práva na rodinný život (čl. 32 Listiny) a spravedlivý proces (čl. 36 Listiny)

I.
Shora označeným rozsudkem krajského soudu bylo potvrzeno rozhodnutí soudu prvního stupně, kterým byl nezletilý svěřen do výlučné péče matky a styk otce byl extrémně omezen, přestože obecné soudy potvrdily plnou výchovnou kompetenci otce a zájem dítěte na péči obou rodičů. Tímto rozhodnutím došlo k závažnému porušení mých základních práv garantovaných Listinou základních práv a svobod a Úmluvou o právech dítěte.

II.
Obecné soudy dospěly k závěru, že nízký věk kojence (nar. prosinec 2025) a mírné komunikační napětí mezi rodiči bez dalšího vylučují střídavou péči a přespávání u otce. Tento právní názor je v přímém a extrémním rozporu s konstantní judikaturou Ústavního soudu (např. nálezy I. ÚS 2482/13, I. ÚS 1554/14, či II. ÚS 1673/21). Ústavní soud opakovaně judikoval, že věk dítěte ani nesouhlas matky nemohou být svévolným důvodem pro odepření střídavé péče, pokud jsou oba rodiče kompetentní. Obecné soudy se dopustily nepřípustného formalismu a porušily právo dítěte na rodinný život s oběma rodiči.

III.
Z výše uvedených důvodů navrhuji, aby Ústavní soud vydal tento

N Á L E Z:

1. Rozsudek Krajského soudu v [Město] ze dne [Datum], č. j. [Číslo jednací], a rozsudek Okresního soudu v [Město] ze dne [Datum], sp. zn. [Značka], se v celém rozsahu ruší.

V Brně dne [Datum]

...........................................
[Podpis advokáta stěžovatele]`
  },
  {
    id: 'doc-16',
    title: 'Dohoda rodičů o střídavé péči (Mimosoudní vzor)',
    category: 'agreement',
    desc: 'Kompletní vzor dohodnutého režimu, který vyplníte společně s matkou/otcem a předložíte soudu ke snadnému schválení bez agresivního sporu.',
    meta: 'Formát TXT • Pro konsensuální řešení',
    coResi: 'Písemná mimosoudní dohoda obou rodičů na zavedení střídavé péče, předávání dítěte a rozdělení nákladů a výživného.',
    kdySePouzije: 'Pokud jsou oba rodiče rozumní, dokáží komunikovat a shodnou se na rovnocenném podílu na výchově bez nutnosti vést v soudní síni agresivní spor.',
    pravniZaklad: 'Ustanovení § 906 odst. 1 a § 907 zákona č. 89/2012 Sb., občanský zákoník. Dohoda vyžaduje pro právní účinnost schválení soudem.',
    content: `DOHODA RODIČŮ O ÚPRAVĚ POMĚRŮ NEZLETILÉHO DÍTĚTE

Rodiče:
[Jméno otce], narozený [Datum], bytem [Adresa] (dále jen „otec“)
a
[Jméno matky], narozená [Datum], bytem [Adresa] (dále jen „matka“)

se níže uvedeného dne, měsíce a roku dohodli na této úpravě poměrů k jejich nezletilému dítěti:
[Jméno dítěte], narozenému dne [Datum] (dále jen „nezletilý“):

I.
Rodiče se dohodli, že nezletilý [Jméno dítěte] se pro dobu před a po rozvodu manželství svěřuje do střídavé péče obou rodičů.

II.
Interval střídání péče se sjednává jako týdenní (7 dnů). Předávání dítěte bude probíhat vždy v pátek v 17:00 hodin. Otec předá dítě matce v sudý týden a matka otci v lichý týden v místě bydliště přebírajícího rodiče, pokud se rodiče ad hoc nedohodnou jinak.

III.
Rodiče se dohodli na následujícím hrazení výživného:
Otec bude přispívat na výživu nezletilého částkou [Částka] Kč měsíčně k rukám matky, vždy do 15. dne v měsíci. Matka bude přispívat částkou [Částka] Kč měsíčně k rukám otce. Mimořádné náklady (školní pomůcky, zájmové kroužky, zdravotní výdaje nad 1 000 Kč) se rodiče zavazují hradit rovným dílem (50/50) po předchozí domluvě.

IV.
Tato dohoda se vyhotovuje ve třech stejnopisech a podléhá schválení opatrovnickým soudem. Rodiči se zavazují podat společný návrh na schválení této dohody bez zbytečného odkladu.

V [Město] dne [Datum]

...................................                 ...................................
[Podpis otce]                                      [Podpis matky]`
  },
  {
    id: 'doc-17',
    title: 'Žádost o osvobození od poplatků a ustanovení zástupce',
    category: 'court',
    desc: 'Návrh podávaný soudu v odvolacím opatrovnickém řízení, pokud otec pečuje o další závislou osobu, nemá stálý příjem a potřebuje bezplatného advokáta pro složitou odvolací věc.',
    meta: 'Formát TXT • Osvobození a bezplatný advokát • ZDARMA',
    coResi: 'Zajištění bezplatného právního zastoupení státem (ustanovení advokáta soudem) a osvobození od poplatků pro sociálně znevýhodněné rodiče.',
    kdySePouzije: 'Před odvolacím řízením u Krajského soudu, pokud je spor procesně složitý, otec nemá finance na komerčního právníka a pečuje o další dítě v plné péči či nemocného příbuzného.',
    pravniZaklad: 'Ustanovení § 138 a § 30 občanského soudního řádu (zákon č. 99/1963 Sb.).',
    content: `Okresní soud v [Město]
[Adresa soudu]

Ke spisové značce: [Spisová značka okresního soudu, např. 13 Nc 11/2026]

Odesílatel (Otec): [Vaše Jméno], narozený [Datum], trvale bytem [Vaše Trvalé Bydliště], t.č. bytem [Vaše Aktuální Bydliště]

VĚC: ŽÁDOST O OSVOBOZENÍ OD SOUDNÍCH POPLATKŮ A USTANOVENÍ ZÁSTUPCE Z ŘAD ADVOKÁTŮ PRO ODVOLACÍ ŘÍZENÍ

Dne [Datum vyhlášení rozsudku] byl ve shora nadepsané opatrovnické věci vyhlášen rozsudek soudu I. stupně, proti kterému podávám odvolání. Vzhledem k tomu, že se jedná o věc právně i procesně velmi složitou (týkající se péče o mého nezletilého syna, dopadů na mého staršího syna, kterého mám ve své výhradní péči, a reálného fungování rodiny), nejsem schopen se v odvolacím řízení před Krajským soudem hájit sám účinně bez odborné právní pomoci.

Zároveň tímto soud uctivě žádám o osvobození od soudních poplatků a ustanovení zástupce z řad advokátů podle § 138 a § 30 občanského soudního řádu, a to z následujících rodinných a majetkových důvodů:

1. Péče o závislé osoby: Mám ve své výhradní péči nezletilého staršího syna [Jméno staršího syna, věk, např. 8 let], o kterého osobně a nepřetržitě pečuji. Současně v rámci společné domácnosti osobně pečuji o svého nemocného otce, což mi znemožňuje flexibilní zapojení do běžného pracovního procesu.

2. Příjmové poměry: V důsledku plné péče o staršího syna, nemocného otce a aktuální krizové životní situace jsem momentálně bez stálého zaměstnání a aktuálně nepobírám stálé finanční příjmy ani sociální dávky. Naše domácnost je v tuto chvíli finančně paralyzována a závislá na dočasné materiální pomoci širší rodiny.

3. Majetkové poměry: Nevlastním žádný hodnotný majetek, nemovitosti ani finanční úspory. Vzhledem k nulovým příjmům jsou naše náklady na bydlení a základní potřeby hrazeny s extrémními obtížemi. Komerční právní zastoupení je pro mě za těchto podmínek naprosto finančně nedostupné.

Vzhledem k mým příjmovým a majetkovým poměrům by úhrada nákladů na advokáta vedla k vážnému ohrožení výživy mé i mého nezletilého syna. Moje odvolání přitom není zjevně bezúspěšné, neboť směřuje k ochraně nejlepšího zájmu dětí, odstranění logistického chaosu při předávání a zachování funkční sourozenecké vazby mezi bratry.

Jsem připraven na výzvu soudu neprodleně doložit prohlášení o majetkových poměrech na příslušném soudním tiskopisu.

S ohledem na výše uvedené žádám, aby mi soud pro odvolací řízení ustanovil zástupce z řad advokátů.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]`
  },
  {
    id: 'doc-18',
    title: 'Odvolání s vědeckou argumentací (Warshak & Fabricius)',
    category: 'court',
    desc: 'Odvolání k odvolacímu soudu proti nespravedlivé úpravě péče o malé dítě / kojence (bez přespávání u otce) s detailní citací vědeckých studií vyvracejících mýty o monotropii a škodlivosti odloučení od matky.',
    meta: 'Formát TXT • Vědecké zdůvodnění a judikatura • ZDARMA',
    coResi: 'Dosažení střídavé péče, zavedení přespávání (overnights) u otce u dětí mladších 3 let a zrušení nespravedlivého roztříštěného rozvrhu (pendlování).',
    kdySePouzije: 'Při odvolání proti rozsudku, který zamítl nocování dítěte u otce s odvoláním na "nízký věk" dítěte, přestože otec prokazuje plnou výchovnou způsobilost.',
    pravniZaklad: 'Ustanovení § 201 a násl. občanského soudního řádu (zákon č. 99/1963 Sb.), s odkazem na nálezy Ústavního soudu II. ÚS 1762/20 (sourozenecká vazba) a I. ÚS 3065/21.',
    content: `Krajský soud v [Město]
Prostřednictvím Okresního soudu v [Město]
[Adresa okresního soudu]

Ke spisové značce: [Spisová značka okresního soudu, např. 13 Nc 11/2026]

Odesílatel (Otec): [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Matka: [Jméno matky], narozená [Datum], bytem [Adresa matky]

Nezletilý: [Jméno dítěte], narozený [Datum, např. prosinec 2025]

ODVOLÁNÍ OTCE PROTI ROZSUDKU OKRESNÍHO SOUDU V [Město]
ze dne [Datum], č. j. [Číslo jednací]
(vědecké a právní zdůvodnění odvolání proti omezení noční péče otce)

I. Rozsah odvolání
Rozsudek soudu prvního stupně napadám výhradně ve výroku II., kterým byl stanoven roztříštěný, nerealizovatelný rozvrh péče otce (v sudém týdnu 1 noc u otce, v lichém týdnu striktně bez přespávání s předáváním 3x týdně na několik hodin na železniční stanici). Tento rozsudek v napadené části trpí zásadním právním i skutkovým pochybením a podávám proti němu toto odvolání.

II. Odůvodnění odvolání – Nesystémovost, roztříštěnost a odepření přespávání
Soud I. stupně sice formálně svěřil nezletilého do společné péče rodičů (výrok I.), avšak faktické nastavení péče ve výroku II. toto rozhodnutí popírá. Vytváří v praxi nefunkční, roztříštěný a nerealizovatelný model, který zásadním způsobem poškozuje zájmy a zdravý vývoj nezletilého kojence:

1. Zásadní rozpor v rozhodování soudu a nelogičnost odepření přespávání:
Samosoudkyně v odůvodnění konstatovala, že v odborné literatuře nenašla žádný relevantní důvod, který by bránil či omezoval přespávání takto starého dítěte u vlastního otce. Soud přesto rozhodl v hlubokém vnitřním rozporu s tímto závěrem a péči v lichém týdnu rozdrobil na krátké denní bloky bez přespávání. Pokud neexistuje odborná překážka pro přespávání dítěte u kompetentního otce, je takto nesystémové střídání režimů (jeden týden s nocí, druhý týden striktně bez noci) pro šestiměsíčního kojence naprosto matoucí a nekonzistentní.

2. Neúměrná zátěž pro dítě a logistická náročnost:
Soudem stanovený rozvrh nutí k neustálým a opakovaným přesunům. Dítě stráví kvůli této roztříštěnosti enormní množství času cestováním v hromadné dopravě a předáváním na železniční stanici. Namísto klidného vývoje a stabilního spánku v domácím prostředí je dítě v lichém týdnu každý druhý den vystaveno stresu z transportu.

3. Úplné vyloučení sourozenecké vazby s bratrem:
Otec má ve své výhradní péči staršího syna [Jméno staršího syna, např. 8 let]. Rozhodnutím soudu dochází k umělému a úplnému separování obou bratrů. V době, kdy otec pečuje o mladšího syna, je starší syn ve škole či družině a v momentě, kdy starší syn přichází domů, otec již musí mladšího syna předávat matce. To je v přímém rozporu s judikaturou Ústavního soudu (např. nález II. ÚS 2146/21 a II. ÚS 1762/20), podle níž jsou sourozenecké vazby integrální součástí práva na rodinný život.

III. Vědecká opora pro model ucelených bloků včetně přespávání
Odepření přespávání s odkazem na "nízký věk" kojence je v moderní vědě překonaným mýtem. Otec předkládá soudu závěry dvou klíčových mezinárodních vědeckých studií:

1. Richard A. Warshak – „Social Science and Parenting Plans for Young Children: A Consensus Report“ (2014):
Tato konsensuální zpráva, zaštítěná 110 předními světovými odborníky, jasně uvádí, že neexistují žádné vědecké důkazy, které by podporovaly plošné odkládání nebo zakazování přespávání dětí u otců v raném věku (včetně kojenců). Naopak, přespávání od útlého věku prokazatelně posiluje stabilitu rodinných vazeb a brání rozpadu vztahu mezi otcem a dítětem. Brzké zapojení otce do noční péče (večerní a ranní rituály jako koupání, uspávání, probouzení) buduje u dítěte silnější pocit bezpečí a imunitu vůči budoucím úzkostem.

2. William V. Fabricius – „Should Infants and Toddlers Have Frequent Overnight Parenting Time With Fathers? The Policy Debate and New Data“ (2016):
Tato rozsáhlá retrospektivní studie exaktně zkoumala dopady rané péče a prokázala, že pokud je nocování u otce odloženo na pozdější věk (2–3 roky), v psychice dítěte vzniká nevratný deficit, který trvale oslabí budoucí vztah otce a syna v dospělosti. Pouhé denní návštěvy (bez společné noci) mají pro kvalitu budoucí vazby téměř nulový přínos. Časté přespávání u otce přitom nijak nepoškozuje vazbu k matce.

IV. Návrh rozhodnutí odvolacího soudu
S ohledem na výše uvedené otec navrhuje, aby odvolací soud změnil rozsudek soudu prvního stupně ve výroku II. tak, že se otci určuje čas péče o nezletilého v ucelených časových blocích zahrnujících přespávání (přes noc), které zajistí kontinuitu péče, minimalizují neustálé cestování a umožní společný čas obou sourozenců v domácnosti otce v mimoškolní době a během víkendů.

V [Město] dne [Datum]

...........................................
[Vlastnoruční podpis otce]`
  },
  {
    id: 'doc-19',
    title: 'Vyjádření k maření dohod v době nemoci dítěte',
    category: 'court',
    desc: 'Podání k soudu nebo OSPOD v situaci, kdy dítě onemocnělo infekční chorobou (např. plané neštovice) a matka svévolně zmařila dohodnutou péči, odmítla komunikovat o zdravotním stavu a ignorovala protektivní pravidlo bezpečné rekonvalescence.',
    meta: 'Formát TXT • Urgentní oznámení • ZDARMA',
    coResi: 'Písemná reakce na svévolné chování matky, zajištění úředního záznamu na OSPOD a uplatnění přímých důkazů porušování rodičovských dohod u odvolacího soudu.',
    kdySePouzije: 'Při akutním konfliktu ohledně péče o nemocné dítě, kdy matka nerespektuje doporučení lékařů ani dohody o klidovém režimu a zneužívá nemoc k izolaci dítěte od otce.',
    pravniZaklad: 'Ustanovení § 890 občanského zákoníku (povinnost rodičů se vzájemně informovat) a § 100 zákona č. 108/2006 Sb.',
    content: `Krajskému soudu v [Město]
Prostřednictvím Okresního soudu v [Město]
[Adresa okresního soudu]

Spisová značka: [Spisová značka, např. 13 Nc 11/2026]

Odesílatel (Otec): [Vaše Jméno], narozený [Datum], bytem [Vaše Adresa]
Matka: [Jméno matky], narozená [Datum], bytem [Adresa matky]

Nezletilý: [Jméno dítěte], narozený [Datum]

VĚC: NALÉHAVÉ DOPLNĚNÍ ODVOLÁNÍ OTCE – OZNÁMENÍ O MAŘENÍ DOHOD, OHROŽENÍ ZDRAVÍ NEZLETILÉHO A UPŘESNĚNÍ VÝCHOVNÉHO NÁVRHU

Otec tímto podává k probíhajícímu odvolacímu řízení toto urgentní doplnění a předkládá soudu přímé důkazy o naprostém selhání stávajícího provizorního uspořádání péče, které je postavené na nutnosti operativního domluvy rodičů.

I. Skutkový stav a akutní ohrožení zdraví kojence
Nezletilý [Jméno dítěte] (v současné době ve věku [Věk, např. 6 měsíců]) prochází velmi těžkým, masivním a bolestivým průběhem vysoce infekčního onemocnění (plané neštovice). Dne [Datum] syn vykazoval zvýšenou teplotu nad 37 °C (konkrétně 37,6 °C, což dokládám přiloženou fotografií).

Podle dosavadních ujednání a základních logických pravidel péče má v případě nemoci dítěte platit protektivní pravidlo, že dítě zůstává v péči toho rodiče, u kterého se zrovna nachází. Cílem je zamezit komplikacím, šíření nákazy a nevystavovat nemocné dítě zbytečnému stresu z transportu.

II. Popis incidentu a maření dohod
Matka dnes toto krizové pravidlo i elementární zájem dítěte zcela ignorovala. Osobně dorazila do mého bydliště, kde verbálně eskalovala situaci, otci vulgárně nadávala a těžce nemocného kojence v horečkách otci fyzicky odebrala z postýlky a odvezla pryč.

Tímto krokem matka vědomě porušila nejen stávající protokol, ale i čerstvou dohodu uzavřenou na půdě OSPOD dne [Datum dohody na OSPOD]. Při odchodu navíc otci sdělila, že nadcházející dohodnutou péči otce (kdy měl otec za synem přijet na návštěvu, aby se v nemoci netransportoval) jednostranně maří a otce do svého objektu vůbec nevpustí.

III. Právní zhodnocení a upřesněný návrh
Tento incident jasně prokazuje, že jakýkoliv model péče vyžadující neustálou operativní shodu obou rodičů a střídání po několika dnech je kvůli agresivní reaktivitě a nespolehlivosti matky dlouhodobě neudržitelný. Vede pouze k neustálému napětí, které vyvrcholilo rizikovým transportem nemocného dítěte v horečkách.

Otec nechce omezovat práva matky, avšak v zájmu ochrany nezletilého před neustálým chaosem považuje za nezbytné nastavit jasný, pevný a stabilní řád. Otec proto navrhuje, aby odvolací soud stávající roztříštěné provizorium zrušil a určil pevná pravidla péče v ucelených blocích.

Zároveň navrhuji zavedení striktního pravidla pro případ nemoci: V případě nemoci nezletilého (potvrzené lékařem nebo provázené teplotou nad 37 °C) zůstává nezletilý po celou dobu trvání nemoci a rekonvalescence v péči toho rodiče, u kterého se v okamžiku propuknutí nemoci či zhoršení stavu nacházel. Druhý rodič má v takovém případě právo na informace o zdravotním stavu a právo na návštěvu v místě pobytu dítěte, avšak transport nemocného dítěte je bez výslovného souhlasu druhého rodiče či doporučení ošetřujícího lékaře zakázán.

Přílohy:
1. Fotografie nezletilého s horečkou a projevy infekce.
2. Přepis kontextové textové komunikace z Messengeru potvrzující dohodu a její jednostranné zrušení matkou.

V [Město] dne [Datum]

..................................
[Vlastnoruční podpis otce]`
  }
];

export default function KeStazeniSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'court' | 'execution' | 'ospod' | 'complaint' | 'agreement'>('all');
  const [activeDocId, setActiveDocId] = useState<string>('doc-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Form filling and direct editing states
  const [formValues, setFormValues] = useState<Record<string, Record<string, string>>>({});
  const [manualEdits, setManualEdits] = useState<Record<string, string>>({});
  const [editorTab, setEditorTab] = useState<'form' | 'manual'>('form');

  const filteredDocs = useMemo(() => {
    return TEMPLATES.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const activeDoc = useMemo(() => {
    return TEMPLATES.find(d => d.id === activeDocId) || TEMPLATES[0];
  }, [activeDocId]);

  // Extract variables enclosed in [brackets]
  const placeholders = useMemo(() => {
    const regex = /\[([^\]]+)\]/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(activeDoc.content)) !== null) {
      const placeholderName = match[1];
      if (!matches.includes(placeholderName)) {
        matches.push(placeholderName);
      }
    }
    return matches;
  }, [activeDoc.content]);

  // Compiled text incorporating formValues or manual edits
  const currentText = useMemo(() => {
    if (manualEdits[activeDoc.id] !== undefined) {
      return manualEdits[activeDoc.id];
    }
    let text = activeDoc.content;
    const docVals = formValues[activeDoc.id] || {};
    placeholders.forEach(placeholder => {
      const val = docVals[placeholder];
      if (val !== undefined && val !== '') {
        // Escape regex special characters
        const escaped = placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const reg = new RegExp('\\[' + escaped + '\\]', 'g');
        text = text.replace(reg, val);
      }
    });
    return text;
  }, [activeDoc.content, activeDoc.id, formValues, manualEdits, placeholders]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFormValueChange = (placeholder: string, val: string) => {
    setFormValues(prev => ({
      ...prev,
      [activeDoc.id]: {
        ...(prev[activeDoc.id] || {}),
        [placeholder]: val
      }
    }));
  };

  const handleManualEditChange = (val: string) => {
    setManualEdits(prev => ({
      ...prev,
      [activeDoc.id]: val
    }));
  };

  const handleReset = () => {
    setFormValues(prev => {
      const next = { ...prev };
      delete next[activeDoc.id];
      return next;
    });
    setManualEdits(prev => {
      const next = { ...prev };
      delete next[activeDoc.id];
      return next;
    });
    setEditorTab('form');
  };

  const handlePrint = (text: string, title: string) => {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document || printFrame.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: 'Times New Roman', Times, Georgia, serif;
                padding: 40px;
                line-height: 1.6;
                color: #111111;
                font-size: 12pt;
              }
              h1, h2, h3 {
                text-align: center;
                margin-bottom: 20px;
              }
              p, div {
                margin-bottom: 15px;
                text-align: justify;
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>
            <div style="font-size: 9pt; text-align: right; color: #777; margin-bottom: 25px; font-family: sans-serif; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
              Generováno portálem "Táta má právo" (synthesis-hub)
            </div>
            <div style="white-space: pre-wrap;">${text}</div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.frameElement.remove();
                }, 200);
              }
            </script>
          </body>
        </html>
      `);
      doc.close();
    }
  };

  const handleDownloadWord = (text: string, title: string) => {
    setDownloadingId(activeDoc.id);
    const blob = new Blob(['\ufeff' + text], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_') + '.doc';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setTimeout(() => {
      setDownloadingId(null);
    }, 1000);
  };

  return (
    <div className="space-y-8" id="download-section-root">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Ke stažení a úpravě</span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Galerie právních dokumentů a vzorů</h2>
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
          Sepsali jsme pro vás ověřené vzory návrhů k soudům a mimosoudních dohod. Můžete je zkopírovat, upravit podle svých údajů a podat sami. Doporučujeme však složitější případy vždy konzultovat s advokátem.
        </p>
      </div>

      {/* Searching & Filtering Header bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            id="doc-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Vyhledat vzor podání..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-all"
          />
        </div>

        {/* Category filtering tags */}
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto justify-start pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === 'all' ? 'bg-teal-600 text-white shadow-3xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Všechny ({TEMPLATES.length})
          </button>
          <button
            onClick={() => setSelectedCategory('court')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === 'court' ? 'bg-teal-600 text-white shadow-3xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            K soudu ({TEMPLATES.filter(t => t.category === 'court').length})
          </button>
          <button
            onClick={() => setSelectedCategory('execution')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === 'execution' ? 'bg-teal-600 text-white shadow-3xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Výkon rozhodnutí ({TEMPLATES.filter(t => t.category === 'execution').length})
          </button>
          <button
            onClick={() => setSelectedCategory('ospod')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === 'ospod' ? 'bg-teal-600 text-white shadow-3xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Jednání s OSPOD ({TEMPLATES.filter(t => t.category === 'ospod').length})
          </button>
          <button
            onClick={() => setSelectedCategory('complaint')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === 'complaint' ? 'bg-teal-600 text-white shadow-3xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Stížnosti a obrana ({TEMPLATES.filter(t => t.category === 'complaint').length})
          </button>
          <button
            onClick={() => setSelectedCategory('agreement')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === 'agreement' ? 'bg-teal-600 text-white shadow-3xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Dohody ({TEMPLATES.filter(t => t.category === 'agreement').length})
          </button>
        </div>

      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Document list */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block mb-2">Vyberte vzor k zobrazení</span>
          
          <div className="space-y-3" id="templates-list-container">
            {filteredDocs.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-xs">
                Žádné odpovídající vzory nebyly nalezeny.
              </div>
            ) : (
              filteredDocs.map(doc => {
                const isActive = activeDocId === doc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setActiveDocId(doc.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isActive 
                        ? 'bg-teal-50/60 border-teal-200 text-teal-950 shadow-3xs' 
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive ? 'bg-teal-600 text-white' : 'bg-slate-50 text-slate-500'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold font-display leading-snug">{doc.title}</h4>
                        <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                          {doc.desc}
                        </p>
                        <span className="text-[9px] text-slate-400 font-mono block pt-1">{doc.meta}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Document preview & Interactive fill-in editor workspace */}
        <div className="lg:col-span-7" id="active-doc-preview-panel">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs space-y-5">
            
            {/* Preview header */}
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-md border border-teal-100 font-bold">Zobrazený náhled vzoru</span>
                <h3 className="text-sm font-bold text-slate-800 font-display">{activeDoc.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto shrink-0">
                <button
                  id="copy-active-template-btn"
                  onClick={() => handleCopy(currentText, 'copy-active')}
                  className="flex-1 sm:flex-none py-1.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                  title="Zkopírovat aktuální upravenou verzi"
                >
                  {copiedId === 'copy-active' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-teal-400" />
                      Zkopírováno
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-teal-300" />
                      Kopírovat
                    </>
                  )}
                </button>

                <button
                  id="print-active-template-btn"
                  onClick={() => handlePrint(currentText, activeDoc.title)}
                  className="flex-1 sm:flex-none py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                  title="Vytisknout nebo uložit do PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Tisk / PDF
                </button>

                <button
                  id="download-active-template-word-btn"
                  onClick={() => handleDownloadWord(currentText, activeDoc.title)}
                  className="flex-1 sm:flex-none py-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                  title="Stáhnout jako formát pro MS Word"
                >
                  <FileDown className="w-3.5 h-3.5 text-slate-400" />
                  {downloadingId === activeDoc.id ? 'Příprava...' : 'Word (.doc)'}
                </button>
              </div>
            </div>

            {/* Structured meta information */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4.5 space-y-3 text-xs shadow-3xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Co řeší</span>
                  <p className="text-slate-700 leading-relaxed font-semibold">{activeDoc.coResi}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Kdy se používá</span>
                  <p className="text-slate-700 leading-relaxed font-semibold">{activeDoc.kdySePouzije}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Právní základ</span>
                  <p className="text-slate-600 leading-relaxed font-mono text-[10px]">{activeDoc.pravniZaklad}</p>
                </div>
              </div>
            </div>

            {/* Interactive Editor Workspace Tabs */}
            <div className="border-b border-slate-100 pb-0 flex justify-between items-center">
              <div className="flex gap-4">
                <button
                  onClick={() => setEditorTab('form')}
                  className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                    editorTab === 'form' 
                      ? 'text-teal-600 font-extrabold' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Edit className="w-3.5 h-3.5" />
                    Asistent vyplňování (Formulář)
                  </span>
                  {editorTab === 'form' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setEditorTab('manual')}
                  className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                    editorTab === 'manual' 
                      ? 'text-teal-600 font-extrabold' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Volný text (Přímá úprava)
                  </span>
                  {editorTab === 'manual' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                  )}
                </button>
              </div>

              {(placeholders.length > 0 || manualEdits[activeDoc.id] !== undefined) && (
                <button
                  onClick={handleReset}
                  className="text-[10px] text-slate-500 hover:text-rose-600 font-bold flex items-center gap-1 transition-all"
                  title="Vymazat vyplněné údaje a resetovat vzor"
                >
                  <RefreshCw className="w-3 h-3" />
                  Resetovat formulář
                </button>
              )}
            </div>

            {editorTab === 'form' ? (
              /* TAB 1: AUTOMATED FIELD FILLER */
              <div className="space-y-4">
                {placeholders.length > 0 ? (
                  <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4.5 space-y-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">
                      Vyplňte formulářové položky:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {placeholders.map((placeholder, index) => {
                        const val = (formValues[activeDoc.id] || {})[placeholder] || '';
                        return (
                          <div key={index} className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 block">
                              {placeholder}
                            </label>
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => handleFormValueChange(placeholder, e.target.value)}
                              placeholder={`Zadejte ${placeholder.toLowerCase()}...`}
                              className="w-full text-xs p-2 bg-white border border-slate-200 focus:border-teal-400 rounded-lg outline-none transition-all placeholder:text-slate-300 shadow-3xs"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-center text-xs text-slate-500">
                    <p>Tento vzor neobsahuje automaticky vyplnitelné parametry. Přejděte na záložku "Volný text" a upravte jej přímo.</p>
                  </div>
                )}

                {/* Inline Preview Window for compiled state */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Aktuální náhled dokumentu:</span>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={currentText}
                      className="w-full h-80 bg-slate-900 text-slate-100 p-4 rounded-xl text-[11px] font-mono leading-relaxed outline-none resize-none cursor-not-allowed select-all"
                    />
                    <div className="absolute bottom-3 right-3 text-[9px] text-teal-400 font-mono bg-slate-800/80 px-2 py-1 rounded">
                      Automatický režim (vyplněný z formuláře)
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB 2: RAW MANUAL DOCUMENT TEXT EDITOR */
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Zde můžete text libovolně přepsat a doplnit:</span>
                <div className="relative">
                  <textarea
                    id="active-template-textarea"
                    value={currentText}
                    onChange={(e) => handleManualEditChange(e.target.value)}
                    className="w-full h-[400px] bg-slate-900 text-slate-100 p-4 rounded-xl text-[11px] font-mono leading-relaxed outline-none resize-none cursor-text select-all focus:ring-1 focus:ring-teal-500/50"
                    placeholder="Zde můžete napsat nebo zkopírovat vlastní text podání..."
                  />
                  <div className="absolute bottom-3 right-3 text-[9px] text-amber-400 font-mono bg-slate-800/80 px-2 py-1 rounded animate-pulse">
                    Manuální úprava zapnuta
                  </div>
                </div>
              </div>
            )}

            {/* Warning advisory */}
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[10px] text-amber-800 space-y-1 leading-normal">
                <span className="font-bold uppercase tracking-wider block font-mono">Doporučení pro vyplňování:</span>
                <p>
                  Všechny hodnoty v hranatých závorkách (např. <code>[Jméno dítěte]</code>) musíte nahradit svými reálnými údaji. Vyplněný text vytiskněte a podepište, případně jej uložte a odešlete soudu elektronicky ze své <strong>osobní datové schránky fyzické osoby</strong>. Podání přes datovou schránku nahrazuje vlastnoruční podpis a je zcela zdarma.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
