import React, { useReducer } from 'react';
import { PrimaryButton, SecondaryButton, Stepper } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import { planReducer, initPlanState, type WizardStep } from './dscore/treatments/treatmentPlanReducer';
import { PlanDiagnoseStep } from './dscore/treatments/PlanDiagnoseStep';
import { PlanBuildStep } from './dscore/treatments/PlanBuildStep';
import { PlanPresentStep } from './dscore/treatments/PlanPresentStep';
import { PlanExecuteStep } from './dscore/treatments/PlanExecuteStep';
import { validatePlan } from './dscore/treatments/treatmentPlanRules';
import type { Job } from './dscore/data/types';
import { PlanStatusTag } from './dscore/shared/StatusTag';

interface TreatmentPlanPageProps {
  onBackToHome?: () => void;
  onNavigate?: (id: DSCoreNavId) => void;
  /** Callback to push generated Jobs into the cross-feature store (App.tsx). */
  onJobsGenerated?: (jobs: Job[]) => void;
  /** Caller can route to the Jobs page (used by the "View in Jobs" button). */
  onOpenJobs?: () => void;
}

const CURRENT_USER = { id: 'dr-aw', name: 'Dr. Alex Watanabe' };
const PATIENT_USER = { id: 'pat-dscore', name: 'DS Core, Demo' };

