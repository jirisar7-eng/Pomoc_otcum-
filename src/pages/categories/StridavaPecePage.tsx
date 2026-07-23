/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function StridavaPecePage(props: CategoryPageProps) {
  const categorySlug = 'stridava-pece';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Modely uspořádání střídavé péče',
      content: 'Přehled osvědčených modelů: týden/týden pro školáky, cyklus 2-2-3 pro batolata, dvoutýdenní střídání pro teenagery.'
    },
    {
      title: 'Vyvrácení mýtu o "dvoji domově a zmatení dítěte"',
      content: 'Vědecké výzkumy (Bauserman, Fransson) jednoznačně prokazují, že děti ve střídavé péči prospívají srovnatelně s dětmi z úplných rodin.'
    },
    {
      title: 'Budování rovnocenných podmínek v obou domovech',
      content: 'Praktický návod na zajištění vlastního pokoje, oblečení, hraček a školních potřeb bez nutnosti neustálého balení kufru.'
    },
    {
      title: 'Předávání dětí bez konfliktů',
      content: 'Doporučení pro výběr neutrálních míst předávání (škola, školka, zájmové kroužky) ke snížení rodičovského napětí.'
    }
  ];

  const actionSteps = [
    'Sestavte si podrobný návrh harmonogramu střídavé péče odpovídající věku dítěte.',
    'Přípravte dětský pokoj ve svém domově s veškerým vybavením.',
    'Prokažte u soudu svou časovou flexibilitu a připravenost na péči.',
    'Navrhněte předávání dětí primárně přes vzdělávací zařízení.'
  ];

  const recommendedTemplates = [
    { title: 'Rodičovská dohoda o střídavé péči', desc: 'Komplexní vzor dohody rodičů', type: 'DOCX' },
    { title: 'Harmonogram péče 2-2-3', desc: 'Kalendářní plán pro mladší děti', type: 'PDF' }
  ];

  return (
    <CategoryPageLayout
      title="Střídavá a společná péče"
      categorySlug={categorySlug}
      icon="🤝"
      subtitle="Modely, organizace střídání, praxe, vyvracení mýtů a budování stabilního dvojího domova."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
