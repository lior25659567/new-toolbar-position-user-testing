// Settings hub — state, types, reducer, and mock data all in one file.
// Keeps every sub-flow on a single dispatchable surface so audit-log
// entries can be appended uniformly.

// ─── Types ───────────────────────────────────────────────────────────────────

export type Role = 'owner' | 'admin' | 'clinician' | 'staff' | 'lab-liaison';

export interface Member {
  id: string;
  name: string;
  email: string;
  monogram: string;
  role: Role;
  status: 'active' | 'invited' | 'suspended';
  joinedAt?: string;          // ISO
  lastActiveAt?: string;      // ISO
  invitedAt?: string;         // ISO; for invited only
}

export type PlanId = 'starter' | 'pro' | 'enterprise';

export interface PlanTier {
  id: PlanId;
  name: string;
  monthlyUSD: number;
  /** Limits expose how usage meters get calculated. -1 = unlimited. */
  limits: { cases: number; storageGb: number; seats: number; integrations: number };
  /** Bullet-point feature list for the comparison table. */
  features: string[];
  /** When set, surfaces a "Most popular" badge. */
  highlighted?: boolean;
}

export interface UsageSnapshot {
  casesThisMonth: number;
  storageGbUsed: number;
  seatsUsed: number;
  integrationsActive: number;
}

export interface Invoice {
  id: string;
  number: string;             // 'INV-2026-04'
  date: string;               // ISO
  amountUSD: number;
  status: 'paid' | 'open' | 'void' | 'failed';
  pdfUrl?: string;            // mocked
}

export interface PaymentMethod {
  brand: 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
  last4: string;
  expMonth: number;
  expYear: number;
}

export type IntegrationCategory =
  | 'imaging' | 'payer' | 'pms' | 'scanner' | 'lab' | 'comms' | 'analytics';

export interface IntegrationCatalogEntry {
  id: string;
  name: string;
  vendor: string;
  category: IntegrationCategory;
  description: string;
  monogram: string;
  /** Mock icon background — uses ADS tag tints. */
  tone: 'blue' | 'green' | 'purple' | 'orange' | 'magenta';
  /** When true, billed separately on top of plan. */
  paid?: boolean;
  /** Setup steps shown on the connect modal. */
  setupSteps: string[];
}

export interface ConnectedIntegration {
  id: string;                 // matches IntegrationCatalogEntry.id
  connectedAt: string;        // ISO
  connectedByName: string;
  scopes: string[];
}

export type NotificationChannel = 'email' | 'sms' | 'push';
export type NotificationEvent =
  | 'case-status-change'
  | 'message-received'
  | 'plan-presented'
  | 'plan-accepted'
  | 'invoice-paid'
  | 'invoice-failed'
  | 'sla-risk'
  | 'team-invite-accepted';

/** Per-event boolean grid for each channel. */
export type NotificationPrefs = Record<NotificationEvent, Record<NotificationChannel, boolean>>;

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;             // visible 8 chars; full secret only shown at create
  createdAt: string;          // ISO
  createdByName: string;
  lastUsedAt?: string;        // ISO
  scopes: string[];
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: NotificationEvent[];
  secret: string;             // signing secret
  active: boolean;
  createdAt: string;          // ISO
  lastDelivery?: { status: 'ok' | 'failed'; timestamp: string };
}

export interface AuditLogEntry {
  id: string;
  actorName: string;
  actorRole: Role;
  action: string;             // human-readable verb phrase
  target?: string;
  timestamp: string;          // ISO
}

export interface BrandingState {
  primaryColorHex: string;
  logoDataUrl?: string;
  customDomain?: string;
}

export type SectionId =
  | 'general' | 'team' | 'plan' | 'integrations' | 'notifications'
  | 'api' | 'audit' | 'branding' | 'danger';

// ─── Top-level state ─────────────────────────────────────────────────────────

