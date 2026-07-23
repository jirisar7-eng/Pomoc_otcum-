/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: StatistikyVyzkumyPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function StatistikyVyzkumyPage(props: CategoryPageProps) {
  const categorySlug = 'statistiky-vyzkumy';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Oficiální statistiky Ministerstva spravedlnosti ČR',
      content: 'Vývoj rozhodování českých okresních a krajských soudů: podíly výhradní péče matky, výhradní péče otce a střídavé/společné péče za poslední desetiletí.'
    },
    {
      title: 'Dopady péče na školní a psychické výsledky dětí',
      content: 'Tvrdá data o akademickém prospěchu, emocionální stabilitě a zdravotním stavu dětí vyrůstajících v různých modelech posuzování péče.'
    },
    {
      title: 'Mezinárodní srovnání v rámci EU a OECD',
      content: 'Jak funguje střídavá péče v kandinávských zemích (Švédsko, Norsko), Belgii, Francii a Německu v porovnání s ČR.'
    },
    {
      title: 'Využití statistických dat při soudní argumentaci',
      content: 'Jak prezentovat grafy a statistické trendy soudcům a OSPOD pro demonstraci celospolečenského posunu k rovnoprávnému otcovství.'
    }
  ];

  const actionSteps = [
    'Stáhněte si naši aktuální ročenku statistik Ministerstva spravedlnosti ČR.',
    'Zapracujte přehledné grafy vývoje střídavé péče do Vašeho soudního návrhu.',
    'Argumentujte mezinárodními standardy EU při diskusích na OSPOD.',
    'Sledujte pravidelné aktualizace dat na našem portálu.'
  ];

  const recommendedTemplates = [
    { title: 'Statistická ročenka opatrovnického soudnictví ČR', desc: 'Oficiální data k vytištění', type: 'PDF' },
    { title: 'Grafická prezentace výhod střídavé péče pro soud', desc: 'Prezentační podklad v PDF', type: 'PDF' }
  ];

  return (
    <CategoryPageLayout
      title="Statistiky a výzkumy"
      categorySlug={categorySlug}
      icon="📊"
      subtitle="Tvrdá data, statistiky Ministerstva spravedlnosti ČR a světové výzkumy o rodinném právu."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
