import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { color, font, space, radius, shadow, transition } from '../design-system/tokens';
import { SecondaryButton } from '../design-system/SecondaryButton';
import { PrimaryButton } from '../design-system/PrimaryButton';
import { useFocusTrap } from '../design-system/useFocusTrap';
import { notify } from '../design-system/notify';
import SignatureModal from './report/SignatureModal';
import BlockEditor, { GalleryOverlayModal } from './report/BlockEditor';
import BlockNavList from './report/BlockNavList';
import ReportPreview, { IteroLogoSvg, DentalFlowerLogo } from './report/ReportPreview';
import type { ImageBlock, ComparisonBlock, CostSummaryBlock, NotesBlock, RxBlock, NextAppointmentBlock, PatientInstructionsBlock, PatientInfo, ReportSettings } from './report/types';
import { createImageBlock, createBlock, REPORT_TEMPLATES } from './report/types';
import type { BlockType } from './report/types';
import ShareModal from './report/ShareModal';
import { BatteryFull, Settings as SettingsIcon, CircleHelp } from 'lucide-react';
import reportEmptyStateImg from '../assets/Report-Empty state/new patient report image empty state.png';
import scratchIcon from '../assets/new report icons/Start from scrach.svg';
import generalIcon from '../assets/new report icons/Genral report.svg';
import implantIcon from '../assets/new report icons/Implanet based.svg';
import crownIcon from '../assets/new report icons/Crown.svg';
import followupIcon from '../assets/new report icons/Follow up visit.svg';

import ReactDOM from 'react-dom';

type SupportedBlock = ImageBlock | ComparisonBlock | CostSummaryBlock | NotesBlock | RxBlock | NextAppointmentBlock | PatientInstructionsBlock;

// ─── Inline text input (for header) ─────────────────────────────────────────

function InlineInput({ value, onChange, placeholder, style }: {
  value: string; onChange: (v: string) => void; placeholder?: string; style?: React.CSSProperties;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        fontSize: font.size.md,
        fontWeight: font.weight.semibold,
        fontFamily: font.family,
        color: color.textHeading,
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: `1.5px solid ${focused ? color.primary : 'transparent'}`,
        outline: 'none',
        padding: `${space[1]} 0`,
        letterSpacing: font.tracking.snug,
        transition: `border-color ${transition.fast}`,
        minWidth: '160px',
        ...style,
      }}
    />
  );
}

// ─── Metadata chip in header ─────────────────────────────────────────────────

function MetaChip({ label, value, onChange, placeholder }: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const editable = !!onChange;
  const showPencil = editable && (hovered || focused);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: space[2],
        padding: `6px ${space[4]}`,
        backgroundColor: 'transparent',
        borderRadius: radius.md,
        fontSize: font.size.sm,
        lineHeight: '1',
        border: `1px solid ${focused ? color.primary : hovered ? color.borderDefault : 'transparent'}`,
        transition: `border-color ${transition.fast}`,
      }}
    >
      <span style={{ color: color.textPlaceholder, fontWeight: font.weight.medium }}>{label}</span>
      {editable ? (
        <input
          value={value}
          onChange={(e) => onChange!(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder || '---'}
          style={{
            color: color.textDefault,
            fontWeight: font.weight.medium,
            fontSize: font.size.sm,
            fontFamily: font.family,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: 0,
            margin: 0,
            minWidth: '60px',
            width: `${Math.max(6, (value || placeholder || '---').length + 1)}ch`,
            lineHeight: '1',
            cursor: 'text',
          }}
        />
      ) : (
        <span style={{ color: color.textDefault, fontWeight: font.weight.medium }}>{value || '---'}</span>
      )}
      {editable && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke={focused ? color.primary : color.textPlaceholder}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            flexShrink: 0,
            opacity: showPencil ? 1 : 0,
            transition: `opacity ${transition.fast}`,
          }}
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      )}
    </div>
  );
}

// ─── Report header (logo + clinic/doctor on left, patient + date on right) ──

function HeaderEditable({
  value,
  onChange,
  placeholder,
  size,
  align = 'left',
  maxWidth,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  size: 'sm' | 'lg';
  align?: 'left' | 'right';
  maxWidth?: number;
}) {
  const [focused, setFocused] = useState(false);
  const isLg = size === 'lg';
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        fontSize: isLg ? font.size.lg : font.size.sm,
        color: isLg ? color.textHeading : color.textSubtle,
        fontWeight: isLg ? font.weight.semibold : font.weight.regular,
        letterSpacing: isLg ? font.tracking.tight : 'normal',
        fontFamily: font.family,
        background: 'transparent',
        border: 'none',
        borderBottom: `1px solid ${focused ? color.primary : 'transparent'}`,
        outline: 'none',
        padding: `2px 0`,
        textAlign: align,
        width: '100%',
        maxWidth,
        minWidth: 0,
        transition: `border-color ${transition.fast}`,
      }}
    />
  );
}

