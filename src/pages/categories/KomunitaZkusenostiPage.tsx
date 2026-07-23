/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: KomunitaZkusenostiPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function KomunitaZkusenostiPage(props: CategoryPageProps) {
  const categorySlug = 'komunita-zkusenosti';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Příběhy úspěšných tátů se šťastným koncem',
      content: 'Reálné kazuistiky z českých soudů: jak se otcům podařilo po letech bojů dosáhnout rovnoprávné střídavé či společné péče.'
    },
    {
      title: 'Mentorský systém a peer-to-peer podpora',
      content: 'Propojení otců na začátku sporu se zkušenými táty, kteří mají obdobnou zkušenost úspěšně za sebou.'
    },
    {
      title: 'Bezpečné, moderované a anonymní fórum',
      content: 'Pravidla vzájemného respektu, anonymizace osobních údajů dětí a konstruktivní výměna praktických rad.'
    },
    {
      title: 'Regionální svépomocné skupiny a setkání tátů',
      content: 'Srazové aktivity a neformální setkání tátů s dětmi v jednotlivých krajích ČR.'
    }
  ];

  const actionSteps = [
    'Zapojte se do našeho diskusního fóra a sdílejte své zkušenosti.',
    'Požádejte o přidělení zkušeného mentora z vašeho regionu.',
    'Inspirujte se kazuistikami tátů, kteří své případy úspěšně vyhráli.',
    'Pomáhejte novým tátům předáváním ověřených informací.'
  ];

  const recommendedTemplates = [
    { title: 'Průvodce zapojením do mentorského programu', desc: 'Informace pro mentory a mentee', type: 'PDF' },
    { title: 'Pravidla komunity a anonymizace příspěvků', desc: 'Bezpečnostní manuál pro fórum', type: 'PDF' }
  ];

  return (
    <CategoryPageLayout
      title="Komunita a sdílení zkušeností"
      categorySlug={categorySlug}
      icon="🤝"
      subtitle="Příběhy z praxe, vzájemná psychická podpora a síla komunity tátů, kteří si prošli tím samým."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
