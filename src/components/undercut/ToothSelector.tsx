import React from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import { UPPER_TEETH, LOWER_TEETH } from './types';
import type { CaseType } from './types';

interface ToothSelectorProps {
  selectedTeeth: number[];
  onToggleTooth: (toothId: number, shiftKey: boolean) => void;
  onSelectFullArch: (arch: 'upper' | 'lower') => void;
  onClear: () => void;
  caseType: CaseType;
}

const CASE_LABELS: Record<CaseType, string> = {
  'single-crown': 'Single Crown',
  'bridge': 'Bridge',
  'full-arch': 'Full Arch',
};

/** Simple arch-shaped tooth layout */
function ToothArc({
  teeth,
  selected,
  onToggle,
  isUpper,
}: {
  teeth: readonly number[];
  selected: number[];
  onToggle: (id: number, shift: boolean) => void;
  isUpper: boolean;
}) {
  const count = teeth.length;
  const arcRadius = 90;
  const startAngle = isUpper ? Math.PI * 0.15 : -Math.PI * 0.15;
  const endAngle = isUpper ? Math.PI * 0.85 : -Math.PI * 0.85;

  return (
    <svg width="240" height="130" viewBox="-120 -10 240 140">
      {/* Arch line */}
      <path
        d={isUpper
          ? `M ${-arcRadius * Math.cos(startAngle)} ${-arcRadius * Math.sin(startAngle) + 60} Q 0 ${-arcRadius + 10} ${arcRadius * Math.cos(startAngle)} ${-arcRadius * Math.sin(startAngle) + 60}`
          : `M ${-arcRadius * Math.cos(-startAngle)} ${arcRadius * Math.sin(-startAngle) + 60} Q 0 ${arcRadius + 70} ${arcRadius * Math.cos(-startAngle)} ${arcRadius * Math.sin(-startAngle) + 60}`
        }
        stroke={color.neutral300}
        strokeWidth="1"
        fill="none"
        strokeDasharray="3 3"
      />
      {teeth.map((tooth, i) => {
        const t = i / (count - 1);
        const angle = startAngle + t * (endAngle - startAngle);
        const x = arcRadius * Math.cos(angle);
        const y = isUpper
          ? -arcRadius * Math.sin(angle) + 60
          : arcRadius * Math.sin(-angle) + 60;
        const isSelected = selected.includes(tooth);
        return (
          <g key={tooth} style={{ cursor: 'pointer' }} onClick={(e) => onToggle(tooth, e.shiftKey)}>
            <circle
              cx={x} cy={y} r={12}
              fill={isSelected ? color.primary : color.white}
              stroke={isSelected ? color.primaryPressed : color.neutral300}
              strokeWidth={isSelected ? 2 : 1}
            />
            <text
              x={x} y={y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8"
              fontWeight={isSelected ? 600 : 400}
              fill={isSelected ? '#fff' : color.textDefault}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {tooth}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ToothSelector({
  selectedTeeth,
  onToggleTooth,
  onSelectFullArch,
  onClear,
  caseType,
}: ToothSelectorProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: space[3],
      padding: space[4], backgroundColor: color.white,
      borderRadius: radius.lg, border: `1px solid ${color.borderDefault}`,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: font.size.sm, fontWeight: font.weight.bold, color: color.textHeading }}>
            Tooth Selection
          </div>
          <div style={{ fontSize: font.size.xs, color: color.textSubtle, marginTop: '2px' }}>
            Click to select · Shift+click for range
          </div>
        </div>
        {selectedTeeth.length > 0 && (
          <span style={{
            padding: '2px 10px', borderRadius: radius.full,
            backgroundColor: color.primary, color: '#fff',
            fontSize: '11px', fontWeight: 600,
          }}>
            {CASE_LABELS[caseType]}
          </span>
        )}
      </div>

      {/* Upper arch */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: color.textPlaceholder, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upper</div>
        <ToothArc teeth={UPPER_TEETH} selected={selectedTeeth} onToggle={onToggleTooth} isUpper={true} />
      </div>

      {/* Lower arch */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: color.textPlaceholder, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lower</div>
        <ToothArc teeth={LOWER_TEETH} selected={selectedTeeth} onToggle={onToggleTooth} isUpper={false} />
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: space[2] }}>
        <button
          onClick={() => onSelectFullArch('upper')}
          style={{
            flex: 1, padding: '6px 0', border: `1px solid ${color.borderDefault}`,
            borderRadius: radius.md, backgroundColor: color.white, cursor: 'pointer',
            fontSize: '11px', fontWeight: 500, color: color.textDefault,
            transition: `background-color ${transition.fast}`,
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = color.neutral50; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = color.white; }}
        >
          Select Upper Arch
        </button>
        <button
          onClick={() => onSelectFullArch('lower')}
          style={{
            flex: 1, padding: '6px 0', border: `1px solid ${color.borderDefault}`,
            borderRadius: radius.md, backgroundColor: color.white, cursor: 'pointer',
            fontSize: '11px', fontWeight: 500, color: color.textDefault,
            transition: `background-color ${transition.fast}`,
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = color.neutral50; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = color.white; }}
        >
          Select Lower Arch
        </button>
      </div>

      {selectedTeeth.length > 0 && (
        <button
          onClick={onClear}
          style={{
            padding: '6px 0', border: 'none', borderRadius: radius.md,
            backgroundColor: color.neutral100, cursor: 'pointer',
            fontSize: '11px', fontWeight: 500, color: color.textSubtle,
            transition: `background-color ${transition.fast}`,
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = color.neutral200; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = color.neutral100; }}
        >
          Clear Selection ({selectedTeeth.length} selected)
        </button>
      )}
    </div>
  );
}
