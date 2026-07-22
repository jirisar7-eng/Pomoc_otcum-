import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Briefcase,
  Building2,
  Heart,
  Compass
} from 'lucide-react';

export interface RecommendationItem {
  id: string;
  tab: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  badge?: string;
}

export interface ContextConfig {
  key: string;
  title: string;
  subtitle: string;
  badge: string;
  items: RecommendationItem[];
}

interface RelatedContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

/**
 * Gets contextual recommendation mapping based on current URL path, hash, or activeTab ID
 */
export function getContextRecommendations(rawKey: string): ContextConfig {
  const normalizedKey = (rawKey || '')
    .toLowerCase()
    .replace(/^#\/?/, '')
    .replace(/^\//, '')
    .trim();

  // 1. Úvodka / Domů ( '/', '#home', 'home' )
  if (!normalizedKey || normalizedKey === 'home' || normalizedKey === 'index' || normalizedKey === 'domu') {
    return {
      key: 'home',
      title: 'Mohlo by vás zajímat & Související materiály',
      subtitle: 'Doporučené hlavní moduly pro váš nejlepší start v portálu.',
      badge: 'Kontext: Úvodní stránka',
      items: [
        {
          id: 'home-ai',
          tab: 'ai-assistant',
          label: 'AI Právní asistent',
          desc: 'Odborná konzultace vašeho opatrovnického dotazu v reálném čase s Gemini AI.',
          icon: Sparkles,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50 border-teal-100',
          badge: 'Inteligentní AI'
        },
        {
          id: 'home-templates',
          tab: 'ke-stazeni',
          label: 'Vzory podání',
          desc: 'Certifikované formuláře a editovatelné návrhy pro soudy a OSPOD ke stažení.',
          icon: FileText,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50 border-emerald-100',
          badge: 'Formuláře'
        },
        {
          id: 'home-sos',
          tab: 'crisis',
          label: 'Krizová pomoc & SOS',
          desc: 'Okamžitá psychologická, právní a bezpečnostní pomoc v nouzové situaci.',
          icon: LifeBuoy,
          color: 'text-rose-600',
          bgColor: 'bg-rose-50 border-rose-100',
          badge: 'Rychlá pomoc'
        }
      ]
    };
  }

  // 2. Kalendář / Termíny ( '#calendar', '#timeline', 'sitemap-timeline', 'calendar', 'timeline' )
  if (
    normalizedKey.includes('calendar') || 
    normalizedKey.includes('timeline') || 
    normalizedKey.includes('termin') ||
    normalizedKey === 'sitemap-timeline'
  ) {
    return {
      key: 'calendar',
      title: 'Související materiály pro váš termín',
      subtitle: 'Příprava na nadcházející procesní úkony, jednání a lhůty.',
      badge: 'Kontext: Kalendář & Termíny',
      items: [
        {
          id: 'cal-court',
          tab: 'soudni-rizeni',
          label: 'Příprava na soudní jednání',
          desc: 'Kompletní průvodce a taktické kroky pro vystoupení před soudem a OSPOD.',
          icon: ShieldCheck,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50 border-amber-100',
          badge: 'Procesní taktika'
        },
        {
          id: 'cal-postpone',
          tab: 'ke-stazeni',
          label: 'Vzor omluvy / změny termínu',
          desc: 'Certifikované vzory žádostí o odročení jednání nebo změnu termínu ze závažných důvodů.',
          icon: FileText,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50 border-emerald-100',
          badge: 'Vzory podání'
        },
        {
          id: 'cal-arg',
          tab: 'ai-assistant',
          label: 'AI Asistent pro argumentaci',
          desc: 'Příprava věcných argumentů, protiargumentů a otázek pro opatrovnický orgán.',
          icon: Sparkles,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50 border-teal-100',
          badge: 'Argumentace'
        }
      ]
    };
  }

  // 3. Vzory / Dokumenty / Ke stažení ( '#studies', '#templates', 'ke-stazeni', 'centrum-formularu', 'studies', 'templates' )
  if (
    normalizedKey.includes('studies') || 
    normalizedKey.includes('template') || 
    normalizedKey === 'ke-stazeni' || 
    normalizedKey === 'centrum-formularu' ||
    normalizedKey.includes('vzor') ||
    normalizedKey.includes('dokument')
  ) {
    return {
      key: 'templates',
      title: 'Související nástroje pro podání',
      subtitle: 'Praktické podklady, právní minimum a kalkulačky pro přípravu návrhu.',
      badge: 'Kontext: Vzory & Dokumenty',
      items: [
        {
          id: 'tpl-legal',
          tab: 'legal-wiki',
          label: 'Jak správně podat návrh',
          desc: 'Právní minimum a procesní pokyny pro bezchybné podání k příslušnému okresnímu soudu.',
          icon: BookOpen,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50 border-indigo-100',
          badge: 'Právní průvodce'
        },
        {
          id: 'tpl-calc',
          tab: 'vyzivne',
          label: 'Kalkulačka výživného',
          desc: 'Přesný výpočet orientační výše alimentů dle aktuálních doporučených tabulek MSp.',
          icon: Calculator,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50 border-teal-100',
          badge: 'Výpočet'
        },
        {
          id: 'tpl-care',
          tab: 'care-simulator',
          label: 'Průvodce střídavou péčí',
          desc: 'Interaktivní simulace modelů péče a příprava rodičovského plánu ke schválení.',
          icon: Scale,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50 border-emerald-100',
          badge: 'Model péče'
        }
      ]
    };
  }

  // 4. Krizová pomoc / SOS ( '#sos', '#crisis', 'sos', 'crisis', 'krize' )
  if (
    normalizedKey.includes('sos') || 
    normalizedKey.includes('crisis') || 
    normalizedKey.includes('kriz')
  ) {
    return {
      key: 'crisis',
      title: 'Nouzová pomoc & Okamžitá součinnost',
      subtitle: 'Akutní kontakty na úřady, krizové linky a urgentní právní postup.',
      badge: 'Kontext: Krizová pomoc & SOS',
      items: [
        {
          id: 'sos-ospod',
          tab: 'ospod',
          label: 'Kontakty na OSPOD a Probační službu',
          desc: 'Přímé kontakty, spádová území a úřední hodiny opatrovnických orgánů v ČR.',
          icon: Building2,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50 border-amber-100',
          badge: 'Orgány péče'
        },
        {
          id: 'sos-minimum',
          tab: 'legal-wiki',
          label: 'Právní minimum pro akutní případy',
          desc: 'Rychlý přehled základních práv, povinností a předběžných opatření (§ 74 a násl.).',
          icon: BookOpen,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50 border-indigo-100',
          badge: 'Rychlý přehled'
        },
        {
          id: 'sos-ai',
          tab: 'ai-assistant',
          label: 'AI Asistent – nouzový režim',
          desc: 'Rychlá krizová analýza vaší situace a okamžité doporučení procesních kroků.',
          icon: Sparkles,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50 border-teal-100',
          badge: 'SOS AI Rozbor'
        }
      ]
    };
  }

  // 5. Výživné & Kalkulačka
  if (normalizedKey === 'vyzivne') {
    return {
      key: 'vyzivne',
      title: 'Související materiály k výživnému',
      subtitle: 'Nástroje pro stanovení a úpravu výživného na dítě.',
      badge: 'Kontext: Výživné',
      items: [
        {
          id: 'vyz-plan',
          tab: 'plan-pece',
          label: 'Plán péče o dítě',
          desc: 'Připravte návrh rozdělení péče pro soud včetně nákladů na výchovu.',
          icon: Calculator,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50 border-indigo-100'
        },
        {
          id: 'vyz-vzory',
          tab: 'ke-stazeni',
          label: 'Vzory podání k výživnému',
          desc: 'Stáhněte si certifikovaný návrh na úpravu výživného.',
          icon: FileText,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50 border-emerald-100'
        },
        {
          id: 'vyz-judi',
          tab: 'judikatura',
          label: 'Judikatura k výživnému',
          desc: 'Rozsudky Ústavního a Nejvyššího soudu k odůvodněným potřebám dítěte.',
          icon: Scale,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50 border-amber-100'
        }
      ]
    };
  }

  // 6. Plán péče & Simulátor
  if (normalizedKey === 'plan-pece' || normalizedKey === 'care-simulator' || normalizedKey === 'pece-o-dite') {
    return {
      key: 'plan-pece',
      title: 'Související moduly pro střídavou péči',
      subtitle: 'Komunikační a výpočetní podklady pro dohodu s druhým rodičem.',
      badge: 'Kontext: Plán péče',
      items: [
        {
          id: 'plan-calc',
          tab: 'vyzivne',
          label: 'Kalkulačka výživného',
          desc: 'Spočítejte orientační výši alimentů podle podílu péče.',
          icon: Calculator,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50 border-teal-100'
        },
        {
          id: 'plan-hub',
          tab: 'coparent-hub',
          label: 'Rodičovský hub',
          desc: 'Bezpečné nástroje pro neutrální komunikaci s druhým rodičem.',
          icon: Briefcase,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 border-blue-100'
        },
        {
          id: 'plan-ai',
          tab: 'ai-assistant',
          label: 'AI Průvodce řízením',
          desc: 'Vygenerujte strategii a argumentaci pro jednání s OSPOD.',
          icon: Sparkles,
          color: 'text-rose-600',
          bgColor: 'bg-rose-50 border-rose-100'
        }
      ]
    };
  }

  // 7. Judikatura & Případová databáze
  if (normalizedKey === 'judikatura' || normalizedKey === 'pripadova-databaze') {
    return {
      key: 'judikatura',
      title: 'Právní zdroje a judikatura',
      subtitle: 'Judikátní argumentace a ověřené právní základy.',
      badge: 'Kontext: Judikatura',
      items: [
        {
          id: 'judi-wiki',
          tab: 'legal-wiki',
          label: 'Právní minimum',
          desc: 'Základní právní pojmy, paragrafy OZ a procesní záruky.',
          icon: BookOpen,
          color: 'text-slate-700',
          bgColor: 'bg-slate-100 border-slate-200'
        },
        {
          id: 'judi-vzory',
          tab: 'ke-stazeni',
          label: 'Vzory návrhů a podání',
          desc: 'Certifikované formuláře s přímými citacemi judikátů.',
          icon: FileText,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50 border-emerald-100'
        },
        {
          id: 'judi-ai',
          tab: 'ai-assistant',
          label: 'AI Právní Poradce',
          desc: 'Zeptejte se AI na aplikaci konkrétního judikátu na vaši situaci.',
          icon: Sparkles,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 border-purple-100'
        }
      ]
    };
  }

  // 8. Výchozí fallback (pro všechny ostatní nezařazené sekce)
  return {
    key: 'default',
    title: 'Mohlo by vás zajímat & Související materiály',
    subtitle: 'Doporučené navazující kroky, vzory a nástroje pro váš procesní úspěch.',
    badge: 'Kontext: Doporučené moduly',
    items: [
      {
        id: 'def-ai',
        tab: 'ai-assistant',
        label: 'AI Právní asistent',
        desc: 'Odborná konzultace vašeho opatrovnického dotazu v reálném čase s Gemini AI.',
        icon: Sparkles,
        color: 'text-teal-600',
        bgColor: 'bg-teal-50 border-teal-100',
        badge: 'Rychlá konzultace'
      },
      {
        id: 'def-templates',
        tab: 'ke-stazeni',
        label: 'Vzory podání',
        desc: 'Editovatelné formuláře a návrhy pro soudy a OSPOD ke stažení.',
        icon: FileText,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50 border-emerald-100',
        badge: 'Ke stažení'
      },
      {
        id: 'def-support',
        tab: 'support',
        label: 'Podpora projektu',
        desc: 'Podpořte provoz nezávislého portálu a infrastruktury bez reklam.',
        icon: Heart,
        color: 'text-rose-600',
        bgColor: 'bg-rose-50 border-rose-100',
        badge: 'Měsíční rozpočet'
      }
    ]
  };
}

export default function RelatedContent({ activeTab, setActiveTab }: RelatedContentProps) {
  const [currentHashOrPath, setCurrentHashOrPath] = useState<string>('');

  useEffect(() => {
    const updateLocation = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      setCurrentHashOrPath(hash || path || activeTab);
    };

    updateLocation();

    window.addEventListener('hashchange', updateLocation);
    window.addEventListener('popstate', updateLocation);

    return () => {
      window.removeEventListener('hashchange', updateLocation);
      window.removeEventListener('popstate', updateLocation);
    };
  }, [activeTab]);

  // Determine current recommendation config
  const config = useMemo(() => {
    // Prefer hash if available and non-empty, otherwise activeTab
    const keyToUse = (currentHashOrPath && currentHashOrPath !== '/' && currentHashOrPath !== '#') 
      ? currentHashOrPath 
      : activeTab;
    return getContextRecommendations(keyToUse);
  }, [activeTab, currentHashOrPath]);

  return (
    <div className="mt-12 pt-8 border-t border-slate-200/80 space-y-6" id="mohlo-by-vas-zajimat">
      {/* Header with context badge */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-teal-50 border border-teal-200/70 text-teal-800 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1">
              <Compass className="w-3 h-3 text-teal-600" />
              {config.badge}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-teal-600" />
            {config.title}
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            {config.subtitle}
          </p>
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50 shrink-0">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Dynamická kontextová synchronizace v4.2
        </span>
      </div>

      {/* Animated Grid of Contextual Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={config.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {config.items.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id || item.tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.06 }}
                onClick={() => {
                  setActiveTab(item.tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`p-2.5 rounded-xl border transition-colors ${item.bgColor} ${item.color}`}>
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-display group-hover:text-teal-700 transition-colors flex items-center justify-between">
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all shrink-0 ml-1" />
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-teal-700 font-bold group-hover:text-teal-600 transition-colors">
                  <span>Otevřít modul</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Alias export for alternate component naming
export const ContextRecommendations = RelatedContent;
export const RelatedModules = RelatedContent;
