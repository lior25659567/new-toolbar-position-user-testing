import React, { useEffect, useMemo, useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  IconButton,
  LinkButton,
  SearchInput,
  DropdownList,
  Tabs,
  Tag,
  Icon,
  Avatar,
  Checkbox,
  Toggle,
  Notification,
} from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import { PatientHeaderBar } from '../info/components/PatientSection/PatientHeaderBar';
import type { Patient } from '../info/types';
import { Modal } from '../design-system';
import { OrdersTab } from './patient/OrdersTab';
import { TreatmentsTab } from './patient/TreatmentsTab';
import { OrderDetailView } from './patient/OrderDetailView';
import {
  SEED_PATIENT_ORDERS,
  SEED_ORDER_TEMPLATES,
  type LabMessage,
  type OrderTemplate,
  type PatientOrder,
  type ProductionStage,
} from './patient/orderConstants';
import { SEED_PATIENT_TREATMENTS, type PatientTreatment } from './patient/treatmentConstants';
import {
  OPERATORIES,
  PROVIDERS,
  PROCEDURE_TEMPLATES,
  SEED_APPOINTMENTS,
  SPECIALTY_LABEL,
  WORK_HOURS,
  buildSlotISO,
  canBookAt,
  todayISO,
  fmtSlotTime,
  isSameLocalDate,
  appointmentEndISO,
  type Specialty,
} from './dscore/scheduling/scheduleState';

interface PatientPageProps {
  onBackToHome?: () => void;
  onNavigate?: (id: DSCoreNavId) => void;
}

type MediaKind = 'DI' | 'VIDEO' | 'IMAGE' | 'PHOTO';

interface MediaItem {
  id: string;
  kind: MediaKind;
  title: string;
  timestamp: string;
  /** When omitted, the card draws a tinted placeholder using `placeholderTone`. */
  thumbnail?: string;
  placeholderTone?: 'pink' | 'beige' | 'slate' | 'teal' | 'mint' | 'lavender';
}

const MEDIA: MediaItem[] = [
  { id: '1',  kind: 'DI',    title: 'lower-jaw.ply',                  timestamp: '30.03.2026 at 22:24:02', placeholderTone: 'pink'  },
  { id: '2',  kind: 'DI',    title: 'upper-jaw.ply',                  timestamp: '30.03.2026 at 22:23:35', placeholderTone: 'beige' },
  { id: '3',  kind: 'VIDEO', title: '02_Collaborate from anywhere',   timestamp: '30.03.2026 at 22:17:55', placeholderTone: 'slate' },
  { id: '4',  kind: 'VIDEO', title: '05_Flexibility and speed',       timestamp: '30.03.2026 at 22:17:54', placeholderTone: 'teal'  },
  { id: '5',  kind: 'VIDEO', title: '07_Simulate SureSmile',          timestamp: '30.03.2026 at 22:17:53', placeholderTone: 'mint'  },
  { id: '6',  kind: 'VIDEO', title: '09_Create & manage cases',       timestamp: '30.03.2026 at 22:17:52', placeholderTone: 'lavender' },
  { id: '7',  kind: 'VIDEO', title: '08_Flexible treatment plans',    timestamp: '30.03.2026 at 22:17:51', placeholderTone: 'pink'  },
  { id: '8',  kind: 'VIDEO', title: '06_Launch & monitor',            timestamp: '30.03.2026 at 22:17:51', placeholderTone: 'slate' },
  { id: '9',  kind: 'VIDEO', title: 'Service details overview',       timestamp: '29.03.2026 at 13:51:08', placeholderTone: 'beige' },
  { id: '10', kind: 'PHOTO', title: 'Periapical X-ray #36',           timestamp: '29.03.2026 at 11:02:14', placeholderTone: 'slate' },
  { id: '11', kind: 'VIDEO', title: 'Implant planning preview',       timestamp: '28.03.2026 at 14:18:55', placeholderTone: 'teal'  },
  { id: '12', kind: 'VIDEO', title: 'Treatment summary',              timestamp: '28.03.2026 at 09:14:30', placeholderTone: 'mint'  },
  { id: '13', kind: 'VIDEO', title: 'Crown design preview',           timestamp: '28.03.2026 at 09:18:42', placeholderTone: 'pink'  },
];

const MEDIA_TYPE_OPTIONS = [
  { value: 'all',   label: 'All media' },
  { value: 'di',    label: 'Digital impressions' },
  { value: 'video', label: 'Videos' },
  { value: 'photo', label: 'Photos' },
];

const SORT_OPTIONS = [
  { value: 'new',  label: 'New to old' },
  { value: 'old',  label: 'Old to new' },
  { value: 'name', label: 'Name (A–Z)' },
];

const PATIENT_DISPLAY_NAME = 'DS Core, Demo';

// Patient identity for the shared header bar (mirrors the previous title/meta).
const HEADER_PATIENT: Patient = {
  id: 'ds-core-demo',
  firstName: 'DS Core,',
  lastName: 'Demo',
  gender: 'male',
  dateOfBirth: '1985-09-01',
  chartNumber: 'DentsplySironaR2',
};