function ReportHeader({
  settings,
  patient,
  date,
  onSettingsChange,
  onPatientChange,
  onLogoUpload,
}: {
  settings: ReportSettings;
  patient: PatientInfo;
  date: string;
  onSettingsChange: (next: Partial<ReportSettings>) => void;
  onPatientChange: (next: Partial<PatientInfo>) => void;
  onLogoUpload: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onLogoUpload(URL.createObjectURL(file));
    e.target.value = '';
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: space[6],
      padding: `${space[6]} ${space[8]}`,
      borderBottom: `1px solid ${color.borderDefault}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: space[6], minWidth: 0 }}>
        {/* Logo placeholder / actual logo (with remove control) */}
        <div
          style={{ position: 'relative', flexShrink: 0 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label={settings.clinicLogoUrl ? 'Change clinic logo' : 'Add clinic logo'}
            style={{
              width: 96,
              height: 96,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: settings.clinicLogoUrl ? `1px solid ${color.borderDefault}` : `1.5px dashed ${hovered ? color.primary : color.borderDefault}`,
              borderRadius: radius.lg,
              background: settings.clinicLogoUrl ? color.bgSurface : (hovered ? color.bgHover : 'transparent'),
              cursor: 'pointer',
              padding: 0,
              overflow: 'hidden',
              transition: `border-color ${transition.fast}, background-color ${transition.fast}`,
            }}
          >
            {settings.clinicLogoUrl ? (
              <img src={settings.clinicLogoUrl} alt="Clinic logo" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
            ) : (
              <span style={{
                fontSize: font.size['2xs'],
                fontWeight: font.weight.medium,
                color: hovered ? color.primary : color.textPlaceholder,
                letterSpacing: font.tracking.wide,
                textTransform: 'uppercase',
                textAlign: 'center',
                lineHeight: font.lineHeight.tight,
              }}>
                Add<br />Logo
              </span>
            )}
          </button>
          {settings.clinicLogoUrl && hovered && (
            <button
              type="button"
              aria-label="Remove logo"
              onClick={(e) => { e.stopPropagation(); onSettingsChange({ clinicLogoUrl: '' }); }}
              style={{
                position: 'absolute', top: -6, right: -6,
                width: 20, height: 20, borderRadius: radius.full,
                background: color.textHeading, color: color.bgSurface,
                border: 'none', cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: shadow.sm,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="3" x2="9" y2="9" /><line x1="9" y1="3" x2="3" y2="9" />
              </svg>
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />

        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          <HeaderEditable
            value={settings.clinicName}
            onChange={(v) => onSettingsChange({ clinicName: v })}
            placeholder="Clinic name"
            size="sm"
          />
          <HeaderEditable
            value={settings.doctorName}
            onChange={(v) => onSettingsChange({ doctorName: v })}
            placeholder="Doctor name"
            size="lg"
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, minWidth: 0, textAlign: 'right' }}>
        <HeaderEditable
          value={patient.patientName}
          onChange={(v) => onPatientChange({ patientName: v })}
          placeholder="Patient name"
          size="lg"
          align="right"
          maxWidth={360}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
          <span style={{ fontSize: font.size.sm, color: color.textSubtle }}>Patient ·</span>
          <input
            type="text"
            value={patient.chartNumber}
            placeholder="Chart #"
            onChange={(e) => onPatientChange({ chartNumber: e.target.value })}
            style={{
              fontSize: font.size.sm, color: color.textSubtle, fontFamily: font.family,
              background: 'transparent', border: 'none', outline: 'none',
              padding: 0, textAlign: 'left',
              width: `${Math.max((patient.chartNumber || 'Chart #').length, 4)}ch`,
            }}
          />
        </div>
        <span style={{ fontSize: font.size.sm, color: color.textSubtle }}>
          {date}
        </span>
      </div>
    </div>
  );
}

function formatReportDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ─── Settings sidebar sections ───────────────────────────────────────────────

function SidebarSection({ title, children, defaultOpen = true, isOpen: controlledOpen, onToggle }: {
  title: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; isOpen?: boolean; onToggle?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleToggle = () => {
    const next = !open;
    if (onToggle) onToggle(next);
    else setInternalOpen(next);
  };
  return (
    <div style={{
      backgroundColor: color.bgSurface,
      borderRadius: radius.lg,
      border: `1px solid ${color.borderDefault}`,
      overflow: 'hidden',
    }}>
      <div
        onClick={handleToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${space[3]} ${space[4]}`,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{
          fontSize: font.size.sm,
          fontWeight: font.weight.semibold,
          color: color.textHeading,
          flex: 1,
          minWidth: 0,
        }}>
          {title}
        </div>
        <svg
          width="14" height="14" viewBox="0 0 16 16" fill="none"
          stroke={color.neutral400} strokeWidth="1.5" strokeLinecap="round"
          style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: `transform ${transition.fast}` }}
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </div>
      {open && (
        <div style={{ padding: `0 ${space[4]} ${space[4]}`, display: 'flex', flexDirection: 'column', gap: space[3] }}>
          {children}
        </div>
      )}
    </div>
  );
}


