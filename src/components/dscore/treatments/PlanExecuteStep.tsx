import React, { useMemo, useState } from 'react';
import { PrimaryButton, Tag } from '../../../design-system';
import type { TreatmentPlan, Job } from '../data/types';
import { procedureByCode } from '../data/procedures';
import { LABS, DENTISTS, PATIENTS } from '../data/labs';
import { makeActivityEvent, daysFromNowISO } from '../data/activity';
import { PlanStatusTag } from '../shared/StatusTag';

let _planJobIdSeq = 0;

/**
 * Walks accepted plan and creates Job objects for every procedure with
 * generatesJob=true. Returns the new jobs (ID-prefixed with 'plan-job-').
 */
export function generateJobsFromPlan(plan: TreatmentPlan): Job[] {
  const dentist = DENTISTS[0];
  const patient = PATIENTS.find((p) => p.id === plan.patientId) ?? { id: plan.patientId, name: plan.patientName };
  const out: Job[] = [];
  for (const phase of [...plan.phases].sort((a, b) => a.ordering - b.ordering)) {
    for (const proc of phase.procedures) {
      const cat = procedureByCode(proc.catalogCode);
      if (!cat?.generatesJob) continue;
      _planJobIdSeq += 1;
      const lab = pickLab(cat.category);
      const dueDays = 7 + phase.earliestStartOffsetWeeks * 7;
      const id = `plan-job-${plan.id}-${_planJobIdSeq}`;
      const createdAt = new Date().toISOString();
      out.push({
        id,
        patient: { id: patient.id, name: patient.name },
        lab: { id: lab.id, name: lab.name, monogram: lab.monogram },
        dentist,
        service: cat.name,
        category: cat.category,
        status: 'new',
        priority: 'standard',
        createdAt,
        dueDate: daysFromNowISO(dueDays, createdAt),
        toothNumbers: proc.toothNumber != null ? [proc.toothNumber] : [],
        notes: `Generated from plan ${plan.id} (v${plan.version}), phase "${phase.name}".`,
        attachments: [],
        activity: [
          makeActivityEvent({
            type: 'created', actorId: dentist.id, actorName: dentist.name,
            timestamp: createdAt, payload: { sourcePlanId: plan.id },
          }),
          makeActivityEvent({
            type: 'assigned', actorId: dentist.id, actorName: dentist.name,
            timestamp: createdAt, payload: { lab: lab.name },
          }),
        ],
        messages: [],
        sourcePlanId: plan.id,
      });
    }
  }
  return out;
}

function pickLab(category: Job['category']) {
  const match = LABS.find((l) => l.specialty === category);
  return match ?? LABS[0];
}

export function PlanExecuteStep({
  plan,
  onConfirmGenerate,
  onViewJobs,
}: {
  plan: TreatmentPlan;
  onConfirmGenerate: (newJobs: Job[]) => void;
  onViewJobs: () => void;
}) {
  const generatable = useMemo(() => generateJobsFromPlan(plan), [plan]);
  const [generated, setGenerated] = useState<Job[] | null>(null);

  const allowGenerate = plan.status === 'accepted' && plan.generatedJobIds.length === 0 && generatable.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header
        style={{
          backgroundColor: 'var(--ads-bg-surface)',
          border: '1px solid var(--ads-border-subtle)',
          borderRadius: 'var(--ads-radius-sm)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '17px', color: 'var(--ads-text-primary)' }}>
              {plan.patientName}
            </h3>
            <PlanStatusTag status={plan.status} />
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
            Version {plan.version} · {generatable.length} job{generatable.length === 1 ? '' : 's'} ready to generate
          </p>
        </div>
        {plan.generatedJobIds.length === 0 ? (
          <PrimaryButton
            size={44}
            disabled={!allowGenerate}
            onClick={() => {
              const jobs = generated ?? generatable;
              setGenerated(jobs);
              onConfirmGenerate(jobs);
            }}
          >
            Generate {generatable.length} job{generatable.length === 1 ? '' : 's'}
          </PrimaryButton>
        ) : (
          <PrimaryButton size={44} onClick={onViewJobs}>
            View in Jobs
          </PrimaryButton>
        )}
      </header>

      <section
        style={{
          backgroundColor: 'var(--ads-bg-surface)',
          border: '1px solid var(--ads-border-subtle)',
          borderRadius: 'var(--ads-radius-sm)',
          padding: '0',
          overflow: 'hidden',
        }}
      >
        <header
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid var(--ads-border-subtle)',
            backgroundColor: 'var(--ads-bg-muted)',
            fontFamily: 'var(--ads-font-sans)',
            fontWeight: 500,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--ads-text-muted)',
          }}
        >
          Jobs to be generated
        </header>
        {generatable.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--ads-text-muted)', fontSize: '14px' }}>
            This plan has no procedures that generate lab jobs.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {generatable.map((j, idx) => (
              <li
                key={j.id}
                style={{
                  padding: '14px 20px',
                  borderTop: idx === 0 ? 'none' : '1px solid var(--ads-border-subtle)',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: '16px',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '14px', color: 'var(--ads-text-primary)' }}>
                    {j.service}
                    {j.toothNumbers.length > 0 && (
                      <span style={{ color: 'var(--ads-text-muted)', fontWeight: 400 }}> · #{j.toothNumbers.join(', ')}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                    {j.lab.name}
                  </div>
                </div>
                <Tag color="blue">{j.category}</Tag>
                <span style={{ fontSize: '12px', color: 'var(--ads-text-muted)', whiteSpace: 'nowrap' }}>
                  Due {new Date(j.dueDate).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {plan.generatedJobIds.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--ads-tag-green-bg)',
            border: '1px solid var(--ads-tag-green-br)',
            borderRadius: 'var(--ads-radius-sm)',
            padding: '16px 20px',
            color: 'var(--ads-tag-green-fg)',
            fontFamily: 'var(--ads-font-sans)',
            fontSize: '14px',
          }}
        >
          ✓ {plan.generatedJobIds.length} job{plan.generatedJobIds.length === 1 ? '' : 's'} have been added to the Jobs page. Lab teams will be notified.
        </div>
      )}
    </div>
  );
}
