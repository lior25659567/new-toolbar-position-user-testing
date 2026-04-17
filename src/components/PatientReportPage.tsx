import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { color, font, space, radius, shadow, transition } from '../design-system/tokens';
import { SecondaryButton } from '../design-system/SecondaryButton';
import { PrimaryButton } from '../design-system/PrimaryButton';
import BlockEditor from './report/BlockEditor';
import ReportPreview from './report/ReportPreview';
import SignaturePanel from './report/SignaturePanel';
import type { ImageBlock, ComparisonBlock, CostSummaryBlock, NotesBlock, RxBlock, NextAppointmentBlock, PatientInstructionsBlock, PatientInfo, ReportSettings } from './report/types';
import { createImageBlock, REPORT_TEMPLATES } from './report/types';
import ShareModal from './report/ShareModal';
import PatientReportDemoPage from './report/PatientReportDemoPage';
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
        backgroundColor: color.neutral50,
        borderRadius: radius.md,
        fontSize: font.size.sm,
        lineHeight: '1',
        border: `1px solid ${focused ? color.primary : 'transparent'}`,
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
        <span style={{
          fontSize: font.size.sm,
          fontWeight: font.weight.semibold,
          color: color.textHeading,
        }}>
          {title}
        </span>
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      fontSize: font.size.xs,
      fontWeight: font.weight.medium,
      color: color.textLabel,
      display: 'block',
      marginBottom: space[1],
    }}>
      {children}
    </label>
  );
}

function SmallInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
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
        width: '100%',
        height: '32px',
        padding: `0 ${space[3]}`,
        fontSize: font.size.xs,
        fontFamily: font.family,
        color: color.textDefault,
        backgroundColor: color.white,
        border: `1px solid ${focused ? color.primary : color.borderDefault}`,
        borderRadius: radius.md,
        outline: 'none',
        boxShadow: focused ? shadow.focusPrimaryLight : 'none',
        transition: transition.input,
        boxSizing: 'border-box',
      }}
    />
  );
}

