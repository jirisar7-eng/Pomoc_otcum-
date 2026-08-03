import React from 'react';
import Link from 'next/link';
import { ExternalLink, Shield } from 'lucide-react';

export interface FooterProps {
  onNavigate?: (tab: string) => void;
  onOpenIntro?: () => void;
  onOpenCookies?: () => void;
  activeLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

export function Footer({
  onNavigate,
  onOpenIntro,
  onOpenCookies,
  activeLanguage = 'cs',
  onLanguageChange,
}: FooterProps) {
  const handleTabClick = (e: React.MouseEvent, tab: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(tab);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleIntroClick = (e: React.MouseEvent) => {
    if (onOpenIntro) {
      e.preventDefault();
      onOpenIntro();
    }
  };

  const handleCookiesClick = (e: React.MouseEvent) => {
    if (onOpenCookies) {
      e.preventDefault();
      onOpenCookies();
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* 4-Column Grid: Mobile 1 col, Tablet 2 cols, Desktop 4 cols */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Sloupec 1: Mise */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🛡️</span>
              <span>Táta má právo</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Dítě potřebuje oba rodiče. Tento web vznikl proto, aby pomohl rodičům lépe se orientovat v opatrovnických řízeních, sdílet zkušenosti a najít užitečné informace.
            </p>
            <div>
              <Link
                href="/kontakt"
                onClick={(e) => handleTabClick(e, 'contacts')}
                className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors inline-flex items-center gap-1 group"
              >
                <span>Kontakt na autora</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>

          {/* Sloupec 2: Užitečné sekce */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-wide uppercase text-xs text-slate-300">
              Užitečné sekce
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/opatrovnicka-agenda"
                  onClick={(e) => handleTabClick(e, 'opatrovnicka-agenda')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Opatrovnická agenda
                </Link>
              </li>
              <li>
                <Link
                  href="/vzory-podani"
                  onClick={(e) => handleTabClick(e, 'vzory-podani')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Vzory podání
                </Link>
              </li>
              <li>
                <Link
                  href="/uzivatelsky-manual"
                  onClick={(e) => handleTabClick(e, 'user-manual')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  📖 Nápověda & Manuál
                </Link>
              </li>
              <li>
                <Link
                  href="/plan-pece"
                  onClick={(e) => handleTabClick(e, 'plan-pece')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Plán péče o dítě
                </Link>
              </li>
              <li>
                <Link
                  href="/pracovna"
                  onClick={(e) => handleTabClick(e, 'user-portal')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Moje Pracovna
                </Link>
              </li>
              <li className="pt-1">
                <a
                  href="https://www.facebook.com/groups/tatamapravo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium inline-flex items-center gap-1.5"
                >
                  <span>Oficiální Facebook Skupina</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Sloupec 3: Právo & Spolupráce */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-wide uppercase text-xs text-slate-300">
              Dokumenty a Podmínky
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/podminky"
                  onClick={(e) => handleTabClick(e, 'terms')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  📜 Podmínky užívání
                </Link>
              </li>
              <li>
                <Link
                  href="/gdpr"
                  onClick={(e) => handleTabClick(e, 'privacy')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  🛡️ Ochrana údajů (GDPR)
                </Link>
              </li>
              <li>
                <Link
                  href="/legal-center"
                  onClick={(e) => handleTabClick(e, 'legal-center')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  ⚖️ Moje Právní Dokumenty (Compliance Center)
                </Link>
              </li>
              <li>
                <Link
                  href="/kodex"
                  onClick={(e) => handleTabClick(e, 'kodex')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  🛡️ Dobrovolnický Kodex (v1.0)
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/zapoj-se"
                  onClick={(e) => handleTabClick(e, 'zapoj-se')}
                  className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors inline-block"
                >
                  🤝 Hledáme kolegy (Dobrovolnictví)
                </Link>
              </li>
            </ul>
          </div>

          {/* Sloupec 4: Prohlášení a Sponzoři */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-wide uppercase text-xs text-slate-300">
              AI Prohlášení
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed text-justify">
              Tento web je budován svépomocí za použití umělé inteligence (AI), odborných zdrojů a mých vlastních zkušeností z opatrovnických sporů. Autor není právník ani nemá právní či psychologické vzdělání. Veškeré informace a vzory dokumentů jsou pouze informačního charakteru, mohou obsahovat chyby a jejich užitím souhlasíte s tím, že autor nenese žádnou odpovědnost za případné chyby, nepřesnosti či následky jejich použití. Vždy si informace ověřte.
            </p>

            {/* Sponzorský blok v rámečku bg-slate-800/50 */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <p className="text-xs text-slate-300 leading-normal">
                <span className="font-semibold text-white">Podpora projektu & Sponzoři:</span> Podporují nás <strong>ALGOTECH a.s.</strong> (Cloud VPS), <strong>VEDOS Internet, a.s.</strong> (Webhosting) a <strong>FORPSI</strong> (Doména).
              </p>
              <div>
                <Link
                  href="/partneri"
                  onClick={(e) => handleTabClick(e, 'partners')}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>Zobrazit sekci Sponzoři & Partneři</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Spodní lišta (Bottom Bar) */}
        <div className="border-t border-slate-800 pt-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          {/* Levá strana */}
          <div className="text-center lg:text-left leading-relaxed">
            © 2026 Táta má právo. Vyvinuto s nejvyšším ohledem na blaho dětí. Vytvořil Jiří Š. pod záštitou studia Synthesis.
          </div>

          {/* Střed: Přepínač jazyků */}
          <div className="flex items-center gap-2 bg-slate-800/40 border border-slate-800/80 rounded-lg p-1">
            <button
              type="button"
              onClick={() => onLanguageChange?.('cs')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                activeLanguage === 'cs'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Čeština (Aktivní)"
            >
              🇨🇿 CS
            </button>
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded text-xs font-normal text-slate-600 cursor-not-allowed"
              title="Slovenčina (Připravujeme)"
            >
              🇸🇰 SK
            </button>
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded text-xs font-normal text-slate-600 cursor-not-allowed"
              title="English (Coming soon)"
            >
              🇬🇧 EN
            </button>
          </div>

          {/* Pravá strana: Systémové linky & Badge */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleIntroClick}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              📢 Beta Oznámení (Intro)
            </button>
            <Link
              href="/sitemap"
              onClick={(e) => handleTabClick(e, 'sitemap')}
              className="text-teal-400 hover:text-teal-300 font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              📂 Mapa stránek & Vývoj
            </Link>
            <button
              type="button"
              onClick={handleCookiesClick}
              className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              🍪 Nastavení Cookie preferencí
            </button>
            
            {/* Systémový odznak RBAC */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>RBAC aktivní</span>
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
