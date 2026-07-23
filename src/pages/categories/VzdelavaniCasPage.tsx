/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: VzdelavaniCasPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function VzdelavaniCasPage(props: CategoryPageProps) {
  const categorySlug = 'vzdelavani-cas';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Právo na přístup do e-žákovské knížky (Bakaláři/Edookit)',
      content: 'Škola je ze zákona povinna zřídit otci samostatné přihlašovací údaje do školních informačních systémů a zasílat veškeré zprávy.'
    },
    {
      title: 'Výběr materské, základní a střední školy',
      content: 'Volba vzdělávací instituce je podstatnou záležitostí. Jednostranné přihlášení či odhlášení matkou bez souhlasu otce je protiprávní.'
    },
    {
      title: 'Účast na třídních schůzkách a školních akcích',
      content: 'Otec má plné právo navštěvovat třídní schůzky, besídky, besedy a doprovázet dítě na školní výlety.'
    },
    {
      title: 'Organizování zájmové činnosti a kroužků',
      content: 'Kroužky organizované v době péče jednoho rodiče nesmí nepřiměřeně zasahovat do doby péče druhého rodiče bez dohody.'
    }
  ];

  const actionSteps = [
    'Odeslete řediteli školy písemnou žádost o zřízení samostatného účtu v e-žákovské.',
    'Informujte školu, že jste zákonným zástupcem s plnou rodičovskou odpovědností.',
    'Při neshodě o vývěru školy podejte návrh na nahrazení souhlasu druhého rodiče.',
    'Aktivně se účastněte všech školních a zájmových akcí dítěte.'
  ];

  const recommendedTemplates = [
    { title: 'Žádost škole o zřízení přístupu do e-žákovské', desc: 'Výzva řediteli školy / školky', type: 'DOCX' },
    { title: 'Návrh na nahrazení souhlasu rodiče s výběrem školy', desc: 'Podání k opatrovnickému soudu', type: 'DOCX' }
  ];

  return (
    <CategoryPageLayout
      title="Vzdělávání a volný čas"
      categorySlug={categorySlug}
      icon="🏫"
      subtitle="Zapojení otce do chodu školy, školky, výběru kroužků a zájmových aktivit."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
