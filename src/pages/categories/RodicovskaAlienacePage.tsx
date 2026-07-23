/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: RodicovskaAlienacePage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function RodicovskaAlienacePage(props: CategoryPageProps) {
  const categorySlug = 'rodicovska-alienace';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Identifikace syndromu zavrženého rodiče (PAS)',
      content: 'Varovné signály: bezdůvodná nenávist k otci, používání dospělých frází matky, absence pocitu viny u dítěte, očerňování prarodičů.'
    },
    {
      title: 'Sběr neprůstřelných důkazů o manipulaci',
      content: 'Písemná komunikace, nahrávky předávání dětí, výpovědi nezávislých svědků a posudky dětských psychologů.'
    },
    {
      title: 'Právní kroky a sankce za maření styku',
      content: 'Návrhy na uložení pokut dle § 501 z.ř.s., nařízení rodinné terapie, předběžná opatření a návrh na změnu výchovného prostředí.'
    },
    {
      title: 'Jak komunikovat s manipulovaným dítětem',
      content: 'Trpělivost, neútočení na matku před dítětem, ujišťování o bezpodmínečné lásce a stálá přítomnost v životě dítěte.'
    }
  ];

  const actionSteps = [
    'Okamžitě začněte vést detailní deník všech zmařených kontaktů a výmluv.',
    'Podávejte návrhy na Výkon rozhodnutí (pokuty) za každé bezdůvodné nepředání.',
    'Trvejte na jmenování soudního znalce se specializací na rodičovskou alienaci.',
    'Nikdy se nenechte vyprovokovat k hádce před dítětem.'
  ];

  const recommendedTemplates = [
    { title: 'Návrh na výkon rozhodnutí (pokuta za maření)', desc: 'Exekuční návrh na OSPOD a soud', type: 'DOCX' },
    { title: 'Návrh na nařízení rodinné terapie', desc: 'Podání pro obnovu narušeného vztahu', type: 'DOCX' }
  ];

  return (
    <CategoryPageLayout
      title="Rodičovská alienace (PAS)"
      categorySlug={categorySlug}
      icon="🧩"
      subtitle="Rozpoznání syndromu zavrženého rodiče, prevence manipulace a právní obrana."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
