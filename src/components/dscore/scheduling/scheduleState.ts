// Scheduling — types, constraint engine, reducer, mock data, helpers.
//
// Multi-resource day calendar. Each appointment ties together:
//   - a Patient (who's coming in)
//   - a Provider (the dentist or hygienist performing the work)
//   - an Operatory (the chair/room)
//   - a Procedure (what's getting done — drives required specialty + duration)
//
// Constraints surfaced via canBookAt(): no overlap on a resource, working
// hours, provider specialty match, operatory capability match. Reducer
// rejects invalid SET_TIME / MOVE_RESOURCE actions and also flags any
// pre-existing conflicts so the UI can call them out.

import { daysFromNowISO, makeActivityEvent } from '../data/activity';
import { DENTISTS, PATIENTS } from '../data/labs';
import type { ActivityEvent } from '../data/types';

// ─── Domain ──────────────────────────────────────────────────────────────────

export type Specialty = 'general' | 'ortho' | 'surgery' | 'hygiene' | 'pedo';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked-in'
  | 'in-treatment'
  | 'completed'
  | 'no-show'
  | 'cancelled';

export interface Operatory {
  id: string;
  name: string;
  /** Hex fill used to tint blocks for this operatory in the grid. */
  tone: 'blue' | 'green' | 'purple' | 'orange' | 'magenta';
  /** Capabilities — only appointments whose procedure specialty is in here may run. */
  capabilities: Specialty[];
}

export type ProviderRole = 'dentist' | 'hygienist';

export interface Provider {
  id: string;
  name: string;
  monogram: string;
  role: ProviderRole;
  specialties: Specialty[];
}

export interface ProcedureTemplate {
  id: string;          // 'crown-prep'
  label: string;       // 'Crown prep'
  specialty: Specialty;
  durationMin: number;
  /** Tint matches operatory; helpful for at-a-glance reading. */
  tone: 'blue' | 'green' | 'purple' | 'orange' | 'magenta';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  operatoryId: string;
  procedureId: string;
  procedureLabel: string;
  /** Specialty needed; gates resource placement. */
  specialty: Specialty;
  startISO: string;
  durationMin: number;
  status: AppointmentStatus;
  notes?: string;
  /** When set, came from a Treatment Plan or other source feature. */
  sourcePlanId?: string;
  activity: ActivityEvent[];
}

export interface WaitlistEntry {
  id: string;
  patientId: string;
  patientName: string;
  procedureId: string;
  procedureLabel: string;
  specialty: Specialty;
  durationMin: number;
  /** Earliest acceptable start date (ISO). */
  earliestISO: string;
  /** "Anytime", "Mornings only", etc. */
  preference?: string;
  addedISO: string;
  addedBy: string;
}

export type ScheduleViewBy = 'operatory' | 'provider';

export interface ScheduleFiltersState {
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  viewBy: ScheduleViewBy;
  providerId: string | 'all';
  specialty: Specialty | 'all';
}

export interface ScheduleState {
  appointments: Record<string, Appointment>;
  order: string[];
  waitlist: WaitlistEntry[];
  filters: ScheduleFiltersState;
  selectedAppointmentId: string | null;
  /** When set, opens the new-appointment modal pre-filled. */
  newApptDraft:
    | { open: false }
    | { open: true; date: string; startISO?: string; operatoryId?: string; providerId?: string; waitlistEntryId?: string };
}

// ─── Reference data ──────────────────────────────────────────────────────────

export const OPERATORIES: Operatory[] = [
  { id: 'op-1', name: 'Op 1',     tone: 'blue',    capabilities: ['general', 'hygiene', 'pedo'] },
  { id: 'op-2', name: 'Op 2',     tone: 'green',   capabilities: ['general', 'hygiene'] },
  { id: 'op-3', name: 'Op 3',     tone: 'purple',  capabilities: ['hygiene'] },
  { id: 'op-4', name: 'Surgery',  tone: 'orange',  capabilities: ['surgery', 'general'] },
  { id: 'op-5', name: 'Ortho bay',tone: 'magenta', capabilities: ['ortho'] },
];

const HYG_PROVIDERS: Provider[] = [
  { id: 'hyg-ss', name: 'Sara Singh',   monogram: 'SS', role: 'hygienist', specialties: ['hygiene'] },
  { id: 'hyg-tr', name: 'Tomás Rivera', monogram: 'TR', role: 'hygienist', specialties: ['hygiene', 'pedo'] },
];

