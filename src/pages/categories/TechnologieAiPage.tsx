/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: TechnologieAiPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function TechnologieAiPage(props: CategoryPageProps) {
  const categorySlug = 'technologie-ai';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Využití umělé inteligence v opatrovnických sporech',
      content: 'Jak používat pokročilé prompty k analýze soudních protokolů, hledání rozporů ve výpovědích a formulaci věcných argumentů.'
    },
    {
      title: 'Bezpečná digitální archivace s časovým razítkem',
      content: 'Ukládání fotografií, SMS zpráv, audiozáznamů a protokolů na šifrovaná cloudová úložiště s garancí integrity.'
    },
    {
      title: 'Aplikace pro správu sdíleného rodičovství',
      content: 'Přehled nejlepších nástrojů pro sdílení kalendářů, výdajů na kroužky a zdravotní péči s neupravitelnou historií.'
    },
    {
      title: 'Ochrana soukromí a kybernetická bezpečnost otce',
      content: 'Zabezpečení účtů, dvoufázové ověření, kontrola sdílení polohy a prevence zneužití osobních dat.'
    }
  ];

  const actionSteps = [
    'Zřiďte si bezpečný cloudový archiv pro veškerou opatrovnickou dokumentaci.',
    'Vyzkoušejte naše AI prompty pro simulaci otázek opatrovnického soudce.',
    'Navrhněte protistraně využívání sdílené rodičovské aplikace pro výdaje.',
    'Pravidelně zálohujte zprávy z telefonu do formátu PDF.'
  ];

  const recommendedTemplates = [
    { title: 'Sada AI promptů pro rozbor opatrovnického spisu', desc: 'Textové instrukce pro ChatGPT / Gemini', type: 'TXT / DOCX' },
    { title: 'Průvodce digitálním archivem pro otce', desc: 'Návod na bezpečné ukládání důkazů', type: 'PDF' }
  ];

  return (
    <CategoryPageLayout
      title="Technologie a AI pro táty"
      categorySlug={categorySlug}
      icon="💻"
      subtitle="Využití moderních nástrojů, umělé inteligence a bezpečné správy digitálních důkazů."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