export default function TreatmentPlanPage({ onBackToHome, onNavigate, onJobsGenerated, onOpenJobs }: TreatmentPlanPageProps) {
  const [state, dispatch] = useReducer(planReducer, undefined, () => initPlanState());
  const { plan, step } = state;

  const stepIndex: Record<WizardStep, number> = { diagnose: 0, build: 1, present: 2, execute: 3 };
  const issues = validatePlan(plan);
  const blockingErrors = issues.filter((i) => i.severity === 'error').length;

  const canGoTo = (target: WizardStep): boolean => {
    if (target === 'diagnose') return true;
    if (target === 'build') return plan.selectedTeeth.length > 0 || plan.diagnosisTags.length > 0;
    if (target === 'present') return plan.phases.length > 0 && blockingErrors === 0;
    if (target === 'execute') return plan.status === 'accepted';
    return false;
  };

  const stepperLabels = ['Diagnose', 'Plan', 'Present', 'Execute'];
  // Allow direct click to any step the user can reach (skips re-running Stepper's
  // internal label rendering — we render a thin clickable header above the Stepper).
  const stepKeys: WizardStep[] = ['diagnose', 'build', 'present', 'execute'];

  return (
    <DSCoreShell
      active="treatments"
      unread={1}
      onNavigate={(id) => {
        if (id === 'home' && onBackToHome) onBackToHome();
        else onNavigate?.(id);
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 40px 80px' }}>
        <header style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h1
              style={{
                fontFamily: 'var(--ads-font-sans)',
                fontWeight: 500,
                fontSize: '28px',
                lineHeight: '36px',
                letterSpacing: '-0.01em',
                color: 'var(--ads-text-primary)',
                margin: 0,
              }}
            >
              Treatment plan
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--ads-text-muted)' }}>
              {plan.patientName} · v{plan.version}
            </p>
          </div>
          <PlanStatusTag status={plan.status} size="medium" />
        </header>

        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
          {stepKeys.map((key, i) => {
            const reachable = canGoTo(key);
            const active = key === step;
            return (
              <button
                key={key}
                type="button"
                disabled={!reachable}
                onClick={() => dispatch({ type: 'GO_STEP', step: key })}
                style={{
                  flex: '1 1 0',
                  background: 'none',
                  border: 'none',
                  padding: '4px 8px',
                  textAlign: 'left',
                  cursor: reachable ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--ads-font-sans)',
                  fontSize: '12px',
                  color: active ? 'var(--ads-blue-text)' : 'var(--ads-text-muted)',
                  fontWeight: active ? 500 : 400,
                  opacity: reachable ? 1 : 0.5,
                }}
              >
                Step {i + 1} · {stepperLabels[i]}
              </button>
            );
          })}
        </div>
        <div style={{ marginBottom: '32px' }}>
          <Stepper steps={stepperLabels} activeStep={stepIndex[step]} />
        </div>

        <div style={{ marginBottom: '32px' }}>
          {step === 'diagnose' && (
            <PlanDiagnoseStep
              plan={plan}
              onToggleTooth={(n) => dispatch({ type: 'TOGGLE_TOOTH', toothNumber: n })}
              onToggleDiagnosis={(t) => dispatch({ type: 'TOGGLE_DIAGNOSIS', tag: t })}
            />
          )}
          {step === 'build' && (
            <PlanBuildStep
              plan={plan}
              onAddPhase={() => dispatch({ type: 'ADD_PHASE' })}
              onRenamePhase={(phaseId, name) => dispatch({ type: 'RENAME_PHASE', phaseId, name })}
              onSetPhaseOffset={(phaseId, weeks) => dispatch({ type: 'SET_PHASE_OFFSET', phaseId, weeks })}
              onRemovePhase={(phaseId) => dispatch({ type: 'REMOVE_PHASE', phaseId })}
              onAddProcedure={(phaseId, code, toothNumber) => dispatch({ type: 'ADD_PROCEDURE', phaseId, catalogCode: code, toothNumber })}
              onUpdateProcedure={(phaseId, procedureId, patch) => dispatch({ type: 'UPDATE_PROCEDURE', phaseId, procedureId, patch })}
              onRemoveProcedure={(phaseId, procedureId) => dispatch({ type: 'REMOVE_PROCEDURE', phaseId, procedureId })}
            />
          )}
          {step === 'present' && (
            <PlanPresentStep
              plan={plan}
              onPresent={() => dispatch({ type: 'PRESENT', actor: CURRENT_USER })}
              onAccept={(sig) => dispatch({ type: 'ACCEPT', signatureDataUrl: sig, actor: PATIENT_USER })}
              onDecline={(reason) => dispatch({ type: 'DECLINE', reason, actor: PATIENT_USER })}
              onSetInsurance={(provider, planId) => dispatch({ type: 'SET_INSURANCE', provider, planId })}
            />
          )}
          {step === 'execute' && (
            <PlanExecuteStep
              plan={plan}
              onConfirmGenerate={(jobs) => {
                onJobsGenerated?.(jobs);
                dispatch({ type: 'MARK_IN_PROGRESS', jobIds: jobs.map((j) => j.id), actor: CURRENT_USER });
              }}
              onViewJobs={() => onOpenJobs?.()}
            />
          )}
        </div>

        <footer
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '20px',
            borderTop: '1px solid var(--ads-border-subtle)',
          }}
        >
          <SecondaryButton
            size={36}
            onClick={() => {
              const order: WizardStep[] = ['diagnose', 'build', 'present', 'execute'];
              const i = order.indexOf(step);
              if (i > 0) dispatch({ type: 'GO_STEP', step: order[i - 1] });
            }}
            disabled={step === 'diagnose'}
          >
            Back
          </SecondaryButton>
          <PrimaryButton
            size={36}
            disabled={
              (step === 'diagnose' && !canGoTo('build')) ||
              (step === 'build' && !canGoTo('present')) ||
              (step === 'present' && !canGoTo('execute')) ||
              step === 'execute'
            }
            onClick={() => {
              const order: WizardStep[] = ['diagnose', 'build', 'present', 'execute'];
              const i = order.indexOf(step);
              if (i < order.length - 1) dispatch({ type: 'GO_STEP', step: order[i + 1] });
            }}
          >
            {step === 'diagnose' ? 'Build plan' : step === 'build' ? 'Present plan' : step === 'present' ? 'Execute' : 'Done'}
          </PrimaryButton>
        </footer>
      </div>
    </DSCoreShell>
  );
}