export interface SettingsState {
  section: SectionId;
  general: {
    workspaceName: string;
    address: string;
    timezone: string;
    workingHoursStart: string; // 'HH:MM'
    workingHoursEnd: string;
  };
  team: {
    members: Member[];
    inviteOpen: boolean;
    pendingDeleteId: string | null;
  };
  plan: {
    currentPlan: PlanId;
    paymentMethod: PaymentMethod | null;
    invoices: Invoice[];
    usage: UsageSnapshot;
    compareOpen: boolean;
    targetPlan: PlanId | null;     // when changing plan, holds target during confirm
  };
  integrations: {
    catalog: IntegrationCatalogEntry[];
    connected: ConnectedIntegration[];
    activeIntegrationId: string | null; // currently in detail modal
    activeMode: 'detail' | 'connect' | null;
  };
  notifications: {
    prefs: NotificationPrefs;
    digestFrequency: 'off' | 'daily' | 'weekly';
  };
  api: {
    keys: ApiKey[];
    webhooks: WebhookEndpoint[];
    /** Holds the just-created API key full secret for one-time reveal. */
    revealedKeyId: string | null;
    revealedSecret: string | null;
    createKeyOpen: boolean;
    createWebhookOpen: boolean;
  };
  audit: {
    entries: AuditLogEntry[];
    filterActor: 'all' | string;
    filterAction: 'all' | 'team' | 'plan' | 'integration' | 'api' | 'general';
  };
  branding: BrandingState;
}

// ─── Plan tiers ──────────────────────────────────────────────────────────────

export const PLAN_TIERS: PlanTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyUSD: 99,
    limits: { cases: 50, storageGb: 5, seats: 3, integrations: 2 },
    features: [
      'Up to 50 cases / month',
      '3 team seats',
      '5 GB media storage',
      '2 integrations',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyUSD: 399,
    limits: { cases: 200, storageGb: 25, seats: 12, integrations: 8 },
    features: [
      'Up to 200 cases / month',
      '12 team seats',
      '25 GB media storage',
      '8 integrations',
      'Priority support',
      'Audit log + API keys',
      'Custom branding',
    ],
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyUSD: 999,
    limits: { cases: -1, storageGb: 250, seats: -1, integrations: -1 },
    features: [
      'Unlimited cases',
      'Unlimited seats',
      '250 GB media storage',
      'Unlimited integrations',
      'Dedicated CSM',
      'SSO / SAML',
      'BAA + custom DPA',
      '99.9% uptime SLA',
    ],
  },
];

// ─── Mock data ───────────────────────────────────────────────────────────────

const SEED_MEMBERS: Member[] = [
  { id: 'm-1', name: 'Dr. Alex Watanabe',  email: 'alex.w@dscore.demo',     monogram: 'AW', role: 'owner',       status: 'active',   joinedAt: '2024-09-12T10:00:00Z', lastActiveAt: '2026-04-29T18:14:00Z' },
  { id: 'm-2', name: 'Dr. Maria Petrov',   email: 'maria.p@dscore.demo',    monogram: 'MP', role: 'admin',       status: 'active',   joinedAt: '2024-10-04T10:00:00Z', lastActiveAt: '2026-04-29T15:30:00Z' },
  { id: 'm-3', name: 'Dr. Julia Kim',      email: 'julia.k@dscore.demo',    monogram: 'JK', role: 'clinician',   status: 'active',   joinedAt: '2025-01-21T10:00:00Z', lastActiveAt: '2026-04-29T11:02:00Z' },
  { id: 'm-4', name: 'Dr. Ravi Subramani', email: 'ravi.s@dscore.demo',     monogram: 'RS', role: 'clinician',   status: 'active',   joinedAt: '2025-03-18T10:00:00Z', lastActiveAt: '2026-04-28T17:45:00Z' },
  { id: 'm-5', name: 'Sara Singh',         email: 'sara.s@dscore.demo',     monogram: 'SS', role: 'staff',       status: 'active',   joinedAt: '2025-06-30T10:00:00Z', lastActiveAt: '2026-04-29T19:00:00Z' },
  { id: 'm-6', name: 'Marcus Lee',         email: 'marcus.l@acmelab.demo',  monogram: 'ML', role: 'lab-liaison', status: 'active',   joinedAt: '2025-08-08T10:00:00Z', lastActiveAt: '2026-04-25T09:18:00Z' },
  { id: 'm-7', name: 'Tomás Rivera',       email: 'tomas@dscore.demo',      monogram: 'TR', role: 'staff',       status: 'invited',  invitedAt: '2026-04-26T14:30:00Z' },
  { id: 'm-8', name: 'Olivia Chen',        email: 'olivia@dscore.demo',     monogram: 'OC', role: 'clinician',   status: 'invited',  invitedAt: '2026-04-28T08:55:00Z' },
];

