/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesis OS - Initial Seed Legal Documents with Versioning & Hashes
 * Updated to Release Alpha 0.5.1 with complete operator identification, AI liability disclaimers,
 * GDPR compliance, escalation protection, and all 8 mandatory legal frameworks.
 */

import { LegalDocument } from '../types/legal';

export const INITIAL_LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'doc-terms-v1.0',
    slug: 'terms-of-service',
    title: 'Podmínky užívání portálu (Terms of Service) - Release Alpha 0.5.1',
    category: 'terms',
    version: '1.0',
    language: 'cs',
    effectiveFrom: '2026-08-01T00:00:00.000Z',
    createdAt: '2026-08-01T00:00:00.000Z',
    createdBy: 'Jiří Šár & Právní tým Synthesis OS',
    sha256Hash: 'a8f5c71b3e94200192e8d31a5c2d491f08e72381b92019a3d42c8d5e1b2f0a1c',
    isActive: true,
    isRequired: true,
    changelog: 'Aplikace právních a technických úprav Alpha 0.5.1: Identifikace provozovatele, omezení AI, GDPR ochrana citlivých dat, autorská práva, ochrana před eskalací konfliktu.',
    content: `# Podmínky užívání portálu Táta má právo / Synthesis OS (v1.0 - Alpha 0.5.1)

## 1. Úvodní ustanovení a povaha projektu
1.1. Tyto Podmínky užívání upravují práva a povinnosti osob využívajících portál a webovou aplikaci **Táta má právo (Synthesis OS)**.
1.2. Portál je nezávislým vzdělávacím, komunitním a informačním systémem, jehož cílem je podpora informovanosti rodičů v otázkách rodinného práva, péče o děti, prevence rodičovských konfliktů a stabilizace životních situací po rozchodu. Projekt podporuje aktivní rodičovství a ochranu vztahu dítěte k oběma rodičům bez ohledu na pohlaví rodiče.
1.3. **Výslovné prohlášení:** Portál NENÍ advokátní kanceláří a neposkytuje komerční právní služby, právní poradenství za úplatu ani právní zastoupení ve smyslu zákona č. 85/1996 Sb., o advokacii. Veškeré texty, právní návody, vzory podání, judikátní rozbory a výstupy umělé inteligence (AI) mají výhradně informativní, orientační a edukační charakter.

### 1.4. Identifikace provozovatele
Provozovatelem portálu Táta má právo / Synthesis OS je:
**Jiří Šár**  
fyzická osoba (autorský a občanský projekt)  
E-mail: **info@tatavacesta.cz**  
*(dále jen „Provozovatel“)*  
Provozovatel není v současnosti právnickou osobou ani poskytovatelem advokátních či komerčních právních služeb.

---

## 2. Uživatelské účty a bezpečnost
2.1. Přístup k chráněným modulům Portálu vyžaduje bezplatnou registraci uživatelského účtu.
2.2. Registrace a autentizace probíhá primárně prostřednictvím standardizovaného protokolu Google OAuth 2.0 nebo kryptografického biometrického standardu Passkeys (WebAuthn / FIDO2).
2.3. Uživatel je povinen zachovávat mlčenlivost o svých přístupových údajích a zabezpečit svá zařízení.
2.4. Provozovatel si vyhrazuje právo blokovat účet v případě závažného porušení pravidel komunity.

---

## 3. Odpovědnost za obsah a AI nástroje
3.1. Součástí Portálu jsou generativní moduly umělé inteligence (využívající rozhraní Google Gemini API), kalkulátory výživného a generátory návrhů k soudu.
3.2. Provozovatel neodpovídá za případnou nesprávnost či procesní odmítnutí generovaných vzorů soudem.
3.3. Provozovatel doporučuje v procesně složitých situacích konzultovat podání s licencovaným advokátem specializovaným na rodinné právo.

### 3.4. Omezení AI systému
Uživatel výslovně bere na vědomí, že:
a) AI systém nevykonává právní posouzení případu,  
b) AI nemá znalost všech okolností konkrétního řízení,  
c) AI může vytvořit nesprávný, neaktuální nebo neúplný výstup (tzv. konfabulaci),  
d) uživatel plně odpovídá za veškerá rozhodnutí učiněná na základě výstupů systému.

### 3.5. Pravidla AI generovaných dokumentů
Dokumenty a návrhy vytvořené pomocí systému slouží výhradně jako pracovní návrhy. Uživatel je povinen ověřit jejich správnost, úplnost a věcnou vhodnost před jejich faktickým použitím vůči soudu, orgánům OSPOD či jiným orgánům veřejné moci.

---

## 4. Ochrana citlivého obsahu a pravidla vkládání dat
4.1. Uživatel **nesmí** do veřejných nebo sdílených částí portálu vkládat:
- rodná čísla a číslo osobních dokladů,
- přesné adresy bydliště nezletilých dětí,
- podrobnou zdravotní dokumentaci či psychologické posudky,
- neveřejné soudní dokumenty obsahující identifikaci nezletilých.
4.2. Pokud uživatel využívá AI nástroje nebo generátory podání, plně odpovídá za to, že neposkytne osobní údaje v rozsahu odporujícím těmto pravidlům nebo zásadám ochrany osobních údajů.

---

## 5. Uživatelský obsah a Autorská práva
5.1. Uživatel si ponechává vlastnická a autorská práva ke svému vloženému obsahu (příběhy, komentáře, články).
5.2. Poskytnutím obsahu portálu uděluje Uživatel Provozovateli bezplatné, nevýhradní oprávnění:
- zobrazit obsah v rámci služby a komunitního fóra,
- technicky jej zpracovat pro potřeby zobrazení a vyhledávání,
- moderovat obsah v souladu s pravidly,
- archivovat jej pro bezpečnostní účely.

---

## 6. Ochrana před eskalací konfliktu
Projekt nepodporuje:
- pomstu či dehonestaci druhého rodiče,
- manipulaci dítěte nebo navádění k rodičovskému únosu,
- neoprávněné zveřejňování osobních údajů rodinných příslušníků,
- vědomé obcházení pravomocných soudních rozhodnutí.  
Cílem projektu je výhradně podpora konstruktivního, věcného a smírného řešení rodičovských situací v nejlepším zájmu nezletilého dítěte.

---

## 7. Partneři, sponzoři a podpora
Partneři a podporovatelé projektu (např. ALGOTECH, WEDOS, FORPSI) poskytují výhradně technickou nebo infrastrukturní podporu. Neovlivňují obsah, odborné názory ani doporučení zveřejněná na portálu.`
  },

  {
    id: 'doc-privacy-v1.0',
    slug: 'privacy-policy',
    title: 'Zásady ochrany osobních údajů a GDPR (Privacy Policy) - Release 0.5.1',
    category: 'privacy',
    version: '1.0',
    language: 'cs',
    effectiveFrom: '2026-08-01T00:00:00.000Z',
    createdAt: '2026-08-01T00:00:00.000Z',
    createdBy: 'Jiří Šár & Pověřenec GDPR Synthesis OS',
    sha256Hash: 'b9d31f28e470291a5c68b72e09d182e4f5a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9',
    isActive: true,
    isRequired: true,
    changelog: 'Aktualizace zásad GDPR dle Release 0.5.1: Identifikace správce, Čl. 9 citlivá data, AI tok dat bez Čl. 22 rozhodování, ochrana nezletilých, zálohy, Čl. 18 omezení zpracování, FIDO2/Passkeys.',
    content: `# Zásady ochrany osobních údajů a GDPR (v1.0 - Release 0.5.1)

## 1. Identifikace Správce osobních údajů
1.1. Správcem osobních údajů ve smyslu Nařízení Evropského parlamentu a Rady (EU) 2016/679 (GDPR) je:
**Jiří Šár**  
fyzická osoba nepodnikající  
Provozovatel projektu **Táta má právo / Synthesis OS**  
E-mail: **info@tatavacesta.cz**  
Kontaktní e-mail pro GDPR záležitosti: **gdpr@tatamapravo.cz**  
*(dále jen „Správce“)*  
Správce určuje účely a prostředky zpracování osobních údajů.

---

## 2. Rozsah, účel a kategorie zpracovávaných údajů
2.1. Správce zpracovává údaje nezbytné pro provoz portálu a poskytování služeb uživatelům:
- **Identifikační a kontaktní údaje:** Jméno, příjmení, e-mailová adresa, profilový obrázek (získané přes Google OAuth 2.0).
- **Technické a bezpečnostní logy:** IP adresa, typ prohlížeče, User Agent, otisk zařízení, časová razítka e-akceptací a auditu.
- **Data v uživatelské pracovní ploše:** Časová osa spisu, poznámky, nahrané podklady (přístupné výhradně danému přihlášenému uživateli).

### 2.2. Biometrické údaje a autentizace (Passkeys)
Systém neukládá biometrické údaje uživatele. Biometrická autentizace probíhá výhradně na osobním zařízení uživatele prostřednictvím otevřeného standardu FIDO2 / WebAuthn.

### 2.3. Komunitní příspěvky a fórum
Pro publikaci příspěvků na komunitním fóru jsou právním základem:
- **Čl. 6 odst. 1 písm. b) GDPR** – poskytování komunitní služby na žádost uživatele,
- **Čl. 6 odst. 1 písm. f) GDPR** – oprávněný zájem Správce na moderaci, ochraně komunity a zamezení protiprávního jednání.

### 2.4. Citlivé osobní údaje a zvláštní kategorie (Čl. 9 GDPR)
Portál může při dobrovolném využití některých modulů (např. generátor podání, časová osa spisu) obsahovat informace, které mají povahu zvláštních kategorií osobních údajů podle Čl. 9 GDPR nebo vysoce citlivých rodinných informací.
Jedná se zejména o:
- informace týkající se rodinných vztahů a rodičovských sporů,
- údaje o nezletilých dětech,
- zdravotní nebo psychologické informace obsažené v nahraných podkladech,
- informace související se soudními či opatrovnickými řízeními.  
Tyto údaje nejsou vyžadovány pro běžné používání služby a uživatel vkládá pouze informace nezbytné pro účel použití služby.

---

## 3. Zpracování údajů pomocí nástrojů AI (Google Gemini API)
3.1. Pokud uživatel využije AI funkce (např. právní asistent, sumarizace spisu, generátor podání):
- vložený text může být technicky předán poskytovateli AI služby (Google Cloud / Gemini API) výhradně za účelem vygenerování okamžité odpovědi,
- systém se aktivně snaží minimalizovat rozsah osobních údajů odesílaných do rozhraní API,
- uživatel nesmí do AI rozhraní vkládat nepotřebné osobní údaje třetích osob ani rodná čísla,
- **AI výstupy nepředstavují automatizované individuální rozhodování podle Čl. 22 GDPR** a nemají právně závazné účinky bez lidského přezkumu.

---

## 4. Ochrana osobních údajů nezletilých dětí
4.1. Portál není určen křejnému zveřejňování osobních údajů o dětech.
4.2. Uživatel nesmí v komunitních částech portálu zveřejnit:
- celé jméno a příjmení nezletilého dítěte,
- fotografii či videozáznam dítěte bez souhlasu druhého zákonného zástupce,
- adresu školy, předškolního zařízení či kroužků,
- přesné místo bydliště nebo rodné číslo dítěte.
4.3. Pokud uživatel sdílí příběh či zkušenost týkající se dítěte, je povinen provést důslednou anonymizaci (např. označením „Maloletý A.“).

---

## 5. Doba uchování dat a technické zálohy
5.1. Osobní údaje jsou uchovávány po dobu trvání uživatelského účtu nebo do odvolání souhlasu.
5.2. Požadavek na výmaz ("Právo být zapomenut") se vztahuje na aktivní databázové systémy. Technické záložní kopie (backupy) mohou být odstraněny v rámci pravidelného cyklu zálohování, nejpozději v přiměřené době odpovídající bezpečnostním pravidlům infrastruktury (obvykle do 30–90 dnů).

---

## 6. Práva subjektu údajů podle GDPR
Uživatel má tato práva:
1. **Právo na přístup (Čl. 15 GDPR):** Získat výpis všech zpracovávaných osobních údajů a udělených e-souhlasů v sekci Legal Compliance Center.
2. **Právo na opravu (Čl. 16 GDPR):** Opravit nepřesné či neúplné údaje v uživatelském profilu.
3. **Právo na výmaz (Čl. 17 GDPR):** Požádat o smazání účtu a anonymizaci právních záznamů.
4. **Právo na omezení zpracování (Čl. 18 GDPR):** Požadovat omezení zpracování v případech stanovených GDPR.
5. **Právo na přenositelnost (Čl. 20 GDPR):** Stáhnout kompletní export dat ve formátu JSON / PDF.
6. **Právo odvolat souhlas:** Kdykoliv odvolat udělené volitelné souhlasy v sekci Moje právní dokumenty.

---

## 7. Cookies a Sledovací technologie
Používání analytických, preferenčních a technických cookies je podrobně popsáno v samostatném dokumentu **Cookie Policy** accessible v patce portálu.`
  },

  {
    id: 'doc-cookies-v1.0',
    slug: 'cookie-policy',
    title: 'Zásady používání souborů Cookie',
    category: 'cookies',
    version: '1.0',
    language: 'cs',
    effectiveFrom: '2026-08-01T00:00:00.000Z',
    createdAt: '2026-08-01T00:00:00.000Z',
    createdBy: 'Technický tým Synthesis OS',
    sha256Hash: 'c7e20b18f3914a82c6d5e4b3a2f1098d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b',
    isActive: true,
    isRequired: false,
    changelog: 'Specifikace nezbytných a preferenčních souborů cookie',
    content: `# Zásady používání souborů Cookie (v1.0)

## 1. Co jsou soubory cookie
Soubory cookie jsou malé textové soubory ukládané ve vašem prohlížeči při návštěvě portálu Táta má právo.

## 2. Kategorie používaných cookie
- **Nezbytné (Technické) Cookies:** Zajišťují přihlášení, relaci, bezpečnost a provoz aplikace. Bez nich portál nefunguje.
- **Funkční & Preferenční Cookies:** Ukládají vaše nastavení (např. tmavý/světlý režim, zvolený jazyk).
- **Analytické Cookies:** Pomáhají anonymně měřit návštěvnost a zlepšovat uživatelské rozhraní.`
  },

  {
    id: 'doc-ai-disclaimer-v1.0',
    slug: 'ai-disclaimer',
    title: 'AI Pravidla, Omezení a Vymezení Odpovědnosti',
    category: 'ai-disclaimer',
    version: '1.0',
    language: 'cs',
    effectiveFrom: '2026-08-01T00:00:00.000Z',
    createdAt: '2026-08-01T00:00:00.000Z',
    createdBy: 'Jiří Šár & AI Safety Board',
    sha256Hash: 'd1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    isActive: true,
    isRequired: true,
    changelog: 'Vymezení limitů generativní AI a procesních záruk v1.0',
    content: `# AI Pravidla, Omezení a Vymezení Odpovědnosti (v1.0)

## 1. Povaha AI Asistenta
Moduly umělé inteligence v systému Synthesis OS využívají velké jazykové moduly (Google Gemini API).

## 2. Podrobné vymezení limitů a odpovědnosti
1. Výstupy AI jsou automaticky generované textové návrhy na základě dodaných dat.
2. AI neprovádí právní posouzení případu ve smyslu advokátního řádu.
3. AI nemá znalost všech procesních okolností konkrétního soudního či opatrovnického řízení.
4. AI může vytvořit nesprávný, neaktuální nebo neúplný výstup (tzv. konfabulaci).
5. Uživatel odpovídá za veškerá rozhodnutí a podání učiněná na základě výstupů systému.`
  },

  {
    id: 'doc-volunteer-contract-v1.0',
    slug: 'volunteer-contract',
    title: 'Elektronická smlouva o bezúplatné dobrovolnické spolupráci',
    category: 'volunteer-contract',
    version: '1.0',
    language: 'cs',
    effectiveFrom: '2026-08-01T00:00:00.000Z',
    createdAt: '2026-08-01T00:00:00.000Z',
    createdBy: 'Jiří Šár & Právní tým',
    sha256Hash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    isActive: true,
    isRequired: false,
    changelog: 'Právní dohoda o bezúplatném dobrovolnictví, mlčenlivosti a licenčních ujednáních v1.0',
    content: `# Smlouva o bezúplatné dobrovolnické spolupráci (v1.0)

Smluvní strany:
1. **Příjemce dobrovolnické pomoci:** Jiří Šár (Provozovatel projektu Táta má právo / Synthesis OS).
2. **Dobrovolník:** Fyzická osoba, která potvrdila přihlášku a elektronicky akceptovala tuto smlouvu.

## Článek I. Předmět smlouvy
Předmětem této smlouvy je úprava podmínek, za kterých Dobrovolník poskytuje bezúplatnou odbornou, pomocnou nebo organizační činnost v rámci veřejně prospěšného projektu Táta má právo.

## Článek II. Bezúplatnost
Dobrovolník výslovně bere na vědomí, že projekt je nekomerční a pomoc je poskytována výhradně dobrovolně bez nároku na finanční odměnu či mzdu.

## Článek III. Mlčenlivost
Dobrovolník se zavazuje zachovávat přísnou mlčenlivost o všech osobních údajích uživatelů a dětí, se kterými se v rámci činnosti seznámí.`
  },

  {
    id: 'doc-volunteer-codex-v1.0',
    slug: 'volunteer-codex',
    title: 'Dobrovolnický Kodex v1.0 (Etická pravidla)',
    category: 'volunteer-codex',
    version: '1.0',
    language: 'cs',
    effectiveFrom: '2026-08-01T00:00:00.000Z',
    createdAt: '2026-08-01T00:00:00.000Z',
    createdBy: 'Etická komise Synthesis OS',
    sha256Hash: 'f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1',
    isActive: true,
    isRequired: false,
    changelog: 'Kodex etických pravidiel a zásad komunikace pro dobrovolníky v1.0',
    content: `# DOBROVOLNICKÝ KODEX (v1.0)
## Táta má právo / Synthesis OS

### I. ÚČEL KODEXU
1. Tento kodex stanovuje základní pravidla chování všech dobrovolníků a spolupracovníků s přístupem k projektu.
2. Účelem kodexu je zajistit, aby projekt zůstal bezpečným, důvěryhodným a respektujícím prostředím.

### II. POSLÁNÍ PROJEKTU
Dobrovolník při své činnosti podporuje zejména:
- Nejlepší zájem dítěte,
- Zdravý vztah dítěte k oběma rodičům bez ohledu na pohlaví,
- Respekt mezi rodiči,
- Odpovědné rodičovství.`
  },

  {
    id: 'doc-anonymization-v1.0',
    slug: 'case-anonymization-rules',
    title: 'Pravidla anonymizace případů a soudních spisu',
    category: 'privacy',
    version: '1.0',
    language: 'cs',
    effectiveFrom: '2026-08-01T00:00:00.000Z',
    createdAt: '2026-08-01T00:00:00.000Z',
    createdBy: 'Pověřenec GDPR & Bezpečnostní tým',
    sha256Hash: '876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9',
    isActive: true,
    isRequired: true,
    changelog: 'Pravidla pro bezpečnou anonymizaci opatrovnických spisu a citlivých dat před vložením do systému',
    content: `# Pravidla anonymizace případů a soudních spisů (v1.0)

## 1. Povinná anonymizace údajů
Před nahráním soudního rozhodnutí, znaleckého posudku nebo protokolu z OSPOD do komunitní databáze nebo AI modulu je uživatel povinen odstranit nebo nahradit:
- Jména a příjmení nezletilých dětí (použijte iniciály nebo např. „Maloletý A.“),
- Rodná čísla a přesná data narození,
- Bydliště, adresy škol a předškolních zařízení,
- Jména soudců, znalců a sociálních pracovníků (pokud by zveřejnění vedlo k identifikaci rodiny).

## 2. Automatické detekční filtry
Systém Synthesis OS využívá automatizované algoritmy pro detekci rodných čísel a telefonních čísel, které před zpracováním AI automaticky maskují.`
  },

  {
    id: 'doc-templates-license-v1.0',
    slug: 'templates-license',
    title: 'Licenční podmínky pro používání vzorů dokumentů',
    category: 'terms',
    version: '1.0',
    language: 'cs',
    effectiveFrom: '2026-08-01T00:00:00.000Z',
    createdAt: '2026-08-01T00:00:00.000Z',
    createdBy: 'Právní tým Synthesis OS',
    sha256Hash: '5544332211aabbccdd5544332211aabbccdd5544332211aabbccdd5544332211',
    isActive: true,
    isRequired: true,
    changelog: 'Licenční podmínky nekomerčního užití vzorů podání k soudu v1.0',
    content: `# Licenční podmínky pro vzory dokumentů (v1.0)

## 1. Udělení osobní licence
Všechny vzory podání, žalob, dohod o péči a výživném dostupné v systému Synthesis OS jsou poskytovány pod nekomerční licencí pro osobní potřebu uživatele.

## 2. Zákaz komerčního přeprodeje
Je přísně zakázáno vzory dokumentů stažené z portálu komerčně přeprodávat, nabízet za úplatu třetím osobám nebo šířit jako placený produkt.`
  }
];
