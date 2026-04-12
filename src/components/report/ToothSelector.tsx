import React, { useState } from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import { SecondaryButton } from '../../design-system/SecondaryButton';
import { PrimaryButton } from '../../design-system/PrimaryButton';
import { TOOTH_PATHS } from './toothChartPaths';

interface ToothSelectorProps {
  selected: number[];
  onChange: (teeth: number[]) => void;
  compact?: boolean;
}

function ToothShape({
  num,
  d,
  cx,
  cy,
  isSelected,
  onClick,
}: {
  num: number;
  d: string;
  cx: number;
  cy: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const fill = isSelected ? color.primary : hovered ? '#E0F2FE' : color.white;
  const stroke = isSelected ? color.primary : hovered ? color.primary : color.neutral400;
  const strokeWidth = isSelected || hovered ? 4 : 2;
  const textColor = isSelected ? color.white : color.textSubtle;

  return (
    <g
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      <title>{num}</title>
      <path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={{ transition: `fill ${transition.fast}, stroke ${transition.fast}` }}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="30"
        fontWeight="400"
        fontFamily={font.family}
        fill={textColor}
        style={{ pointerEvents: 'none', userSelect: 'none', transition: `fill ${transition.fast}` }}
      >
        {num}
      </text>
    </g>
  );
}

export default function ToothSelector({ selected, onChange, compact }: ToothSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (num: number) => {
    if (selected.includes(num)) {
      onChange(selected.filter((t) => t !== num));
    } else {
      onChange([...selected, num].sort((a, b) => a - b));
    }
  };

  const clearAll = () => onChange([]);

  // Compact mode: show selected tags + toggle button
  if (compact && !isOpen) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: space[1], alignItems: 'center' }}>
        {selected.length > 0 && selected.map((t) => (
          <span
            key={t}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: `2px ${space[2]}`,
              fontSize: font.size.xs,
              fontWeight: font.weight.medium,
              color: '#374151',
              backgroundColor: '#F9FAFB',
              border: `1px solid ${color.borderDefault}`,
              borderRadius: radius.sm,
              lineHeight: '1.4',
            }}
          >
            {t}
            <span
              onClick={(e) => { e.stopPropagation(); toggle(t); }}
              style={{ cursor: 'pointer', opacity: 0.6, fontSize: '10px' }}
            >
              x
            </span>
          </span>
        ))}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            height: '24px',
            padding: `0 ${space[2]}`,
            fontSize: font.size.xs,
            fontWeight: font.weight.medium,
            color: color.primary,
            backgroundColor: 'transparent',
            border: `1px dashed ${color.primary}`,
            borderRadius: radius.sm,
            cursor: 'pointer',
            transition: `background-color ${transition.fast}`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E0F2FE'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          {selected.length === 0 ? '+ Select teeth' : '+ Add'}
        </button>
      </div>
    );
  }

  return (
    <div style={{
      border: `1px solid ${color.borderDefault}`,
      borderRadius: radius.lg,
      padding: space[3],
      backgroundColor: color.white,
      overflow: 'hidden',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: space[3],
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: space[2] }}>
          <span style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textHeading }}>
            Tooth Chart
          </span>
          {selected.length > 0 && (
            <span style={{
              fontSize: '10px',
              fontWeight: font.weight.medium,
              color: color.primary,
              backgroundColor: '#E0F2FE',
              padding: '1px 6px',
              borderRadius: radius.full,
            }}>
              {selected.length} selected
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: space[2] }}>
          {selected.length > 0 && (
            <SecondaryButton size={36} onClick={clearAll} style={{ minHeight: '26px', padding: `0 ${space[2]}`, fontSize: '11px' }}>
              Clear
            </SecondaryButton>
          )}
          {compact && (
            <PrimaryButton size={36} onClick={() => setIsOpen(false)} style={{ minHeight: '26px', padding: `0 ${space[3]}`, fontSize: '11px' }}>
              Done
            </PrimaryButton>
          )}
        </div>
      </div>

      {/* Arch chart — full SVG tooth illustration */}
      <div style={{
        backgroundColor: color.neutral50,
        borderRadius: radius.md,
        padding: space[3],
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <svg
          viewBox="0 0 1094 1651"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', maxWidth: '300px', height: 'auto', display: 'block' }}
        >
          {TOOTH_PATHS.map(({ num, d, cx, cy }) => (
            <ToothShape
              key={num}
              num={num}
              d={d}
              cx={cx}
              cy={cy}
              isSelected={selected.includes(num)}
              onClick={() => toggle(num)}
            />
          ))}
        </svg>
      </div>

      {/* Selected summary */}
      {selected.length > 0 && (
        <div style={{
          marginTop: space[3],
          display: 'flex',
          flexWrap: 'wrap',
          gap: space[1],
        }}>
          {selected.map((t) => (
            <span
              key={t}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: `1px ${space[2]}`,
                fontSize: font.size.xs,
                fontWeight: font.weight.medium,
                color: color.tagBlue.text,
                backgroundColor: color.tagBlue.bg,
                border: `1px solid ${color.tagBlue.border}`,
                borderRadius: radius.sm,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
