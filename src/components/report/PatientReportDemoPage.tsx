import React, { useEffect, useRef, useState } from 'react';
import { color, font, space, radius, shadow, transition } from '../../design-system/tokens';
import { SecondaryButton } from '../../design-system/SecondaryButton';
import { PrimaryButton } from '../../design-system/PrimaryButton';
import { IconButton } from '../../design-system/IconButton';
import { Toggle } from '../../design-system/Toggle';
import { Tag } from '../../design-system/Tag';
import { TOOTH_PATHS } from './toothChartPaths';

// ─── Scripted demo engine ────────────────────────────────────────────────────

type Step<S> = {
  label: string;
  delay: number;
  apply: (state: S) => S;
};

type DemoDef<S> = {
  id: string;
  title: string;
  description: string;
  initialState: S;
  steps: Step<S>[];
  stage: (state: S) => React.ReactNode;
  caption?: (state: S, stepIndex: number) => string;
};

function DemoCard<S>({ demo }: { demo: DemoDef<S> }) {
  const [state, setState] = useState<S>(demo.initialState);
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const cleanup = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => cleanup, []);

  useEffect(() => {
    if (!playing) { cleanup(); return; }
    if (stepIndex >= demo.steps.length - 1) {
      setPlaying(false);
      return;
    }
    const next = demo.steps[stepIndex + 1];
    timeoutRef.current = window.setTimeout(() => {
      setState((s) => next.apply(s));
      setStepIndex(stepIndex + 1);
    }, next.delay);
    return cleanup;
  }, [playing, stepIndex, demo]);

  const play = () => {
    if (stepIndex >= demo.steps.length - 1) {
      setState(demo.initialState);
      setStepIndex(-1);
    }
    setPlaying(true);
  };
  const pause = () => setPlaying(false);
  const restart = () => {
    cleanup();
    setPlaying(false);
    setState(demo.initialState);
    setStepIndex(-1);
    window.setTimeout(() => setPlaying(true), 50);
  };

  const progress = demo.steps.length === 0 ? 0 : Math.max(0, (stepIndex + 1) / demo.steps.length);
  const currentLabel = stepIndex >= 0 && stepIndex < demo.steps.length ? demo.steps[stepIndex].label : 'Press play to start';

  return (
    <div style={{
      backgroundColor: color.white,
      border: `1px solid ${color.borderDefault}`,
      borderRadius: radius.lg,
      boxShadow: shadow.sm,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 380,
    }}>
      {/* Header */}
      <div style={{ padding: `${space[4]} ${space[5]}`, borderBottom: `1px solid ${color.borderDefault}` }}>
        <div style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: color.textHeading }}>
          {demo.title}
        </div>
        <div style={{ fontSize: font.size.xs, color: color.textSubtle, marginTop: '2px', lineHeight: '1.45' }}>
          {demo.description}
        </div>
      </div>

      {/* Stage */}
      <div style={{
        flex: 1,
        padding: space[5],
        backgroundColor: color.neutral50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div style={{ width: '100%', maxWidth: '100%' }}>
          {demo.stage(state)}
        </div>
      </div>

      {/* Transport */}
      <div style={{ padding: `${space[3]} ${space[5]}`, borderTop: `1px solid ${color.borderDefault}`, display: 'flex', flexDirection: 'column', gap: space[2] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: space[2] }}>
          {playing ? (
            <IconButton size="sm" aria-label="Pause" onClick={pause}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="3" y="2" width="2" height="8" rx="0.5" /><rect x="7" y="2" width="2" height="8" rx="0.5" /></svg>
            </IconButton>
          ) : (
            <IconButton size="sm" aria-label="Play" onClick={play}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3.5 2l6 4-6 4z" /></svg>
            </IconButton>
          )}
          <IconButton size="sm" aria-label="Restart" onClick={restart}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7a5 5 0 1 0 1.5-3.5" />
              <path d="M2 2v3h3" />
            </svg>
          </IconButton>
          <div style={{ flex: 1, height: 4, backgroundColor: color.neutral150, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: color.primary, transition: 'width 0.25s ease' }} />
          </div>
          <span style={{ fontSize: font.size['2xs'], color: color.textSubtle, fontVariantNumeric: 'tabular-nums', minWidth: 34, textAlign: 'right' }}>
            {Math.max(0, stepIndex + 1)}/{demo.steps.length}
          </span>
        </div>
        <div style={{ fontSize: font.size['2xs'], color: color.textSubtle, minHeight: 14 }}>{currentLabel}</div>
      </div>
    </div>
  );
}

