import type { RecordStatus } from '../shared/DataTable';
import type { ProcedureType } from '../../info/types';

export interface PatientTreatment {
  id: string;
  procedure: ProcedureType;
  procedureLabel: string;
  status: RecordStatus;
  createdDate: string;
  teeth: number[];
  toothSummary: string;
  provider: string;
  notes?: string;
  /** Free-form details (e.g. "Crown · Zirconia · A2"). */
  details?: string;
}

export const SEED_PATIENT_TREATMENTS: PatientTreatment[] = [
  {
    id: 'pt-1',
    procedure: 'fixed-restorative',
    procedureLabel: 'Fixed restorative',
    status: 'in-progress',
    createdDate: '2026-04-15',
    teeth: [14],
    toothSummary: '#14',
    provider: 'Dr. A. Whitaker',
    details: 'Crown · Zirconia · A2',
  },
  {
    id: 'pt-2',
    procedure: 'invisalign',
    procedureLabel: 'Invisalign',
    status: 'submitted',
    createdDate: '2026-03-02',
    teeth: [],
    toothSummary: 'Full arch',
    provider: 'Dr. A. Whitaker',
    details: 'Comprehensive · Initial stage',
  },
  {
    id: 'pt-3',
    procedure: 'study-model',
    procedureLabel: 'Study model',
    status: 'completed',
    createdDate: '2026-02-19',
    teeth: [],
    toothSummary: 'Full arch',
    provider: 'Dr. A. Whitaker',
    details: 'Diagnostic models',
  },
];

export const TREATMENT_PROCEDURE_OPTIONS = [
  { value: 'all',                label: 'All procedures' },
  { value: 'study-model',        label: 'Study model' },
  { value: 'invisalign',         label: 'Invisalign' },
  { value: 'fixed-restorative',  label: 'Fixed restorative' },
  { value: 'implant-planning',   label: 'Implant planning' },
  { value: 'dentures',           label: 'Dentures' },
  { value: 'appliance',          label: 'Appliance' },
];

export const TREATMENT_STATUS_OPTIONS = [
  { value: 'all',         label: 'All statuses' },
  { value: 'draft',       label: 'Draft' },
  { value: 'submitted',   label: 'Submitted' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed',   label: 'Completed' },
  { value: 'cancelled',   label: 'Cancelled' },
];

export const PROCEDURE_LABEL: Record<ProcedureType, string> = {
  'study-model':       'Study model',
  'invisalign':        'Invisalign',
  'fixed-restorative': 'Fixed restorative',
  'implant-planning':  'Implant planning',
  'dentures':          'Dentures',
  'appliance':         'Appliance',
};
