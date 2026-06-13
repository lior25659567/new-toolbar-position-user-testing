import type { Lab } from './types';

export const LABS: Lab[] = [
  { id: 'lab-acme',     name: 'Acme Dental Lab',         monogram: 'AC', specialty: 'Full-service',  slaDays: 7 },
  { id: 'lab-bright',   name: 'Bright Smile Crafts',     monogram: 'BS', specialty: 'Restorative',   slaDays: 5 },
  { id: 'lab-crownco',  name: 'CrownCo Studios',         monogram: 'CC', specialty: 'Restorative',   slaDays: 8 },
  { id: 'lab-orthoarc', name: 'Ortho Arc Aligners',      monogram: 'OA', specialty: 'Orthodontics',  slaDays: 14 },
  { id: 'lab-implix',   name: 'Implix Implant Services', monogram: 'IX', specialty: 'Implantology',  slaDays: 10 },
];

export const DENTISTS = [
  { id: 'dr-aw', name: 'Dr. Alex Watanabe',  monogram: 'AW' },
  { id: 'dr-mp', name: 'Dr. Maria Petrov',   monogram: 'MP' },
  { id: 'dr-jk', name: 'Dr. Julia Kim',      monogram: 'JK' },
  { id: 'dr-rs', name: 'Dr. Ravi Subramani', monogram: 'RS' },
];

export const PATIENTS = [
  { id: 'pat-dscore',  name: 'DS Core, Demo' },
  { id: 'pat-mina',    name: 'Mina Yamada' },
  { id: 'pat-ethan',   name: 'Ethan Liu' },
  { id: 'pat-noor',    name: 'Noor Hassan' },
  { id: 'pat-leon',    name: 'Leon Bernal' },
  { id: 'pat-aiko',    name: 'Aiko Tanaka' },
  { id: 'pat-priya',   name: 'Priya Singh' },
  { id: 'pat-tomas',   name: 'Tomás Rivera' },
];
