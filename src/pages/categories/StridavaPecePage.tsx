/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function StridavaPecePage(props: CategoryPageProps) {
  const categorySlug = 'stridava-pece';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: '1. Modely uspořádání střídavé péče',
      content: 'Přehled osvědčených modelů přizpůsobených věku dětí: klasický týden/týden pro školáky, flexibilnější cyklus 2-2-3 pro mladší děti, případně dvoutýdenní střídání pro starší děti a teenagerů s ohledem na jejich zájmy a sociální vazby.'
    },
    {
      title: '2. Vyvrácení mýtu o "dvojím domově a zmatení dítěte"',
      content: 'Vědecké výzkumy a metaanalýzy (např. R. Bauserman, F. Fransson) jednoznačně prokazují, že děti ve střídavé péči prospívají psychicky i sociálně srovnatelně s dětmi z úplných rodin a vyvracejí zastaralé mýty o negativním dopadu stěhování.'
    },
    {
      title: '3. Budování rovnocenných podmínek v obou domovech',
      content: 'Praktický návod na zajištění plnohodnotného zázemí – vlastní pokoj nebo kout, dostatek oblečení, školních potřeb a hraček v obou domácnostech tak, aby dítě nemuselo neustále přenášet velké kufry a cítilo se doma u obou rodičů.'
    },
    {
      title: '4. Předávání dětí bez konfliktů',
      content: 'Pravidla pro klidné předávání dětí (převzetí ve škole/školce, eliminace konfrontací mezi rodiči z očí do očí, věcná a klidná komunikace), která chrání dítě před toxickým stresem.'
    }
  ];

  const actionSteps = [
    'Vyberte odpovídající časový model střídání (týden/týden nebo 2-2-3) a připravte si konkrétní návrh harmonogramu.',
    'Zařiďte pro dítě plnohodnotné osobní zázemí v obou domácnostech (oblečení, učebnice, hračky) pro eliminaci stěhovacího stresu.',
    'Prostudujte si výzkumy Bausermana a Franssona jako odbornou argumentační zásobu pro OSPOD a soud.',
    'Trvejte na logisticky klidném předávání dětí nejlépe skrze školu nebo školku.'
  ];

  const recommendedTemplates = [
    { title: 'Rodičovská dohoda o střídavé péči', desc: 'Komplexní vzor dohody rodičů s podrobným harmonogramem', type: 'DOCX' },
    { title: 'Harmonogram střídání péče 2-2-3', desc: 'Detailní kalendářní plán pro mladší děti ke stažení', type: 'PDF' }
  ];

  return (
    <CategoryPageLayout
      title="Střídavá a společná péče"
      categorySlug={categorySlug}
      icon="🤝"
      subtitle="Modely, organizace střídání, praxe, vyvrácení mýtů a budování stabilního dvojího domova."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      aiButtonText="Položit dotaz AI Asistentovi ke střídavé péči"
      {...props}
    />
  );
}
