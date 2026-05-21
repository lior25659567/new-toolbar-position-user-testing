import React, { useMemo, useState } from 'react';
import { PrimaryButton, SecondaryButton, IconButton, Icon, DropdownList, NumberInput, TextInput, Tag, Tooltip } from '../../../design-system';
import type { TreatmentPlan, PlanPhase, PlannedProcedure } from '../data/types';
import { PROCEDURE_CATALOG, procedureByCode } from '../data/procedures';
import { rollupPlan, validatePlan, formatCurrency, type ValidationIssue } from './treatmentPlanRules';

export function PlanBuildStep({
  plan,
  onAddPhase,
  onRenamePhase,
  onSetPhaseOffset,
  onRemovePhase,
  onAddProcedure,
  onUpdateProcedure,
  onRemoveProcedure,
}: {
  plan: TreatmentPlan;
  onAddPhase: () => void;
  onRenamePhase: (phaseId: string, name: string) => void;
  onSetPhaseOffset: (phaseId: string, weeks: number) => void;
  onRemovePhase: (phaseId: string) => void;
  onAddProcedure: (phaseId: string, code: string, toothNumber?: number) => void;
  onUpdateProcedure: (phaseId: string, procedureId: string, patch: Partial<PlannedProcedure>) => void;
  onRemoveProcedure: (phaseId: string, procedureId: string) => void;
}) {
  const totals = useMemo(() => rollupPlan(plan), [plan]);
  const issues = useMemo(() => validatePlan(plan), [plan]);
  const issueByProc = useMemo(() => {
    const m = new Map<string, ValidationIssue[]>();
    for (const issue of issues) {
      if (issue.scope === 'procedure' && issue.procedureId) {
        const arr = m.get(issue.procedureId) ?? [];
        arr.push(issue);
        m.set(issue.procedureId, arr);
      }
    }
    return m;
  }, [issues]);

  const sortedPhases = useMemo(() => [...plan.phases].sort((a, b) => a.ordering - b.ordering), [plan.phases]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '24px', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '17px', color: 'var(--ads-text-primary)' }}>
            Phases
          </h3>
          <SecondaryButton size={36} onClick={onAddPhase}>+ Add phase</SecondaryButton>
        </header>

        {sortedPhases.length === 0 ? (
          <EmptyState onAddPhase={onAddPhase} />
        ) : (
          sortedPhases.map((phase) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              plan={plan}
              issueByProc={issueByProc}
              onRename={(name) => onRenamePhase(phase.id, name)}
              onSetOffset={(weeks) => onSetPhaseOffset(phase.id, weeks)}
              onRemove={() => onRemovePhase(phase.id)}
              onAddProcedure={(code, toothNumber) => onAddProcedure(phase.id, code, toothNumber)}
              onUpdateProcedure={(procId, patch) => onUpdateProcedure(phase.id, procId, patch)}
              onRemoveProcedure={(procId) => onRemoveProcedure(phase.id, procId)}
            />
          ))
        )}
      </div>

      <RollupPanel totals={totals} issues={issues} />
    </div>
  );
}

function EmptyState({ onAddPhase }: { onAddPhase: () => void }) {
  return (
    <div
      style={{
        border: '1px dashed var(--ads-border-default)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '32px 24px',
        textAlign: 'center',
        backgroundColor: 'var(--ads-bg-muted)',
      }}
    >
      <p style={{ margin: '0 0 12px', color: 'var(--ads-text-muted)', fontSize: '14px' }}>
        Add phases to break the plan into stages (Diagnostic, Restoration, …).
      </p>
      <PrimaryButton size={36} onClick={onAddPhase}>+ Add first phase</PrimaryButton>
    </div>
  );
}

