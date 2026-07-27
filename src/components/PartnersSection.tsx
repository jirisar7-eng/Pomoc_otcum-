import React, { useState } from 'react';
import { Partner } from '../types';
import { Search, Share2, MapPin, ExternalLink, ShieldCheck, HeartHandshake, Server, Award, Sparkles } from 'lucide-react';

interface PartnersSectionProps {
  partners: Partner[];
}

export default function PartnersSection({ partners = [] }: PartnersSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Všichni partneři' },
    { id: 'Poradna', label: 'Poradny' },
    { id: 'Advokát', label: 'Advokáti' },
    { id: 'Psycholog', label: 'Psychologové' },
    { id: 'Mediátor', label: 'Mediátoři' },
    { id: 'Ostatní', label: 'Ostatní & Technologičtí' }
  ];

  const filteredPartners = partners.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="partners-page-root">
      {/* Hero Header */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500 rounded-full blur-3xl opacity-10 -translate-y-20 translate-x-20"></div>
        <div className="relative max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-teal-400" />
            <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider font-mono">Prověřená síť kontaktů & Sponzoři</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight font-display">
            Spolupracující partneři, sponzoři & odborníci
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Věříme, že v náročných opatrovnických sporech je klíčová podpora opravdových odborníků i silných technologických partnerů. Zde naleznete seznam našich doporučených partnerů a sponzorů, kteří sdílejí naše hodnoty a pomáhají zajišťovat stabilní chod portálu pro táty i mámy.
          </p>
        </div>
      </div>

      {/* Official Technology Sponsor Banner - WEDOS Internet, a.s. */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 rounded-3xl border-2 border-teal-500/40 p-6 md:p-8 text-white shadow-2xl relative overflow-hidden space-y-4" id="wedos-official-sponsor-banner">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-md border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
              <img 
                src="https://vedos.cz/wp-content/uploads/2025/03/VEDOS-Hosting-logo.svg" 
                alt="WEDOS Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://www.wedos.cz/wp-content/uploads/2025/03/VEDOS-Hosting-logo.svg";
                }}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3 text-teal-400" />
                  Oficiální technologický partner & Webhosting
                </span>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full">
                  ★ Sponzor projektu
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black font-display text-white">
                WEDOS Internet, a.s. &mdash; Webhosting NoLimit
              </h2>
              <p className="text-slate-200 text-xs md:text-sm leading-relaxed max-w-3xl">
                Společnost <strong>WEDOS Internet, a.s.</strong> poskytla projektu <em>„Táta má právo“</em> bezplatnou technologickou podporu a profesionální webhosting <strong>NoLimit</strong>. Díky této sponzorské záštitě běží náš portál na rychlé, bezpečné a stabilní české infrastruktuře.
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2.5">
            <a
              href="https://www.wedos.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-center"
            >
              <span>Navštívit WEDOS.cz</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <span className="text-[10px] text-slate-400 text-center font-mono">
              Sponzorováno v rámci podpory neziskových projektů
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 md:p-6 shadow-3xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Hledat podle jména, popisu nebo kraje..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-hidden transition-all"
            />
          </div>
          <div className="text-slate-400 text-xs font-mono">
            Nalezeno: <strong className="text-slate-700 font-extrabold">{filteredPartners.length}</strong> specialistů
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 border-teal-700 text-white shadow-3xs'
                  : 'bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Grid Title */}
      {filteredPartners.some(p => p.isRecommended) && (
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-1.5">
            <span className="text-amber-400">★</span> Doporučení specialisté s ověřenou praxí
          </h2>
          <p className="text-[11px] text-slate-400">U těchto partnerů garantujeme profesionální a lidský přístup ke klientským situacím.</p>
        </div>
      )}

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners
          .sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0))
          .map((partner) => (
            <div
              key={partner.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between p-5 ${
                partner.isRecommended
                  ? 'border-teal-200 bg-gradient-to-br from-teal-50/10 to-white shadow-2xs relative overflow-hidden'
                  : 'border-slate-100 hover:border-slate-200 shadow-3xs'
              }`}
            >
              {partner.isRecommended && (
                <div className="absolute top-0 right-0 bg-teal-600 text-white text-[8px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-bl-xl flex items-center gap-1 font-mono">
                  <span>★</span> DOPORUČUJEME
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="w-12 h-12 rounded-xl object-contain p-1 bg-white border border-slate-100 shadow-3xs shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (partner.link.includes('wedos')) {
                          (e.target as HTMLImageElement).src = "https://www.wedos.cz/wp-content/uploads/2025/03/VEDOS-Hosting-logo.svg";
                        }
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-100/50 flex items-center justify-center font-black text-sm font-display shadow-3xs shrink-0">
                      {partner.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-extrabold text-slate-800 text-sm font-display leading-tight">{partner.name}</h3>
                      <span className="text-[8px] font-bold uppercase px-1.5 py-0.2 bg-slate-100 text-slate-500 border border-slate-200/50 rounded">
                        {partner.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{partner.region}</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed min-h-[60px]">
                  {partner.description}
                </p>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100/60 flex items-center justify-between">
                <span className="text-[9px] text-slate-400 font-mono">
                  Přidáno: {new Date(partner.createdAt).toLocaleDateString('cs-CZ')}
                </span>

                <a
                  href={partner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-700 hover:text-white bg-teal-50 hover:bg-teal-600 px-3 py-1.5 rounded-lg transition-all cursor-pointer border border-teal-100"
                >
                  <span>Kontaktovat</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}

        {filteredPartners.length === 0 && (
          <div className="col-span-full bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-2">
            <p className="text-slate-400 text-xs font-mono">
              Žádný partner neodpovídá zvoleným filtrům.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="text-xs text-teal-600 font-bold hover:underline"
            >
              Resetovat filtry a hledání
            </button>
          </div>
        )}
      </div>

      {/* Legal Partnership Footer & Assistance Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 rounded-3xl border border-slate-800 p-6 md:p-8 text-white space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full">
              Individuální pomoc v opatrovnické tísni
            </span>
            <h3 className="text-xl font-black font-display text-white">
              Potřebujete pomoci se sepsáním konkrétního návrhu k soudu nebo vyhledáním konkrétní pobočky či služby ve vašem okrese?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Využijte náš chytrý AI Generátor právních podání nebo kontaktujte naše prověřené spolkem doporučené advokáty a mediátory.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <a
              href="#centrum-formularu"
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Centrum formulářů a návrhů</span>
            </a>
            <a
              href="#ai-case-manager"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <span>AI Asistent & Generátor</span>
            </a>
          </div>
        </div>
      </div>

      {/* Legal Partnership Contact Footer */}
      <div className="bg-gradient-to-br from-slate-50 to-teal-50/20 rounded-2xl border border-slate-100 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100/60 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5.5 h-5.5 text-teal-700" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-800">Chcete se stát naším doporučeným partnerem?</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Pokud poskytujete odborné poradenské nebo právní služby s orientací na rodinné právo, ozvěte se nám.</p>
          </div>
        </div>
        <a
          href="mailto:sarji@seznam.cz"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors shrink-0 text-center"
        >
          Kontaktovat pro spolupráci
        </a>
      </div>
    </div>
  );
}
