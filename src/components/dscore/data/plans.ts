import type { TreatmentPlan } from './types';
import { daysFromNowISO, makeActivityEvent } from './activity';

// Mock treatment plans across all PlanStatus values, used by Feature 2 (PatientPage
// → Treatments tab → list) and Feature 3 (analytics aggregations).

export const SEED_PLANS: TreatmentPlan[] = [
  {
    id: 'plan-1',
    version: 1,
    patientId: 'pat-mina',
    patientName: 'Mina Yamada',
    status: 'in-progress',
    diagnosisTags: ['caries', 'fractured-tooth'],
    selectedTeeth: [14, 15],
    insurance: { provider: 'Delta Dental', planId: 'PPO-A' },
    createdAt: daysFromNowISO(-21),
    presentedAt: daysFromNowISO(-18),
    acceptedAt: daysFromNowISO(-17),
    generatedJobIds: ['job-15'],
    phases: [
      {
        id: 'ph-1', name: 'Diagnostic', ordering: 0, earliestStartOffsetWeeks: 0,
        procedures: [
          { id: 'pp-1', catalogCode: 'D0150' },
          { id: 'pp-2', catalogCode: 'D0210', toothNumber: 14 },
        ],
      },
      {
        id: 'ph-2', name: 'Restoration', ordering: 1, earliestStartOffsetWeeks: 1,
        procedures: [
          { id: 'pp-3', catalogCode: 'D2740', toothNumber: 14, material: 'eMax' },
          { id: 'pp-4', catalogCode: 'D2740', toothNumber: 15, material: 'eMax' },
        ],
      },
    ],
    activity: [
      makeActivityEvent({ type: 'plan-presented', actorId: 'dr-aw', actorName: 'Dr. Alex Watanabe', timestamp: daysFromNowISO(-18), payload: {} }),
      makeActivityEvent({ type: 'plan-accepted',  actorId: 'pat-mina', actorName: 'Mina Yamada', actorRole: 'patient', timestamp: daysFromNowISO(-17), payload: {} }),
    ],
  },
  {
    id: 'plan-2',
    version: 1,
    patientId: 'pat-ethan',
    patientName: 'Ethan Liu',
    status: 'completed',
    diagnosisTags: ['cosmetic'],
    selectedTeeth: [11],
    insurance: { provider: 'Cigna', planId: 'GOLD-1' },
    createdAt: daysFromNowISO(-60),
    presentedAt: daysFromNowISO(-55),
    acceptedAt: daysFromNowISO(-54),
    generatedJobIds: ['job-9'],
    phases: [
      {
        id: 'ph-3', name: 'Restoration', ordering: 0, earliestStartOffsetWeeks: 0,
        procedures: [{ id: 'pp-5', catalogCode: 'D2740', toothNumber: 11 }],
      },
    ],
    activity: [],
  },
  {
    id: 'plan-3',
    version: 1,
    patientId: 'pat-priya',
    patientName: 'Priya Singh',
    status: 'presented',
    diagnosisTags: ['cosmetic', 'discoloration'],
    selectedTeeth: [21, 22],
    insurance: { provider: 'Aetna', planId: 'PRO-2' },
    createdAt: daysFromNowISO(-3),
    presentedAt: daysFromNowISO(-2),
    generatedJobIds: [],
    phases: [
      {
        id: 'ph-4', name: 'Restoration', ordering: 0, earliestStartOffsetWeeks: 0,
        procedures: [
          { id: 'pp-6', catalogCode: 'D2962', toothNumber: 21 },
          { id: 'pp-7', catalogCode: 'D2962', toothNumber: 22 },
        ],
      },
    ],
    activity: [
      makeActivityEvent({ type: 'plan-presented', actorId: 'dr-mp', actorName: 'Dr. Maria Petrov', timestamp: daysFromNowISO(-2), payload: {} }),
    ],
  },
  {
    id: 'plan-4',
    version: 2,
    patientId: 'pat-leon',
    patientName: 'Leon Bernal',
    status: 'declined',
    diagnosisTags: ['orthodontic'],
    selectedTeeth: [],
    insurance: {},
    createdAt: daysFromNowISO(-40),
    presentedAt: daysFromNowISO(-30),
    declinedAt: daysFromNowISO(-28),
    generatedJobIds: [],
    phases: [
      {
        id: 'ph-5', name: 'Orthodontic', ordering: 0, earliestStartOffsetWeeks: 0,
        procedures: [{ id: 'pp-8', catalogCode: 'D8090' }],
      },
    ],
    activity: [
      makeActivityEvent({ type: 'plan-declined', actorId: 'pat-leon', actorName: 'Leon Bernal', actorRole: 'patient', timestamp: daysFromNowISO(-28), payload: { reason: 'Cost' } }),
    ],
  },
  {
    id: 'plan-5',
    version: 1,
    patientId: 'pat-noor',
    patientName: 'Noor Hassan',
    status: 'draft',
    diagnosisTags: ['missing-tooth'],
    selectedTeeth: [16],
    insurance: { provider: 'MetLife' },
    createdAt: daysFromNowISO(-1),
    generatedJobIds: [],
    phases: [
      {
        id: 'ph-6', name: 'Implant placement', ordering: 0, earliestStartOffsetWeeks: 0,
        procedures: [{ id: 'pp-9', catalogCode: 'D6010', toothNumber: 16 }],
      },
      {
        id: 'ph-7', name: 'Implant restoration', ordering: 1, earliestStartOffsetWeeks: 12,
        procedures: [
          { id: 'pp-10', catalogCode: 'D6058', toothNumber: 16 },
          { id: 'pp-11', catalogCode: 'D6065', toothNumber: 16 },
        ],
      },
    ],
    activity: [],
  },
  {
    id: 'plan-6',
    version: 1,
    patientId: 'pat-tomas',
    patientName: 'Tomás Rivera',
    status: 'accepted',
    diagnosisTags: ['caries'],
    selectedTeeth: [25],
    insurance: { provider: 'Guardian' },
    createdAt: daysFromNowISO(-9),
    presentedAt: daysFromNowISO(-7),
    acceptedAt: daysFromNowISO(-6),
    generatedJobIds: ['job-6'],
    phases: [
      {
        id: 'ph-8', name: 'Restoration', ordering: 0, earliestStartOffsetWeeks: 0,
        procedures: [{ id: 'pp-12', catalogCode: 'D2740', toothNumber: 25 }],
      },
    ],
    activity: [],
  },
];