function PhaseCard({
  phase, plan, issueByProc,
  onRename, onSetOffset, onRemove, onAddProcedure, onUpdateProcedure, onRemoveProcedure,
}: {
  phase: PlanPhase;
  plan: TreatmentPlan;
  issueByProc: Map<string, ValidationIssue[]>;
  onRename: (name: string) => void;
  onSetOffset: (weeks: number) => void;
  onRemove: () => void;
  onAddProcedure: (code: string, toothNumber?: number) => void;
  onUpdateProcedure: (procId: string, patch: Partial<PlannedProcedure>) => void;
  onRemoveProcedure: (procId: string) => void;
}) {
  const [adderOpen, setAdderOpen] = useState(false);
  const totals = useMemo(() => rollupPlan(plan).byPhase.find((p) => p.phaseId === phase.id), [plan, phase.id]);

  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        overflow: 'hidden',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: '1px solid var(--ads-border-subtle)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <TextInput
            value={phase.name}
            onChange={(e) => onRename(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--ads-text-muted)' }}>Starts week</span>
          <div style={{ width: '76px' }}>
            <NumberInput
              value={phase.earliestStartOffsetWeeks}
              onChange={(e) => onSetOffset(Number(e.target.value) || 0)}
              min={0}
              max={104}
            />
          </div>
        </div>
        <IconButton aria-label="Remove phase" onClick={onRemove}>
          <Icon name="close" size={16} color="var(--ads-text-muted)" />
        </IconButton>
      </header>

      {phase.procedures.length === 0 ? (
        <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--ads-text-muted)', fontSize: '13px' }}>
          No procedures yet.
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {phase.procedures.map((proc, idx) => {
            const cat = procedureByCode(proc.catalogCode);
            const procIssues = issueByProc.get(proc.id) ?? [];
            return (
              <li key={proc.id} style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--ads-border-subtle)' }}>
                <ProcedureRow
                  proc={proc}
                  catalogName={cat?.name ?? proc.catalogCode}
                  onUpdate={(patch) => onUpdateProcedure(proc.id, patch)}
                  onRemove={() => onRemoveProcedure(proc.id)}
                  issues={procIssues}
                />
              </li>
            );
          })}
        </ul>
      )}

      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid var(--ads-border-subtle)', backgroundColor: 'var(--ads-bg-muted)' }}>
        {adderOpen ? (
          <ProcedureAdder
            phaseTeeth={plan.selectedTeeth}
            onAdd={(code, tooth) => {
              onAddProcedure(code, tooth);
              setAdderOpen(false);
            }}
            onCancel={() => setAdderOpen(false)}
          />
        ) : (
          <SecondaryButton size={36} onClick={() => setAdderOpen(true)}>+ Add procedure</SecondaryButton>
        )}
        <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
          {totals?.procedureCount ?? 0} item{(totals?.procedureCount ?? 0) === 1 ? '' : 's'} · {Math.round((totals?.durationMin ?? 0) / 5) * 5} min ·{' '}
          <strong style={{ color: 'var(--ads-text-primary)' }}>{formatCurrency(totals?.subtotal ?? 0)}</strong>
        </div>
      </footer>
    </section>
  );
}

function ProcedureRow({
  proc, catalogName, onUpdate, onRemove, issues,
}: {
  proc: PlannedProcedure;
  catalogName: string;
  onUpdate: (patch: Partial<PlannedProcedure>) => void;
  onRemove: () => void;
  issues: ValidationIssue[];
}) {
  const cat = procedureByCode(proc.catalogCode);
  const price = proc.priceOverride ?? cat?.defaultPrice ?? 0;
  const error = issues.find((i) => i.severity === 'error');
  const warn = issues.find((i) => i.severity === 'warning');
  return (
    <div
      style={{
        padding: '12px 16px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 100px 120px 100px 32px',
        gap: '12px',
        alignItems: 'center',
        borderLeft: error ? '3px solid var(--ads-error-500)' : warn ? '3px solid var(--ads-warning-500)' : '3px solid transparent',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: 'var(--ads-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {proc.catalogCode}
          </span>
          <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {catalogName}
          </span>
        </div>
        {(error || warn) && (
          <Tooltip content={(error ?? warn)!.message}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '4px',
                fontSize: '12px',
                color: error ? 'var(--ads-error-500)' : 'var(--ads-warning-500)',
                cursor: 'help',
              }}
            >
              {error ? '⚠ ' : 'ℹ '} {(error ?? warn)!.message.length > 60 ? (error ?? warn)!.message.slice(0, 58) + '…' : (error ?? warn)!.message}
            </span>
          </Tooltip>
        )}
      </div>
      <div>
        {cat?.appliesPerTooth ? (
          <NumberInput
            value={proc.toothNumber ?? ''}
            onChange={(e) => onUpdate({ toothNumber: e.target.value === '' ? undefined : Number(e.target.value) })}
            placeholder="Tooth #"
            min={11}
            max={48}
          />
        ) : (
          <span style={{ fontSize: '12px', color: 'var(--ads-text-subtle)' }}>—</span>
        )}
      </div>
      <div>
        <TextInput
          value={proc.material ?? ''}
          onChange={(e) => onUpdate({ material: e.target.value })}
          placeholder="Material"
        />
      </div>
      <div>
        <NumberInput
          value={price}
          onChange={(e) => onUpdate({ priceOverride: Number(e.target.value) || 0 })}
          min={0}
        />
      </div>
      <IconButton aria-label="Remove procedure" onClick={onRemove}>
        <Icon name="close" size={14} color="var(--ads-text-muted)" />
      </IconButton>
    </div>
  );
}

