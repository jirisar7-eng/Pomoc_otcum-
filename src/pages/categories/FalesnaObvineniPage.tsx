/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: FalesnaObvineniPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function FalesnaObvineniPage(props: CategoryPageProps) {
  const categorySlug = 'falesna-obvineni';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Anatomie a mechanismus účelových obvinění',
      content: 'Proč k falešným obviněním z domácího násilí či zneužívání dochází v rozvodových bojích (snaha o zamezení styku a získání výhradní péče).'
    },
    {
      title: 'Správná reakce při výslechu na Policii ČR',
      content: 'Trvejte na přítomnosti advokáta od první minuty. Nevypovídejte ve stresu, vypovídejte uváženě a požadujte protokolování všech faktů.'
    },
    {
      title: 'Aktivní dokazování neviny a alibi',
      content: 'Zajištění výpisů z GPS, kamerových záznamů, svědectví, e-mailů a časových razítek, které jednoznačně vyvracejí vykonstruovaná tvrzení.'
    },
    {
      title: 'Trestní odpovědnost za křivé obvinění (§ 345 TZ)',
      content: 'Postup při podání trestního oznámení na oznamovatele po pravomocném odložení či zproštění viny.'
    }
  ];

  const actionSteps = [
    'Při jakémkoli podezření na křivé obvinění okamžitě kontaktujte advokáta.',
    'Zálohujte si GPS historii v telefonu, zprávy a svědecké kontakty.',
    'Na Policii ČR vypovídejte výhradně za přítomnosti svého obhájce.',
    'Po vyvrácení obvinění trvejte na vyvození trestní odpovědnosti protistrany.'
  ];

  const recommendedTemplates = [
    { title: 'Trestní oznámení pro křivé obvinění (§ 345 TZ)', desc: 'Podání na PČR po vyvrácení nařčení', type: 'DOCX' },
    { title: 'Manuál pro první výslech na PČR', desc: 'Metodická příručka pro obviněného otce', type: 'PDF' }
  ];

  return (
    <CategoryPageLayout
      title="Falešná obvinění a ochrana práv"
      categorySlug={categorySlug}
      icon="🛡️"
      subtitle="Účinná obrana proti vykonstruovaným obviněním z domácího násilí či ohrožování mravní výchovy."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
