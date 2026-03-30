import React, { useState } from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import { SecondaryButton } from '../../design-system/SecondaryButton';
import { PrimaryButton } from '../../design-system/PrimaryButton';

// FDI numbering displayed from left to right on screen (patient facing viewer)
// Upper: Q1 right (18→11) | Q2 left (21→28)
// Lower: Q4 right (48→41) | Q3 left (31→38)
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT  = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const LOWER_LEFT  = [31, 32, 33, 34, 35, 36, 37, 38];

interface ToothSelectorProps {
  selected: number[];
  onChange: (teeth: number[]) => void;
  compact?: boolean;
}

function ToothButton({
  num,
  isSelected,
  onClick,
  position,
}: {
  num: number;
  isSelected: boolean;
  onClick: () => void;
  position: 'upper' | 'lower';
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: position === 'upper' ? 'column' : 'column-reverse',
        alignItems: 'center',
        gap: '1px',
        cursor: 'pointer',
        minWidth: 0,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooth number */}
      <span style={{
        fontSize: '8px',
        fontWeight: font.weight.medium,
        color: isSelected ? color.primary : color.textPlaceholder,
        lineHeight: '1',
        userSelect: 'none',
        width: '18px',
        textAlign: 'center',
      }}>
        {num}
      </span>
      {/* Tooth circle */}
      <div style={{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isSelected ? color.primary : hovered ? '#E0F2FE' : 'transparent',
        border: `1.5px solid ${isSelected ? color.primary : hovered ? color.primary : color.neutral300}`,
        transition: `all ${transition.fast}`,
      }}>
        {/* Tooth icon shape */}
        <div style={{
          width: '8px',
          height: '10px',
          borderRadius: position === 'upper' ? '2px 2px 4px 4px' : '4px 4px 2px 2px',
          backgroundColor: isSelected ? color.white : hovered ? color.primary : color.neutral400,
          transition: `all ${transition.fast}`,
          opacity: isSelected ? 0.9 : 0.5,
        }} />
      </div>
    </div>
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
              color: color.tagBlue.text,
              backgroundColor: color.tagBlue.bg,
              border: `1px solid ${color.tagBlue.border}`,
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

  const renderArch = (teeth: number[], position: 'upper' | 'lower') => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1px', flexShrink: 0 }}>
      {teeth.map((num) => (
        <ToothButton
          key={num}
          num={num}
          isSelected={selected.includes(num)}
          onClick={() => toggle(num)}
          position={position}
        />
      ))}
    </div>
  );

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

      {/* Arch chart — content wraps inside container */}
      <div style={{
        backgroundColor: color.neutral50,
        borderRadius: radius.md,
        padding: `${space[2]} ${space[2]}`,
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Quadrant labels top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: space[1], padding: `0 ${space[1]}` }}>
          <span style={{ fontSize: '9px', fontWeight: font.weight.semibold, color: color.textPlaceholder, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Upper right
          </span>
          <span style={{ fontSize: '9px', fontWeight: font.weight.semibold, color: color.textPlaceholder, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Upper left
          </span>
        </div>

        {/* Upper arch */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: space[1] }}>
          {renderArch(UPPER_RIGHT, 'upper')}
          <div style={{ width: '2px', flexShrink: 0, backgroundColor: color.neutral300, borderRadius: '1px', alignSelf: 'stretch' }} />
          {renderArch(UPPER_LEFT, 'upper')}
        </div>

        {/* YOUR TEETH label */}
        <div style={{
          textAlign: 'center',
          padding: `${space[2]} 0`,
          fontSize: '10px',
          fontWeight: font.weight.semibold,
          color: color.neutral400,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Your Teeth
        </div>

        {/* Lower arch */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: space[1] }}>
          {renderArch(LOWER_RIGHT, 'lower')}
          <div style={{ width: '2px', flexShrink: 0, backgroundColor: color.neutral300, borderRadius: '1px', alignSelf: 'stretch' }} />
          {renderArch(LOWER_LEFT, 'lower')}
        </div>

        {/* Quadrant labels bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: space[1], padding: `0 ${space[1]}` }}>
          <span style={{ fontSize: '9px', fontWeight: font.weight.semibold, color: color.textPlaceholder, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Lower right
          </span>
          <span style={{ fontSize: '9px', fontWeight: font.weight.semibold, color: color.textPlaceholder, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Lower left
          </span>
        </div>
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
