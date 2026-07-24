/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: VyzivneMajetekPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';
import VyzivneSection from '../../components/VyzivneSection';
import { Calculator } from 'lucide-react';

export default function VyzivneMajetekPage(props: CategoryPageProps) {
  const categorySlug = 'vyzivne-majetek';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: '1. Doporučující tabulky Ministerstva spravedlnosti ČR',
      content: 'Metodika určování výživného podle věku dítěte (procentuální podíl z čistého příjmu povinného rodiče) s povinným přihlédnutím k rozsahu osobní péče a reálným schopnostem a možnostem rodiče.'
    },
    {
      title: '2. Započtení osobní péče při střídavé péči',
      content: 'Při rovnocenné střídavé péči by výživné mělo plně reflektovat skutečnost, že otec hradí polovinu všech životních nákladů dítěte přímo ve své domácnosti. Soudy přihlížejí k rozdílům v příjmech obou rodičů.'
    },
    {
      title: '3. Mimořádné náklady vs. běžné výživné',
      content: 'Vymezení toho, co spadá do běžného alimentu (strava, ošacení, běžné bydlení) a kdy jsou vyžadovány zvláštní dohody či poměrné hrazení nákladů nad rámec (lyžařské výcviky, rovnátka, tábory, kroužky).'
    },
    {
      title: '4. Vypořádání Společného jmění manželů (SJM)',
      content: 'Férové rozdělení majetku, hypoték a společných závazků tak, aby nedocházelo k ekonomické likvidaci jednoho z rodičů a byly zajištěny bytové potřeby dětí.'
    }
  ];

  const actionSteps = [
    'Spočítejte si doporučené výživné podle tabulek MSp v naší kalkulačce níže.',
    'Připravte si přehledný soupis všech svých přímých nákladů na dítě v rámci vaší péče.',
    'Doložte své reálné příjmy, daňová přiznání a náklady na zajištění bydlení pro dítě.',
    'Trvejte na přesné definici v rozsudku, co spadá do běžného výživného a co jsou mimořádné výdaje.'
  ];

  const recommendedTemplates = [
    { title: 'Návrh na úpravu / snížení výživného (§ 913 OZ)', desc: 'Vzor při změně rozsahu péče nebo příjmových poměrů', type: 'DOCX' },
    { title: 'Přehledový formulář nákladů na dítě a SJM', desc: 'Strukturovaný rozpis pro soudní jednání a vyjednávání', type: 'XLSX' }
  ];

  const calculatorWidget = (
    <div className="space-y-3 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">Interaktivní modul</span>
          <h2 className="text-base font-black text-white font-display">Kalkulačka výživného dle metodiky MSp ČR 2026</h2>
        </div>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">
        Okamžitý orientační výpočet doporučeného výživného podle čistého příjmu, věku dítěte, rozsahu osobní péče a započtení mimořádných nákladů.
      </p>
      <div className="pt-2">
        <VyzivneSection />
      </div>
    </div>
  );

  return (
    <CategoryPageLayout
      title="Výživné a majetkové vyrovnání"
      categorySlug={categorySlug}
      icon="💶"
      subtitle="Výpočet přiměřeného výživného, krytí mimořádných nákladů, napojení na kalkulačku a vypořádání majetku."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      aiButtonText="Položit dotaz AI Asistentovi k výživnému"
      customWidget={calculatorWidget}
      {...props}
    />
  );
}