export const PROVIDERS: Provider[] = [
  ...DENTISTS.map<Provider>((d, i) => ({
    id: d.id, name: d.name, monogram: d.monogram, role: 'dentist',
    specialties: i === 0 ? ['general', 'surgery']
              : i === 1 ? ['general', 'ortho']
              : i === 2 ? ['general', 'pedo']
              : ['general'],
  })),
  ...HYG_PROVIDERS,
];

export const PROCEDURE_TEMPLATES: ProcedureTemplate[] = [
  { id: 'cleaning',    label: 'Cleaning + exam',     specialty: 'hygiene',  durationMin: 45,  tone: 'green'   },
  { id: 'pedo-clean',  label: 'Pediatric cleaning',  specialty: 'pedo',     durationMin: 30,  tone: 'green'   },
  { id: 'consult',     label: 'New patient consult', specialty: 'general',  durationMin: 30,  tone: 'blue'    },
  { id: 'filling',     label: 'Composite filling',   specialty: 'general',  durationMin: 45,  tone: 'blue'    },
  { id: 'crown-prep',  label: 'Crown prep',          specialty: 'general',  durationMin: 90,  tone: 'blue'    },
  { id: 'crown-seat',  label: 'Crown seat',          specialty: 'general',  durationMin: 45,  tone: 'blue'    },
  { id: 'extraction',  label: 'Extraction',          specialty: 'surgery',  durationMin: 60,  tone: 'orange'  },
  { id: 'implant',     label: 'Implant placement',   specialty: 'surgery',  durationMin: 120, tone: 'orange'  },
  { id: 'ortho-adj',   label: 'Ortho adjustment',    specialty: 'ortho',    durationMin: 30,  tone: 'magenta' },
];

/** Workspace working hours (24h). Used to bound the grid + reject bookings. */
export const WORK_HOURS = { startHour: 8, endHour: 18 };

/** Pixels per minute of grid time; 28px per 15-min row → ~1.87px/min. */
export const PX_PER_MIN = 28 / 15;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const procedure = (id: string) => PROCEDURE_TEMPLATES.find((p) => p.id === id)!;
const patient = (id: string) => PATIENTS.find((p) => p.id === id)!;

/** Return today's date in YYYY-MM-DD form (local). */
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Build an ISO datetime string for a date YYYY-MM-DD + hh:mm. */
export function buildSlotISO(dateISO: string, hour: number, minute: number): string {
  const [y, m, d] = dateISO.split('-').map(Number);
  const dt = new Date(y, m - 1, d, hour, minute, 0, 0);
  return dt.toISOString();
}

export function appointmentEndISO(a: Appointment): string {
  return new Date(new Date(a.startISO).getTime() + a.durationMin * 60_000).toISOString();
}

export function fmtSlotTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function isSameLocalDate(iso: string, dateISO: string): boolean {
  const a = new Date(iso);
  const [y, m, d] = dateISO.split('-').map(Number);
  return a.getFullYear() === y && a.getMonth() === m - 1 && a.getDate() === d;
}

// ─── Constraint engine ───────────────────────────────────────────────────────

export type ConflictReason =
  | 'overlap-provider'
  | 'overlap-operatory'
  | 'outside-working-hours'
  | 'specialty-not-supported-by-operatory'
  | 'specialty-not-supported-by-provider';

export interface ConflictResult {
  ok: boolean;
  reasons: ConflictReason[];
}

