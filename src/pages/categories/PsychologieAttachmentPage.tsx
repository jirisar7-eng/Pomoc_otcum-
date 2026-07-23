/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function PsychologieAttachmentPage(props: CategoryPageProps) {
  const categorySlug = 'psychologie-attachment';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Otec jako rovnocenná citová figura',
      content: 'Teorie citové vazby (John Bowlby, Michael Lamb) dokazuje, že dítě je od narození schopno vytvořit si stejně silnou vazbu k otci jako k matce.'
    },
    {
      title: 'Specifika otcovské hry a vývoje mozku',
      content: 'Otcovská péče a fyzicky aktivní hra stimulují prefrontální kůru dětí, rozvíjejí odvahu, odolnost a schopnost řešit problémy.'
    },
    {
      title: 'Dopady otcovské deprivace',
      content: 'Absence otce v dětství zvyšuje riziko depresí, poruch chování, závislostí a školního selhávání v dospívání.'
    },
    {
      title: 'Zvládání přechodné separační úzkosti',
      content: 'Jak správně reagovat na pláč dítěte při předávání a vysvětlit soudu, že pláč je reakcí na napětí mezi rodiči, nikoliv odmítáním otce.'
    }
  ];

  const actionSteps = [
    'Rozvíjejte aktivní, zapojenou péči a uklidňující večerní rituály.',
    'Vysvětlete sociálním pracovníkům rozdíl mezi matkou a otcem jako citovými figurami.',
    'Nenechte se znejistit dočasnými emocionálními výkyvy dítěte při přechodu.',
    'Dopřejte dítěti čas a bezpečný prostor pro vyjádření všech emocí.'
  ];

  const recommendedTemplates = [
    { title: 'Přehled výzkumů o významu otce', desc: 'Psychologický podklad k soudu', type: 'PDF' },
    { title: 'Dotazník pro posouzení citové vazby', desc: 'Pomůcka pro přípravu na znalce', type: 'DOCX' }
  ];

  return (
    <CategoryPageLayout
      title="Psychologie dítěte & Attachment"
      categorySlug={categorySlug}
      icon="🧠"
      subtitle="Citová vazba, vývoj mozku, emocionální potřeby dětí a význam otce pro zdravý vývoj."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