function ProcedureAdder({
  phaseTeeth, onAdd, onCancel,
}: {
  phaseTeeth: number[];
  onAdd: (code: string, toothNumber?: number) => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState<string>(PROCEDURE_CATALOG[0].code);
  const [tooth, setTooth] = useState<string>('');
  const cat = procedureByCode(code);

  const options = PROCEDURE_CATALOG.map((p) => ({ value: p.code, label: `${p.code} · ${p.name}` }));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
      <div style={{ width: '280px' }}>
        <DropdownList options={options} value={code} onChange={setCode} fullWidth />
      </div>
      {cat?.appliesPerTooth && (
        <div style={{ width: '100px' }}>
          <DropdownList
            options={[{ value: '', label: 'Tooth #' }, ...phaseTeeth.sort((a, b) => a - b).map((t) => ({ value: String(t), label: `#${t}` }))]}
            value={tooth}
            onChange={setTooth}
            fullWidth
          />
        </div>
      )}
      <PrimaryButton
        size={36}
        disabled={cat?.appliesPerTooth && !tooth}
        onClick={() => onAdd(code, tooth ? Number(tooth) : undefined)}
      >
        Add
      </PrimaryButton>
      <SecondaryButton size={36} onClick={onCancel}>Cancel</SecondaryButton>
    </div>
  );
}

function RollupPanel({ totals, issues }: { totals: ReturnType<typeof rollupPlan>; issues: ValidationIssue[] }) {
  const errors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;
  return (
    <aside
      style={{
        position: 'sticky',
        top: '24px',
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', color: 'var(--ads-text-muted)', letterSpacing: '0.04em' }}>
        Plan summary
      </h3>
      <Row label="Procedures" value={String(totals.procedureCount)} />
      <Row label="Total duration" value={`${Math.round(totals.durationMin / 5) * 5} min`} />
      <hr style={{ border: 'none', borderTop: '1px solid var(--ads-border-subtle)', margin: '4px 0' }} />
      <Row label="Subtotal" value={formatCurrency(totals.subtotal)} bold />
      <Row label="Insurance est." value={`−${formatCurrency(totals.insuranceEstimate)}`} muted />
      <Row label="Patient pays" value={formatCurrency(totals.patientPays)} bold large />
      {(errors > 0 || warnings > 0) && (
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {errors > 0 && <Tag color="red">{errors} error{errors === 1 ? '' : 's'}</Tag>}
          {warnings > 0 && <Tag color="orange">{warnings} warning{warnings === 1 ? '' : 's'}</Tag>}
        </div>
      )}
    </aside>
  );
}

function Row({ label, value, bold, muted, large }: { label: string; value: string; bold?: boolean; muted?: boolean; large?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
      <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)' }}>{label}</span>
      <span style={{
        fontFamily: 'var(--ads-font-sans)',
        fontSize: large ? '20px' : '14px',
        fontWeight: bold ? 500 : 400,
        color: muted ? 'var(--ads-text-muted)' : 'var(--ads-text-primary)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
    </div>
  );
}
