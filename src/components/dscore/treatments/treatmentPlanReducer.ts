import type { TreatmentPlan, PlanPhase, PlannedProcedure, PlanStatus } from '../data/types';
import { makeActivityEvent } from '../data/activity';

export type WizardStep = 'diagnose' | 'build' | 'present' | 'execute';

export interface PlanState {
  plan: TreatmentPlan;
  step: WizardStep;
}

let _id = 0;
const newId = (prefix: string) => `${prefix}-${Date.now()}-${++_id}`;

export type PlanAction =
  | { type: 'GO_STEP'; step: WizardStep }
  | { type: 'TOGGLE_TOOTH'; toothNumber: number }
  | { type: 'SET_TEETH'; teeth: number[] }
  | { type: 'TOGGLE_DIAGNOSIS'; tag: string }
  | { type: 'SET_INSURANCE'; provider?: string; planId?: string }
  | { type: 'ADD_PHASE'; name?: string }
  | { type: 'RENAME_PHASE'; phaseId: string; name: string }
  | { type: 'REORDER_PHASES'; phaseIds: string[] }
  | { type: 'SET_PHASE_OFFSET'; phaseId: string; weeks: number }
  | { type: 'REMOVE_PHASE'; phaseId: string }
  | { type: 'ADD_PROCEDURE'; phaseId: string; catalogCode: string; toothNumber?: number }
  | { type: 'UPDATE_PROCEDURE'; phaseId: string; procedureId: string; patch: Partial<PlannedProcedure> }
  | { type: 'REMOVE_PROCEDURE'; phaseId: string; procedureId: string }
  | { type: 'PRESENT'; actor: { id: string; name: string } }
  | { type: 'ACCEPT'; signatureDataUrl: string; actor: { id: string; name: string } }
  | { type: 'DECLINE'; reason: string; actor: { id: string; name: string } }
  | { type: 'MARK_IN_PROGRESS'; jobIds: string[]; actor: { id: string; name: string } }
  | { type: 'BUMP_VERSION'; actor: { id: string; name: string } };

