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
      title: '1. Taktika a profesionální vystupování na OSPOD',
      content: 'Jednejte vždy klidně, věcně, s úsměvem a bez osobních útoků na druhého rodiče. Zaměřte se výhradně na potřeby, zájmy a nejlepší zájem dítěte. Všechny argumenty podkládejte důkazy, nikoliv pouhými emocemi.'
    },
    {
      title: '2. Zákonná práva otce při jednání s úřadem',
      content: 'Každý otec má dle správního řádu a ZSPOD plné právo na nahlížení do spisu, pořizování fotokopií dokumentů, účast právního zástupce či advokáta na jednáních a pořizování vlastního zvukového záznamu pro doložení průběhu schůzky.'
    },
    {
      title: '3. Příprava na terénní šetření v bytě otce',
      content: 'Jak připravit domácnost na návštěvu sociálních pracovnic – čistý dětský pokoj nebo vyhrazený koutek, řádná postel, psací stůl, hračky, věci na hygienu, plná lednice a stabilní, bezpečné a podnětné prostředí pro dítě.'
    },
    {
      title: '4. Obrana proti zaujatosti a podjatosti úřednice',
      content: 'Postup při podezření na neobjektivní a zaujatý přístup sociální pracovnice – podání námitky podjatosti dle správního řádu, písemná stížnost na postup orgánu a důsledné vyžadování zápisů ze všech schůzek.'
    }
  ];

  const actionSteps = [
    'Před každou schůzkou na OSPOD si připravte písemný seznam bodů a věcných argumentů.',
    'Pravidelně žádejte o nahlédnutí do spisu OSPOD a pořizujte si fotokopie všech písemností a zpráv.',
    'Připravte domácnost na terénní šetření (postel, stůl, hračky, hygiena) a vytvořte pro dítě podnětné prostředí.',
    'Při diskriminaci či neobjektivitě podejte písemnou námitku podjatosti a stížnost vedoucímu odboru.'
  ];

  const recommendedTemplates = [
    { title: 'Žádost o nahlédnutí do spisu OSPOD', desc: 'Formální žádost dle správního řádu a ZSPOD', type: 'DOCX' },
    { title: 'Námitka podjatosti pracovnice OSPOD', desc: 'Stížnost na neobjektivní a zaujatý postup úřednice', type: 'DOCX' }
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
      aiButtonText="Položit dotaz AI Asistentovi k jednání s OSPOD"
      {...props}
    />
  );
}
