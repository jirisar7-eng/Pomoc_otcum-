/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: VyzivneMajetekPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function VyzivneMajetekPage(props: CategoryPageProps) {
  const categorySlug = 'vyzivne-majetek';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Doporučující tabulky Ministerstva spravedlnosti ČR',
      content: 'Metodika určování výživného podle věku dítěte a procentuálního podílu z čistého příjmu s přihlédnutím k rozsahu osobní péče.'
    },
    {
      title: 'Započtení osobní péče při střídavé péči',
      content: 'Při rovnocenné péči by výživné mělo reflektovat skutečnost, že otec hradí polovinu všech životních nákladů dítěte přímo v domácnosti.'
    },
    {
      title: 'Mimořádné náklady vs. běžné výživné',
      content: 'Co vše spadá do běžného alimentu (strava, oblečení, bydlení) a kdy je vyžadována zvláštní dohoda (lyžařské výcviky, rovnátka, tábory).'
    },
    {
      title: 'Vypořádání Společného jmění manželů (SJM)',
      content: 'Férové rozdělení majetku, hypotéky a společných závazků tak, aby nedošlo k finanční likvidaci otce.'
    }
  ];

  const actionSteps = [
    'Spočítejte si doporučené výživné pomocí naší kalkulačky.',
    'Připravte si přehledný soupis všech svých přímých nákladů na dítě.',
    'Doložte své reálné příjmy a daňová přiznání za poslední 3 roky.',
    'Trvejte na přesné definici toho, co je a není zahrnuto v běžném výživném.'
  ];

  const recommendedTemplates = [
    { title: 'Návrh na úpravu / snížení výživného', desc: 'Vzor při změně péče nebo příjmů', type: 'DOCX' },
    { title: 'Přehledový formulář nákladů na dítě', desc: 'Excelová tabulka pro soudní jednání', type: 'XLSX' }
  ];

  return (
    <CategoryPageLayout
      title="Výživné a majetkové vyrovnání"
      categorySlug={categorySlug}
      icon="💶"
      subtitle="Výpočet přiměřeného výživného, krytí mimořádných nákladů a vypořádání majetku."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