export default function PatientPage({ onBackToHome, onNavigate }: PatientPageProps) {
  const [search, setSearch] = useState('');
  const [mediaType, setMediaType] = useState('all');
  const [sort, setSort] = useState('new');
  const [activeTab, setActiveTab] = useState('media');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedUploads, setSelectedUploads] = useState<Set<string>>(new Set());
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<{ when: string; provider: string; procedure: string } | null>(null);

  const [orders, setOrders] = useState<PatientOrder[]>(SEED_PATIENT_ORDERS);
  const [orderTemplates, setOrderTemplates] = useState<OrderTemplate[]>(SEED_ORDER_TEMPLATES);
  const [treatments, setTreatments] = useState<PatientTreatment[]>(SEED_PATIENT_TREATMENTS);
  const [createdNotice, setCreatedNotice] = useState<{ kind: 'order' | 'treatment'; status: 'draft' | 'submitted'; label: string; orderId?: string } | null>(null);
  const [treatmentWizardOpen, setTreatmentWizardOpen] = useState(false);
  const [orderWizardOpen, setOrderWizardOpen] = useState(false);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [duplicateSource, setDuplicateSource] = useState<PatientOrder | null>(null);

  const handleOrderCreated = (o: PatientOrder) => {
    setOrders((prev) => [o, ...prev]);
    setCreatedNotice({ kind: 'order', status: o.status === 'draft' ? 'draft' : 'submitted', label: o.service, orderId: o.id });
    if (o.status === 'submitted') setOpenOrderId(o.id);
  };

  const handleSaveTemplate = (t: OrderTemplate) => {
    setOrderTemplates((prev) => [t, ...prev]);
  };

  const handleSendMessage = (orderId: string, msg: LabMessage) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, thread: [...(o.thread ?? []), msg] }
          : o,
      ),
    );
  };

  const handleAdvanceStage = (orderId: string, stage: ProductionStage) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const event = {
          id: `a-${Date.now().toString(36)}`,
          timestamp: new Date().toISOString(),
          actor: 'Lab',
          kind: 'stage' as const,
          stage,
          message: `Stage: ${stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' ')}.`,
        };
        return {
          ...o,
          productionStage: stage,
          activity: [...(o.activity ?? []), event],
        };
      }),
    );
  };

  const openOrder = orders.find((o) => o.id === openOrderId) ?? null;

  const handleTreatmentCreated = (t: PatientTreatment) => {
    setTreatments((prev) => [t, ...prev]);
    setCreatedNotice({ kind: 'treatment', status: t.status === 'draft' ? 'draft' : 'submitted', label: t.procedureLabel });
  };

  const tabs = [
    { id: 'media',         label: 'Media library' },
    { id: 'orders',        label: 'Orders' },
    { id: 'collaboration', label: 'Collaboration' },
    { id: 'treatments',    label: 'Treatments' },
  ];

  return (
    <DSCoreShell
      active="patients"
      unread={1}
      hideNav
      onNavigate={(id) => {
        if (id === 'home' && onBackToHome) onBackToHome();
        else onNavigate?.(id);
      }}
    >
      {/* Full-width white patient header (edge-to-edge, like the dedicated
          top page). */}
      <PageHeader
        onBackToHome={onBackToHome}
        onScheduleClick={() => setScheduleOpen(true)}
        onStartOrder={() => {
          setActiveTab('orders');
          setOrderWizardOpen(true);
        }}
        onCreateTreatment={() => {
          setActiveTab('treatments');
          setTreatmentWizardOpen(true);
        }}
      />

      <div
        style={{
          width: '100%',
          padding: '16px 32px 80px',
        }}
      >
        {bookingConfirmed && (
          <Notification
            type="success"
            title="Appointment booked"
            onDismiss={() => setBookingConfirmed(null)}
            style={{ marginTop: '16px' }}
          >
            {bookingConfirmed.procedure} with {bookingConfirmed.provider} · {bookingConfirmed.when}
          </Notification>
        )}

        {createdNotice && (
          <Notification
            type="success"
            title={
              createdNotice.kind === 'order'
                ? createdNotice.status === 'draft' ? 'Order saved as draft' : 'Order submitted'
                : createdNotice.status === 'draft' ? 'Treatment saved as draft' : 'Treatment submitted'
            }
            onDismiss={() => setCreatedNotice(null)}
            style={{ marginTop: '16px' }}
          >
            {createdNotice.label} · {PATIENT_DISPLAY_NAME}
          </Notification>
        )}

        <Tabs
          items={tabs}
          activeId={activeTab}
          onChange={setActiveTab}
          style={{ marginTop: '8px', marginBottom: '24px' }}
        />

        {activeTab === 'media' && (
          <>
            <FilterRow
              search={search}
              setSearch={setSearch}
              mediaType={mediaType}
              setMediaType={setMediaType}
              sort={sort}
              setSort={setSort}
              onUploadClick={() => setUploadOpen(true)}
            />
            <MediaSection title="Last 3 months" count={MEDIA.length} items={MEDIA} />
          </>
        )}

        {activeTab === 'orders' && (
          <OrdersTab
            orders={orders}
            patientName={PATIENT_DISPLAY_NAME}
            templates={orderTemplates}
            duplicateSource={duplicateSource}
            onDuplicateConsumed={() => setDuplicateSource(null)}
            onOrderCreated={handleOrderCreated}
            onSaveTemplate={handleSaveTemplate}
            onOpenOrder={(id) => setOpenOrderId(id)}
            externalOpen={orderWizardOpen}
            onExternalOpenChange={setOrderWizardOpen}
          />
        )}

        {activeTab === 'treatments' && (
          <TreatmentsTab
            treatments={treatments}
            patientName={PATIENT_DISPLAY_NAME}
            onTreatmentCreated={handleTreatmentCreated}
            externalOpen={treatmentWizardOpen}
            onExternalOpenChange={setTreatmentWizardOpen}
          />
        )}

        {activeTab === 'collaboration' && (
          <EmptyTabState label="Collaboration" />
        )}
      </div>

      <UploadMediaPanel
        open={uploadOpen}
        onClose={() => {
          setUploadOpen(false);
          setSelectedUploads(new Set());
        }}
        items={MEDIA}
        selected={selectedUploads}
        onToggle={(id) =>
          setSelectedUploads((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
          })
        }
        onConfirm={() => {
          setUploadOpen(false);
          setSelectedUploads(new Set());
        }}
      />

      <ScheduleAppointmentPanel
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onBooked={(summary) => {
          setScheduleOpen(false);
          setBookingConfirmed(summary);
        }}
      />

      <OrderDetailView
        open={!!openOrderId && !!openOrder}
        order={openOrder}
        patientName={PATIENT_DISPLAY_NAME}
        onClose={() => setOpenOrderId(null)}
        onSendMessage={handleSendMessage}
        onAdvanceStage={handleAdvanceStage}
        onDuplicate={(o) => {
          setOpenOrderId(null);
          setActiveTab('orders');
          setDuplicateSource(o);
        }}
      />
    </DSCoreShell>
  );
}

