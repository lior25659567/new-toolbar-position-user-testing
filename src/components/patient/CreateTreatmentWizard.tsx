import React, { useEffect } from 'react';
import {
  Modal,
  PrimaryButton,
  SecondaryButton,
  LinkButton,
  Notification,
} from '../../design-system';
import { useInfoState } from '../../info/state/useInfoState';
import { ProcedureSection } from '../../info/components/ProcedureSection/ProcedureSection';
import { ConfigSection } from '../../info/components/ConfigSection/ConfigSection';
import { PROCEDURES, INVISALIGN_TYPES, TREATMENT_STAGES, DENTURE_TYPES, DENTURE_STAGES } from '../../info/constants';
import type { Patient, ProcedureType } from '../../info/types';
import type { PatientTreatment } from './treatmentConstants';
import { PROCEDURE_LABEL } from './treatmentConstants';
import { SummaryPanel, type SummaryItemData } from './SummaryPanel';

interface CreateTreatmentWizardProps {
  open: boolean;
  onClose: () => void;
  onSubmitted: (treatment: PatientTreatment) => void;
  patientName: string;
}

export function CreateTreatmentWizard({ open, onClose, onSubmitted, patientName }: CreateTreatmentWizardProps) {
  const { state, dispatch, canProceed, toothColorMap } = useInfoState();

  const seedPatient = () => {
    const [first, ...rest] = patientName.split(' ');
    const patient: Patient = {
      id: 'current',
      firstName: first || patientName,
      lastName: rest.join(' '),
      gender: 'male',
      dateOfBirth: '1985-09-01',
      chartNumber: 'DentsplySironaR2',
    };
    dispatch({ type: 'SET_PATIENT', patient });
  };

  // Seed patient on open.
  useEffect(() => {
    if (!open) return;
    dispatch({ type: 'RESET' });
    seedPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const resetProcedure = () => {
    dispatch({ type: 'RESET' });
    seedPatient();
  };

  const phase: 'procedure' | 'configure' = state.selectedProcedure ? 'configure' : 'procedure';

  const handleSubmit = (status: 'draft' | 'submitted') => {
    if (!state.selectedProcedure) return;
    const procedure = state.selectedProcedure as ProcedureType;
    const teethList = state.toothSpecs.length > 0
      ? state.toothSpecs.map((s) => s.toothNumber)
      : state.selectedTeeth;
    const toothSummary = teethList.length === 0
      ? 'Full arch'
      : `#${teethList.slice().sort((a, b) => a - b).join(', #')}`;
    const details = buildDetails(procedure, state);
    const treatment: PatientTreatment = {
      id: `pt-${Date.now().toString(36)}`,
      procedure,
      procedureLabel: PROCEDURE_LABEL[procedure],
      status,
      createdDate: new Date().toISOString().slice(0, 10),
      teeth: teethList,
      toothSummary,
      provider: 'Dr. A. Whitaker',
      notes: state.notes || undefined,
      details,
    };
    onSubmitted(treatment);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Treatment"
      width={1200}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <SecondaryButton
            size={36}
            onClick={resetProcedure}
            disabled={!state.selectedProcedure}
          >
            Change procedure
          </SecondaryButton>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LinkButton size={36} onClick={() => handleSubmit('draft')} disabled={!state.selectedProcedure}>
              Save as draft
            </LinkButton>
            <PrimaryButton size={36} onClick={() => handleSubmit('submitted')} disabled={!canProceed}>
              Submit treatment
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 320px',
          gap: '24px',
          minHeight: '520px',
        }}
      >
        {/* ─── Left: phase content ─── */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <PhaseHeader phase={phase} />

          {phase === 'procedure' ? (
            <div style={{ animation: 'ads-fade-in 180ms cubic-bezier(0.2, 0, 0, 1)' }}>
              <Notification type="info" title="Pick a procedure to get started">
                Treatments mirror the patient Info flow — pick a procedure and the relevant clinical fields will appear below.
              </Notification>
              <div style={{ marginTop: 16 }}>
                <ProcedureSection
                  selectedProcedure={state.selectedProcedure}
                  hasPatient={true}
                  dispatch={dispatch}
                />
              </div>
            </div>
          ) : (
            <div style={{ animation: 'ads-fade-in 180ms cubic-bezier(0.2, 0, 0, 1)' }}>
              <ConfigSection state={state} toothColorMap={toothColorMap} dispatch={dispatch} />
            </div>
          )}
        </div>

        {/* ─── Right: live treatment summary ─── */}
        <TreatmentSummary state={state} patientName={patientName} canProceed={canProceed} />
      </div>

      <style>{`@keyframes ads-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </Modal>
  );
}

function PhaseHeader({ phase }: { phase: 'procedure' | 'configure' }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--ads-font-sans)',
          fontSize: 11,
          fontWeight: 500,
          color: 'var(--ads-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {phase === 'procedure' ? 'Step 1 of 2' : 'Step 2 of 2'}
      </div>
      <h2
        style={{
          margin: '4px 0 0',
          fontFamily: 'var(--ads-font-sans)',
          fontSize: 20,
          lineHeight: '28px',
          fontWeight: 500,
          color: 'var(--ads-text-primary)',
          letterSpacing: '-0.015em',
        }}
      >
        {phase === 'procedure' ? 'Choose procedure' : 'Configure treatment'}
      </h2>
    </div>
  );
}

function TreatmentSummary({
  state,
  patientName,
  canProceed,
}: {
  state: ReturnType<typeof useInfoState>['state'];
  patientName: string;
  canProceed: boolean;
}) {
  const procedureName = state.selectedProcedure
    ? PROCEDURES.find((p) => p.id === state.selectedProcedure)?.name ?? null
    : null;

  const invisalignType = state.invisalignType
    ? INVISALIGN_TYPES.find((t) => t.value === state.invisalignType)?.label ?? null
    : null;
  const treatmentStage = state.treatmentStage
    ? TREATMENT_STAGES.find((t) => t.value === state.treatmentStage)?.label ?? null
    : null;
  const dentureType = state.dentureType
    ? DENTURE_TYPES.find((t) => t.value === state.dentureType)?.label ?? null
    : null;
  const dentureStage = state.dentureStage
    ? DENTURE_STAGES.find((s) => s.value === state.dentureStage)?.label ?? null
    : null;

  const proc = state.selectedProcedure;
  const items: SummaryItemData[] = [
    { id: 'procedure', label: 'Procedure', value: procedureName },
  ];

  if (proc === 'invisalign') {
    items.push({ id: 'invisalign-type', label: 'Invisalign type', value: invisalignType });
    items.push({ id: 'stage', label: 'Stage', value: treatmentStage });
  }
  if (proc === 'dentures') {
    items.push({ id: 'denture-type', label: 'Denture type', value: dentureType });
    items.push({ id: 'denture-stage', label: 'Denture stage', value: dentureStage });
  }
  if (proc === 'fixed-restorative') {
    const teethList = state.toothSpecs.slice().sort((a, b) => a.toothNumber - b.toothNumber);
    items.push({
      id: 'teeth',
      label: `Teeth${teethList.length > 0 ? ` (${teethList.length})` : ''}`,
      value: teethList.length === 0 ? null : teethList.map((s) => `#${s.toothNumber}`).join(', '),
    });
  }

  // Shared optional fields — only render rows that are relevant.
  const procedureNeedsLabFields = proc && proc !== 'invisalign' && proc !== 'appliance';
  if (procedureNeedsLabFields) {
    items.push({ id: 'due-date', label: 'Due date', value: state.dueDate || null });
    items.push({ id: 'send-to', label: 'Send to', value: state.sendTo || null });
  }
  if (state.notes) {
    items.push({ id: 'notes', label: 'Notes', value: state.notes });
  }

  const footer = (
    <div
      style={{
        padding: '10px 12px',
        fontSize: 12,
        borderRadius: 'var(--ads-radius-md)',
        backgroundColor: canProceed
          ? 'color-mix(in srgb, var(--ads-success-500) 10%, transparent)'
          : 'color-mix(in srgb, var(--ads-warning-500) 10%, transparent)',
        color: 'var(--ads-text-primary)',
        border: `1px solid ${canProceed ? 'var(--ads-success-500)' : 'var(--ads-border-subtle)'}`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--ads-font-sans)',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: canProceed ? 'var(--ads-success-500)' : 'var(--ads-warning-500)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {canProceed ? (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1.5 4.2 L3.2 5.8 L6.5 2.2" />
          </svg>
        ) : (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="2" x2="4" y2="5" />
            <line x1="4" y1="6.5" x2="4" y2="6.5" />
          </svg>
        )}
      </span>
      <span>{canProceed ? 'Ready to submit.' : 'Fill required fields to enable submit.'}</span>
    </div>
  );

  return (
    <SummaryPanel
      title="Treatment summary"
      patientName={patientName}
      items={items}
      footer={footer}
    />
  );
}

function buildDetails(procedure: ProcedureType, state: ReturnType<typeof useInfoState>['state']): string {
  switch (procedure) {
    case 'invisalign': {
      const t = state.invisalignType ? INVISALIGN_TYPES.find((x) => x.value === state.invisalignType)?.label : null;
      const s = state.treatmentStage ? TREATMENT_STAGES.find((x) => x.value === state.treatmentStage)?.label : null;
      return [t, s].filter(Boolean).join(' · ');
    }
    case 'dentures': {
      const t = state.dentureType ? DENTURE_TYPES.find((x) => x.value === state.dentureType)?.label : null;
      const s = state.dentureStage ? DENTURE_STAGES.find((x) => x.value === state.dentureStage)?.label : null;
      return [t, s].filter(Boolean).join(' · ');
    }
    case 'fixed-restorative': {
      if (state.toothSpecs.length === 0) return 'Fixed restorative';
      const labels = state.toothSpecs
        .map((s) => s.procedure)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(', ');
      return labels;
    }
    default:
      return PROCEDURE_LABEL[procedure];
  }
}
