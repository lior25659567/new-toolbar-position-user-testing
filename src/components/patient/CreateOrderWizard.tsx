import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  PrimaryButton,
  SecondaryButton,
  LinkButton,
  IconButton,
  Icon,
  DropdownList,
  TextArea,
  Tag,
  Notification,
  Avatar,
  Stepper,
} from '../../design-system';
import { zIndex } from '../../design-system/tokens';
import { LAB_DESTINATIONS, UPPER_TEETH, LOWER_TEETH } from '../../info/constants';
import { QRCodePreview } from '../shared/QRCodePreview';
import { Tooth } from '../../info/components/ToothChart/Tooth';
import nightguardImageUrl from '../../assets/nightguard.png';
import {
  EMPTY_DRAFT,
  IMPLANT_MANUFACTURERS,
  PRODUCT_LINES_BY_MANUFACTURER,
  PROCEDURE_TYPES_BY_SERVICE,
  SERVICES,
  SERVICE_BY_ID,
  SUPPORT_TYPES,
  RESTORATION_MATERIALS,
  SHADE_SYSTEMS,
  SHADE_VALUES_VITA_CLASSICAL,
  SHADE_VALUES_BLEACH,
  MARGIN_DESIGNS,
  MARGIN_LOCATIONS,
  OCCLUSAL_SCHEMES,
  ANTAGONIST_TYPES,
  CONTACT_TIGHTNESS,
  CEMENT_TYPES,
  ALIGNER_PACKAGES,
  TREATMENT_GOALS,
  ANGLE_CLASSES,
  AP_STRATEGIES,
  ABUTMENT_MATERIALS,
  RETENTION_METHODS,
  LOADING_PROTOCOLS,
  RESTORATION_PLANS,
  MEDICAL_FLAGS,
  GUIDE_TYPES,
  TEMP_DURATIONS,
  TEMP_MATERIALS,
  SPLINT_SERVICE_TYPES,
  SPLINT_BORDERS,
  SPLINT_SURFACES,
  SPLINT_CONTACTS,
  DENTURE_STAGES,
  DENTURE_TYPES,
  PARTIAL_DENTURE_TYPES,
  DENTURE_GINGIVA_SHADES,
  DENTURE_OCCLUSION_GUIDANCE,
  DENTURE_TOOTH_AESTHETICS,
  DENTURE_MEASUREMENTS,
  TEMP_SPACER_RADIAL,
  TEMP_SPACER_OCCLUSAL,
  TEMP_VENEER_SPACER,
  TEMP_APPROXIMAL_CONTACT,
  TEMP_OCCLUSAL_CONTACT,
  TEMP_PRODUCTION_UNITS,
  TEMP_CROWN_MATERIAL_CLASSES,
  SCAN_BODY_TYPES,
  DENTURE_MATERIALS,
  TOOTH_MOLDS,
  GINGIVAL_SHADES,
  DENTURE_OCCLUSAL_SCHEMES,
  ATTACHMENT_SYSTEMS,
  KENNEDY_CLASSES,
  FRAMEWORK_MATERIALS,
  MAJOR_CONNECTORS,
  MODEL_TYPES,
  MODEL_MATERIALS,
  BASE_DESIGNS,
  RUSH_OPTIONS,
  SERVICE_LEAD_TIME_DAYS,
  SERVICE_COST_USD,
  CLASP_DESIGNS,
  AI_SUGGESTIONS_BY_SERVICE,
  applyAiSuggestions,
  getRelevantSteps,
  validateStep,
  type AiSuggestion,
  type OrderDraft,
  type PatientOrder,
  type ServiceId,
  type StepId,
  type SupportType,
  type RushOption,
  type OrderTemplate,
} from './orderConstants';

interface CreateOrderWizardProps {
  open: boolean;
  onClose: () => void;
  onSubmitted: (order: PatientOrder) => void;
  patientName: string;
  /** Optional pre-filled draft (used by 'Duplicate' on existing orders). */
  initialDraft?: OrderDraft;
  /** User preference: whether AI autofill is globally enabled. */
  aiEnabled?: boolean;
  onToggleAiEnabled?: (next: boolean) => void;
  templates?: OrderTemplate[];
  onSaveTemplate?: (tpl: OrderTemplate) => void;
}

export function CreateOrderWizard({
  open,
  onClose,
  onSubmitted,
  patientName,
  initialDraft,
  aiEnabled = true,
  onToggleAiEnabled,
  templates,
  onSaveTemplate,
}: CreateOrderWizardProps) {
  const [draft, setDraft] = useState<OrderDraft>(initialDraft ?? EMPTY_DRAFT);
  const [stepIdx, setStepIdx] = useState(0);
  const [showError, setShowError] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);

  // ─── AI autofill state ────────────────────────────────────────────
  /** Fields whose current value came from AI (not user input). */
  const [aiOriginated, setAiOriginated] = useState<Set<string>>(new Set());
  /** Fields the user explicitly dismissed — won't be re-suggested this order. */
  const [aiDismissed, setAiDismissed] = useState<Set<string>>(new Set());
  /** Session-level: hide AI for this order entirely. */
  const [aiHiddenForOrder, setAiHiddenForOrder] = useState(false);

  const relevantSteps = useMemo(() => getRelevantSteps(draft.service), [draft.service]);
  const currentStep = relevantSteps[stepIdx];
  const isLast = stepIdx === relevantSteps.length - 1;
  const isFirst = stepIdx === 0;

  // Reset wizard whenever it reopens (using initialDraft if provided).
  useEffect(() => {
    if (open) {
      setDraft(initialDraft ?? EMPTY_DRAFT);
      setStepIdx(0);
      setShowError(false);
      setQrOpen(false);
      setSavedAt(null);
      setCloseConfirmOpen(false);
      setAiOriginated(new Set());
      setAiDismissed(new Set());
      setAiHiddenForOrder(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ─── AI: apply suggestions when service changes (or AI re-enabled). ───
  // Only fills fields the user hasn't dismissed AND that are still empty.
  useEffect(() => {
    if (!open) return;
    if (!aiEnabled || aiHiddenForOrder) return;
    if (!draft.service) return;
    const suggestions = AI_SUGGESTIONS_BY_SERVICE[draft.service] ?? [];
    if (suggestions.length === 0) return;
    setDraft((d) => {
      const { draft: next, appliedFields } = applyAiSuggestions(d, suggestions, aiDismissed);
      if (appliedFields.size === 0) return d;
      setAiOriginated((prev) => {
        const merged = new Set(prev);
        appliedFields.forEach((f) => merged.add(f));
        return merged;
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.service, aiEnabled, aiHiddenForOrder]);

  /** Active AI suggestions for the current service (filtered). */
  const activeAiSuggestions = useMemo<AiSuggestion[]>(() => {
    if (!aiEnabled || aiHiddenForOrder || !draft.service) return [];
    const all = AI_SUGGESTIONS_BY_SERVICE[draft.service] ?? [];
    return all.filter((s) => !aiDismissed.has(s.field as string));
  }, [aiEnabled, aiHiddenForOrder, draft.service, aiDismissed]);

  /** Reason lookup keyed by field. */
  const aiReasonByField = useMemo<Record<string, AiSuggestion>>(() => {
    return Object.fromEntries(activeAiSuggestions.map((s) => [s.field as string, s]));
  }, [activeAiSuggestions]);

  // Autosave pulse: any time the draft changes, mark "saved" after a short debounce.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setSavedAt(Date.now()), 600);
    return () => window.clearTimeout(t);
  }, [draft, open]);

  // Has the user touched the form? Used to gate the close-confirm prompt.
  const isDirty = useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(initialDraft ?? EMPTY_DRAFT);
  }, [draft, initialDraft]);

  const handleCloseRequest = () => {
    if (isDirty) setCloseConfirmOpen(true);
    else onClose();
  };

  // Clamp stepIdx if relevant steps shrink (e.g., user picks a non-implant service).
  useEffect(() => {
    if (stepIdx >= relevantSteps.length) {
      setStepIdx(Math.max(0, relevantSteps.length - 1));
    }
  }, [relevantSteps.length, stepIdx]);

  const validation = currentStep ? validateStep(currentStep.id, draft) : { ok: true };

  const updateDraft = (patch: Partial<OrderDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setShowError(false);
    // Any field the user touches stops being "AI-originated".
    if (Object.keys(patch).length > 0) {
      setAiOriginated((prev) => {
        if (prev.size === 0) return prev;
        const next = new Set(prev);
        let changed = false;
        for (const k of Object.keys(patch)) {
          if (next.delete(k)) changed = true;
        }
        return changed ? next : prev;
      });
    }
  };

  /** Dismiss the AI suggestion for one field — clears value + marks dismissed. */
  const dismissAiField = (field: keyof OrderDraft) => {
    const empty = EMPTY_DRAFT[field];
    setDraft((d) => ({ ...d, [field]: empty } as OrderDraft));
    setAiOriginated((prev) => {
      const next = new Set(prev);
      next.delete(field as string);
      return next;
    });
    setAiDismissed((prev) => new Set(prev).add(field as string));
  };

  /** Dismiss every AI-originated field this order (sticky banner action). */
  const dismissAllAi = () => {
    if (aiOriginated.size === 0) return;
    const dismissed = new Set(aiDismissed);
    setDraft((d) => {
      const next = { ...d } as OrderDraft;
      for (const f of aiOriginated) {
        const k = f as keyof OrderDraft;
        (next as Record<string, unknown>)[f] = EMPTY_DRAFT[k];
        dismissed.add(f);
      }
      return next;
    });
    setAiOriginated(new Set());
    setAiDismissed(dismissed);
  };

  /** Accept all AI suggestions in one click — just clears the AI-origin marker so the user has "owned" them. */
  const acceptAllAi = () => {
    setAiOriginated(new Set());
  };

  const goToStep = (id: StepId) => {
    const idx = relevantSteps.findIndex((s) => s.id === id);
    if (idx >= 0) {
      setStepIdx(idx);
      setShowError(false);
    }
  };

  const handleNext = () => {
    if (!validation.ok) {
      setShowError(true);
      return;
    }
    if (isLast) {
      handleSubmit('submitted');
    } else {
      setStepIdx((i) => i + 1);
      setShowError(false);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setStepIdx((i) => i - 1);
      setShowError(false);
    }
  };

  const handleSubmit = (status: 'draft' | 'submitted') => {
    const service = draft.service;
    if (!service) return;
    const def = SERVICE_BY_ID[service];
    const procedureLabel = draft.procedureType
      ? PROCEDURE_TYPES_BY_SERVICE[service].find((p) => p.value === draft.procedureType)?.label
      : undefined;
    const nowISO = new Date().toISOString();
    const eta = computeEtaDate(service, draft.rush);
    const isSubmitted = status === 'submitted';
    const activity: ActivityEvent[] = isSubmitted
      ? [
          {
            id: `a-${Date.now().toString(36)}`,
            timestamp: nowISO,
            actor: 'Dr. A. Whitaker',
            kind: 'submit',
            message: `Order submitted${draft.provider ? ` to ${LAB_DESTINATIONS.find((l) => l.value === draft.provider)?.label}` : ''}.`,
          },
          {
            id: `a-${Date.now().toString(36)}-r`,
            timestamp: nowISO,
            actor: 'System',
            kind: 'stage',
            stage: 'received',
            message: 'Stage: Received.',
          },
        ]
      : [];
    const newOrder: PatientOrder = {
      id: `po-${Date.now().toString(36)}`,
      service: def.name,
      category: def.category,
      status,
      productionStage: isSubmitted ? 'received' : undefined,
      createdDate: nowISO.slice(0, 10),
      dueDate: draft.dueDate || undefined,
      estimatedDeliveryDate: isSubmitted ? eta : undefined,
      provider: draft.provider
        ? LAB_DESTINATIONS.find((l) => l.value === draft.provider)?.label
        : undefined,
      orderedBy: 'Dr. A. Whitaker',
      procedureType: procedureLabel,
      teeth: draft.teeth,
      manufacturer: draft.manufacturer
        ? IMPLANT_MANUFACTURERS.find((m) => m.value === draft.manufacturer)?.label
        : undefined,
      productLine: draft.productLine
        ? PRODUCT_LINES_BY_MANUFACTURER[draft.manufacturer ?? '']?.find((p) => p.value === draft.productLine)?.label
        : undefined,
      supportType: draft.supportType,
      notes: draft.notes || undefined,
      details: snapshotServiceDetails(draft),
      activity,
      thread: [],
      files: [
        ...(draft.cbctFileName ? [{ kind: 'cbct' as const, name: draft.cbctFileName }] : []),
        ...(draft.prosthesisFileName ? [{ kind: 'prosthesis' as const, name: draft.prosthesisFileName }] : []),
      ],
    };
    onSubmitted(newOrder);
    onClose();
  };

  const nextLabel = isLast ? 'Submit order' : 'Next';

  // Keyboard shortcuts: Esc → close confirm; Cmd/Ctrl+S → save draft; Cmd/Ctrl+Enter → next/submit.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseRequest();
        return;
      }
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (draft.service) handleSubmit('draft');
        return;
      }
      if (meta && e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, draft, stepIdx, validation.ok, isLast, isDirty]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Create order"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--ads-bg-page)',
        zIndex: zIndex.modal,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--ads-font-sans)',
      }}
    >
      {/* ─── Header (sticky) ─── */}
      <OrderWizardHeader
        steps={relevantSteps}
        currentIdx={stepIdx}
        onClose={handleCloseRequest}
        savedAt={savedAt}
      />

      {/* ─── Body (scrollable) ─── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            padding: '24px 16px 32px',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 340px',
            gap: 24,
            alignItems: 'start',
          }}
        >
          {/* Step content card */}
          <section
            style={{
              backgroundColor: 'var(--ads-bg-surface)',
              borderRadius: 'var(--ads-radius-sm)',
              border: '1px solid var(--ads-border-subtle)',
              padding: '24px 28px 28px',
              minWidth: 0,
              boxShadow: 'var(--ads-shadow-sm)',
              animation: 'ads-fade-in var(--ads-duration-base) var(--ads-ease-standard)',
            }}
            key={currentStep?.id}
          >
            <StepHeader title={currentStep?.label ?? ''} />

            <div style={{ marginTop: 20 }}>
              {currentStep?.id === 'service' && (
                <ServiceStep
                  value={draft.service}
                  templates={[]}
                  onApplyTemplate={(tpl) => {
                    setDraft(applyTemplate(tpl));
                    setStepIdx(1);
                  }}
                  onSelect={(id) => {
                    updateDraft({
                      service: id,
                      procedureType: null,
                      manufacturer: null,
                      productLine: null,
                      supportType: null,
                      teeth: [],
                    });
                  }}
                />
              )}

              {currentStep?.id === 'details' && (
                <ServiceDetailsStep draft={draft} updateDraft={updateDraft} showError={showError} />
              )}

              {currentStep?.id === 'files' && (
                <FilesStep
                  draft={draft}
                  updateDraft={updateDraft}
                  onMobileUpload={() => setQrOpen(true)}
                />
              )}

              {currentStep?.id === 'summary' && (
                <ReviewStep draft={draft} patientName={patientName} onJump={goToStep} />
              )}
            </div>

            {showError && !validation.ok && validation.message && (
              <div style={{ marginTop: 16 }}>
                <Notification type="error" title="Missing required fields">{validation.message}</Notification>
              </div>
            )}
          </section>

          {/* Order summary */}
          <OrderSummary
            draft={draft}
            updateDraft={updateDraft}
            patientName={patientName}
            relevantSteps={relevantSteps}
            currentStepId={currentStep?.id}
            onJump={goToStep}
          />
        </div>
      </div>

      {/* ─── Footer (sticky) ─── */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: 'var(--ads-bg-surface)',
          borderTop: '1px solid var(--ads-border-subtle)',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <SecondaryButton size={36} onClick={handleBack} disabled={isFirst}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="chevron-left" size={16} />
            Back
          </span>
        </SecondaryButton>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <PrimaryButton size={36} onClick={handleNext}>
            {nextLabel}
            {!isLast && (
              <span style={{ display: 'inline-flex', marginLeft: 6, transform: 'rotate(180deg)' }}>
                <Icon name="chevron-left" size={16} />
              </span>
            )}
          </PrimaryButton>
        </div>
      </div>

      {/* Inline keyframes for the fade-in animation */}
      <style>{`
        @keyframes ads-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ads-saved-pulse { 0% { opacity: 0; transform: scale(0.95); } 30% { opacity: 1; transform: scale(1); } 100% { opacity: 0.55; transform: scale(1); } }
      `}</style>

      {/* QR modal — nested */}
      {qrOpen && (
        <Modal open={qrOpen} onClose={() => setQrOpen(false)} title="Upload from mobile" width={420}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 0' }}>
            <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: 13, color: 'var(--ads-text-muted)' }}>
              Scan this QR with your phone camera to securely upload files to this order. The session expires in 5:00.
            </p>
            <QRCodePreview link={`https://upload.itero.com/session/${Date.now().toString(36)}`} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Tag color="blue" size="small" icon={<TimerIconSmall />}>5:00 remaining</Tag>
              <LinkButton size={36} onClick={() => setQrOpen(false)}>Done</LinkButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Close-confirm modal */}
      {closeConfirmOpen && (
        <Modal
          open={closeConfirmOpen}
          onClose={() => setCloseConfirmOpen(false)}
          title="Save before closing?"
          width={440}
          footer={
            <>
              <SecondaryButton size={36} onClick={() => { setCloseConfirmOpen(false); onClose(); }}>
                Discard changes
              </SecondaryButton>
              <PrimaryButton size={36} onClick={() => { handleSubmit('draft'); setCloseConfirmOpen(false); }}>
                Save draft & close
              </PrimaryButton>
            </>
          }
        >
          <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: 14, color: 'var(--ads-text-primary)' }}>
            You have unsaved changes. Save the order as a draft so you can come back to it, or discard.
          </p>
        </Modal>
      )}

      {/* Save-as-template modal */}
      {saveTemplateOpen && draft.service && onSaveTemplate && (
        <SaveTemplateModal
          draft={draft}
          onCancel={() => setSaveTemplateOpen(false)}
          onSave={(tpl) => {
            onSaveTemplate(tpl);
            setSaveTemplateOpen(false);
          }}
        />
      )}
    </div>
  );
}

/* ─── Saved-pulse indicator ─── */

function SavedPulse({ savedAt }: { savedAt: number | null }) {
  if (!savedAt) return null;
  return (
    <span
      key={savedAt}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        marginLeft: 8,
        padding: '2px 8px',
        borderRadius: 'var(--ads-radius-pill)',
        backgroundColor: 'color-mix(in srgb, var(--ads-success-500) 12%, transparent)',
        color: 'var(--ads-success-500)',
        fontSize: 11,
        fontWeight: 500,
        fontFamily: 'var(--ads-font-sans)',
        animation: 'ads-saved-pulse 1.6s var(--ads-ease-standard) forwards',
      }}
    >
      <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 7l3 4 7-8" />
      </svg>
      Saved
    </span>
  );
}

/* ─── Save-as-template modal ─── */

function SaveTemplateModal({
  draft,
  onCancel,
  onSave,
}: {
  draft: OrderDraft;
  onCancel: () => void;
  onSave: (tpl: OrderTemplate) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const canSave = name.trim().length > 0 && !!draft.service;
  return (
    <Modal
      open
      onClose={onCancel}
      title="Save as template"
      width={460}
      footer={
        <>
          <SecondaryButton size={36} onClick={onCancel}>Cancel</SecondaryButton>
          <PrimaryButton
            size={36}
            disabled={!canSave}
            onClick={() => {
              if (!canSave) return;
              const { service, ...rest } = draft;
              const prefill: Partial<OrderDraft> = Object.fromEntries(
                Object.entries(rest).filter(([_, v]) => {
                  if (v === null || v === '' || v === false) return false;
                  if (Array.isArray(v) && v.length === 0) return false;
                  if (typeof v === 'object' && Object.keys(v).length === 0) return false;
                  return true;
                }),
              );
              onSave({
                id: `tpl-${Date.now().toString(36)}`,
                name: name.trim(),
                description: description.trim(),
                source: 'personal',
                service: service!,
                prefill,
              });
            }}
          >
            Save template
          </PrimaryButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 0', fontFamily: 'var(--ads-font-sans)' }}>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--ads-text-muted)' }}>
          Saves the current selections (excluding patient + tooth selection) as a personal template you can apply to future orders.
        </p>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--ads-text-label)' }}>
          <span>Template name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My standard zirconia crown"
            autoFocus
            style={{
              height: 36,
              padding: '0 12px',
              border: '1px solid var(--ads-border-default)',
              borderRadius: 'var(--ads-radius-sm)',
              fontFamily: 'inherit',
              fontSize: 14,
            }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--ads-text-label)' }}>
          <span>Description (optional)</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Posterior, A2, chamfer, RMGI"
            style={{
              height: 36,
              padding: '0 12px',
              border: '1px solid var(--ads-border-default)',
              borderRadius: 'var(--ads-radius-sm)',
              fontFamily: 'inherit',
              fontSize: 14,
            }}
          />
        </label>
      </div>
    </Modal>
  );
}

/* ─── Helpers (eta + service-detail snapshot) ─── */

function computeEtaDate(service: ServiceId, rush: RushOption): string {
  const baseDays = SERVICE_LEAD_TIME_DAYS[service];
  const days = rush === 'super-rush' ? 1 : rush === 'rush' ? Math.max(1, baseDays - 2) : baseDays;
  const eta = new Date();
  eta.setDate(eta.getDate() + days);
  return eta.toISOString().slice(0, 10);
}

