/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: VzoryPodaniPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function VzoryPodaniPage(props: CategoryPageProps) {
  const categorySlug = 'vzory-podani';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Soudní návrhy na úpravu péče a styku',
      content: 'Procesně přesné vzory pro zahájení opatrovnického řízení: úprava péče, změna výhradní péče na střídavou, úprava styku o prázdninách.'
    },
    {
      title: 'Předběžná opatření dle § 452 a § 102 z.ř.s.',
      content: 'Rychlé návrhy na úpravu poměrů v akutních situacích (odepření styku, hrozící únos, změna školy bez souhlasu).'
    },
    {
      title: 'Odvolání a vyjádření k opatrovnickému soudu',
      content: 'Strukturovaná odvolání proti rozsudkům okresních soudů doplněná o citace judikatury Ústavního soudu.'
    },
    {
      title: 'Návod na podávání přes datovou schránku',
      content: 'Instrukce jak podávat dokumenty bezplatně přes datovou schránku fyzické osoby s garancí včasného doručení.'
    }
  ];

  const actionSteps = [
    'Vyberte si odpovídající vzor a doplňte Vaše osobní a identifikační údaje.',
    'Přílohy k návrhu očíslujte a přehledně označte.',
    'Odesílejte podání přednostně z Vaší osobní Datové schránky.',
    'Uchovávejte si potvrzení o doručení soudní podatelně.'
  ];

  const recommendedTemplates = [
    { title: 'Kompletní balíček 15 vzorů pro opatrovnický soud', desc: 'Sada všech potřebných návrhů', type: 'ZIP / DOCX' },
    { title: 'Návrh na předběžné opatření - styk', desc: 'Rychlé opatření do 7 dnů', type: 'DOCX' }
  ];

  return (
    <CategoryPageLayout
      title="Vzory podání a žalob"
      categorySlug={categorySlug}
      icon="📄"
      subtitle="Okamžitě použitelné, procesně bezchybné vzory návrhů k soudu a úřadům."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
