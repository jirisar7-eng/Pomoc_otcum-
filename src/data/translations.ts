/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'cs' | 'sk' | 'en';

export interface TranslationDictionary {
  [key: string]: {
    cs: string;
    sk: string;
    en: string;
  };
}

export const TRANSLATIONS: TranslationDictionary = {
  // Brand & Slogans
  brand_name: {
    cs: "Táta má právo",
    sk: "Otec má právo",
    en: "Father Has Rights"
  },
  brand_subtitle: {
    cs: "PRŮVODCE OPATROVNICTVÍM",
    sk: "SPRIEVODCA OPATROVNÍCTVOM",
    en: "CUSTODY PROCEEDINGS GUIDE"
  },
  brand_mission: {
    cs: "Dítě potřebuje oba rodiče. Tento web vznikl proto, aby pomohl rodičům lépe se orientovat v opatrovnických řízeních, sdílet zkušenosti a najít užitečné informace.",
    sk: "Dieťa potrebuje oboch rodičov. Tento web vznikol preto, aby pomohol rodičom lepšie sa orientovať v opatrovníckych konaniach, zdieľať skúsenosti a nájsť užitočné informácie.",
    en: "A child needs both parents. This portal was built to help parents navigate custody proceedings, share experiences, and find valuable information."
  },

  // Navigation Tabs & Sections
  nav_home: {
    cs: "Domů",
    sk: "Domov",
    en: "Home"
  },
  nav_section_about: {
    cs: "I. O portálu & Memento",
    sk: "I. O portáli & Memento",
    en: "I. About the Portal & Memento"
  },
  nav_memento: {
    cs: "Základní pilíř & Memento",
    sk: "Základný pilier & Memento",
    en: "Core Pillar & Memento"
  },
  nav_memento_desc: {
    cs: "Já Jiří Šár jsem zakladatel. A důvod, proč ho tvořím, je ten, aby žádný otec nemusel podstupovat boje s úřady jako já.",
    sk: "Ja Jiří Šár som zakladateľ. A dôvod, prečo ho tvorím, je ten, aby žiaden otec nemusel podstupovať boje s úradmi ako ja.",
    en: "I, Jiří Šár, am the founder. The reason I am building this is so that no father has to go through custody battles like I did."
  },
  nav_stories: {
    cs: "Kořeny mého případu",
    sk: "Korene môjho prípadu",
    en: "Roots of My Case"
  },
  nav_stories_desc: {
    cs: "Osobní příběh zakladatele Jiřího Šára jako memento a zdroj inspirace.",
    sk: "Osobný príbeh zakladateľa Jiřího Šára ako memento a zdroj inšpirácie.",
    en: "The personal story of founder Jiří Šár as a memento and source of inspiration."
  },
  nav_section_case: {
    cs: "II. Moje strategie & případ",
    sk: "II. Moja stratégia & prípad",
    en: "II. My Strategy & Case"
  },
  nav_user_portal: {
    cs: "Moje Pracovna",
    sk: "Moja Pracovňa",
    en: "My Workspace"
  },
  nav_user_portal_desc: {
    cs: "Osobní prostor pro dokumenty, checklisty a přípravu na soud.",
    sk: "Osobný priestor pre dokumenty, checklisty a prípravu na súd.",
    en: "Personal workspace for documents, checklists, and court preparation."
  },
  nav_ai_case_manager: {
    cs: "Osobní složka případu",
    sk: "Osobný priečinok prípadu",
    en: "Personal Case Folder"
  },
  nav_ai_case_manager_desc: {
    cs: "Bezpečné úložiště dokumentů, časová osa a AI analýza strategie v reálném čase.",
    sk: "Bezpečné úložisko dokumentov, časová os a AI analýza stratégie v reálnom čase.",
    en: "Secure document vault, case timeline, and real-time AI strategic analysis."
  },
  nav_section_legal: {
    cs: "III. Právní výzbroj",
    sk: "III. Právna výzbroj",
    en: "III. Legal Armor"
  },
  nav_news: {
    cs: "Informační báze",
    sk: "Informačná báza",
    en: "Information Hub"
  },
  nav_news_desc: {
    cs: "Vzdělávací články, novinky a aktuality ze sveta rodinného práva.",
    sk: "Vzdelávacie články, novinky a aktuality zo sveta rodinného práva.",
    en: "Educational articles, news, and updates from the world of family law."
  },
  nav_legal_wiki: {
    cs: "Právní minimum",
    sk: "Právne minimum",
    en: "Legal Essentials"
  },
  nav_legal_wiki_desc: {
    cs: "Srozumitelná encyklopedie práva a klíčových právních pojmů.",
    sk: "Srozumiteľná encyklopédia práva a kľúčových právnych pojmov.",
    en: "An easy-to-understand encyclopedia of family law and key legal concepts."
  },
  nav_judikatura: {
    cs: "Judikatura",
    sk: "Judikatúra",
    en: "Case Law"
  },
  nav_judikatura_desc: {
    cs: "Přehled klíčových rozhodnutí Ústavního a Nejvyššího soudu ČR.",
    sk: "Prehľad kľúčových rozhodnutí Ústavného a Najvyššieho súdu SR/ČR.",
    en: "Overview of landmark decisions of the Supreme and Constitutional Court."
  },
  nav_ke_stazeni: {
    cs: "Vzory podání",
    sk: "Vzory podaní",
    en: "Document Templates"
  },
  nav_ke_stazeni_desc: {
    cs: "Ověřené vzory žalob, návrhů a podání připravené k vyplnění.",
    sk: "Overené vzory žalôb, návrhov a podaní pripravené na vyplnenie.",
    en: "Verified templates for lawsuits, motions, and submissions ready to fill."
  },
  nav_section_process: {
    cs: "IV. Proces opatrovnictví",
    sk: "IV. Proces opatrovníctva",
    en: "IV. Custody Process"
  },
  nav_ai_guide: {
    cs: "Průvodce řízením",
    sk: "Sprievodca konaním",
    en: "Proceedings Guide"
  },
  nav_ai_guide_desc: {
    cs: "Interaktivní průvodce celou cestou od rozvodu po finální dohodu.",
    sk: "Interaktívny sprievodca celou cestou od rozvodu po finálnu dohodu.",
    en: "Interactive guide covering the entire path from divorce to final agreement."
  },
  nav_opatrovnicka_agenda: {
    cs: "Opatrovnická agenda",
    sk: "Opatrovnícka agenda",
    en: "Custody Agenda"
  },
  nav_opatrovnicka_agenda_desc: {
    cs: "Klíčové informace o OSPOD, soudních procesech a pravidlech výživného.",
    sk: "Kľúčové informácie o OSPOD-e, súdnych procesoch a pravidlách výživného.",
    en: "Key info about social services (OSPOD), court processes, and child support rules."
  },
  nav_plan_pece: {
    cs: "Plán péče o dítě",
    sk: "Plán starostlivosti o dieťa",
    en: "Child Care Plan"
  },
  nav_plan_pece_desc: {
    cs: "Psychologie péče o dítě a interaktivní simulátor střídání.",
    sk: "Psychológia starostlivosti o dieťa a interaktívny simulátor striedania.",
    en: "Child care psychology and interactive custody scheduling simulator."
  },
  nav_section_community: {
    cs: "V. Komunita a pomoc",
    sk: "V. Komunita a pomoc",
    en: "V. Community & Support"
  },
  nav_forum: {
    cs: "Diskusní fórum",
    sk: "Diskusné fórum",
    en: "Discussion Forum"
  },
  nav_forum_desc: {
    cs: "Bezpečný prostor pro sdílení zkušeností, dotazy a vzájemnou podporu otců.",
    sk: "Bezpečný priestor pre zdieľanie skúseností, otázky a vzájomnú podporu otcov.",
    en: "A safe space for fathers to share custody experiences and get mutual support."
  },
  nav_contacts: {
    cs: "Krizové kontakty",
    sk: "Krízové kontakty",
    en: "Crisis Contacts"
  },
  nav_contacts_desc: {
    cs: "Rychlý přehled linek důvěry, bezplatné právní pomoci a psychologů.",
    sk: "Rýchly prehľad liniek dôvery, bezplatnej právnej pomoci a psychológov.",
    en: "Quick overview of helplines, free legal aid, and psychologists."
  },
  nav_partners: {
    cs: "Partnerské projekty",
    sk: "Partnerské projekty",
    en: "Partner Projects"
  },
  nav_partners_desc: {
    cs: "Organizace a nezávislé projekty bojující za práva dětí na oba rodiče.",
    sk: "Organizácie a nezávislé projekty bojujúce za práva detí na oboch rodičov.",
    en: "Organizations and independent projects fighting for children's rights to both parents."
  },

  // Glossary
  glossary_btn: {
    cs: "Odborný slovník pojmů",
    sk: "Odborný slovník pojmov",
    en: "Professional Glossary"
  },
  glossary_title: {
    cs: "Odborný slovník pojmů a studií",
    sk: "Odborný slovník pojmov a štúdií",
    en: "Glossary of Key Terms & Studies"
  },
  glossary_search_placeholder: {
    cs: "Vyhledat odborný pojem...",
    sk: "Vyhľadať odborný pojem...",
    en: "Search glossary term..."
  },

  // Buttons & Core Actions
  btn_logout: {
    cs: "Odhlásit",
    sk: "Odhlásiť se",
    en: "Sign Out"
  },
  btn_login: {
    cs: "Přihlásit",
    sk: "Prihlásiť sa",
    en: "Sign In"
  },
  btn_back: {
    cs: "Zpět",
    sk: "Späť",
    en: "Back"
  },
  btn_save: {
    cs: "Uložit",
    sk: "Uložiť",
    en: "Save"
  },
  btn_cancel: {
    cs: "Zrušit",
    sk: "Zrušiť",
    en: "Cancel"
  },
  btn_add: {
    cs: "Přidat",
    sk: "Pridať",
    en: "Add"
  },
  btn_edit: {
    cs: "Upravit",
    sk: "Upraviť",
    en: "Edit"
  },
  btn_delete: {
    cs: "Smazat",
    sk: "Zmazať",
    en: "Delete"
  },
  btn_close: {
    cs: "Zavřít",
    sk: "Zatvoriť",
    en: "Close"
  },
  btn_send: {
    cs: "Odeslat",
    sk: "Odoslať",
    en: "Send"
  },
  search_placeholder: {
    cs: "Vyhledat v obsahu...",
    sk: "Vyhľadať v obsahu...",
    en: "Search content..."
  },
  btn_support: {
    cs: "Podpořit chod webu",
    sk: "Podporiť chod webu",
    en: "Support our project"
  },
  btn_sitemap: {
    cs: "Mapa stránek & Vývoj",
    sk: "Mapa stránok & Vývoj",
    en: "Sitemap & Development"
  },

  // Footer & Disclaimer
  footer_copyright: {
    cs: "© 2026 Táta má právo. Vyvinuto s nejvyšším ohledem na blaho dětí. Vytvořil Jiří Š. pod záštitou studia Synthesis.",
    sk: "© 2026 Otec má právo. Vyvinuté s najvyšším ohľadom na blaho detí. Vytvoril Jiří Š. pod záštitou štúdia Synthesis.",
    en: "© 2026 Father Has Rights. Developed with ultimate care for child welfare. Created by Jiří Š. under Synthesis Studio."
  },
  footer_rbac: {
    cs: "RBAC aktivní",
    sk: "RBAC aktívny",
    en: "RBAC active"
  },
  footer_neutrality: {
    cs: "Nestrannost garantována",
    sk: "Nestrannosť garantovaná",
    en: "Impartiality guaranteed"
  },
  footer_useful_sections: {
    cs: "Užitečné sekce",
    sk: "Užitočné sekcie",
    en: "Useful Sections"
  },
  footer_disclaimer_title: {
    cs: "Podmínky užívání & AI Prohlášení",
    sk: "Podmienky užívania & AI Vyhlásenie",
    en: "Terms of Use & AI Disclaimer"
  },
  footer_disclaimer_text: {
    cs: "Tento web je budován svépomocí za použití umělé inteligence (AI), odborných zdrojů a mých vlastních zkušeností z opatrovnických sporů. Autor není právník ani nemá právní či psychologické vzdělání. Veškeré informace a vzory dokumentů jsou pouze informačního charakteru, mohou obsahovat chyby a jejich užitím souhlasíte s tím, že autor nenese žádnou odpovědnost za případné chyby, nepřesnosti či následky jejich použití. Vždy si informace ověřte.",
    sk: "Tento web je budovaný svojpomocne za použitia umelej inteligencie (AI), odborných zdrojov a mojich vlastných skúseností z opatrovníckych sporov. Autor nie je právnik ani nemá právne či psychologické vzdelanie. Všetky informácie a vzory dokumentov majú len informačný charakter, môžu obsahovať chyby a ich použitím súhlasíte s tým, že autor nenesie žiadnu zodpovednosť za prípadné chyby, nepresnosti či následky ich použitia. Vždy si informácie overte.",
    en: "This website is self-built using artificial intelligence (AI), scientific resources, and personal experience from custody disputes. The author is not an attorney and does not possess a legal or psychological degree. All information and document templates are provided strictly for informational purposes, may contain errors, and by using them you agree that the author bears no liability for any errors, inaccuracies, or outcomes of their use. Always verify all information."
  },

  // Language Switcher labels
  lang_select_title: {
    cs: "Preferovaný jazyk portálu",
    sk: "Preferovaný jazyk portálu",
    en: "Preferred portal language"
  },
  lang_cs: {
    cs: "Čeština",
    sk: "Čeština",
    en: "Czech"
  },
  lang_sk: {
    cs: "Slovenčina",
    sk: "Slovenčina",
    en: "Slovak"
  },
  lang_en: {
    cs: "English",
    sk: "English",
    en: "English"
  },

  // RBAC Access Block Card (found in AdminPanel etc)
  rbac_access_denied: {
    cs: "Vyžadováno přihlášení administrátora",
    sk: "Vyžadované prihlásenie administrátora",
    en: "Administrator Login Required"
  },
  rbac_access_denied_desc: {
    cs: "Pro přístup do správy portálu 'Táta má právo' a administrace Synthesis OS je vyžadován účet s rolí SuperAdmin. Jako vývojář nebo testující se můžete jedním kliknutím přepnout do testovacího administrátorského profilu.",
    sk: "Pre prístup do správy portálu 'Otec má právo' a administrácie Synthesis OS je vyžadovaný účet s rolou SuperAdmin. Ako vývojár alebo testujúci sa môžete jedným kliknutím prepnúť do testovacieho administrátorského profilu.",
    en: "Access to the 'Táta má právo' portal management and Synthesis OS administration requires an account with the SuperAdmin role. As a developer or tester, you can switch to a test administrator profile with one click."
  },

  // Hero Section Header text
  hero_welcome: {
    cs: "Oficiální spuštění alfa verze 0.0.1.2 portálu Táta má právo! 🚀",
    sk: "Oficiálne spustenie alfa verzie 0.0.1.2 portálu Otec má právo! 🚀",
    en: "Official launch of Alpha v0.0.1.2 of the Father Has Rights portal! 🚀"
  },

  // Modules, Cards & Buttons
  open_module: {
    cs: "Otevřít modul",
    sk: "Otvoriť modul",
    en: "Open module"
  },
  quick_consultation: {
    cs: "Rychlá konzultace",
    sk: "Rýchla konzultácia",
    en: "Quick consultation"
  },
  download: {
    cs: "Ke stažení",
    sk: "Na stiahnutie",
    en: "Download"
  },
  monthly_budget: {
    cs: "Měsíční rozpočet",
    sk: "Mesačný rozpočet",
    en: "Monthly budget"
  },
  open_chapter: {
    cs: "Otevřít kapitolu",
    sk: "Otvoriť kapitolu",
    en: "Open chapter"
  },
  topic_detail: {
    cs: "Detail okruhu",
    sk: "Detail okruhu",
    en: "Topic detail"
  },
  show_all_21_categories: {
    cs: "Zobrazit všech 21 kategorií",
    sk: "Zobraziť všetkých 21 kategórií",
    en: "Show all 21 categories"
  },
  hide_list: {
    cs: "Skrýt seznam",
    sk: "Skryť zoznam",
    en: "Hide list"
  },
  open_ai_assistant: {
    cs: "Otevřít AI Asistenta",
    sk: "Otvoriť AI Asistenta",
    en: "Open AI Assistant"
  },
  need_sos_help: {
    cs: "Potřebuji krizovou pomoc (SOS)",
    sk: "Potrebujem krízovú pomoc (SOS)",
    en: "I need crisis help (SOS)"
  },
  explore_21_categories: {
    cs: "Prozkoumat 21 kategorií",
    sk: "Preskúmať 21 kategórií",
    en: "Explore 21 categories"
  },
  tab_monthly_budget: {
    cs: "Měsíční rozpočet",
    sk: "Mesačný rozpočet",
    en: "Monthly budget"
  },
  tab_bank_transfer: {
    cs: "Bankovní převod & podpora",
    sk: "Bankový prevod & podpora",
    en: "Bank transfer & support"
  },
  tab_sponsors_partners: {
    cs: "Sponzoři & partneři",
    sk: "Sponzori & partneri",
    en: "Sponsors & partners"
  },
  legal_disclaimer_title: {
    cs: "Právní doložka a podmínky užívání portálu",
    sk: "Právna doložka a podmienky užívania portálu",
    en: "Legal disclaimer and terms of portal use"
  },
  legal_disclaimer_warning: {
    cs: "Upozornění",
    sk: "Upozornenie",
    en: "Warning"
  }
};
