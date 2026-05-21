import type { DiseaseCategory, Sex } from '../types/prediction';

export const SEX_OPTIONS: Array<{ label: string; value: Sex }> = [
  { label: 'Homme', value: 'male' },
  { label: 'Femme', value: 'female' },
];

export const DISEASE_OPTIONS: Array<{
  value: DiseaseCategory;
  label: string;
}> = [
  {
    value: 'neurological',
    label: 'Neurologiques (epilepsie, AVC, demence)',
  },
  {
    value: 'cardiovascular',
    label: 'Cardio-vasculaires (infarctus, troubles du rythme)',
  },
  {
    value: 'metabolic',
    label: 'Metaboliques (diabete avec hypoglycemies)',
  },
  {
    value: 'respiratory',
    label: 'Respiratoires (apnee du sommeil, insuffisance)',
  },
  {
    value: 'psychiatric',
    label: 'Psychiatriques (psychoses, troubles bipolaires)',
  },
  {
    value: 'sensory',
    label: 'Sensoriels (troubles visuels, surdite)',
  },
  {
    value: 'musculoskeletal',
    label: 'Musculo-squelettiques (arthrite, handicaps)',
  },
];
