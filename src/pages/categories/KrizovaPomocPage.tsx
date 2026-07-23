/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: KrizovaPomocPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function KrizovaPomocPage(props: CategoryPageProps) {
  const categorySlug = 'krizova-pomoc';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Okamžitý postup při neopodstatněném odepření styku',
      content: 'Co dělat na místě předání: zachovat klid, vyzvat písemně k předání, neagresivně kontaktovat Policii ČR k sepsání úředního záznamu.'
    },
    {
      title: 'Rychlé předběžné opatření do 7 dnů (§ 102 z.ř.s.)',
      content: 'Jak sepisovat a podávat akutní návrh na předběžné upravění poměrů, pokud matka svévolně zamezuje jakémukoli kontaktu s dítětem.'
    },
    {
      title: 'Psychologická prvá pomoc pro otce v krizi',
      content: 'Zvládání akutního stresu, záchvatů úzkosti a bezmoci. Kontakty na krizové linky, azylové domy a mentory z komunity.'
    },
    {
      title: 'Postup při podezření na zanedbání či týrání',
      content: 'Kdy a jak podat podnět na OSPOD a PČR, jak správně zdokumentovat modřiny, zranění či zanedbání péče bez neuvážených obvinění.'
    }
  ];

  const actionSteps = [
    'Uložte si do telefonu číslo na Policii ČR (158) a naši SOS poradenskou linku.',
    'Při bezdůvodném nepředání trvejte na sepsání záznamu policií na místě.',
    'Do 24 hodin odešlete návrh na předběžné opatření k opatrovnickému soudu.',
    'Vyhledejte psychologickou podporu pro zachování chladné hlavy.'
  ];

  const recommendedTemplates = [
    { title: 'Akutní návrh na předběžné opatření - styk do 7 dnů', desc: 'Rychlý vzor pro krizové situace', type: 'DOCX' },
    { title: 'Protokol o zmařeném předání dítěte', desc: 'Formulář pro sepsání záznamu PČR', type: 'PDF' }
  ];

  return (
    <CategoryPageLayout
      title="Krizová pomoc a SOS"
      categorySlug={categorySlug}
      icon="🚨"
      subtitle="Okamžitý záchranný manuál při náhlém odepření styku, policejním zásahu či krizové situaci."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
