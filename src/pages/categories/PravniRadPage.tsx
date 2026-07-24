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
      title: '1. Základní pilíře zákona a § 858 OZ',
      content: 'Rodičovská odpovědnost dle § 858 občanského zákoníku představuje ucelený soubor práv a povinností obou rodičů při péči o dítě, jeho osobnostní vývoj, zastupování a správu jeho jmění. Zákon výslovně stanoví, že tato odpovědnost náleží rovnoměrně oběma rodičům bez ohledu na to, zda spolu žijí, či zda byli manželé.'
    },
    {
      title: '2. Princip rovnoprávnosti matky a otce',
      content: 'České rodinné právo a Listina základních práv a svobod (čl. 32) staví na rovném postavení obou rodičů. Žádný platný právní předpis v České republice nedává matce přednostní právo na výchovu, péči nebo zastupování nezletilého dítěte. Genderová neutralita je základním stavebním kamenem moderního opatrovnického práva.'
    },
    {
      title: '3. Mezinárodní úmluvy a Článek 9 Úmluvy o právech dítěte',
      content: 'Mezinárodní právo garantuje právo dítěte na pravidelný osobní styk a přímý kontakt s oběma rodiči. Článek 9 Úmluvy o právech dítěte zakazuje oddělit dítě od jeho rodičů proti jejich vůli, ledaže příslušné úřady rozhodnou v souladu se soudním přezkumem, že takové oddělení je nezbytné v zájmu dítěte.'
    },
    {
      title: '4. Autonomie rodiny a meze státních zásahů',
      content: 'Stát a jeho orgány (včetně OSPOD a soudů) mohou do poměrů rodiny zasahovat pouze tehdy, vyžaduje-li to zájem dítěte a selhaly-li běžné dohody rodičů. Princip minimalizace zásahů je zakotven v judikatuře Evropského soudu pro lidská práva (EÚLP).'
    }
  ];

  const actionSteps = [
    'Nastudujte základní paragrafy občanského zákoníku (§ 858 až § 909 OZ).',
    'Trvejte na tom, že vaše rodičovská odpovědnost je plnohodnotná a rovnocenná dle čl. 32 Listiny.',
    'Při jednání s úřady a OSPOD se odvolávejte na Článek 9 Úmluvy o právech dítěte.',
    'Každý pokus o neoprávněný zásah státu do autonomie rodiny napadněte odůvodněným písemným podáním.'
  ];

  const recommendedTemplates = [
    { title: 'Návrh na péči obou rodičů (§ 858 OZ)', desc: 'Vzor úvodního návrhu k opatrovnickému soudu zaručující rovnost rodičů', type: 'DOCX / PDF' },
    { title: 'Žádost o nahlédnutí do spisu OSPOD', desc: 'Formální žádost o uplatnění práv rodiče na informace a nahlížení do dokumentace', type: 'PDF' }
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
      aiButtonText="Položit dotaz AI Asistentovi k paragrafům"
      {...props}
    />
  );
}