// ─── Shared stage helpers ────────────────────────────────────────────────────

const STAGE_PAPER: React.CSSProperties = {
  backgroundColor: color.white,
  border: `1px solid ${color.borderDefault}`,
  borderRadius: radius.md,
  padding: space[4],
  boxShadow: shadow.sm,
};

function FakeCursor({ x, y, visible = true }: { x: number; y: number; visible?: boolean }) {
  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: 18,
      height: 18,
      pointerEvents: 'none',
      transition: 'left 0.5s cubic-bezier(.4,0,.2,1), top 0.5s cubic-bezier(.4,0,.2,1), opacity 0.25s',
      opacity: visible ? 1 : 0,
      transform: 'translate(-4px, -2px)',
      zIndex: 5,
    }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 2L16 9L9 10.5L7 16L2 2Z" fill={color.primary} stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─── Demo 1: Template Picker ─────────────────────────────────────────────────

const TEMPLATE_LIST = [
  { id: 'general', name: 'General Scan', blocks: 2 },
  { id: 'implant', name: 'Implant Planning', blocks: 3 },
  { id: 'crown', name: 'Crown Prep', blocks: 3 },
  { id: 'followup', name: 'Follow-up', blocks: 2 },
];

type TemplateState = { selected: string | null; hover: string | null; cursor: { x: number; y: number } };
const templateDemo: DemoDef<TemplateState> = {
  id: 'templates',
  title: 'Report Templates',
  description: 'Start from a pre-built template to speed up reports for common procedures.',
  initialState: { selected: null, hover: null, cursor: { x: 10, y: 20 } },
  steps: [
    { label: 'Open template picker', delay: 600, apply: (s) => ({ ...s, cursor: { x: 25, y: 35 } }) },
    { label: 'Hover General Scan', delay: 700, apply: (s) => ({ ...s, hover: 'general', cursor: { x: 25, y: 35 } }) },
    { label: 'Hover Implant Planning', delay: 800, apply: (s) => ({ ...s, hover: 'implant', cursor: { x: 75, y: 35 } }) },
    { label: 'Hover Crown Prep', delay: 800, apply: (s) => ({ ...s, hover: 'crown', cursor: { x: 25, y: 75 } }) },
    { label: 'Select Crown Prep', delay: 700, apply: (s) => ({ ...s, selected: 'crown', hover: null }) },
    { label: '3 sections ready to customize', delay: 900, apply: (s) => s },
  ],
  stage: (state) => (
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space[2] }}>
      {TEMPLATE_LIST.map((t) => {
        const isHover = state.hover === t.id;
        const isSelected = state.selected === t.id;
        return (
          <div key={t.id} style={{
            padding: space[3],
            borderRadius: radius.md,
            border: `1.5px solid ${isSelected ? color.primary : isHover ? color.primary : color.neutral200}`,
            backgroundColor: isSelected ? '#E0F2FE' : isHover ? color.bgHover : color.white,
            transition: `all ${transition.base}`,
          }}>
            <div style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textHeading }}>{t.name}</div>
            <div style={{ fontSize: font.size['2xs'], color: color.textSubtle, marginTop: 2 }}>{t.blocks} sections</div>
          </div>
        );
      })}
      <FakeCursor x={state.cursor.x} y={state.cursor.y} />
    </div>
  ),
};

// ─── Demo 2: Image Upload & Gallery ──────────────────────────────────────────