/* ============================================================================
   Page header — back link, title + meta, action buttons
   ============================================================================ */

function PageHeader({
  onBackToHome,
  onScheduleClick,
  onStartOrder,
  onCreateTreatment,
}: {
  onBackToHome?: () => void;
  onScheduleClick: () => void;
  onStartOrder: () => void;
  onCreateTreatment: () => void;
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        borderBottom: '1px solid var(--ads-border-subtle)',
        padding: '20px 32px',
      }}
    >
      <button
        type="button"
        onClick={onBackToHome}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: onBackToHome ? 'pointer' : 'default',
          padding: 0,
          marginBottom: '16px',
          color: 'var(--ads-text-primary)',
          fontFamily: 'var(--ads-font-sans)',
          fontSize: '14px',
          lineHeight: '20px',
        }}
      >
        <Icon name="chevron-left" size={20} color="var(--ads-text-primary)" />
        <span>Home</span>
      </button>

      {/* Same patient header used in the Info page (option 5). Right side:
          edit patient + the "Start new order" split menu (Treatment / Canvas). */}
      <PatientHeaderBar
        patient={HEADER_PATIENT}
        actions={
          <>
            <SecondaryButton
              size={44}
              aria-label="Edit patient info"
              title="Edit patient info"
              style={{ width: 44, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <EditPatientIcon />
            </SecondaryButton>
            <StartOrderMenu
              onStartOrder={onStartOrder}
              onCreateTreatment={onCreateTreatment}
              onCanvas={onScheduleClick}
            />
          </>
        }
      />
    </div>
  );
}

/* Split "Start new order" button: primary action + chevron that opens a menu
   of secondary options (Treatment, Canvas). */
function StartOrderMenu({
  onStartOrder,
  onCreateTreatment,
  onCanvas,
}: {
  onStartOrder: () => void;
  onCreateTreatment: () => void;
  onCanvas: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const select = (fn: () => void) => { setOpen(false); fn(); };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <div style={{ display: 'inline-flex', alignItems: 'stretch' }}>
        <PrimaryButton
          size={44}
          onClick={onStartOrder}
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        >
          <Icon name="plus" size={18} color="var(--ads-icon-on-color-primary)" />
          Start new order
        </PrimaryButton>
        <PrimaryButton
          size={44}
          aria-label="More order options"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            width: 40,
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            marginLeft: '1px',
          }}
        >
          <Icon name="chevron-down" size={18} color="var(--ads-icon-on-color-primary)" />
        </PrimaryButton>
      </div>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: 200,
            backgroundColor: 'var(--ads-bg-surface)',
            border: '1px solid var(--ads-border-subtle)',
            borderRadius: 'var(--ads-radius-md)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            padding: '6px',
            zIndex: 50,
          }}
        >
          <OrderMenuItem icon={<CreateTreatmentIcon />} label="Treatment" onClick={() => select(onCreateTreatment)} />
          <OrderMenuItem icon={<CanvasIcon />} label="Canvas" onClick={() => select(onCanvas)} />
        </div>
      )}
    </div>
  );
}

function OrderMenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        padding: '10px 12px',
        border: 'none',
        borderRadius: 'var(--ads-radius-sm)',
        background: hover ? 'var(--ads-background-subtle-hover)' : 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--ads-font-sans)',
        fontSize: '14px',
        lineHeight: '20px',
        color: 'var(--ads-text-primary)',
      }}
    >
      <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  );
}

function EditPatientIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.5 19.5H1.5V21H22.5V19.5Z" fill="currentColor" />
      <path d="M19.05 6.75C19.65 6.15 19.65 5.25 19.05 4.65L16.35 1.95C15.75 1.35 14.85 1.35 14.25 1.95L3 13.2V18H7.8L19.05 6.75ZM15.3 3L18 5.7L15.75 7.95L13.05 5.25L15.3 3ZM4.5 16.5V13.8L12 6.3L14.7 9L7.2 16.5H4.5Z" fill="currentColor" />
    </svg>
  );
}

/* ============================================================================
   Filter row
   ============================================================================ */

function FilterRow({
  search,
  setSearch,
  mediaType,
  setMediaType,
  sort,
  setSort,
  onUploadClick,
}: {
  search: string;
  setSearch: (v: string) => void;
  mediaType: string;
  setMediaType: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  onUploadClick: () => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(240px, 1fr) minmax(200px, 280px) minmax(200px, 240px) auto',
        gap: '12px',
        alignItems: 'end',
        marginBottom: '20px',
      }}
    >
      <SearchInput
        value={search}
        onSearch={setSearch}
        placeholder="Search"
        fullWidth
      />
      <DropdownList
        options={MEDIA_TYPE_OPTIONS}
        value={mediaType}
        onChange={setMediaType}
        placeholder="Select Media Type"
        fullWidth
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--ads-text-muted)',
            fontSize: '13px',
            whiteSpace: 'nowrap',
          }}
        >
          <Icon name="calendar" size={18} color="var(--ads-text-muted)" />
          By creation date
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <DropdownList
            options={SORT_OPTIONS}
            value={sort}
            onChange={setSort}
            placeholder="Sort"
            fullWidth
          />
        </div>
      </div>
      <PrimaryButton size={44} icon="plus" onClick={onUploadClick}>
        Upload media
      </PrimaryButton>
    </div>
  );
}

/* ============================================================================
   Media section + media card
   ============================================================================ */

const TONE_BG: Record<NonNullable<MediaItem['placeholderTone']>, string> = {
  pink:     'linear-gradient(135deg, var(--ads-background-highlight-red) 0%, #f5cfd0 100%)',
  beige:    'linear-gradient(135deg, var(--ads-background-highlight-orange) 0%, #e6d6bf 100%)',
  slate:    'linear-gradient(135deg, var(--ads-background-subtle-active) 0%, #ced8e2 100%)',
  teal:     'linear-gradient(135deg, var(--ads-background-highlight-blue) 0%, #c9e3e6 100%)',
  mint:     'linear-gradient(135deg, #e6f4ec 0%, #c9e6d4 100%)',
  lavender: 'linear-gradient(135deg, #ede9f4 0%, #d6cee6 100%)',
};

