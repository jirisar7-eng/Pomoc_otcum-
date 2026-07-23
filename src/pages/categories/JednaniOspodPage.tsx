/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: JednaniOspodPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function JednaniOspodPage(props: CategoryPageProps) {
  const categorySlug = 'jednani-ospod';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Taktika a profesionální vystupování na OSPOD',
      content: 'Jednejte vždy klidně, věcně, s úsměvem a bez osobních útoků na matku. Zaměřte se výhradně na potřeby a nejlepší zájem dítěte.'
    },
    {
      title: 'Zákonná práva otce při jednání s úřadem',
      content: 'Právo na nahlížení do spisu, pořizování fotokopií, přítomnost právního zástupce a pořízení zvukového záznamu z jednání.'
    },
    {
      title: 'Příprava na terénní šetření v bytě otce',
      content: 'Čistý dětský pokoj, postel, pracovní stůl, hračky, věci na hygienu, plná lednice a stabilní, bezpečné prostředí.'
    },
    {
      title: 'Obrana proti zaujatosti a podjatosti úřednice',
      content: 'Postup při podání stížnosti vedoucímu odboru, námitka podjatosti a podnět Krajskému úřadu či Veřejnému ochránci práv (ombudsmanovi).'
    }
  ];

  const actionSteps = [
    'Před každou schůzkou si připravte písemné body, které chcete projednat.',
    'Pravidelně žádat o nahlédnutí do spisu a fotokopie všech písemností.',
    'Z každého jednání si pořizujte detailní písemné zápisy nebo audiozáznam.',
    'Při diskriminaci podejte námitku podjatosti a stížnost vedoucímu úřadu.'
  ];

  const recommendedTemplates = [
    { title: 'Žádost o nahlédnutí do spisu OSPOD', desc: 'Formální žádost dle správního řádu', type: 'DOCX' },
    { title: 'Námitka podjatosti pracovnice OSPOD', desc: 'Stížnost na neobjektivní postup', type: 'DOCX' }
  ];

  return (
    <CategoryPageLayout
      title="Jednání s OSPOD a úřady"
      categorySlug={categorySlug}
      icon="🏢"
      subtitle="Taktika, práva a povinnosti při jednání se sociálními pracovnicemi a orgány sociálně-právní ochrany dětí."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