const SEED_INVOICES: Invoice[] = [
  { id: 'in-1', number: 'INV-2026-04', date: '2026-04-12T00:00:00Z', amountUSD: 399, status: 'paid' },
  { id: 'in-2', number: 'INV-2026-03', date: '2026-03-12T00:00:00Z', amountUSD: 399, status: 'paid' },
  { id: 'in-3', number: 'INV-2026-02', date: '2026-02-12T00:00:00Z', amountUSD: 399, status: 'paid' },
  { id: 'in-4', number: 'INV-2026-01', date: '2026-01-12T00:00:00Z', amountUSD: 399, status: 'paid' },
  { id: 'in-5', number: 'INV-2025-12', date: '2025-12-12T00:00:00Z', amountUSD: 399, status: 'paid' },
  { id: 'in-6', number: 'INV-2025-11', date: '2025-11-12T00:00:00Z', amountUSD: 399, status: 'failed' },
];

const INTEGRATION_CATALOG: IntegrationCatalogEntry[] = [
  { id: 'stripe',    name: 'Stripe',        vendor: 'Stripe Inc.',          category: 'payer',     monogram: 'St', tone: 'purple', description: 'Charge patients, manage subscriptions, accept ACH and cards.', paid: false, setupSteps: ['Authorize Stripe account', 'Choose your account', 'Map your tax codes', 'Enable webhooks'] },
  { id: 'delta',     name: 'Delta Dental',  vendor: 'Delta Dental',          category: 'payer',     monogram: 'DD', tone: 'blue',   description: 'Verify coverage, submit pre-auths, and post claims directly.', paid: true,  setupSteps: ['Confirm provider TIN', 'Sign EDI BAA', 'Test eligibility lookup'] },
  { id: 'dolphin',   name: 'Dolphin Imaging', vendor: 'Dolphin',             category: 'imaging',   monogram: 'Do', tone: 'blue',   description: 'Two-way sync with Dolphin Imaging Plus for X-rays and CBCT.', paid: false, setupSteps: ['Install Dolphin connector', 'Pair workstation', 'Map patient IDs'] },
  { id: 'opendental',name: 'Open Dental',   vendor: 'Open Dental Software',  category: 'pms',       monogram: 'OD', tone: 'green',  description: 'Bidirectional sync of patients, schedules, and ledger.', paid: false, setupSteps: ['Install bridge service', 'Authenticate Open Dental', 'Map locations'] },
  { id: 'itero',     name: 'iTero',         vendor: 'Align Technology',      category: 'scanner',   monogram: 'iT', tone: 'orange', description: 'Pull intraoral scans into Files automatically.', paid: false, setupSteps: ['Sign in to MyiTero', 'Authorize DS Core', 'Pick scanner'] },
  { id: 'zerio',     name: 'Zerio Lab Bridge', vendor: 'Zerio Inc.',         category: 'lab',       monogram: 'Zr', tone: 'magenta', description: 'Push lab orders to compatible labs in one click.', paid: true, setupSteps: ['Provide lab account', 'Pick default lab', 'Set rush rules'] },
  { id: 'sms-gw',    name: 'SMS Gateway',   vendor: 'Twilio',                category: 'comms',     monogram: 'Tw', tone: 'orange', description: 'Send SMS reminders, recall, and balance notices.', paid: true, setupSteps: ['Connect Twilio account', 'Verify sender number', 'Pick reply behavior'] },
  { id: 'segment',   name: 'Segment',       vendor: 'Twilio',                category: 'analytics', monogram: 'Sg', tone: 'green',  description: 'Stream events to your analytics warehouse.', paid: false, setupSteps: ['Paste write key', 'Pick events to forward'] },
];

