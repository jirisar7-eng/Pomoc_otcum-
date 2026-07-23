/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: ZnaleckePosudkyPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function ZnaleckePosudkyPage(props: CategoryPageProps) {
  const categorySlug = 'znalecke-posudky';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Průběh soudního psychologického zkoumání',
      content: 'Klinický rozhovor, psychodiagnostické testy (Rorschach, TAT), pozorování interakce rodiče s dítětem v ordinaci.'
    },
    {
      title: 'Příprava otce na setkání se znalcem',
      content: 'Být autentický, klidný, neútočit na matku, zdůrazňovat vlastní pečovatelské dovednosti a zájem o dítě.'
    },
    {
      title: 'Podání výhrad a námitky proti znaleckému posudku',
      content: 'Metodické chyby znalců, zastaralé testovací metody, zaujatost a formulace výhrad do 15 dnů od doručení.'
    },
    {
      title: 'Žádost o revizní znalecký posudk či konzultanta',
      content: 'Postup při vyžadování revizního posudku ze strany univerzitního pracoviště či přizvání odborného konzultanta.'
    }
  ];

  const actionSteps = [
    'Důkladně si prostudujte metodiku psychologického testování.',
    'Během vyšetření zachovejte absolutní klid a rozvahu.',
    'Po obdržení posudku zkontrolujte všechny faktické údaje a interpretace.',
    'Při pochybnostech konzultujte posudk s nezávislým klinickým psychologem.'
  ];

  const recommendedTemplates = [
    { title: 'Písemné výhrady proti znaleckému posudku', desc: 'Podání s rozborem metodických pochybení', type: 'DOCX' },
    { title: 'Návrh na ustanovení revizního znalce', desc: 'Žádost o přezkoumání univerzitním ústavem', type: 'DOCX' }
  ];

  return (
    <CategoryPageLayout
      title="Znalecké posudky a psychologové"
      categorySlug={categorySlug}
      icon="📝"
      subtitle="Průběh soudně-znaleckého zkoumání rodiny, příprava a obrana proti zaujatým posudkům."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