// ─── Template picker ─────────────────────────────────────────────────────────

// Per-template icons, shared by the picker cards and the Templates row header.
const TEMPLATE_ICON_SRC: Record<string, string> = {
  scratch: scratchIcon,
  general: generalIcon,
  implant: implantIcon,
  crown: crownIcon,
  followup: followupIcon,
};

const TEMPLATE_ICONS: Record<string, React.ReactNode> = Object.fromEntries(
  Object.entries(TEMPLATE_ICON_SRC).map(([id, src]) => [
    id,
    <img src={src} alt="" aria-hidden="true" style={{ width: 36, height: 36, display: 'block' }} />,
  ]),
);

function TemplatePicker({ onSelect, selectedId }: {
  onSelect: (blocks: SupportedBlock[], name: string, id: string) => void;
  selectedId: string | null;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space[2] }}>
      <TemplateCard
        name="Start from Scratch"
        description="Empty report, add your own blocks"
        isSelected={selectedId === 'scratch'}
        onClick={() => onSelect([], 'Start from Scratch', 'scratch')}
        icon={TEMPLATE_ICONS.scratch}
      />
      {REPORT_TEMPLATES.map((tpl) => {
        const supported = tpl.blocks
          .map((b, i) => ({
            ...b,
            id: `tpl-block-${Date.now()}-${i}`,
          })) as SupportedBlock[];
        return (
          <TemplateCard
            key={tpl.id}
            name={tpl.name}
            description={tpl.description}
            isSelected={selectedId === tpl.id}
            onClick={() => onSelect(supported, tpl.name, tpl.id)}
            icon={TEMPLATE_ICONS[tpl.id]}
          />
        );
      })}
    </div>
  );
}

function TemplateCard({ name, description, onClick, isSelected, icon }: {
  name: string; description: string; onClick: () => void; isSelected: boolean; icon?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  // Matches the DS procedure-card behavior: white surface always; selected =
  // 2px interactive (blue) border + blue icon (no bg tint / no check badge);
  // hover only transitions the border color.
  const borderColor = isSelected
    ? 'var(--ads-background-interactive)'
    : hovered
    ? 'var(--ads-border-accent-hover)'
    : 'var(--ads-border-subtle)';
  const iconColor = isSelected ? 'var(--ads-background-interactive)' : color.textSubtle;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-pressed={isSelected}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: space[2],
        // 19px when selected so the 2px border doesn't shift layout vs 1px.
        padding: isSelected ? '19px' : space[5],
        minHeight: 120,
        backgroundColor: color.bgSurface,
        border: `${isSelected ? '2px' : '1px'} solid ${borderColor}`,
        borderRadius: radius.md,
        cursor: 'pointer',
        textAlign: 'left',
        transition: `border-color ${transition.fast}`,
      }}
    >
      {icon && <div style={{ color: iconColor, transition: `color ${transition.fast}` }}>{icon}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: space[2] }}>
        <div style={{ fontSize: font.size.base, fontWeight: font.weight.medium, color: color.textHeading }}>
          {name}
        </div>
        <div style={{ fontSize: font.size.xs, color: color.textSubtle, lineHeight: font.lineHeight.normal }}>
          {description}
        </div>
      </div>
    </button>
  );
}

// ─── Preview Modal ──────────────────────────────────────────────────────────

