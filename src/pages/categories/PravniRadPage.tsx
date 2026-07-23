/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';

export interface CategoryPageProps {
  setActiveTab?: (tab: string) => void;
  setSearchQuery?: (query: string) => void;
}

export default function PravniRadPage(props: CategoryPageProps) {
  const categorySlug = 'pravni-rad';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Základní pilíře zákona a § 858 OZ',
      content: 'Rodičovská odpovědnost dle § 858 občanského zákoníku představuje ucelený soubor práv a povinností obou rodičů při péči o dítě, jeho osobnostní vývoj, zastupování a správu jeho jmění.'
    },
    {
      title: 'Princip rovnoprávnosti matky a otce',
      content: 'České rodinné právo staví na rovném postavení obou rodičů. Žádný právní předpis nedává matce přednostní právo na výchovu či péči.'
    },
    {
      title: 'Mezinárodní úmluvy a Článek 9 Úmluvy o právech dítěte',
      content: 'Dítě má nezadatelné právo udržovat pravidelné osobní kontakty s oběma rodiči, ledaže je to v rozporu s jeho nejlepším zájmem.'
    },
    {
      title: 'Praktické prosazování právních nároků otce',
      content: 'Návod jak reagovat na argumentační fauly u opatrovnických soudů, které se snaží omezit roli otce pouze na "platce alimentů a víkendového návštěvníka".'
    }
  ];

  const actionSteps = [
    'Nastudujte základní paragrafy občanského zákoníku (§ 858 až § 909 OZ).',
    'Trvejte na tom, že vaše rodičovská odpovědnost je plnohodnotná a rovnocenná.',
    'Při jednání s úřady vždy argumentujte zájmem dítěte na péči obou rodičů.',
    'Každý pokus o omezení Vašich práv napadněte věcným písemným podáním.'
  ];

  const recommendedTemplates = [
    { title: 'Návrh na péči obou rodičů', desc: 'Vzor úvodního návrhu k opatrovnickému soudu', type: 'DOCX / PDF' },
    { title: 'Žádost o nahlédnutí do spisu', desc: 'Formální žádost pro soud a OSPOD', type: 'PDF' }
  ];

  return (
    <CategoryPageLayout
      title="Právní řád a legislativa"
      categorySlug={categorySlug}
      icon="⚖️"
      subtitle="Zákony, úmluvy, paragrafy občanského zákoníku a jejich praktický výklad pro rodinné právo."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
