/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function JudikaturaPage(props: CategoryPageProps) {
  const categorySlug = 'judikatura';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Zlomkový nález ÚS ČR IV. ÚS 805/14',
      content: 'Ústavní soud judikoval, že svěřit dítě do péče jednoho rodiče lze pouze tehdy, pokud je to v odůvodněném zájmu dítěte. Střídavá péče má být primárním modelem.'
    },
    {
      title: 'Nález I. ÚS 2482/13 – Zákaz preferování matky',
      content: 'Věk dítěte ani pouhé přání matky nemohou automaticky vyloučit otce ze střídavé péče. Nízký věk dítěte není překážkou pro přespávání u otce.'
    },
    {
      title: 'Judikatura ESLP k Článku 8 Úmluvy',
      content: 'Evropský soud pro lidská práva opakovaně zdůrazňuje, že stát má povinnost přijmout účinná opatření k zachování vazby mezi otcem a dítětem.'
    },
    {
      title: 'Praktické použití právních vět u soudu',
      content: 'Přesné citace z judikátů přeložené do lidské řeči pro vložení do odvolání, vyjádření a návrhů na předběžná opatření.'
    }
  ];

  const actionSteps = [
    'Vyberte 2-3 klíčové nálezy Ústavního soudu relevantní pro Vaši situaci.',
    'Zapracujte přesné citace právních vět do Vašeho soudního návrhu.',
    'Použijte judikaturu ke zpochybnění neaktuálních argumentů OSPOD.',
    'Upozorněte soudce na závaznost judikatury Ústavního soudu ČR.'
  ];

  const recommendedTemplates = [
    { title: 'Odvolání s citací judikatury ÚS', desc: 'Soudní odvolání proti výhradní péči', type: 'DOCX' },
    { title: 'Prehled nálezů k vytištění pro OSPOD', desc: 'Sumář rozhodnutí Ústavního soudu', type: 'PDF' }
  ];

  return (
    <CategoryPageLayout
      title="Judikatura a precedenty"
      categorySlug={categorySlug}
      icon="🏛️"
      subtitle="Klíčové nálezy a rozsudky Ústavního soudu, Nejvyššího soudu a ESLP zaručující práva otců."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
