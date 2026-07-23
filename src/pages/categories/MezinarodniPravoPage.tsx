/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: MezinarodniPravoPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function MezinarodniPravoPage(props: CategoryPageProps) {
  const categorySlug = 'mezinarodni-pravo';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Haagská úmluva o občanskoprávních stránkách mezinárodních únosů dětí',
      content: 'Mechanismus rychlého navrácení dítěte neoprávněně přemístěného do cizího státu bez souhlasu druhého rodiče.'
    },
    {
      title: 'Role Úřadu pro mezinárodněprávní ochranu dětí (ÚMPOD)',
      content: 'Jak spolupracovat s ÚMPOD v Brně při řešení mezinárodních únosů, vymáhání výživného ze zahraničí a úpravě styku.'
    },
    {
      title: 'Vydávání cestovních pasů a souhlas s vycestováním',
      content: 'Právní podmínky pro vydání pasu dítěte a povinnost získat souhlas druhého rodiče k dlouhodobým pobytům v cizině.'
    },
    {
      title: 'Pravomoc soudů dle nařízení Brusel IIb',
      content: 'Určení příslušnosti soudů podle obvyklého bydliště dítěte v rámci Evropské unie.'
    }
  ];

  const actionSteps = [
    'Při hrozícím vyvezení okamžitě podejte návrh na zákaz vycestování dítěte.',
    'Při neoprávněném vyvezení do ciziny kontaktujte do 24 hodin ÚMPOD.',
    'Předložte důkazy o tom, že obvyklé bydliště dítěte je v České republice.',
    'Nesouhlaste s jednostrannou změnou školy či bydliště v zahraničí.'
  ];

  const recommendedTemplates = [
    { title: 'Žádost o navrácení dítěte dle Haagské úmluvy', desc: 'Formulář pro ÚMPOD', type: 'DOCX' },
    { title: 'Návrh na zákaz vycestování dítěte bez souhlasu', desc: 'Soudní návrh na předběžné opatření', type: 'DOCX' }
  ];

  return (
    <CategoryPageLayout
      title="Mezinárodní právo a stěhování dětí"
      categorySlug={categorySlug}
      icon="✈️"
      subtitle="Haagská úmluva, řešení nelegálního přemístění dětí do zahraničí a mezinárodní styk."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
