// Claims & Revenue Cycle — types, state machine, reducer, mock data, helpers.
//
// A claim is a request to a payer (insurance) for reimbursement on dental
// procedures already performed on a patient. Lifecycle:
//
//   draft ─► submitted ─► in-review ─► paid
//                                ├──► partial ─► balance-billed ─► patient-paid | written-off
//                                └──► denied ──► appealed ─► in-review (loop, capped at 2 appeals)
//                                            └──► written-off (terminal)
//
// Aggregations roll up to "AR aging buckets" — the canonical RCM (Revenue
// Cycle Management) metric: how much money is outstanding by age. Bands are
// 0–30 / 31–60 / 61–90 / 90+ days from submission for unresolved claims.

import { daysFromNowISO, makeActivityEvent } from '../data/activity';
import { LABS, DENTISTS, PATIENTS } from '../data/labs';
import type { ActivityEvent } from '../data/types';

// ─── Domain types ────────────────────────────────────────────────────────────

export type ClaimStatus =
  | 'draft'
  | 'submitted'
  | 'in-review'
  | 'paid'
  | 'partial'
  | 'denied'
  | 'appealed'
  | 'balance-billed'
  | 'patient-paid'
  | 'written-off';

export interface Payer {
  id: string;
  name: string;
  monogram: string;
  /** Coverage tone for the tag tint. */
  tone: 'blue' | 'green' | 'purple' | 'orange' | 'magenta';
  /** Mocked first-pass acceptance rate, used for KPI baselines and tooltips. */
  firstPassRate: number;
  /** Mock average days to pay. */
  avgDaysToPay: number;
}

export interface DenialReason {
  code: string;          // 'CO-50', 'CO-29' style
  short: string;         // 'Not medically necessary'
  appealable: boolean;
}

/** A single procedure line on a claim — corresponds to one CDT code. */
export interface ClaimProcedureLine {
  id: string;
  cdtCode: string;       // 'D2740' style (mocked)
  description: string;
  toothNumber?: number;
  units: number;
  feeBilled: number;     // what we billed
  feeAllowed?: number;   // what payer says is allowed (set after adjudication)
  feePaid?: number;      // what payer actually paid (set after payment)
  patientResponsibility?: number; // copay/coinsurance/deductible
  adjustments?: { code: string; amount: number; reason: string }[];
  /** When set, this line was specifically denied. */
  deniedReasonCode?: string;
}

export interface ClaimPayment {
  id: string;
  /** When the payer's ERA arrived. */
  postedAt: string;
  amount: number;
  method: 'EFT' | 'check' | 'patient-card';
  reference: string;     // ERA #, check #, or auth code
  postedBy: string;      // staff who posted it
}

export interface Appeal {
  id: string;
  filedAt: string;
  filedBy: string;
  reason: string;
  /** Outcome resolves this appeal. */
  outcome?: { decidedAt: string; result: 'overturned' | 'upheld' | 'partial'; notes?: string };
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;          // 'CLM-2026-0142' style
  patient: { id: string; name: string };
  payer: Payer;
  dentist: { id: string; name: string; monogram: string };
  /** Date of service — when the work was done. */
  dateOfService: string;
  /** When we sent it to the payer. Empty for drafts. */
  dateSubmitted?: string;
  /** When we got the final remittance / decision. */
  dateClosed?: string;
  status: ClaimStatus;
  procedures: ClaimProcedureLine[];
  payments: ClaimPayment[];
  appeals: Appeal[];
  /** Most recent denial reason (only set when status was/is denied). */
  denialReasonCode?: string;
  /** Free-text notes the biller jotted down. */
  notes?: string;
  activity: ActivityEvent[];
}

export type ClaimsViewMode = 'list' | 'aging';

export interface ClaimsFiltersState {
  search: string;
  status: ClaimStatus | 'all';
  payerId: string | 'all';
  agingBucket: 'all' | '0-30' | '31-60' | '61-90' | '90+';
}