const GALLERY_CATS = ['Full Arch', 'Prep & Review', 'Diagnostics'];
type GalleryState = { openCat: string | null; selected: number | null; picked: boolean };
const galleryDemo: DemoDef<GalleryState> = {
  id: 'gallery',
  title: 'Media Gallery',
  description: 'Upload a clinical photo or pick from a categorized gallery of pre-loaded scans.',
  initialState: { openCat: null, selected: null, picked: false },
  steps: [
    { label: 'Open gallery', delay: 600, apply: (s) => ({ ...s, openCat: 'Full Arch' }) },
    { label: 'Switch to Prep & Review', delay: 800, apply: (s) => ({ ...s, openCat: 'Prep & Review' }) },
    { label: 'Hover image 3', delay: 700, apply: (s) => ({ ...s, selected: 2 }) },
    { label: 'Select image', delay: 700, apply: (s) => ({ ...s, picked: true }) },
    { label: 'Image added to section', delay: 800, apply: (s) => s },
  ],
  stage: (state) => (
    <div style={{ ...STAGE_PAPER, padding: space[3] }}>
      {!state.picked ? (
        <>
          <div style={{ display: 'flex', gap: space[2], marginBottom: space[3] }}>
            {GALLERY_CATS.map((c) => (
              <div key={c} style={{
                padding: `${space[1]} ${space[3]}`,
                borderRadius: radius.full,
                fontSize: font.size['2xs'],
                fontWeight: font.weight.medium,
                backgroundColor: state.openCat === c ? color.primary : color.neutral100,
                color: state.openCat === c ? color.textOnPrimary : color.textSubtle,
                transition: `all ${transition.base}`,
              }}>{c}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: space[2] }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} style={{
                aspectRatio: '1',
                borderRadius: radius.sm,
                border: `1.5px solid ${state.selected === i ? color.primary : color.neutral200}`,
                background: `linear-gradient(135deg, #e2e8f0, #f1f5f9)`,
                transition: `all ${transition.base}`,
                transform: state.selected === i ? 'scale(1.05)' : 'scale(1)',
              }} />
            ))}
          </div>
        </>
      ) : (
        <div style={{
          borderRadius: radius.md,
          border: `1px solid ${color.borderDefault}`,
          overflow: 'hidden',
          background: `linear-gradient(135deg, #e2e8f0, #f1f5f9)`,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color.textSubtle,
          fontSize: font.size.xs,
        }}>Selected image</div>
      )}
    </div>
  ),
};

// ─── Demo 3: Image Annotation ────────────────────────────────────────────────

