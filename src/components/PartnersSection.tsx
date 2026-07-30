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

      {/* Official Technology Sponsors Section - VEDOS & FORPSI */}
      <div className="space-y-4" id="official-sponsors-section">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-extrabold text-slate-900 font-display">
            Oficiální sponzoři infrastruktury & partnerství
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* VEDOS Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 rounded-3xl border-2 border-teal-500/40 p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4" id="vedos-official-sponsor-banner">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-md border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://vedos.cz/wp-content/uploads/2025/03/VEDOS-Hosting-logo.svg" 
                    alt="VEDOS Logo" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Award className="w-3 h-3 text-teal-400" />
                      Sponzor Webhostingu
                    </span>
                    <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full">
                      ★ Webhosting NoLimit
                    </span>
                  </div>
                  <h3 className="text-lg font-black font-display text-white leading-tight">
                    VEDOS Internet, a.s.
                  </h3>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Společnost <strong>VEDOS Internet, a.s.</strong> poskytla projektu <em>„Táta má právo“</em> bezplatnou technologickou podporu a profesionální webhosting <strong>NoLimit</strong> pro rychlý, bezpečný a stabilní chod.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-800 relative z-10">
              <a
                href="https://www.vedos.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Navštívit VEDOS.cz</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] text-slate-400 font-mono">Česko / Hluboká n. Vlt.</span>
            </div>
          </div>

          {/* FORPSI Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 rounded-3xl border-2 border-blue-500/40 p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4" id="forpsi-official-sponsor-banner">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-md border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://forpsi.com/Forpsi/media/Forpsi/General/logo.svg" 
                    alt="FORPSI Logo" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://www.forpsi.com/Forpsi/media/Forpsi/General/logo.svg";
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Award className="w-3 h-3 text-blue-400" />
                      Sponzor Domény
                    </span>
                    <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full">
                      ★ Doména tatovacesta.cz
                    </span>
                  </div>
                  <h3 className="text-lg font-black font-display text-white leading-tight">
                    FORPSI (Internet CZ, a.s.)
                  </h3>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Společnost <strong>FORPSI</strong> (Internet CZ, a.s.) se stala oficiálním sponzorem doménové infrastruktury a věnovala bezplatnou registrovaci domény <strong>tatovacesta.cz</strong> pro náš projekt.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-800 relative z-10">
              <a
                href="https://www.forpsi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Navštívit FORPSI.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] text-slate-400 font-mono">Česko / Ktiš</span>
            </div>
          </div>

          {/* Facebook Group Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-3xl border-2 border-indigo-500/40 p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4" id="facebook-group-sponsor-banner">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-md border border-blue-400 shrink-0 flex items-center justify-center font-bold text-2xl font-mono">
                  fb
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-indigo-400" />
                      Oficiální Skupina
                    </span>
                    <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full">
                      ★ Rozšíření obsahu
                    </span>
                  </div>
                  <h3 className="text-lg font-black font-display text-white leading-tight">
                    Facebook Komunita
                  </h3>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Oficiální skupina určená pro táty i mámy v opatrovnických situacích. Komunitní diskuse, sdílení rád a rozšíření obsahu portálu <strong>Táta má právo</strong> na sociální sítě.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-800 relative z-10">
              <a
                href="https://www.facebook.com/share/g/19HoPx33mn/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Připojit se ke skupině</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] text-slate-400 font-mono">Facebook Group</span>
            </div>
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
                        if (partner.link.includes('vedos') || partner.link.includes('wedos')) {
                          (e.target as HTMLImageElement).src = "https://vedos.cz/wp-content/uploads/2025/03/VEDOS-Hosting-logo.svg";
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
