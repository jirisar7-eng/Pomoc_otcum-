/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 me: VzdelavaniCasPage.tsx
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function VzdelavaniCasPage(props: CategoryPageProps) {
  const categorySlug = 'vzdelavani-cas';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: '1. Právo na přístup do e-žákovské knížky (Bakaláři / Edookit)',
      content: 'Škola je ze zákona a v rámci rodičovské odpovědnosti povinna zřídit otci (pokud mu nebyla rodičovská odpovědnost omezena soudem) samostatné přihlašovací údaje do školních informačních systémů a zasílat veškeré zprávy o prospěchu a chování dítěte.'
    },
    {
      title: '2. Výběr mateřské, základní a střední školy',
      content: 'Volba vzdělávací instituce a zaměření studia představuje podstatnou záležitost ve smyslu péče o dítě. Jednostranné přihlášení či odhlášení matkou bez souhlasu druhého rodiče (či rozhodnutí soudu při neshodě) je protiprávní.'
    },
    {
      title: '3. Účast na třídních schůzkách a školních akcích',
      content: 'Otec má plné právo navštěvovat třídní schůzky, konzultace s pedagogy, besídky, besedy a doprovázet dítě na školní výlety či akce pořádané školou bez ohledu na to, u koho je dítě zrovna ubytováno.'
    },
    {
      title: '4. Volnočasové aktivity a kroužky',
      content: 'Organizace zájmových kroužků v době styku otce je v jeho plné kompetenci. Druhý rodič nesmí účelově přihlašovat dítě na aktivity kolidující s dny, kdy má dítě svěřené otec, s cílem omezit jeho styk.'
    }
  ];

  const actionSteps = [
    'Odeslete řediteli školy písemnou žádost o zřízení samostatného přístupového účtu do e-žákovské (Bakaláři/Edookit).',
    'Doručte škole sdělení, že jste zákonným zástupcem s plnou rodičovskou odpovědností a požadujte přímou komunikaci.',
    'Při neshodě o výběru školy podat včas k opatrovnickému soudu návrh na nahrazení souhlasu druhého rodiče.',
    'Trvejte na svém právu navštěvovat třídní schůzky, besídky a organizovat kroužky v době své péče.'
  ];

  const recommendedTemplates = [
    { title: 'Žádost škole o zřízení přístupu do e-žákovské (Bakaláři/Edookit)', desc: 'Formální výzva řediteli školy / školky dle školského zákona', type: 'DOCX' },
    { title: 'Návrh na nahrazení souhlasu rodiče s výběrem školy', desc: 'Soudní podání k opatrovnickému soudu při neshodě rodičů', type: 'DOCX' }
  ];

  return (
    <CategoryPageLayout
      title="Vzdělávání a volný čas"
      categorySlug={categorySlug}
      icon="🏫"
      subtitle="Zapojení otce do chodu školy, školky, výběru kroužků a zájmových aktivit s plnou právní podporou."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      aiButtonText="Položit dotaz AI Asistentovi ke vzdělávání"
      {...props}
    />
  );
}