function ReportPreviewModal({ settings, patient, blocks, onClose, onShare, onExport }: {
  settings: ReportSettings;
  patient: PatientInfo;
  blocks: SupportedBlock[];
  onClose: () => void;
  onShare: () => void;
  onExport: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, true);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 200 }}
      />

      {/* Modal */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${settings.reportName || 'Untitled Report'} preview`}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        {/* Header bar */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${space[3]} ${space[5]}`,
          backgroundColor: 'var(--ads-background-inverse)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: space[3] }}>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              style={{
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.08)',
                color: color.textOnPrimary, cursor: 'pointer', padding: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
              </svg>
            </button>
            <span style={{ fontSize: font.size.base, fontWeight: font.weight.semibold, color: color.textOnPrimary }}>
              {settings.reportName || 'Untitled Report'}.pdf
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: space[2] }}>
            <button
              type="button"
              onClick={onShare}
              style={{
                height: '34px', padding: `0 ${space[4]}`, display: 'flex', alignItems: 'center', gap: space[2],
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: radius.md,
                backgroundColor: 'rgba(255,255,255,0.06)', color: color.textOnPrimary,
                fontSize: font.size.sm, fontWeight: font.weight.medium, cursor: 'pointer',
                fontFamily: font.family,
              }}
            >
              Share
            </button>
            <button
              type="button"
              onClick={onExport}
              style={{
                height: '34px', padding: `0 ${space[4]}`, display: 'flex', alignItems: 'center', gap: space[2],
                border: 'none', borderRadius: radius.md,
                backgroundColor: color.primary, color: color.textOnPrimary,
                fontSize: font.size.sm, fontWeight: font.weight.medium, cursor: 'pointer',
                fontFamily: font.family,
              }}
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* PDF page area — dark background like a real PDF viewer */}
        <div style={{
          flex: 1,
          width: '100%',
          overflowY: 'auto',
          backgroundColor: 'var(--ads-background-inverse)',
          display: 'flex',
          justifyContent: 'center',
          padding: `${space[8]} ${space[4]}`,
        }}>
          {/* A4 paper page */}
          <div style={{
            width: '794px',
            minHeight: '1123px',
            maxWidth: '95vw',
            backgroundColor: color.bgSurface,
            boxShadow: shadow.lg,
            flexShrink: 0,
            alignSelf: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <ReportPreview settings={settings} patient={patient} blocks={blocks} />
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyStatePlaceholder() {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: space[10], color: color.textPlaceholder, fontSize: font.size.sm,
      textAlign: 'center', fontFamily: font.family,
    }}>
      <div style={{ maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space[2] }}>
        <img
          src={reportEmptyStateImg}
          alt=""
          aria-hidden="true"
          style={{ width: 320, height: 'auto', marginBottom: space[2] }}
        />
        <span>
          Pick a section from the left, or apply a template to get started.
        </span>
      </div>
    </div>
  );
}

// ─── Header utility icon cell ─── mirrors the scan-flow header's nav icons:
// 40×40 hit area, 8px radius, subtle hover fill, 24px glyph.
function HeaderIconCell({ label, onClick, children }: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        minWidth: 40,
        minHeight: 40,
        flexShrink: 0,
        padding: 0,
        border: 'none',
        borderRadius: 8,
        backgroundColor: 'transparent',
        cursor: 'pointer',
        transition: `background-color ${transition.fast}`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--ads-background-subtle-hover)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      {children}
    </button>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export interface PatientReportPageHandle {
  setSettings: (s: ReportSettings) => void;
  setPatient: (p: PatientInfo) => void;
  setBlocks: (b: SupportedBlock[]) => void;
  setActiveTab: (t: 'blocks' | 'settings') => void;
  scrollEditorTo: (selector: string) => void;
  scrollEditorToBottom: () => void;
  scrollPreviewToBottom: () => void;
  getEditorEl: () => HTMLDivElement | null;
  /** Programmatically click a DOM element inside the editor by CSS selector */
  clickInEditor: (selector: string) => void;
  /** Programmatically click a DOM element anywhere in the page (including portals) by CSS selector */
  clickInPage: (selector: string) => void;
  /** Programmatically apply a template by its ID */
  selectTemplate: (templateId: string) => void;
}

export interface PatientReportPageProps {
  onBackToHome: () => void;
  /** Pre-populated demo data. When provided, the report starts fully filled. */
  initialData?: {
    settings: ReportSettings;
    patient: PatientInfo;
    blocks: SupportedBlock[];
  };
}