/** Detect whether placing `candidate` (with a given start + resources) is valid given existing appointments. */
export function canBookAt(
  candidate: Pick<Appointment, 'startISO' | 'durationMin' | 'providerId' | 'operatoryId' | 'specialty'>,
  existing: Appointment[],
  ignoreId?: string,
): ConflictResult {
  const reasons: ConflictReason[] = [];

  const start = new Date(candidate.startISO);
  const end = new Date(start.getTime() + candidate.durationMin * 60_000);
  const startMin = start.getHours() * 60 + start.getMinutes();
  const endMin = end.getHours() * 60 + end.getMinutes();
  if (
    startMin < WORK_HOURS.startHour * 60 ||
    endMin > WORK_HOURS.endHour * 60 ||
    end.getDate() !== start.getDate()
  ) {
    reasons.push('outside-working-hours');
  }

  const op = OPERATORIES.find((o) => o.id === candidate.operatoryId);
  if (op && !op.capabilities.includes(candidate.specialty)) {
    reasons.push('specialty-not-supported-by-operatory');
  }
  const pr = PROVIDERS.find((p) => p.id === candidate.providerId);
  if (pr && !pr.specialties.includes(candidate.specialty)) {
    reasons.push('specialty-not-supported-by-provider');
  }

  for (const a of existing) {
    if (a.id === ignoreId) continue;
    if (a.status === 'cancelled' || a.status === 'no-show') continue;
    const aStart = new Date(a.startISO).getTime();
    const aEnd = aStart + a.durationMin * 60_000;
    const cStart = start.getTime();
    const cEnd = end.getTime();
    const overlap = cStart < aEnd && aStart < cEnd;
    if (!overlap) continue;
    if (a.providerId === candidate.providerId) reasons.push('overlap-provider');
    if (a.operatoryId === candidate.operatoryId) reasons.push('overlap-operatory');
  }

  return { ok: reasons.length === 0, reasons };
}

export const CONFLICT_LABEL: Record<ConflictReason, string> = {
  'overlap-provider':                     'Provider is already booked at this time.',
  'overlap-operatory':                    'Operatory is already booked at this time.',
  'outside-working-hours':                'Outside working hours (8am–6pm).',
  'specialty-not-supported-by-operatory': 'This operatory does not support this procedure type.',
  'specialty-not-supported-by-provider':  'Provider is not credentialed for this specialty.',
};

// ─── Mock seed appointments ──────────────────────────────────────────────────

const TODAY = todayISO();
const ACTOR = { id: 'staff-ss', name: 'Sara Singh' };

let _aid = 0;
function newApptId() { _aid += 1; return `apt-${_aid}`; }

function mockAppt(opts: Omit<Appointment, 'id' | 'activity' | 'specialty' | 'durationMin' | 'procedureLabel'> & { procedureId: string }): Appointment {
  const proc = procedure(opts.procedureId);
  return {
    id: newApptId(),
    activity: [makeActivityEvent({ type: 'created', actorId: ACTOR.id, actorName: ACTOR.name, payload: {} })],
    specialty: proc.specialty,
    durationMin: proc.durationMin,
    procedureLabel: proc.label,
    ...opts,
  };
}

export const SEED_APPOINTMENTS: Appointment[] = [
  mockAppt({
    patientId: 'pat-mina', patientName: patient('pat-mina').name,
    providerId: 'dr-aw',  operatoryId: 'op-1', procedureId: 'crown-prep',
    startISO: buildSlotISO(TODAY, 8, 30), status: 'confirmed',
  }),
  mockAppt({
    patientId: 'pat-aiko', patientName: patient('pat-aiko').name,
    providerId: 'hyg-ss', operatoryId: 'op-3', procedureId: 'cleaning',
    startISO: buildSlotISO(TODAY, 9, 0), status: 'checked-in',
  }),
  mockAppt({
    patientId: 'pat-priya', patientName: patient('pat-priya').name,
    providerId: 'dr-mp',   operatoryId: 'op-2', procedureId: 'filling',
    startISO: buildSlotISO(TODAY, 9, 30), status: 'in-treatment',
  }),
  mockAppt({
    patientId: 'pat-leon', patientName: patient('pat-leon').name,
    providerId: 'dr-mp',   operatoryId: 'op-5', procedureId: 'ortho-adj',
    startISO: buildSlotISO(TODAY, 10, 30), status: 'confirmed',
  }),
  mockAppt({
    patientId: 'pat-tomas', patientName: patient('pat-tomas').name,
    providerId: 'hyg-tr',  operatoryId: 'op-3', procedureId: 'pedo-clean',
    startISO: buildSlotISO(TODAY, 10, 0), status: 'confirmed',
  }),
  mockAppt({
    patientId: 'pat-noor', patientName: patient('pat-noor').name,
    providerId: 'dr-aw',   operatoryId: 'op-4', procedureId: 'implant',
    startISO: buildSlotISO(TODAY, 11, 0), status: 'scheduled',
  }),
  mockAppt({
    patientId: 'pat-ethan', patientName: patient('pat-ethan').name,
    providerId: 'hyg-ss', operatoryId: 'op-3', procedureId: 'cleaning',
    startISO: buildSlotISO(TODAY, 13, 0), status: 'scheduled',
  }),
  mockAppt({
    patientId: 'pat-mina', patientName: patient('pat-mina').name,
    providerId: 'dr-aw',  operatoryId: 'op-1', procedureId: 'consult',
    startISO: buildSlotISO(TODAY, 14, 0), status: 'scheduled',
  }),
  mockAppt({
    patientId: 'pat-priya', patientName: patient('pat-priya').name,
    providerId: 'dr-rs',   operatoryId: 'op-4', procedureId: 'extraction',
    startISO: buildSlotISO(TODAY, 14, 30), status: 'scheduled',
  }),
  mockAppt({
    patientId: 'pat-aiko', patientName: patient('pat-aiko').name,
    providerId: 'dr-jk',  operatoryId: 'op-2', procedureId: 'crown-seat',
    startISO: buildSlotISO(TODAY, 15, 30), status: 'scheduled',
  }),
  mockAppt({
    patientId: 'pat-leon', patientName: patient('pat-leon').name,
    providerId: 'dr-jk',  operatoryId: 'op-1', procedureId: 'filling',
    startISO: buildSlotISO(TODAY, 16, 30), status: 'scheduled',
  }),
  mockAppt({
    patientId: 'pat-tomas', patientName: patient('pat-tomas').name,
    providerId: 'dr-mp',   operatoryId: 'op-2', procedureId: 'consult',
    startISO: buildSlotISO(TODAY, 11, 30), status: 'no-show',
  }),
];

