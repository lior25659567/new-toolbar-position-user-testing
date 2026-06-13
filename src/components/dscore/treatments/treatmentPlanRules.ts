import type { TreatmentPlan, PlanPhase, PlannedProcedure } from '../data/types';
import { procedureByCode } from '../data/procedures';

/**
 * Validation rules for treatment plans. Pure functions — no dispatch, no UI.
 */

export interface ValidationIssue {
  /** 'phase' issues attach to a phase row; 'procedure' to a row inside a phase. */
  scope: 'plan' | 'phase' | 'procedure';
  phaseId?: string;
  procedureId?: string;
  severity: 'error' | 'warning';
  message: string;
}

export function validatePlan(plan: TreatmentPlan): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Step-1 gate: at least one tooth selected when any procedure applies-per-tooth
  const hasPerToothProc = plan.phases.some((ph) =>
    ph.procedures.some((p) => procedureByCode(p.catalogCode)?.appliesPerTooth)
  );
  if (hasPerToothProc && plan.selectedTeeth.length === 0) {
    issues.push({
      scope: 'plan',
      severity: 'error',
      message: 'Select affected teeth in step 1.',
    });
  }

  // Each per-tooth procedure must have a tooth assigned
  for (const phase of plan.phases) {
    for (const proc of phase.procedures) {
      const cat = procedureByCode(proc.catalogCode);
      if (!cat) continue;
      if (cat.appliesPerTooth && proc.toothNumber == null) {
        issues.push({
          scope: 'procedure',
          phaseId: phase.id,
          procedureId: proc.id,
          severity: 'error',
          message: `${cat.name} requires a tooth selection.`,
        });
      }
    }
  }

  // Prerequisites: each procedure with `prerequisites` requires at least one
  // prerequisite procedure (matched by catalog code) on the same tooth in a
  // strictly-earlier phase. If `minWeeksAfterPrereq` is set, the dependent
  // phase must start at least that many weeks after.
  const sortedPhases = [...plan.phases].sort((a, b) => a.ordering - b.ordering);
  for (let i = 0; i < sortedPhases.length; i++) {
    const phase = sortedPhases[i];
    for (const proc of phase.procedures) {
      const cat = procedureByCode(proc.catalogCode);
      if (!cat?.prerequisites?.length) continue;
      const earlierPhases = sortedPhases.slice(0, i);
      const matched = findPrerequisite(proc, cat.prerequisites, earlierPhases);
      if (!matched) {
        const prereqNames = cat.prerequisites
          .map((c) => procedureByCode(c)?.name ?? c)
          .join(' or ');
        issues.push({
          scope: 'procedure',
          phaseId: phase.id,
          procedureId: proc.id,
          severity: 'error',
          message: `${cat.name} requires ${prereqNames} on the same tooth in an earlier phase.`,
        });
        continue;
      }
      // Healing-time check
      if (cat.minWeeksAfterPrereq != null) {
        const gap = phase.earliestStartOffsetWeeks - matched.phase.earliestStartOffsetWeeks;
        if (gap < cat.minWeeksAfterPrereq) {
          issues.push({
            scope: 'procedure',
            phaseId: phase.id,
            procedureId: proc.id,
            severity: 'warning',
            message: `${cat.name} typically needs ${cat.minWeeksAfterPrereq} weeks of healing after ${procedureByCode(matched.proc.catalogCode)?.name}; this phase starts only ${gap} week${gap === 1 ? '' : 's'} after.`,
          });
        }
      }
    }
  }

  return issues;
}

function findPrerequisite(
  proc: PlannedProcedure,
  prereqCodes: string[],
  earlierPhases: PlanPhase[],
): { phase: PlanPhase; proc: PlannedProcedure } | undefined {
  for (const phase of earlierPhases) {
    for (const candidate of phase.procedures) {
      if (!prereqCodes.includes(candidate.catalogCode)) continue;
      // For per-tooth procedures, require same tooth.
      const cat = procedureByCode(candidate.catalogCode);
      if (cat?.appliesPerTooth && proc.toothNumber != null) {
        if (candidate.toothNumber === proc.toothNumber) return { phase, proc: candidate };
      } else {
        return { phase, proc: candidate };
      }
    }
  }
  return undefined;
}

// ─── Cost rollups ────────────────────────────────────────────────────────────

export interface PhaseTotals {
  phaseId: string;
  procedureCount: number;
  durationMin: number;
  subtotal: number;
}

export interface PlanTotals {
  byPhase: PhaseTotals[];
  procedureCount: number;
  durationMin: number;
  subtotal: number;
  insuranceEstimate: number;
  patientPays: number;
}

export function rollupPlan(plan: TreatmentPlan, insuranceMultiplier = 1): PlanTotals {
  const byPhase: PhaseTotals[] = plan.phases.map((ph) => {
    let subtotal = 0;
    let durationMin = 0;
    for (const proc of ph.procedures) {
      const cat = procedureByCode(proc.catalogCode);
      const price = proc.priceOverride ?? cat?.defaultPrice ?? 0;
      subtotal += price;
      durationMin += cat?.defaultDurationMin ?? 0;
    }
    return {
      phaseId: ph.id,
      procedureCount: ph.procedures.length,
      durationMin,
      subtotal,
    };
  });

  const subtotal = byPhase.reduce((s, p) => s + p.subtotal, 0);
  const procedureCount = byPhase.reduce((s, p) => s + p.procedureCount, 0);
  const durationMin = byPhase.reduce((s, p) => s + p.durationMin, 0);

  // Insurance estimate: sum of (procedure price × catalog coverage × multiplier).
  let insuranceEstimate = 0;
  for (const ph of plan.phases) {
    for (const proc of ph.procedures) {
      const cat = procedureByCode(proc.catalogCode);
      const price = proc.priceOverride ?? cat?.defaultPrice ?? 0;
      const cov = cat?.insuranceCoverageDefault ?? 0;
      insuranceEstimate += price * cov * insuranceMultiplier;
    }
  }
  insuranceEstimate = Math.round(insuranceEstimate);
  const patientPays = subtotal - insuranceEstimate;

  return { byPhase, procedureCount, durationMin, subtotal, insuranceEstimate, patientPays };
}

export function formatCurrency(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}