type AnnotateState = { tool: 'pen' | 'arrow' | 'text'; strokes: { x: number; y: number }[][] };
const annotateDemo: DemoDef<AnnotateState> = {
  id: 'annotate',
  title: 'Image Annotation',
  description: 'Highlight findings with pen, arrow, and text tools right on the image.',
  initialState: { tool: 'pen', strokes: [] },
  steps: [
    { label: 'Pick pen tool', delay: 500, apply: (s) => ({ ...s, tool: 'pen' as const }) },
    { label: 'Draw on image', delay: 700, apply: (s) => ({ ...s, strokes: [[{ x: 30, y: 40 }, { x: 40, y: 35 }, { x: 55, y: 45 }, { x: 65, y: 50 }]] }) },
    { label: 'Add arrow', delay: 600, apply: (s) => ({ ...s, tool: 'arrow' as const }) },
    { label: 'Draw arrow', delay: 700, apply: (s) => ({ ...s, strokes: [...s.strokes, [{ x: 70, y: 70 }, { x: 55, y: 55 }]] }) },
    { label: 'Save annotations', delay: 800, apply: (s) => s },
  ],
  stage: (state) => (
    <div style={{ ...STAGE_PAPER, padding: space[3] }}>
      <div style={{ display: 'flex', gap: space[2], marginBottom: space[3] }}>
        {(['pen', 'arrow', 'text'] as const).map((t) => (
          <div key={t} style={{
            padding: `${space[1]} ${space[3]}`,
            borderRadius: radius.sm,
            fontSize: font.size['2xs'],
            fontWeight: font.weight.medium,
            backgroundColor: state.tool === t ? color.primary : color.neutral100,
            color: state.tool === t ? color.textOnPrimary : color.textSubtle,
            textTransform: 'capitalize',
            transition: `all ${transition.base}`,
          }}>{t}</div>
        ))}
      </div>
      <div style={{
        position: 'relative',
        height: 180,
        borderRadius: radius.sm,
        background: `linear-gradient(135deg, #e2e8f0, #f1f5f9)`,
        overflow: 'hidden',
      }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
          {state.strokes.map((stroke, i) => {
            if (stroke.length < 2) return null;
            const d = `M ${stroke.map((p) => `${p.x} ${p.y}`).join(' L ')}`;
            return <path key={i} d={d} fill="none" stroke={color.danger} strokeWidth="1.2" strokeLinecap="round" />;
          })}
        </svg>
      </div>
    </div>
  ),
};

// ─── Demo 4: Tooth Chart ─────────────────────────────────────────────────────

type ToothState = { selected: number[] };
const SCRIPTED_TEETH = [16, 15, 14, 13];
const toothDemo: DemoDef<ToothState> = {
  id: 'tooth',
  title: 'Interactive Tooth Chart',
  description: 'Tag treatment plans to specific teeth with a click. FDI numbering, both arches.',
  initialState: { selected: [] },
  steps: [
    { label: 'Click tooth 16', delay: 600, apply: (s) => ({ selected: [16] }) },
    { label: 'Click tooth 15', delay: 600, apply: (s) => ({ selected: [16, 15] }) },
    { label: 'Click tooth 14', delay: 600, apply: (s) => ({ selected: [16, 15, 14] }) },
    { label: 'Click tooth 13', delay: 600, apply: (s) => ({ selected: [16, 15, 14, 13] }) },
    { label: '4 teeth tagged to treatment', delay: 700, apply: (s) => s },
  ],
  stage: (state) => (
    <div style={{ ...STAGE_PAPER, display: 'flex', justifyContent: 'center' }}>
      <svg viewBox="0 0 1094 1651" style={{ width: '100%', maxWidth: 260, height: 'auto' }}>
        {TOOTH_PATHS.map(({ num, d, cx, cy }) => {
          const isSelected = state.selected.includes(num);
          return (
            <g key={num}>
              <path d={d} fill={isSelected ? color.primary : color.white} stroke={isSelected ? color.primary : color.neutral400} strokeWidth={isSelected ? 4 : 2} />
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="28" fontFamily={font.family} fill={isSelected ? color.white : color.textSubtle}>{num}</text>
            </g>
          );
        })}
      </svg>
    </div>
  ),
};

// ─── Demo 5: Multi-section Builder ───────────────────────────────────────────

type SectionType = 'image' | 'notes' | 'diagnosis' | 'treatment' | 'cost' | 'comparison';
type SectionsState = { items: { id: number; type: SectionType; label: string }[] };
const sectionLabel: Record<SectionType, string> = {
  image: 'Image',
  notes: 'Notes',
  diagnosis: 'Diagnosis',
  treatment: 'Treatment',
  cost: 'Cost Summary',
  comparison: 'Before / After',
};
const sectionsDemo: DemoDef<SectionsState> = {
  id: 'sections',
  title: 'Multi-Section Builder',
  description: 'Compose reports from image, notes, diagnosis, treatment, cost, and before/after sections.',
  initialState: { items: [{ id: 1, type: 'image', label: 'Image' }] },
  steps: [
    { label: 'Add Diagnosis section', delay: 600, apply: (s) => ({ items: [...s.items, { id: 2, type: 'diagnosis', label: 'Diagnosis' }] }) },
    { label: 'Add Treatment section', delay: 600, apply: (s) => ({ items: [...s.items, { id: 3, type: 'treatment', label: 'Treatment' }] }) },
    { label: 'Add Cost Summary', delay: 600, apply: (s) => ({ items: [...s.items, { id: 4, type: 'cost', label: 'Cost Summary' }] }) },
    { label: 'Reorder Treatment up', delay: 700, apply: (s) => {
      const items = [...s.items];
      const idx = items.findIndex((x) => x.type === 'treatment');
      if (idx > 1) { [items[idx], items[idx - 1]] = [items[idx - 1], items[idx]]; }
      return { items };
    } },
    { label: '4 sections composed', delay: 700, apply: (s) => s },
  ],
  stage: (state) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
      {state.items.map((it) => (
        <div key={it.id} style={{
          ...STAGE_PAPER,
          padding: `${space[2]} ${space[3]}`,
          display: 'flex',
          alignItems: 'center',
          gap: space[2],
          fontSize: font.size.xs,
          fontWeight: font.weight.medium,
          color: color.textHeading,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={color.neutral400} strokeWidth="1.5">
            <circle cx="3" cy="3" r="0.5" fill="currentColor" /><circle cx="3" cy="6" r="0.5" fill="currentColor" /><circle cx="3" cy="9" r="0.5" fill="currentColor" />
            <circle cx="9" cy="3" r="0.5" fill="currentColor" /><circle cx="9" cy="6" r="0.5" fill="currentColor" /><circle cx="9" cy="9" r="0.5" fill="currentColor" />
          </svg>
          <span style={{ flex: 1 }}>{it.label}</span>
          <Tag color="blue" size="small">{sectionLabel[it.type]}</Tag>
        </div>
      ))}
    </div>
  ),
};

// ─── Demo 6: Before / After ──────────────────────────────────────────────────

type CompareState = { beforeLoaded: boolean; afterLoaded: boolean; label: string };
const compareDemo: DemoDef<CompareState> = {
  id: 'compare',
  title: 'Before / After Comparison',
  description: 'Side-by-side comparison with custom labels for treatment progression.',
  initialState: { beforeLoaded: false, afterLoaded: false, label: 'Before' },
  steps: [
    { label: 'Upload before image', delay: 700, apply: (s) => ({ ...s, beforeLoaded: true }) },
    { label: 'Upload after image', delay: 700, apply: (s) => ({ ...s, afterLoaded: true }) },
    { label: 'Rename label to "Initial"', delay: 800, apply: (s) => ({ ...s, label: 'Initial' }) },
    { label: 'Comparison ready', delay: 800, apply: (s) => s },
  ],
  stage: (state) => (
    <div style={{ ...STAGE_PAPER, display: 'flex', gap: space[3] }}>
      {[
        { loaded: state.beforeLoaded, label: state.label },
        { loaded: state.afterLoaded, label: 'After' },
      ].map((side, i) => (
        <div key={i} style={{ flex: 1 }}>
          <div style={{ fontSize: font.size['2xs'], fontWeight: font.weight.semibold, color: color.textLabel, textAlign: 'center', marginBottom: 4 }}>{side.label}</div>
          <div style={{
            height: 120,
            borderRadius: radius.sm,
            background: side.loaded ? `linear-gradient(135deg, #e2e8f0, #f1f5f9)` : color.neutral100,
            border: `1px dashed ${color.neutral200}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color.textPlaceholder,
            fontSize: font.size['2xs'],
          }}>{side.loaded ? '' : 'No image'}</div>
        </div>
      ))}
    </div>
  ),
};

// ─── Demo 7: Cost Summary ────────────────────────────────────────────────────

type CostState = { items: { desc: string; amount: number }[] };
const costDemo: DemoDef<CostState> = {
  id: 'cost',
  title: 'Cost Summary',
  description: 'Build itemized price tables for treatment estimates. Totals update live.',
  initialState: { items: [{ desc: 'Consultation', amount: 120 }] },
  steps: [
    { label: 'Add X-Ray line', delay: 600, apply: (s) => ({ items: [...s.items, { desc: 'X-Ray', amount: 80 }] }) },
    { label: 'Add Crown prep', delay: 600, apply: (s) => ({ items: [...s.items, { desc: 'Crown prep', amount: 400 }] }) },
    { label: 'Add Ceramic crown', delay: 600, apply: (s) => ({ items: [...s.items, { desc: 'Ceramic crown', amount: 1200 }] }) },
    { label: 'Total auto-updates', delay: 700, apply: (s) => s },
  ],
  stage: (state) => {
    const total = state.items.reduce((sum, it) => sum + it.amount, 0);
    return (
      <div style={{ ...STAGE_PAPER, padding: `${space[3]} ${space[4]}` }}>
        <div style={{ display: 'flex', fontSize: font.size['2xs'], fontWeight: font.weight.semibold, color: color.textLabel, paddingBottom: space[1], borderBottom: `1px solid ${color.borderDefault}` }}>
          <span style={{ flex: 1 }}>Item</span>
          <span>Amount</span>
        </div>
        {state.items.map((it, i) => (
          <div key={i} style={{ display: 'flex', padding: `${space[1]} 0`, fontSize: font.size.xs, color: color.textDefault, borderBottom: `1px solid ${color.neutral100}` }}>
            <span style={{ flex: 1 }}>{it.desc}</span>
            <span>${it.amount}</span>
          </div>
        ))}
        <div style={{ display: 'flex', paddingTop: space[2], fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textHeading }}>
          <span style={{ flex: 1 }}>Total</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>
    );
  },
};

// ─── Demo 8: Signature ───────────────────────────────────────────────────────

type SignatureState = { method: 'none' | 'upload' | 'draw' | 'saved'; progress: number };
const signatureDemo: DemoDef<SignatureState> = {
  id: 'signature',
  title: 'Signature Options',
  description: 'Add your signature by uploading, drawing, or reusing a saved signature.',
  initialState: { method: 'none', progress: 0 },
  steps: [
    { label: 'Pick "Draw" method', delay: 600, apply: (s) => ({ ...s, method: 'draw' as const }) },
    { label: 'Draw stroke', delay: 700, apply: (s) => ({ ...s, progress: 0.33 }) },
    { label: 'Continue drawing', delay: 700, apply: (s) => ({ ...s, progress: 0.66 }) },
    { label: 'Finish signature', delay: 700, apply: (s) => ({ ...s, progress: 1 }) },
    { label: 'Signature saved', delay: 700, apply: (s) => s },
  ],
  stage: (state) => (
    <div style={STAGE_PAPER}>
      <div style={{ display: 'flex', gap: space[2], marginBottom: space[3] }}>
        {(['upload', 'draw', 'saved'] as const).map((m) => (
          <div key={m} style={{
            flex: 1,
            padding: `${space[2]} ${space[3]}`,
            borderRadius: radius.sm,
            border: `1.5px solid ${state.method === m ? color.primary : color.neutral200}`,
            backgroundColor: state.method === m ? '#E0F2FE' : color.white,
            fontSize: font.size['2xs'],
            fontWeight: font.weight.medium,
            color: state.method === m ? color.primary : color.textSubtle,
            textAlign: 'center',
            textTransform: 'capitalize',
            transition: `all ${transition.base}`,
          }}>{m}</div>
        ))}
      </div>
      <div style={{
        height: 90,
        borderRadius: radius.sm,
        border: `1.5px dashed ${color.neutral200}`,
        backgroundColor: color.neutral50,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <svg viewBox="0 0 300 90" style={{ width: '100%', height: '100%' }}>
          <path
            d="M 30 55 Q 50 20, 70 55 T 110 55 Q 130 25, 150 55 T 190 55 Q 210 25, 230 55 T 270 55"
            fill="none"
            stroke={color.textHeading}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="500"
            strokeDashoffset={500 - 500 * state.progress}
            style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          />
        </svg>
      </div>
    </div>
  ),
};

// ─── Demo 9: Editable Chips ──────────────────────────────────────────────────

type ChipsState = { doctor: string; clinic: string; patient: string; focused: 'doctor' | 'clinic' | 'patient' | null };
const chipsDemo: DemoDef<ChipsState> = {
  id: 'chips',
  title: 'Editable Header',
  description: 'Edit doctor, clinic and patient names right from the header with a pen-icon on hover.',
  initialState: { doctor: 'Dr. Smith', clinic: 'Bright Smile Clinic', patient: 'John Doe', focused: null },
  steps: [
    { label: 'Focus clinic chip', delay: 600, apply: (s) => ({ ...s, focused: 'clinic' as const }) },
    { label: 'Rename clinic', delay: 700, apply: (s) => ({ ...s, clinic: 'Coastal Dental Group' }) },
    { label: 'Focus patient chip', delay: 700, apply: (s) => ({ ...s, focused: 'patient' as const }) },
    { label: 'Rename patient', delay: 700, apply: (s) => ({ ...s, patient: 'Sarah Chen' }) },
    { label: 'All fields saved', delay: 600, apply: (s) => ({ ...s, focused: null }) },
  ],
  stage: (state) => {
    const chip = (label: string, value: string, key: ChipsState['focused']) => {
      const isFocused = state.focused === key;
      return (
        <div key={label} style={{
          display: 'flex', alignItems: 'center', gap: space[1],
          padding: `${space[1]} ${space[3]}`,
          backgroundColor: color.neutral50,
          borderRadius: radius.md,
          border: `1px solid ${isFocused ? color.primary : 'transparent'}`,
          fontSize: font.size.xs,
        }}>
          <span style={{ color: color.textPlaceholder, fontWeight: font.weight.medium }}>{label}</span>
          <span style={{ color: color.textDefault, fontWeight: font.weight.medium }}>{value}</span>
          {isFocused && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          )}
        </div>
      );
    };
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: space[2], justifyContent: 'center' }}>
        {chip('Doctor', state.doctor, 'doctor')}
        {chip('Clinic', state.clinic, 'clinic')}
        {chip('Patient', state.patient, 'patient')}
      </div>
    );
  },
};

// ─── Demo 10: Share & Export ─────────────────────────────────────────────────

type ShareState = { stage: 'closed' | 'open' | 'method' | 'copied'; method: string };
const SHARE_METHODS = ['Link', 'Email', 'WhatsApp', 'SMS'];
const shareDemo: DemoDef<ShareState> = {
  id: 'share',
  title: 'Share & Export',
  description: 'Share via link, email, WhatsApp, WeChat, or SMS. Or export a clean PDF.',
  initialState: { stage: 'closed', method: '' },
  steps: [
    { label: 'Open Share modal', delay: 600, apply: (s) => ({ ...s, stage: 'open' as const }) },
    { label: 'Pick Email', delay: 700, apply: (s) => ({ ...s, stage: 'method' as const, method: 'Email' }) },
    { label: 'Switch to Link', delay: 700, apply: (s) => ({ ...s, method: 'Link' }) },
    { label: 'Copy link', delay: 700, apply: (s) => ({ ...s, stage: 'copied' as const }) },
    { label: 'Link copied', delay: 700, apply: (s) => s },
  ],
  stage: (state) => (
    <div style={STAGE_PAPER}>
      <div style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textHeading, marginBottom: space[3] }}>Share this report</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: space[2] }}>
        {SHARE_METHODS.map((m) => (
          <div key={m} style={{
            padding: space[2],
            borderRadius: radius.sm,
            border: `1.5px solid ${state.method === m ? color.primary : color.neutral200}`,
            backgroundColor: state.method === m ? '#E0F2FE' : color.white,
            textAlign: 'center',
            fontSize: font.size['2xs'],
            fontWeight: font.weight.medium,
            color: state.method === m ? color.primary : color.textSubtle,
            transition: `all ${transition.base}`,
          }}>{m}</div>
        ))}
      </div>
      {state.stage === 'copied' && (
        <div style={{
          marginTop: space[3],
          padding: `${space[2]} ${space[3]}`,
          backgroundColor: '#DCFCE7',
          border: `1px solid #86EFAC`,
          borderRadius: radius.sm,
          fontSize: font.size['2xs'],
          color: '#166534',
          fontWeight: font.weight.medium,
        }}>
          ✓ Link copied to clipboard
        </div>
      )}
    </div>
  ),
};

// ─── Demo 11: PIN Protection ─────────────────────────────────────────────────

type PinState = { enabled: boolean; digits: string[] };
const pinDemo: DemoDef<PinState> = {
  id: 'pin',
  title: 'PIN Protection',
  description: 'Add an optional 4-digit PIN so only the patient can open the shared report.',
  initialState: { enabled: false, digits: ['', '', '', ''] },
  steps: [
    { label: 'Enable PIN protection', delay: 600, apply: (s) => ({ ...s, enabled: true }) },
    { label: 'Type 4', delay: 500, apply: (s) => ({ ...s, digits: ['4', '', '', ''] }) },
    { label: 'Type 2', delay: 500, apply: (s) => ({ ...s, digits: ['4', '2', '', ''] }) },
    { label: 'Type 8', delay: 500, apply: (s) => ({ ...s, digits: ['4', '2', '8', ''] }) },
    { label: 'Type 1', delay: 500, apply: (s) => ({ ...s, digits: ['4', '2', '8', '1'] }) },
    { label: 'Report is PIN-protected', delay: 700, apply: (s) => s },
  ],
  stage: (state) => (
    <div style={STAGE_PAPER}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: space[4] }}>
        <div>
          <div style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textHeading }}>Require PIN</div>
          <div style={{ fontSize: font.size['2xs'], color: color.textSubtle, marginTop: 2 }}>Only users with the code can open</div>
        </div>
        <Toggle checked={state.enabled} onChange={() => {}} />
      </div>
      <div style={{ display: 'flex', gap: space[2], justifyContent: 'center' }}>
        {state.digits.map((d, i) => (
          <div key={i} style={{
            width: 40,
            height: 48,
            borderRadius: radius.sm,
            border: `1.5px solid ${state.enabled ? (d ? color.primary : color.neutral300) : color.neutral200}`,
            backgroundColor: state.enabled ? color.white : color.neutral100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: font.size.lg,
            fontWeight: font.weight.semibold,
            color: color.textHeading,
            transition: `all ${transition.base}`,
          }}>{state.enabled && d ? '•' : ''}</div>
        ))}
      </div>
    </div>
  ),
};