export interface ClaimsState {
  claims: Record<string, InsuranceClaim>;
  order: string[];
  filters: ClaimsFiltersState;
  viewMode: ClaimsViewMode;
  selectedClaimId: string | null;
  /** Currently-pending modal flow. */
  modal:
    | { type: 'none' }
    | { type: 'post-payment'; claimId: string }
    | { type: 'file-appeal'; claimId: string }
    | { type: 'write-off';   claimId: string };
}

// ─── State machine ───────────────────────────────────────────────────────────

const TRANSITIONS: Record<ClaimStatus, ClaimStatus[]> = {
  'draft':           ['submitted'],
  'submitted':       ['in-review'],
  'in-review':       ['paid', 'partial', 'denied'],
  'paid':            [],                                          // terminal
  'partial':         ['balance-billed', 'written-off'],
  'denied':          ['appealed', 'written-off'],
  'appealed':        ['in-review'],                               // loops back
  'balance-billed':  ['patient-paid', 'written-off'],
  'patient-paid':    [],                                          // terminal
  'written-off':     [],                                          // terminal
};

export function canClaimTransition(from: ClaimStatus, to: ClaimStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function isClaimTerminal(status: ClaimStatus): boolean {
  return TRANSITIONS[status].length === 0;
}

/** Statuses we treat as outstanding A/R (unresolved). */
export const OUTSTANDING_STATUSES: ClaimStatus[] = [
  'submitted', 'in-review', 'partial', 'denied', 'appealed', 'balance-billed',
];

/** Statuses we treat as resolved (good or bad). */
export const RESOLVED_STATUSES: ClaimStatus[] = [
  'paid', 'patient-paid', 'written-off',
];

// ─── Reference data ──────────────────────────────────────────────────────────

export const PAYERS: Payer[] = [
  { id: 'pay-delta',       name: 'Delta Dental PPO',         monogram: 'DD', tone: 'blue',    firstPassRate: 0.92, avgDaysToPay: 14 },
  { id: 'pay-cigna',       name: 'Cigna Dental',             monogram: 'CG', tone: 'orange',  firstPassRate: 0.88, avgDaysToPay: 18 },
  { id: 'pay-aetna',       name: 'Aetna Dental',             monogram: 'AE', tone: 'purple',  firstPassRate: 0.85, avgDaysToPay: 21 },
  { id: 'pay-met',         name: 'MetLife Dental',           monogram: 'ML', tone: 'green',   firstPassRate: 0.90, avgDaysToPay: 16 },
  { id: 'pay-bcbs',        name: 'Blue Cross Blue Shield',   monogram: 'BC', tone: 'blue',    firstPassRate: 0.83, avgDaysToPay: 24 },
  { id: 'pay-uhc',         name: 'United Healthcare',        monogram: 'UH', tone: 'magenta', firstPassRate: 0.81, avgDaysToPay: 27 },
];

export const DENIAL_REASONS: DenialReason[] = [
  { code: 'CO-29',  short: 'Time limit for filing has expired',          appealable: false },
  { code: 'CO-50',  short: 'Not medically necessary per payer policy',   appealable: true  },
  { code: 'CO-97',  short: 'Procedure included in another procedure',    appealable: true  },
  { code: 'CO-109', short: 'Service not covered by this payer',          appealable: true  },
  { code: 'CO-151', short: 'Documentation does not support service',     appealable: true  },
  { code: 'CO-204', short: 'Service not covered under patient plan',     appealable: false },
  { code: 'CO-B7',  short: 'Provider not certified for this procedure',  appealable: true  },
];

const CDT_LIBRARY: { code: string; description: string; defaultFee: number }[] = [
  { code: 'D0150', description: 'Comprehensive oral evaluation',           defaultFee: 95 },
  { code: 'D1110', description: 'Adult prophylaxis',                       defaultFee: 110 },
  { code: 'D2150', description: 'Amalgam — two surfaces, primary',         defaultFee: 175 },
  { code: 'D2391', description: 'Resin composite — one surface, posterior',defaultFee: 220 },
  { code: 'D2740', description: 'Crown — porcelain/ceramic',               defaultFee: 1325 },
  { code: 'D2950', description: 'Core buildup, including any pins',        defaultFee: 295 },
  { code: 'D3310', description: 'Endodontic therapy — anterior',           defaultFee: 950 },
  { code: 'D6010', description: 'Surgical placement of implant',           defaultFee: 2400 },
  { code: 'D7140', description: 'Extraction — erupted tooth or root',      defaultFee: 240 },
  { code: 'D8090', description: 'Comprehensive ortho — adult',             defaultFee: 5500 },
];

// ─── Mock seed claims ────────────────────────────────────────────────────────

let _lineId = 0;
function lineId() { _lineId += 1; return `cln-${_lineId}`; }

function makeLine(cdt: string, opts: Partial<ClaimProcedureLine> = {}): ClaimProcedureLine {
  const ref = CDT_LIBRARY.find((c) => c.code === cdt)!;
  return {
    id: lineId(),
    cdtCode: ref.code,
    description: ref.description,
    units: 1,
    feeBilled: ref.defaultFee,
    ...opts,
  };
}

const ACTOR = { id: 'dr-aw', name: 'Dr. Alex Watanabe' };
const BILLER = { id: 'staff-ss', name: 'Sara Singh' };

function seedActivity(createdAt: string): ActivityEvent[] {
  return [
    makeActivityEvent({
      type: 'created', actorId: ACTOR.id, actorName: ACTOR.name, timestamp: createdAt, payload: {},
    }),
  ];
}

const dentist = (id: string) => DENTISTS.find((d) => d.id === id)!;
const patient = (id: string) => PATIENTS.find((p) => p.id === id)!;
const payer = (id: string) => PAYERS.find((p) => p.id === id)!;

// 16 mocked claims spanning every status & aging bucket.
export const SEED_CLAIMS: InsuranceClaim[] = [
  // 1. Draft (today)
  {
    id: 'clm-1', claimNumber: 'CLM-2026-0142',
    patient: patient('pat-mina'), payer: payer('pay-delta'), dentist: dentist('dr-aw'),
    dateOfService: daysFromNowISO(0), status: 'draft',
    procedures: [makeLine('D2740', { toothNumber: 14 }), makeLine('D2950', { toothNumber: 14 })],
    payments: [], appeals: [], notes: 'Awaiting attached X-ray before submission.',
    activity: seedActivity(daysFromNowISO(-1)),
  },
  // 2-4. Submitted, recent (0-30 days)
  {
    id: 'clm-2', claimNumber: 'CLM-2026-0141',
    patient: patient('pat-ethan'), payer: payer('pay-cigna'), dentist: dentist('dr-mp'),
    dateOfService: daysFromNowISO(-3), dateSubmitted: daysFromNowISO(-2), status: 'submitted',
    procedures: [makeLine('D2740', { toothNumber: 19 })],
    payments: [], appeals: [],
    activity: seedActivity(daysFromNowISO(-3)),
  },
  {
    id: 'clm-3', claimNumber: 'CLM-2026-0140',
    patient: patient('pat-noor'), payer: payer('pay-met'), dentist: dentist('dr-jk'),
    dateOfService: daysFromNowISO(-7), dateSubmitted: daysFromNowISO(-7), status: 'in-review',
    procedures: [makeLine('D6010', { toothNumber: 30 })],
    payments: [], appeals: [],
    activity: seedActivity(daysFromNowISO(-8)),
  },
  {
    id: 'clm-4', claimNumber: 'CLM-2026-0138',
    patient: patient('pat-leon'), payer: payer('pay-aetna'), dentist: dentist('dr-rs'),
    dateOfService: daysFromNowISO(-15), dateSubmitted: daysFromNowISO(-14), status: 'in-review',
    procedures: [makeLine('D8090')],
    payments: [], appeals: [],
    activity: seedActivity(daysFromNowISO(-16)),
  },
  // 5-6. Paid recently
  {
    id: 'clm-5', claimNumber: 'CLM-2026-0135',
    patient: patient('pat-aiko'), payer: payer('pay-delta'), dentist: dentist('dr-aw'),
    dateOfService: daysFromNowISO(-22), dateSubmitted: daysFromNowISO(-21), dateClosed: daysFromNowISO(-6),
    status: 'paid',
    procedures: [
      makeLine('D1110', { feeAllowed: 95,  feePaid: 95 }),
      makeLine('D0150', { feeAllowed: 80,  feePaid: 80 }),
    ],
    payments: [{
      id: 'pmt-1', postedAt: daysFromNowISO(-6), amount: 175, method: 'EFT',
      reference: 'ERA-447821', postedBy: BILLER.name,
    }],
    appeals: [],
    activity: seedActivity(daysFromNowISO(-23)),
  },
  {
    id: 'clm-6', claimNumber: 'CLM-2026-0130',
    patient: patient('pat-priya'), payer: payer('pay-met'), dentist: dentist('dr-mp'),
    dateOfService: daysFromNowISO(-26), dateSubmitted: daysFromNowISO(-25), dateClosed: daysFromNowISO(-12),
    status: 'paid',
    procedures: [makeLine('D2391', { feeAllowed: 200, feePaid: 200 })],
    payments: [{
      id: 'pmt-2', postedAt: daysFromNowISO(-12), amount: 200, method: 'EFT',
      reference: 'ERA-447205', postedBy: BILLER.name,
    }],
    appeals: [],
    activity: seedActivity(daysFromNowISO(-27)),
  },
  // 7. Partial (31-60 bucket)
  {
    id: 'clm-7', claimNumber: 'CLM-2026-0118',
    patient: patient('pat-tomas'), payer: payer('pay-bcbs'), dentist: dentist('dr-jk'),
    dateOfService: daysFromNowISO(-42), dateSubmitted: daysFromNowISO(-40), status: 'partial',
    procedures: [
      makeLine('D2740', {
        toothNumber: 8, feeAllowed: 1100, feePaid: 880,
        patientResponsibility: 220,
        adjustments: [{ code: 'PR-2', amount: 220, reason: 'Coinsurance' }],
      }),
    ],
    payments: [{
      id: 'pmt-3', postedAt: daysFromNowISO(-32), amount: 880, method: 'EFT',
      reference: 'ERA-446188', postedBy: BILLER.name,
    }],
    appeals: [],
    notes: 'Patient owes $220 — needs balance billing.',
    activity: seedActivity(daysFromNowISO(-43)),
  },
  // 8. Balance-billed
  {
    id: 'clm-8', claimNumber: 'CLM-2026-0112',
    patient: patient('pat-mina'), payer: payer('pay-uhc'), dentist: dentist('dr-aw'),
    dateOfService: daysFromNowISO(-50), dateSubmitted: daysFromNowISO(-49), status: 'balance-billed',
    procedures: [
      makeLine('D2150', {
        toothNumber: 31, feeAllowed: 150, feePaid: 120,
        patientResponsibility: 30,
      }),
    ],
    payments: [{
      id: 'pmt-4', postedAt: daysFromNowISO(-30), amount: 120, method: 'EFT',
      reference: 'ERA-445922', postedBy: BILLER.name,
    }],
    appeals: [],
    notes: 'Statement #1 sent; awaiting patient.',
    activity: seedActivity(daysFromNowISO(-51)),
  },
  // 9-10. Denied (61-90 bucket)
  {
    id: 'clm-9', claimNumber: 'CLM-2026-0098',
    patient: patient('pat-ethan'), payer: payer('pay-aetna'), dentist: dentist('dr-rs'),
    dateOfService: daysFromNowISO(-72), dateSubmitted: daysFromNowISO(-70), status: 'denied',
    procedures: [makeLine('D3310', { toothNumber: 9, deniedReasonCode: 'CO-50' })],
    payments: [], appeals: [],
    denialReasonCode: 'CO-50',
    notes: 'Endo denied as not medically necessary; need narrative + radiograph for appeal.',
    activity: seedActivity(daysFromNowISO(-73)),
  },
  {
    id: 'clm-10', claimNumber: 'CLM-2026-0091',
    patient: patient('pat-noor'), payer: payer('pay-cigna'), dentist: dentist('dr-jk'),
    dateOfService: daysFromNowISO(-78), dateSubmitted: daysFromNowISO(-76), status: 'denied',
    procedures: [makeLine('D2740', { toothNumber: 18, deniedReasonCode: 'CO-97' })],
    payments: [], appeals: [],
    denialReasonCode: 'CO-97',
    activity: seedActivity(daysFromNowISO(-79)),
  },
  // 11. Appealed (91+ bucket)
  {
    id: 'clm-11', claimNumber: 'CLM-2026-0078',
    patient: patient('pat-leon'), payer: payer('pay-bcbs'), dentist: dentist('dr-aw'),
    dateOfService: daysFromNowISO(-105), dateSubmitted: daysFromNowISO(-100), status: 'appealed',
    procedures: [makeLine('D8090', { deniedReasonCode: 'CO-50' })],
    payments: [],
    appeals: [{
      id: 'apl-1', filedAt: daysFromNowISO(-30), filedBy: BILLER.name,
      reason: 'Submitted updated treatment narrative + cephalometric tracings.',
    }],
    denialReasonCode: 'CO-50',
    activity: seedActivity(daysFromNowISO(-106)),
  },
  // 12. Patient-paid
  {
    id: 'clm-12', claimNumber: 'CLM-2026-0066',
    patient: patient('pat-aiko'), payer: payer('pay-delta'), dentist: dentist('dr-mp'),
    dateOfService: daysFromNowISO(-90), dateSubmitted: daysFromNowISO(-88), dateClosed: daysFromNowISO(-3),
    status: 'patient-paid',
    procedures: [
      makeLine('D2740', { toothNumber: 14, feeAllowed: 1200, feePaid: 960, patientResponsibility: 240 }),
    ],
    payments: [
      { id: 'pmt-5', postedAt: daysFromNowISO(-70), amount: 960, method: 'EFT',         reference: 'ERA-444801', postedBy: BILLER.name },
      { id: 'pmt-6', postedAt: daysFromNowISO(-3),  amount: 240, method: 'patient-card', reference: 'AUTH-23A19', postedBy: BILLER.name },
    ],
    appeals: [],
    activity: seedActivity(daysFromNowISO(-91)),
  },
  // 13. Written-off
  {
    id: 'clm-13', claimNumber: 'CLM-2026-0050',
    patient: patient('pat-priya'), payer: payer('pay-uhc'), dentist: dentist('dr-rs'),
    dateOfService: daysFromNowISO(-160), dateSubmitted: daysFromNowISO(-158), dateClosed: daysFromNowISO(-100),
    status: 'written-off',
    procedures: [makeLine('D7140', { toothNumber: 32, deniedReasonCode: 'CO-29' })],
    payments: [], appeals: [],
    denialReasonCode: 'CO-29',
    notes: 'Filing limit expired; not appealable. Wrote off $240.',
    activity: seedActivity(daysFromNowISO(-161)),
  },
  // 14-15. Stale unresolved (90+ bucket)
  {
    id: 'clm-14', claimNumber: 'CLM-2025-0982',
    patient: patient('pat-tomas'), payer: payer('pay-aetna'), dentist: dentist('dr-jk'),
    dateOfService: daysFromNowISO(-115), dateSubmitted: daysFromNowISO(-110), status: 'in-review',
    procedures: [makeLine('D6010', { toothNumber: 19 })],
    payments: [], appeals: [],
    notes: 'Payer keeps requesting additional documentation. Followed up 3×.',
    activity: seedActivity(daysFromNowISO(-116)),
  },
  {
    id: 'clm-15', claimNumber: 'CLM-2025-0951',
    patient: patient('pat-mina'), payer: payer('pay-bcbs'), dentist: dentist('dr-aw'),
    dateOfService: daysFromNowISO(-130), dateSubmitted: daysFromNowISO(-125), status: 'denied',
    procedures: [makeLine('D2740', { toothNumber: 7, deniedReasonCode: 'CO-151' })],
    payments: [], appeals: [],
    denialReasonCode: 'CO-151',
    notes: 'Need updated periapical and progress notes for appeal.',
    activity: seedActivity(daysFromNowISO(-131)),
  },
  // 16. Submitted very recently
  {
    id: 'clm-16', claimNumber: 'CLM-2026-0143',
    patient: patient('pat-ethan'), payer: payer('pay-met'), dentist: dentist('dr-mp'),
    dateOfService: daysFromNowISO(-1), dateSubmitted: daysFromNowISO(0), status: 'submitted',
    procedures: [makeLine('D1110'), makeLine('D0150')],
    payments: [], appeals: [],
    activity: seedActivity(daysFromNowISO(-1)),
  },
];

// ─── Reducer ─────────────────────────────────────────────────────────────────

export type ClaimsAction =
  | { type: 'SET_FILTERS'; patch: Partial<ClaimsFiltersState> }
  | { type: 'SET_VIEW_MODE'; mode: ClaimsViewMode }
  | { type: 'SELECT_CLAIM'; id: string | null }
  | { type: 'OPEN_MODAL'; modal: ClaimsState['modal'] }
  | { type: 'ADVANCE'; id: string; to: ClaimStatus; payload?: Record<string, unknown> }
  | { type: 'POST_PAYMENT'; id: string; amount: number; method: ClaimPayment['method']; reference: string }
  | { type: 'FILE_APPEAL'; id: string; reason: string }
  | { type: 'WRITE_OFF';   id: string; notes?: string };

export function initClaimsState(seed: InsuranceClaim[] = SEED_CLAIMS): ClaimsState {
  const claims: Record<string, InsuranceClaim> = {};
  const order: string[] = [];
  for (const c of seed) {
    claims[c.id] = c;
    order.push(c.id);
  }
  return {
    claims,
    order,
    filters: { search: '', status: 'all', payerId: 'all', agingBucket: 'all' },
    viewMode: 'list',
    selectedClaimId: null,
    modal: { type: 'none' },
  };
}

function pushActivity(claim: InsuranceClaim, evt: ActivityEvent): InsuranceClaim {
  return { ...claim, activity: [...claim.activity, evt] };
}

function logTransition(claim: InsuranceClaim, to: ClaimStatus, payload: Record<string, unknown>): InsuranceClaim {
  return pushActivity(claim, makeActivityEvent({
    type: 'status-change', actorId: ACTOR.id, actorName: ACTOR.name,
    payload: { from: claim.status, to, ...payload },
  }));
}

export function claimsReducer(state: ClaimsState, action: ClaimsAction): ClaimsState {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.patch } };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.mode };
    case 'SELECT_CLAIM':
      return { ...state, selectedClaimId: action.id };
    case 'OPEN_MODAL':
      return { ...state, modal: action.modal };

    case 'ADVANCE': {
      const c = state.claims[action.id];
      if (!c) return state;
      if (!canClaimTransition(c.status, action.to)) return state;
      const updated: InsuranceClaim = logTransition({
        ...c,
        status: action.to,
        dateSubmitted: action.to === 'submitted' ? new Date().toISOString() : c.dateSubmitted,
        dateClosed: ['paid', 'patient-paid', 'written-off'].includes(action.to) ? new Date().toISOString() : c.dateClosed,
      }, action.to, action.payload ?? {});
      return { ...state, claims: { ...state.claims, [action.id]: updated } };
    }

    case 'POST_PAYMENT': {
      const c = state.claims[action.id];
      if (!c) return state;
      const pmt: ClaimPayment = {
        id: `pmt-${Date.now()}`,
        postedAt: new Date().toISOString(),
        amount: action.amount,
        method: action.method,
        reference: action.reference,
        postedBy: BILLER.name,
      };
      const totalBilled = c.procedures.reduce((s, p) => s + p.feeBilled, 0);
      const totalPaid = c.payments.reduce((s, p) => s + p.amount, 0) + action.amount;
      const nextStatus: ClaimStatus =
        totalPaid >= totalBilled ? 'paid' : 'partial';
      const transition = canClaimTransition(c.status, nextStatus) ? nextStatus : c.status;
      let updated: InsuranceClaim = {
        ...c,
        payments: [...c.payments, pmt],
        status: transition,
        dateClosed: transition === 'paid' ? new Date().toISOString() : c.dateClosed,
      };
      updated = pushActivity(updated, makeActivityEvent({
        type: 'message-sent',
        actorId: BILLER.id, actorName: BILLER.name,
        payload: { kind: 'payment-posted', amount: action.amount, method: action.method, reference: action.reference },
      }));
      if (transition !== c.status) {
        updated = logTransition(updated, transition, { reason: 'payment-posted' });
        updated.status = transition;
      }
      return { ...state, claims: { ...state.claims, [action.id]: updated }, modal: { type: 'none' } };
    }

    case 'FILE_APPEAL': {
      const c = state.claims[action.id];
      if (!c) return state;
      if (!canClaimTransition(c.status, 'appealed')) return state;
      const newAppeal: Appeal = {
        id: `apl-${Date.now()}`,
        filedAt: new Date().toISOString(),
        filedBy: BILLER.name,
        reason: action.reason,
      };
      let updated: InsuranceClaim = { ...c, appeals: [...c.appeals, newAppeal], status: 'appealed' };
      updated = logTransition(updated, 'appealed', { appealId: newAppeal.id });
      return { ...state, claims: { ...state.claims, [action.id]: updated }, modal: { type: 'none' } };
    }

    case 'WRITE_OFF': {
      const c = state.claims[action.id];
      if (!c) return state;
      if (!canClaimTransition(c.status, 'written-off')) return state;
      let updated: InsuranceClaim = {
        ...c,
        status: 'written-off',
        dateClosed: new Date().toISOString(),
        notes: action.notes ?? c.notes,
      };
      updated = logTransition(updated, 'written-off', { reason: action.notes ?? '' });
      return { ...state, claims: { ...state.claims, [action.id]: updated }, modal: { type: 'none' } };
    }

    default:
      return state;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function lineBalance(line: ClaimProcedureLine): number {
  return Math.max(0, line.feeBilled - (line.feePaid ?? 0) - (line.patientResponsibility ?? 0));
}

