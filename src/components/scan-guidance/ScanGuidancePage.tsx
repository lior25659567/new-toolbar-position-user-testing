import React, { useState, useCallback } from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import { SecondaryButton } from '../../design-system/SecondaryButton';
import ScanGuidanceViewer from './ScanGuidanceViewer';
import type { GuidanceMode } from './types';

interface ScanGuidancePageProps {
  onBackToHome: () => void;
}

// ─── Group definitions ───────────────────────────────────────────────────────

type GroupId = 'scan' | 'dof-frame' | 'bare' | 'pulse' | 'rotation' | 'ghost-wand' | 'scan-wand' | 'ghost-scan-wand' | 'bare-ghost-wand' | 'full-ghost-wand' | 'full-arrow-ghost-wand' | 'scan-indicator';

interface GroupDef {
  id: GroupId;
  label: string;
  accent: string;
  modes: { id: GuidanceMode; label: string }[];
}

const GROUPS: GroupDef[] = [
  {
    id: 'scan', label: 'Scan Guidance', accent: color.primary,
    modes: [
      { id: 'classic', label: 'Classic' },
      { id: 'edge',    label: 'Edge Guide' },
      { id: 'dot',     label: 'Smart Dot' },
      { id: 'glow',    label: 'Glow Frame' },
    ],
  },
  {
    id: 'dof-frame', label: '6DoF + Frame', accent: color.primary,
    modes: [
      { id: 'dof-lr',    label: 'Left / Right' },
      { id: 'dof-ud',    label: 'Up / Down' },
      { id: 'dof-fb',    label: 'Forward / Back' },
      { id: 'dof-roll',  label: 'Roll' },
      { id: 'dof-pitch', label: 'Pitch' },
      { id: 'dof-yaw',   label: 'Yaw' },
    ],
  },
  {
    id: 'bare', label: 'Arrows Only', accent: color.primary,
    modes: [
      { id: 'bare-lr',    label: 'Left / Right' },
      { id: 'bare-ud',    label: 'Up / Down' },
      { id: 'bare-fb',    label: 'Forward / Back' },
      { id: 'bare-roll',  label: 'Roll' },
      { id: 'bare-pitch', label: 'Pitch' },
      { id: 'bare-yaw',   label: 'Yaw' },
    ],
  },
  {
    id: 'pulse', label: 'Pulse', accent: color.primary,
    modes: [
      { id: 'pulse-lr',    label: 'Left / Right' },
      { id: 'pulse-ud',    label: 'Up / Down' },
      { id: 'pulse-fb',    label: 'Forward / Back' },
      { id: 'pulse-roll',  label: 'Roll' },
      { id: 'pulse-pitch', label: 'Pitch' },
      { id: 'pulse-yaw',   label: 'Yaw' },
    ],
  },
  {
    id: 'rotation', label: 'Rotation', accent: color.primary,
    modes: [
      { id: 'rot-cw',   label: 'Clockwise' },
      { id: 'rot-ccw',  label: 'Counter-CW' },
      { id: 'rot-tilt', label: 'Tilt' },
    ],
  },
  {
    id: 'ghost-wand', label: 'Ghost Wand', accent: color.primary,
    modes: [
      { id: 'ghost-lr',    label: 'Left / Right' },
      { id: 'ghost-ud',    label: 'Up / Down' },
      { id: 'ghost-fb',    label: 'Forward / Back' },
      { id: 'ghost-roll',  label: 'Roll' },
      { id: 'ghost-pitch', label: 'Pitch' },
      { id: 'ghost-yaw',   label: 'Yaw' },
    ],
  },
  {
    id: 'scan-wand', label: 'Scan Wand', accent: color.primary,
    modes: [
      { id: 'wand-lr',    label: 'Left / Right' },
      { id: 'wand-ud',    label: 'Up / Down' },
      { id: 'wand-fb',    label: 'Forward / Back' },
      { id: 'wand-roll',  label: 'Roll' },
      { id: 'wand-pitch', label: 'Pitch' },
      { id: 'wand-yaw',   label: 'Yaw' },
    ],
  },
  {
    id: 'ghost-scan-wand', label: 'Ghost Scan Wand', accent: color.primary,
    modes: [
      { id: 'gwand-lr',    label: 'Left / Right' },
      { id: 'gwand-ud',    label: 'Up / Down' },
      { id: 'gwand-fb',    label: 'Forward / Back' },
      { id: 'gwand-roll',  label: 'Roll' },
      { id: 'gwand-pitch', label: 'Pitch' },
      { id: 'gwand-yaw',   label: 'Yaw' },
    ],
  },
  {
    id: 'bare-ghost-wand', label: 'Bare Ghost Wand', accent: color.primary,
    modes: [
      { id: 'bgwand-lr',    label: 'Left / Right' },
      { id: 'bgwand-ud',    label: 'Up / Down' },
      { id: 'bgwand-fb',    label: 'Forward / Back' },
      { id: 'bgwand-roll',  label: 'Roll' },
      { id: 'bgwand-pitch', label: 'Pitch' },
      { id: 'bgwand-yaw',   label: 'Yaw' },
    ],
  },
  {
    id: 'full-ghost-wand', label: 'Full Ghost Wand', accent: color.primary,
    modes: [
      { id: 'fgwand-lr',    label: 'Left / Right' },
      { id: 'fgwand-ud',    label: 'Up / Down' },
      { id: 'fgwand-fb',    label: 'Forward / Back' },
      { id: 'fgwand-roll',  label: 'Roll' },
      { id: 'fgwand-pitch', label: 'Pitch' },
      { id: 'fgwand-yaw',   label: 'Yaw' },
      { id: 'rot-cw',       label: 'Rotate CW' },
      { id: 'rot-ccw',      label: 'Rotate CCW' },
      { id: 'rot-tilt',     label: 'Tilt' },
    ],
  },
  {
    id: 'full-arrow-ghost-wand', label: 'Full Ghost + Arrows', accent: color.primary,
    modes: [
      { id: 'fagwand-lr',    label: 'Left / Right' },
      { id: 'fagwand-ud',    label: 'Up / Down' },
      { id: 'fagwand-fb',    label: 'Forward / Back' },
      { id: 'fagwand-roll',  label: 'Roll' },
      { id: 'fagwand-pitch', label: 'Pitch' },
      { id: 'fagwand-yaw',   label: 'Yaw' },
      { id: 'rot-cw',        label: 'Rotate CW' },
      { id: 'rot-ccw',       label: 'Rotate CCW' },
      { id: 'rot-tilt',      label: 'Tilt' },
    ],
  },
  {
    id: 'scan-indicator', label: 'Scan Indicator', accent: color.primary,
    modes: [
      { id: 'scan-indicator', label: 'Scan Indicator' },
    ],
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ScanGuidancePage({ onBackToHome }: ScanGuidancePageProps) {
  const [resetCounter, setResetCounter] = useState(0);
  const [activeGroup, setActiveGroup] = useState<GroupId>('scan');
  const [guidanceMode, setGuidanceMode] = useState<GuidanceMode>('classic');

  const handleReset = useCallback(() => {
    setResetCounter((c) => c + 1);
  }, []);

  const group = GROUPS.find(g => g.id === activeGroup)!;

  const handleGroupChange = (gid: GroupId) => {
    setActiveGroup(gid);
    const g = GROUPS.find(x => x.id === gid)!;
    setGuidanceMode(g.modes[0].id);
  };

  return (
    <div style={{
      width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
      backgroundColor: color.neutral50, fontFamily: font.family, overflow: 'hidden',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `${space[2]} ${space[5]}`,
        backgroundColor: color.white, borderBottom: `1px solid ${color.borderDefault}`, flexShrink: 0,
      }}>
        {/* Left: back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: space[3] }}>
          <button
            onClick={onBackToHome}
            style={{
              display: 'flex', alignItems: 'center', gap: space[1],
              padding: `${space[1]} ${space[2]}`,
              backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
              color: color.textSubtle, fontSize: font.size.sm,
              fontWeight: font.weight.medium, borderRadius: radius.md,
              transition: `color ${transition.fast}, background-color ${transition.fast}`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = color.textDefault; e.currentTarget.style.backgroundColor = color.neutral100; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = color.textSubtle; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Home
          </button>
          <div style={{ width: '1px', height: '20px', backgroundColor: color.borderDefault }} />
        </div>

        {/* Center: GROUP switcher (top level) */}
        <div style={{
          display: 'flex', border: `1px solid ${color.borderDefault}`,
          borderRadius: radius.full, overflow: 'hidden', flexShrink: 0,
        }}>
          {GROUPS.map((g, i) => {
            const active = activeGroup === g.id;
            return (
              <button
                key={g.id}
                onClick={() => handleGroupChange(g.id)}
                style={{
                  padding: `4px ${space[3]}`,
                  backgroundColor: active ? g.accent : 'transparent',
                  color: active ? '#fff' : color.textSubtle,
                  border: 'none',
                  borderLeft: i > 0 ? `1px solid ${color.borderDefault}` : 'none',
                  cursor: 'pointer', fontSize: '11px', lineHeight: '1.4',
                  fontWeight: active ? 600 : 500,
                  transition: `background-color ${transition.fast}, color ${transition.fast}`,
                  whiteSpace: 'nowrap',
                }}
              >
                {g.label}
              </button>
            );
          })}
        </div>

        {/* Right: Reset */}
        <SecondaryButton size={36} onClick={handleReset}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <path d="M3 12a9 9 0 1 1 9 9" />
            <polyline points="3 3 3 12 12 12" />
          </svg>
          Reset
        </SecondaryButton>
      </div>

      {/* Sub-mode bar — only when the group has more than 1 mode */}
      {group.modes.length > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: `${space[1]} ${space[5]}`, gap: '2px',
          backgroundColor: color.neutral25 ?? color.neutral50,
          borderBottom: `1px solid ${color.borderDefault}`, flexShrink: 0,
        }}>
          {group.modes.map((m, i) => {
            const active = guidanceMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setGuidanceMode(m.id)}
                style={{
                  padding: '4px 14px',
                  backgroundColor: active ? group.accent : 'transparent',
                  color: active ? '#fff' : color.textSubtle,
                  border: 'none',
                  borderRadius: radius.full,
                  cursor: 'pointer', fontSize: '12px', lineHeight: '1.4',
                  fontWeight: active ? 600 : 500,
                  transition: `all ${transition.fast}`,
                  whiteSpace: 'nowrap',
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Canvas area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <ScanGuidanceViewer resetTrigger={resetCounter} guidanceMode={guidanceMode} />
      </div>
    </div>
  );
}