function snapshotServiceDetails(draft: OrderDraft): Record<string, string | number | string[] | boolean | null> {
  const out: Record<string, string | number | string[] | boolean | null> = {};
  // Generic — capture every non-empty field other than patient/teeth.
  const skip = new Set(['service', 'jaws', 'teeth', 'cbctFileName', 'prosthesisFileName', 'notes', 'clinicalNotes']);
  for (const [k, v] of Object.entries(draft)) {
    if (skip.has(k)) continue;
    if (v === null || v === '' || v === false) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) continue;
    out[k] = v as never;
  }
  return out;
}

/* ============================================================================
   Full-page header — close + title + minimal step indicator + nav icons
   ============================================================================ */

function OrderWizardHeader({
  steps,
  currentIdx,
  onClose,
  savedAt,
}: {
  steps: { id: StepId; label: string }[];
  currentIdx: number;
  onClose: () => void;
  savedAt?: number | null;
}) {
  return (
    <header
      style={{
        flexShrink: 0,
        height: 64,
        backgroundColor: 'var(--ads-bg-surface)',
        borderBottom: '1px solid var(--ads-border-subtle)',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '0 32px',
        gap: 24,
      }}
    >
      {/* Left: close + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close order"
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--ads-radius-sm)',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ads-text-primary)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--ads-bg-muted)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <line x1="5" y1="5" x2="15" y2="15" />
            <line x1="15" y1="5" x2="5" y2="15" />
          </svg>
        </button>
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--ads-text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          New order
        </span>
        <SavedPulse savedAt={savedAt ?? null} />
      </div>

      {/* Center: step indicator (design-system Stepper) */}
      <Stepper steps={steps.map((s) => s.label)} activeStep={currentIdx} orientation="horizontal" />

      {/* Right: nav icons + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
        <HeaderIconButton ariaLabel="Notifications">
          <NotificationBellIcon />
          <span
            aria-hidden
            style={{
              position: 'absolute',
              top: 9,
              right: 11,
              width: 7,
              height: 7,
              borderRadius: 'var(--ads-radius-full)',
              backgroundColor: 'var(--ads-warning-500)',
              border: '1.5px solid var(--ads-bg-surface)',
            }}
          />
        </HeaderIconButton>
        <HeaderIconButton ariaLabel="Help">
          <HelpIcon />
        </HeaderIconButton>
        <Avatar name="ss" size="sm" />

      </div>
    </header>
  );
}


function HeaderIconButton({ children, ariaLabel }: { children: React.ReactNode; ariaLabel: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <IconButton aria-label={ariaLabel} size="md">
        <span style={{ color: 'var(--ads-icon-muted, var(--ads-text-muted))', display: 'inline-flex' }}>
          {children}
        </span>
      </IconButton>
    </span>
  );
}

function NotificationBellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <path
        d="M28.7071 19.293L26 16.5859V13C25.9968 10.522 25.0749 8.13311 23.4125 6.29539C21.7501 4.45768 19.4653 3.30163 17 3.0508V1H15V3.0508C12.5347 3.30163 10.2499 4.45768 8.58753 6.29539C6.92514 8.13311 6.00321 10.522 6 13V16.5859L3.2929 19.293C3.10539 19.4805 3.00003 19.7348 3 20V23C3 23.2652 3.10536 23.5196 3.29289 23.7071C3.48043 23.8946 3.73478 24 4 24H11V24.7768C10.9783 26.0454 11.4255 27.2774 12.2559 28.2367C13.0863 29.196 14.2414 29.8151 15.5 29.9755C16.1951 30.0445 16.897 29.9672 17.5605 29.7486C18.224 29.5301 18.8344 29.175 19.3524 28.7064C19.8705 28.2378 20.2847 27.6659 20.5684 27.0276C20.8522 26.3892 20.9992 25.6986 21 25V24H28C28.2652 24 28.5196 23.8946 28.7071 23.7071C28.8946 23.5196 29 23.2652 29 23V20C29 19.7348 28.8946 19.4805 28.7071 19.293ZM19 25C19 25.7956 18.6839 26.5587 18.1213 27.1213C17.5587 27.6839 16.7956 28 16 28C15.2044 28 14.4413 27.6839 13.8787 27.1213C13.3161 26.5587 13 25.7956 13 25V24H19V25ZM27 22H5V20.4141L7.707 17.707C7.89455 17.5195 7.99994 17.2652 8 17V13C8 10.8783 8.84285 8.84344 10.3431 7.34315C11.8434 5.84285 13.8783 5 16 5C18.1217 5 20.1566 5.84285 21.6569 7.34315C23.1571 8.84344 24 10.8783 24 13V17C24.0001 17.2652 24.1054 17.5195 24.293 17.707L27 20.4141V22Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.4 9 a 2.6 2.6 0 1 1 3.6 2.4 c -0.8 0.4 -1 1 -1 1.8" />
      <circle cx="12" cy="17" r="0.8" fill="currentColor" />
    </svg>
  );
}

function StepHeader({ title }: { title: string }) {
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: 'var(--ads-font-sans)',
        fontSize: 28,
        lineHeight: '36px',
        fontWeight: 500,
        color: 'var(--ads-text-primary)',
        letterSpacing: '-0.015em',
      }}
    >
      {title}
    </h1>
  );
}

/* ============================================================================
   Steps
   ============================================================================ */

function ServiceStep({
  value,
  onSelect,
  templates,
  onApplyTemplate,
}: {
  value: ServiceId | null;
  onSelect: (id: ServiceId) => void;
  templates: OrderTemplate[];
  onApplyTemplate: (tpl: OrderTemplate) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      {templates.length > 0 && (
        <TemplateGallery templates={templates} onApply={onApplyTemplate} />
      )}
      <div>
        <h3
          style={{
            margin: '0 0 12px',
            fontFamily: 'var(--ads-font-sans)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--ads-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Or start from scratch
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {SERVICES.map((s) => {
        const selected = value === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            style={{
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              padding: 0,
              borderRadius: 'var(--ads-radius-sm)',
              border: '1px solid var(--ads-border-subtle)',
              backgroundColor: 'var(--ads-bg-surface)',
              cursor: 'pointer',
              fontFamily: 'var(--ads-font-sans)',
              overflow: 'hidden',
              transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
            }}
          >
            {/* Image area */}
            <div
              style={{
                aspectRatio: '4 / 3',
                width: '100%',
                backgroundColor:
                  s.id === 'nightguard'
                    ? '#cfe6ec'
                    : selected
                      ? 'color-mix(in srgb, var(--ads-blue-500) 8%, var(--ads-bg-page))'
                      : 'var(--ads-bg-page)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid var(--ads-border-subtle)',
                color: selected ? 'var(--ads-blue-500)' : 'var(--ads-text-muted)',
                transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
                overflow: 'hidden',
              }}
            >
              <ServiceIllustration id={s.id} />
            </div>
            {/* Text area */}
            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>{s.name}</div>
            </div>
          </button>
        );
      })}
        </div>
      </div>
    </div>
  );
}

/* ─── Template gallery (rendered above the service grid) ─── */

function TemplateGallery({
  templates,
  onApply,
}: {
  templates: OrderTemplate[];
  onApply: (tpl: OrderTemplate) => void;
}) {
  const personal = templates.filter((t) => t.source === 'personal');
  const lab = templates.filter((t) => t.source === 'lab');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {personal.length > 0 && (
        <TemplateRow title="Your templates" templates={personal} onApply={onApply} />
      )}
      {lab.length > 0 && (
        <TemplateRow title="Lab-recommended" templates={lab} onApply={onApply} />
      )}
    </div>
  );
}

function TemplateRow({
  title,
  templates,
  onApply,
}: {
  title: string;
  templates: OrderTemplate[];
  onApply: (tpl: OrderTemplate) => void;
}) {
  return (
    <div>
      <h3
        style={{
          margin: '0 0 12px',
          fontFamily: 'var(--ads-font-sans)',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--ads-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {templates.map((t) => {
          const def = SERVICE_BY_ID[t.service];
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onApply(t)}
              style={{
                textAlign: 'left',
                padding: '14px 16px',
                borderRadius: 'var(--ads-radius-sm)',
                border: '1px solid var(--ads-border-subtle)',
                backgroundColor: 'var(--ads-bg-surface)',
                cursor: 'pointer',
                fontFamily: 'var(--ads-font-sans)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                transition: 'background-color var(--ads-duration-fast) var(--ads-ease-standard)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--ads-bg-muted)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--ads-bg-surface)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>{t.name}</span>
                <Tag color="blue" size="small">{def?.name ?? t.service}</Tag>
              </div>
              {t.description && (
                <div style={{ fontSize: 12, color: 'var(--ads-text-muted)', lineHeight: 1.4 }}>{t.description}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ServiceIllustration({ id }: { id: ServiceId }) {
  const stroke = 'currentColor';
  const sw = 1.6;
  switch (id) {
    case 'nightguard':
      return (
        <img
          src={nightguardImageUrl}
          alt="Nightguard"
          style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }}
        />
      );
    case 'full-denture':
      return (
        <svg width="76" height="60" viewBox="0 0 76 60" fill="none">
          <path d="M8 22 C 8 8, 68 8, 68 22 C 68 36, 60 44, 38 44 C 16 44, 8 36, 8 22 Z" stroke={stroke} strokeWidth={sw} fill="color-mix(in srgb, currentColor 6%, transparent)" />
          {[14, 22, 30, 38, 46, 54, 62].map((x, i) => (
            <ellipse key={i} cx={x} cy="20" rx="3" ry="5" stroke={stroke} strokeWidth="1" fill="none" />
          ))}
        </svg>
      );
    case 'partial-denture':
      return (
        <svg width="76" height="60" viewBox="0 0 76 60" fill="none">
          <path d="M8 22 C 8 8, 68 8, 68 22 C 68 36, 60 44, 38 44 C 16 44, 8 36, 8 22 Z" stroke={stroke} strokeWidth={sw} fill="none" />
          {[14, 22, 54, 62].map((x, i) => (
            <ellipse key={i} cx={x} cy="20" rx="3" ry="5" stroke={stroke} strokeWidth="1" fill="color-mix(in srgb, currentColor 8%, transparent)" />
          ))}
          <path d="M30 18 L 30 30 M 46 18 L 46 30" stroke={stroke} strokeWidth="1" strokeDasharray="2 2" />
          <path d="M14 14 L 10 8 M 62 14 L 66 8" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case 'temporary-restoration':
      return (
        <svg width="76" height="60" viewBox="0 0 76 60" fill="none">
          <path d="M30 12 C 28 18, 26 26, 28 38 C 30 46, 46 46, 48 38 C 50 26, 48 18, 46 12 C 42 6, 34 6, 30 12 Z" stroke={stroke} strokeWidth={sw} strokeDasharray="3 2" fill="color-mix(in srgb, currentColor 5%, transparent)" />
          <line x1="14" y1="48" x2="62" y2="48" stroke={stroke} strokeWidth="1" />
          <text x="38" y="56" fontSize="6" fill={stroke} textAnchor="middle" opacity="0.7" fontFamily="var(--ads-font-sans)">TEMP</text>
        </svg>
      );
    case 'final-restoration':
      return (
        <svg width="76" height="60" viewBox="0 0 76 60" fill="none">
          <path d="M30 12 C 28 18, 26 26, 28 38 C 30 46, 46 46, 48 38 C 50 26, 48 18, 46 12 C 42 6, 34 6, 30 12 Z" stroke={stroke} strokeWidth={sw} fill="color-mix(in srgb, currentColor 8%, transparent)" />
          <path d="M34 18 L 38 14 L 42 18" stroke={stroke} strokeWidth="1" fill="none" opacity="0.6" />
          <circle cx="56" cy="14" r="2" fill={stroke} opacity="0.6" />
          <line x1="56" y1="10" x2="56" y2="18" stroke={stroke} strokeWidth="1" opacity="0.6" />
          <line x1="52" y1="14" x2="60" y2="14" stroke={stroke} strokeWidth="1" opacity="0.6" />
        </svg>
      );
    case 'custom-abutment':
      return (
        <svg width="76" height="60" viewBox="0 0 76 60" fill="none">
          <path d="M28 14 L 48 14 L 46 22 L 30 22 Z" stroke={stroke} strokeWidth={sw} fill="color-mix(in srgb, currentColor 8%, transparent)" />
          <rect x="34" y="22" width="8" height="6" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M32 28 L 44 28 L 42 50 L 34 50 Z" stroke={stroke} strokeWidth={sw} fill="none" />
          {[32, 36, 40, 44].map((y, i) => (
            <line key={i} x1="33" y1={y} x2="43" y2={y} stroke={stroke} strokeWidth="0.6" opacity="0.5" />
          ))}
        </svg>
      );
    case 'aligner':
      return (
        <svg width="76" height="60" viewBox="0 0 76 60" fill="none">
          <path d="M8 22 C 8 8, 68 8, 68 22 C 68 36, 60 44, 38 44 C 16 44, 8 36, 8 22 Z" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M12 22 C 12 12, 64 12, 64 22 C 64 34, 56 40, 38 40 C 20 40, 12 34, 12 22 Z" stroke={stroke} strokeWidth="1" fill="color-mix(in srgb, currentColor 4%, transparent)" opacity="0.7" />
          {[18, 26, 34, 42, 50, 58].map((x, i) => (
            <line key={i} x1={x} y1="14" x2={x} y2="30" stroke={stroke} strokeWidth="0.6" opacity="0.4" />
          ))}
        </svg>
      );
    case 'implant-planning':
      return (
        <svg width="76" height="60" viewBox="0 0 76 60" fill="none">
          <rect x="6" y="10" width="64" height="36" rx="3" stroke={stroke} strokeWidth={sw} fill="color-mix(in srgb, currentColor 4%, transparent)" />
          <line x1="38" y1="14" x2="38" y2="42" stroke={stroke} strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />
          <line x1="10" y1="28" x2="66" y2="28" stroke={stroke} strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />
          <path d="M34 22 L 42 22 L 40 28 L 36 28 Z" stroke={stroke} strokeWidth={sw} fill="currentColor" opacity="0.7" />
          <path d="M35 28 L 41 28 L 40 38 L 36 38 Z" stroke={stroke} strokeWidth={sw} fill="none" />
          <circle cx="38" cy="28" r="6" stroke={stroke} strokeWidth="0.8" fill="none" opacity="0.5" />
        </svg>
      );
    case 'surgical-guide':
      return (
        <svg width="76" height="60" viewBox="0 0 76 60" fill="none">
          <path d="M8 22 C 8 12, 68 12, 68 22 C 68 32, 60 38, 38 38 C 16 38, 8 32, 8 22 Z" stroke={stroke} strokeWidth={sw} fill="color-mix(in srgb, currentColor 6%, transparent)" />
          <circle cx="22" cy="22" r="4" stroke={stroke} strokeWidth={sw} fill="var(--ads-bg-surface)" />
          <circle cx="38" cy="22" r="4" stroke={stroke} strokeWidth={sw} fill="var(--ads-bg-surface)" />
          <circle cx="54" cy="22" r="4" stroke={stroke} strokeWidth={sw} fill="var(--ads-bg-surface)" />
          <line x1="38" y1="6" x2="38" y2="14" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M34 6 L 42 6 L 40 12 L 36 12 Z" stroke={stroke} strokeWidth={sw} fill="currentColor" opacity="0.6" />
        </svg>
      );
    case 'custom-order':
      return (
        <svg width="76" height="60" viewBox="0 0 76 60" fill="none">
          <circle cx="38" cy="30" r="14" stroke={stroke} strokeWidth={sw} fill="color-mix(in srgb, currentColor 6%, transparent)" />
          <circle cx="38" cy="30" r="5" stroke={stroke} strokeWidth={sw} fill="var(--ads-bg-surface)" />
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const r1 = 14, r2 = 19;
            const rad = (deg * Math.PI) / 180;
            const x1 = 38 + r1 * Math.cos(rad);
            const y1 = 30 + r1 * Math.sin(rad);
            const x2 = 38 + r2 * Math.cos(rad);
            const y2 = 30 + r2 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />;
          })}
        </svg>
      );
  }
}

function ServiceDetailsStep({
  draft,
  updateDraft,
  showError,
}: {
  draft: OrderDraft;
  updateDraft: (patch: Partial<OrderDraft>) => void;
  showError?: boolean;
}) {
  const def = draft.service ? SERVICE_BY_ID[draft.service] : null;
  if (!def) return null;
  const inv = (cond: boolean) => !!showError && cond;
  const isFullDenture = draft.service === 'full-denture';
  const isPartialDenture = draft.service === 'partial-denture';
  const isTempRestoration = draft.service === 'temporary-restoration';
  const isFinalRestoration = draft.service === 'final-restoration';
  const isCustomAbutment = draft.service === 'custom-abutment';
  const isImplantPlanning = draft.service === 'implant-planning';
  const isCustomOrder = draft.service === 'custom-order';

  if (isCustomOrder) {
    const CATEGORY_OPTIONS = [
      { value: 'orthodontics',     label: 'Orthodontics' },
      { value: 'restorative',      label: 'Restorative' },
      { value: 'implantology',     label: 'Implantology' },
      { value: 'removable',        label: 'Removable' },
      { value: 'dental-appliances',label: 'Dental appliances' },
      { value: 'multiple-services',label: 'Multiple services' },
      { value: 'other',            label: 'Other' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div id={sectionAnchorId('Category')} style={{ display: 'flex', flexDirection: 'column', gap: 6, scrollMarginTop: 24 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
              Category
            </span>
            <DropdownList
              options={CATEGORY_OPTIONS}
              value={(draft.procedureType && CATEGORY_OPTIONS.find((c) => c.value === draft.procedureType)) ? draft.procedureType : ''}
              onChange={(v) => updateDraft({ procedureType: v || null })}
              placeholder="Select"
              fullWidth
            />
          </div>
          <div id={sectionAnchorId('Procedure type')} style={{ display: 'flex', flexDirection: 'column', gap: 6, scrollMarginTop: 24 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
              Procedure type
            </span>
            <input
              type="text"
              value={draft.customDescription}
              onChange={(e) => updateDraft({ customDescription: e.target.value })}
              placeholder=""
              style={{
                height: 44,
                padding: '0 12px',
                border: '1px solid var(--ads-border-default)',
                borderRadius: 'var(--ads-radius-sm)',
                fontFamily: 'var(--ads-font-sans)',
                fontSize: 14,
                color: 'var(--ads-text-primary)',
                backgroundColor: 'var(--ads-bg-surface)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <DetailsSection title="Location">
          <NightguardToothChart
            selected={draft.teeth}
            onChange={(teeth) => {
              const hasUpper = teeth.some((t) => UPPER_TEETH.includes(t));
              const hasLower = teeth.some((t) => LOWER_TEETH.includes(t));
              const nextJaws: ('upper' | 'lower')[] = [
                ...(hasUpper ? (['upper'] as const) : []),
                ...(hasLower ? (['lower'] as const) : []),
              ];
              updateDraft({ teeth, jaws: nextJaws });
            }}
          />
        </DetailsSection>

        <div id={sectionAnchorId('Instructions')} style={{ display: 'flex', flexDirection: 'column', gap: 6, scrollMarginTop: 24 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
            Instructions
          </span>
          <textarea
            value={draft.notes}
            onChange={(e) => updateDraft({ notes: e.target.value })}
            rows={6}
            style={{
              resize: 'vertical',
              minHeight: 140,
              border: '1px solid var(--ads-border-default)',
              borderRadius: 'var(--ads-radius-sm)',
              padding: 12,
              fontFamily: 'var(--ads-font-sans)',
              fontSize: 14,
              color: 'var(--ads-text-primary)',
              backgroundColor: 'var(--ads-bg-surface)',
              outline: 'none',
            }}
          />
        </div>
      </div>
    );
  }

  if (isImplantPlanning) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <DetailsSection title="Service provider" invalid={inv(!draft.provider)}>
          <ServiceProviderCardPicker
            value={draft.provider}
            onSelect={(v) => updateDraft({ provider: v })}
            cards={[
              { value: 'lab-a', label: 'Simplant Planning Service' },
              { value: 'lab-b', label: 'Your preferred lab' },
            ]}
          />
        </DetailsSection>

        <DetailsSection title="Location" invalid={inv(draft.jaws.length === 0)}>
          <ChipPicker
            options={[
              { value: 'upper', label: 'Upper jaw' },
              { value: 'lower', label: 'Lower jaw' },
            ]}
            value={
              draft.jaws.includes('upper') ? 'upper'
              : draft.jaws.includes('lower') ? 'lower'
              : null
            }
            onSelect={(v) => {
              const nextJaws: ('upper' | 'lower')[] = [v as 'upper' | 'lower'];
              const allowed = nextJaws.includes('upper') ? UPPER_TEETH : LOWER_TEETH;
              updateDraft({ jaws: nextJaws, teeth: [...allowed] });
            }}
            invalid={inv(draft.jaws.length === 0)}
          />
        </DetailsSection>

        <DetailsSection title="Procedure type" invalid={inv(!draft.procedureType)}>
          <ProcedureTypeCardPicker
            options={PROCEDURE_TYPES_BY_SERVICE['implant-planning']}
            value={draft.procedureType}
            onSelect={(v) => updateDraft({ procedureType: v })}
          />
        </DetailsSection>

        {draft.teeth.length === 0 && (
          <Notification type="info" title="Select position on the dental chart" />
        )}

        <DetailsSection title="Position" invalid={inv(draft.teeth.length === 0)}>
          <NightguardToothChart
            selected={draft.teeth}
            onChange={(teeth) => {
              const hasUpper = teeth.some((t) => UPPER_TEETH.includes(t));
              const hasLower = teeth.some((t) => LOWER_TEETH.includes(t));
              const nextJaws: ('upper' | 'lower')[] = [
                ...(hasUpper ? (['upper'] as const) : []),
                ...(hasLower ? (['lower'] as const) : []),
              ];
              updateDraft({ teeth, jaws: nextJaws });
            }}
          />
        </DetailsSection>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
              Implant manufacturer
            </span>
            <DropdownList
              options={IMPLANT_MANUFACTURERS}
              value={draft.manufacturer ?? ''}
              onChange={(v) => updateDraft({ manufacturer: v || null, productLine: null })}
              placeholder="Select"
              fullWidth
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
              Implant product line
            </span>
            <DropdownList
              options={draft.manufacturer ? PRODUCT_LINES_BY_MANUFACTURER[draft.manufacturer] ?? [] : []}
              value={draft.productLine ?? ''}
              onChange={(v) => updateDraft({ productLine: v || null })}
              placeholder="Select"
              fullWidth
              disabled={!draft.manufacturer}
            />
          </div>
        </div>

        <DetailsSection title="Support type" invalid={inv(!draft.supportType)}>
          <SupportTypeCardPicker
            value={draft.supportType}
            onSelect={(v) => updateDraft({ supportType: v as SupportType })}
          />
        </DetailsSection>
      </div>
    );
  }

  if (isCustomAbutment) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <DetailsSection title="Service provider" invalid={inv(!draft.provider)}>
          <ServiceProviderCardPicker
            value={draft.provider}
            onSelect={(v) => updateDraft({ provider: v })}
            cards={[
              { value: 'lab-a', label: 'Atlantis WebOrder' },
              { value: 'lab-b', label: 'Your preferred lab' },
            ]}
          />
        </DetailsSection>

        {draft.teeth.length === 0 && (
          <Notification type="info" title="Select position on the dental chart" />
        )}

        <DetailsSection title="Location" invalid={inv(draft.teeth.length === 0)}>
          <NightguardToothChart
            selected={draft.teeth}
            onChange={(teeth) => {
              const hasUpper = teeth.some((t) => UPPER_TEETH.includes(t));
              const hasLower = teeth.some((t) => LOWER_TEETH.includes(t));
              const nextJaws: ('upper' | 'lower')[] = [
                ...(hasUpper ? (['upper'] as const) : []),
                ...(hasLower ? (['lower'] as const) : []),
              ];
              const nextImplant = { ...draft.implantByTooth };
              Object.keys(nextImplant).forEach((k) => {
                if (!teeth.includes(Number(k))) delete nextImplant[Number(k)];
              });
              updateDraft({ teeth, jaws: nextJaws, implantByTooth: nextImplant });
            }}
          />
        </DetailsSection>

        {draft.teeth.slice().sort((a, b) => a - b).map((tooth) => (
          <AbutmentToothCard
            key={tooth}
            tooth={tooth}
            data={draft.implantByTooth[tooth] ?? {}}
            onChange={(data) =>
              updateDraft({
                implantByTooth: { ...draft.implantByTooth, [tooth]: data },
              })
            }
            onRemove={() => {
              const nextImplant = { ...draft.implantByTooth };
              delete nextImplant[tooth];
              updateDraft({
                teeth: draft.teeth.filter((t) => t !== tooth),
                implantByTooth: nextImplant,
              });
            }}
          />
        ))}
      </div>
    );
  }

  if (isTempRestoration || isFinalRestoration) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <DetailsSection title="Service provider" invalid={inv(!draft.provider)}>
          <ServiceProviderCardPicker
            value={draft.provider}
            onSelect={(v) => updateDraft({ provider: v })}
          />
        </DetailsSection>

        <DetailsSection title="Location" invalid={inv(draft.teeth.length === 0)}>
          <TempRestorationToothChart
            selected={draft.teeth}
            procedureByTooth={draft.procedureByTooth}
            procedureOptions={draft.tempProcedureOptions}
            onChange={(teeth, procedureByTooth, tempProcedureOptions) => {
              const hasUpper = teeth.some((t) => UPPER_TEETH.includes(t));
              const hasLower = teeth.some((t) => LOWER_TEETH.includes(t));
              const nextJaws: ('upper' | 'lower')[] = [
                ...(hasUpper ? (['upper'] as const) : []),
                ...(hasLower ? (['lower'] as const) : []),
              ];
              updateDraft({
                teeth,
                jaws: nextJaws,
                procedureByTooth,
                ...(tempProcedureOptions ? { tempProcedureOptions } : {}),
              });
            }}
          />
        </DetailsSection>
      </div>
    );
  }

  if (isPartialDenture) {
    const upperTeeth = draft.teeth.filter((t) => UPPER_TEETH.includes(t)).sort((a, b) => a - b);
    const lowerTeeth = draft.teeth.filter((t) => LOWER_TEETH.includes(t)).sort((a, b) => a - b);
    const partialLabel = PARTIAL_DENTURE_TYPES.find((p) => p.value === draft.partialType)?.label ?? '';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <DetailsSection title="Denture type" invalid={inv(!draft.partialType)}>
          <DentureTypePicker
            options={PARTIAL_DENTURE_TYPES.map((t) => ({ value: t.value, label: t.label }))}
            value={draft.partialType}
            onSelect={(v) => updateDraft({ partialType: v as 'flexible' | 'metal' })}
            iconResolver={() => <DentureTypeIcon variant="full" />}
            columns={2}
          />
        </DetailsSection>

        {draft.partialType && draft.teeth.length === 0 && (
          <Notification type="info" title="Select position on the dental chart" />
        )}

        <DetailsSection title="Location" invalid={inv(draft.teeth.length === 0)}>
          <NightguardToothChart
            selected={draft.teeth}
            onChange={(teeth) => {
              const hasUpper = teeth.some((t) => UPPER_TEETH.includes(t));
              const hasLower = teeth.some((t) => LOWER_TEETH.includes(t));
              const nextJaws: ('upper' | 'lower')[] = [
                ...(hasUpper ? (['upper'] as const) : []),
                ...(hasLower ? (['lower'] as const) : []),
              ];
              updateDraft({ teeth, jaws: nextJaws });
            }}
          />
        </DetailsSection>

        {draft.partialType && upperTeeth.length > 0 && (
          <DentureJawCard
            title={`${partialLabel} – ${upperTeeth.join(', ')}`}
            expanded={draft.upperDentureExpanded}
            onToggle={() => updateDraft({ upperDentureExpanded: !draft.upperDentureExpanded })}
            onRemove={() =>
              updateDraft({
                teeth: draft.teeth.filter((t) => !UPPER_TEETH.includes(t)),
                jaws: draft.jaws.filter((j) => j !== 'upper'),
              })
            }
            serviceType={draft.upperServiceType}
            onServiceTypeChange={(v) => updateDraft({ upperServiceType: v })}
            toothShade={draft.upperDentureToothShade}
            onToothShadeChange={(v) => updateDraft({ upperDentureToothShade: v })}
            gingivaShade={draft.upperDentureGingivaShade}
            onGingivaShadeChange={(v) => updateDraft({ upperDentureGingivaShade: v })}
            occlusion={draft.upperDentureOcclusion}
            onOcclusionChange={(v) => updateDraft({ upperDentureOcclusion: v })}
            advanced={draft.upperDentureAdvanced}
            onAdvancedChange={(v) => updateDraft({ upperDentureAdvanced: v })}
            aesthetic={draft.upperDentureAesthetic}
            onAestheticChange={(v) => updateDraft({ upperDentureAesthetic: v })}
            measurements={draft.upperDentureMeasurements}
            onMeasurementsChange={(v) => updateDraft({ upperDentureMeasurements: v })}
            hideOcclusion
          />
        )}

        {draft.partialType && lowerTeeth.length > 0 && (
          <DentureJawCard
            title={`${partialLabel} – ${lowerTeeth.join(', ')}`}
            expanded={draft.lowerDentureExpanded}
            onToggle={() => updateDraft({ lowerDentureExpanded: !draft.lowerDentureExpanded })}
            onRemove={() =>
              updateDraft({
                teeth: draft.teeth.filter((t) => !LOWER_TEETH.includes(t)),
                jaws: draft.jaws.filter((j) => j !== 'lower'),
              })
            }
            serviceType={draft.lowerServiceType}
            onServiceTypeChange={(v) => updateDraft({ lowerServiceType: v })}
            toothShade={draft.lowerDentureToothShade}
            onToothShadeChange={(v) => updateDraft({ lowerDentureToothShade: v })}
            gingivaShade={draft.lowerDentureGingivaShade}
            onGingivaShadeChange={(v) => updateDraft({ lowerDentureGingivaShade: v })}
            occlusion={draft.lowerDentureOcclusion}
            onOcclusionChange={(v) => updateDraft({ lowerDentureOcclusion: v })}
            advanced={draft.lowerDentureAdvanced}
            onAdvancedChange={(v) => updateDraft({ lowerDentureAdvanced: v })}
            aesthetic={draft.lowerDentureAesthetic}
            onAestheticChange={(v) => updateDraft({ lowerDentureAesthetic: v })}
            measurements={draft.lowerDentureMeasurements}
            onMeasurementsChange={(v) => updateDraft({ lowerDentureMeasurements: v })}
            hideOcclusion
          />
        )}
      </div>
    );
  }

  if (isFullDenture) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <DetailsSection title="Denture type" invalid={inv(!draft.dentureType)}>
          <DentureTypePicker
            value={draft.dentureType}
            onSelect={(v) => updateDraft({ dentureType: v })}
          />
        </DetailsSection>

        {draft.dentureType && draft.jaws.length === 0 && (
          <Notification type="info" title="Select position on the dental chart" />
        )}

        <DetailsSection title="Location" invalid={inv(draft.jaws.length === 0)}>
          <ChipPicker
            options={[
              { value: 'both',  label: 'Both arches' },
              { value: 'upper', label: 'Upper jaw'  },
              { value: 'lower', label: 'Lower jaw'  },
            ]}
            value={
              draft.jaws.length === 2 ? 'both'
              : draft.jaws.includes('upper') ? 'upper'
              : draft.jaws.includes('lower') ? 'lower'
              : null
            }
            onSelect={(v) => {
              const nextJaws: ('upper' | 'lower')[] =
                v === 'both' ? ['upper', 'lower'] : [v as 'upper' | 'lower'];
              const allowed = new Set<number>([
                ...(nextJaws.includes('upper') ? UPPER_TEETH : []),
                ...(nextJaws.includes('lower') ? LOWER_TEETH : []),
              ]);
              updateDraft({ jaws: nextJaws, teeth: Array.from(allowed) });
            }}
            invalid={inv(draft.jaws.length === 0)}
          />
          <div style={{ marginTop: 16 }}>
            <NightguardToothChart
              selected={draft.teeth}
              onChange={(teeth) => {
                const hasUpper = teeth.some((t) => UPPER_TEETH.includes(t));
                const hasLower = teeth.some((t) => LOWER_TEETH.includes(t));
                const nextJaws: ('upper' | 'lower')[] = [
                  ...(hasUpper ? (['upper'] as const) : []),
                  ...(hasLower ? (['lower'] as const) : []),
                ];
                updateDraft({ teeth, jaws: nextJaws });
              }}
            />
          </div>
        </DetailsSection>

        {draft.dentureType && draft.jaws.includes('upper') && (
          <DentureJawCard
            title={`${dentureTypeLabel(draft.dentureType)} – Upper jaw`}
            expanded={draft.upperDentureExpanded}
            onToggle={() => updateDraft({ upperDentureExpanded: !draft.upperDentureExpanded })}
            onRemove={() => {
              const nextJaws = draft.jaws.filter((j) => j !== 'upper');
              const remaining = draft.teeth.filter((t) => !UPPER_TEETH.includes(t));
              updateDraft({ jaws: nextJaws, teeth: remaining });
            }}
            serviceType={draft.upperServiceType}
            onServiceTypeChange={(v) => updateDraft({ upperServiceType: v })}
            toothShade={draft.upperDentureToothShade}
            onToothShadeChange={(v) => updateDraft({ upperDentureToothShade: v })}
            gingivaShade={draft.upperDentureGingivaShade}
            onGingivaShadeChange={(v) => updateDraft({ upperDentureGingivaShade: v })}
            occlusion={draft.upperDentureOcclusion}
            onOcclusionChange={(v) => updateDraft({ upperDentureOcclusion: v })}
            advanced={draft.upperDentureAdvanced}
            onAdvancedChange={(v) => updateDraft({ upperDentureAdvanced: v })}
            aesthetic={draft.upperDentureAesthetic}
            onAestheticChange={(v) => updateDraft({ upperDentureAesthetic: v })}
            measurements={draft.upperDentureMeasurements}
            onMeasurementsChange={(v) => updateDraft({ upperDentureMeasurements: v })}
          />
        )}

        {draft.dentureType && draft.jaws.includes('lower') && (
          <DentureJawCard
            title={`${dentureTypeLabel(draft.dentureType)} – Lower jaw`}
            expanded={draft.lowerDentureExpanded}
            onToggle={() => updateDraft({ lowerDentureExpanded: !draft.lowerDentureExpanded })}
            onRemove={() => {
              const nextJaws = draft.jaws.filter((j) => j !== 'lower');
              const remaining = draft.teeth.filter((t) => !LOWER_TEETH.includes(t));
              updateDraft({ jaws: nextJaws, teeth: remaining });
            }}
            serviceType={draft.lowerServiceType}
            onServiceTypeChange={(v) => updateDraft({ lowerServiceType: v })}
            toothShade={draft.lowerDentureToothShade}
            onToothShadeChange={(v) => updateDraft({ lowerDentureToothShade: v })}
            gingivaShade={draft.lowerDentureGingivaShade}
            onGingivaShadeChange={(v) => updateDraft({ lowerDentureGingivaShade: v })}
            occlusion={draft.lowerDentureOcclusion}
            onOcclusionChange={(v) => updateDraft({ lowerDentureOcclusion: v })}
            advanced={draft.lowerDentureAdvanced}
            onAdvancedChange={(v) => updateDraft({ lowerDentureAdvanced: v })}
            aesthetic={draft.lowerDentureAesthetic}
            onAestheticChange={(v) => updateDraft({ lowerDentureAesthetic: v })}
            measurements={draft.lowerDentureMeasurements}
            onMeasurementsChange={(v) => updateDraft({ lowerDentureMeasurements: v })}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <DetailsSection title="Provider" invalid={inv(!draft.provider)}>
        <ProviderStep value={draft.provider} onChange={(v) => updateDraft({ provider: v })} />
      </DetailsSection>

      <DetailsSection title="Location" invalid={inv(draft.jaws.length === 0)}>
        <ChipPicker
          options={[
            { value: 'both',  label: 'Both arches' },
            { value: 'upper', label: 'Upper jaw'  },
            { value: 'lower', label: 'Lower jaw'  },
          ]}
          value={
            draft.jaws.length === 2 ? 'both'
            : draft.jaws.includes('upper') ? 'upper'
            : draft.jaws.includes('lower') ? 'lower'
            : null
          }
          onSelect={(v) => {
            const nextJaws: ('upper' | 'lower')[] =
              v === 'both' ? ['upper', 'lower'] : [v as 'upper' | 'lower'];
            const patch: Partial<OrderDraft> = { jaws: nextJaws };
            // Nightguard / full denture: auto-fill the whole arch(es); user can still deselect.
            if (draft.service === 'nightguard' || draft.service === 'full-denture') {
              const allowed = new Set<number>([
                ...(nextJaws.includes('upper') ? UPPER_TEETH : []),
                ...(nextJaws.includes('lower') ? LOWER_TEETH : []),
              ]);
              patch.teeth = Array.from(allowed);
            }
            updateDraft(patch);
          }}
          invalid={inv(draft.jaws.length === 0)}
        />
        {(draft.service === 'nightguard' || draft.service === 'full-denture') && (
          <div style={{ marginTop: 16 }}>
            <NightguardToothChart
              selected={draft.teeth}
              onChange={(teeth) => {
                const hasUpper = teeth.some((t) => UPPER_TEETH.includes(t));
                const hasLower = teeth.some((t) => LOWER_TEETH.includes(t));
                const nextJaws: ('upper' | 'lower')[] = [
                  ...(hasUpper ? (['upper'] as const) : []),
                  ...(hasLower ? (['lower'] as const) : []),
                ];
                updateDraft({ teeth, jaws: nextJaws });
              }}
            />
          </div>
        )}
      </DetailsSection>

      <DetailsSection title="Procedure" invalid={inv(!draft.procedureType)}>
        <ChipPicker
          options={PROCEDURE_TYPES_BY_SERVICE[draft.service!].map((p) => ({ value: p.value, label: p.label }))}
          value={draft.procedureType}
          onSelect={(v) => updateDraft({ procedureType: v })}
          invalid={inv(!draft.procedureType)}
        />
      </DetailsSection>

      {def.requiresTeeth && (
        <DetailsSection title="Teeth" invalid={inv(draft.teeth.length === 0)}>
          <TeethStep
            jaws={draft.jaws}
            selected={draft.teeth}
            onChange={(teeth) => updateDraft({ teeth })}
          />
        </DetailsSection>
      )}

      {def.requiresImplant && (
        <DetailsSection
          title="Implant system"
          invalid={inv(!draft.manufacturer || !draft.productLine)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ChipPicker
              options={IMPLANT_MANUFACTURERS.map((m) => ({ value: m.value, label: m.label }))}
              value={draft.manufacturer}
              onSelect={(v) => updateDraft({ manufacturer: v, productLine: null })}
              invalid={inv(!draft.manufacturer)}
            />
            {draft.manufacturer && (
              <ChipPicker
                options={(PRODUCT_LINES_BY_MANUFACTURER[draft.manufacturer] ?? []).map((p) => ({
                  value: p.value, label: p.label,
                }))}
                value={draft.productLine}
                onSelect={(v) => updateDraft({ productLine: v })}
                invalid={inv(!draft.productLine)}
              />
            )}
          </div>
        </DetailsSection>
      )}

      {def.requiresGuideSupport && (
        <DetailsSection title="Support" invalid={inv(!draft.supportType)}>
          <ChipPicker
            options={SUPPORT_TYPES.map((s) => ({ value: s.value, label: s.label }))}
            value={draft.supportType}
            onSelect={(v) => updateDraft({ supportType: v as SupportType })}
            invalid={inv(!draft.supportType)}
          />
        </DetailsSection>
      )}

      {/* ─── Per-service clinical sections ─── */}
      <PerServiceSections draft={draft} updateDraft={updateDraft} showError={!!showError} />
    </div>
  );
}

function sectionAnchorId(title: string): string {
  return `wizard-section-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
}

function DetailsSection({
  title,
  helpKey,
  invalid,
  optional,
  children,
}: {
  title: string;
  helpKey?: keyof typeof FIELD_HELP;
  invalid?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={sectionAnchorId(title)} style={{ display: 'flex', flexDirection: 'column', gap: 10, scrollMarginTop: 24 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 17,
            lineHeight: '24px',
            fontWeight: 500,
            color: invalid ? 'var(--ads-error-500)' : 'var(--ads-text-primary)',
          }}
        >
          {title}
          {optional && (
            <span style={{ marginLeft: 6, fontSize: 13, fontWeight: 400, color: 'var(--ads-text-muted)' }}>
              (optional)
            </span>
          )}
        </h3>
        {helpKey && <HelpPopover content={FIELD_HELP[helpKey]} />}
        {invalid && (
          <span
            aria-hidden
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 16,
              height: 16,
              borderRadius: 'var(--ads-radius-full)',
              backgroundColor: 'var(--ads-error-500)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 500,
              fontFamily: 'var(--ads-font-sans)',
            }}
          >
            !
          </span>
        )}
      </header>
      <div>{children}</div>
    </section>
  );
}

/* ============================================================================
   Per-service clinical sections
   ============================================================================ */

function PerServiceSections({
  draft,
  updateDraft,
  showError,
}: {
  draft: OrderDraft;
  updateDraft: (patch: Partial<OrderDraft>) => void;
  showError?: boolean;
}) {
  switch (draft.service) {
    case 'final-restoration':
    case 'temporary-restoration':
      return null;
    case 'custom-abutment':
      return null;
    case 'aligner':
      return <AlignerSections draft={draft} updateDraft={updateDraft} showError={showError} />;
    case 'nightguard':
      return <NightguardSections draft={draft} updateDraft={updateDraft} showError={showError} />;
    case 'implant-planning':
      return null;
    case 'surgical-guide':
      return <SurgicalGuideSections draft={draft} updateDraft={updateDraft} showError={showError} />;
    case 'full-denture':
    case 'partial-denture':
      return null;
    case 'custom-order':
      return null;
    default:
      return null;
  }
}

/* ─── Restorative (Final + Temporary) ─── */

function RestorativeSections({
  draft,
  updateDraft,
  showError,
  showTempFields,
}: {
  draft: OrderDraft;
  updateDraft: (patch: Partial<OrderDraft>) => void;
  showError?: boolean;
  showTempFields?: boolean;
}) {
  const inv = (cond: boolean) => !!showError && cond;
  const shadeValues = draft.shadeSystem === 'bleach'
    ? SHADE_VALUES_BLEACH
    : SHADE_VALUES_VITA_CLASSICAL;
  return (
    <>
      <DetailsSection title="Material" helpKey="material" invalid={inv(!draft.material)}>
        <ChipPicker
          options={RESTORATION_MATERIALS.map((m) => ({ value: m.value, label: `${m.label} · ${m.clearanceMm}mm` }))}
          value={draft.material}
          onSelect={(v) => updateDraft({ material: v })}
          invalid={inv(!draft.material)}
        />
      </DetailsSection>

      <DetailsSection title="Shade" invalid={inv(!draft.shadeSystem || !draft.shadeBody)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ChipPicker
            options={SHADE_SYSTEMS}
            value={draft.shadeSystem}
            onSelect={(v) => updateDraft({ shadeSystem: v, shadeBody: null, shadeIncisal: null, shadeCervical: null })}
            invalid={inv(!draft.shadeSystem)}
          />
          {draft.shadeSystem && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <ShadeSwatchPicker label="Body" values={shadeValues} value={draft.shadeBody}     onSelect={(v) => updateDraft({ shadeBody: v })} />
              <ShadeSwatchPicker label="Incisal" values={shadeValues} value={draft.shadeIncisal} onSelect={(v) => updateDraft({ shadeIncisal: v })} />
              <ShadeSwatchPicker label="Cervical" values={shadeValues} value={draft.shadeCervical}onSelect={(v) => updateDraft({ shadeCervical: v })} />
            </div>
          )}
        </div>
      </DetailsSection>

      <DetailsSection title="Margin" helpKey="margin" invalid={inv(!draft.marginDesign)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ChipPicker
            options={MARGIN_DESIGNS}
            value={draft.marginDesign}
            onSelect={(v) => updateDraft({ marginDesign: v })}
            invalid={inv(!draft.marginDesign)}
          />
          <ChipPicker
            options={MARGIN_LOCATIONS}
            value={draft.marginLocation}
            onSelect={(v) => updateDraft({ marginLocation: v })}
          />
        </div>
      </DetailsSection>

      <DetailsSection title="Occlusion">
        <ChipPicker
          options={OCCLUSAL_SCHEMES}
          value={draft.occlusalScheme}
          onSelect={(v) => updateDraft({ occlusalScheme: v })}
        />
      </DetailsSection>

      <DetailsSection title="Antagonist" optional>
        <ChipPicker
          options={ANTAGONIST_TYPES}
          value={draft.antagonist}
          onSelect={(v) => updateDraft({ antagonist: v })}
        />
      </DetailsSection>

      <DetailsSection title="Contacts" optional>
        <ChipPicker
          options={CONTACT_TIGHTNESS}
          value={draft.contactTightness}
          onSelect={(v) => updateDraft({ contactTightness: v })}
        />
      </DetailsSection>

      {!showTempFields && (
        <DetailsSection title="Cement" optional>
          <ChipPicker
            options={CEMENT_TYPES}
            value={draft.cementType}
            onSelect={(v) => updateDraft({ cementType: v })}
          />
        </DetailsSection>
      )}

      {showTempFields && (
        <>
          <DetailsSection title="Duration">
            <ChipPicker
              options={TEMP_DURATIONS.map((d) => ({ value: d.value, label: d.label }))}
              value={draft.tempDuration}
              onSelect={(v) => {
                const dur = TEMP_DURATIONS.find((d) => d.value === v);
                updateDraft({ tempDuration: v, material: dur?.defaultMaterial ?? draft.material });
              }}
            />
          </DetailsSection>

          <DetailsSection title="Provisional material" optional>
            <ChipPicker
              options={TEMP_MATERIALS}
              value={draft.material}
              onSelect={(v) => updateDraft({ material: v })}
            />
          </DetailsSection>

          {draft.procedureType?.toLowerCase().includes('implant') && (
            <DetailsSection title="Out of occlusion" invalid={inv(!draft.outOfOcclusionConfirmed)}>
              <Notification type="warning" title="Implant provisional must be out of occlusion">
                Static + dynamic. Emergence ≤30° from implant axis.
              </Notification>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={draft.outOfOcclusionConfirmed}
                  onChange={(e) => updateDraft({ outOfOcclusionConfirmed: e.target.checked })}
                />
                <span>Confirmed</span>
              </label>
            </DetailsSection>
          )}
        </>
      )}
    </>
  );
}

/* ─── Custom abutment ─── */

function AbutmentSections({
  draft,
  updateDraft,
  showError,
}: {
  showError?: boolean;
  draft: OrderDraft;
  updateDraft: (patch: Partial<OrderDraft>) => void;
}) {
  return (
    <>
      <DetailsSection title="Abutment material" invalid={!!showError && !draft.abutmentMaterial}>
        <ChipPicker
          options={ABUTMENT_MATERIALS}
          value={draft.abutmentMaterial}
          onSelect={(v) => updateDraft({ abutmentMaterial: v })}
          invalid={!!showError && !draft.abutmentMaterial}
        />
      </DetailsSection>

      <DetailsSection title="Retention" invalid={!!showError && !draft.retentionMethod}>
        <ChipPicker
          options={RETENTION_METHODS}
          value={draft.retentionMethod}
          onSelect={(v) => updateDraft({ retentionMethod: v })}
          invalid={!!showError && !draft.retentionMethod}
        />
      </DetailsSection>

      <DetailsSection title="Emergence profile" optional>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <NumericFieldWithUnit label="Tissue height"        unit="mm" value={draft.emergenceHeight} onChange={(v) => updateDraft({ emergenceHeight: v })} placeholder="2.5" />
          <NumericFieldWithUnit label="Angulation"           unit="°"  value={draft.angulation}      onChange={(v) => updateDraft({ angulation: v })}      placeholder="15"  />
        </div>
      </DetailsSection>
    </>
  );
}

/* ─── Aligner / Invisalign ─── */

function AlignerSections({
  draft,
  updateDraft,
  showError,
}: {
  draft: OrderDraft;
  updateDraft: (patch: Partial<OrderDraft>) => void;
  showError?: boolean;
}) {
  return (
    <>
      <DetailsSection title="Package" invalid={!!showError && !draft.alignerPackage}>
        <ChipPicker
          options={ALIGNER_PACKAGES.map((p) => ({ value: p.value, label: p.label }))}
          value={draft.alignerPackage}
          onSelect={(v) => updateDraft({ alignerPackage: v })}
          invalid={!!showError && !draft.alignerPackage}
        />
      </DetailsSection>

      <DetailsSection title="Treatment goals" invalid={!!showError && draft.treatmentGoals.length === 0}>
        <ChipMultiSelect
          options={TREATMENT_GOALS}
          values={draft.treatmentGoals}
          onChange={(v) => updateDraft({ treatmentGoals: v })}
        />
      </DetailsSection>

      <DetailsSection title="Angle class" optional>
        <ChipPicker
          options={ANGLE_CLASSES}
          value={draft.angleClass}
          onSelect={(v) => updateDraft({ angleClass: v })}
        />
      </DetailsSection>

      <DetailsSection title="Measurements" optional>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 480 }}>
          <NumericFieldWithUnit label="Overjet"  unit="mm" value={draft.overjet}          onChange={(v) => updateDraft({ overjet: v })} />
          <NumericFieldWithUnit label="Overbite" unit="mm" value={draft.overbite}         onChange={(v) => updateDraft({ overbite: v })} />
          <NumericFieldWithUnit label="Midline"  unit="mm" value={draft.midlineDeviation} onChange={(v) => updateDraft({ midlineDeviation: v })} />
        </div>
      </DetailsSection>

      <DetailsSection title="A-P strategy" helpKey="ap-strategy" optional>
        <ChipMultiSelect
          options={AP_STRATEGIES}
          values={draft.apStrategy}
          onChange={(v) => updateDraft({ apStrategy: v })}
        />
      </DetailsSection>
    </>
  );
}

/* ─── Nightguard / splint ─── */

function NightguardSections({
  draft,
  updateDraft,
  showError,
}: {
  draft: OrderDraft;
  updateDraft: (patch: Partial<OrderDraft>) => void;
  showError?: boolean;
}) {
  return (
    <>
      <DetailsSection title="Service type" invalid={!!showError && !draft.splintServiceType}>
        <ChipPicker
          options={SPLINT_SERVICE_TYPES.map((s) => ({ value: s.value, label: s.label }))}
          value={draft.splintServiceType}
          onSelect={(v) =>
            updateDraft({ splintServiceType: v as OrderDraft['splintServiceType'] })
          }
          invalid={!!showError && !draft.splintServiceType}
        />
      </DetailsSection>

      <DetailsSection title="Border of the splint" optional>
        <ImageCardPicker
          options={SPLINT_BORDERS.map((o) => ({
            value: o.value,
            label: o.label,
            illustration: <SplintBorderIllustration variant={o.value} />,
          }))}
          value={draft.splintBorder}
          onSelect={(v) => updateDraft({ splintBorder: v })}
        />
      </DetailsSection>

      <DetailsSection title="Splint surface" optional>
        <ImageCardPicker
          options={SPLINT_SURFACES.map((o) => ({
            value: o.value,
            label: o.label,
            illustration: <SplintSurfaceIllustration variant={o.value} />,
          }))}
          value={draft.splintSurfaceType}
          onSelect={(v) => updateDraft({ splintSurfaceType: v })}
        />
      </DetailsSection>

      <DetailsSection title="Contacts" optional>
        <ImageCardPicker
          options={SPLINT_CONTACTS.map((o) => ({
            value: o.value,
            label: o.label,
            illustration: <SplintContactsIllustration variant={o.value} />,
          }))}
          value={draft.splintContacts}
          onSelect={(v) => updateDraft({ splintContacts: v })}
        />
      </DetailsSection>
    </>
  );
}

/* ─── Image card picker (used for splint border / surface / contacts) ─── */

function ImageCardPicker({
  options,
  value,
  onSelect,
}: {
  options: { value: string; label: string; illustration: React.ReactNode }[];
  value: string | null;
  onSelect: (v: string) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`,
        gap: 12,
      }}
    >
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onSelect(o.value)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 12,
              padding: 12,
              borderRadius: 'var(--ads-radius-md, 12px)',
              border: `1px solid ${selected ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
              backgroundColor: selected
                ? 'color-mix(in srgb, var(--ads-blue-500) 6%, var(--ads-bg-surface))'
                : 'var(--ads-bg-surface)',
              boxShadow: selected
                ? '0 0 0 3px color-mix(in srgb, var(--ads-blue-500) 18%, transparent)'
                : 'var(--ads-shadow-sm)',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'var(--ads-font-sans)',
              transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
            }}
          >
            <div
              style={{
                aspectRatio: '16 / 10',
                borderRadius: 'var(--ads-radius-sm)',
                backgroundColor: 'var(--ads-bg-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {o.illustration}
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--ads-text-primary)',
                lineHeight: 1.35,
              }}
            >
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Splint illustrations (lightweight SVG approximations) ─── */

function SplintBorderIllustration({ variant }: { variant: string }) {
  const accent = 'var(--ads-blue-500)';
  const tooth = 'var(--ads-text-muted)';
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" preserveAspectRatio="xMidYMid meet">
      {/* Arch outline */}
      <path
        d="M20 70 C 20 30, 180 30, 180 70 C 180 100, 140 110, 100 110 C 60 110, 20 100, 20 70 Z"
        stroke={tooth}
        strokeWidth="1.5"
        fill="color-mix(in srgb, currentColor 4%, transparent)"
      />
      {/* Border line variant */}
      {variant === 'half-height' && (
        <path d="M28 78 C 30 70, 170 70, 172 78" stroke={accent} strokeWidth="2.5" fill="none" />
      )}
      {variant === 'scalloped' && (
        <path
          d="M28 78 Q 40 70 52 78 T 76 78 T 100 78 T 124 78 T 148 78 T 172 78"
          stroke={accent}
          strokeWidth="2.5"
          fill="none"
        />
      )}
      {variant === 'full-height' && (
        <path d="M22 96 C 24 88, 176 88, 178 96" stroke={accent} strokeWidth="2.5" fill="none" />
      )}
      {/* Teeth dividers */}
      {[40, 60, 80, 100, 120, 140, 160].map((x) => (
        <line key={x} x1={x} y1="42" x2={x} y2="62" stroke={tooth} strokeWidth="0.6" opacity="0.4" />
      ))}
    </svg>
  );
}

function SplintSurfaceIllustration({ variant }: { variant: string }) {
  const accent = 'var(--ads-text-muted)';
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" preserveAspectRatio="xMidYMid meet">
      <path
        d="M20 70 C 20 30, 180 30, 180 70 C 180 100, 140 110, 100 110 C 60 110, 20 100, 20 70 Z"
        stroke={accent}
        strokeWidth="1.5"
        fill="color-mix(in srgb, currentColor 6%, transparent)"
      />
      {variant === 'smooth' ? (
        <path
          d="M30 56 C 60 50, 140 50, 170 56"
          stroke="var(--ads-text-primary)"
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
      ) : (
        [40, 60, 80, 100, 120, 140, 160].map((x) => (
          <ellipse key={x} cx={x} cy="56" rx="6" ry="3" fill="var(--ads-text-primary)" opacity="0.35" />
        ))
      )}
    </svg>
  );
}

function SplintContactsIllustration({ variant }: { variant: string }) {
  const tooth = 'var(--ads-text-muted)';
  const hi = 'var(--ads-blue-500)';
  // teeth 1..14 left→right (front near middle)
  const teeth = Array.from({ length: 14 }, (_, i) => i);
  const isHighlighted = (i: number) => {
    const center = 6.5;
    const dist = Math.abs(i - center);
    switch (variant) {
      case 'posterior':
        return dist >= 4;
      case 'anterior':
        return dist <= 2;
      case 'anterior-canine':
        return dist <= 3;
      case 'even':
        return true;
      default:
        return false;
    }
  };
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" preserveAspectRatio="xMidYMid meet">
      <path
        d="M20 70 C 20 30, 180 30, 180 70 C 180 100, 140 110, 100 110 C 60 110, 20 100, 20 70 Z"
        stroke={tooth}
        strokeWidth="1.5"
        fill="color-mix(in srgb, currentColor 4%, transparent)"
      />
      {teeth.map((i) => {
        const t = i / (teeth.length - 1);
        const angle = Math.PI * (1 + t);
        const cx = 100 + Math.cos(angle) * 75;
        const cy = 70 + Math.sin(angle) * 35;
        const fill = isHighlighted(i) ? hi : 'var(--ads-bg-surface)';
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="7"
            ry="5"
            fill={fill}
            stroke={tooth}
            strokeWidth="0.8"
            opacity={isHighlighted(i) ? 1 : 0.6}
          />
        );
      })}
    </svg>
  );
}

/* ─── Implant planning ─── */

function ImplantPlanningSections({
  draft,
  updateDraft,
  showError,
}: {
  draft: OrderDraft;
  updateDraft: (patch: Partial<OrderDraft>) => void;
  showError?: boolean;
}) {
  return (
    <>
      <DetailsSection title="Loading" invalid={!!showError && !draft.loadingProtocol}>
        <ChipPicker
          options={LOADING_PROTOCOLS}
          value={draft.loadingProtocol}
          onSelect={(v) => updateDraft({ loadingProtocol: v })}
          invalid={!!showError && !draft.loadingProtocol}
        />
      </DetailsSection>

      <DetailsSection title="Planned restoration" invalid={!!showError && !draft.restorationPlan}>
        <ChipPicker
          options={RESTORATION_PLANS}
          value={draft.restorationPlan}
          onSelect={(v) => updateDraft({ restorationPlan: v })}
          invalid={!!showError && !draft.restorationPlan}
        />
      </DetailsSection>

      <DetailsSection title="Medical flags" optional>
        <ChipMultiSelect
          options={MEDICAL_FLAGS}
          values={draft.medicalFlags}
          onChange={(v) => updateDraft({ medicalFlags: v })}
        />
      </DetailsSection>

      <DetailsSection title="CBCT">
        <Notification type="info" title="Upload CBCT in the Files step" />
      </DetailsSection>
    </>
  );
}

/* ─── Surgical guide ─── */

function SurgicalGuideSections({
  draft,
  updateDraft,
  showError,
}: {
  draft: OrderDraft;
  updateDraft: (patch: Partial<OrderDraft>) => void;
  showError?: boolean;
}) {
  return (
    <DetailsSection title="Guide type" invalid={!!showError && !draft.guideType}>
      <ChipPicker
        options={GUIDE_TYPES}
        value={draft.guideType}
        onSelect={(v) => updateDraft({ guideType: v })}
        invalid={!!showError && !draft.guideType}
      />
    </DetailsSection>
  );
}

/* ─── Dentures ─── */

/* ─── Full denture helpers (card-based flow) ─── */

/* ─── Custom abutment per-tooth card ─── */

function AbutmentToothCard({
  tooth,
  data,
  onChange,
  onRemove,
}: {
  tooth: number;
  data: { manufacturer?: string; line?: string; name?: string; scanBodyType?: string };
  onChange: (next: { manufacturer?: string; line?: string; name?: string; scanBodyType?: string }) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const lineOptions = data.manufacturer
    ? PRODUCT_LINES_BY_MANUFACTURER[data.manufacturer] ?? []
    : [];
  const nameOptions = lineOptions; // reuse list as a stand-in for implant "name"

  return (
    <div
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-md, 12px)',
        boxShadow: 'var(--ads-shadow-sm)',
        overflow: 'hidden',
      }}
    >
      <header
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px',
          cursor: 'pointer',
          fontFamily: 'var(--ads-font-sans)',
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--ads-text-primary)', flex: 1 }}>
          Abutment: Tooth {tooth}
        </span>
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            width: 32,
            height: 32,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ads-text-muted)',
            borderRadius: 'var(--ads-radius-sm)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 4h10M6 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5 4l1 9a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1l1-9" />
          </svg>
        </button>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="var(--ads-text-muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </header>

      {expanded && (
        <div
          style={{
            padding: '16px 20px 20px',
            borderTop: '1px solid var(--ads-border-subtle)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
              Implant manufacturer
            </span>
            <DropdownList
              options={IMPLANT_MANUFACTURERS}
              value={data.manufacturer ?? ''}
              onChange={(v) => onChange({ ...data, manufacturer: v || undefined, line: undefined, name: undefined })}
              placeholder="Implant manufacturer"
              fullWidth
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
              Implant line
            </span>
            <DropdownList
              options={lineOptions}
              value={data.line ?? ''}
              onChange={(v) => onChange({ ...data, line: v || undefined })}
              placeholder="Implant line"
              fullWidth
              disabled={!data.manufacturer}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
              Implant name
            </span>
            <DropdownList
              options={nameOptions}
              value={data.name ?? ''}
              onChange={(v) => onChange({ ...data, name: v || undefined })}
              placeholder="Implant name"
              fullWidth
              disabled={!data.manufacturer}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
              Scan body type
            </span>
            <DropdownList
              options={SCAN_BODY_TYPES}
              value={data.scanBodyType ?? ''}
              onChange={(v) => onChange({ ...data, scanBodyType: v || undefined })}
              placeholder="Scan body type"
              fullWidth
            />
          </div>
        </div>
      )}
    </div>
  );
}

function dentureTypeLabel(value: string): string {
  return DENTURE_TYPES.find((t) => t.value === value)?.label ?? '';
}

function DentureTypePicker({
  options,
  value,
  onSelect,
  iconResolver,
  columns = 3,
}: {
  options?: { value: string; label: string }[];
  value: string | null;
  onSelect: (v: any) => void;
  iconResolver?: (value: string) => React.ReactNode;
  columns?: number;
}) {
  const opts = options ?? DENTURE_TYPES.map((t) => ({ value: t.value, label: t.label }));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 12 }}>
      {opts.map((t) => {
        const selected = value === t.value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onSelect(t.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              minHeight: 64,
              borderRadius: 'var(--ads-radius-sm)',
              border: `1px solid ${selected ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
              backgroundColor: selected
                ? 'color-mix(in srgb, var(--ads-blue-500) 8%, var(--ads-bg-surface))'
                : 'var(--ads-bg-surface)',
              boxShadow: selected
                ? '0 0 0 3px color-mix(in srgb, var(--ads-blue-500) 18%, transparent)'
                : 'var(--ads-shadow-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--ads-font-sans)',
              textAlign: 'left',
              transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
            }}
          >
            {iconResolver ? iconResolver(t.value) : <DentureTypeIcon variant={t.value} />}
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DentureTypeIcon({ variant }: { variant: string }) {
  const stroke = 'var(--ads-text-primary)';
  if (variant === 'full') {
    return (
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
        <path d="M3 6 C 3 2, 25 2, 25 6 C 25 14, 20 17, 14 17 C 8 17, 3 14, 3 6 Z" stroke={stroke} strokeWidth="1.5" fill="none" />
        {[7, 11, 14, 17, 21].map((x, i) => (
          <ellipse key={i} cx={x} cy="6.5" rx="1.6" ry="2.4" stroke={stroke} strokeWidth="1.1" fill="none" />
        ))}
      </svg>
    );
  }
  if (variant === 'copy') {
    return (
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
        <path d="M5 8 C 5 4, 23 4, 23 8 C 23 14, 19 17, 14 17 C 9 17, 5 14, 5 8 Z" stroke={stroke} strokeWidth="1.5" fill="color-mix(in srgb, currentColor 6%, transparent)" />
        <path d="M2 5 C 2 1, 20 1, 20 5" stroke={stroke} strokeWidth="1.5" fill="none" />
      </svg>
    );
  }
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
      <path d="M3 6 C 3 2, 25 2, 25 6 C 25 14, 20 17, 14 17 C 8 17, 3 14, 3 6 Z" stroke={stroke} strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
    </svg>
  );
}

function DentureJawCard({
  title,
  expanded,
  onToggle,
  onRemove,
  serviceType,
  onServiceTypeChange,
  toothShade,
  onToothShadeChange,
  gingivaShade,
  onGingivaShadeChange,
  occlusion,
  onOcclusionChange,
  hideOcclusion,
  advanced,
  onAdvancedChange,
  aesthetic,
  onAestheticChange,
  measurements,
  onMeasurementsChange,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  serviceType: 'design' | 'design-manufacturing' | null;
  onServiceTypeChange: (v: 'design' | 'design-manufacturing' | null) => void;
  toothShade: string | null;
  onToothShadeChange: (v: string | null) => void;
  gingivaShade: string | null;
  onGingivaShadeChange: (v: string | null) => void;
  occlusion?: string | null;
  onOcclusionChange?: (v: string | null) => void;
  advanced: boolean;
  onAdvancedChange: (v: boolean) => void;
  aesthetic: string | null;
  onAestheticChange: (v: string | null) => void;
  measurements: string[];
  onMeasurementsChange: (v: string[]) => void;
  hideOcclusion?: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-md, 12px)',
        boxShadow: 'var(--ads-shadow-sm)',
        overflow: 'hidden',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      <header
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px',
          cursor: 'pointer',
          fontFamily: 'var(--ads-font-sans)',
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--ads-text-primary)', flex: 1 }}>
          {title}
        </span>
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            width: 32,
            height: 32,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ads-text-muted)',
            borderRadius: 'var(--ads-radius-sm)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 4h10M6 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5 4l1 9a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1l1-9" />
          </svg>
        </button>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="var(--ads-text-muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </header>

      {expanded && (
        <div style={{ padding: '16px 20px 20px', borderTop: '1px solid var(--ads-border-subtle)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>Service type</span>
            <ChipPicker
              options={[
                { value: 'design',                label: 'Design' },
                { value: 'design-manufacturing',  label: 'Design & manufacturing' },
              ]}
              value={serviceType}
              onSelect={(v) => onServiceTypeChange(v as 'design' | 'design-manufacturing' | null)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 360 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
              Tooth shade <span style={{ color: 'var(--ads-text-muted)', fontWeight: 400 }}>(optional)</span>
            </span>
            <DropdownList
              options={SHADE_VALUES_VITA_CLASSICAL.map((v) => ({ value: v, label: v }))}
              value={toothShade ?? ''}
              onChange={(v) => onToothShadeChange(v || null)}
              placeholder="Select shade"
              fullWidth
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
              Gingiva shade <span style={{ color: 'var(--ads-text-muted)', fontWeight: 400 }}>(optional)</span>
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {DENTURE_GINGIVA_SHADES.map((g) => {
                const sel = gingivaShade === g.value;
                return (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => onGingivaShadeChange(sel ? null : g.value)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 14px',
                      borderRadius: 'var(--ads-radius-pill)',
                      border: `1px solid ${sel ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
                      backgroundColor: sel
                        ? 'color-mix(in srgb, var(--ads-blue-500) 10%, var(--ads-bg-surface))'
                        : 'var(--ads-bg-surface)',
                      cursor: 'pointer',
                      fontFamily: 'var(--ads-font-sans)',
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'var(--ads-text-primary)',
                    }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: g.color,
                        border: g.value === 'other' ? '1px solid var(--ads-border-default)' : 'none',
                      }}
                    />
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          {!hideOcclusion && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 360 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
                Occlusion guidance <span style={{ color: 'var(--ads-text-muted)', fontWeight: 400 }}>(optional)</span>
              </span>
              <DropdownList
                options={DENTURE_OCCLUSION_GUIDANCE}
                value={occlusion ?? ''}
                onChange={(v) => onOcclusionChange?.(v || null)}
                placeholder="Select guidance"
                fullWidth
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => onAdvancedChange(!advanced)}
            style={{
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: 14,
              color: 'var(--ads-text-primary)',
            }}
          >
            <span
              style={{
                width: 32,
                height: 18,
                borderRadius: 9999,
                backgroundColor: advanced ? 'var(--ads-blue-500)' : 'var(--ads-border-default)',
                position: 'relative',
                transition: 'background-color var(--ads-duration-fast) var(--ads-ease-standard)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: advanced ? 16 : 2,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  transition: 'left var(--ads-duration-fast) var(--ads-ease-standard)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}
              />
            </span>
            <span>
              Show advanced options <span style={{ color: 'var(--ads-text-muted)' }}>(optional)</span>
            </span>
          </button>

          {advanced && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
                  Tooth aesthetics category <span style={{ color: 'var(--ads-text-muted)', fontWeight: 400 }}>(optional)</span>
                </span>
                <ChipPicker
                  options={DENTURE_TOOTH_AESTHETICS}
                  value={aesthetic}
                  onSelect={(v) => onAestheticChange(v)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
                  Measurements <span style={{ color: 'var(--ads-text-muted)', fontWeight: 400 }}>(optional)</span>
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {DENTURE_MEASUREMENTS.map((m) => {
                    const sel = measurements.includes(m.value);
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() =>
                          onMeasurementsChange(
                            sel ? measurements.filter((x) => x !== m.value) : [...measurements, m.value]
                          )
                        }
                        style={{
                          padding: '8px 16px',
                          borderRadius: 'var(--ads-radius-pill)',
                          border: `1px solid ${sel ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
                          backgroundColor: sel
                            ? 'color-mix(in srgb, var(--ads-blue-500) 10%, var(--ads-bg-surface))'
                            : 'var(--ads-bg-surface)',
                          color: sel ? 'var(--ads-blue-500)' : 'var(--ads-text-primary)',
                          fontFamily: 'var(--ads-font-sans)',
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function DentureSections({
  draft,
  updateDraft,
  showError,
  isPartial,
}: {
  draft: OrderDraft;
  updateDraft: (patch: Partial<OrderDraft>) => void;
  showError?: boolean;
  isPartial?: boolean;
}) {
  const inv = (cond: boolean) => !!showError && cond;
  return (
    <>
      <DetailsSection title="Stage" invalid={inv(!draft.dentureStage)}>
        <ChipPicker
          options={DENTURE_STAGES}
          value={draft.dentureStage}
          onSelect={(v) => updateDraft({ dentureStage: v })}
          invalid={inv(!draft.dentureStage)}
        />
      </DetailsSection>

      {isPartial && (
        <>
          <DetailsSection title="Kennedy class" helpKey="kennedy" invalid={inv(!draft.kennedyClass)}>
            <ChipPicker
              options={KENNEDY_CLASSES.map((k) => ({ value: k.value, label: k.label.split('—')[0].trim() }))}
              value={draft.kennedyClass}
              onSelect={(v) => updateDraft({ kennedyClass: v })}
              invalid={inv(!draft.kennedyClass)}
            />
          </DetailsSection>

          <DetailsSection title="Framework" invalid={inv(!draft.frameworkMaterial)}>
            <ChipPicker
              options={FRAMEWORK_MATERIALS}
              value={draft.frameworkMaterial}
              onSelect={(v) => updateDraft({ frameworkMaterial: v })}
              invalid={inv(!draft.frameworkMaterial)}
            />
          </DetailsSection>

          <DetailsSection title="Major connector" optional>
            <DropdownList
              options={MAJOR_CONNECTORS}
              value={draft.majorConnector ?? ''}
              onChange={(v) => updateDraft({ majorConnector: v })}
              placeholder="Select…"
              fullWidth
            />
          </DetailsSection>

          <DetailsSection title="Clasps per abutment">
            <ClaspPerToothPicker
              abutments={draft.teeth}
              clasps={draft.claspsByTooth}
              frameworkMaterial={draft.frameworkMaterial}
              onChange={(claspsByTooth) => updateDraft({ claspsByTooth })}
            />
          </DetailsSection>
        </>
      )}

      <DetailsSection title="Material" optional>
        <ChipPicker
          options={DENTURE_MATERIALS}
          value={draft.material}
          onSelect={(v) => updateDraft({ material: v })}
        />
      </DetailsSection>

      <DetailsSection title="Tooth shade" invalid={inv(!draft.toothShade)}>
        <ShadeSwatchPicker
          label=""
          values={SHADE_VALUES_VITA_CLASSICAL}
          value={draft.toothShade}
          onSelect={(v) => updateDraft({ toothShade: v })}
        />
      </DetailsSection>

      <DetailsSection title="Tooth mold" invalid={inv(!draft.toothMold)}>
        <ToothMoldGallery
          value={draft.toothMold}
          onSelect={(v) => updateDraft({ toothMold: v })}
        />
      </DetailsSection>

      <DetailsSection title="Gingival shade" optional>
        <ChipPicker
          options={GINGIVAL_SHADES}
          value={draft.gingivalShade}
          onSelect={(v) => updateDraft({ gingivalShade: v })}
        />
      </DetailsSection>

      <DetailsSection title="Occlusion" optional>
        <ChipPicker
          options={DENTURE_OCCLUSAL_SCHEMES}
          value={draft.occlusalScheme}
          onSelect={(v) => updateDraft({ occlusalScheme: v })}
        />
      </DetailsSection>

      <DetailsSection title="VDO" optional>
        <div style={{ maxWidth: 200 }}>
          <NumericFieldWithUnit label="" unit="mm" value={draft.vdo} onChange={(v) => updateDraft({ vdo: v })} placeholder="Vertical dimension" />
        </div>
      </DetailsSection>

      {(draft.restorationPlan === 'overdenture' || draft.attachmentSystem) && (
        <DetailsSection title="Attachment system">
          <ChipPicker
            options={ATTACHMENT_SYSTEMS}
            value={draft.attachmentSystem}
            onSelect={(v) => updateDraft({ attachmentSystem: v })}
          />
        </DetailsSection>
      )}
    </>
  );
}

/* ─── Custom order ─── */

function CustomOrderSections({
  draft,
  updateDraft,
  showError,
}: {
  draft: OrderDraft;
  updateDraft: (patch: Partial<OrderDraft>) => void;
  showError?: boolean;
}) {
  const descTooShort = draft.customDescription.trim().length < 30;
  return (
    <>
      <DetailsSection title="Describe what you need" invalid={!!showError && descTooShort}>
        <TextArea
          value={draft.customDescription}
          onChange={(e) => updateDraft({ customDescription: e.target.value })}
          placeholder="Intended use, material preference, references…"
          fullWidth
          rows={4}
        />
        <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ads-text-muted)' }}>
          {draft.customDescription.length} / 30 chars min
        </div>
      </DetailsSection>

      <DetailsSection title="Callback" invalid={!!showError && !draft.contactMethod}>
        <ChipPicker
          options={[
            { value: 'phone', label: 'Phone' },
            { value: 'email', label: 'Email' },
          ]}
          value={draft.contactMethod}
          onSelect={(v) => updateDraft({ contactMethod: v as 'phone' | 'email' })}
          invalid={!!showError && !draft.contactMethod}
        />
      </DetailsSection>

      <Notification type="info" title="Custom orders typically add 3–5 days for lab review" />
    </>
  );
}

/* ─── Reusable controls ─── */

function CardOptionGrid({
  options,
  value,
  onSelect,
  columns = 3,
}: {
  options: { value: string; label: string; sub?: string; disabled?: boolean }[];
  value: string | null;
  onSelect: (v: string) => void;
  columns?: number;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 10 }}>
      {options.map((opt) => {
        const selected = value === opt.value;
        const disabled = !!opt.disabled;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => !disabled && onSelect(opt.value)}
            disabled={disabled}
            style={{
              textAlign: 'left',
              padding: '12px 14px',
              minHeight: 56,
              borderRadius: 'var(--ads-radius-sm)',
              border: '1px solid var(--ads-border-subtle)',
              backgroundColor: selected
                ? 'color-mix(in srgb, var(--ads-blue-500) 6%, var(--ads-bg-surface))'
                : 'var(--ads-bg-surface)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              fontFamily: 'var(--ads-font-sans)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              transition: 'background-color var(--ads-duration-fast) var(--ads-ease-standard)',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>{opt.label}</span>
            {opt.sub && (
              <span style={{ fontSize: 12, color: 'var(--ads-text-muted)' }}>{opt.sub}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ChipMultiSelect({
  options,
  values,
  onChange,
}: {
  options: { value: string; label: string }[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (v: string) => {
    onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => (
        <ChipButton
          key={opt.value}
          selected={values.includes(opt.value)}
          onClick={() => toggle(opt.value)}
        >
          {opt.label}
        </ChipButton>
      ))}
    </div>
  );
}

/* ─── Single-select chip group ─── */

function ChipPicker({
  options,
  value,
  onSelect,
}: {
  options: { value: string; label: string; disabled?: boolean }[];
  value: string | null;
  onSelect: (v: string) => void;
  /** Accepted for backward compat; chips never render an error state — only the section title does. */
  invalid?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => (
        <ChipButton
          key={opt.value}
          selected={value === opt.value}
          disabled={opt.disabled}
          onClick={() => !opt.disabled && onSelect(opt.value)}
        >
          {opt.label}
        </ChipButton>
      ))}
    </div>
  );
}

function ChipButton({
  children,
  selected,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 16px',
        borderRadius: 'var(--ads-radius-pill)',
        border: '1px solid var(--ads-border-subtle)',
        backgroundColor: selected
          ? 'color-mix(in srgb, var(--ads-blue-500) 10%, var(--ads-bg-surface))'
          : 'var(--ads-bg-surface)',
        color: selected ? 'var(--ads-blue-500)' : 'var(--ads-text-primary)',
        fontFamily: 'var(--ads-font-sans)',
        fontSize: 14,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
      }}
    >
      {children}
    </button>
  );
}

function NumericFieldWithUnit({
  label,
  unit,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'var(--ads-font-sans)', fontSize: 12, color: 'var(--ads-text-label)' }}>
      <span>{label}</span>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: 36,
            padding: '0 36px 0 12px',
            border: '1px solid var(--ads-border-default)',
            borderRadius: 'var(--ads-radius-sm)',
            fontFamily: 'var(--ads-font-sans)',
            fontSize: 14,
            color: 'var(--ads-text-primary)',
            backgroundColor: 'var(--ads-bg-surface)',
          }}
        />
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--ads-text-muted)' }}>{unit}</span>
      </div>
    </label>
  );
}

/* ─── Notes field — mirrors the Info-page NotesField visual treatment, single value (no thread) ─── */

function NotesField({
  value,
  onChange,
  placeholder = 'Notes here',
  emptyHelper = 'Type below to add notes',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  emptyHelper?: string;
}) {
  const isEmpty = value.trim().length === 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Body — empty state when no notes, otherwise the saved note as a card */}
      <div style={{ minHeight: 100 }}>
        {isEmpty ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '24px 20px',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--ads-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
              No notes yet
            </div>
            <div style={{ fontSize: 13, color: 'var(--ads-text-muted)', fontFamily: 'var(--ads-font-sans)' }}>
              {emptyHelper}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              padding: '10px 12px',
              backgroundColor: 'var(--ads-bg-muted)',
              borderRadius: 'var(--ads-radius-sm)',
            }}
          >
            <div
              style={{
                flex: 1,
                fontSize: 13,
                fontFamily: 'var(--ads-font-sans)',
                color: 'var(--ads-text-primary)',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {value}
            </div>
            <button
              type="button"
              onClick={() => onChange('')}
              aria-label="Clear notes"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                borderRadius: 'var(--ads-radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ads-text-muted)',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Input bar — matches the dedicated-page treatment */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderRadius: 'var(--ads-radius-sm)',
          border: '1px solid var(--ads-border-subtle)',
          padding: '10px 14px',
          backgroundColor: 'var(--ads-bg-surface)',
        }}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: 13,
            fontFamily: 'var(--ads-font-sans)',
            color: 'var(--ads-text-primary)',
          }}
        />
        <span
          aria-hidden
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: value.trim() ? 'var(--ads-blue-500)' : 'var(--ads-text-muted)',
            transition: 'color var(--ads-duration-fast) var(--ads-ease-standard)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function ShadeSwatchPicker({
  label,
  values,
  value,
  onSelect,
}: {
  label: string;
  values: string[];
  value: string | null;
  onSelect: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--ads-font-sans)' }}>
      <span style={{ fontSize: 12, color: 'var(--ads-text-label)' }}>{label}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {values.map((v) => {
          const selected = value === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onSelect(v)}
              style={{
                width: 44,
                height: 32,
                padding: '4px 6px',
                borderRadius: 'var(--ads-radius-sm)',
                border: selected ? '2px solid var(--ads-blue-500)' : '1px solid var(--ads-border-subtle)',
                backgroundColor: shadeSwatchBg(v),
                color: shadeSwatchText(v),
                fontFamily: 'inherit',
                fontSize: 11,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
              }}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Approximate visual-swatch color for VITA / bleach shades — for the picker preview only. */
function shadeSwatchBg(v: string): string {
  if (v.startsWith('BL')) return '#F8F2DC';
  const code = v.charAt(0);
  const palette: Record<string, string> = {
    A: '#EEDDC2',
    B: '#F0E2C0',
    C: '#E5D4B0',
    D: '#E0CFB0',
  };
  return palette[code] ?? '#F2EAD8';
}
function shadeSwatchText(_v: string): string {
  return 'rgba(0,0,0,0.85)';
}

/* ─── Clasp-per-tooth picker ─── */

function ClaspPerToothPicker({
  abutments,
  clasps,
  frameworkMaterial,
  onChange,
}: {
  abutments: number[];
  clasps: Record<number, string>;
  frameworkMaterial: string | null;
  onChange: (next: Record<number, string>) => void;
}) {
  if (abutments.length === 0) {
    return (
      <Notification type="info" title="No abutment teeth selected">
        Select abutment teeth on the chart above. Each abutment needs a clasp design.
      </Notification>
    );
  }
  const flexible = frameworkMaterial === 'flexible';
  const allowed = flexible
    ? CLASP_DESIGNS.filter((c) => c.value === 'wrought')
    : CLASP_DESIGNS;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {flexible && (
        <Notification type="warning" title="Flexible (Valplast) framework">
          Cast clasps aren't compatible. Only wrought-wire retention is available.
        </Notification>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
        {abutments.slice().sort((a, b) => a - b).map((tooth) => (
          <div
            key={tooth}
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr',
              gap: 12,
              alignItems: 'center',
              padding: '10px 12px',
              backgroundColor: 'var(--ads-bg-page)',
              border: '1px solid var(--ads-border-subtle)',
              borderRadius: 'var(--ads-radius-sm)',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 32,
                borderRadius: 'var(--ads-radius-sm)',
                backgroundColor: 'var(--ads-bg-surface)',
                border: '1px solid var(--ads-border-subtle)',
                fontFamily: 'var(--ads-font-sans)',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--ads-text-primary)',
              }}
            >
              #{tooth}
            </span>
            <DropdownList
              options={allowed}
              value={clasps[tooth] ?? ''}
              onChange={(v) => onChange({ ...clasps, [tooth]: v })}
              placeholder="Select clasp design…"
              fullWidth
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Tooth mold visual gallery ─── */

function ToothMoldGallery({
  value,
  onSelect,
}: {
  value: string | null;
  onSelect: (v: string) => void;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {TOOTH_MOLDS.map((m) => {
        const selected = value === m.value;
        return (
          <button
            key={m.value}
            type="button"
            onClick={() => onSelect(m.value)}
            style={{
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              padding: 0,
              borderRadius: 'var(--ads-radius-sm)',
              border: '1px solid var(--ads-border-subtle)',
              backgroundColor: 'var(--ads-bg-surface)',
              cursor: 'pointer',
              fontFamily: 'var(--ads-font-sans)',
              overflow: 'hidden',
              transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
            }}
          >
            <div
              style={{
                height: 80,
                backgroundColor: selected
                  ? 'color-mix(in srgb, var(--ads-blue-500) 8%, var(--ads-bg-page))'
                  : 'var(--ads-bg-page)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid var(--ads-border-subtle)',
                color: selected ? 'var(--ads-blue-500)' : 'var(--ads-text-muted)',
                transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
              }}
            >
              <ToothMoldIllustration shape={m.shape} />
            </div>
            <div style={{ padding: '10px 12px 12px' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)' }}>{m.label}</div>
              <div style={{ fontSize: 11, color: 'var(--ads-text-muted)', marginTop: 2 }}>{m.blurb}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ToothMoldIllustration({ shape }: { shape: 'ovoid' | 'square' | 'tapered' }) {
  // 6 anterior tooth silhouettes (#13–23) showing the mold characteristic.
  const stroke = 'currentColor';
  const sw = 1.4;
  // Width of each tooth varies by shape: ovoid = balanced, square = wider/blockier, tapered = narrower at incisal edge
  const teeth = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((i) => 38 + i * 12);
  return (
    <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
      {teeth.map((cx, i) => {
        const isCanine = i === 0 || i === 5;
        const top = 14;
        const bottom = 46;
        if (shape === 'ovoid') {
          return (
            <path
              key={i}
              d={`M ${cx - 5} ${top} Q ${cx - 5.5} ${(top + bottom) / 2} ${cx - 4} ${bottom} Q ${cx} ${bottom + 2} ${cx + 4} ${bottom} Q ${cx + 5.5} ${(top + bottom) / 2} ${cx + 5} ${top} Q ${cx} ${top - 2} ${cx - 5} ${top} Z`}
              stroke={stroke}
              strokeWidth={sw}
              fill="color-mix(in srgb, currentColor 6%, transparent)"
            />
          );
        }
        if (shape === 'square') {
          return (
            <path
              key={i}
              d={`M ${cx - 5.5} ${top} L ${cx + 5.5} ${top} L ${cx + 5.5} ${bottom - 2} Q ${cx} ${bottom + 2} ${cx - 5.5} ${bottom - 2} Z`}
              stroke={stroke}
              strokeWidth={sw}
              fill="color-mix(in srgb, currentColor 8%, transparent)"
            />
          );
        }
        // tapered
        return (
          <path
            key={i}
            d={`M ${cx - 5.5} ${top} Q ${cx} ${top - 2} ${cx + 5.5} ${top} L ${cx + 3} ${bottom} Q ${cx} ${bottom + 2} ${cx - 3} ${bottom} Z`}
            stroke={stroke}
            strokeWidth={sw}
            fill={isCanine ? 'color-mix(in srgb, currentColor 10%, transparent)' : 'color-mix(in srgb, currentColor 4%, transparent)'}
          />
        );
      })}
    </svg>
  );
}

/* ============================================================================
   Original sub-step components (Provider, Location, Procedure, Teeth, …)
   ============================================================================ */

function ProviderStep({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: 13, color: 'var(--ads-text-muted)' }}>
        Choose the lab or service provider that will fulfill this order.
      </div>
      <DropdownList
        label="Service provider"
        options={LAB_DESTINATIONS}
        value={value ?? ''}
        onChange={onChange}
        placeholder="Select a provider…"
        fullWidth
      />
    </div>
  );
}

/* ─── Service provider cards (DS Core Create / Your preferred lab) ─── */
const TEMP_PROVIDER_CARDS = [
  { value: 'lab-a', label: 'DS Core Create' },
  { value: 'lab-b', label: 'Your preferred lab' },
];

function ServiceProviderCardPicker({
  value,
  onSelect,
  cards,
}: {
  value: string | null;
  onSelect: (v: string) => void;
  cards?: { value: string; label: string }[];
}) {
  const list = cards ?? TEMP_PROVIDER_CARDS;
  const primaryValue = list[0]?.value;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {list.map((p) => {
        const selected = value === p.value;
        const isPrimary = p.value === primaryValue;
        return (
          <button
            key={p.value}
            type="button"
            onClick={() => onSelect(p.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 18px',
              minHeight: 64,
              borderRadius: 'var(--ads-radius-sm)',
              border: `1px solid ${selected ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
              backgroundColor: selected
                ? 'color-mix(in srgb, var(--ads-blue-500) 8%, var(--ads-bg-surface))'
                : 'var(--ads-bg-surface)',
              boxShadow: selected
                ? '0 0 0 3px color-mix(in srgb, var(--ads-blue-500) 18%, transparent)'
                : 'var(--ads-shadow-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--ads-font-sans)',
              transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
            }}
          >
            {isPrimary ? (
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: 'var(--ads-blue-500)',
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                S
              </span>
            ) : (
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#fff',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
                </svg>
              </span>
            )}
            <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--ads-text-primary)' }}>
              {p.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Procedure type icon-card picker (Bridge / Crown / Inlay / Onlay / Veneer) ─── */

const PROCEDURE_CARD_COLORS: Record<string, string> = {
  crown:  '#9F00A7',
  bridge: '#5FD4C4',
  veneer: 'var(--ads-background-highlight-orange)',
  inlay:  '#F9A8D4',
  onlay:  '#AB8ED9',
};

function ProcedureTypeCardPicker({
  options,
  value,
  onSelect,
}: {
  options: { value: string; label: string }[];
  value: string | null;
  onSelect: (v: string) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(options.length, 5)}, 1fr)`,
        gap: 12,
      }}
    >
      {options.map((p) => {
        const selected = value === p.value;
        const accent = PROCEDURE_CARD_COLORS[p.value] ?? 'var(--ads-blue-500)';
        return (
          <button
            key={p.value}
            type="button"
            onClick={() => onSelect(p.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 18px',
              minHeight: 56,
              borderRadius: 'var(--ads-radius-sm)',
              border: `1px solid ${selected ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
              backgroundColor: selected
                ? 'color-mix(in srgb, var(--ads-blue-500) 8%, var(--ads-bg-surface))'
                : 'var(--ads-bg-surface)',
              boxShadow: selected
                ? '0 0 0 3px color-mix(in srgb, var(--ads-blue-500) 18%, transparent)'
                : 'var(--ads-shadow-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--ads-font-sans)',
              transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
            }}
          >
            <ProcedureTypeIcon variant={p.value} color={accent} />
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>
              {p.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ProcedureTypeIcon({ variant, color }: { variant: string; color: string }) {
  const stroke = color;
  const sw = 1.6;
  switch (variant) {
    case 'bridge':
      return (
        <svg width="22" height="20" viewBox="0 0 24 22" fill="none">
          <path d="M3 14 L 6 6 L 12 6 L 12 14 Z" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M12 14 L 12 6 L 18 6 L 21 14 Z" stroke={stroke} strokeWidth={sw} fill="none" />
          <line x1="2" y1="18" x2="22" y2="18" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case 'crown':
      return (
        <svg width="22" height="20" viewBox="0 0 24 22" fill="none">
          <path d="M5 16 C 5 9, 19 9, 19 16 C 17 18, 7 18, 5 16 Z" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M6 11 C 8 7, 16 7, 18 11" stroke={stroke} strokeWidth={sw} fill="none" />
        </svg>
      );
    case 'inlay':
      return (
        <svg width="22" height="20" viewBox="0 0 24 22" fill="none">
          <path d="M6 12 C 6 5, 18 5, 18 12 C 18 17, 14 19, 12 19 C 10 19, 6 17, 6 12 Z" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M9 11 L 15 11 L 14 14 L 10 14 Z" stroke={stroke} strokeWidth={sw} fill={stroke} fillOpacity="0.18" />
        </svg>
      );
    case 'onlay':
      return (
        <svg width="22" height="20" viewBox="0 0 24 22" fill="none">
          <path d="M6 12 C 6 5, 18 5, 18 12 C 18 17, 14 19, 12 19 C 10 19, 6 17, 6 12 Z" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M7 10 L 17 10 L 16 14 L 8 14 Z" stroke={stroke} strokeWidth={sw} fill={stroke} fillOpacity="0.18" />
        </svg>
      );
    case 'veneer':
      return (
        <svg width="22" height="20" viewBox="0 0 24 22" fill="none">
          <path d="M9 4 L 15 4 L 17 10 C 16 16, 14 19, 12 19 C 10 19, 8 16, 7 10 Z" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M10 6 L 14 6" stroke={stroke} strokeWidth="1" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Support type cards (Implant planning) ─── */

function SupportTypeCardPicker({
  value,
  onSelect,
}: {
  value: string | null;
  onSelect: (v: string) => void;
}) {
  const items = [
    { value: 'tooth',  label: 'Tooth supported guide'  },
    { value: 'bone',   label: 'Bone supported guide'   },
    { value: 'mucosa', label: 'Mucosa supported guide' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {items.map((item) => {
        const selected = value === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onSelect(item.value)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: 12,
              borderRadius: 'var(--ads-radius-md, 12px)',
              border: `1px solid ${selected ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
              backgroundColor: selected
                ? 'color-mix(in srgb, var(--ads-blue-500) 6%, var(--ads-bg-surface))'
                : 'var(--ads-bg-surface)',
              boxShadow: selected
                ? '0 0 0 3px color-mix(in srgb, var(--ads-blue-500) 18%, transparent)'
                : 'var(--ads-shadow-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--ads-font-sans)',
              textAlign: 'left',
              transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
            }}
          >
            <div
              style={{
                aspectRatio: '16 / 10',
                borderRadius: 'var(--ads-radius-sm)',
                backgroundColor: 'var(--ads-bg-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <SupportTypeIllustration variant={item.value} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SupportTypeIllustration({ variant }: { variant: string }) {
  const gum = '#FBC9BD';
  const gumDark = '#EAA59A';
  const bone = '#FFF3D9';
  const boneDots = '#E0C589';
  const sleeve = '#7C8A99';
  const sleeveDark = '#3A434E';
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 130" fill="none" preserveAspectRatio="xMidYMid meet">
      {/* Bone block */}
      <path d="M30 70 L 170 70 L 170 130 L 30 130 Z" fill={bone} />
      {[40, 60, 80, 100, 120, 140, 160].map((cx) => (
        <circle key={cx} cx={cx} cy={95 + (cx % 23)} r={4} fill={boneDots} opacity="0.55" />
      ))}
      {/* Gum */}
      <path d="M28 60 C 50 50, 70 65, 100 60 C 130 55, 150 70, 172 60 L 172 78 L 28 78 Z" fill={gum} />
      <path d="M28 60 C 50 50, 70 65, 100 60 C 130 55, 150 70, 172 60" stroke={gumDark} strokeWidth="1" fill="none" />

      {/* Tooth (only for tooth-supported) */}
      {variant === 'tooth' && (
        <path d="M118 8 C 110 14, 108 30, 110 44 C 112 56, 124 60, 130 50 C 138 40, 138 22, 132 12 C 128 6, 122 4, 118 8 Z" fill="#fff" stroke="#dcdcdc" />
      )}

      {/* Drill sleeve (always present) */}
      <rect x="80" y="14" width="40" height="34" rx="3" fill={sleeve} />
      <rect x="80" y="14" width="40" height="6" rx="3" fill={sleeveDark} />
      <rect x="86" y="48" width="28" height="22" rx="2" fill={sleeve} opacity={variant === 'mucosa' ? 0.55 : 1} />

      {/* For mucosa: emphasize gum collar around sleeve */}
      {variant === 'mucosa' && (
        <path d="M70 56 C 78 64, 122 64, 130 56 L 130 78 L 70 78 Z" fill={gumDark} opacity="0.5" />
      )}
    </svg>
  );
}

function LocationStep({ jaws, onToggle }: { jaws: ('upper' | 'lower')[]; onToggle: (jaw: 'upper' | 'lower') => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: 13, color: 'var(--ads-text-muted)' }}>
        Select one or both arches for this order.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {(['upper', 'lower'] as const).map((jaw) => {
          const selected = jaws.includes(jaw);
          return (
            <button
              key={jaw}
              type="button"
              onClick={() => onToggle(jaw)}
              style={{
                padding: '24px',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                borderRadius: 'var(--ads-radius-sm)',
                border: '1px solid var(--ads-border-subtle)',
                backgroundColor: selected ? 'color-mix(in srgb, var(--ads-blue-500) 6%, var(--ads-bg-surface))' : 'var(--ads-bg-surface)',
                cursor: 'pointer',
                fontFamily: 'var(--ads-font-sans)',
                transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
              }}
            >
              <JawIcon jaw={jaw} active={selected} />
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                {jaw === 'upper' ? 'Upper jaw' : 'Lower jaw'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ads-text-muted)' }}>
                {jaw === 'upper' ? 'Maxillary arch' : 'Mandibular arch'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function JawIcon({ jaw, active }: { jaw: 'upper' | 'lower'; active: boolean }) {
  const stroke = active ? 'var(--ads-blue-500)' : 'var(--ads-text-muted)';
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
      <path
        d={jaw === 'upper' ? 'M4 22 C 4 8, 44 8, 44 22' : 'M4 10 C 4 24, 44 24, 44 10'}
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={i} cx={8 + i * 4.5} cy={jaw === 'upper' ? 18 - Math.abs(i - 3.5) * 1.5 : 14 + Math.abs(i - 3.5) * 1.5} r="1.6" fill={stroke} />
      ))}
    </svg>
  );
}

function ProcedureStep({
  service,
  value,
  onSelect,
}: {
  service: ServiceId;
  value: string | null;
  onSelect: (v: string) => void;
}) {
  const options = PROCEDURE_TYPES_BY_SERVICE[service];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      {options.map((p) => {
        const selected = value === p.value;
        return (
          <button
            key={p.value}
            type="button"
            onClick={() => onSelect(p.value)}
            style={{
              textAlign: 'left',
              padding: '14px 16px',
              minHeight: 64,
              borderRadius: 'var(--ads-radius-sm)',
              border: '1px solid var(--ads-border-subtle)',
              backgroundColor: selected ? 'color-mix(in srgb, var(--ads-blue-500) 6%, var(--ads-bg-surface))' : 'var(--ads-bg-surface)',
              cursor: 'pointer',
              fontFamily: 'var(--ads-font-sans)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>{p.label}</span>
            {p.description && (
              <span style={{ fontSize: 12, color: 'var(--ads-text-muted)' }}>{p.description}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function TeethStep({
  jaws,
  selected,
  onChange,
}: {
  jaws: ('upper' | 'lower')[];
  selected: number[];
  onChange: (teeth: number[]) => void;
}) {
  const showUpper = jaws.length === 0 || jaws.includes('upper');
  const showLower = jaws.length === 0 || jaws.includes('lower');

  const toggle = (n: number) => {
    onChange(selected.includes(n) ? selected.filter((t) => t !== n) : [...selected, n]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: 13, color: 'var(--ads-text-muted)' }}>
        Click teeth to select them. FDI numbering — upper arch on top, lower arch below.
      </div>

      <div
        style={{
          padding: '20px 16px',
          backgroundColor: 'var(--ads-bg-page)',
          border: '1px solid var(--ads-border-subtle)',
          borderRadius: 'var(--ads-radius-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'center',
        }}
      >
        {showUpper && <ToothRow teeth={UPPER_TEETH} selected={selected} onToggle={toggle} />}
        {showUpper && showLower && (
          <div style={{ height: 1, width: '60%', backgroundColor: 'var(--ads-border-subtle)' }} />
        )}
        {showLower && <ToothRow teeth={LOWER_TEETH} selected={selected} onToggle={toggle} />}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: 13 }}>
          {selected.length === 0 ? (
            <span style={{ color: 'var(--ads-text-muted)' }}>No teeth selected.</span>
          ) : (
            <span>
              <strong>{selected.length}</strong> selected:{' '}
              <span style={{ color: 'var(--ads-text-muted)' }}>
                {selected.slice().sort((a, b) => a - b).join(', ')}
              </span>
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {showUpper && (
            <LinkButton size={36} onClick={() => onChange(Array.from(new Set([...selected, ...UPPER_TEETH])))}>
              All upper
            </LinkButton>
          )}
          {showLower && (
            <LinkButton size={36} onClick={() => onChange(Array.from(new Set([...selected, ...LOWER_TEETH])))}>
              All lower
            </LinkButton>
          )}
          <LinkButton
            size={36}
            onClick={() => onChange(Array.from(new Set([...selected, ...UPPER_TEETH, ...LOWER_TEETH])))}
          >
            All teeth
          </LinkButton>
          {selected.length > 0 && (
            <LinkButton size={36} onClick={() => onChange([])}>
              Clear
            </LinkButton>
          )}
        </div>
      </div>
    </div>
  );
}

function NightguardToothChart({
  selected,
  onChange,
}: {
  selected: number[];
  onChange: (teeth: number[]) => void;
}) {
  const toggle = (n: number) =>
    onChange(selected.includes(n) ? selected.filter((t) => t !== n) : [...selected, n]);

  const renderRow = (teeth: number[]) => (
    <div style={{ display: 'flex', gap: 3 }}>
      {teeth.map((n) => (
        <Tooth
          key={n}
          number={n}
          selected={selected.includes(n)}
          expanded={false}
          onClick={(e) => {
            e.stopPropagation();
            toggle(n);
          }}
        />
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {renderRow(UPPER_TEETH)}
      {renderRow(LOWER_TEETH)}
    </div>
  );
}

/* ─── Temp-restoration tooth chart with per-tooth procedure assignment ─── */

const TEMP_PROCEDURE_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: 'crown',  label: 'Crown',  color: '#9F00A7' },
  { value: 'bridge', label: 'Bridge', color: '#5FD4C4' },
  { value: 'veneer', label: 'Veneer', color: 'var(--ads-background-highlight-orange)' },
  { value: 'inlay',  label: 'Inlay',  color: '#F9A8D4' },
  { value: 'onlay',  label: 'Onlay',  color: '#AB8ED9' },
];

function TempRestorationToothChart({
  selected,
  procedureByTooth,
  procedureOptions,
  onChange,
}: {
  selected: number[];
  procedureByTooth: Record<number, string>;
  procedureOptions: Record<string, Record<string, string | number | boolean>>;
  onChange: (
    teeth: number[],
    procedureByTooth: Record<number, string>,
    procedureOptions?: Record<string, Record<string, string | number | boolean>>
  ) => void;
}) {
  const toggle = (n: number) => {
    if (selected.includes(n)) {
      const nextTeeth = selected.filter((t) => t !== n);
      const next = { ...procedureByTooth };
      delete next[n];
      onChange(nextTeeth, next);
    } else {
      onChange([...selected, n], procedureByTooth);
    }
  };

  const unassignedSelected = selected.filter((n) => !procedureByTooth[n]);

  const assignProcedureToUnassigned = (procedure: string) => {
    if (unassignedSelected.length === 0) return;
    const next = { ...procedureByTooth };
    unassignedSelected.forEach((n) => {
      next[n] = procedure;
    });
    onChange(selected, next);
  };

  const clearAll = () => {
    onChange([], {});
  };

  // Group selected teeth by their procedure assignment for the spec cards
  const groupedByProcedure = new Map<string, number[]>();
  selected.forEach((n) => {
    const proc = procedureByTooth[n];
    if (!proc) return;
    if (!groupedByProcedure.has(proc)) groupedByProcedure.set(proc, []);
    groupedByProcedure.get(proc)!.push(n);
  });

  const renderRow = (teeth: number[]) => (
    <div style={{ display: 'flex', gap: 3 }}>
      {teeth.map((n) => {
        const proc = procedureByTooth[n];
        const procColor = proc ? TEMP_PROCEDURE_OPTIONS.find((p) => p.value === proc)?.color : undefined;
        return (
          <Tooth
            key={n}
            number={n}
            selected={selected.includes(n) && !proc}
            color={procColor}
            procedure={proc}
            expanded={false}
            onClick={(e) => {
              e.stopPropagation();
              toggle(n);
            }}
          />
        );
      })}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
          Select teeth and assign procedures
        </span>
      </div>

      {selected.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--ads-background-interactive)',
              backgroundColor: 'var(--ads-background-highlight-blue)',
              padding: '3px 10px',
              borderRadius: 9999,
              fontFamily: 'var(--ads-font-sans)',
            }}
          >
            {selected.length} selected
          </span>
          <button
            type="button"
            onClick={clearAll}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: 12,
              padding: '0 8px',
              color: 'var(--ads-text-primary)',
            }}
          >
            Clear
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {renderRow(UPPER_TEETH)}
        {renderRow(LOWER_TEETH)}
      </div>

      {unassignedSelected.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)', marginBottom: 8 }}>
            Assign procedure to {unassignedSelected.length} tooth{unassignedSelected.length > 1 ? '' : ''}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {TEMP_PROCEDURE_OPTIONS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => assignProcedureToUnassigned(p.value)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  height: 32,
                  padding: '0 12px',
                  borderRadius: 'var(--ads-radius-sm)',
                  border: '1px solid var(--ads-border-subtle)',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontFamily: 'var(--ads-font-sans)',
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--ads-text-primary)',
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: p.color }} />
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {Array.from(groupedByProcedure.entries()).length > 0 && (
        <>
          <div style={{ height: 1, backgroundColor: 'var(--ads-border-subtle)', margin: '20px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Array.from(groupedByProcedure.entries()).map(([procedure, teeth]) => {
              const proc = TEMP_PROCEDURE_OPTIONS.find((p) => p.value === procedure);
              if (!proc) return null;
              const sortedTeeth = teeth.slice().sort((a, b) => a - b);
              return (
                <TempRestorationProcedureGroupCard
                  key={procedure}
                  procedure={proc}
                  teeth={sortedTeeth}
                  procedureByTooth={procedureByTooth}
                  selected={selected}
                  options={procedureOptions[procedure] ?? {}}
                  onChange={onChange}
                  onOptionsChange={(opts) =>
                    onChange(selected, procedureByTooth, {
                      ...procedureOptions,
                      [procedure]: opts,
                    })
                  }
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function TempRestorationProcedureGroupCard({
  procedure,
  teeth,
  procedureByTooth,
  selected,
  options,
  onChange,
  onOptionsChange,
}: {
  procedure: { value: string; label: string; color: string };
  teeth: number[];
  procedureByTooth: Record<number, string>;
  selected: number[];
  options: Record<string, string | number | boolean>;
  onChange: (
    teeth: number[],
    procedureByTooth: Record<number, string>,
    procedureOptions?: Record<string, Record<string, string | number | boolean>>
  ) => void;
  onOptionsChange: (next: Record<string, string | number | boolean>) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const removeGroup = () => {
    const nextProc = { ...procedureByTooth };
    teeth.forEach((n) => {
      delete nextProc[n];
    });
    const nextSelected = selected.filter((n) => !teeth.includes(n));
    onChange(nextSelected, nextProc);
  };
  const reassign = (newProcedure: string) => {
    const nextProc = { ...procedureByTooth };
    teeth.forEach((n) => {
      nextProc[n] = newProcedure;
    });
    onChange(selected, nextProc);
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: 'var(--ads-radius-md, 8px)',
        border: '1px solid var(--ads-border-subtle)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'visible',
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 12px',
          cursor: 'pointer',
          backgroundColor: 'white',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-sans)' }}>
          {teeth.length === 1 ? `Tooth ${teeth[0]}` : `Teeth ${teeth.join(', ')}`}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '2px 8px',
            borderRadius: 9999,
            border: `1px solid ${procedure.color}40`,
            backgroundColor: `${procedure.color}14`,
            fontSize: 11,
            fontWeight: 500,
            fontFamily: 'var(--ads-font-sans)',
            color: 'var(--ads-text-primary)',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: procedure.color }} />
          {procedure.label}
        </span>
        <div style={{ flex: 1 }} />
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="var(--ads-text-muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <path d="M3 5l4 4 4-4" />
        </svg>
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            removeGroup();
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--ads-text-muted)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div style={{ padding: 16, borderTop: '1px solid var(--ads-border-subtle)' }}>
          <TempProcedureOptionsPanel
            procedure={procedure.value}
            options={options}
            onChange={onOptionsChange}
            onReassign={reassign}
            currentProcedure={procedure.value}
          />
        </div>
      )}
    </div>
  );
}

/* ─── Per-procedure options renderer (Bridge / Crown / Inlay / Onlay / Veneer) ─── */

function TempProcedureOptionsPanel({
  procedure,
  options,
  onChange,
  onReassign,
  currentProcedure,
}: {
  procedure: string;
  options: Record<string, string | number | boolean>;
  onChange: (next: Record<string, string | number | boolean>) => void;
  onReassign: (next: string) => void;
  currentProcedure: string;
}) {
  const set = (key: string, value: string | number | boolean) =>
    onChange({ ...options, [key]: value });
  const advanced = options.advanced === true;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontFamily: 'var(--ads-font-sans)' }}>
      {/* Reassign procedure pill */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--ads-text-muted)', marginBottom: 6 }}>
          Procedure
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {TEMP_PROCEDURE_OPTIONS.map((p) => {
            const isCurrent = p.value === currentProcedure;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onReassign(p.value)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  height: 32,
                  padding: '0 10px',
                  borderRadius: 'var(--ads-radius-sm)',
                  border: isCurrent ? `2px solid ${p.color}` : '1px solid var(--ads-border-subtle)',
                  backgroundColor: 'white',
                  color: 'var(--ads-text-primary)',
                  fontSize: 11,
                  fontWeight: isCurrent ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: p.color }} />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Service type */}
      <ChipGroupField
        label="Service type"
        options={[
          { value: 'design',                label: 'Design' },
          { value: 'design-manufacturing',  label: 'Design & manufacturing' },
        ]}
        value={(options.serviceType as string) ?? null}
        onChange={(v) => set('serviceType', v)}
      />

      {/* Production unit */}
      <ChipGroupField
        label="Production unit"
        optional
        options={TEMP_PRODUCTION_UNITS}
        value={(options.productionUnit as string) ?? null}
        onChange={(v) => set('productionUnit', v)}
      />

      {/* Material class — Crown only */}
      {procedure === 'crown' && (
        <ChipGroupField
          label="Material class"
          optional
          options={TEMP_CROWN_MATERIAL_CLASSES}
          value={(options.materialClass as string) ?? null}
          onChange={(v) => set('materialClass', v)}
        />
      )}

      {/* Show advanced options toggle */}
      <button
        type="button"
        onClick={() => set('advanced', !advanced)}
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: 0,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: 14,
          color: 'var(--ads-text-primary)',
        }}
      >
        <span
          style={{
            width: 32,
            height: 18,
            borderRadius: 9999,
            backgroundColor: advanced ? 'var(--ads-blue-500)' : 'var(--ads-border-default)',
            position: 'relative',
            transition: 'background-color var(--ads-duration-fast) var(--ads-ease-standard)',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 2,
              left: advanced ? 16 : 2,
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#fff',
              transition: 'left var(--ads-duration-fast) var(--ads-ease-standard)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          />
        </span>
        <span>
          Show advanced options <span style={{ color: 'var(--ads-text-muted)' }}>(optional)</span>
        </span>
      </button>

      {advanced && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Bridge / Crown: Radial spacer + Occlusal spacer + Approximal contact + Occlusal contact */}
          {(procedure === 'bridge' || procedure === 'crown') && (
            <>
              <SpacerCardField
                label="Radial spacer"
                options={TEMP_SPACER_RADIAL}
                variant="spacer"
                value={(options.radialSpacer as string) ?? null}
                onChange={(v) => set('radialSpacer', v)}
              />
              <SpacerCardField
                label="Occlusal spacer"
                options={TEMP_SPACER_OCCLUSAL}
                variant="occlusal-spacer"
                value={(options.occlusalSpacer as string) ?? null}
                onChange={(v) => set('occlusalSpacer', v)}
              />
              <SpacerCardField
                label="Approximal contact"
                options={TEMP_APPROXIMAL_CONTACT}
                variant="approximal"
                value={(options.approximalContact as string) ?? null}
                onChange={(v) => set('approximalContact', v)}
              />
              <SpacerCardField
                label="Occlusal contact"
                options={TEMP_OCCLUSAL_CONTACT}
                variant="occlusal-contact"
                value={(options.occlusalContact as string) ?? null}
                onChange={(v) => set('occlusalContact', v)}
              />
            </>
          )}

          {/* Inlay: Spacer + Occlusal contact */}
          {procedure === 'inlay' && (
            <>
              <SpacerCardField
                label="Spacer"
                options={TEMP_SPACER_RADIAL}
                variant="spacer"
                value={(options.spacer as string) ?? null}
                onChange={(v) => set('spacer', v)}
              />
              <SpacerCardField
                label="Occlusal contact"
                options={TEMP_OCCLUSAL_CONTACT}
                variant="occlusal-contact"
                value={(options.occlusalContact as string) ?? null}
                onChange={(v) => set('occlusalContact', v)}
              />
            </>
          )}

          {/* Onlay: Spacer + Approximal contact + Occlusal contact */}
          {procedure === 'onlay' && (
            <>
              <SpacerCardField
                label="Spacer"
                options={TEMP_SPACER_RADIAL}
                variant="spacer"
                value={(options.spacer as string) ?? null}
                onChange={(v) => set('spacer', v)}
              />
              <SpacerCardField
                label="Approximal contact"
                options={TEMP_APPROXIMAL_CONTACT}
                variant="approximal"
                value={(options.approximalContact as string) ?? null}
                onChange={(v) => set('approximalContact', v)}
              />
              <SpacerCardField
                label="Occlusal contact"
                options={TEMP_OCCLUSAL_CONTACT}
                variant="occlusal-contact"
                value={(options.occlusalContact as string) ?? null}
                onChange={(v) => set('occlusalContact', v)}
              />
            </>
          )}

          {/* Veneer: Spacer + Thickness slider */}
          {procedure === 'veneer' && (
            <>
              <SpacerCardField
                label="Spacer"
                options={TEMP_VENEER_SPACER}
                variant="spacer"
                value={(options.spacer as string) ?? null}
                onChange={(v) => set('spacer', v)}
              />
              <ThicknessSliderField
                value={typeof options.thickness === 'number' ? options.thickness : 650}
                min={300}
                max={2000}
                onChange={(v) => set('thickness', v)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ChipGroupField({
  label,
  optional,
  options,
  value,
  onChange,
}: {
  label: string;
  optional?: boolean;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>
        {label} {optional && <span style={{ color: 'var(--ads-text-muted)', fontWeight: 400 }}>(optional)</span>}
      </span>
      <ChipPicker options={options} value={value} onSelect={(v) => v && onChange(v)} />
    </div>
  );
}

function SpacerCardField({
  label,
  options,
  variant,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string; sub: string }[];
  variant: 'spacer' | 'occlusal-spacer' | 'approximal' | 'occlusal-contact';
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>
        {label} <span style={{ color: 'var(--ads-text-muted)', fontWeight: 400 }}>(optional)</span>
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {options.map((o) => {
          const sel = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                padding: 10,
                borderRadius: 'var(--ads-radius-md, 12px)',
                border: `1px solid ${sel ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
                backgroundColor: sel
                  ? 'color-mix(in srgb, var(--ads-blue-500) 6%, var(--ads-bg-surface))'
                  : 'var(--ads-bg-surface)',
                boxShadow: sel
                  ? '0 0 0 3px color-mix(in srgb, var(--ads-blue-500) 18%, transparent)'
                  : 'var(--ads-shadow-sm)',
                cursor: 'pointer',
                fontFamily: 'var(--ads-font-sans)',
                textAlign: 'left',
                transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
              }}
            >
              <div
                style={{
                  aspectRatio: '16 / 10',
                  borderRadius: 'var(--ads-radius-sm)',
                  backgroundColor: 'var(--ads-bg-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <SpacerIllustration variant={variant} intensity={o.value as 'loose' | 'mid' | 'tight'} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                {o.label} <span style={{ color: 'var(--ads-text-muted)', fontWeight: 400 }}>({o.sub})</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SpacerIllustration({
  variant,
  intensity,
}: {
  variant: 'spacer' | 'occlusal-spacer' | 'approximal' | 'occlusal-contact';
  intensity: 'loose' | 'mid' | 'tight';
}) {
  const muted = 'var(--ads-text-muted)';
  // Approximate visual scale by intensity
  const widthFactor = intensity === 'loose' ? 1 : intensity === 'mid' ? 0.6 : 0.3;
  const accent = '#3a73f0';

  if (variant === 'spacer') {
    // crown silhouette with thin/thick blue spacer line at the inner radial edge
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 110" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M50 20 C 60 14, 140 14, 150 20 L 160 60 L 40 60 Z" fill="var(--ads-background-subtle-active)" />
        <path d="M30 60 L 170 60 L 170 100 L 30 100 Z" fill="var(--ads-border-accent)" />
        <path
          d="M55 22 C 65 18, 135 18, 145 22 L 150 58"
          stroke={accent}
          strokeWidth={3 * widthFactor + 1}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === 'occlusal-spacer') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 110" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M40 30 C 60 20, 140 20, 160 30 L 165 60 L 35 60 Z" fill="var(--ads-background-subtle-active)" />
        <path d="M30 60 L 170 60 L 170 100 L 30 100 Z" fill="var(--ads-border-accent)" />
        <path
          d="M48 28 C 75 18, 125 18, 152 28"
          stroke={accent}
          strokeWidth={3 * widthFactor + 1}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === 'approximal') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 110" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M70 25 L 130 25 L 145 80 L 55 80 Z" fill="var(--ads-background-subtle-active)" />
        <ellipse
          cx="68"
          cy="55"
          rx={6 + widthFactor * 6}
          ry={9 + widthFactor * 6}
          fill={intensity === 'loose' ? '#3a86ff' : intensity === 'mid' ? '#65c66c' : '#f5b13a'}
          opacity="0.85"
        />
      </svg>
    );
  }

  // occlusal-contact: heatmap on top
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 110" fill="none" preserveAspectRatio="xMidYMid meet">
      <path d="M50 30 L 150 30 L 165 80 L 35 80 Z" fill="var(--ads-background-subtle-active)" />
      <ellipse
        cx="100"
        cy="40"
        rx={20 + widthFactor * 20}
        ry={6 + widthFactor * 4}
        fill={intensity === 'loose' ? '#3a86ff' : intensity === 'mid' ? '#65c66c' : 'var(--ads-text-error)'}
        opacity="0.8"
      />
    </svg>
  );
}

function ThicknessSliderField({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>Thickness in μm</span>
        <span style={{ fontSize: 14, color: 'var(--ads-text-primary)' }}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={50}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--ads-blue-500)' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ads-text-muted)' }}>
        <span>{min}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

function ToothRow({
  teeth,
  selected,
  onToggle,
}: {
  teeth: number[];
  selected: number[];
  onToggle: (n: number) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
      {teeth.map((n) => {
        const isSelected = selected.includes(n);
        return (
          <button
            key={n}
            type="button"
            onClick={() => onToggle(n)}
            aria-pressed={isSelected}
            style={{
              width: 32,
              height: 38,
              borderRadius: 'var(--ads-radius-sm)',
              border: '1px solid var(--ads-border-default)',
              backgroundColor: isSelected
                ? 'color-mix(in srgb, var(--ads-blue-500) 14%, var(--ads-bg-surface))'
                : 'var(--ads-bg-surface)',
              color: isSelected ? 'var(--ads-blue-500)' : 'var(--ads-text-primary)',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: 12,
              fontWeight: isSelected ? 600 : 500,
              cursor: 'pointer',
              transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

function ManufacturerStep({
  value,
  onSelect,
}: {
  value: string | null;
  onSelect: (v: string) => void;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {IMPLANT_MANUFACTURERS.map((m) => {
        const selected = value === m.value;
        return (
          <button
            key={m.value}
            type="button"
            onClick={() => onSelect(m.value)}
            style={{
              textAlign: 'left',
              padding: '14px',
              minHeight: 90,
              borderRadius: 'var(--ads-radius-sm)',
              border: '1px solid var(--ads-border-subtle)',
              backgroundColor: selected ? 'color-mix(in srgb, var(--ads-blue-500) 6%, var(--ads-bg-surface))' : 'var(--ads-bg-surface)',
              cursor: 'pointer',
              fontFamily: 'var(--ads-font-sans)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>{m.label}</div>
            <div style={{ fontSize: 12, color: 'var(--ads-text-muted)', lineHeight: 1.4 }}>{m.blurb}</div>
          </button>
        );
      })}
    </div>
  );
}

function ProductLineStep({
  manufacturer,
  value,
  onChange,
}: {
  manufacturer: string;
  value: string | null;
  onChange: (v: string) => void;
}) {
  const options = PRODUCT_LINES_BY_MANUFACTURER[manufacturer] ?? [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: 13, color: 'var(--ads-text-muted)' }}>
        Pick the implant product line within the selected manufacturer.
      </div>
      <DropdownList
        label="Product line"
        options={options}
        value={value ?? ''}
        onChange={onChange}
        placeholder="Select a product line…"
        fullWidth
      />
    </div>
  );
}

function SupportStep({
  value,
  onSelect,
}: {
  value: SupportType | null;
  onSelect: (v: SupportType) => void;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {SUPPORT_TYPES.map((s) => {
        const selected = value === s.value;
        return (
          <button
            key={s.value}
            type="button"
            onClick={() => onSelect(s.value)}
            style={{
              textAlign: 'left',
              padding: '16px',
              minHeight: 140,
              borderRadius: 'var(--ads-radius-sm)',
              border: '1px solid var(--ads-border-subtle)',
              backgroundColor: selected ? 'color-mix(in srgb, var(--ads-blue-500) 6%, var(--ads-bg-surface))' : 'var(--ads-bg-surface)',
              cursor: 'pointer',
              fontFamily: 'var(--ads-font-sans)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <SupportIcon kind={s.value} active={selected} />
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>{s.label}</div>
            <div style={{ fontSize: 12, color: 'var(--ads-text-muted)', lineHeight: 1.4 }}>{s.description}</div>
          </button>
        );
      })}
    </div>
  );
}

function SupportIcon({ kind, active }: { kind: SupportType; active: boolean }) {
  const stroke = active ? 'var(--ads-blue-500)' : 'var(--ads-text-muted)';
  return (
    <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
      {kind === 'tooth' && (
        <>
          <rect x="8" y="6" width="6" height="10" rx="1.5" stroke={stroke} strokeWidth="1.6" />
          <rect x="26" y="6" width="6" height="10" rx="1.5" stroke={stroke} strokeWidth="1.6" />
          <rect x="4" y="18" width="32" height="6" rx="2" stroke={stroke} strokeWidth="1.6" />
        </>
      )}
      {kind === 'bone' && (
        <>
          <path d="M6 18 C 6 10, 34 10, 34 18 L 34 24 L 6 24 Z" stroke={stroke} strokeWidth="1.6" fill="none" />
          <line x1="10" y1="22" x2="30" y2="22" stroke={stroke} strokeWidth="1" strokeDasharray="2 2" />
        </>
      )}
      {kind === 'mucosa' && (
        <>
          <path d="M4 20 Q 12 14 20 20 T 36 20" stroke={stroke} strokeWidth="1.8" fill="none" />
          <path d="M4 24 Q 12 18 20 24 T 36 24" stroke={stroke} strokeWidth="1.6" fill="none" opacity="0.5" />
        </>
      )}
    </svg>
  );
}

function FilesStep({
  draft,
  updateDraft,
  onMobileUpload,
}: {
  draft: OrderDraft;
  updateDraft: (patch: Partial<OrderDraft>) => void;
  onMobileUpload: () => void;
}) {
  const isImplantPlanning = draft.service === 'implant-planning';
  const isNightguard = draft.service === 'nightguard';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      {/* ─── Files ─── */}
      <DetailsSection title="Attachments" optional>
        {isNightguard ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <FileDrop
              label="Upper jaw"
              hint=".stl or .ply"
              fileName={draft.upperJawFileName}
              onFile={(f) => updateDraft({ upperJawFileName: f })}
            />
            <FileDrop
              label="Lower jaw"
              hint=".stl or .ply"
              fileName={draft.lowerJawFileName}
              onFile={(f) => updateDraft({ lowerJawFileName: f })}
            />
            <FileDrop
              label="Bite"
              hint=".stl or .ply"
              fileName={draft.biteFileName}
              onFile={(f) => updateDraft({ biteFileName: f })}
            />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FileDrop
              label={isImplantPlanning ? 'CBCT scan (required)' : 'CBCT scan'}
              hint="DICOM or .zip · ≤6 months old"
              fileName={draft.cbctFileName}
              onFile={(f) => updateDraft({ cbctFileName: f })}
            />
            <FileDrop
              label="Prosthesis scan"
              hint=".stl, .ply, or .obj"
              fileName={draft.prosthesisFileName}
              onFile={(f) => updateDraft({ prosthesisFileName: f })}
            />
          </div>
        )}

        <button
          type="button"
          onClick={onMobileUpload}
          style={{
            marginTop: 12,
            padding: '12px 16px',
            borderRadius: 'var(--ads-radius-sm)',
            border: '1px dashed var(--ads-border-default)',
            backgroundColor: 'var(--ads-bg-surface)',
            cursor: 'pointer',
            fontFamily: 'var(--ads-font-sans)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            width: '100%',
          }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--ads-radius-sm)',
              backgroundColor: 'color-mix(in srgb, var(--ads-blue-500) 12%, transparent)',
              color: 'var(--ads-blue-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <QrIcon />
          </span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>Upload from mobile</div>
            <div style={{ fontSize: 12, color: 'var(--ads-text-muted)' }}>Scan a QR with your phone to hand off files</div>
          </div>
        </button>
      </DetailsSection>

    </div>
  );
}

/* ─── Cost / lead-time estimate card ─── */

function CostEstimateCard({ service, rush }: { service: ServiceId; rush: RushOption }) {
  const baseDays = SERVICE_LEAD_TIME_DAYS[service];
  const baseCost = SERVICE_COST_USD[service];
  const surcharge = rush === 'rush' ? 0.25 : rush === 'super-rush' ? 0.5 : 0;
  const days = rush === 'super-rush' ? 1 : rush === 'rush' ? Math.max(1, baseDays - 2) : baseDays;
  const cost = baseCost > 0 ? Math.round(baseCost * (1 + surcharge)) : null;
  const eta = new Date();
  eta.setDate(eta.getDate() + days);
  const etaLabel = eta.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  return (
    <div
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '14px 16px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 12,
        fontFamily: 'var(--ads-font-sans)',
      }}
    >
      <Stat label="Estimated turnaround" value={`${days} ${days === 1 ? 'day' : 'days'}`} />
      <Stat label="Estimated delivery" value={etaLabel} />
      <Stat
        label="Estimated cost"
        value={cost === null ? 'Quoted by lab' : `$${cost}${surcharge > 0 ? ` (+${Math.round(surcharge * 100)}%)` : ''}`}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>{label}</div>
      <div style={{ marginTop: 2, fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>{value}</div>
    </div>
  );
}

/* ─── Help popover system + content catalog ─── */

const FIELD_HELP = {
  material: {
    title: 'Restoration material',
    body: 'Material gates occlusal-clearance requirements (Zirconia 3Y: 1.0 mm, e.max: 1.5 mm, PFM: 1.5 mm) and the available cement options. Picking material first auto-validates everything downstream.',
  },
  margin: {
    title: 'Margin design',
    body: 'Chamfer is the default for full-coverage crowns. Shoulder is preferred for PFM / e.max anteriors. Feather/knife edge for partial-coverage gold. Margin location (sub/equi/supragingival) drives lab finishing.',
  },
  'ap-strategy': {
    title: 'A-P (anterior-posterior) strategy',
    body: 'How the case will resolve crowding or Angle-class discrepancy. IPR shaves enamel between teeth. Distalization moves posteriors back. Expansion widens the arch. Class II elastics use intermaxillary mechanics.',
  },
  kennedy: {
    title: 'Kennedy classification',
    body: 'Standard partial-denture classification. Class I = bilateral distal extension (free-end on both sides). Class II = unilateral distal extension. Class III = bounded edentulous span. Class IV = anterior crossing midline.',
  },
} as const;

function HelpPopover({ content }: { content: { title: string; body: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        aria-label={`Help: ${content.title}`}
        style={{
          width: 18,
          height: 18,
          borderRadius: 'var(--ads-radius-full)',
          border: '1px solid var(--ads-border-default)',
          backgroundColor: 'var(--ads-bg-surface)',
          color: 'var(--ads-text-muted)',
          fontSize: 11,
          fontWeight: 500,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--ads-font-sans)',
        }}
      >
        ?
      </button>
      {open && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            zIndex: 10,
            width: 280,
            padding: '12px 14px',
            backgroundColor: 'var(--ads-bg-surface)',
            border: '1px solid var(--ads-border-subtle)',
            borderRadius: 'var(--ads-radius-sm)',
            boxShadow: 'var(--ads-shadow-md)',
            fontFamily: 'var(--ads-font-sans)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)' }}>{content.title}</div>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--ads-text-muted)', lineHeight: 1.45 }}>{content.body}</p>
        </div>
      )}
    </span>
  );
}

function FileDrop({
  label,
  hint,
  fileName,
  onFile,
}: {
  label: string;
  hint: string;
  fileName: string | null;
  onFile: (name: string | null) => void;
}) {
  const [hover, setHover] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f.name);
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        minHeight: 132,
        padding: 16,
        border: `2px dashed ${hover ? 'var(--ads-blue-500)' : fileName ? 'var(--ads-blue-500)' : 'var(--ads-border-default)'}`,
        borderRadius: 'var(--ads-radius-sm)',
        backgroundColor: hover ? 'color-mix(in srgb, var(--ads-blue-500) 6%, var(--ads-bg-surface))' : 'var(--ads-bg-surface)',
        cursor: 'pointer',
        textAlign: 'center',
        fontFamily: 'var(--ads-font-sans)',
        transition: 'all var(--ads-duration-fast) var(--ads-ease-standard)',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f.name);
        }}
      />
      {fileName ? (
        <>
          <Icon name="check" size={20} color="var(--ads-blue-500)" />
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)' }}>{fileName}</div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onFile(null);
            }}
            style={{
              border: 'none',
              background: 'none',
              color: 'var(--ads-blue-500)',
              fontFamily: 'inherit',
              fontSize: 12,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Replace
          </button>
        </>
      ) : (
        <>
          <Icon name="upload" size={22} color="var(--ads-text-muted)" />
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)' }}>{label}</div>
          <div style={{ fontSize: 12, color: 'var(--ads-text-muted)' }}>Drag & drop · {hint}</div>
        </>
      )}
    </label>
  );
}

function ReviewStep({
  draft,
  patientName,
  onJump,
}: {
  draft: OrderDraft;
  patientName: string;
  onJump: (id: StepId) => void;
}) {
  const service = draft.service ? SERVICE_BY_ID[draft.service] : null;
  const procedureLabel = draft.service && draft.procedureType
    ? PROCEDURE_TYPES_BY_SERVICE[draft.service].find((p) => p.value === draft.procedureType)?.label
    : null;
  const providerLabel = draft.provider
    ? LAB_DESTINATIONS.find((l) => l.value === draft.provider)?.label
    : null;
  const manufacturerLabel = draft.manufacturer
    ? IMPLANT_MANUFACTURERS.find((m) => m.value === draft.manufacturer)?.label
    : null;
  const productLineLabel = draft.productLine && draft.manufacturer
    ? PRODUCT_LINES_BY_MANUFACTURER[draft.manufacturer]?.find((p) => p.value === draft.productLine)?.label
    : null;
  const supportLabel = draft.supportType
    ? SUPPORT_TYPES.find((s) => s.value === draft.supportType)?.label
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Notification type="info" title="Almost done">
        Review the order below. You can click any line to jump back and edit.
      </Notification>
      <div
        style={{
          backgroundColor: 'var(--ads-bg-surface)',
          border: '1px solid var(--ads-border-subtle)',
          borderRadius: 'var(--ads-radius-sm)',
          padding: '16px 4px',
          fontFamily: 'var(--ads-font-sans)',
        }}
      >
        <ReviewRow label="Patient" value={patientName} />
        <ReviewRow label="Service" value={service?.name ?? '—'} onEdit={() => onJump('service')} />
        <ReviewRow label="Category" value={service?.category ?? '—'} muted />
        <ReviewRow label="Service provider" value={providerLabel ?? '—'} onEdit={() => onJump('details')} />
        <ReviewRow
          label="Location"
          value={draft.jaws.length === 0 ? '—' : draft.jaws.map((j) => (j === 'upper' ? 'Upper jaw' : 'Lower jaw')).join(', ')}
          onEdit={() => onJump('details')}
        />
        <ReviewRow label="Procedure type" value={procedureLabel ?? '—'} onEdit={() => onJump('details')} />
        {service?.requiresTeeth && (
          <ReviewRow
            label="Teeth"
            value={draft.teeth.length === 0 ? '—' : draft.teeth.slice().sort((a, b) => a - b).join(', ')}
            onEdit={() => onJump('details')}
          />
        )}
        {service?.requiresImplant && (
          <>
            <ReviewRow label="Manufacturer" value={manufacturerLabel ?? '—'} onEdit={() => onJump('details')} />
            <ReviewRow label="Product line" value={productLineLabel ?? '—'} onEdit={() => onJump('details')} />
          </>
        )}
        {service?.requiresGuideSupport && (
          <ReviewRow label="Support type" value={supportLabel ?? '—'} onEdit={() => onJump('details')} />
        )}
        {/* ─── Per-service clinical fields ─── */}
        {(draft.service === 'final-restoration' || draft.service === 'temporary-restoration') && (
          <>
            <ReviewRow label="Material" value={lookupLabel(RESTORATION_MATERIALS, draft.material)} onEdit={() => onJump('details')} />
            <ReviewRow
              label="Shade"
              value={
                draft.shadeBody
                  ? `${draft.shadeBody}${draft.shadeIncisal ? ' · I:' + draft.shadeIncisal : ''}${draft.shadeCervical ? ' · C:' + draft.shadeCervical : ''}`
                  : '—'
              }
              onEdit={() => onJump('details')}
            />
            <ReviewRow label="Margin design" value={lookupLabel(MARGIN_DESIGNS, draft.marginDesign)} onEdit={() => onJump('details')} />
            <ReviewRow label="Margin location" value={lookupLabel(MARGIN_LOCATIONS, draft.marginLocation)} onEdit={() => onJump('details')} />
            <ReviewRow label="Occlusion" value={lookupLabel(OCCLUSAL_SCHEMES, draft.occlusalScheme)} onEdit={() => onJump('details')} />
            <ReviewRow label="Antagonist" value={lookupLabel(ANTAGONIST_TYPES, draft.antagonist)} onEdit={() => onJump('details')} />
            {draft.service === 'final-restoration' && (
              <ReviewRow label="Cement" value={lookupLabel(CEMENT_TYPES, draft.cementType)} onEdit={() => onJump('details')} />
            )}
            {draft.service === 'temporary-restoration' && (
              <>
                <ReviewRow label="Duration" value={lookupLabel(TEMP_DURATIONS, draft.tempDuration)} onEdit={() => onJump('details')} />
                {draft.procedureType?.toLowerCase().includes('implant') && (
                  <ReviewRow
                    label="Out of occlusion"
                    value={draft.outOfOcclusionConfirmed ? 'Confirmed' : 'NOT CONFIRMED'}
                    muted={!draft.outOfOcclusionConfirmed}
                    onEdit={() => onJump('details')}
                  />
                )}
              </>
            )}
          </>
        )}

        {draft.service === 'custom-abutment' && (
          <>
            <ReviewRow label="Abutment material" value={lookupLabel(ABUTMENT_MATERIALS, draft.abutmentMaterial)} onEdit={() => onJump('details')} />
            <ReviewRow label="Retention" value={lookupLabel(RETENTION_METHODS, draft.retentionMethod)} onEdit={() => onJump('details')} />
            <ReviewRow label="Tissue height" value={draft.emergenceHeight ? `${draft.emergenceHeight} mm` : '—'} onEdit={() => onJump('details')} />
            <ReviewRow label="Angulation" value={draft.angulation ? `${draft.angulation}°` : '—'} onEdit={() => onJump('details')} />
          </>
        )}

        {draft.service === 'aligner' && (
          <>
            <ReviewRow label="Aligner package" value={lookupLabel(ALIGNER_PACKAGES, draft.alignerPackage)} onEdit={() => onJump('details')} />
            <ReviewRow
              label="Treatment goals"
              value={
                draft.treatmentGoals.length === 0
                  ? '—'
                  : draft.treatmentGoals.map((g) => lookupLabel(TREATMENT_GOALS, g)).join(', ')
              }
              onEdit={() => onJump('details')}
            />
            <ReviewRow label="Angle class" value={lookupLabel(ANGLE_CLASSES, draft.angleClass)} onEdit={() => onJump('details')} />
            <ReviewRow
              label="OJ / OB / midline"
              value={`OJ ${draft.overjet || '—'}mm · OB ${draft.overbite || '—'}mm · ML ${draft.midlineDeviation || '—'}mm`}
              muted
            />
            <ReviewRow
              label="A-P strategy"
              value={
                draft.apStrategy.length === 0
                  ? '—'
                  : draft.apStrategy.map((s) => lookupLabel(AP_STRATEGIES, s)).join(', ')
              }
              onEdit={() => onJump('details')}
            />
          </>
        )}

        {draft.service === 'nightguard' && (
          <>
            <ReviewRow label="Service type" value={lookupLabel(SPLINT_SERVICE_TYPES, draft.splintServiceType)} onEdit={() => onJump('details')} />
            <ReviewRow label="Border of the splint" value={lookupLabel(SPLINT_BORDERS, draft.splintBorder)} onEdit={() => onJump('details')} />
            <ReviewRow label="Splint surface" value={lookupLabel(SPLINT_SURFACES, draft.splintSurfaceType)} onEdit={() => onJump('details')} />
            <ReviewRow label="Contacts" value={lookupLabel(SPLINT_CONTACTS, draft.splintContacts)} onEdit={() => onJump('details')} />
          </>
        )}

        {draft.service === 'implant-planning' && (
          <>
            <ReviewRow label="Loading protocol" value={lookupLabel(LOADING_PROTOCOLS, draft.loadingProtocol)} onEdit={() => onJump('details')} />
            <ReviewRow label="Restoration plan" value={lookupLabel(RESTORATION_PLANS, draft.restorationPlan)} onEdit={() => onJump('details')} />
            <ReviewRow
              label="Medical flags"
              value={
                draft.medicalFlags.length === 0
                  ? 'None'
                  : draft.medicalFlags.map((f) => lookupLabel(MEDICAL_FLAGS, f)).join(', ')
              }
              muted={draft.medicalFlags.length === 0}
            />
          </>
        )}

        {draft.service === 'surgical-guide' && (
          <ReviewRow label="Guide type" value={lookupLabel(GUIDE_TYPES, draft.guideType)} onEdit={() => onJump('details')} />
        )}

        {(draft.service === 'full-denture' || draft.service === 'partial-denture') && (
          <>
            <ReviewRow label="Stage" value={lookupLabel(DENTURE_STAGES, draft.dentureStage)} onEdit={() => onJump('details')} />
            {draft.service === 'partial-denture' && (
              <>
                <ReviewRow label="Kennedy class" value={lookupLabel(KENNEDY_CLASSES, draft.kennedyClass)} onEdit={() => onJump('details')} />
                <ReviewRow label="Framework" value={lookupLabel(FRAMEWORK_MATERIALS, draft.frameworkMaterial)} onEdit={() => onJump('details')} />
                <ReviewRow label="Major connector" value={lookupLabel(MAJOR_CONNECTORS, draft.majorConnector)} onEdit={() => onJump('details')} />
              </>
            )}
            <ReviewRow label="Material" value={lookupLabel(DENTURE_MATERIALS, draft.material)} onEdit={() => onJump('details')} />
            <ReviewRow label="Tooth shade / mold" value={`${draft.toothShade ?? '—'} · ${lookupLabel(TOOTH_MOLDS, draft.toothMold)}`} onEdit={() => onJump('details')} />
            <ReviewRow label="Gingival shade" value={lookupLabel(GINGIVAL_SHADES, draft.gingivalShade)} onEdit={() => onJump('details')} />
            <ReviewRow label="Occlusion" value={lookupLabel(DENTURE_OCCLUSAL_SCHEMES, draft.occlusalScheme)} onEdit={() => onJump('details')} />
            {draft.vdo && <ReviewRow label="VDO" value={`${draft.vdo} mm`} onEdit={() => onJump('details')} />}
            {draft.attachmentSystem && (
              <ReviewRow label="Attachment" value={lookupLabel(ATTACHMENT_SYSTEMS, draft.attachmentSystem)} onEdit={() => onJump('details')} />
            )}
          </>
        )}

        {draft.service === 'custom-order' && (
          <>
            <ReviewRow label="Description" value={draft.customDescription || '—'} onEdit={() => onJump('details')} />
            <ReviewRow label="Callback" value={draft.contactMethod ? draft.contactMethod === 'phone' ? 'Phone' : 'Email' : '—'} onEdit={() => onJump('details')} />
          </>
        )}

        {/* ─── Files / turnaround / notes ─── */}
        {service?.requiresFiles && (
          <ReviewRow
            label="Files"
            value={
              [draft.cbctFileName ? `CBCT: ${draft.cbctFileName}` : null,
               draft.prosthesisFileName ? `Prosthesis: ${draft.prosthesisFileName}` : null]
                .filter(Boolean)
                .join('  ·  ') || 'None attached'
            }
            onEdit={() => onJump('files')}
          />
        )}
        <ReviewRow
          label="Turnaround"
          value={lookupLabel(RUSH_OPTIONS, draft.rush) + (draft.dueDate ? ` · due ${draft.dueDate}` : '')}
          onEdit={() => onJump('files')}
        />
        {draft.notes && <ReviewRow label="Lab notes" value={draft.notes} onEdit={() => onJump('files')} />}
        {draft.clinicalNotes && (
          <ReviewRow label="Clinical notes" value={draft.clinicalNotes} muted onEdit={() => onJump('files')} />
        )}
      </div>
    </div>
  );
}

function lookupLabel<T extends { value: string; label: string }>(
  options: readonly T[] | T[],
  value: string | null | undefined,
): string {
  if (!value) return '—';
  return options.find((o) => o.value === value)?.label ?? value;
}

function ReviewRow({
  label,
  value,
  muted,
  onEdit,
}: {
  label: string;
  value: string;
  muted?: boolean;
  onEdit?: () => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr auto',
        alignItems: 'center',
        gap: 12,
        padding: '8px 16px',
        borderTop: '1px solid var(--ads-border-subtle)',
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ads-text-muted)' }}>{label}</div>
      <div style={{ fontSize: 14, color: muted ? 'var(--ads-text-muted)' : 'var(--ads-text-primary)' }}>{value}</div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          style={{
            border: 'none',
            background: 'none',
            color: 'var(--ads-blue-500)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 'var(--ads-radius-sm)',
            fontFamily: 'inherit',
          }}
        >
          Edit
        </button>
      )}
    </div>
  );
}

/* ============================================================================
   Right-side live summary
   ============================================================================ */

function OrderSummary({
  draft,
  updateDraft,
  patientName,
  currentStepId,
  onJump,
}: {
  draft: OrderDraft;
  updateDraft: (patch: Partial<OrderDraft>) => void;
  patientName: string;
  relevantSteps: { id: StepId; label: string }[];
  currentStepId?: StepId;
  onJump: (id: StepId) => void;
}) {
  const service = draft.service ? SERVICE_BY_ID[draft.service] : null;
  const fileCount = (draft.cbctFileName ? 1 : 0) + (draft.prosthesisFileName ? 1 : 0)
    + (draft.upperJawFileName ? 1 : 0) + (draft.lowerJawFileName ? 1 : 0) + (draft.biteFileName ? 1 : 0);
  const detailsValidation = validateStep('details', draft);
  const detailsComplete = detailsValidation.ok && !!draft.service;
  const filesFilled = fileCount > 0 || !!draft.notes;
  const isNightguard = draft.service === 'nightguard';
  const isCustomOrder = draft.service === 'custom-order';

  const nightguardDetails: { label: string; value: string; section?: string }[] = isNightguard
    ? [
        {
          label: 'Location',
          section: 'Location',
          value:
            draft.jaws.length === 0
              ? '—'
              : draft.jaws.length === 2
                ? 'Both arches'
                : draft.jaws.includes('upper')
                  ? 'Upper jaw'
                  : 'Lower jaw',
        },
        { label: 'Service type', section: 'Service type', value: lookupLabel(SPLINT_SERVICE_TYPES, draft.splintServiceType) },
        { label: 'Contacts', section: 'Contacts', value: lookupLabel(SPLINT_CONTACTS, draft.splintContacts) },
        { label: 'Border of the splint', section: 'Border of the splint', value: lookupLabel(SPLINT_BORDERS, draft.splintBorder) },
        { label: 'Splint surface', section: 'Splint surface', value: lookupLabel(SPLINT_SURFACES, draft.splintSurfaceType) },
      ]
    : [];

  const CUSTOM_CATEGORY_LABELS: Record<string, string> = {
    orthodontics: 'Orthodontics',
    restorative: 'Restorative',
    implantology: 'Implantology',
    removable: 'Removable',
    'dental-appliances': 'Dental appliances',
    'multiple-services': 'Multiple services',
    other: 'Other',
  };

  const customOrderDetails: { label: string; value: string; section?: string }[] = isCustomOrder
    ? [
        {
          label: 'Category',
          section: 'Category',
          value: draft.procedureType ? CUSTOM_CATEGORY_LABELS[draft.procedureType] ?? '—' : '—',
        },
        {
          label: 'Procedure type',
          section: 'Procedure type',
          value: draft.customDescription.trim() || '—',
        },
        {
          label: 'Teeth',
          section: 'Location',
          value:
            draft.teeth.length === 0
              ? '—'
              : draft.teeth.slice().sort((a, b) => a - b).join(', '),
        },
        { label: 'Instructions', section: 'Instructions', value: draft.notes.trim() || '—' },
      ]
    : [];

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <aside
        style={{
          backgroundColor: 'var(--ads-bg-surface)',
          border: '1px solid var(--ads-border-subtle)',
          borderRadius: 'var(--ads-radius-sm)',
          boxShadow: 'var(--ads-shadow-sm)',
          fontFamily: 'var(--ads-font-sans)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Title */}
        <div style={{ padding: '24px 24px 16px' }}>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              lineHeight: '28px',
              fontWeight: 500,
              color: 'var(--ads-text-primary)',
              letterSpacing: '-0.015em',
            }}
          >
            Order summary
          </h2>
        </div>

        {/* Sections */}
        <SummarySectionRow
          title={patientName}
          subtitle="01.09.1985"
          onEdit={() => {}}
          editable={false}
        />

        <SummarySectionRow
          title={service ? service.name : 'Select service'}
          muted={!service}
          active={currentStepId === 'service'}
          onEdit={() => onJump('service')}
        />

        <SummarySectionRow
          title="Service details"
          muted={!detailsComplete}
          active={currentStepId === 'details'}
          onEdit={() => onJump('details')}
          editable={!!service}
          details={
            isNightguard
              ? nightguardDetails
              : isCustomOrder
                ? customOrderDetails
                : undefined
          }
          onJumpToSection={(sectionTitle) => {
            onJump('details');
            requestAnimationFrame(() => {
              const el = document.getElementById(sectionAnchorId(sectionTitle));
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
          }}
        />

        <SummarySectionRow
          title="Files"
          muted={!filesFilled}
          active={currentStepId === 'files'}
          onEdit={() => onJump('files')}
          editable={!!service}
        />

        <SummarySectionRow
          title="Summary"
          muted={currentStepId !== 'summary'}
          active={currentStepId === 'summary'}
          onEdit={() => onJump('summary')}
          editable={!!service}
          isLast
        />
      </aside>

      {!isCustomOrder && (
        <aside
          style={{
            backgroundColor: 'var(--ads-bg-surface)',
            border: '1px solid var(--ads-border-subtle)',
            borderRadius: 'var(--ads-radius-sm)',
            boxShadow: 'var(--ads-shadow-sm)',
            fontFamily: 'var(--ads-font-sans)',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <textarea
            value={draft.notes}
            onChange={(e) => updateDraft({ notes: e.target.value })}
            placeholder="Comments"
            rows={4}
            style={{
              resize: 'vertical',
              minHeight: 96,
              border: '1px solid var(--ads-border-default)',
              borderRadius: 'var(--ads-radius-sm)',
              padding: 12,
              fontFamily: 'inherit',
              fontSize: 14,
              color: 'var(--ads-text-primary)',
              backgroundColor: 'var(--ads-bg-surface)',
              outline: 'none',
            }}
          />
        </aside>
      )}
    </div>
  );
}

function SummarySectionRow({
  title,
  subtitle,
  muted,
  active,
  onEdit,
  editable = true,
  isLast,
  details,
  onJumpToSection,
}: {
  title: string;
  subtitle?: string;
  muted?: boolean;
  active?: boolean;
  onEdit: () => void;
  editable?: boolean;
  isLast?: boolean;
  details?: { label: string; value: string; section?: string }[];
  onJumpToSection?: (section: string) => void;
}) {
  return (
    <div
      style={{
        padding: '20px 24px',
        borderTop: '1px solid var(--ads-border-subtle)',
        backgroundColor: active ? 'color-mix(in srgb, var(--ads-blue-500) 4%, transparent)' : 'transparent',
        borderBottomLeftRadius: isLast ? 12 : 0,
        borderBottomRightRadius: isLast ? 12 : 0,
        transition: 'background-color var(--ads-duration-fast) var(--ads-ease-standard)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: subtitle ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              lineHeight: '20px',
              fontWeight: 500,
              color: muted ? 'var(--ads-text-muted)' : 'var(--ads-text-primary)',
              wordBreak: 'break-word',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                marginTop: 2,
                fontSize: 13,
                lineHeight: '18px',
                color: 'var(--ads-text-muted)',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        {editable && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${title}`}
            style={{
              flexShrink: 0,
              width: 32,
              height: 32,
              borderRadius: 'var(--ads-radius-sm)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: active ? 'var(--ads-blue-500)' : 'var(--ads-text-primary)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--ads-bg-muted)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <PencilEditIcon />
          </button>
        )}
      </div>
      {details && details.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {details.map((d) => (
            <div
              key={d.label}
              onClick={d.section && onJumpToSection ? () => onJumpToSection!(d.section!) : undefined}
              style={{
                cursor: d.section && onJumpToSection ? 'pointer' : 'default',
                padding: d.section && onJumpToSection ? '4px 6px' : 0,
                borderRadius: 'var(--ads-radius-sm)',
                transition: 'background-color var(--ads-duration-fast) var(--ads-ease-standard)',
              }}
              onMouseEnter={(e) => {
                if (d.section && onJumpToSection) e.currentTarget.style.backgroundColor = 'var(--ads-bg-muted)';
              }}
              onMouseLeave={(e) => {
                if (d.section && onJumpToSection) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ fontSize: 12, lineHeight: '16px', color: 'var(--ads-text-muted)' }}>{d.label}:</div>
              <div style={{ fontSize: 14, lineHeight: '20px', color: 'var(--ads-text-primary)', fontWeight: 400 }}>
                {d.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PencilEditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 2.5 L15.5 6.5 L6 16 L2 16 L2 12 Z" />
      <line x1="11.5" y1="2.5" x2="15.5" y2="6.5" />
      <line x1="9.5" y1="4.5" x2="13.5" y2="8.5" />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="2.5" width="6" height="6" rx="0.6" />
      <rect x="11.5" y="2.5" width="6" height="6" rx="0.6" />
      <rect x="2.5" y="11.5" width="6" height="6" rx="0.6" />
      <line x1="11.5" y1="11.5" x2="11.5" y2="14.5" />
      <line x1="14.5" y1="11.5" x2="17.5" y2="11.5" />
      <line x1="11.5" y1="17.5" x2="14.5" y2="17.5" />
      <line x1="17.5" y1="14.5" x2="17.5" y2="17.5" />
    </svg>
  );
}

function TimerIconSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="7" r="3.6" />
      <line x1="6" y1="7" x2="6" y2="4.6" />
      <line x1="6" y1="7" x2="7.6" y2="8" />
      <line x1="4.5" y1="2" x2="7.5" y2="2" />
    </svg>
  );
}

