import json

transformed_docs = [
  {
    "id": "doc-01",
    "pageNumber": 1,
    "title": "Vzdělávací studie č. 1: Prvostupňová úprava péče o kojence s roztříštěným harmonogramem",
    "category": "soudni-usneseni",
    "categoryLabel": "Soudní usnesení & rozsudky",
    "issuingBody": "Soud I. stupně",
    "targetBody": "Účastníci řízení (otec, matka)",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 01",
    "summary": "Analýza prvostupňového rozhodnutí, které formálně deklarovalo společnou péči o kojence, avšak časově ji vymezilo do krátkých odpoledních úseků s povinností předávat dítě u nádraží.",
    "legalTakeaway": "Deklarace společné péče bez možnosti noční péče vytváří neudržitelný model. Proti takovému roztříštění je nutné se bránit věcně argumentovaným odvoláním.",
    "content": """Nadpis stránky: Prvostupňová úprava péče o kojence s roztříštěným harmonogramem

Stručné shrnutí situace:
Soud prvního stupně v opatrovnickém řízení rozhodl o svěření šestiměsíčního dítěte do společné péče obou rodičů. Přestože výrok formalizuje rovnocennou péči, v praktickém vymezení časových intervalů přisoudil otci pouze několik samostatných denních úseků v týdnu bez možnosti přespání dítěte v jeho domácnosti a nařídil předávání v prostoru veřejné dopravy.

Klíčové skutečnosti:
- Soud sice vyhověl návrhu na vyslovení společné péče, avšak jejíž časovou dotaci vymezil nesymetricky.
- Otci byla stanovena péče v rozsahu několika odpoledních hodin během týdne bez možnosti noční péče.
- Byla uložena povinnost předávat kojence na veřejném prostranství v blízkosti železniční stanice.
- Výživné bylo vyměřeno s přihlédnutím k deklarovanému režimu péče a finančním možnostem účastníků.

Procesní význam dokumentu:
Tento dokument představuje primární rozhodnutí prvního stupně, které určilo počáteční právní rámec péče. Formální označení režimu jako společné péče neodpovídalo faktickým podmínkám realizace rodičovské odpovědnosti, což vytvořilo přímý důvod pro odvolací přezkum.

Dopad na další průběh řízení:
Nastavení roztříštěných časových úseků způsobilo logistickou zátěž pro dítě i rodiče. Zjištěná neudržitelnost modelu vedla otce k podání odvolání k krajskému soudu s návrhem na souvislejší bloky péče a zachování vazeb se sourozencem."""
  },
  {
    "id": "doc-02",
    "pageNumber": 2,
    "title": "Vzdělávací studie č. 2: Odvolání otce proti neudržitelnému rozdrobení péče",
    "category": "soudni-podani",
    "categoryLabel": "Soudní podání otce",
    "issuingBody": "Otec",
    "targetBody": "Krajský soud (odvolací orgán)",
    "dateStr": "v průběhu odvolacího řízení",
    "caseRef": "Případová studie 02",
    "summary": "Předložení odvolání otce cílícího na nahrazení roztříštěného střídání souvislým střídavým režimem a doložení vědeckých poznatků o významu noční péče u kojenců.",
    "legalTakeaway": "Odvolání musí věcně vyvracet stereotypy o neschopnosti otců pečovat o kojence v noci a opírat se o odborné studie i judikaturu Ústavního soudu.",
    "content": """Nadpis stránky: Odvolací opravný prostředek proti nesouvislému režimu péče

Stručné shrnutí situace:
Otec podal odvolání proti prvostupňovému rozhodnutí s cílem dosáhnout souvislého střídavého režimu. V podání namítal, že neustálé přesuny dítěte během jednoho týdne poškozují psychomotorický vývoj kojence a brání vytvoření stabilního denního režimu i vazeb se starším sourozencem.

Klíčové skutečnosti:
- Otec navrhl nahradit denní fragmentované úseky uceleným vícedenním cyklem péče.
- Do argumentace byly začleněny vědecké poznatky a odborné studie potvrzující význam noční péče obou rodičů pro bezpečnou vazbu kojence.
- Poukazovalo se na opomenutí sourozenecké vazby se starším dítětem trvale žijícím v péči otce.
- Bylo zdůrazněno, že otcova domácnost je plně vybavena pro kompletní péči o dítě.

Procesní význam dokumentu:
Podané odvolání zahájilo přezkumné řízení u krajského soudu a do spisu vneslo novou argumentační rovinu založenou na odborné literatuře a judikatuře Ústavního soudu o rovnocenném rodičovství.

Dopad na další průběh řízení:
Odvolání přimělo odvolací soud i OSPOD zabývat se dopady častého cestování na kojence a posoudit reálnou udržitelnost stanoveného předávání."""
  },
  {
    "id": "doc-03",
    "pageNumber": 3,
    "title": "Vzdělávací studie č. 3: Výzva k předání majetku a organizaci společného prostředí",
    "category": "zpravy-dokazy",
    "categoryLabel": "Důkazní konverzace & chaty",
    "issuingBody": "Otec",
    "targetBody": "Matka",
    "dateStr": "po rozpadu domácnosti",
    "caseRef": "Případová studie 03",
    "summary": "Písemná komunikace ohledně vydání osobních věcí, zdravotní dokumentace dítěte a nastavení racionální dohody o péči bez nutnosti soudních zásahů.",
    "legalTakeaway": "Písemné výzvy k věcné dohodě slouží v řízení jako důkaz dobré vůle jednoho z rodičů a ochoty ke konstrukční komunikaci.",
    "content": """Nadpis stránky: Výzva k mimosoudnímu uspořádání poměrů a předání věcí

Stručné shrnutí situace:
Otec zaslal matce písemnou výzvu se žádostí o předání osobního majetku, dětského vybavení a zdravotního průkazu dítěte po opuštění společné domácnosti. Současně navrhl harmonogram setkávání a dohodu o hrazení potřeb dítěte.

Klíčové skutečnosti:
- Otec se domáhal vrácení svých osobních dokladů, pracovních pomůcek a části vybavení pro dítě.
- Navrhl konkrétní termíny pro vzájemné předávání dítěte na základě předchozí ústní dohody.
- Požadoval zpřístupnění zdravotní dokumentace a informací o ošetřujícím lékaři.
- Nabídl přímou finanční participaci na zvýšených nákladech spojených s výživou dítěte.

Procesní význam dokumentu:
Písemná komunikace slouží v soudním spisu jako doklad o snaze otce řešit situaci smírčí cestou a dokládá jednostranné překážky v přístupu k věcem a informacím.

Dopad na další průběh řízení:
Absence reakce na věcný návrh dohodového uspořádání potvrdila nutnost soudního vymezení práv a povinností obou rodičů."""
  },
  {
    "id": "doc-04",
    "pageNumber": 4,
    "title": "Vzdělávací studie č. 4: Podnět k prověření postupu orgánu sociálně-právní ochrany",
    "category": "ospod-meu",
    "categoryLabel": "Stížnosti & Odpovědi OSPOD / MěÚ",
    "issuingBody": "Otec",
    "targetBody": "Vedení městského úřadu",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 04",
    "summary": "Oficiální stížnost na podjatost a jednostranný postup sociální pracovnice, která ignorovala podklady předložené otcem a upřednostňovala požadavky matky.",
    "legalTakeaway": "Stížnost podle správního řádu je základním nástrojem při ochraně před alibismem nebo jednostranným přístupem pracovníků OSPOD.",
    "content": """Nadpis stránky: Podnět k přezkoumání postupu opatrovníka

Stručné shrnutí situace:
Otec podal vedoucímu orgánu stížnost na postup příslušné sociální pracovnice. V podání poukazoval na neobjektivní hodnocení výchovných předpokladů obou rodičů, přehlížení sourozeneckých vazeb a nekritické přejímání tvrzení druhého rodiče.

Klíčové skutečnosti:
- Stížnost namítala opomenutí důležitých informací o stabilním prostředí v domácnosti otce.
- Pracovnici bylo vytýkáno doporučení nestandardního místa předávání dítěte v místech hromadné dopravy.
- Otec poukázal na absenci osobního šetření v jeho bydlišti před formulací závěrečného stanoviska.
- Bylo požadováno zjednání nápravy a změna přístupu při zastupování zájmů dítěte.

Procesní význam dokumentu:
Podání představuje využití kontrolních mechanismů ve veřejné správě, jehož účelem je vyvolat vnitřní přezkum postupu kolizního opatrovníka.

Dopad na další průběh řízení:
Vyřízení stížnosti přimělo orgán sociálně-právní ochrany k detailnějšímu zdokumentování spisu a provedení místního šetření u obou rodičů."""
  },
  {
    "id": "doc-05",
    "pageNumber": 5,
    "title": "Vzdělávací studie č. 5: Návrh na vydání předběžného opatření ke stabilizaci styku",
    "category": "soudni-podani",
    "categoryLabel": "Soudní podání otce",
    "issuingBody": "Otec",
    "targetBody": "Okresní soud",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 05",
    "summary": "Urgentní návrh na dočasnou úpravu poměrů z důvodu jednostranného bránění v kontaktu s dítětem ze strany matky v období před vynesením rozsudku.",
    "legalTakeaway": "Předběžné opatření je nutné navrhnout okamžitě při svévolném přerušení styku, aby nedošlo k vytvoření faktického stavu bezpráví.",
    "content": """Nadpis stránky: Návrh na dočasnou úpravu rodičovské péče

Stručné shrnutí situace:
Z důvodu úplného zamezení kontaktu s dítětem ze strany matky podal otec návrh na vydání předběžného opatření. Návrh usiloval o okamžité stanovení pravidelného režimu péče do doby, než bude ve věci rozhodnuto konečným rozsudkem.

Klíčové skutečnosti:
- Matka bez právního důvodu odmítala předávat dítě otci po dobu několika týdnů.
- Otec doložil dovednost postarat se o kojence i existenci vyhovujícího zázemí.
- Návrh přesně vymezil dny a hodiny předávání, aby byla zajištěna kontinutita vztahu.
- Bylo zdůrazněno riziko odcizení dítěte od otce v důsledku dlouhotrvající pauzy.

Procesní význam dokumentu:
Návrh byl procesním nástrojem reakce na akutní stav ohrožení rodičovských práv a potřeby rychlého zásahu soudu.

Dopad na další průběh řízení:
Rozhodování o předběžném opatření přinutilo soud zabývat se aktuální faktickou situací a motivovalo strany k uzavření dočasné procesní dohody."""
  },
  {
    "id": "doc-06",
    "pageNumber": 6,
    "title": "Vzdělávací studie č. 6: Protokol o jednání před opatrovnickým soudem",
    "category": "soudni-usneseni",
    "categoryLabel": "Soudní usnesení & rozsudky",
    "issuingBody": "Okresní soud",
    "targetBody": "Účastníci a opatrovník",
    "dateStr": "při ústním jednání",
    "caseRef": "Případová studie 06",
    "summary": "Oficiální záznam z průběhu soudního výslechu účastníků, přednesu stanoviska OSPOD a uzavření dočasného smíru o úpravě péče.",
    "legalTakeaway": "Protokol z jednání je klíčový důkazní prvek. Veškeré vyjádření stran a dohody schválené do protokolu jsou ihned právně vymožitelné.",
    "content": """Nadpis stránky: Záznam z ústního jednání opatrovnického soudu

Stručné shrnutí situace:
Při soudním jednání proběhl výslek obou rodičů a zástupce orgánu sociálně-právní ochrany dětí. Na základě diskuse byla do protokolu sjednána dočasná dohoda o úpravě péče do doby vyhotovení znaleckého posudku nebo konečného rozhodnutí.

Klíčové skutečnosti:
- Oba rodiče představili svoje představy o rozsahu péče a výživném.
- OSPOD přednesl své doporučení zaměřené na postupné rozšiřování kontaktu otce s dítětem.
- Byla schválena dočasná úprava péče s vymezením konkrétních dnů v týdnu.
- Soud poučil účastníky o právních následcích nedodržení dohodnutého režimu.

Procesní význam dokumentu:
Protokol zachycuje oficiální postoje stran i schválená ujednání, čímž vytváří závazný podklad pro další procesní kroky.

Dopad na další průběh řízení:
Prozatímní dohoda stabilizovala kontakt otce s dítětem na překlenovací období a posloužila jako srovnávací základ pro posouzení funkčnosti modelu."""
  },
  {
    "id": "doc-07",
    "pageNumber": 7,
    "title": "Vzdělávací studie č. 7: Vyjádření neziskové organizace k poskytování sociální služby",
    "category": "charita-sluzby",
    "categoryLabel": "Charita & sociální služby",
    "issuingBody": "Poskytovatel sociálních služeb",
    "targetBody": "Soud / OSPOD",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 07",
    "summary": "Zpráva terénní sociální služby o asistenci matce, hodnocení průběhu předávání dítěte a komunikaci mezi rodiči.",
    "legalTakeaway": "Zprávy poskytovatelů služeb mohou trpět jednostranným viděním, pokud je služba smlouvána pouze s jedním z rodičů. Je nutné vyžadovat vyváženost.",
    "content": """Nadpis stránky: Zpráva poskytovatele sociální péče o podpoře rodiny

Stručné shrnutí situace:
Nezisková organizace poskytující terénní služby matce předložila spisu zprávu o své činnosti. Zpráva popisovala asistenci při předávání dítěte a hodnotila atmosféru mezi rodiči během setkání.

Klíčové skutečnosti:
- Služba byla sjednána na žádost matky jako podpora v krizové situaci.
- Pracovníci popsali průběh několika předání dítěte za jejich přítomnosti.
- Ve zprávě byly zmíněny napjaté vztahy mezi rodiči a odlišné náhledy na výchovu.
- Otec poukázal na chybějící objektivitu, neboť organizace nekomunikovala s oběma rodiči rovnocenně.

Procesní význam dokumentu:
Listina slouží jako podpůrný důkazní materiál, jehož vypovídací hodnotu soud posuzuje v kontextu ostatních provedených důkazů.

Dopad na další průběh řízení:
Zpráva vedla otce k požadování jasnějších rules pro zapojování třetích subjektů do předávání dítěte."""
  },
  {
    "id": "doc-08",
    "pageNumber": 8,
    "title": "Vzdělávací studie č. 8: Vyrozumění krajského úřadu o postoupení podnětu",
    "category": "mpsv-ombudsman",
    "categoryLabel": "Inspekce MPSV & Ombudsman",
    "issuingBody": "Krajský úřad",
    "targetBody": "Otec",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 08",
    "summary": "Informace nadřízeného orgánu o přijetí podnětu k přezkumu postupu prvostupňového OSPOD a jeho postoupení k metodickému prověření.",
    "legalTakeaway": "Kontrolní přezkum u krajského úřadu představuje vyšší stupeň obrany proti pochybením lokálních orgánů sociálně-právní ochrany.",
    "content": """Nadpis stránky: Vyrozumění nadřízeného orgánu o přezkumu postupu

Stručné shrnutí situace:
Krajský úřad vyrozuměl otce o obdržení jeho podnětu týkajícího se namítaných pochybení městského úřadu. Oznámil zahájení prověřování spisu z hlediska dodržení metodických postupů sociálně-právní ochrany.

Klíčové skutečnosti:
- Nadřízený orgán potvrdil přijetí podnětu k přezkoumání postupu nižšího úřadu.
- Bylo vyžádáno předložení kompletní spisové dokumentace vedené o dítěti.
- Úřad přislíbil prověřit námitky týkající se objektivity a hodnocení sourozeneckých vazeb.
- O výsledku šetření měl být stěžovatel písemně informován.

Procesní význam dokumentu:
Vyrozumění dokládá aktivaci dohledových mechanismů nad činností prvostupňového opatrovníka.

Dopad na další průběh řízení:
Zásah krajského úřadu zvýšil dohled nad kvalitou úkonů prvostupňového OSPOD v dalším průběhu sporu."""
  },
  {
    "id": "doc-09",
    "pageNumber": 9,
    "title": "Vzdělávací studie č. 9: Zpráva dětského lékaře o zdravotním stavu dítěte",
    "category": "zpravy-dokazy",
    "categoryLabel": "Důkazní konverzace & chaty",
    "issuingBody": "Ošetřující dětský lékař",
    "targetBody": "Soud / Rodiče",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 09",
    "summary": "Lékařské potvrzení o vývoji kojence, absolvovaném očkování a vyjádření k vhodnosti cestování v době běžných onemocnění.",
    "legalTakeaway": "Lékařské zprávy jsou zásadním podkladem při posuzování zdravotních překážek péče a vyvracení účelových tvrzení o nemoci dítěte.",
    "content": """Nadpis stránky: Lékařské zhodnocení zdravotního stavu kojence

Stručné shrnutí situace:
Registrující dětský lékař vystavil zprávu o zdravotním stavu dítěte, absolvovaných prohlídkách a očkování. Zpráva obsahovala rovněž obecné doporučení ohledně režimu při běžných infekčních onemocněních.

Klíčové skutečnosti:
- Dítě vykazovalo odpovídající psychomotorický vývoj a dobrý zdravotní stav.
- Lékař potvrdil řádné plnění očkovacího kalendáře a preventivních prohlídek.
- V případě nemoci bylo doporučeno omezení náročného cestování a dodržování klidového režimu.
- Lékař zdůraznil potřebu součinnosti obou rodičů při podávání léků.

Procesní význam dokumentu:
Listina byla použita jako věcný důkaz o faktickém zdravotním stavu dítěte a limitech pro jeho transport.

Dopad na další průběh řízení:
Zpráva posloužila jako podklad pro úpravu pravidel péče v době nemoci dítěte."""
  },
  {
    "id": "doc-10",
    "pageNumber": 10,
    "title": "Vzdělávací studie č. 10: Vyjádření matky k podanému odvolání otce",
    "category": "soudni-usneseni",
    "categoryLabel": "Soudní usnesení & rozsudky",
    "issuingBody": "Matka",
    "targetBody": "Krajský soud",
    "dateStr": "v průběhu odvolacího řízení",
    "caseRef": "Případová studie 10",
    "summary": "Písemný přednes matky požadující potvrdit prvostupňový rozsudek a odmítající noční péči otce z důvodu věku dítěte a kojení.",
    "legalTakeaway": "Reakce druhého rodiče často opakuje tradiční argumentační schémata. Je nutné na ně reagovat věcnými důkazy o schopnosti zajistit péči.",
    "content": """Nadpis stránky: Stanovisko druhé strany k odvolacímu návrhu

Stručné shrnutí situace:
Matka prostřednictvím svého vyjádření navrhla odvolacímu soudu potvrzení prvostupňového rozhodnutí. Argumentovala nízkým věkem dítěte, fixací na matku a údajnou nevhodností nočního pobytu u otce.

Klíčové skutečnosti:
- Matka vyjádřila nesouhlas s rozšiřováním péče otce na noční hodiny.
- Dovolávala se potřeby stabilního prostředí v matčině domácnosti.
- Zpochybňovala otcovy časové možnosti s ohledem na jeho pracovní vytížení.
- Navrhovala zachování dosavadního rozsahu setkávání.

Procesní význam dokumentu:
Dokument vymezil sporné okruhy mezi účastníky pro odvolací přezkum.

Dopad na další průběh řízení:
Rozporné postoje rodičů vedly odvolací soud k detailnějšímu přezkoumání výchovných kapacit obou stran."""
  },
  {
    "id": "doc-11",
    "pageNumber": 11,
    "title": "Vzdělávací studie č. 11: Záznam o provedeném místním šetření OSPOD",
    "category": "ospod-meu",
    "categoryLabel": "Stížnosti & Odpovědi OSPOD / MěÚ",
    "issuingBody": "OSPOD",
    "targetBody": "Spisová dokumentace",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 11",
    "summary": "Úřední záznam z návštěvy sociálních pracovnic v obydlí otce prověřující bytové podmínky a vybavení pro kojence i staršího sourozence.",
    "legalTakeaway": "Místní šetření je klíčovou příležitostí prokázat vynikající zázemí pro dítě. Je vhodné mít připraveno veškeré vybavení i dětský pokoj.",
    "content": """Nadpis stránky: Zpráva z terénního šetření v domácnosti rodiče

Stručné shrnutí situace:
Pracovnice orgánu sociálně-právní ochrany vykonaly prověrku bytových poměrů v bydlišti otce. Záznam popisuje stav domácnosti, bezpečnostní prvky a kompletní vybavení určené pro péči o kojence i starší dítě.

Klíčové skutečnosti:
- Domácnost otce byla vyhodnocena jako prostorná, čistá a plně vybavená.
- Bylo ověřeno k dispozici samostatné lůžko pro kojence, hygienické potřeby i hračky.
- V záznamu byla potvrzena přítomnost zázemí pro staršího sourozence žijícího v péči otce.
- Nezjištěny žádné závady bránící řádnému výkonu rodičovské péče.

Procesní význam dokumentu:
Záznam slouží jako objektivní důkaz o materiálním a hygienickém zabezpečení péče v otcově obydlí.

Dopad na další průběh řízení:
Kladné zjištění z místního šetření vyvrátilo pochybnosti o otcových podmínkách pro přespávání dítěte."""
  },
  {
    "id": "doc-12",
    "pageNumber": 12,
    "title": "Vzdělávací studie č. 12: Návrh na výkon rozhodnutí pro opakované maření styku",
    "category": "soudni-podani",
    "categoryLabel": "Soudní podání otce",
    "issuingBody": "Otec",
    "targetBody": "Okresní soud (exekuční úsek)",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 12",
    "summary": "Podání návrhu na výkon rozhodnutí uložením pokuty z důvodu svévolného neprávem nepředání dítěte v určeném termínu.",
    "legalTakeaway": "Při maření vykonatelného titulu je nutné bezprodleně podat návrh na výkon rozhodnutí (exekuci styku), aby neukázněný rodič nespoléhal na beztrestnost.",
    "content": """Nadpis stránky: Návrh na výkon soudního rozhodnutí uložením pokuty

Stručné shrnutí situace:
Otec se obrátil na soud s návrhem na zahájení řízení o výkonu rozhodnutí. Důvodem bylo opakované a bezdůvodné nepředání dítěte matkou v termínech stanovených vykonatelným soudním výrokem.

Klíčové skutečnosti:
- Matka v určený den a čas neodovzdala dítě otci a neposkytla řádné odůvodnění.
- Otec doložil marné dostavení se na místo předání i záznamy komunikace.
- V návrhu bylo požadováno uložení výzvy k plnění a následně pokuty matce.
- Byla zdůrazněna potřeba vynucení respektu k soudním rozhodnutím.

Procesní význam dokumentu:
Návrh inicioval exekuční fázi opatrovnického řízení určenou k vynucení nepeněžité povinnosti.

Dopad na další průběh řízení:
Zahájení exekučního řízení vytvořilo právní tlak na druhého rodiče k dodržování stanoveného harmonogramu."""
  },
  {
    "id": "doc-13",
    "pageNumber": 13,
    "title": "Vzdělávací studie č. 13: Rozhodnutí o námitce podjatosti vůči soudci",
    "category": "soudni-usneseni",
    "categoryLabel": "Soudní usnesení & rozsudky",
    "issuingBody": "Nadřízený krajský soud",
    "targetBody": "Účastníci řízení",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 13",
    "summary": "Usnesení krajského soudu posuzující námitku podjatosti podanou proti prvostupňovému samosoudci pro procesní pochybení.",
    "legalTakeaway": "Námitka podjatosti musí být opřena o konkrétní fakta prokazující poměr k věci či účastníkům, nikoliv pouze o nesouhlas s právním názorem.",
    "content": """Nadpis stránky: Usnesení o posouzení námitky podjatosti

Stručné shrnutí situace:
Nadřízený soud rozhodoval o námitce podjatosti vznesené vůči samosoudci prvního stupně. Námitka byla odůvodněna jednostranným vedením jednání a odmítáním důkazních návrhů otce.

Klíčové skutečnosti:
- Účastník namítal subjektivní přístup soudce v průběhu dokazování.
- Nadřízený soud přezkoumal spisový materiál a vyjádření dotčeného sudího.
- Dospěl k závěru, že procesní postup sám o sobě zakládá důvod k odvolání, nikoli k vyloučení soudce.
- Námitka podjatosti byla shledána nedůvodnou.

Procesní význam dokumentu:
Rozhodnutí potvrdilo složení soudního senátu a usměrnilo námitky do odvolacího řízení.

Dopad na další průběh řízení:
Řízení pokračovalo u původního soudce s tím, že výhrady k procesnímu postupu byly uplatněny v odvolání."""
  },
  {
    "id": "doc-14",
    "pageNumber": 14,
    "title": "Vzdělávací studie č. 14: Stanovisko Veřejného ochránce práv (Ombudsmana)",
    "category": "mpsv-ombudsman",
    "categoryLabel": "Inspekce MPSV & Ombudsman",
    "issuingBody": "Kancelář Veřejného ochránce práv",
    "targetBody": "Otec",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 14",
    "summary": "Písemné vyrozumění Ombudsmana k podnětu na pochybení OSPOD při navrhování míst předávání a ignorování sourozeneckých vazeb.",
    "legalTakeaway": "Stanovisko Ombudsmana poskytuje cennou metodickou argumentaci o pochybeních orgánů státní správy, kterou lze využít před soudem.",
    "content": """Nadpis stránky: Hodnocení podnětu Kanceláří Veřejného ochránce práv

Stručné shrnutí situace:
Veřejný ochránce práv zaslal otci stanovisko k jeho podnětu na postup orgánu sociálně-právní ochrany dětí. Ombudsman se vyjádřil k problematice navrhování předávacích míst a povinnosti chránit sourozenecké vazby.

Klíčové skutečnosti:
- Ombudsman zdůraznil, že předávání dětí má probíhat v nediskriminačním a důstojném prostředí.
- Bylo poukázáno na nutnost zohledňovat vazby mezi všemi sourozenci v rodině.
- Kancelář doporučila metodické usměrnění postupu příslušného úřadu.
- Současně bylo vysvětleno omezení pravomoci Ombudsmana vůči nezávislému soudnímu rozhodování.

Procesní význam dokumentu:
Dokument představuje nezávislé odborné zhodnocení postupu orgánu veřejné moci použitelné jako podpůrný argument.

Dopad na další průběh řízení:
Závěry Ombudsmana posílily argumentaci otce v odvolacím řízení a vyvolaly tlak na změnu metodiky OSPOD."""
  },
  {
    "id": "doc-15",
    "pageNumber": 15,
    "title": "Vzdělávací studie č. 15: Rekapitulace neprávem zmařené péče a reakce na argument nemoci",
    "category": "zpravy-dokazy",
    "categoryLabel": "Důkazní konverzace & chaty",
    "issuingBody": "Otec",
    "targetBody": "Matka",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 15",
    "summary": "Písemná výzva reagující na nečekané zrušení péče z důvodu lehčí nemoci dítěte s nabídkou realizovat péči v místě bydliště matky.",
    "legalTakeaway": "Běžná nemoc dítěte není automatickým důvodem k zrušení styku. Nabídka péče v místě bydliště dítěte dokládá odpovědnost otce.",
    "content": """Nadpis stránky: Písemná výzva při překážkách na straně druhého rodiče

Stručné shrnutí situace:
Otec písemně reagoval na oznámení matky o onemocnění dítěte a zrušení plánované péče. Navrhl alternativní řešení spočívající v jeho příjezdu a péči o nemocné dítě přímo v místě jeho aktuálního pobytu.

Klíčové skutečnosti:
- Matka jednostranně zrušila termín péče s odkazem na zdravotní stav dítěte.
- Otec nabídl, že v zájmu dítěte vykoná péči bez jeho transportování v obydlí matky.
- Poukázal na platná ujednání, která s možností nemoci počítala.
- Matka návrh na přítomnost otce bez adekvátního odůvodnění odmítla.

Procesní význam dokumentu:
Komunikace prokazuje flexibilitu otce a účelovost překážek kladených druhou stranou.

Dopad na další průběh řízení:
Předložený záznam posloužil jako důkaz při posuzování důvodnosti podaného návrhu na výkon rozhodnutí."""
  },
  {
    "id": "doc-16",
    "pageNumber": 16,
    "title": "Vzdělávací studie č. 16: Odpověď MPSV na podnět k výkonu inspekce sociálních služeb",
    "category": "mpsv-ombudsman",
    "categoryLabel": "Inspekce MPSV & Ombudsman",
    "issuingBody": "Ministerstvo práce a sociálních věcí",
    "targetBody": "Otec",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 16",
    "summary": "Ministerstvo informuje o vyřízení podnětu týkajícího se standardů kvality sociálních služeb poskytovaných zapojenou neziskovou organizací.",
    "legalTakeaway": "Inspekce sociálních služeb ze strany MPSV je samostatný kanál k prověření, zda neziskové organizace neporušují princip neutrality.",
    "content": """Nadpis stránky: Vyrozumění ústředního orgánu o inspekčním podnětu

Stručné shrnutí situace:
Ministerstvo práce a sociálních věcí odpovídá na podnět otce k provedení inspekce sociálních služeb u organizace asistující matce. Ministerstvo objasňuje rozsah svých dohledových pravomocí.

Klíčové skutečnosti:
- Ministerstvo potvrdilo přijetí podnětu směřujícího proti postupu poskytovatele služeb.
- Vysvětlilo podmínky pro zahájení mimoplánované inspekce kvality sociálních služeb.
- Zdůraznilo povinnost poskytovatelů dodržovat základní lidská práva a věcnou neutralitu.
- Postoupilo relevantní poznatky k příslušnému odboru pro další sledování.

Procesní význam dokumentu:
Vyrozumění dokládá využití systémových kontrolních mechanismů vůči nestátním subjektům vstupujícím do sporu.

Dopad na další průběh řízení:
Probíhající komunikace s ministerstvem vedla poskytovatele služeb k obezřetnějšímu vystupování v dané kauze."""
  },
  {
    "id": "doc-17",
    "pageNumber": 17,
    "title": "Vzdělávací studie č. 17: Informování OSPOD o zmaření péče a podání exekučního návrhu",
    "category": "ospod-meu",
    "categoryLabel": "Stížnosti & Odpovědi OSPOD / MěÚ",
    "issuingBody": "Otec",
    "targetBody": "OSPOD",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 17",
    "summary": "Písemné vyrozumění opatrovníka o tom, že matka zmařila dohodnutou péči a otec byl nucen podat návrh na soudní výkon rozhodnutí.",
    "legalTakeaway": "OSPOD musí být bezodkladně písemně informován o každém zmaření péče a podaném exekučním návrhu, aby to promítl do spisu.",
    "content": """Nadpis stránky: Oznámení opatrovníkovi o zmaření péče a právních krocích

Stručné shrnutí situace:
Otec oficiálně vyrozuměl orgán sociálně-právní ochrany dětí o incidentu, při kterém matka zabránila výkonu péče. Oznámil současně, že v reakci na toto jednání podal okresnímu soudu návrh na výkon rozhodnutí.

Klíčové skutečnosti:
- Otec popsal průběh události, kdy mu bylo znemožněno převzít dítě.
- Poukázal na odmítnutí kompromisních variant péče v místě pobytu dítěte.
- Přiložil kopii podaného návrhu na výkon rozhodnutí pro evidenci ve spisu dětí.
- Požádal OSPOD o přijetí opatření k zamezení opakování podobných incidentů.

Procesní význam dokumentu:
Podání zajišťuje oficiální zaznamenání překážek v péči do spisu vedeného opatrovníkem.

Dopad na další průběh řízení:
Informování OSPOD zamezilo zkreslování informací o důvodech neuskutečnění péče a posílilo pozici otce."""
  },
  {
    "id": "doc-18",
    "pageNumber": 18,
    "title": "Vzdělávací studie č. 18: Urgentní doplnění odvolání s fotodokumentací nemoci a incidentu",
    "category": "soudni-podani",
    "categoryLabel": "Soudní podání otce",
    "issuingBody": "Otec",
    "targetBody": "Krajský soud",
    "dateStr": "v průběhu odvolacího řízení",
    "caseRef": "Případová studie 18",
    "summary": "Předložení fotografií horečky a neštovic kojence spolu s popisem incidentu, při kterém matka odebrala nemocné dítě z postýlky.",
    "legalTakeaway": "Přímé fotodůkazy a detailní časový popis incidentu neprůstřelně prokazují neodpovědný přístup k zdraví dítěte a neudržitelnost modelu.",
    "content": """Nadpis stránky: Urgentní doplnění odvolání s důkazním materiálem

Stručné shrnutí situace:
Otec zaslal odvolacímu soudu naléhavé doplnění odvolání obsahující fotodokumentaci průběhu dětského onemocnění a popis incidentu, při kterém matka za asistence třetích osob odebrala spící nemocné dítě s horečkou z otcova obydlí.

Klíčové skutečnosti:
- Byla přiložena fotodokumentace naměřené zvýšené teploty a kožního výsevu u kojence.
- Otec popsal neohleduplný postup matky, která prosadila transport nemocného dítěte.
- Bylo poukázáno na agresivní komunikaci a ignorování klidového režimu doporučeného pro zotavení.
- Návrh odvolání byl doplněn o požadavek na stanovení pravidla, že nemocné dítě zůstává u pečujícího rodiče.

Procesní význam dokumentu:
Doplnění přineslo odvolacímu soudu bezprostřední důkazy o selhávání operativní domluvy mezi rodiči.

Dopad na další průběh řízení:
Předložený materiál výrazně ovlivnil náhled odvolacího soudu na potřebu pevného a předvídatelného řádu péče."""
  },
  {
    "id": "doc-19",
    "pageNumber": 19,
    "title": "Vzdělávací studie č. 19: Doplnění oznámení pro OSPOD a soud s časovou analýzou doručení",
    "category": "ospod-meu",
    "categoryLabel": "Stížnosti & Odpovědi OSPOD / MěÚ",
    "issuingBody": "Otec",
    "targetBody": "OSPOD / Soud",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 19",
    "summary": "Rozbor právního stavu prokazující, že v době odebrání dítěte matka nedisponovala doručeným vykonatelným titulem, neboť rozsudek byl vypraven až odpoledne.",
    "legalTakeaway": "Přesná časová sekvence doručení přes Datovou schránku dokazuje protiprávnost svémocného jednání bez vykonatelného titulu.",
    "content": """Nadpis stránky: Právní rozbor časového průběhu doručování a svémocného jednání

Stručné shrnutí situace:
Otec předložil soudu a opatrovníkovi detailní rozbor doručování rozsudku. Prokáza, že v dopoledních hodinách, kdy matka odebrala dítě, nebyl nový rozsudek ještě vypraven ani doručen, tudíž platil předchozí dohodnutý režim.

Klíčové skutečnosti:
- Oficiální vypravení nového rozhodnutí proběhlo až v odpoledních hodinách dotyčného dne.
- V době dopoledního incidentu byla pro obě strany plně závazná předchozí procesní dohoda.
- Matka postupovala bez vykonatelného titulu a dopustila se svémocného odebrání dítěte.
- Otec zachoval klid a nepoužil fyzickou sílu výhradně s ohledem na zdraví kojence.

Procesní význam dokumentu:
Podání vyvrátilo tvrzení druhé strany o oprávněnosti postupu a poukázalo na porušení právních předpisů.

Dopad na další průběh řízení:
Časová analýza přiměla orgány zabývat se nezákonností svévolných zásahů do péče bez doručeného titulu."""
  },
  {
    "id": "doc-20",
    "pageNumber": 20,
    "title": "Vzdělávací studie č. 20: Odpověď tajemníka městského úřadu na stížnost dle § 175 správního řádu",
    "category": "ospod-meu",
    "categoryLabel": "Stížnosti & Odpovědi OSPOD / MěÚ",
    "issuingBody": "Vedení městského úřadu",
    "targetBody": "Otec",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 20",
    "summary": "Rozhodnutí vedení radnice odmítající stížnost na OSPOD a obhajující postup sociálních pracovnic jako odpovídající zájmům dítěte.",
    "legalTakeaway": "Odmítnutí stížnosti vedením úřadu je běžný mezikrok. Tím se však otevírá cesta k podání podnětu Krajskému úřadu a Ombudsmanovi.",
    "content": """Nadpis stránky: Vyřízení stížnosti vedením městského úřadu

Stručné shrnutí situace:
Tajemník městského úřadu zaslal otci oficiální vyrozumění o vyřízení stížnosti na postup OSPOD. Vedení úřadu dospělo k závěru, že pracovnice nepochybily a postupovaly v souladu s právními předpisy.

Klíčové skutečnosti:
- Úřad vyhodnotil stížnost na podjatost a neobjektivitu jako nedůvodnou.
- Návrh na předávání v místech hromadné dopravy byl označen za příklad neutrálního místa.
- Hodnocení sourozeneckých vazeb bylo přenecháno na uvážení opatrovníka a soudu.
- Vedení úřadu potvrdilo správnost dosavadního vedení spisové dokumentace.

Procesní význam dokumentu:
Tento akt představuje vyčerpání prvního stupně správních opravných prostředků v rámci přezkumu postupu úřadu.

Dopad na další průběh řízení:
Zamítavé stanovisko umožnilo otci postoupit věc k vyšším kontrolním instancím (krajský úřad, ministerstvo, Ombudsman)."""
  },
  {
    "id": "doc-21",
    "pageNumber": 21,
    "title": "Vzdělávací studie č. 21: Vyřízení stížnosti vedením neziskové organizace",
    "category": "charita-sluzby",
    "categoryLabel": "Charita & sociální služby",
    "issuingBody": "Vedení sociální služby",
    "targetBody": "Otec",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 21",
    "summary": "Stanovisko ředitelky sociální služby odmítající požadavky otce na změnu pracovnice a zpřístupnění kompletní dokumentace s odkazem na mlčenlivost.",
    "legalTakeaway": "Neziskové organizace sjednané jedním rodičem často argumentují mlčenlivostí vůči druhému rodiči. Je nutné vyžadovat dodržování právních předpisů.",
    "content": """Nadpis stránky: Reakce poskytovatele sociální služby na stížnost rodiče

Stručné shrnutí situace:
Ředitelka neziskové organizace zaslala vyjádření ke stížnosti otce na postup klíčové pracovnice. Organizace odmítla provedení změny personálu i zpřístupnění interní složky s odkazem na ochranu osobních údajů klientky.

Klíčové skutečnosti:
- Organizace uvedla, že jejím primárním klientem je matka, nikoliv otec či dítě.
- Odmítnutí neformální komunikace bylo zdůvodněno profesionálními standardy.
- Požadavek na výměnu pracovnice byl zamítnut s ohledem na přání matky.
- Otci byl poskytnut pouze obecný výpis týkající se dítěte.

Procesní význam dokumentu:
Dokument vymezuje hranice součinnosti poskytovatele sociální služby s druhým rodičem.

Dopad na další průběh řízení:
Postoj organizace vedl otce k podání podnětu k inspekci sociálních služeb na Ministerstvo práce a sociálních věcí."""
  },
  {
    "id": "doc-22",
    "pageNumber": 22,
    "title": "Vzdělávací studie č. 22: Doložení oficiální doručenky z Datové schránky inspekci MPSV",
    "category": "mpsv-ombudsman",
    "categoryLabel": "Inspekce MPSV & Ombudsman",
    "issuingBody": "Otec",
    "targetBody": "Ministerstvo práce a sociálních věcí",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 22",
    "summary": "Doplnění podnětu pro ministerstvo obsahující oficiální doručenku s přesným časem doručení rozsudku do Datové schránky (13:21 hod.).",
    "legalTakeaway": "Oficiální výpis doručenky z Datové schránky je nezpochybnitelný veřejnoprávní důkaz o přesném okamžiku vzniku právních účinků doručení.",
    "content": """Nadpis stránky: Doložení časového razítka doručení z Datové schránky

Stručné shrnutí situace:
Otec předložil inspekci ministerstva oficiální doručenku z Datové schránky prokazující, že rozsudek mu byl doručen v odpoledních hodinách. Tím jednoznačně doložil, že dopolední zásah v jeho obydlí proběhl bez existujícího vykonatelného titulu.

Klíčové skutečnosti:
- Doručenka potvrdila přesný čas doručení rozhodnutí do elektronické schránky otce.
- Časový údaj nevyvratitelně dokázal, že v době ranního odvozu dítěte nebylo rozhodnutí účinné.
- Asistence terénní pracovnice při odebrání dítěte tak proběhla bez právního základu.
- Otec požádal inspekční orgán o zohlednění této skutečnosti při prověřování kvality služby.

Procesní význam dokumentu:
Listina představuje nezpochybnitelný veřejnoprávní důkaz o časové posloupnosti procesních úkonů.

Dopad na další průběh řízení:
Důkaz významně posílil pozici otce při posuzování nezákonnosti svémocného postupu při odebrání dítěte."""
  },
  {
    "id": "doc-23",
    "pageNumber": 23,
    "title": "Vzdělávací studie č. 23: Vyrozumění o zápisu doložky provedení exekuce",
    "category": "soudni-usneseni",
    "categoryLabel": "Soudní usnesení & rozsudky",
    "issuingBody": "Exekuční úřad",
    "targetBody": "Účastníci a bankovní ústavy",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 23",
    "summary": "Informace soudního exekutora o doručení exekučního titulu a zapsání doložky do rejstříku pro vymožení pohledávky.",
    "legalTakeaway": "Využití exekučního řízení je standardní právní cestou k vymožení stanovených povinností a finančních nároků spojených s péčí a náklady.",
    "content": """Nadpis stránky: Vyrozumění o zahájení exekučního úkonu

Stručné shrnutí situace:
Soudní exekutor vyrozuměl účastníky o zápisu doložky provedení exekuce na základě vykonatelného exekučního titulu. Exekuce byla nařízena k vymožení stanovených povinností a souvisejících nákladů.

Klíčové skutečnosti:
- Exekuční titul se stal právním základem pro zahájení nuceného výkonu.
- Doložka provedení exekuce byla řádně zapsána do příslušného veřejného rejstříku.
- Byla nařízena příslušná exekuční opatření k zajištění plnění povinnosti.
- Účastníci byli poučeni o možnostech dobrovolného plnění a způsobu úhrady.

Procesní význam dokumentu:
Vyrozumění dokládá přechod vymáhání právní povinnosti do fáze nuceného výkonu.

Dopad na další průběh řízení:
Právní kroky exekutora vedly k zajištění respektování stanovených povinností pod hrozbou majetkového postihu."""
  },
  {
    "id": "doc-24",
    "pageNumber": 24,
    "title": "Vzdělávací studie č. 24: Systémový podnět Stálé komisi pro rodinu Poslanecké sněmovny PČR",
    "category": "mpsv-ombudsman",
    "categoryLabel": "Inspekce MPSV & Ombudsman",
    "issuingBody": "Otec",
    "targetBody": "Poslanecká sněmovna PČR",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 24",
    "summary": "Systémový rozbor předložený zákonodárcům ukazující na selhávání OSPODů při ochraně rovnoprávného rodičovství a ignorování sourozeneckých vazeb.",
    "legalTakeaway": "Systémová podání parlamentním výborům pomáhají vytvářet veřejný a legislativní tlak na reformu opatrovnického soudnictví.",
    "content": """Nadpis stránky: Systémový rozbor fungování opatrovnických orgánů pro parlamentní komisi

Stručné shrnutí situace:
Otec předložil Stálé komisi pro rodinu Poslanecké sněmovny podrobný rozbor systémových pochybení v opatrovnické praxi. Na konkrétních příkladech poukázal na uplatňování zastaralých stereotypů a selhávání dohledu.

Klíčové skutečnosti:
- Byla popsána praxe ignorování sourozeneckých vazeb mezi dětskými sourozenci.
- Podnět kritizoval navrhování nelogických míst předávání dětí v prostorech veřejné dopravy.
- Bylo poukázáno na nedostatečnost kontrolních mechanismů nad rozhodováním OSPOD.
- Otec navrhl legislativní a metodické změny pro posílení principu rovného rodičovství.

Procesní význam dokumentu:
Podání představuje využití petičního práva k vyvolání diskuse o systémové reformě opatrovnické péče.

Dopad na další průběh řízení:
Projednání podnětu přispělo k širšímu povědomí o odborné problematice péče o kojence a metodických pochybeních."""
  },
  {
    "id": "doc-25",
    "pageNumber": 25,
    "title": "Vzdělávací studie č. 25: Podrobné doplnění námitek u soudu s hodinovou analýzou péče",
    "category": "soudni-podani",
    "categoryLabel": "Soudní podání otce",
    "issuingBody": "Otec",
    "targetBody": "Okresní soud",
    "dateStr": "v průběhu řízení",
    "caseRef": "Případová studie 25",
    "summary": "Matematický rozbor prokazující rozdíl mezi deklarovaným počtem dnů v rozsudku a reálnou hodinovou dotací péče necelých 29 hodin týdně.",
    "legalTakeaway": "Přepočet časové dotace péče na reálné hodiny jednoznačně odkrývá matematický klam usnesení deklarujících rovnocennou péči.",
    "content": """Nadpis stránky: Matematicko-analytický rozbor časové dotace péče

Stručné shrnutí situace:
Otec předložil soudu podrobnou hodinovou analýzu vymezující reálný čas péče. Prokáza, že deklarovaných 12 dnů péče v měsíci představuje v přepočtu na čisté hodiny pouhých necelých 29 hodin týdně bez nočního pobytu.

Klíčové skutečnosti:
- Rozbor odhalil nesrovnalost mezi slovním popisem rozhodnutí a faktickou hodinovou dotací.
- Otec doložil, že stanovený režim nepokrývá ani polohu rovnocenného rozdělení péče.
- Znovu zdůraznil opomenutí sourozenecké vazby se starším bratrem trvale žijícím u otce.
- Byla navržena znalecká expertiza k posouzení výchovných kapacit a dopadů fragmentovaného režimu.

Procesní význam dokumentu:
Podání představovalo klíčový analytický důkaz vyvracející zdání rovnocenného uspořádání péče.

Dopad na další průběh řízení:
Matematický rozbor výrazně zpochybnil argumentaci prvostupňového rozhodnutí a posloužil jako podklad pro odvolací soud."""
  }
]

ts_code = '/**\n * @license\n * SPDX-License-Identifier: Apache-2.0\n */\n\nexport interface AnonymizedDocument {\n  id: string;\n  pageNumber: number; // 1 to 25 ("Jeden dokument jedna stránka")\n  title: string;\n  category: \'soudni-podani\' | \'soudni-usneseni\' | \'ospod-meu\' | \'mpsv-ombudsman\' | \'charita-sluzby\' | \'zpravy-dokazy\';\n  categoryLabel: string;\n  issuingBody: string;\n  targetBody: string;\n  dateStr: string;\n  caseRef: string;\n  summary: string;\n  legalTakeaway: string;\n  content: string;\n}\n\nexport const MY_ANONYMIZED_DOCUMENTS: AnonymizedDocument[] = '

ts_code += json.dumps(transformed_docs, ensure_ascii=False, indent=2) + ';\n'

with open('src/data/myAnonymizedDocuments.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("Updated myAnonymizedDocuments.ts successfully!")
