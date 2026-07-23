/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: ZdraviVyvojPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function ZdraviVyvojPage(props: CategoryPageProps) {
  const categorySlug = 'zdravi-vyvoj';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Právo otce na zdravotnickou dokumentaci',
      content: 'Dle zákona o zdravotních službách je ošetřující lékař povinen poskytnout otci informace o zdravotním stavu dítěte a nahlédnutí do dokumentace.'
    },
    {
      title: 'Rozhodování o významných zdravotních zákrocích',
      content: 'Planované operace, změna ošetřujícího lékaře, vakcinace či psychiatrická péče vyžadují vědomý souhlas obou rodičů.'
    },
    {
      title: 'Právo na Ošetřování člena rodiny (OČR)',
      content: 'Otec má v době své péče o nemocné dítě plné právo na čerpání ošetřovného (OČR) ze svého zaměstnání.'
    },
    {
      title: 'Předávání léků a zdravotních instrukcí',
      content: 'Povinnost obou rodičů předávat si léky, zdravotní průkaz a instrukce lékaře při předávání dítěte.'
    }
  ];

  const actionSteps = [
    'Navštivte pediatra a doložte mu rodný list dítěte a své kontaktní údaje.',
    'Požádejte lékaře o zřízení přístupu do elektronické zdravotní karty.',
    'Při odmítnutí informací lékařem podejte písemnou žádost s odkazem na zákon.',
    'Uchovávejte si všechny lékařské zprávy v osobní složce dítěte.'
  ];

  const recommendedTemplates = [
    { title: 'Žádost lékaři o poskytnutí zdravotní dokumentace', desc: 'Formální výzva pro pediatra', type: 'DOCX' },
    { title: 'Nesouhlas s nepodstatným zdravotním zákrokem', desc: 'Podání při sporu o léčbu', type: 'DOCX' }
  ];

  return (
    <CategoryPageLayout
      title="Zdraví, vývoj a péče"
      categorySlug={categorySlug}
      icon="🏥"
      subtitle="Rovnoprávný přístup otce k lékařské péči, očkování a řešení zdravotních stavů dítěte."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
