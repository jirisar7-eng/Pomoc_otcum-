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
      title: '1. Otec jako rovnocenná citová figura',
      content: 'Teorie citové vazby (John Bowlby, Michael Lamb) jednoznačně dokazuje, že dítě je od narození schopno vytvořit si stejně silnou a bezpečnou vazbu k otci jako k matce. Otec nepředstavuje sekundární osobu, nýbrž plnohodnotný pilíř dětského attachmentu.'
    },
    {
      title: '2. Specifika otcovské hry a vývoje mozku',
      content: 'Otcovská péče, fyzicky aktivní hra a specifický styl interakce stimulují prefrontální kůru dětí, rozvíjejí jejich odvahu, emocionální odolnost, schopnost riskovat v bezpečných mezích a efektivně řešit problémy.'
    },
    {
      title: '3. Dopady otcovské deprivace',
      content: 'Dlouhodobá absence otce v dětství narušuje psychickou stabilitu a prokazatelně zvyšuje riziko depresí, poruch chování, závislostí a školního selhávání v pozdějším věku dospívání.'
    },
    {
      title: '4. Emoční potřeby dětí v různých věkových etapách',
      content: 'Přehled psychického vývoje od batolecího věku přes předškolní období až po pubertu s důrazem na to, jak dítě vnímá přítomnost a absenci otce v jednotlivých fázích svého života.'
    }
  ];

  const actionSteps = [
    'Studujte závěry Bowlbyho a Lamba o rovnocenné citové vazbě k oběma rodičům.',
    'Zapojujte se do aktivní fyzické hry a rozvíjejte samostatnost a odolnost dítěte.',
    'Předkládejte OSPOD a soudním znalcům argumenty o rizicích otcovské deprivace.',
    'Přizpůsobte způsob komunikace a péče aktuální vývojové fázi dětské psychiky.'
  ];

  const recommendedTemplates = [
    { title: 'Přehled výzkumů o významu otcovské vazby', desc: 'Psychologický a odborný podklad pro znalce a soud', type: 'PDF' },
    { title: 'Dotazník pro posouzení citové vazby k otci', desc: 'Pomůcka pro přípravu na znalecké vyšetřování', type: 'DOCX' }
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
      aiButtonText="Položit dotaz AI Asistentovi k psychologii attachmentu"
      {...props}
    />
  );
}