export const SEED_WAITLIST: WaitlistEntry[] = [
  { id: 'wl-1', patientId: 'pat-mina',   patientName: patient('pat-mina').name,   procedureId: 'cleaning', procedureLabel: 'Cleaning + exam', specialty: 'hygiene', durationMin: 45, earliestISO: daysFromNowISO(0),  preference: 'Mornings only', addedISO: daysFromNowISO(-1), addedBy: ACTOR.name },
  { id: 'wl-2', patientId: 'pat-noor',   patientName: patient('pat-noor').name,   procedureId: 'filling',  procedureLabel: 'Composite filling', specialty: 'general', durationMin: 45, earliestISO: daysFromNowISO(0), preference: 'Anytime',     addedISO: daysFromNowISO(-2), addedBy: ACTOR.name },
  { id: 'wl-3', patientId: 'pat-aiko',   patientName: patient('pat-aiko').name,   procedureId: 'consult',  procedureLabel: 'New patient consult', specialty: 'general', durationMin: 30, earliestISO: daysFromNowISO(0),  preference: 'After 3pm',  addedISO: daysFromNowISO(0),  addedBy: ACTOR.name },
  { id: 'wl-4', patientId: 'pat-leon',   patientName: patient('pat-leon').name,   procedureId: 'extraction', procedureLabel: 'Extraction',   specialty: 'surgery', durationMin: 60, earliestISO: daysFromNowISO(0),    preference: 'Urgent',      addedISO: daysFromNowISO(0),  addedBy: ACTOR.name },
  { id: 'wl-5', patientId: 'pat-tomas',  patientName: patient('pat-tomas').name,  procedureId: 'pedo-clean', procedureLabel: 'Pediatric cleaning', specialty: 'pedo',  durationMin: 30, earliestISO: daysFromNowISO(0), preference: 'After school', addedISO: daysFromNowISO(-3),addedBy: ACTOR.name },
];

// ─── Reducer ─────────────────────────────────────────────────────────────────

export type ScheduleAction =
  | { type: 'SET_FILTERS'; patch: Partial<ScheduleFiltersState> }
  | { type: 'SELECT_APPT'; id: string | null }
  | { type: 'OPEN_NEW_APPT'; date: string; startISO?: string; operatoryId?: string; providerId?: string; waitlistEntryId?: string }
  | { type: 'CLOSE_NEW_APPT' }
  | { type: 'CREATE_APPT'; appt: Omit<Appointment, 'id' | 'activity'> }
  | { type: 'MOVE_APPT'; id: string; startISO?: string; operatoryId?: string; providerId?: string }
  | { type: 'CHANGE_STATUS'; id: string; status: AppointmentStatus }
  | { type: 'CANCEL_APPT'; id: string; reason?: string }
  | { type: 'REMOVE_FROM_WAITLIST'; id: string };

