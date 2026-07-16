/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DictionaryTerm {
  id: string; // unique lowercase key
  term: string; // original English or Latin term
  czechTranslation: string; // Czech equivalent
  shortDefinition: string; // A one-sentence definition
  definition: string; // Detailed description of the term
  importanceInCourt: string; // Practical importance in custody disputes (Jak to uplatnit u soudu)
  context: string; // Example context / studies where this is mentioned (Např. Warshak 2014, Fabricius 2016)
}

export const DICTIONARY_TERMS: Record<string, DictionaryTerm> = {
  attachment: {
    id: "attachment",
    term: "Attachment",
    czechTranslation: "Citová vazba / emociální pouto",
    shortDefinition: "Hluboké, trvalé citové pouto, které si dítě vytváří ke svým pečovatelům, poskytující mu pocit bezpečí a jistoty.",
    definition: "Attachment (teorie citové vazby) je základní koncept moderní vývojové psychologie. Popisuje, jakým způsobem si kojenci a batolata vytvářejí emocionální vazby k lidem, kteří o ně pečují. Bezpečný attachment (secure attachment) je klíčový pro zdravý psychický, sociální a kognitivní vývoj dítěte. Dítě, které má bezpečný attachment, vnímá své rodiče jako 'bezpečný přístav' (secure base), ze kterého může objevovat svět a ke kterému se vrací v případě strachu, únavy nebo nepohody.",
    importanceInCourt: "Matky u soudů často tvrdí, že dítě je fixované pouze na ně (tzv. exkluzivní vazba) a přespávání u otce by citovou vazbu narušilo. Moderní výzkum citové vazby (včetně rozsáhlých studií) toto tvrzení zcela vyvrací. Prokazuje, že dítě si vytváří vazby k oběma rodičům paralelně. Poukazování na nutnost rozvoje attachmentu k otci prostřednictvím noční péče je silným argumentem pro střídavou péči.",
    context: "Základní pilíř studií prof. Richarda A. Warshaka (2014) a prof. Williama Fabriciuse (2016). V českém právním prostředí se o teorii citové vazby opírá judikatura Ústavního soudu ČR."
  },
  monotropy: {
    id: "monotropy",
    term: "Monotropy / Monotropie",
    czechTranslation: "Teorie jednoho výhradního pečovatele",
    shortDefinition: "Zastaralá a překonaná domněnka, že dítě je v raném věku biologicky naprogramováno se citově vázat pouze k jediné osobě (zpravidla matce).",
    definition: "Monotropie je koncept, který v 50. letech 20. století zavedl John Bowlby. Tvrdil, že kojenci mají vrozenou potřebu se vázat k jedné primární postavě a teprve po vybudování této vazby si mohou vytvářet sekundární vazby (např. k otci). Tento koncept dominoval rodinnému právu v 20. století (vedl k tzv. doktríně útlého věku, kdy se děti automaticky svěřovaly matkám). Moderní psychologie i sám Bowlby v pozdní fázi své kariéry však tento koncept opustili jako vědecky neobhájený.",
    importanceInCourt: "OSPOD a soudní znalci staré školy stále skrytě monotropii uplatňují, když tvrdí, že 'dítě je příliš malé na to, aby bylo bez matky'. Argumentace vyvrácením monotropie (odkazem na Warshaka 2014) ukazuje, že tito pracovníci pracují s neaktuálními, 70 let starými dogmaty, což snižuje věrohodnost jejich posudků.",
    context: "Warshak (2014) detailně popisuje historii monotropie a uvádí mezinárodní vědecký konsenzus, který ji jednoznačně odmítá."
  },
  "respite-effect": {
    id: "respite-effect",
    term: "Respite Effect",
    czechTranslation: "Úlevový efekt pro rezidentního rodiče",
    shortDefinition: "Pozitivní psychologický dopad na matku, která si díky střídavému nocování dítěte u otce může odpočinout od nepřetržité péče.",
    definition: "Respite effect (úlevový efekt) popisuje jev, kdy sdílení noční péče s otcem poskytuje matce (jako primárnímu pečovateli) nezbytný čas na odpočinek, regeneraci, spánek a budování vlastní kariéry nebo osobního života. Nepřetržitá péče o kojence či batole bez pomoci je pro jednoho rodiče extrémně vyčerpávající a vede k syndromu vyhoření. Když otec přebírá noční péči, matka získává prostor pro oddech, což paradoxně výrazně zlepšuje kvalitu jejího následného vztahu s dítětem, protože je klidnější, trpělivější a emočně dostupnější.",
    importanceInCourt: "Soudy často střídavou péči zamítají s tím, že matka je proti a střídání by ji stresovalo. Poukázáním na vědecky prokázaný 'respite effect' můžete soudce přesvědčit, že střídavá péče je v konečném důsledku prospěšná i pro samotnou matku, protože snižuje její rodičovské zatížení a vyhoření.",
    context: "Prokázáno v empirické studii Fabricius & Suh (2016), kde děti s raným přespáváním u otce vykazovaly skvělé vztahy s matkami právě díky tomuto efektu."
  },
  "shared-parenting": {
    id: "shared-parenting",
    term: "Shared Parenting",
    czechTranslation: "Střídavá péče / sdílené rodičovství",
    shortDefinition: "Uspořádání péče po rozchodu rodičů, kdy oba rodiče sdílejí výchovu, odpovědnost a čas s dítětem v relativně vyváženém poměru.",
    definition: "Shared parenting (sdílená nebo střídavá péče) je definována jako uspořádání, ve kterém dítě tráví v péči každého z rodičů nejméně 35 % až 50 % času (což odpovídá minimálně 5 až 7 nocem ze 14). Tento model zaručuje, že dítě neztratí každodenní kontakt ani s jedním z rodičů a oba rodiče se aktivně podílejí na všech aspektech jeho života (škola, lékaři, kroužky, rituály všedního dne).",
    importanceInCourt: "V České republice je střídavá péče prioritním modelem podle nálezů Ústavního soudu, pokud jsou oba rodiče kompetentní. Odkazy na mezinárodní výzkum 'shared parenting' pomáhají překonávat lokální předsudky soudců prvních stupňů.",
    context: "Předmět stovek mezinárodních studií (např. Bauserman 2002, Nielsen 2013, Warshak 2014)."
  },
  "sole-custody": {
    id: "sole-custody",
    term: "Sole Custody",
    czechTranslation: "Výlučná péče jednoho rodiče",
    shortDefinition: "Svěření dítěte do výhradní péče jednoho z rodičů (zpravidla matky) s omezeným, pouze návštěvním stykem pro druhého rodiče.",
    definition: "Sole custody (výlučná péče) je uspořádání, kde jeden rodič drží plnou faktickou i právní kontrolu nad každodenním životem dítěte, zatímco druhý rodič je degradován do role pouhého 'víkendového návštěvníka' (např. klasický styk jednou za 14 dní od pátku do neděle). Výzkumy ukazují, že toto uspořádání je pro dlouhodobý vývoj dítěte rizikové, protože vede k postupnému odcizení nerezidentního rodiče.",
    importanceInCourt: "Je nutné u soudu argumentovat, že výlučná péče (sole custody) s asymetrickým stykem vystavuje vztah dítěte a otce vážnému riziku degradace a že tradiční model 'každý druhý víkend' je z hlediska moderní psychologie přežitý a škodlivý.",
    context: "Kritizováno v meta-analýze Roberta Bausermana (2002), která prokázala lepší psychické zdraví dětí ve střídavé péči."
  },
  gatekeeping: {
    id: "gatekeeping",
    term: "Gatekeeping",
    czechTranslation: "Bránění v přístupu k dítěti / 'strážení brány'",
    shortDefinition: "Chování jednoho z rodičů (častěji matky), který se staví do role výhradního strážce dítěte a omezuje či kontroluje přístup druhého rodiče.",
    definition: "Maternal Gatekeeping (mateřské strážení brány) je psychologický jev, kdy matka vědomě či nevědomě reguluje, omezuje, kritizuje nebo zcela blokuje zapojení otce do péče o dítě. Může mít podobu 'restriktivního gatekeepingu' (aktivní bránění kontaktu, očerňování otce, zpochybňování jeho kompetencí) nebo 'paternalistického gatekeepingu' (povolování styku jen pod přísným dohledem matky za jejích podmínek).",
    importanceInCourt: "Pokud matka u soudu tvrdí, že otec o dítě nemá zájem nebo neumí pečovat, přičemž mu sama aktivně brání v péči (např. odmítá dát dítě na noc), jedná se o klasický restriktivní gatekeeping. Soudy by měly toto chování identifikovat a zohlednit jako nedostatek výchovné tolerance matky.",
    context: "Detailně zkoumáno v pracích Austin, Fieldstone & Pruett (2013) a Pruett et al. (2012)."
  },
  "alienating-behavior": {
    id: "alienating-behavior",
    term: "Alienating Behavior",
    czechTranslation: "Odcizující chování / popouzení proti rodiči",
    shortDefinition: "Chování zaměřené na systematické poškozování a ničení citového vztahu dítěte k druhému rodiči.",
    definition: "Alienating behavior (odcizující chování) zahrnuje širokou škálu manipulačních technik, kterými jeden rodič (rezidentní) vštěpuje dítěti negativní postoj k druhému rodiči. Patří sem bezdůvodné obviňování druhého rodiče, vyvolávání pocitu viny v dítěti, pokud se s druhým rodičem baví, zatajování informací o škole či zdraví, až po aktivní lhaní a budování falešných vzpomínek na zneužívání či násilí.",
    importanceInCourt: "Pokud dítě u soudu odmítá otce a používá k tomu dospělé formulace (tzv. syndrom odcizeného rodiče), soud by měl okamžitě nařídit znalecké zkoumání zaměřené na odcizující chování matky, neboť se jedná o psychické týrání dítěte, které vyžaduje rychlý zásah (např. změnu výchovného prostředí).",
    context: "Zkoumáno v pracích Zill, Morrison & Coiro (1993) a v klasických studiích o syndromu odcizení rodiče (PAS)."
  },
  "dose-response": {
    id: "dose-response",
    term: "Dose-Response Effect",
    czechTranslation: "Efekt závislosti účinku na dávce",
    shortDefinition: "Vědecký poznatek, že kvalita budoucího vztahu dítěte k otci přímo úměrně roste s množstvím času a nocí, které s ním stráví v dětství.",
    definition: "V medicíně tento pojem vyjadřuje, že vyšší dávka léku přináší silnější účinek. Ve vývojové psychologii (Fabricius & Suh, 2016) tento efekt popisuje, že každá noc strávená u otce v raném dětství navíc (v intervalu od 0 do 7 nocí ve 14denním cyklu) přímo úměrně zvyšuje kvalitu a bezpečnost citové vazby k otci v dospělosti. Vztah nevznikne 'sám od sebe' – vyžaduje reálný čas strávený společně.",
    importanceInCourt: "Soudci a OSPOD často tvrdí, že pro udržení vztahu s tátou stačí 'pár hodin odpoledne'. Dose-response effect exaktně dokazuje, že denní návštěvy mají na budoucí kvalitu vztahu téměř nulový vliv a vztah lineárně roste pouze s počtem společných nocí.",
    context: "Klíčový objev publikovaný ve studii Fabricius & Suh (2016) v časopise Psychology, Public Policy, and Law."
  },
  "strange-situation": {
    id: "strange-situation",
    term: "Strange Situation",
    czechTranslation: "Neznámá situace (laboratorní test)",
    shortDefinition: "Standardizovaný vědecký experiment navržený Mary Ainsworthovou k měření kvality citové vazby (attachmentu) mezi dítětem a rodičem.",
    definition: "Strange Situation (Neznámá situace) je zlatým standardem ve vývojové psychologii pro hodnocení typu attachmentu u dětí ve věku 12 až 20 měsíců. Jedná se o 20minutový laboratorní protokol, při kterém je dítě vystaveno sérii mírně stresujících situací (příchod cizí osoby, odchod rodiče, setrvání o samotě, návrat rodiče). Na základě reakcí dítěte při shledání s rodičem se určuje, zda je vazba bezpečná, úzkostná, vyhýbavá nebo dezorganizovaná.",
    importanceInCourt: "Odpůrci přespávání u otců zneužívají modifikované domácí verze tohoto testu k tvrzení, že přespávající děti mají narušenou vazbu k matce. Je nutné u soudu uvést, že pouze standardizovaný laboratorní test Strange Situation realizovaný certifikovanými odborníky (nikoliv matkou vyplněný dotazník) je vědecky validní.",
    context: "Solomon & George (1999) použili tento test u 16měsíčních dětí a nezjistili žádný rozdíl v distribuci bezpečného attachmentu mezi dětmi s noclehy u otců a bez nich."
  },
  pbi: {
    id: "pbi",
    term: "PBI (Parental Bonding Instrument)",
    czechTranslation: "Dotazník rodičovského pouta",
    shortDefinition: "Široce uznávaný psychometrický dotazník měřící vnímání rodičovské péče, vřelosti a kontroly z pohledu dětí.",
    definition: "PBI (Parental Bonding Instrument), vyvinutý Gordonem Parkerem v roce 1989, je vědecky vysoce validní nástroj určený k retrospektivnímu hodnocení rodičovského chování dětmi. Měří dvě hlavní dimenze: 'Péči' (Care – vřelost, porozumění, náklonnost vs. chlad a odmítání) a 'Ochránitelskou kontrolu' (Overprotection – podpora autonomie vs. rigidní kontrola, omezování a zasahování do soukromí).",
    importanceInCourt: "Výsledky PBI prokazují, že dospělí lidé, kteří jako miminka přespávali u otců, vykazují v tomto dotazníku extrémně vysoké skóre otcovské i mateřské péče, což dokazuje dlouhodobou stabilitu a prospěšnost raného přespávání u obou rodičů.",
    context: "Hlavní psychometrický nástroj použitý ve studii Fabricius & Suh (2016) k hodnocení kvality vztahů."
  },
  cbcl: {
    id: "cbcl",
    term: "CBCL (Child Behavior Checklist)",
    czechTranslation: "Škála chování dítěte",
    shortDefinition: "Standardizovaný diagnostický dotazník vyplňovaný rodiči k identifikaci poruch chování a emočních problémů u dětí.",
    definition: "CBCL (Child Behavior Checklist), vyvinutý Achenbachem, je celosvětově nejrozšířenější nástroj pro hodnocení emočních a behaviorálních problémů u dětí. Sleduje interní potíže (úzkost, deprese, somatické stížnosti, uzavřenost) i externí potíže (agresivita, porušování pravidel, hyperaktivita).",
    importanceInCourt: "Studie Pruett et al. (2004) s využitím CBCL prokázala, že děti ve věku 2 až 3 let, které zažívaly přespávání u otců, vykazovaly 15 až 18 měsíců po rozchodu rodičů významně MÉNĚ sociálních problémů než děti bez noclehů.",
    context: "Využito ve výzkumech Pruett et al. (2004), McIntoshové (2010) i Tornelloové (2013)."
  },
  aqs: {
    id: "aqs",
    term: "AQS (Attachment Q-set)",
    czechTranslation: "Měření citové vazby metodou Q-sort",
    shortDefinition: "Metodika hodnocení chování dítěte v přirozeném prostředí určená pro vyškolené pozorovatele k určení míry bezpečí citové vazby.",
    definition: "AQS (Attachment Q-set), vyvinutý Everettem Watersem (1995), obsahuje 90 karet popisujících chování dítěte v interakci s rodičem. Vyškolený, nezávislý pozorovatel stráví s rodinou několik hodin doma a následně roztřídí karty podle toho, jak moc popisují chování dítěte. Výsledkem je exaktní index bezpečí citové vazby.",
    importanceInCourt: "Pokud protistrana operuje posudkem o špatné vazbě k otci, který byl vyhotoven pouze na základě krátkého rozhovoru v ordinaci, argumentujte, že mezinárodně uznávaná metodika AQS vyžaduje dlouhodobé pozorování doma, a lokální subjektivní dojmy znalce nemají vědeckou váhu.",
    context: "Zlatý standard hodnocení citové vazby v domácím prostředí, popsaný ve studii Van IJzendoorn et al. (2004)."
  },
  taq: {
    id: "taq",
    term: "TAQ (Toddler Attachment Q-sort)",
    czechTranslation: "Zkrácený dotazník citové vazby pro batolata",
    shortDefinition: "Zjednodušená verze AQS, kterou v některých studiích vyplňovaly samy matky namísto certifikovaných pozorovatelů.",
    definition: "TAQ je upravená, zkrácená verze nástroje AQS. Aby se ušetřily finanční prostředky, v některých sociologických výzkumech (např. Fragile Families) byl tento dotazník předložen matkám k samovyplnění. Vědecká komunita se shoduje, že tato metoda postrádá validitu, protože matky mají tendenci zkreslovat odpovědi na základě svých vlastních předsudků o otci a svého emociálního stavu.",
    importanceInCourt: "Studie Tornelloové (2013), která tvrdila zvýšenou nejistotu dětí při přespávání u otců, stála výhradně na nevalidním dotazníku TAQ vyplňovaném matkami. Poukazování na tento metodický podvod u soudu oslabuje argumentaci odpůrců střídavé péče.",
    context: "Kritizováno ve studiích Pudasainee-Kapri & Razza (2013) a Van IJzendoorn et al. (2004)."
  },
  ospod: {
    id: "ospod",
    term: "OSPOD",
    czechTranslation: "Orgán sociálně-právní ochrany dětí",
    shortDefinition: "Státní úřad v České republice pověřený ochranou zájmů nezletilých dětí, vystupující u soudu jako kolizní opatrovník.",
    definition: "OSPOD (v hovorové mluvě 'sociálka') je klíčový orgán v opatrovnickém řízení. Jeho úkolem je nestranně hájit nejlepší zájem dítěte. V praxi však často podléhá personálním předsudkům, alibismu a syndromu vyhoření. Sociální pracovnice mívají tendenci jít cestou nejmenšího odporu (přiklonit se na stranu matky a odmítat střídavou péči u menších dětí s odkazem na neexistující psychologická rizika).",
    importanceInCourt: "OSPOD má u soudu vážné slovo, ale jeho doporučení NENÍ pro soudce závazné. Pokud OSPOD doporučí výlučnou péči matky s nefunkčním stykem pro otce, musíte předložit věcné protidůkazy (studie Warshak, Fabricius, judikaturu ÚS) a prokázat, že doporučení OSPODu odporuje vědeckému poznání i právnímu řádu.",
    context: "Základní protihráč i spojenec v českých opatrovnických sporech. Metodické postupy OSPODu jsou často kritizovány veřejným ochráncem práv (ombudsmanem)."
  },
  rbac: {
    id: "rbac",
    term: "RBAC (Role-Based Access Control)",
    czechTranslation: "Řízení přístupu na základě rolí",
    shortDefinition: "Bezpečnostní architektura správy uživatelských oprávnění v systému, kde jsou práva přidělována specifickým rolím (např. Admin, Registrovaný rodič, Anonymní návštěvník).",
    definition: "RBAC je průmyslový standard v oblasti bezpečnosti IT a systémového designu. Zaručuje, že uživatelé mají přístup pouze k těm funkcím a datům, které jsou nezbytné pro výkon jejich role. V ekosystému Synthesis OS / Synthesis Hub zajišťuje ochranu citlivých osobních údajů rodičů, spisových materiálů, příběhů a osobních dat před neoprávněným přístupem.",
    importanceInCourt: "V rámci právní ochrany dat a bezpečnosti rodinných informací je nutné, aby portál vykazoval stoprocentní zabezpečení (např. v souladu s GDPR). RBAC je důkazem profesionální technické architektury Synthesis OS.",
    context: "Technická specifikace zabezpečení backendu v administraci portálu Synthesis Hub."
  },
  "api-first": {
    id: "api-first",
    term: "API-First Approach",
    czechTranslation: "Prioritní návrh rozhraní (API-first)",
    shortDefinition: "Architektonická strategie vývoje, kdy je celý systém nejprve navržen jako sada nezávislých rozhraní (API) umožňujících budoucí plně automatickou a autonomní správu prostřednictvím umělé inteligence (AI Admin).",
    definition: "API-first přístup znamená, že webové rozhraní (UI) je pouze jedním z mnoha možných klientů. Pod ním leží robustní, plně zdokumentovaná a bezpečná vrstva API endpointů. Tato architektura umožňuje, aby v budoucnu mohl celý systém 'Synthesis OS' komunikovat s externími AI agenty, kteří budou moci autonomně publikovat články, analyzovat rozsudky, odpovídat v diskuzích nebo automaticky doručovat podání na soudy.",
    importanceInCourt: "Představuje klíčový pilíř autonomní správy Synthesis OS. Zabezpečené API endpointy chráněné RBAC umožňují lokální AI pracovat s databází judikátů a vzorů bez nutnosti lidského klikání.",
    context: "Základní filozofie a operační rámec architekta systému Synthesis OS."
  }
};
