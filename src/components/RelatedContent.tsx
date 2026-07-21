import React from 'react';
import { 
  Sparkles, 
  FileText, 
  Scale, 
  Calculator, 
  BookOpen, 
  ArrowRight, 
  LifeBuoy, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  Briefcase
} from 'lucide-react';

interface RelatedContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function RelatedContent({ activeTab, setActiveTab }: RelatedContentProps) {
  // Define contextual recommendations based on current view
  const getRelatedItems = () => {
    switch (activeTab) {
      case 'vyzivne':
        return [
          { tab: 'plan-pece', label: 'Plán péče o dítě', desc: 'Připravte návrh rozdělení péče pro soud.', icon: Calculator, color: 'text-indigo-600' },
          { tab: 'ke-stazeni', label: 'Vzory podání', desc: 'Stáhněte si návrh na úpravu výživného.', icon: FileText, color: 'text-emerald-600' },
          { tab: 'judikatura', label: 'Judikatura k výživnému', desc: 'Rozsudky k příjmům a odůvodněným potřebám.', icon: Scale, color: 'text-amber-600' },
        ];
      case 'plan-pece':
        return [
          { tab: 'vyzivne', label: 'Kalkulačka výživného', desc: 'Spočítejte doporučené alimenty.', icon: Calculator, color: 'text-teal-600' },
          { tab: 'coparent-hub', label: 'Rodičovský hub', desc: 'Nástroje pro komunikaci s druhým rodičem.', icon: Briefcase, color: 'text-blue-600' },
          { tab: 'ai-guide', label: 'AI Průvodce řízením', desc: 'Vygenerujte strategii pro jednání s OSPOD.', icon: Sparkles, color: 'text-rose-600' },
        ];
      case 'judikatura':
      case 'pripadova-databaze':
        return [
          { tab: 'legal-wiki', label: 'Právní minimum', desc: 'Základní právní pojmy a paragrafy.', icon: BookOpen, color: 'text-slate-700' },
          { tab: 'ke-stazeni', label: 'Vzory návrhů a podání', desc: 'Certifikované formuláře s citacemi judikátů.', icon: FileText, color: 'text-emerald-600' },
          { tab: 'ai-assistant', label: 'AI Právní Poradce', desc: 'Zeptejte se AI na aplikaci judikátu na váš případ.', icon: Sparkles, color: 'text-purple-600' },
        ];
      case 'ke-stazeni':
        return [
          { tab: 'opatrovnicka-agenda', label: 'Opatrovnická agenda', desc: 'Průvodce fázemi podání návrhu.', icon: ShieldCheck, color: 'text-teal-600' },
          { tab: 'judikatura', label: 'Doporučená judikatura', desc: 'Získejte argumenty k přiložení k podání.', icon: Scale, color: 'text-amber-600' },
          { tab: 'ai-case-manager', label: 'Osobní složka případu', desc: 'Uložte své vyplněné vzory do bezpečné složky.', icon: Briefcase, color: 'text-indigo-600' },
        ];
      default:
        return [
          { tab: 'ai-assistant', label: 'AI Právní Asistent', desc: 'Odborná konzultace vašeho opatrovnického dotazu v reálném čase.', icon: Sparkles, color: 'text-teal-600' },
          { tab: 'ke-stazeni', label: 'Vzory podání', desc: 'Editovatelné formuláře pro soudy a OSPOD ke stažení.', icon: FileText, color: 'text-emerald-600' },
          { tab: 'crisis', label: 'Krizová pomoc a SOS', desc: 'Okamžitá psychologická a právní pomoc v nouzi.', icon: LifeBuoy, color: 'text-rose-600' },
        ];
    }
  };

  const related = getRelatedItems();

  return (
    <div className="mt-12 pt-8 border-t border-slate-200/80 space-y-6" id="mohlo-by-vas-zajimat">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-teal-600" />
            Mohlo by vás zajímat & Související materiály
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Navazující doporučené kroky, vzory a nástroje pro váš procesní úspěch.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Koncepčně konsolidováno v4.0
        </span>
      </div>

      {/* Grid of Contextual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {related.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.tab}
              onClick={() => {
                setActiveTab(item.tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group bg-white p-4 rounded-2xl border border-slate-200/70 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl bg-slate-50 group-hover:bg-teal-50 transition-colors ${item.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-display group-hover:text-teal-700 transition-colors">
                  {item.label}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-teal-600 font-bold">
                <span>Otevřít modul</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