export function claimTotalBilled(c: InsuranceClaim): number {
  return c.procedures.reduce((s, p) => s + p.feeBilled, 0);
}
export function claimTotalPaid(c: InsuranceClaim): number {
  return c.payments.reduce((s, p) => s + p.amount, 0);
}
export function claimOutstanding(c: InsuranceClaim): number {
  return Math.max(0, claimTotalBilled(c) - claimTotalPaid(c));
}
export function claimPatientResponsibility(c: InsuranceClaim): number {
  return c.procedures.reduce((s, p) => s + (p.patientResponsibility ?? 0), 0);
}
/** Days since submission for unresolved claims; 0 for drafts. */
export function claimAgeDays(c: InsuranceClaim): number {
  if (!c.dateSubmitted) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(c.dateSubmitted).getTime()) / (1000 * 60 * 60 * 24)));
}

export type AgingBucket = '0-30' | '31-60' | '61-90' | '90+';

export function bucketFor(days: number): AgingBucket {
  if (days <= 30) return '0-30';
  if (days <= 60) return '31-60';
  if (days <= 90) return '61-90';
  return '90+';
}

export function denialReasonByCode(code: string | undefined): DenialReason | undefined {
  return code ? DENIAL_REASONS.find((d) => d.code === code) : undefined;
}

export function formatUSD(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export const STATUS_LABEL: Record<ClaimStatus, string> = {
  'draft':           'Draft',
  'submitted':       'Submitted',
  'in-review':       'In review',
  'paid':            'Paid',
  'partial':         'Partially paid',
  'denied':          'Denied',
  'appealed':        'Appealed',
  'balance-billed':  'Balance billed',
  'patient-paid':    'Patient paid',
  'written-off':     'Written off',
};
