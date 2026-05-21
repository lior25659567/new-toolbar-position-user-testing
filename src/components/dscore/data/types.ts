// Shared types across DS Core SaaS workflows: Jobs, Treatment Plans, Analytics.
// Mirrors the domain (lab cases, multi-phase treatment plans, audit trail) and is
// kept in one place so the three features stay consistent.

// ─── People ──────────────────────────────────────────────────────────────────

export type ActorRole = 'dentist' | 'lab' | 'patient' | 'system';

export interface Actor {
  id: string;
  name: string;
  monogram: string;       // 2 letters for the avatar
  role: ActorRole;
}

// ─── Labs ────────────────────────────────────────────────────────────────────

export interface Lab {
  id: string;
  name: string;
  monogram: string;
  specialty: 'Restorative' | 'Orthodontics' | 'Implantology' | 'Appliance' | 'Full-service';
  /** SLA target in business days for a standard order. */
  slaDays: number;
}

// ─── Activity (audit trail) ──────────────────────────────────────────────────

export type ActivityEventType =
  | 'created'
  | 'assigned'
  | 'status-change'
  | 'message-sent'
  | 'file-added'
  | 'changes-requested'
  | 'priority-change'
  | 'due-date-change'
  | 'plan-version-bumped'
  | 'plan-presented'
  | 'plan-accepted'
  | 'plan-declined';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  actor: { id: string; name: string; role: ActorRole };
  timestamp: string;                      // ISO
  payload: Record<string, unknown>;       // shape varies by type
}

// ─── Jobs (Feature 1) ────────────────────────────────────────────────────────

export type JobStatus =
  | 'new'
  | 'in-design'
  | 'in-production'
  | 'quality-check'
  | 'shipping'
  | 'delivered'
  | 'changes-requested'
  | 'cancelled';

export type JobCategory =
  | 'Restorative'
  | 'Orthodontics'
  | 'Implantology'
  | 'Appliance'
  | 'Diagnostic';

export type Priority = 'standard' | 'rush' | 'urgent';

export interface Attachment {
  id: string;
  name: string;
  kind: 'image' | 'video' | 'scan' | 'pdf' | 'other';
  sizeKb: number;
  uploadedBy: string;
  uploadedAt: string;                     // ISO
}

export interface ChatMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: ActorRole;
  body: string;
  timestamp: string;                      // ISO
  isOwn?: boolean;                        // computed at render time
}

export interface Job {
  id: string;
  patient: { id: string; name: string };
  lab: Pick<Lab, 'id' | 'name' | 'monogram'>;
  dentist: { id: string; name: string; monogram: string };
  service: string;                        // 'Crown — porcelain/ceramic'
  category: JobCategory;
  status: JobStatus;
  priority: Priority;
  createdAt: string;                      // ISO
  dueDate: string;                        // ISO
  shippedAt?: string;                     // ISO
  toothNumbers: number[];                 // FDI
  notes?: string;
  attachments: Attachment[];
  activity: ActivityEvent[];
  messages: ChatMessage[];
  /** Set when this Job was generated from an accepted Treatment Plan. */
  sourcePlanId?: string;
  /** Display flag: how many unread messages for the current user. */
  unreadMessages?: number;
}

export interface JobsFiltersState {
  search: string;
  status: JobStatus | 'all';
  labId: string | 'all';
  category: JobCategory | 'all';
  priority: Priority | 'all';
  slaRiskOnly: boolean;
}

export type JobsViewMode = 'kanban' | 'list';

// ─── Treatment Plans (Feature 2) ─────────────────────────────────────────────

export type PlanStatus =
  | 'draft'
  | 'presented'
  | 'accepted'
  | 'declined'
  | 'in-progress'
  | 'completed';

export interface ProcedureCatalogEntry {
  code: string;                           // 'D2740' style ADA code (mocked)
  name: string;                           // 'Crown — porcelain/ceramic'
  category: JobCategory;
  defaultPrice: number;                   // USD
  defaultDurationMin: number;
  appliesPerTooth: boolean;
  /** When true, accepting a plan with this procedure spawns a Job. */
  generatesJob: boolean;
  /** 0–1; mock insurance coverage percent. */
  insuranceCoverageDefault: number;
  /** When set, this procedure cannot appear in a phase before any procedure
   *  whose `code` is in `prerequisites` from a strictly-earlier phase. */
  prerequisites?: string[];
  /** Minimum healing weeks after a prerequisite before this procedure can run. */
  minWeeksAfterPrereq?: number;
}

export interface PlannedProcedure {
  id: string;
  catalogCode: string;
  toothNumber?: number;
  material?: string;
  notes?: string;
  /** Override the catalog price for this specific instance. */
  priceOverride?: number;
}

export interface PlanPhase {
  id: string;
  name: string;
  ordering: number;
  earliestStartOffsetWeeks: number;
  procedures: PlannedProcedure[];
}

export interface TreatmentPlan {
  id: string;
  version: number;
  patientId: string;
  patientName: string;
  status: PlanStatus;
  phases: PlanPhase[];
  diagnosisTags: string[];                // ['caries', 'recession', …]
  selectedTeeth: number[];                // FDI from diagnose step
  insurance: { provider?: string; planId?: string };
  createdAt: string;
  presentedAt?: string;
  acceptedAt?: string;
  declinedAt?: string;
  patientSignatureDataUrl?: string;
  generatedJobIds: string[];
  activity: ActivityEvent[];
}

// ─── Analytics (Feature 3) ───────────────────────────────────────────────────

export interface DateRange {
  startISO: string;
  endISO: string;
}

export interface AnalyticsFiltersState {
  range: DateRange;
  practitionerId: string | 'all';
  labId: string | 'all';
}

export interface KpiValue {
  label: string;
  value: number;
  /** Pre-formatted display string, e.g. "$48,200" or "94%". */
  display: string;
  /** Period-over-period delta as a fraction (0.12 = +12%). Sign matters. */
  delta?: number;
  /** Optional sparkline data — an array of numbers. */
  spark?: number[];
}

export interface BreakdownSlice {
  label: string;
  value: number;
  /** Optional css color or token string for the slice. */
  color?: string;
}

export interface TimeSeriesPoint {
  /** Bucket label, e.g. 'W1', '03/30', 'Mar'. */
  label: string;
  value: number;
  /** Optional ISO date for tooltips / drill-down. */
  iso?: string;
}
