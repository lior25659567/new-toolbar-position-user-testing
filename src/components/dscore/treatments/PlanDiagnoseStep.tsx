import React from 'react';
import { Tag } from '../../../design-system';
import type { TreatmentPlan } from '../data/types';

const DIAGNOSIS_TAGS = [
  'caries',
  'fractured-tooth',
  'cosmetic',
  'discoloration',
  'recession',
  'orthodontic',
  'missing-tooth',
  'wear',
];

const FDI_TEETH: number[] = [
  // Upper-right (18 → 11) | Upper-left (21 → 28)
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
  // Lower-right (48 → 41) | Lower-left (31 → 38)
  48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
];

export function PlanDiagnoseStep({
  plan,
  onToggleTooth,
  onToggleDiagnosis,
}: {
  plan: TreatmentPlan;
  onToggleTooth: (n: number) => void;
  onToggleDiagnosis: (tag: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section>
        <SectionHeader title="Affected teeth" subtitle="Select all teeth involved in this plan." />
        <ToothChartGrid selected={plan.selectedTeeth} onToggle={onToggleTooth} />
      </section>

      <section>
        <SectionHeader title="Diagnosis" subtitle="Tag the relevant findings — these become metadata on the plan." />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {DIAGNOSIS_TAGS.map((tag) => {
            const active = plan.diagnosisTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleDiagnosis(tag)}
                aria-pressed={active}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: `1px solid ${active ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
                  backgroundColor: active ? 'var(--ads-blue-50)' : 'var(--ads-bg-surface)',
                  color: active ? 'var(--ads-blue-text)' : 'var(--ads-text-primary)',
                  fontFamily: 'var(--ads-font-sans)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {tag.replace(/-/g, ' ')}
              </button>
            );
          })}
        </div>
      </section>

      {plan.selectedTeeth.length > 0 && (
        <section>
          <SectionHeader title="Selected teeth" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {plan.selectedTeeth.sort((a, b) => a - b).map((n) => (
              <Tag key={n} color="blue">#{n}</Tag>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ToothChartGrid({ selected, onToggle }: { selected: number[]; onToggle: (n: number) => void }) {
  // 2-row layout matching dental notation: upper arch on top, lower arch below.
  const upper = FDI_TEETH.slice(0, 16);
  const lower = FDI_TEETH.slice(16);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <ToothRow row={upper} selected={selected} onToggle={onToggle} />
      <ToothRow row={lower} selected={selected} onToggle={onToggle} />
    </div>
  );
}

function ToothRow({ row, selected, onToggle }: { row: number[]; selected: number[]; onToggle: (n: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {row.map((n) => {
        const active = selected.includes(n);
        return (
          <button
            key={n}
            type="button"
            onClick={() => onToggle(n)}
            aria-pressed={active}
            aria-label={`Tooth ${n}`}
            style={{
              flex: '1 1 0',
              minWidth: '36px',
              height: '44px',
              borderRadius: 'var(--ads-radius-sm)',
              border: `1px solid ${active ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
              backgroundColor: active ? 'var(--ads-blue-500)' : 'var(--ads-bg-surface)',
              color: active ? '#fff' : 'var(--ads-text-primary)',
              fontFamily: 'var(--ads-font-sans)',
              fontWeight: 500,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'background-color var(--ads-duration-fast), border-color var(--ads-duration-fast)',
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header style={{ marginBottom: '12px' }}>
      <h3
        style={{
          margin: 0,
          fontFamily: 'var(--ads-font-sans)',
          fontWeight: 500,
          fontSize: '17px',
          lineHeight: '24px',
          color: 'var(--ads-text-primary)',
        }}
      >
        {title}
      </h3>
      {subtitle && (
        <p style={{ margin: '4px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