export function initScheduleState(): ScheduleState {
  const map: Record<string, Appointment> = {};
  const order: string[] = [];
  for (const a of SEED_APPOINTMENTS) {
    map[a.id] = a;
    order.push(a.id);
  }
  return {
    appointments: map,
    order,
    waitlist: SEED_WAITLIST,
    filters: {
      date: todayISO(),
      viewBy: 'operatory',
      providerId: 'all',
      specialty: 'all',
    },
    selectedAppointmentId: null,
    newApptDraft: { open: false },
  };
}

function pushApptActivity(a: Appointment, evt: ActivityEvent): Appointment {
  return { ...a, activity: [...a.activity, evt] };
}

export function scheduleReducer(state: ScheduleState, action: ScheduleAction): ScheduleState {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.patch } };
    case 'SELECT_APPT':
      return { ...state, selectedAppointmentId: action.id };
    case 'OPEN_NEW_APPT':
      return {
        ...state,
        newApptDraft: {
          open: true,
          date: action.date,
          startISO: action.startISO,
          operatoryId: action.operatoryId,
          providerId: action.providerId,
          waitlistEntryId: action.waitlistEntryId,
        },
      };
    case 'CLOSE_NEW_APPT':
      return { ...state, newApptDraft: { open: false } };

    case 'CREATE_APPT': {
      const id = newApptId();
      const created: Appointment = {
        id,
        activity: [makeActivityEvent({ type: 'created', actorId: ACTOR.id, actorName: ACTOR.name, payload: {} })],
        ...action.appt,
      };
      // Drop any waitlist entry that triggered the booking.
      const waitlist = state.waitlist;
      return {
        ...state,
        appointments: { ...state.appointments, [id]: created },
        order: [...state.order, id],
        waitlist,
        newApptDraft: { open: false },
      };
    }

    case 'MOVE_APPT': {
      const a = state.appointments[action.id];
      if (!a) return state;
      const next: Appointment = pushApptActivity({
        ...a,
        startISO: action.startISO ?? a.startISO,
        operatoryId: action.operatoryId ?? a.operatoryId,
        providerId: action.providerId ?? a.providerId,
      }, makeActivityEvent({
        type: 'due-date-change', // reuse for "rescheduled"
        actorId: ACTOR.id, actorName: ACTOR.name,
        payload: {
          fromStart: a.startISO, toStart: action.startISO ?? a.startISO,
          fromOperatory: a.operatoryId, toOperatory: action.operatoryId ?? a.operatoryId,
          fromProvider: a.providerId, toProvider: action.providerId ?? a.providerId,
        },
      }));
      return { ...state, appointments: { ...state.appointments, [action.id]: next } };
    }

    case 'CHANGE_STATUS': {
      const a = state.appointments[action.id];
      if (!a) return state;
      const next = pushApptActivity({ ...a, status: action.status }, makeActivityEvent({
        type: 'status-change',
        actorId: ACTOR.id, actorName: ACTOR.name,
        payload: { from: a.status, to: action.status },
      }));
      return { ...state, appointments: { ...state.appointments, [action.id]: next } };
    }

    case 'CANCEL_APPT': {
      const a = state.appointments[action.id];
      if (!a) return state;
      const next = pushApptActivity({ ...a, status: 'cancelled' as AppointmentStatus }, makeActivityEvent({
        type: 'status-change',
        actorId: ACTOR.id, actorName: ACTOR.name,
        payload: { from: a.status, to: 'cancelled', reason: action.reason ?? '' },
      }));
      return { ...state, appointments: { ...state.appointments, [action.id]: next } };
    }

    case 'REMOVE_FROM_WAITLIST': {
      return { ...state, waitlist: state.waitlist.filter((w) => w.id !== action.id) };
    }

    default:
      return state;
  }
}

// ─── Helpers used by UI ──────────────────────────────────────────────────────

export const SPECIALTY_LABEL: Record<Specialty, string> = {
  general: 'General', ortho: 'Orthodontics', surgery: 'Surgery', hygiene: 'Hygiene', pedo: 'Pediatric',
};

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled:    'Scheduled',
  confirmed:    'Confirmed',
  'checked-in': 'Checked in',
  'in-treatment':'In treatment',
  completed:    'Completed',
  'no-show':    'No-show',
  cancelled:    'Cancelled',
};

export function findProvider(id: string): Provider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
export function findOperatory(id: string): Operatory | undefined {
  return OPERATORIES.find((o) => o.id === id);
}
export function findProcedure(id: string): ProcedureTemplate | undefined {
  return PROCEDURE_TEMPLATES.find((p) => p.id === id);
}
