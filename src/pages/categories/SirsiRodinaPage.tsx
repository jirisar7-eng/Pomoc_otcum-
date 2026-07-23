/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: SirsiRodinaPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function SirsiRodinaPage(props: CategoryPageProps) {
  const categorySlug = 'sirsi-rodina';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Zákonný nárok prarodičů na styk s vnoučaty (§ 927 OZ)',
      content: 'Prarodiče a příbuzní mají samostatné zákonné právo na styk s dítětem, pokud k nim má dítě citový vztah.'
    },
    {
      title: 'Samostatný soudní návrh prarodičů na úpravu styku',
      content: 'Postup, jak mohou babička a děda podat žalobu u opatrovnického soudu v případě, že jim matka brání v kontaktu s vnoučetem.'
    },
    {
      title: 'Ochrana sourozeneckých vazeb',
      content: 'Principy českého i mezinárodního práva bránící rozdělování vlastních i nevlastních sourozenců při rozvodu.'
    },
    {
      title: 'Zapojení tety, strýce a širší rodiny do života dítěte',
      content: 'Jak využít pomoc širší rodiny při hlídání, vožení do kroužků a budování mezigenerační rodinné identity.'
    }
  ];

  const actionSteps = [
    'Informujte prarodiče o jejich samostatném právním nároku dle § 927 OZ.',
    'Sestavte písemnou výzvu k umožnění kontaktu prarodičů s vnoučetem.',
    'Při odmítnutí pomozte prarodičům podat samostatný návrh k soudu.',
    'Zapojujte širší rodinu do oslav, víkendů a prázdnin s dítětem.'
  ];

  const recommendedTemplates = [
    { title: 'Návrh prarodičů na úpravu styku s vnoučetem', desc: 'Soudní podání dle § 927 OZ', type: 'DOCX' },
    { title: 'Předžalobní výzva matce k umožnění kontaktu prarodičů', desc: 'Formální výzva advokáta', type: 'DOCX' }
  ];

  return (
    <CategoryPageLayout
      title="Význam širší rodiny a prarodičů"
      categorySlug={categorySlug}
      icon="👥"
      subtitle="Práva prarodičů, tetiček, strýců a zachování sourozeneckých vazeb."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