export function planReducer(state: PlanState, action: PlanAction): PlanState {
  const plan = state.plan;
  switch (action.type) {
    case 'GO_STEP':
      return { ...state, step: action.step };

    case 'TOGGLE_TOOTH': {
      const t = action.toothNumber;
      const has = plan.selectedTeeth.includes(t);
      return mut(state, { selectedTeeth: has ? plan.selectedTeeth.filter((x) => x !== t) : [...plan.selectedTeeth, t] });
    }
    case 'SET_TEETH':
      return mut(state, { selectedTeeth: action.teeth });

    case 'TOGGLE_DIAGNOSIS': {
      const has = plan.diagnosisTags.includes(action.tag);
      return mut(state, { diagnosisTags: has ? plan.diagnosisTags.filter((x) => x !== action.tag) : [...plan.diagnosisTags, action.tag] });
    }

    case 'SET_INSURANCE':
      return mut(state, { insurance: { provider: action.provider, planId: action.planId } });

    case 'ADD_PHASE': {
      const phase: PlanPhase = {
        id: newId('ph'),
        name: action.name ?? 'New phase',
        ordering: plan.phases.length,
        earliestStartOffsetWeeks: plan.phases.length === 0
          ? 0
          : (plan.phases[plan.phases.length - 1].earliestStartOffsetWeeks + 1),
        procedures: [],
      };
      return mut(state, { phases: [...plan.phases, phase] });
    }

    case 'RENAME_PHASE':
      return mut(state, {
        phases: plan.phases.map((p) => (p.id === action.phaseId ? { ...p, name: action.name } : p)),
      });

    case 'REORDER_PHASES': {
      const map = new Map(plan.phases.map((p) => [p.id, p]));
      const reordered = action.phaseIds
        .map((id, idx) => {
          const p = map.get(id);
          return p ? { ...p, ordering: idx } : null;
        })
        .filter(Boolean) as PlanPhase[];
      return mut(state, { phases: reordered });
    }

    case 'SET_PHASE_OFFSET':
      return mut(state, {
        phases: plan.phases.map((p) => (p.id === action.phaseId ? { ...p, earliestStartOffsetWeeks: action.weeks } : p)),
      });

    case 'REMOVE_PHASE':
      return mut(state, {
        phases: plan.phases.filter((p) => p.id !== action.phaseId).map((p, i) => ({ ...p, ordering: i })),
      });

    case 'ADD_PROCEDURE': {
      const proc: PlannedProcedure = {
        id: newId('pp'),
        catalogCode: action.catalogCode,
        toothNumber: action.toothNumber,
      };
      return mut(state, {
        phases: plan.phases.map((p) =>
          p.id === action.phaseId ? { ...p, procedures: [...p.procedures, proc] } : p,
        ),
      });
    }

    case 'UPDATE_PROCEDURE':
      return mut(state, {
        phases: plan.phases.map((p) =>
          p.id === action.phaseId
            ? {
                ...p,
                procedures: p.procedures.map((pr) =>
                  pr.id === action.procedureId ? { ...pr, ...action.patch } : pr,
                ),
              }
            : p,
        ),
      });

    case 'REMOVE_PROCEDURE':
      return mut(state, {
        phases: plan.phases.map((p) =>
          p.id === action.phaseId
            ? { ...p, procedures: p.procedures.filter((pr) => pr.id !== action.procedureId) }
            : p,
        ),
      });

    case 'PRESENT':
      return mut(state, {
        status: 'presented',
        presentedAt: new Date().toISOString(),
        activity: [
          ...plan.activity,
          makeActivityEvent({
            type: 'plan-presented',
            actorId: action.actor.id,
            actorName: action.actor.name,
            payload: {},
          }),
        ],
      });

    case 'ACCEPT':
      return mut(state, {
        status: 'accepted',
        acceptedAt: new Date().toISOString(),
        patientSignatureDataUrl: action.signatureDataUrl,
        activity: [
          ...plan.activity,
          makeActivityEvent({
            type: 'plan-accepted',
            actorId: action.actor.id,
            actorName: action.actor.name,
            actorRole: 'patient',
            payload: {},
          }),
        ],
      });

    case 'DECLINE':
      return mut(state, {
        status: 'declined',
        declinedAt: new Date().toISOString(),
        activity: [
          ...plan.activity,
          makeActivityEvent({
            type: 'plan-declined',
            actorId: action.actor.id,
            actorName: action.actor.name,
            actorRole: 'patient',
            payload: { reason: action.reason },
          }),
        ],
      });

    case 'MARK_IN_PROGRESS': {
      const newStatus: PlanStatus = 'in-progress';
      return mut(state, {
        status: newStatus,
        generatedJobIds: [...plan.generatedJobIds, ...action.jobIds],
      });
    }

    case 'BUMP_VERSION':
      return mut(state, {
        version: plan.version + 1,
        status: 'draft',
        activity: [
          ...plan.activity,
          makeActivityEvent({
            type: 'plan-version-bumped',
            actorId: action.actor.id,
            actorName: action.actor.name,
            payload: { version: plan.version + 1 },
          }),
        ],
      });

    default:
      return state;
  }
}

function mut(state: PlanState, patch: Partial<TreatmentPlan>): PlanState {
  return { ...state, plan: { ...state.plan, ...patch } };
}

export function newDraftPlan(patientId: string, patientName: string): TreatmentPlan {
  return {
    id: newId('plan'),
    version: 1,
    patientId,
    patientName,
    status: 'draft',
    phases: [],
    diagnosisTags: [],
    selectedTeeth: [],
    insurance: {},
    createdAt: new Date().toISOString(),
    generatedJobIds: [],
    activity: [],
  };
}

export function initPlanState(patientId = 'pat-dscore', patientName = 'DS Core, Demo'): PlanState {
  return { plan: newDraftPlan(patientId, patientName), step: 'diagnose' };
}
