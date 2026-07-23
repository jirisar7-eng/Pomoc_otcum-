/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: KritikaStudiiPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function KritikaStudiiPage(props: CategoryPageProps) {
  const categorySlug = 'kritika-studii';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Kritický rozbor metodicky chybných studií (McIntosh 2010)',
      content: 'Proč je australská studie Jennifer McIntosh metodicky vadná (předvybrané sociálně patologické rodiny, malé vzorky) a proč ji nelze zobecňovat.'
    },
    {
      title: 'Světový vědecký konsenzus (APA, Harvard, Cambridge)',
      content: 'Souhrn moderních metaanalýz (Nielsen, Bauserman, Warshak), které prokazují jednoznačný přínos střídavé péče pro psychiku dětí.'
    },
    {
      title: 'Připravené textové repliky pro soudní podání',
      content: 'Citace a textové pasáže reagující na pokusy protistrany nebo OSPOD argumentovat překonanými mýty.'
    },
    {
      title: 'Metodické standardy vědeckého výzkumu v rodinném právu',
      content: 'Jak u soudu poukázat na rozdíl mezi selektivními články a recenzovanými vědeckými metaanalýzami z prestižních žurnálů.'
    }
  ];

  const actionSteps = [
    'Pokud protistrana cituje McIntosh, okamžitě předložte kritickou analýzu Nielsen (2014).',
    'Přiložte k vašemu vyjádření české překlady shrnutí svetového konsenzu.',
    'Při výslechu znalce se ptejte, zda zná výsledky metaanalýz Bausermana a Warshaka.',
    'Prokažte, že odborný diskurz pokročil od 90. let výrazně dopředu.'
  ];

  const recommendedTemplates = [
    { title: 'Repliky na studii McIntosh pro soud', desc: 'Textový podklad k vyvrácení argumentů opozice', type: 'DOCX' },
    { title: 'Kompilace metaanalýz o střídavé péči (Nielsen 2018)', desc: 'Přehled 60 vědeckých studií', type: 'PDF' }
  ];

  return (
    <CategoryPageLayout
      title="Kritika překonaných studií"
      categorySlug={categorySlug}
      icon="🔬"
      subtitle="Demontáž metodicky chybných studií zneužívaných proti otcům (např. McIntosh, Solomon & George)."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
