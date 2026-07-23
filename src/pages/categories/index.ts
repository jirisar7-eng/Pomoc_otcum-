/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

import PravniRadPage, { CategoryPageProps } from './PravniRadPage';
import JudikaturaPage from './JudikaturaPage';
import StridavaPecePage from './StridavaPecePage';
import NocniPecePage from './NocniPecePage';
import PsychologieAttachmentPage from './PsychologieAttachmentPage';
import RodicovskaAlienacePage from './RodicovskaAlienacePage';
import JednaniOspodPage from './JednaniOspodPage';
import VzoryPodaniPage from './VzoryPodaniPage';
import VyzivneMajetekPage from './VyzivneMajetekPage';
import ZdraviVyvojPage from './ZdraviVyvojPage';
import VzdelavaniCasPage from './VzdelavaniCasPage';
import KomunikaceRodicePage from './KomunikaceRodicePage';
import KrizovaPomocPage from './KrizovaPomocPage';
import FalesnaObvineniPage from './FalesnaObvineniPage';
import MezinarodniPravoPage from './MezinarodniPravoPage';
import SirsiRodinaPage from './SirsiRodinaPage';
import ZnaleckePosudkyPage from './ZnaleckePosudkyPage';
import KritikaStudiiPage from './KritikaStudiiPage';
import TechnologieAiPage from './TechnologieAiPage';
import KomunitaZkusenostiPage from './KomunitaZkusenostiPage';
import StatistikyVyzkumyPage from './StatistikyVyzkumyPage';

export {
  PravniRadPage,
  JudikaturaPage,
  StridavaPecePage,
  NocniPecePage,
  PsychologieAttachmentPage,
  RodicovskaAlienacePage,
  JednaniOspodPage,
  VzoryPodaniPage,
  VyzivneMajetekPage,
  ZdraviVyvojPage,
  VzdelavaniCasPage,
  KomunikaceRodicePage,
  KrizovaPomocPage,
  FalesnaObvineniPage,
  MezinarodniPravoPage,
  SirsiRodinaPage,
  ZnaleckePosudkyPage,
  KritikaStudiiPage,
  TechnologieAiPage,
  KomunitaZkusenostiPage,
  StatistikyVyzkumyPage
};

export const CATEGORY_PAGES_MAP: Record<string, React.ComponentType<CategoryPageProps>> = {
  'pravni-rad': PravniRadPage,
  'judikatura': JudikaturaPage,
  'stridava-pece': StridavaPecePage,
  'nocni-pece': NocniPecePage,
  'psychologie-attachment': PsychologieAttachmentPage,
  'rodicovska-alienace': RodicovskaAlienacePage,
  'jednani-ospod': JednaniOspodPage,
  'vzory-podani': VzoryPodaniPage,
  'vyzivne-majetek': VyzivneMajetekPage,
  'zdravi-vyvoj': ZdraviVyvojPage,
  'vzdelavani-cas': VzdelavaniCasPage,
  'komunikace-rodice': KomunikaceRodicePage,
  'krizova-pomoc': KrizovaPomocPage,
  'falesna-obvineni': FalesnaObvineniPage,
  'mezinarodni-pravo': MezinarodniPravoPage,
  'sirsi-rodina': SirsiRodinaPage,
  'znalecke-posudky': ZnaleckePosudkyPage,
  'kritika-studii': KritikaStudiiPage,
  'technologie-ai': TechnologieAiPage,
  'komunita-zkusenosti': KomunitaZkusenostiPage,
  'statistiky-vyzkumy': StatistikyVyzkumyPage
};