// ─── Template picker ─────────────────────────────────────────────────────────

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
        icon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="14" height="14" rx="2" />
            <line x1="10" y1="7" x2="10" y2="13" />
            <line x1="7" y1="10" x2="13" y2="10" />
          </svg>
        }
      />
      {REPORT_TEMPLATES.map((tpl) => {
        const supported = tpl.blocks
          .filter((b) => b.type === 'image' || b.type === 'comparison' || b.type === 'cost-summary')
          .map((b, i) => ({
            ...b,
            id: `tpl-block-${Date.now()}-${i}`,
          })) as SupportedBlock[];
        const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
          general: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="2" width="14" height="16" rx="2" />
              <line x1="7" y1="7" x2="13" y2="7" />
              <line x1="7" y1="10" x2="13" y2="10" />
              <line x1="7" y1="13" x2="10" y2="13" />
            </svg>
          ),
          implant: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v6" />
              <path d="M7 8h6l-1 8H8L7 8z" />
              <line x1="7.5" y1="11" x2="12.5" y2="11" />
              <line x1="8" y1="14" x2="12" y2="14" />
            </svg>
          ),
          crown: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14l2-8 4 4 4-4 2 8H4z" />
              <line x1="4" y1="14" x2="16" y2="14" />
              <rect x="4" y="14" width="12" height="3" rx="1" />
            </svg>
          ),
          followup: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="7" />
              <polyline points="10,6 10,10 13,12" />
            </svg>
          ),
        };
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
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: space[1],
        padding: space[3],
        backgroundColor: isSelected ? '#E0F2FE' : hovered ? color.bgHover : color.white,
        border: `${isSelected ? '2px' : '1px'} solid ${isSelected ? color.primary : hovered ? color.borderHover : color.borderDefault}`,
        borderRadius: radius.md,
        cursor: 'pointer',
        textAlign: 'left',
        transition: `all ${transition.fast}`,
        position: 'relative',
      }}
    >
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: color.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={color.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6.5L5 9.5l5-7" />
          </svg>
        </div>
      )}
      {icon && <div style={{ color: isSelected ? color.primary : color.neutral400 }}>{icon}</div>}
      <span style={{
        fontSize: font.size.xs,
        fontWeight: font.weight.semibold,
        color: isSelected ? color.primary : color.textDefault,
      }}>
        {name}
      </span>
      <span style={{ fontSize: '11px', color: color.textSubtle, lineHeight: '1.3' }}>{description}</span>
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

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 200 }}
      />

      {/* Modal */}
      <div style={{
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
          backgroundColor: '#323639',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: space[3] }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#fff', cursor: 'pointer', padding: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
              </svg>
            </button>
            <span style={{ fontSize: font.size.base, fontWeight: font.weight.semibold, color: '#fff' }}>
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
                backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff',
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
                backgroundColor: color.primary, color: '#fff',
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
          backgroundColor: '#525659',
          display: 'flex',
          justifyContent: 'center',
          padding: `${space[8]} ${space[4]}`,
        }}>
          {/* A4 paper page */}
          <div style={{
            width: '794px',
            minHeight: '1123px',
            maxWidth: '95vw',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px 2px rgba(0,0,0,0.3)',
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
    reportName: 'Patient Report',
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
  const [signatureWarning, setSignatureWarning] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(true);
  const [demoOpen, setDemoOpen] = useState(false);
  const signatureRef = useRef<HTMLDivElement>(null);
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
  }));

  // Clear warning when signature is added
  useEffect(() => {
    if (settings.signatureUrl && signatureWarning) setSignatureWarning(false);
  }, [settings.signatureUrl, signatureWarning]);

  const [shareOpen, setShareOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleExportOrShare = (action: 'share' | 'export') => {
    if (!settings.signatureUrl) {
      setActiveTab('settings');
      setSignatureWarning(true);
      setTimeout(() => {
        signatureRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    if (action === 'share') {
      setShareOpen(true);
    } else {
      alert('Exporting PDF...');
    }
  };

  // Mark unsaved on any change
  const handleBlocksChange = (newBlocks: SupportedBlock[]) => {
    setBlocks(newBlocks);
    setSaved(false);
    setTimeout(() => setSaved(true), 1500);
  };

  const handleTemplateSelect = (templateBlocks: SupportedBlock[], templateName: string, templateId: string) => {
    setBlocksBeforeTemplate(blocks);
    setAppliedTemplate(templateName);
    setSelectedTemplateId(templateId);
    setBlocks(templateBlocks);
    setTemplatesOpen(false);
    setSaved(false);
    setTimeout(() => setSaved(true), 1500);
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
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: color.bgPage,
      fontFamily: font.family,
    }}>
      {/* ── Sticky Header ── */}
      <div style={{
        height: '56px',
        backgroundColor: color.bgSurface,
        borderBottom: `1px solid ${color.borderDefault}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${space[5]}`,
        flexShrink: 0,
        zIndex: 10,
      }}>
        {/* Left: back + report name + metadata chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: space[3], flex: 1, minWidth: 0 }}>
          <button
            type="button"
            onClick={onBackToHome}
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

          <div style={{ width: '1px', height: '24px', backgroundColor: color.borderDefault, flexShrink: 0 }} />

          <InlineInput
            value={settings.reportName}
            onChange={(v) => { setSettings((s) => ({ ...s, reportName: v })); setSaved(false); setTimeout(() => setSaved(true), 1500); }}
            placeholder="Report name"
          />

          <div style={{ display: 'flex', gap: space[2], alignItems: 'center', flexShrink: 0 }}>
            <MetaChip
              label="Doctor"
              value={settings.doctorName}
              placeholder="Doctor name"
              onChange={(v) => { setSettings((s) => ({ ...s, doctorName: v })); setSaved(false); setTimeout(() => setSaved(true), 1500); }}
            />
            <MetaChip
              label="Clinic"
              value={settings.clinicName}
              placeholder="Clinic name"
              onChange={(v) => { setSettings((s) => ({ ...s, clinicName: v })); setSaved(false); setTimeout(() => setSaved(true), 1500); }}
            />
            <MetaChip
              label="Patient"
              value={patient.patientName}
              placeholder="Patient name"
              onChange={(v) => setPatient((p) => ({ ...p, patientName: v }))}
            />
          </div>
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
          <SecondaryButton size={36} onClick={() => handleExportOrShare('share')}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7.5v4a1 1 0 001 1h4a1 1 0 001-1v-4" />
              <polyline points="3,5 7,1 11,5" />
              <line x1="7" y1="1" x2="7" y2="9" />
            </svg>
            Share
          </SecondaryButton>

          {/* Export PDF */}
          <PrimaryButton size={36} onClick={() => handleExportOrShare('export')}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 1v8M3 6l4 4 4-4" />
              <path d="M1 11v1a1 1 0 001 1h10a1 1 0 001-1v-1" />
            </svg>
            Export PDF
          </PrimaryButton>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left: Editor Panel ── */}
        <div ref={editorScrollRef} style={{
          width: '480px',
          minWidth: '420px',
          maxWidth: '560px',
          overflowY: 'auto',
          borderRight: `1px solid ${color.borderDefault}`,
          backgroundColor: color.white,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Tab bar */}
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${color.borderDefault}`,
            backgroundColor: color.bgSurface,
            flexShrink: 0,
          }}>
            {(['blocks', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: `${space[3]} 0`,
                  fontSize: font.size.xs,
                  fontWeight: font.weight.semibold,
                  color: activeTab === tab ? color.primary : color.textSubtle,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${activeTab === tab ? color.primary : 'transparent'}`,
                  cursor: 'pointer',
                  letterSpacing: font.tracking.tight,
                  transition: `color ${transition.fast}, border-color ${transition.fast}`,
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: space[1],
                }}
              >
                {tab === 'blocks' ? 'Report' : 'Details'}
                {tab === 'settings' && signatureWarning && !settings.signatureUrl && (
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#F59E0B',
                    display: 'inline-block',
                    flexShrink: 0,
                    marginLeft: '4px',
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div ref={editorContentRef} style={{ flex: 1, overflowY: 'auto', padding: space[4] }}>
            {activeTab === 'blocks' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: space[4] }}>
                {/* Templates */}
                <SidebarSection
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: space[2], flex: 1 }}>
                      <span>{appliedTemplate || 'Templates'}</span>
                      {appliedTemplate && blocksBeforeTemplate && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleUndoTemplate(); }}
                          style={{
                            fontSize: font.size.xs, fontWeight: font.weight.semibold,
                            color: color.primary, backgroundColor: 'transparent',
                            border: 'none', cursor: 'pointer', padding: `2px ${space[2]}`,
                            borderRadius: radius.sm, transition: `background-color ${transition.fast}`,
                            marginLeft: 'auto',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E0F2FE')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          Undo
                        </button>
                      )}
                    </div>
                  }
                  isOpen={templatesOpen}
                  onToggle={setTemplatesOpen}
                >
                  <TemplatePicker onSelect={handleTemplateSelect} selectedId={selectedTemplateId} />
                </SidebarSection>

                {/* Content count */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: color.textHeading }}>
                    Content
                  </span>
                  <span style={{ fontSize: font.size.xs, color: color.textPlaceholder }}>
                    {blocks.length} section{blocks.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <BlockEditor
                  blocks={blocks}
                  onBlocksChange={handleBlocksChange}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: space[4] }}>
                {/* Report & Patient */}
                <SidebarSection title="Report">
                  <SmallInput
                    value={settings.reportName}
                    onChange={(v) => { setSettings((s) => ({ ...s, reportName: v })); setSaved(false); setTimeout(() => setSaved(true), 1500); }}
                    placeholder="Report name"
                  />
                </SidebarSection>

                <SidebarSection title="Doctor">
                  <SmallInput
                    value={settings.doctorName}
                    onChange={(v) => { setSettings((s) => ({ ...s, doctorName: v })); setSaved(false); setTimeout(() => setSaved(true), 1500); }}
                    placeholder="Doctor name"
                  />
                  <div>
                    {settings.doctorImageUrl ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: space[3],
                        padding: space[3],
                        backgroundColor: color.neutral50,
                        borderRadius: radius.md,
                        border: `1px solid ${color.borderDefault}`,
                      }}>
                        <img
                          src={settings.doctorImageUrl}
                          alt="Doctor"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: `1px solid ${color.borderDefault}`,
                          }}
                        />
                        <span style={{ flex: 1, fontSize: font.size.xs, color: color.textSubtle, fontWeight: font.weight.medium }}>
                          Doctor photo
                        </span>
                        <button
                          type="button"
                          onClick={() => { setSettings((s) => ({ ...s, doctorImageUrl: '' })); setSaved(false); setTimeout(() => setSaved(true), 1500); }}
                          style={{
                            fontSize: font.size.xs,
                            color: color.error,
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: `${space[1]} ${space[2]}`,
                            borderRadius: radius.sm,
                            fontWeight: font.weight.medium,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: space[3],
                        padding: `${space[3]} ${space[3]}`,
                        backgroundColor: color.neutral50,
                        borderRadius: radius.md,
                        border: `1.5px dashed ${color.neutral300}`,
                        cursor: 'pointer',
                        transition: `border-color ${transition.fast}, background-color ${transition.fast}`,
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = color.primary; e.currentTarget.style.backgroundColor = '#F0F9FF'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = color.neutral300; e.currentTarget.style.backgroundColor = color.neutral50; }}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: color.neutral100,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color.neutral400} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <div>
                          <div style={{ fontSize: font.size.xs, fontWeight: font.weight.medium, color: color.textSubtle }}>
                            Upload doctor photo
                          </div>
                          <div style={{ fontSize: '10px', color: color.textPlaceholder }}>
                            PNG or JPG
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/png,image/jpeg"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setSettings((s) => ({ ...s, doctorImageUrl: url }));
                              setSaved(false);
                              setTimeout(() => setSaved(true), 1500);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </SidebarSection>

                <SidebarSection title="Clinic">
                  <SmallInput
                    value={settings.clinicName}
                    onChange={(v) => { setSettings((s) => ({ ...s, clinicName: v })); setSaved(false); setTimeout(() => setSaved(true), 1500); }}
                    placeholder="Clinic name"
                  />
                  <div>
                    {settings.clinicLogoUrl ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: space[3],
                        padding: space[3],
                        backgroundColor: color.neutral50,
                        borderRadius: radius.md,
                        border: `1px solid ${color.borderDefault}`,
                      }}>
                        <img
                          src={settings.clinicLogoUrl}
                          alt="Clinic logo"
                          style={{
                            height: '36px',
                            maxWidth: '120px',
                            objectFit: 'contain',
                            borderRadius: radius.sm,
                          }}
                        />
                        <div style={{ flex: 1 }} />
                        <button
                          type="button"
                          onClick={() => { setSettings((s) => ({ ...s, clinicLogoUrl: '' })); setSaved(false); setTimeout(() => setSaved(true), 1500); }}
                          style={{
                            fontSize: font.size.xs,
                            color: color.error,
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: `${space[1]} ${space[2]}`,
                            borderRadius: radius.sm,
                            fontWeight: font.weight.medium,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: space[2],
                        padding: `${space[4]} ${space[3]}`,
                        backgroundColor: color.neutral50,
                        borderRadius: radius.md,
                        border: `1.5px dashed ${color.neutral300}`,
                        cursor: 'pointer',
                        transition: `border-color ${transition.fast}, background-color ${transition.fast}`,
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = color.primary; e.currentTarget.style.backgroundColor = '#F0F9FF'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = color.neutral300; e.currentTarget.style.backgroundColor = color.neutral50; }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color.neutral400} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="3" />
                          <circle cx="8.5" cy="10.5" r="2" />
                          <path d="M5 20l5-6 3 3 4-5 4 4" />
                        </svg>
                        <span style={{ fontSize: font.size.xs, fontWeight: font.weight.medium, color: color.textSubtle }}>
                          Upload logo
                        </span>
                        <span style={{ fontSize: '10px', color: color.textPlaceholder }}>
                          PNG, JPG, or SVG
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setSettings((s) => ({ ...s, clinicLogoUrl: url }));
                              setSaved(false);
                              setTimeout(() => setSaved(true), 1500);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </SidebarSection>

                <SidebarSection title="Patient">
                  <SmallInput
                    value={patient.patientName}
                    onChange={(v) => setPatient((p) => ({ ...p, patientName: v }))}
                    placeholder="Patient name"
                  />
                </SidebarSection>

                {/* Signature */}
                <div ref={signatureRef}>
                  <SidebarSection title="Add Signature">
                    {signatureWarning && !settings.signatureUrl && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: space[2],
                        padding: `${space[2]} ${space[3]}`,
                        backgroundColor: '#FFF7ED',
                        border: `1px solid #FED7AA`,
                        borderRadius: radius.md,
                        marginBottom: space[2],
                      }}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <circle cx="8" cy="8" r="7" />
                          <path d="M8 5v3" />
                          <path d="M8 10.5h.01" />
                        </svg>
                        <span style={{ fontSize: font.size.xs, color: '#92400E', lineHeight: '1.3' }}>
                          Add your signature to share or export
                        </span>
                      </div>
                    )}
                    <SignaturePanel
                      signatureUrl={settings.signatureUrl}
                      signatureMethod={settings.signatureMethod}
                      onSignatureChange={(url, method) => {
                        setSettings((s) => ({ ...s, signatureUrl: url, signatureMethod: method }));
                        setSaved(false);
                        setTimeout(() => setSaved(true), 1500);
                      }}
                    />
                  </SidebarSection>
                </div>

                <SidebarSection title="Security" defaultOpen={false}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: font.size.xs, color: color.textDefault }}>
                      PIN Protection
                    </span>
                    <button
                      type="button"
                      onClick={() => setSettings((s) => ({ ...s, pinEnabled: !s.pinEnabled, pin: s.pinEnabled ? '' : s.pin }))}
                      style={{
                        width: '36px',
                        height: '20px',
                        borderRadius: radius.full,
                        border: 'none',
                        backgroundColor: settings.pinEnabled ? color.primary : color.neutral300,
                        cursor: 'pointer',
                        position: 'relative',
                        transition: `background-color ${transition.fast}`,
                        padding: 0,
                      }}
                    >
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: color.white,
                        position: 'absolute',
                        top: '2px',
                        left: settings.pinEnabled ? '18px' : '2px',
                        transition: `left ${transition.fast}`,
                        boxShadow: shadow.sm,
                      }} />
                    </button>
                  </div>
                  {settings.pinEnabled && (
                    <div>
                      <FieldLabel>Numeric PIN</FieldLabel>
                      <SmallInput
                        value={settings.pin}
                        onChange={(v) => {
                          const numeric = v.replace(/[^0-9]/g, '').slice(0, 6);
                          setSettings((s) => ({ ...s, pin: numeric }));
                        }}
                        placeholder="4-6 digit PIN"
                      />
                      <span style={{ fontSize: '11px', color: color.textPlaceholder, marginTop: space[1], display: 'block' }}>
                        Recipients will need this PIN to view the report
                      </span>
                    </div>
                  )}
                </SidebarSection>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Live Preview ── */}
        <div ref={previewScrollRef} style={{
          flex: 1,
          overflowY: 'auto',
          padding: space[6],
          backgroundColor: color.neutral100,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <ReportPreview
            settings={settings}
            patient={patient}
            blocks={blocks}
          />
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        reportName={settings.reportName}
        patientName={patient.patientName}
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

      {demoOpen && <PatientReportDemoPage onClose={() => setDemoOpen(false)} />}
    </div>
  );
});

export default PatientReportPage;
