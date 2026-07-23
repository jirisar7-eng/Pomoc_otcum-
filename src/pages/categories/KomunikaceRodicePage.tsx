/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: KomunikaceRodicePage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function KomunikaceRodicePage(props: CategoryPageProps) {
  const categorySlug = 'komunikace-rodice';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Metoda BIFF (Brief, Informative, Friendly, Firm)',
      content: 'Zlatý standard komunikace s konfliktním rodičem: pište zprávy stručné, informativní, přátelské a pevné, bez emocionálních výčitek.'
    },
    {
      title: 'Digitální stopy a příprava na soudní dokazování',
      content: 'Pamatujte, že každá SMS, e-mail či zpráva na WhatsAppu může být použita jako důkazní materiál u opatrovnického soudu.'
    },
    {
      title: 'Využití specializovaných rodičovských aplikací',
      content: 'Používání aplikací se sdíleným kalendářem, přehledem výdajů a neupravitelnou historií zpráv pro snížení třecích ploch.'
    },
    {
      title: 'Technika "Hranice a nereagování na provokace"',
      content: 'Jak věcně ignorovat osobní urážky a odpovídat pouze na konkrétní dotazy týkající se logistiky a potřeb dítěte.'
    }
  ];

  const actionSteps = [
    'Před odesláním každé zprávy si ji přečtěte očima opatrovnického soudce.',
    'Přejděte výhradně na písemnou komunikaci (e-mail, SMS, rodičovská aplikace).',
    'Odpovídejte do 24 hodin, chladně, věcně a k věci.',
    'Archivujte veškerou komunikační historii na bezpečné cloudové úložiště.'
  ];

  const recommendedTemplates = [
    { title: 'Zásady komunikace BIFF pro vytištění', desc: 'Přehledový tahák na pracovní stůl', type: 'PDF' },
    { title: 'Vzor výzvy k přechodu na písemnou komunikaci', desc: 'Formální dopis pro druhého rodiče', type: 'DOCX' }
  ];

  return (
    <CategoryPageLayout
      title="Komunikace s druhým rodičem"
      categorySlug={categorySlug}
      icon="🗣️"
      subtitle="Asistent pro věcnou komunikaci, pravidla bez emocí a budování písemných stop."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
