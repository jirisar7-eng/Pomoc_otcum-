/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import CategoryPageLayout from './CategoryPageLayout';
import { CATEGORY_BLUEPRINTS } from '../../components/CategoryDetailView';
import { CategoryPageProps } from './PravniRadPage';

export default function NocniPecePage(props: CategoryPageProps) {
  const categorySlug = 'nocni-pece';
  const blueprint = CATEGORY_BLUEPRINTS[categorySlug];

  const legalSections = [
    {
      title: 'Vědecký konsenzus Warshak 2014',
      content: 'Konsenzuální prohlášení 110 předních světových odborníků potvrzuje, že přespávání u otce od nejranějšího věku neuškodí attachmentu, ale naopak jej posiluje.'
    },
    {
      title: 'Postupný harmonogram zavádění noční péče',
      content: 'Metodika přechodu od půldenního kontaktu přes večerní uspávání až k plnohodnotné noční péči v průběhu 1 až 3 měsíců.'
    },
    {
      title: 'Obrana proti argumentu "exkluzivního kojení"',
      content: 'Právní a lékařská fakta o dokrmování, odsávání mateřského mléka a příkrmech, které umožňují přespávání i u kojených dětí.'
    },
    {
      title: 'Demontáž zastaralých předsudků OSPOD',
      content: 'Repliky na tvrzení, že dítě do 3 let "patří v noci výhradně k matce". Citace judikatur Ústavního soudu ČR.'
    }
  ];

  const actionSteps = [
    'Zabezpečte postýlku, chůvičku, příkrmy a veškerou hygienickou výbavu.',
    'Doložte u soudu vědecké studie o bezpečnosti noční péče otce.',
    'Navrhněte postupné navyšování přespávání v horizontu několika týdnů.',
    'Veďte si deník s fotodokumentací spokojeného průběhu noční péče.'
  ];

  const recommendedTemplates = [
    { title: 'Plán postupného zavádění noční péče', desc: 'Etapový harmonogram pro soud', type: 'DOCX' },
    { title: 'Souhrn studie Warshak 2014 v češtině', desc: 'Odborný podklad pro znalce a OSPOD', type: 'PDF' }
  ];

  return (
    <CategoryPageLayout
      title="Noční péče a přespávání kojenců"
      categorySlug={categorySlug}
      icon="🌙"
      subtitle="Odborná vědecká zdůvodnění pro noclehy a noční péči otců u dětí nejranějšího věku."
      blueprint={blueprint}
      legalSections={legalSections}
      actionSteps={actionSteps}
      recommendedTemplates={recommendedTemplates}
      {...props}
    />
  );
}