// ─── Page ────────────────────────────────────────────────────────────────────

// Use any[] because each demo's state type differs
const ALL_DEMOS: DemoDef<any>[] = [
  templateDemo,
  galleryDemo,
  annotateDemo,
  toothDemo,
  sectionsDemo,
  compareDemo,
  costDemo,
  signatureDemo,
  chipsDemo,
  shareDemo,
  pinDemo,
];

/** Inline grid of all feature-tour demo cards. No fixed overlay. */
export function FeatureTourGrid() {
  return (
    <div style={{ padding: space[6], fontFamily: font.family }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: space[5],
        maxWidth: 1400,
        margin: '0 auto',
      }}>
        {ALL_DEMOS.map((d) => (
          <DemoCard key={d.id} demo={d} />
        ))}
      </div>
    </div>
  );
}

/** Full-screen overlay version used from the Patient Report header "View Demo" button. */
export default function PatientReportDemoPage({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: color.bgPage,
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: font.family,
    }}>
      {/* Header */}
      <div style={{
        height: 64,
        padding: `0 ${space[6]}`,
        borderBottom: `1px solid ${color.borderDefault}`,
        backgroundColor: color.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: font.size.lg, fontWeight: font.weight.semibold, color: color.textHeading }}>
            Patient Report — Feature Tour
          </div>
          <div style={{ fontSize: font.size.xs, color: color.textSubtle, marginTop: 2 }}>
            Each card plays a short scripted demo of one feature. Use Play / Pause / Restart.
          </div>
        </div>
        <SecondaryButton size={36} onClick={onClose}>Close</SecondaryButton>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <FeatureTourGrid />
      </div>
    </div>
  );
}