const SEED_CONNECTED: ConnectedIntegration[] = [
  { id: 'stripe',  connectedAt: '2025-09-08T10:00:00Z', connectedByName: 'Dr. Alex Watanabe', scopes: ['payments:write', 'customers:write'] },
  { id: 'opendental', connectedAt: '2025-11-01T10:00:00Z', connectedByName: 'Sara Singh', scopes: ['patients:read', 'schedule:read'] },
  { id: 'itero',  connectedAt: '2026-01-14T10:00:00Z', connectedByName: 'Dr. Maria Petrov', scopes: ['scans:read'] },
];

function defaultPrefs(): NotificationPrefs {
  return {
    'case-status-change':     { email: true,  sms: false, push: true  },
    'message-received':       { email: true,  sms: true,  push: true  },
    'plan-presented':         { email: true,  sms: false, push: false },
    'plan-accepted':          { email: true,  sms: false, push: true  },
    'invoice-paid':           { email: true,  sms: false, push: false },
    'invoice-failed':         { email: true,  sms: true,  push: true  },
    'sla-risk':               { email: true,  sms: false, push: true  },
    'team-invite-accepted':   { email: true,  sms: false, push: false },
  };
}

const SEED_API_KEYS: ApiKey[] = [
  { id: 'k-1', name: 'Production server',    prefix: 'sk_live_8a93c2', createdAt: '2025-08-12T10:00:00Z', createdByName: 'Dr. Alex Watanabe', lastUsedAt: '2026-04-29T17:42:00Z', scopes: ['cases:read', 'cases:write', 'patients:read'] },
  { id: 'k-2', name: 'Reporting cron',       prefix: 'sk_live_4f1b9d', createdAt: '2025-12-04T10:00:00Z', createdByName: 'Dr. Maria Petrov', lastUsedAt: '2026-04-29T03:00:00Z', scopes: ['cases:read'] },
  { id: 'k-3', name: 'Lab integration test', prefix: 'sk_test_aa2110', createdAt: '2026-03-30T10:00:00Z', createdByName: 'Sara Singh',         scopes: ['jobs:read', 'jobs:write'] },
];

const SEED_WEBHOOKS: WebhookEndpoint[] = [
  { id: 'w-1', url: 'https://hooks.dscore.demo/case-events',   events: ['case-status-change', 'sla-risk'],   secret: 'whsec_xxx', active: true,  createdAt: '2025-10-01T10:00:00Z', lastDelivery: { status: 'ok',     timestamp: '2026-04-29T18:00:00Z' } },
  { id: 'w-2', url: 'https://hooks.dscore.demo/billing',       events: ['invoice-paid', 'invoice-failed'],    secret: 'whsec_yyy', active: true,  createdAt: '2026-01-22T10:00:00Z', lastDelivery: { status: 'failed', timestamp: '2026-04-25T09:14:00Z' } },
  { id: 'w-3', url: 'https://hooks.legacy.example/messages',  events: ['message-received'],                 secret: 'whsec_zzz', active: false, createdAt: '2025-05-09T10:00:00Z' },
];