const PatientReportPage = forwardRef<PatientReportPageHandle, PatientReportPageProps>(function PatientReportPage({
  onBackToHome,
  initialData,
}, ref) {
  const [settings, setSettings] = useState<ReportSettings>(initialData?.settings ?? {
    reportName: 'Align Oral Health Report',
    doctorName: 'Dr. Smith',
    doctorImageUrl: '',
    clinicName: 'Bright Smile Clinic',
    clinicLogoUrl: '',
    pinEnabled: false,
    pin: '',
    signatureUrl: '',
    signatureMethod: '',
  });

  const [patient, setPatient] = useState<PatientInfo>(initialData?.patient ?? {
    patientName: 'John Doe',
    birthDate: '03/15/1985',
    chartNumber: '10042',
  });

  const [blocks, setBlocks] = useState<SupportedBlock[]>(initialData?.blocks ?? [
    { ...createImageBlock(), id: 'init-img' },
  ]);

  const [activeTab, setActiveTab] = useState<'blocks' | 'settings'>('blocks');
  const [saved, setSaved] = useState(true);
  const [appliedTemplate, setAppliedTemplate] = useState<string | null>(null);
  const [blocksBeforeTemplate, setBlocksBeforeTemplate] = useState<SupportedBlock[] | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  // null → slide-over editor closed (preview is fully visible behind it).
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  // If the active block disappears (deletion, template swap), close the slide-over.
  useEffect(() => {
    if (activeBlockId && !blocks.some((b) => b.id === activeBlockId)) {
      setActiveBlockId(null);
    }
  }, [blocks, activeBlockId]);

  // Smooth-scroll the matching card into view when the nav selection changes.
  useEffect(() => {
    if (!activeBlockId) return;
    const el = document.querySelector<HTMLDivElement>(`[data-block-id="${activeBlockId}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeBlockId]);

  const editorScrollRef = useRef<HTMLDivElement>(null);
  const editorContentRef = useRef<HTMLDivElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  // Expose imperative handle for demo automation
  useImperativeHandle(ref, () => ({
    setSettings: (s: ReportSettings) => { setSettings(s); setSaved(false); setTimeout(() => setSaved(true), 800); },
    setPatient: (p: PatientInfo) => { setPatient(p); setSaved(false); setTimeout(() => setSaved(true), 800); },
    setBlocks: (b: SupportedBlock[]) => { setBlocks(b); setSaved(false); setTimeout(() => setSaved(true), 800); },
    setActiveTab,
    scrollEditorTo: (selector: string) => {
      const el = editorContentRef.current?.querySelector(selector);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    scrollEditorToBottom: () => {
      const el = editorContentRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    },
    scrollPreviewToBottom: () => {
      previewScrollRef.current?.scrollTo({ top: previewScrollRef.current.scrollHeight, behavior: 'smooth' });
    },
    getEditorEl: () => editorContentRef.current,
    clickInEditor: (selector: string) => {
      const el = editorContentRef.current?.querySelector<HTMLElement>(selector);
      if (el) el.click();
    },
    clickInPage: (selector: string) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) el.click();
    },
    selectTemplate: (templateId: string) => {
      const tpl = REPORT_TEMPLATES.find((t) => t.id === templateId);
      if (!tpl) return;
      const supported = tpl.blocks.map((b, i) => ({
        ...b,
        id: `tpl-block-${Date.now()}-${i}`,
        collapsed: false,
      })) as SupportedBlock[];
      handleTemplateSelect(supported, tpl.name, tpl.id);
    },
  }));


  const [shareOpen, setShareOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [signatureOpen, setSignatureOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  // When the user tries to share before signing, we open the signature modal
  // first and remember to continue to Share once they save.
  const [shareAfterSign, setShareAfterSign] = useState(false);

  const handleExportOrShare = (action: 'share' | 'export') => {
    if (action === 'share') {
      // A signature is required before a report can be shared.
      if (!settings.signatureUrl) {
        notify.info('Please sign the report before sharing.');
        setShareAfterSign(true);
        setSignatureOpen(true);
        return;
      }
      setShareOpen(true);
    } else {
      notify.success('Report exported as PDF');
    }
  };

  // Mark unsaved on any change
  const handleBlocksChange = (newBlocks: SupportedBlock[]) => {
    setBlocks(newBlocks);
    setSaved(false);
    setTimeout(() => setSaved(true), 1500);
  };

  // "+ Add section" from the left nav — creates the block, appends it,
  // and focuses it.
  const handleAddBlock = (type: BlockType) => {
    const created = createBlock(type) as SupportedBlock;
    // Adding a section expands every section so the new content is visible.
    setBlocks((prev) => [...prev, created].map((b) => ({ ...b, collapsed: false }) as SupportedBlock));
    setActiveBlockId(created.id);
    setSaved(false);
    setTimeout(() => setSaved(true), 1500);
  };

  // "Image gallery" from the Add Section menu — turns each selected gallery
  // image into its own image section, appended in a bunch.
  const handleAddImagesFromGallery = (urls: string[]) => {
    if (urls.length === 0) return;
    const created = urls.map((url) => ({ ...createImageBlock(), previewUrl: url }) as SupportedBlock);
    setBlocks((prev) => [...prev, ...created].map((b) => ({ ...b, collapsed: false }) as SupportedBlock));
    setActiveBlockId(created[0].id);
    setSaved(false);
    setTimeout(() => setSaved(true), 1500);
  };

  const handleDuplicateBlock = (id: string) => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const clone = { ...blocks[idx], id: `block-${Date.now()}` } as SupportedBlock;
    const next = [...blocks];
    next.splice(idx + 1, 0, clone);
    setBlocks(next);
    setActiveBlockId(clone.id);
    setSaved(false);
    setTimeout(() => setSaved(true), 1500);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (activeBlockId === id) setActiveBlockId(null);
    setSaved(false);
    setTimeout(() => setSaved(true), 1500);
  };

  /** Insert a new block of the given type at a specific position (used by the inline "+" between cards). */
  const handleInsertBlock = (type: BlockType, atIndex: number) => {
    const created = createBlock(type) as SupportedBlock;
    setBlocks((prev) => {
      const next = [...prev];
      next.splice(atIndex, 0, created);
      // Inserting a section expands every section so the new content is visible.
      return next.map((b) => ({ ...b, collapsed: false }) as SupportedBlock);
    });
    setActiveBlockId(created.id);
    setSaved(false);
    setTimeout(() => setSaved(true), 1500);
  };

  const handleTemplateSelect = (templateBlocks: SupportedBlock[], templateName: string, templateId: string) => {
    setBlocksBeforeTemplate(blocks);
    setAppliedTemplate(templateName);
    setSelectedTemplateId(templateId);
    setBlocks(templateBlocks.map(b => ({ ...b, collapsed: false }) as SupportedBlock));
    setSaved(false);
    setTimeout(() => setSaved(true), 1500);
    setTemplatesOpen(false);
  };

  const handleUndoTemplate = () => {
    if (blocksBeforeTemplate) {
      setBlocks(blocksBeforeTemplate);
      setBlocksBeforeTemplate(null);
      setAppliedTemplate(null);
      setSelectedTemplateId(null);
      setSaved(false);
      setTimeout(() => setSaved(true), 1500);
    }
  };

  return (
    <>
    <style>{`
      @keyframes checkPop {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.3); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    `}</style>
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: color.bgPage,
      fontFamily: font.family,
    }}>
      {/* ── Sticky Header ── matches the info page's dedicated top header
          (56px tall, 16px horizontal padding, subtle bottom border). */}
      <div style={{
        height: '56px',
        minHeight: '56px',
        maxHeight: '56px',
        width: '100%',
        backgroundColor: 'var(--ads-background-subtle-01)',
        borderBottom: `1px solid var(--ads-border-subtle)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: space[4],
        padding: `${space[1]} ${space[4]}`,
        flexShrink: 0,
        zIndex: 10,
      }}>
        {/* Left: back + report name + metadata chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: space[3], flex: 1, minWidth: 0 }}>
          <button
            type="button"
            onClick={onBackToHome}
            aria-label="Back"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              border: 'none',
              borderRadius: radius.sm,
              backgroundColor: 'transparent',
              color: color.textSubtle,
              cursor: 'pointer',
              flexShrink: 0,
              transition: `background-color ${transition.fast}`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color.bgHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--ds-border-subtle)', flexShrink: 0 }} />

          <InlineInput
            value={settings.reportName}
            onChange={(v) => { setSettings((s) => ({ ...s, reportName: v })); setSaved(false); setTimeout(() => setSaved(true), 1500); }}
            placeholder="Report name"
          />

          {/* MetaChips removed — Doctor / Clinic / Patient are editable
              inline from the ReportHeader at the top of the preview. */}
        </div>

        {/* Right: save status + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: space[3], flexShrink: 0 }}>
          {/* Save indicator */}
          <span style={{
            fontSize: font.size.xs,
            color: saved ? color.success : color.textPlaceholder,
            display: 'flex',
            alignItems: 'center',
            gap: space[1],
          }}>
            {saved ? (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.5L5 9l4.5-6" />
                </svg>
                Saved
              </>
            ) : (
              'Saving...'
            )}
          </span>

          {/* Preview */}
          <SecondaryButton size={36} onClick={() => setPreviewOpen(true)}>
            Preview
          </SecondaryButton>

          {/* Share */}
          <PrimaryButton size={36} onClick={() => handleExportOrShare('share')}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7.5v4a1 1 0 001 1h4a1 1 0 001-1v-4" />
              <polyline points="3,5 7,1 11,5" />
              <line x1="7" y1="1" x2="7" y2="9" />
            </svg>
            Share
          </PrimaryButton>

          {/* Divider + global header utilities (battery / settings / help) —
              the icons sit adjacent (no gap) like the dedicated header cluster. */}
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--ds-border-subtle)', margin: `0 ${space[1]}` }} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <HeaderIconCell label="Battery">
              <BatteryFull size={24} color="var(--ads-icon-secondary)" strokeWidth={1.5} />
            </HeaderIconCell>
            <HeaderIconCell label="Settings">
              <SettingsIcon size={24} color="var(--ads-icon-secondary)" strokeWidth={1.5} />
            </HeaderIconCell>
            <HeaderIconCell label="Help">
              <CircleHelp size={24} color="var(--ads-icon-secondary)" strokeWidth={1.5} />
            </HeaderIconCell>
          </div>
        </div>
      </div>

      {/* ── Main Content ── Wynde-style: white nav rail (left), gray preview canvas (right), slide-over editor sits between them. */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* ── Left: Block navigation rail ── */}
        <aside style={{
          width: '300px',
          flexShrink: 0,
          overflowY: 'auto',
          backgroundColor: color.bgSurface,
          borderRight: `1px solid ${color.borderDefault}`,
          padding: `${space[4]} ${space[3]}`,
          display: 'flex',
          flexDirection: 'column',
          gap: space[2],
          zIndex: 2,
        }}>
          {/* Templates — disclosure styled as a section-family row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
            <button
              type="button"
              onClick={() => setTemplatesOpen((v) => !v)}
              aria-expanded={templatesOpen}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ads-border-accent-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = color.borderDefault; }}
              style={{
                display: 'flex', alignItems: 'center', gap: space[2],
                padding: `${space[3]} ${space[2]} ${space[3]} ${space[3]}`,
                borderRadius: radius.md, cursor: 'pointer',
                background: color.bgSurface,
                border: `1px solid ${color.borderDefault}`,
                boxShadow: 'none',
                transition: `border-color ${transition.fast}`,
                width: '100%', textAlign: 'left', fontFamily: font.family,
              }}
            >
              <span style={{
                flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: space[2],
                fontSize: font.size.sm, fontWeight: font.weight.medium, color: color.textDefault,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {appliedTemplate ? appliedTemplate : 'Templates'}
                {appliedTemplate && blocksBeforeTemplate && (
                  <span
                    onClick={(e) => { e.stopPropagation(); handleUndoTemplate(); }}
                    style={{ color: color.primary, fontSize: font.size.xs, fontWeight: font.weight.semibold, flexShrink: 0 }}
                  >
                    Undo
                  </span>
                )}
              </span>
              <svg
                width="14" height="14" viewBox="0 0 16 16" fill="none"
                stroke={color.textSubtle} strokeWidth="1.5" strokeLinecap="round"
                aria-hidden="true"
                style={{ flexShrink: 0, transform: templatesOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: `transform ${transition.fast}` }}
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>
            {templatesOpen && (
              <div style={{ padding: `${space[1]} ${space[1]} 0` }}>
                <TemplatePicker onSelect={handleTemplateSelect} selectedId={selectedTemplateId} />
              </div>
            )}
          </div>

          {/* Section list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
            <BlockNavList
              blocks={blocks}
              activeBlockId={activeBlockId}
              onSelect={(id) => setActiveBlockId(id)}
              onReorder={handleBlocksChange}
              onAdd={handleAddBlock}
              onInsert={handleInsertBlock}
              onAddImageGallery={() => setGalleryOpen(true)}
              onDuplicate={handleDuplicateBlock}
              onDelete={(id) => handleDeleteBlock(id)}
            />
          </div>
        </aside>

        {/* ── Right: white page surface — header at top, section cards below ── */}
        <main
          ref={(el) => {
            (previewScrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            (editorScrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            (editorContentRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }}
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: color.bgPage,
          }}
        >
          <div style={{
            maxWidth: 880,
            width: '100%',
            margin: '0 auto',
            paddingBottom: space[12],
            backgroundColor: color.bgSurface,
            minHeight: '100%',
            borderRadius: 0,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <ReportHeader
              settings={settings}
              patient={patient}
              date={formatReportDate(new Date())}
              onSettingsChange={(next) => {
                setSettings((s) => ({ ...s, ...next }));
                setSaved(false); setTimeout(() => setSaved(true), 1500);
              }}
              onPatientChange={(next) => {
                setPatient((p) => ({ ...p, ...next }));
                setSaved(false); setTimeout(() => setSaved(true), 1500);
              }}
              onLogoUpload={(url) => {
                setSettings((s) => ({ ...s, clinicLogoUrl: url }));
                setSaved(false); setTimeout(() => setSaved(true), 1500);
              }}
            />
            <div style={{ padding: `${space[5]} ${space[8]}`, flex: 1, display: 'flex', flexDirection: 'column' }}>
              {blocks.length === 0 ? (
                <EmptyStatePlaceholder />
              ) : (
                <BlockEditor
                  blocks={blocks}
                  onBlocksChange={handleBlocksChange}
                  activeBlockId={activeBlockId}
                  onBlockAdded={(id) => setActiveBlockId(id)}
                />
              )}
            </div>

            {/* Signature line — click to open the signature modal */}
            <div style={{
              padding: `${space[8]} ${space[8]} ${space[5]}`,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: space[6],
            }}>
              <div style={{ minWidth: 0, maxWidth: 360, width: '100%' }}>
                <button
                  type="button"
                  onClick={() => setSignatureOpen(true)}
                  aria-label={settings.signatureUrl ? 'Edit signature' : 'Add signature'}
                  style={{
                    width: '100%',
                    minHeight: 56,
                    display: 'flex',
                    alignItems: 'flex-end',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `1px solid ${color.textHeading}`,
                    padding: `0 0 ${space[2]}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {settings.signatureUrl ? (
                    <img src={settings.signatureUrl} alt="Doctor signature" style={{ maxHeight: 48, maxWidth: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: font.size.base, color: color.textPlaceholder }}>Click to sign</span>
                  )}
                </button>
                <div style={{ fontSize: font.size.sm, color: color.textSubtle, marginTop: space[2] }}>
                  {settings.doctorName || 'Doctor name'}
                </div>
              </div>
              <span style={{ fontSize: font.size.sm, color: color.textSubtle, flexShrink: 0 }}>
                Generated {formatReportDate(new Date())}
              </span>
            </div>

            {/* Powered-by footer */}
            <div style={{
              borderTop: `1px solid ${color.borderDefault}`,
              padding: `${space[5]} ${space[8]}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: space[2],
            }}>
              <span style={{ fontSize: font.size.xs, color: color.textPlaceholder, fontWeight: font.weight.medium }}>
                Powered by
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: space[5] }}>
                <IteroLogoSvg />
                <DentalFlowerLogo />
              </div>
            </div>
          </div>
        </main>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        reportName={settings.reportName}
        patientName={patient.patientName}
        doctorName={settings.doctorName}
        signatureUrl={settings.signatureUrl}
        signatureMethod={settings.signatureMethod}
        onSignatureChange={(url, method) => {
          setSettings((s) => ({ ...s, signatureUrl: url, signatureMethod: method }));
          setSaved(false); setTimeout(() => setSaved(true), 1500);
        }}
        pinEnabled={settings.pinEnabled}
        pin={settings.pin}
        onPinEnabledChange={(enabled) => {
          setSettings((s) => ({ ...s, pinEnabled: enabled, pin: enabled ? s.pin : '' }));
        }}
        onPinChange={(v) => { setSettings((s) => ({ ...s, pin: v })); }}
      />

      {/* Preview Modal */}
      {previewOpen && ReactDOM.createPortal(
        <ReportPreviewModal
          settings={settings}
          patient={patient}
          blocks={blocks}
          onClose={() => setPreviewOpen(false)}
          onShare={() => { setPreviewOpen(false); handleExportOrShare('share'); }}
          onExport={() => { setPreviewOpen(false); handleExportOrShare('export'); }}
        />,
        document.body
      )}

      <SignatureModal
        open={signatureOpen}
        onClose={() => { setSignatureOpen(false); setShareAfterSign(false); }}
        onSave={(url, method) => {
          setSettings((s) => ({ ...s, signatureUrl: url, signatureMethod: method }));
          setSaved(false); setTimeout(() => setSaved(true), 1500);
          notify.success('Signature saved');
          // If the user reached signing by trying to share, continue to Share.
          if (shareAfterSign) { setShareAfterSign(false); setShareOpen(true); }
        }}
      />

      {galleryOpen && ReactDOM.createPortal(
        <GalleryOverlayModal
          multiSelect
          onSelect={() => {}}
          onMultiSelect={(urls) => { handleAddImagesFromGallery(urls); setGalleryOpen(false); }}
          onClose={() => setGalleryOpen(false)}
        />,
        document.body
      )}

    </div>
    </>
  );
});

export default PatientReportPage;