function MediaSection({ title, count, items }: { title: string; count: number; items: MediaItem[] }) {
  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        borderRadius: 'var(--ads-radius-sm)',
        border: '1px solid var(--ads-border-subtle)',
        padding: '24px',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--ads-font-sans)',
          fontWeight: 500,
          fontSize: '17px',
          lineHeight: '24px',
          color: 'var(--ads-text-primary)',
          margin: '0 0 16px',
        }}
      >
        {title} <span style={{ color: 'var(--ads-text-muted)', fontWeight: 400 }}>({count})</span>
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {items.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function MediaCard({
  item,
  compact = false,
  selected: selectedProp,
  onToggle,
}: {
  item: MediaItem;
  compact?: boolean;
  selected?: boolean;
  onToggle?: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [internalSelected, setInternalSelected] = useState(false);
  const tone = item.placeholderTone ?? 'slate';
  const isControlled = selectedProp !== undefined;
  const selected = isControlled ? !!selectedProp : internalSelected;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', flexDirection: 'column', gap: compact ? '6px' : '8px' }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '1 / 1',
          borderRadius: 'var(--ads-radius-sm)',
          overflow: 'hidden',
          background: TONE_BG[tone],
          border: `1px solid ${selected ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
          boxShadow: hovered ? 'var(--ads-shadow-sm)' : 'none',
          transition:
            'box-shadow var(--ads-duration-fast) var(--ads-ease-standard), border-color var(--ads-duration-fast) var(--ads-ease-standard)',
        }}
      >
        {item.thumbnail && (
          <img
            src={item.thumbnail}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
        <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
          <Tag color={tagColorFor(item.kind)} size="small">
            {item.kind}
          </Tag>
        </div>
        <button
          type="button"
          aria-label={selected ? 'Deselect' : 'Select'}
          aria-pressed={selected}
          onClick={() => (isControlled ? onToggle?.(item.id) : setInternalSelected((s) => !s))}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            border: `1.5px solid ${selected ? 'var(--ads-blue-500)' : 'var(--ads-border-strong)'}`,
            backgroundColor: selected ? 'var(--ads-blue-500)' : 'var(--ads-bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            transition:
              'background-color var(--ads-duration-fast) var(--ads-ease-standard), border-color var(--ads-duration-fast) var(--ads-ease-standard)',
          }}
        >
          {selected && (
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4,11 9,16 16,5" />
            </svg>
          )}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontFamily: 'var(--ads-font-sans)',
              fontWeight: 500,
              fontSize: compact ? '13px' : '14px',
              lineHeight: compact ? '18px' : '20px',
              color: 'var(--ads-text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={item.title}
          >
            {item.title}
          </div>
          <div
            style={{
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '12px',
              lineHeight: '16px',
              color: 'var(--ads-text-muted)',
            }}
          >
            {item.timestamp}
          </div>
        </div>
        {!compact && (
          <IconButton aria-label="More actions" size="sm">
            <Icon name="more" size={20} color="var(--ads-text-muted)" />
          </IconButton>
        )}
      </div>
    </div>
  );
}

function tagColorFor(kind: MediaKind): 'blue' | 'purple' | 'green' | 'orange' {
  switch (kind) {
    case 'DI':    return 'blue';
    case 'VIDEO': return 'purple';
    case 'PHOTO': return 'green';
    default:      return 'orange';
  }
}

/* ============================================================================
   Upload media slide-over panel
   ============================================================================ */

function UploadMediaPanel({
  open,
  onClose,
  items,
  selected,
  onToggle,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  items: MediaItem[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onConfirm: () => void;
}) {
  const [tab, setTab] = useState<'library' | 'upload'>('library');
  const [sort, setSort] = useState('new');

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--ads-scrim)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity var(--ads-duration-base) var(--ads-ease-standard)',
          zIndex: 1000,
        }}
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Files"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: '720px',
          maxWidth: '100vw',
          backgroundColor: 'var(--ads-bg-surface)',
          boxShadow: 'var(--ads-shadow-lg)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform var(--ads-duration-base) var(--ads-ease-standard)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--ads-border-subtle)',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--ads-font-sans)',
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '28px',
              color: 'var(--ads-text-primary)',
            }}
          >
            Files
          </h2>
          <IconButton aria-label="Close" size="md" onClick={onClose}>
            <Icon name="close" size={18} color="var(--ads-text-primary)" />
          </IconButton>
        </div>

        {/* Sub-toolbar: pill tabs + sort */}
        <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <SegmentedTabs
            tabs={[
              { id: 'library', label: 'Media library' },
              { id: 'upload',  label: 'Upload from computer' },
            ]}
            active={tab}
            onChange={(id) => setTab(id as 'library' | 'upload')}
          />
          <div style={{ width: '180px' }}>
            <DropdownList
              options={SORT_OPTIONS}
              value={sort}
              onChange={setSort}
              fullWidth
            />
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {tab === 'library' ? (
            <>
              <h3
                style={{
                  margin: '0 0 16px',
                  fontFamily: 'var(--ads-font-sans)',
                  fontWeight: 500,
                  fontSize: '17px',
                  lineHeight: '24px',
                  color: 'var(--ads-text-primary)',
                }}
              >
                Last 3 months <span style={{ color: 'var(--ads-text-muted)', fontWeight: 400 }}>({items.length})</span>
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                }}
              >
                {items.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    compact
                    selected={selected.has(item.id)}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </>
          ) : (
            <UploadDropzone />
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--ads-border-subtle)',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            backgroundColor: 'var(--ads-bg-surface)',
          }}
        >
          <SecondaryButton size={44} onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton size={44} disabled={selected.size === 0} onClick={onConfirm}>
            Add files ({selected.size})
          </PrimaryButton>
        </div>
      </aside>
    </>
  );
}

/* Segmented (pill) tab control used in the upload-media panel header. */
function SegmentedTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: '4px',
        backgroundColor: 'var(--ads-bg-muted)',
        borderRadius: '999px',
        gap: '4px',
      }}
    >
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(t.id)}
            style={{
              padding: '6px 16px',
              minHeight: '32px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: isActive ? 'var(--ads-bg-surface)' : 'transparent',
              color: isActive ? 'var(--ads-text-primary)' : 'var(--ads-text-muted)',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
              fontWeight: isActive ? 500 : 400,
              cursor: 'pointer',
              boxShadow: isActive ? 'var(--ads-shadow-sm)' : 'none',
              transition:
                'background-color var(--ads-duration-fast) var(--ads-ease-standard), color var(--ads-duration-fast) var(--ads-ease-standard), box-shadow var(--ads-duration-fast) var(--ads-ease-standard)',
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function UploadDropzone() {
  return (
    <div
      style={{
        height: '100%',
        minHeight: '320px',
        border: '2px dashed var(--ads-border-default)',
        borderRadius: 'var(--ads-radius-sm)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        color: 'var(--ads-text-muted)',
        backgroundColor: 'var(--ads-bg-muted)',
        padding: '40px 24px',
      }}
    >
      <Icon name="upload" size={32} color="var(--ads-text-muted)" />
      <div
        style={{
          fontFamily: 'var(--ads-font-sans)',
          fontSize: '15px',
          color: 'var(--ads-text-primary)',
        }}
      >
        Drag &amp; drop files here
      </div>
      <div style={{ fontSize: '13px' }}>or</div>
      <SecondaryButton size={36}>Browse files</SecondaryButton>
    </div>
  );
}

/* ============================================================================
   Empty tab placeholder
   ============================================================================ */

function EmptyTabState({ label }: { label: string }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        borderRadius: 'var(--ads-radius-sm)',
        border: '1px solid var(--ads-border-subtle)',
        padding: '64px 24px',
        textAlign: 'center',
        color: 'var(--ads-text-muted)',
        fontSize: '14px',
        lineHeight: '20px',
      }}
    >
      {label} tab — placeholder content.
    </div>
  );
}

/* ============================================================================
   Schedule appointment — interactive modal scheduler.
   ----------------------------------------------------------------------------
   Built around a real day-view time grid that visualizes the entire day,
   shows existing appointments as grey conflict blocks, and lets the doctor
   click any open area to drop a preview of the new appointment. The right
   pane is a live booking summary that updates as they click around — they
   can adjust resources, see conflicts in plain English, add notes, set
   confirmations, and book in one screen.
   ============================================================================ */

const PATIENT_CONTEXT = {
  name: 'DS Core, Demo',
  monogram: 'DC',
  lastVisitDate: '2026-04-29',
  lastVisitProcedure: 'Crown prep #14',
  recallStatus: 'Cleaning overdue by 12 days',
  recallTone: 'warning' as 'warning' | 'default',
  preferredProviderId: 'dr-aw',
  preferredHygienistId: 'hyg-ss',
  phone: '+1 (415) 555-0182',
  email: 'demo.patient@dscore.example',
};

const PX_PER_MIN = 0.85;                              // 51px / hour → ~510px tall grid
const SLOT_MIN = 15;                                  // 15-min snap on click
const TOTAL_MIN = (WORK_HOURS.endHour - WORK_HOURS.startHour) * 60;
const GRID_HEIGHT = TOTAL_MIN * PX_PER_MIN;
const TIME_COL_W = 56;

function ScheduleAppointmentPanel({
  open,
  onClose,
  onBooked,
}: {
  open: boolean;
  onClose: () => void;
  onBooked: (summary: { when: string; provider: string; procedure: string }) => void;
}) {
  const [procedureId, setProcedureId] = useState('cleaning');
  const proc = useMemo(() => PROCEDURE_TEMPLATES.find((p) => p.id === procedureId)!, [procedureId]);

  const [providerId, setProviderId] = useState(PATIENT_CONTEXT.preferredHygienistId);
  const [operatoryId, setOperatoryId] = useState('op-3');
  const [dateISO, setDateISO] = useState(todayISO());
  const [time, setTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [sendSMS, setSendSMS] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [recurring, setRecurring] = useState(false);
  const [recurrenceMonths, setRecurrenceMonths] = useState(6);

  // When the procedure changes, auto-pick eligible resources + reset time.
  useEffect(() => {
    const eligibleProvider = PROVIDERS.find((p) =>
      p.id === PATIENT_CONTEXT.preferredProviderId && p.specialties.includes(proc.specialty),
    ) ?? PROVIDERS.find((p) => p.specialties.includes(proc.specialty));
    if (eligibleProvider) setProviderId(eligibleProvider.id);
    const eligibleOp = OPERATORIES.find((o) => o.capabilities.includes(proc.specialty));
    if (eligibleOp) setOperatoryId(eligibleOp.id);
    setTime(null);
  }, [procedureId, proc.specialty]);

  // Reset selected time whenever the day or resources change.
  useEffect(() => { setTime(null); }, [dateISO, providerId, operatoryId]);

  // Existing appointments for the selected day that block our chosen resources.
  const dayConflicts = useMemo(() => {
    return SEED_APPOINTMENTS.filter((a) =>
      isSameLocalDate(a.startISO, dateISO)
      && a.status !== 'cancelled' && a.status !== 'no-show'
      && (a.providerId === providerId || a.operatoryId === operatoryId)
    );
  }, [dateISO, providerId, operatoryId]);

  const selectedConflict = useMemo(() => {
    if (!time) return { ok: true, reasons: [] as string[] };
    return canBookAt(
      { startISO: time, durationMin: proc.durationMin, operatoryId, providerId, specialty: proc.specialty as Specialty },
      SEED_APPOINTMENTS,
    );
  }, [time, providerId, operatoryId, proc.durationMin, proc.specialty]);

  // For the date strip: 14 days starting today.
  const dateChips = useMemo(() => {
    const out: { iso: string; label: string; sublabel: string; openCount: number }[] = [];
    for (let i = 0; i < 14; i += 1) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayConfs = SEED_APPOINTMENTS.filter((a) =>
        isSameLocalDate(a.startISO, iso) && (a.providerId === providerId || a.operatoryId === operatoryId) && a.status !== 'cancelled' && a.status !== 'no-show',
      );
      // Rough open-count: divide working minutes by procedure duration, minus busy minutes.
      const busyMin = dayConfs.reduce((s, a) => s + a.durationMin, 0);
      const openMin = TOTAL_MIN - busyMin;
      const openCount = Math.max(0, Math.floor(openMin / proc.durationMin));
      out.push({
        iso,
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString(undefined, { weekday: 'short' }),
        sublabel: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        openCount,
      });
    }
    return out;
  }, [providerId, operatoryId, proc.durationMin]);

  const eligibleProviders = PROVIDERS.filter((p) => p.specialties.includes(proc.specialty));
  const eligibleOperatories = OPERATORIES.filter((o) => o.capabilities.includes(proc.specialty));

  const onBook = () => {
    if (!time || !selectedConflict.ok) return;
    const provider = PROVIDERS.find((p) => p.id === providerId)!;
    const whenLabel = `${new Date(dateISO).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} at ${fmtSlotTime(time)}`;
    onBooked({ when: whenLabel, provider: provider.name, procedure: proc.label });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule appointment"
      width={1080}
      footer={
        <>
          <SecondaryButton size={36} onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton size={36} disabled={!time || !selectedConflict.ok} onClick={onBook}>
            {time ? `Book ${fmtSlotTime(time)}` : 'Pick a time on the grid'}
          </PrimaryButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Patient context strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            backgroundColor: 'var(--ads-bg-page)',
            border: '1px solid var(--ads-border-subtle)',
            borderRadius: 'var(--ads-radius-sm)',
          }}
        >
          <Avatar name={PATIENT_CONTEXT.monogram} size="md" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500 }}>
              {PATIENT_CONTEXT.name}
            </div>
            <div style={{ marginTop: '2px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
              Last visit {PATIENT_CONTEXT.lastVisitDate} · {PATIENT_CONTEXT.lastVisitProcedure}
            </div>
          </div>
          <Tag size="small" color={PATIENT_CONTEXT.recallTone === 'warning' ? 'orange' : 'green'}>
            {PATIENT_CONTEXT.recallStatus}
          </Tag>
        </div>

        {/* Resource selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '12px' }}>
          <DropdownList
            label="Procedure"
            options={PROCEDURE_TEMPLATES.map((p) => ({ value: p.id, label: `${p.label} · ${p.durationMin}min` }))}
            value={procedureId}
            onChange={setProcedureId}
            fullWidth
          />
          <DropdownList
            label="Provider"
            options={eligibleProviders.map((p) => ({ value: p.id, label: `${p.name} (${p.role === 'dentist' ? 'DDS' : 'RDH'})` }))}
            value={providerId}
            onChange={setProviderId}
            fullWidth
          />
          <DropdownList
            label="Operatory"
            options={eligibleOperatories.map((o) => ({ value: o.id, label: o.name }))}
            value={operatoryId}
            onChange={setOperatoryId}
            fullWidth
          />
        </div>

        {/* Date strip */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '4px 2px' }}>
          {dateChips.map((d) => {
            const isActive = dateISO === d.iso;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => setDateISO(d.iso)}
                style={{
                  flexShrink: 0,
                  width: 80,
                  padding: '8px 6px',
                  border: `1px solid ${isActive ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
                  backgroundColor: isActive ? 'color-mix(in srgb, var(--ads-blue-500) 8%, transparent)' : 'var(--ads-bg-surface)',
                  color: 'var(--ads-text-primary)',
                  borderRadius: 'var(--ads-radius-sm)',
                  fontFamily: 'var(--ads-font-sans)',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 500, color: isActive ? 'var(--ads-blue-550)' : 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {d.label}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>
                  {d.sublabel}
                </span>
                <span
                  style={{
                    marginTop: '2px',
                    fontSize: '10px',
                    color: d.openCount === 0 ? 'var(--ads-danger-500)' : d.openCount < 3 ? 'var(--ads-tag-orange-fg)' : 'var(--ads-success-600)',
                    fontWeight: 500,
                  }}
                >
                  {d.openCount === 0 ? 'full' : `${d.openCount} open`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main: day grid + booking summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '16px', alignItems: 'flex-start' }}>
          <DayGrid
            dayConflicts={dayConflicts}
            selectedTime={time}
            durationMin={proc.durationMin}
            providerId={providerId}
            operatoryId={operatoryId}
            onSelect={(iso) => setTime(iso)}
          />

          {/* Right summary panel */}
          <aside
            style={{
              border: '1px solid var(--ads-border-subtle)',
              borderRadius: 'var(--ads-radius-sm)',
              padding: '16px',
              backgroundColor: 'var(--ads-bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              position: 'sticky',
              top: '8px',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '11px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Booking summary
              </div>
              {time && selectedConflict.ok ? (
                <div style={{ marginTop: '8px', padding: '10px 12px', backgroundColor: 'var(--ads-tag-green-bg)', border: '1px solid var(--ads-tag-green-br)', borderRadius: 'var(--ads-radius-sm)' }}>
                  <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--ads-tag-green-fg)' }}>
                    {fmtSlotTime(time)} – {fmtSlotTime(new Date(new Date(time).getTime() + proc.durationMin * 60_000).toISOString())}
                  </div>
                  <div style={{ marginTop: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-primary)' }}>
                    {new Date(dateISO).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              ) : time && !selectedConflict.ok ? (
                <div style={{ marginTop: '8px', padding: '10px 12px', backgroundColor: 'var(--ads-tag-red-bg)', border: '1px solid var(--ads-tag-red-br)', borderRadius: 'var(--ads-radius-sm)' }}>
                  <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--ads-tag-red-fg)' }}>
                    Slot has conflicts
                  </div>
                  <ul style={{ margin: '4px 0 0', paddingLeft: '16px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-primary)' }}>
                    {selectedConflict.reasons.map((r) => (
                      <li key={r}>{REASON_LABEL[r] ?? r}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div style={{ marginTop: '8px', padding: '10px 12px', backgroundColor: 'var(--ads-bg-page)', border: '1px dashed var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                  Click an open area on the grid to pick a time.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px' }}>
              <Row label="Procedure" value={proc.label} />
              <Row label="Duration" value={`${proc.durationMin} min`} />
              <Row label="Provider" value={PROVIDERS.find((p) => p.id === providerId)?.name ?? '—'} />
              <Row label="Operatory" value={OPERATORIES.find((o) => o.id === operatoryId)?.name ?? '—'} />
              <Row label="Specialty" value={SPECIALTY_LABEL[proc.specialty as Specialty]} />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--ads-border-subtle)', margin: 0 }} />

            <div>
              <label
                style={{ display: 'block', marginBottom: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}
              >
                Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Reason for visit…"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  fontFamily: 'var(--ads-font-sans)',
                  fontSize: '12px',
                  lineHeight: '18px',
                  border: '1px solid var(--ads-border-subtle)',
                  borderRadius: 'var(--ads-radius-sm)',
                  resize: 'vertical',
                  backgroundColor: 'var(--ads-bg-surface)',
                  color: 'var(--ads-text-primary)',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px' }}>
                <Checkbox checked={sendEmail} onChange={() => setSendEmail((v) => !v)} />
                Email confirmation
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px' }}>
                <Checkbox checked={sendSMS} onChange={() => setSendSMS((v) => !v)} />
                SMS reminder (24h before)
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '8px 10px', backgroundColor: 'var(--ads-bg-page)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
              <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px' }}>
                <div style={{ fontWeight: 500 }}>Recurring</div>
                <div style={{ color: 'var(--ads-text-muted)', fontSize: '11px' }}>Auto-create next every {recurrenceMonths}mo</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {recurring && (
                  <DropdownList
                    options={[
                      { value: '3',  label: '3mo' },
                      { value: '4',  label: '4mo' },
                      { value: '6',  label: '6mo' },
                      { value: '12', label: '12mo' },
                    ]}
                    value={String(recurrenceMonths)}
                    onChange={(v) => setRecurrenceMonths(Number(v))}
                  />
                )}
                <Toggle checked={recurring} onChange={() => setRecurring((v) => !v)} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
      <span style={{ color: 'var(--ads-text-muted)' }}>{label}</span>
      <span style={{ color: 'var(--ads-text-primary)', textAlign: 'right', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}

/* ============================================================================
   DayGrid — interactive day-view time grid for the patient scheduler.
   ----------------------------------------------------------------------------
   Renders working hours (8am–6pm) as a vertical column. Existing conflicting
   appointments are overlaid as grey blocks (read-only context). The doctor
   clicks any open area; the click is snapped to the nearest 15-min slot and
   a green "preview" block is rendered showing where the new appointment will
   land. Hovering over an empty area shows a faint preview at the snap point.
   ============================================================================ */

function DayGrid({
  dayConflicts,
  selectedTime,
  durationMin,
  providerId,
  operatoryId,
  onSelect,
}: {
  dayConflicts: { id: string; startISO: string; durationMin: number; providerId: string; operatoryId: string; patientName: string; procedureLabel: string }[];
  selectedTime: string | null;
  durationMin: number;
  providerId: string;
  operatoryId: string;
  onSelect: (iso: string) => void;
}) {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [hoverTop, setHoverTop] = useState<number | null>(null);

  const previewTop = selectedTime ? minutesIntoDay(selectedTime) * PX_PER_MIN : null;

  const onClick = (e: React.MouseEvent) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const snapped = snapPx(y);
    const startMinutes = snapped / PX_PER_MIN;
    const hour = WORK_HOURS.startHour + Math.floor(startMinutes / 60);
    const min = Math.round(startMinutes) % 60;
    // Build ISO for the *day* the conflict list represents.
    const sample = dayConflicts[0]?.startISO;
    const dayBaseISO = sample
      ? `${new Date(sample).getFullYear()}-${String(new Date(sample).getMonth() + 1).padStart(2, '0')}-${String(new Date(sample).getDate()).padStart(2, '0')}`
      : todayISO();
    onSelect(buildSlotISO(dayBaseISO, hour, min));
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    setHoverTop(snapPx(e.clientY - rect.top));
  };
  const onMouseLeave = () => setHoverTop(null);

  // Hour labels.
  const hourLabels: number[] = [];
  for (let h = WORK_HOURS.startHour; h <= WORK_HOURS.endHour; h += 1) hourLabels.push(h);

  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid var(--ads-border-subtle)',
          backgroundColor: 'var(--ads-bg-page)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500 }}>
          Day grid · click anywhere to pick a time
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: 'var(--ads-text-muted)' }}>
          <LegendDot color="var(--ads-tag-blue-bg)" border="var(--ads-tag-blue-br)" label="Open" />
          <LegendDot color="repeating-linear-gradient(45deg, var(--ads-border-accent) 0 5px, var(--ads-background-subtle-02) 5px 10px)" border="var(--ads-border-accent)" label="Conflict" />
          <LegendDot color="var(--ads-tag-green-bg)" border="var(--ads-tag-green-fg)" label="Selected" />
        </div>
      </header>

      <div style={{ display: 'flex', maxHeight: '520px', overflowY: 'auto' }}>
        {/* Time labels column */}
        <div style={{ width: TIME_COL_W, flexShrink: 0, position: 'relative', backgroundColor: 'var(--ads-bg-page)' }}>
          <div style={{ height: GRID_HEIGHT, position: 'relative' }}>
            {hourLabels.map((h, i) => (
              <div
                key={h}
                style={{
                  position: 'absolute',
                  top: i === 0 ? 0 : (h - WORK_HOURS.startHour) * 60 * PX_PER_MIN,
                  right: 8,
                  transform: i === 0 ? 'none' : 'translateY(-50%)',
                  fontFamily: 'var(--ads-font-sans)',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--ads-text-muted)',
                }}
              >
                {h % 12 === 0 ? 12 : h % 12}{h < 12 ? 'am' : 'pm'}
              </div>
            ))}
          </div>
        </div>

        {/* Click track */}
        <div
          ref={gridRef}
          onClick={onClick}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{
            position: 'relative',
            flex: 1,
            height: GRID_HEIGHT,
            cursor: 'pointer',
            borderLeft: '1px solid var(--ads-border-subtle)',
          }}
        >
          {/* Hourly grid lines */}
          {hourLabels.map((h, i) => (
            <div
              key={h}
              style={{
                position: 'absolute',
                top: i === 0 ? 0 : (h - WORK_HOURS.startHour) * 60 * PX_PER_MIN,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: 'var(--ads-border-subtle)',
                pointerEvents: 'none',
              }}
            />
          ))}
          {/* Quarter-hour minor lines */}
          {Array.from({ length: TOTAL_MIN / 15 }).map((_, i) => {
            const top = i * 15 * PX_PER_MIN;
            const isHour = i % 4 === 0;
            if (isHour) return null;
            return (
              <div
                key={`q-${i}`}
                style={{ position: 'absolute', top, left: 0, right: 0, height: 1, borderTop: '1px dashed color-mix(in srgb, var(--ads-border-subtle) 60%, transparent)', pointerEvents: 'none' }}
              />
            );
          })}

          {/* Existing conflicts (greyed read-only blocks) */}
          {dayConflicts.map((a) => {
            const top = minutesIntoDay(a.startISO) * PX_PER_MIN;
            const height = a.durationMin * PX_PER_MIN;
            const isProviderConflict = a.providerId === providerId;
            const isOperatoryConflict = a.operatoryId === operatoryId;
            const reason = isProviderConflict && isOperatoryConflict
              ? 'Provider + operatory both booked'
              : isProviderConflict
              ? 'Provider booked'
              : 'Operatory booked';
            return (
              <div
                key={a.id}
                title={`${a.patientName} · ${a.procedureLabel} (${reason})`}
                style={{
                  position: 'absolute',
                  top, left: 4, right: 4,
                  height: Math.max(20, height - 1),
                  border: '1px solid var(--ads-border-accent)',
                  borderLeft: '3px solid var(--ads-border-accent)',
                  borderRadius: 'var(--ads-radius-sm)',
                  background: 'repeating-linear-gradient(45deg, #ECECEC 0 6px, var(--ads-background-subtle-02) 6px 12px)',
                  color: 'var(--ads-text-muted)',
                  padding: '4px 8px',
                  fontFamily: 'var(--ads-font-sans)',
                  fontSize: '11px',
                  lineHeight: '14px',
                  overflow: 'hidden',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ fontWeight: 500, color: 'var(--ads-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {a.patientName}
                </div>
                <div style={{ color: 'var(--ads-text-muted)', fontSize: '10px' }}>{reason}</div>
              </div>
            );
          })}

          {/* Hover ghost preview */}
          {hoverTop !== null && previewTop === null && (
            <div
              style={{
                position: 'absolute',
                top: hoverTop, left: 4, right: 4,
                height: durationMin * PX_PER_MIN,
                border: '1px dashed var(--ads-blue-500)',
                backgroundColor: 'color-mix(in srgb, var(--ads-blue-500) 6%, transparent)',
                borderRadius: 'var(--ads-radius-sm)',
                pointerEvents: 'none',
                opacity: 0.7,
              }}
            />
          )}

          {/* Selected preview block */}
          {previewTop !== null && (
            <div
              style={{
                position: 'absolute',
                top: previewTop, left: 4, right: 4,
                height: durationMin * PX_PER_MIN,
                border: '2px solid var(--ads-tag-green-fg)',
                backgroundColor: 'var(--ads-tag-green-bg)',
                borderRadius: 'var(--ads-radius-sm)',
                padding: '4px 8px',
                fontFamily: 'var(--ads-font-sans)',
                fontSize: '11px',
                lineHeight: '14px',
                color: 'var(--ads-tag-green-fg)',
                pointerEvents: 'none',
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {fmtSlotTime(selectedTime!)} – {fmtSlotTime(new Date(new Date(selectedTime!).getTime() + durationMin * 60_000).toISOString())}
              </div>
              <div style={{ fontSize: '10px' }}>New appointment</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function LegendDot({ color, border, label }: { color: string; border: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ width: 10, height: 10, background: color, border: `1px solid ${border}`, borderRadius: 2 }} />
      {label}
    </span>
  );
}

function snapPx(y: number): number {
  const slotPx = SLOT_MIN * PX_PER_MIN;
  return Math.max(0, Math.min(GRID_HEIGHT - slotPx, Math.round(y / slotPx) * slotPx));
}

function minutesIntoDay(iso: string): number {
  const d = new Date(iso);
  return (d.getHours() - WORK_HOURS.startHour) * 60 + d.getMinutes();
}

const REASON_LABEL: Record<string, string> = {
  'overlap-provider':                     'Provider is already booked at this time.',
  'overlap-operatory':                    'Operatory is already booked at this time.',
  'outside-working-hours':                'Outside working hours.',
  'specialty-not-supported-by-operatory': 'Operatory does not support this procedure type.',
  'specialty-not-supported-by-provider':  'Provider is not credentialed for this specialty.',
};

/* ============================================================================
   Inline icons (kept local since the DS Icon set doesn't include these)
   ============================================================================ */

function CalendarPlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="14" height="13" rx="1.5" />
      <line x1="3" y1="9" x2="17" y2="9" />
      <line x1="6.5" y1="3" x2="6.5" y2="6" />
      <line x1="13.5" y1="3" x2="13.5" y2="6" />
      <line x1="10" y1="12" x2="10" y2="16" />
      <line x1="8" y1="14" x2="12" y2="14" />
    </svg>
  );
}

function CanvasIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <path d="M7 13L9.5 10.5L11.5 12.5L14 9.5" />
      <circle cx="7" cy="7" r="1" />
    </svg>
  );
}

function CreateTreatmentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4v12M4 10h12" />
      <path d="M6 6l8 8M14 6l-8 8" opacity="0.45" />
    </svg>
  );
}