const SEED_AUDIT: AuditLogEntry[] = [
  { id: 'a-1',  actorName: 'Dr. Alex Watanabe', actorRole: 'owner',      action: 'invited',     target: 'olivia@dscore.demo (clinician)', timestamp: '2026-04-28T08:55:00Z' },
  { id: 'a-2',  actorName: 'Dr. Alex Watanabe', actorRole: 'owner',      action: 'connected',   target: 'iTero (Align Technology)',       timestamp: '2026-01-14T10:00:00Z' },
  { id: 'a-3',  actorName: 'Dr. Maria Petrov',  actorRole: 'admin',      action: 'rotated',     target: 'API key "Reporting cron"',       timestamp: '2025-12-04T10:00:00Z' },
  { id: 'a-4',  actorName: 'Sara Singh',         actorRole: 'staff',      action: 'created',     target: 'webhook https://hooks.dscore.demo/billing', timestamp: '2026-01-22T10:00:00Z' },
  { id: 'a-5',  actorName: 'Dr. Alex Watanabe', actorRole: 'owner',      action: 'changed plan', target: 'Starter → Pro',                  timestamp: '2025-09-08T10:00:00Z' },
  { id: 'a-6',  actorName: 'Dr. Maria Petrov',  actorRole: 'admin',      action: 'role changed', target: 'Sara Singh: clinician → staff',  timestamp: '2025-11-12T10:00:00Z' },
  { id: 'a-7',  actorName: 'Dr. Alex Watanabe', actorRole: 'owner',      action: 'updated',     target: 'workspace name',                 timestamp: '2025-04-04T10:00:00Z' },
  { id: 'a-8',  actorName: 'System',            actorRole: 'owner',      action: 'failed delivery', target: 'webhook /billing',           timestamp: '2026-04-25T09:14:00Z' },
];

// ─── Initial state ───────────────────────────────────────────────────────────

export function initSettingsState(): SettingsState {
  return {
    section: 'general',
    general: {
      workspaceName: 'DS Core, Demo',
      address: '120 Mission St, Suite 400, San Francisco, CA 94105',
      timezone: 'America/Los_Angeles',
      workingHoursStart: '08:00',
      workingHoursEnd: '18:00',
    },
    team: {
      members: SEED_MEMBERS,
      inviteOpen: false,
      pendingDeleteId: null,
    },
    plan: {
      currentPlan: 'pro',
      paymentMethod: { brand: 'Visa', last4: '4242', expMonth: 7, expYear: 2028 },
      invoices: SEED_INVOICES,
      usage: { casesThisMonth: 142, storageGbUsed: 8.3, seatsUsed: 6, integrationsActive: 3 },
      compareOpen: false,
      targetPlan: null,
    },
    integrations: {
      catalog: INTEGRATION_CATALOG,
      connected: SEED_CONNECTED,
      activeIntegrationId: null,
      activeMode: null,
    },
    notifications: {
      prefs: defaultPrefs(),
      digestFrequency: 'weekly',
    },
    api: {
      keys: SEED_API_KEYS,
      webhooks: SEED_WEBHOOKS,
      revealedKeyId: null,
      revealedSecret: null,
      createKeyOpen: false,
      createWebhookOpen: false,
    },
    audit: {
      entries: SEED_AUDIT,
      filterActor: 'all',
      filterAction: 'all',
    },
    branding: {
      primaryColorHex: 'var(--ads-background-interactive)',
      logoDataUrl: undefined,
      customDomain: undefined,
    },
  };
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

export type SettingsAction =
  // navigation
  | { type: 'SET_SECTION'; section: SectionId }
  // general
  | { type: 'UPDATE_GENERAL'; patch: Partial<SettingsState['general']> }
  // team
  | { type: 'OPEN_INVITE' }
  | { type: 'CLOSE_INVITE' }
  | { type: 'INVITE_MEMBER'; email: string; role: Role }
  | { type: 'CHANGE_ROLE'; memberId: string; role: Role }
  | { type: 'REMOVE_MEMBER'; memberId: string }
  | { type: 'RESEND_INVITE'; memberId: string }
  | { type: 'SUSPEND_MEMBER'; memberId: string }
  | { type: 'REACTIVATE_MEMBER'; memberId: string }
  | { type: 'SET_PENDING_DELETE'; memberId: string | null }
  // plan
  | { type: 'OPEN_COMPARE' }
  | { type: 'CLOSE_COMPARE' }
  | { type: 'PICK_TARGET_PLAN'; plan: PlanId | null }
  | { type: 'CHANGE_PLAN'; plan: PlanId }
  | { type: 'UPDATE_PAYMENT_METHOD'; pm: PaymentMethod }
  // integrations
  | { type: 'OPEN_INTEGRATION'; id: string; mode: 'detail' | 'connect' }
  | { type: 'CLOSE_INTEGRATION' }
  | { type: 'CONNECT_INTEGRATION'; id: string; scopes: string[] }
  | { type: 'DISCONNECT_INTEGRATION'; id: string }
  // notifications
  | { type: 'TOGGLE_PREF'; event: NotificationEvent; channel: NotificationChannel }
  | { type: 'SET_DIGEST'; frequency: 'off' | 'daily' | 'weekly' }
  // api / webhooks
  | { type: 'OPEN_CREATE_KEY' }
  | { type: 'CLOSE_CREATE_KEY' }
  | { type: 'CREATE_KEY'; name: string; scopes: string[] }
  | { type: 'DISMISS_REVEAL' }
  | { type: 'REVOKE_KEY'; keyId: string }
  | { type: 'OPEN_CREATE_WEBHOOK' }
  | { type: 'CLOSE_CREATE_WEBHOOK' }
  | { type: 'CREATE_WEBHOOK'; url: string; events: NotificationEvent[] }
  | { type: 'TOGGLE_WEBHOOK'; id: string }
  | { type: 'DELETE_WEBHOOK'; id: string }
  // audit
  | { type: 'SET_AUDIT_FILTER'; filterActor?: 'all' | string; filterAction?: 'all' | 'team' | 'plan' | 'integration' | 'api' | 'general' }
  // branding
  | { type: 'UPDATE_BRANDING'; patch: Partial<BrandingState> };

const ACTOR = { name: 'Dr. Alex Watanabe', role: 'owner' as Role };

function logAudit(state: SettingsState, action: string, target?: string): SettingsState {
  const entry: AuditLogEntry = {
    id: `a-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    actorName: ACTOR.name,
    actorRole: ACTOR.role,
    action,
    target,
    timestamp: new Date().toISOString(),
  };
  return { ...state, audit: { ...state.audit, entries: [entry, ...state.audit.entries] } };
}

export function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'SET_SECTION':
      return { ...state, section: action.section };

    case 'UPDATE_GENERAL':
      return logAudit({ ...state, general: { ...state.general, ...action.patch } }, 'updated', 'workspace settings');

    case 'OPEN_INVITE':  return { ...state, team: { ...state.team, inviteOpen: true } };
    case 'CLOSE_INVITE': return { ...state, team: { ...state.team, inviteOpen: false } };
    case 'INVITE_MEMBER': {
      const monogram = action.email.slice(0, 2).toUpperCase();
      const m: Member = {
        id: `m-${Date.now()}`,
        name: action.email.split('@')[0],
        email: action.email,
        monogram,
        role: action.role,
        status: 'invited',
        invitedAt: new Date().toISOString(),
      };
      return logAudit(
        { ...state, team: { ...state.team, members: [...state.team.members, m], inviteOpen: false } },
        'invited',
        `${action.email} (${action.role})`,
      );
    }
    case 'CHANGE_ROLE': {
      const member = state.team.members.find((m) => m.id === action.memberId);
      if (!member) return state;
      return logAudit(
        { ...state, team: { ...state.team, members: state.team.members.map((m) => m.id === action.memberId ? { ...m, role: action.role } : m) } },
        'role changed',
        `${member.name}: ${member.role} → ${action.role}`,
      );
    }
    case 'REMOVE_MEMBER': {
      const member = state.team.members.find((m) => m.id === action.memberId);
      if (!member) return state;
      return logAudit(
        { ...state, team: { ...state.team, members: state.team.members.filter((m) => m.id !== action.memberId), pendingDeleteId: null } },
        'removed',
        `${member.name}`,
      );
    }
    case 'RESEND_INVITE':
      return logAudit(state, 'resent invite', state.team.members.find((m) => m.id === action.memberId)?.email);
    case 'SUSPEND_MEMBER':
      return logAudit(
        { ...state, team: { ...state.team, members: state.team.members.map((m) => m.id === action.memberId ? { ...m, status: 'suspended' as const } : m) } },
        'suspended',
        state.team.members.find((m) => m.id === action.memberId)?.name,
      );
    case 'REACTIVATE_MEMBER':
      return {
        ...state,
        team: {
          ...state.team,
          members: state.team.members.map((m) => m.id === action.memberId ? { ...m, status: 'active' as const } : m),
        },
      };
    case 'SET_PENDING_DELETE':
      return { ...state, team: { ...state.team, pendingDeleteId: action.memberId } };

    case 'OPEN_COMPARE':  return { ...state, plan: { ...state.plan, compareOpen: true } };
    case 'CLOSE_COMPARE': return { ...state, plan: { ...state.plan, compareOpen: false, targetPlan: null } };
    case 'PICK_TARGET_PLAN': return { ...state, plan: { ...state.plan, targetPlan: action.plan } };
    case 'CHANGE_PLAN': {
      const from = state.plan.currentPlan;
      return logAudit(
        { ...state, plan: { ...state.plan, currentPlan: action.plan, compareOpen: false, targetPlan: null } },
        'changed plan',
        `${from} → ${action.plan}`,
      );
    }
    case 'UPDATE_PAYMENT_METHOD':
      return logAudit({ ...state, plan: { ...state.plan, paymentMethod: action.pm } }, 'updated', 'payment method');

    case 'OPEN_INTEGRATION':
      return { ...state, integrations: { ...state.integrations, activeIntegrationId: action.id, activeMode: action.mode } };
    case 'CLOSE_INTEGRATION':
      return { ...state, integrations: { ...state.integrations, activeIntegrationId: null, activeMode: null } };
    case 'CONNECT_INTEGRATION': {
      const cat = state.integrations.catalog.find((c) => c.id === action.id);
      if (!cat) return state;
      return logAudit(
        {
          ...state,
          integrations: {
            ...state.integrations,
            connected: [{ id: action.id, connectedAt: new Date().toISOString(), connectedByName: ACTOR.name, scopes: action.scopes }, ...state.integrations.connected.filter((c) => c.id !== action.id)],
            activeIntegrationId: null,
            activeMode: null,
          },
          plan: { ...state.plan, usage: { ...state.plan.usage, integrationsActive: state.plan.usage.integrationsActive + 1 } },
        },
        'connected',
        `${cat.name} (${cat.vendor})`,
      );
    }
    case 'DISCONNECT_INTEGRATION': {
      const cat = state.integrations.catalog.find((c) => c.id === action.id);
      if (!cat) return state;
      return logAudit(
        {
          ...state,
          integrations: {
            ...state.integrations,
            connected: state.integrations.connected.filter((c) => c.id !== action.id),
          },
          plan: { ...state.plan, usage: { ...state.plan.usage, integrationsActive: Math.max(0, state.plan.usage.integrationsActive - 1) } },
        },
        'disconnected',
        cat.name,
      );
    }

    case 'TOGGLE_PREF': {
      const cur = state.notifications.prefs[action.event][action.channel];
      return {
        ...state,
        notifications: {
          ...state.notifications,
          prefs: {
            ...state.notifications.prefs,
            [action.event]: { ...state.notifications.prefs[action.event], [action.channel]: !cur },
          },
        },
      };
    }
    case 'SET_DIGEST':
      return { ...state, notifications: { ...state.notifications, digestFrequency: action.frequency } };

    case 'OPEN_CREATE_KEY':  return { ...state, api: { ...state.api, createKeyOpen: true } };
    case 'CLOSE_CREATE_KEY': return { ...state, api: { ...state.api, createKeyOpen: false } };
    case 'CREATE_KEY': {
      const fullSecret = `sk_live_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`;
      const newKey: ApiKey = {
        id: `k-${Date.now()}`,
        name: action.name,
        prefix: fullSecret.slice(0, 14),
        createdAt: new Date().toISOString(),
        createdByName: ACTOR.name,
        scopes: action.scopes,
      };
      return logAudit(
        {
          ...state,
          api: {
            ...state.api,
            keys: [newKey, ...state.api.keys],
            createKeyOpen: false,
            revealedKeyId: newKey.id,
            revealedSecret: fullSecret,
          },
        },
        'created',
        `API key "${action.name}"`,
      );
    }
    case 'DISMISS_REVEAL':
      return { ...state, api: { ...state.api, revealedKeyId: null, revealedSecret: null } };
    case 'REVOKE_KEY': {
      const k = state.api.keys.find((x) => x.id === action.keyId);
      if (!k) return state;
      return logAudit(
        { ...state, api: { ...state.api, keys: state.api.keys.filter((x) => x.id !== action.keyId) } },
        'revoked',
        `API key "${k.name}"`,
      );
    }

    case 'OPEN_CREATE_WEBHOOK':  return { ...state, api: { ...state.api, createWebhookOpen: true } };
    case 'CLOSE_CREATE_WEBHOOK': return { ...state, api: { ...state.api, createWebhookOpen: false } };
    case 'CREATE_WEBHOOK': {
      const newWebhook: WebhookEndpoint = {
        id: `w-${Date.now()}`,
        url: action.url,
        events: action.events,
        secret: `whsec_${Math.random().toString(36).slice(2, 14)}`,
        active: true,
        createdAt: new Date().toISOString(),
      };
      return logAudit(
        { ...state, api: { ...state.api, webhooks: [newWebhook, ...state.api.webhooks], createWebhookOpen: false } },
        'created',
        `webhook ${action.url}`,
      );
    }
    case 'TOGGLE_WEBHOOK':
      return {
        ...state,
        api: {
          ...state.api,
          webhooks: state.api.webhooks.map((w) => w.id === action.id ? { ...w, active: !w.active } : w),
        },
      };
    case 'DELETE_WEBHOOK': {
      const w = state.api.webhooks.find((x) => x.id === action.id);
      if (!w) return state;
      return logAudit(
        { ...state, api: { ...state.api, webhooks: state.api.webhooks.filter((x) => x.id !== action.id) } },
        'deleted',
        `webhook ${w.url}`,
      );
    }

    case 'SET_AUDIT_FILTER':
      return {
        ...state,
        audit: {
          ...state.audit,
          filterActor: action.filterActor ?? state.audit.filterActor,
          filterAction: action.filterAction ?? state.audit.filterAction,
        },
      };

    case 'UPDATE_BRANDING':
      return logAudit({ ...state, branding: { ...state.branding, ...action.patch } }, 'updated', 'branding');

    default:
      return state;
  }
}

// ─── Helpers used by sections ────────────────────────────────────────────────

export const ROLE_LABEL: Record<Role, string> = {
  owner:        'Owner',
  admin:        'Admin',
  clinician:    'Clinician',
  staff:        'Staff',
  'lab-liaison':'Lab liaison',
};

export const NOTIFICATION_EVENT_LABEL: Record<NotificationEvent, string> = {
  'case-status-change':    'Case status change',
  'message-received':      'Message received',
  'plan-presented':        'Plan presented',
  'plan-accepted':         'Plan accepted',
  'invoice-paid':          'Invoice paid',
  'invoice-failed':        'Invoice failed',
  'sla-risk':              'SLA risk',
  'team-invite-accepted':  'Team invite accepted',
};

export const AVAILABLE_SCOPES = [
  'cases:read', 'cases:write',
  'jobs:read', 'jobs:write',
  'patients:read', 'patients:write',
  'plans:read', 'plans:write',
  'webhooks:write',
];

export function planById(id: PlanId): PlanTier {
  return PLAN_TIERS.find((p) => p.id === id) ?? PLAN_TIERS[0];
}

export function formatUSD(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
