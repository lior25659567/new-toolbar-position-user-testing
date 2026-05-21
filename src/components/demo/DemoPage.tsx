import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { color, font, space, radius, shadow, transition } from '../../design-system/tokens';
import { IconButton } from '../../design-system/IconButton';
import PatientReportPage from '../PatientReportPage';
import type { PatientReportPageHandle } from '../PatientReportPage';


import upperArchColor from '../../assets/button-images/review-tool/Color.png';

import prepModel1 from '../../assets/button-images/prep-qc/prep-model-1.png';
import prepModel2 from '../../assets/button-images/prep-qc/prep-model-2.png';

import type { ImageBlock, ComparisonBlock, CostSummaryBlock, NotesBlock, RxBlock, NextAppointmentBlock, PatientInstructionsBlock, PatientInfo, ReportSettings } from '../report/types';

type DemoBlock = ImageBlock | ComparisonBlock | CostSummaryBlock | NotesBlock | RxBlock | NextAppointmentBlock | PatientInstructionsBlock;

// ─── Animated Full Report Demo ──────────────────────────────────────────────

type DemoStep = {
  label: string;
  delay: number;
  cursor: { x: number; y: number };
  action: (ref: PatientReportPageHandle, prevBlocks: DemoBlock[]) => DemoBlock[];
  // Scroll both panels after action: 'top' | 'bottom' | number (fraction 0-1)
  editorScroll?: 'top' | 'bottom' | number;
  previewScroll?: 'top' | 'bottom' | number;
  tab?: 'blocks' | 'settings';
};

function buildDemoSteps(): { steps: DemoStep[]; initialSettings: ReportSettings; initialPatient: PatientInfo } {
  let _id = 0;
  const uid = () => `demo-${++_id}`;

  const initialSettings: ReportSettings = {
    reportName: 'Patient Report', doctorName: '', doctorImageUrl: '',
    clinicName: '', clinicLogoUrl: '', pinEnabled: false, pin: '',
    signatureUrl: '', signatureMethod: '',
  };
  const initialPatient: PatientInfo = { patientName: '', birthDate: '', chartNumber: '' };

  // Helper: update block by id
  const updateBlock = (blocks: DemoBlock[], id: string, updates: Partial<DemoBlock>): DemoBlock[] =>
    blocks.map((b) => b.id === id ? { ...b, ...updates } as DemoBlock : b);

  // Helper: find block by type and index (for template-generated blocks with dynamic IDs)
  const findBlockId = (blocks: DemoBlock[], type: string, nth = 0): string => {
    const matches = blocks.filter((b) => b.type === type);
    return matches[nth]?.id || '';
  };

  let s = { ...initialSettings };

  const steps: DemoStep[] = [
    // ═══ PHASE 1: HEADER SETUP ═══
    { label: 'Typing report name...', delay: 800,
      cursor: { x: 25, y: 5 },
      action: (ref, b) => { s = { ...s, reportName: 'Crown Preparation Report' }; ref.setSettings(s); return b; } },

    { label: 'Setting doctor name...', delay: 700,
      cursor: { x: 40, y: 5 },
      action: (ref, b) => { s = { ...s, doctorName: 'Dr. Sarah Mitchell, DDS' }; ref.setSettings(s); return b; } },

    { label: 'Setting clinic name...', delay: 700,
      cursor: { x: 55, y: 5 },
      action: (ref, b) => { s = { ...s, clinicName: 'Bright Smile Dental' }; ref.setSettings(s); return b; } },

    { label: 'Setting patient name...', delay: 700,
      cursor: { x: 68, y: 5 },
      action: (ref, b) => { ref.setPatient({ patientName: 'James Anderson', birthDate: '08/22/1979', chartNumber: '10042-A' }); return b; } },

    // ═══ PHASE 2: TEMPLATE SELECTION ═══
    { label: 'Opening templates...', delay: 800,
      cursor: { x: 15, y: 18 }, editorScroll: 'top',
      action: (_, b) => b },

    { label: 'Selecting Crown Preparation template...', delay: 900,
      cursor: { x: 12, y: 35 },
      action: (ref, b) => {
        ref.selectTemplate('crown');
        // After template applies, read the blocks back (they are set internally)
        return [];
      }, editorScroll: 'top' },

    { label: 'Template applied — 5 sections ready', delay: 1000,
      cursor: { x: 15, y: 20 }, editorScroll: 'top',
      action: (ref, b) => {
        // Sync our local blocks ref with what the template created
        // We'll read from the page by reconstructing expected blocks
        return b;
      } },

    // ═══ PHASE 3: FIRST IMAGE — Gallery + Teeth ═══
    { label: 'Expanding image block...', delay: 800,
      cursor: { x: 15, y: 28 }, editorScroll: 'top',
      action: (ref, b) => {
        // Get current blocks from the page, expand the first image block
        const el = ref.getEditorEl();
        if (!el) return b;
        // Use setBlocks to expand the first image — we need to reconstruct
        // Since template sets blocks internally, we build them here to sync
        const imgId = 'demo-crown-img';
        const compId = 'demo-crown-comp';
        const instrId = 'demo-crown-instr';
        const blocks: DemoBlock[] = [
          { id: imgId, type: 'image', collapsed: false, file: null, previewUrl: '', title: '', notes: '', teeth: [], diagnosis: 'Fractured cusp', treatment: 'Full crown restoration', estimatedCost: '', treatmentDate: '', annotations: [], showClinicalFields: true },
          { id: compId, type: 'comparison', collapsed: true, labelA: 'Before prep', labelB: 'After prep', imageA: { file: null, previewUrl: '' }, imageB: { file: null, previewUrl: '' }, notes: '' },
          { id: instrId, type: 'patient-instructions', collapsed: true, title: 'Temporary Crown Care', items: [{ id: uid(), text: '' }] },
        ];
        ref.setBlocks(blocks);
        return blocks;
      } },

    { label: 'Loading upper arch scan from gallery...', delay: 900,
      cursor: { x: 18, y: 40 }, editorScroll: 'top',
      action: (ref, b) => {
        const id = findBlockId(b, 'image');
        const nb = updateBlock(b, id, { previewUrl: upperArchColor });
        ref.setBlocks(nb); return nb;
      }, previewScroll: 'top' },

    { label: 'Typing image title...', delay: 700,
      cursor: { x: 18, y: 55 }, editorScroll: 0.3,
      action: (ref, b) => {
        const id = findBlockId(b, 'image');
        const nb = updateBlock(b, id, { title: 'Upper arch — full color scan' });
        ref.setBlocks(nb); return nb;
      } },

    { label: 'Selecting tooth 14...', delay: 600,
      cursor: { x: 12, y: 38 }, editorScroll: 0.2,
      action: (ref, b) => {
        const id = findBlockId(b, 'image');
        const nb = updateBlock(b, id, { teeth: [14] });
        ref.setBlocks(nb); return nb;
      } },

    { label: 'Selecting tooth 15...', delay: 500,
      cursor: { x: 14, y: 38 },
      action: (ref, b) => {
        const id = findBlockId(b, 'image');
        const nb = updateBlock(b, id, { teeth: [14, 15] });
        ref.setBlocks(nb); return nb;
      } },

    { label: 'Selecting tooth 16...', delay: 500,
      cursor: { x: 16, y: 38 },
      action: (ref, b) => {
        const id = findBlockId(b, 'image');
        const nb = updateBlock(b, id, { teeth: [14, 15, 16] });
        ref.setBlocks(nb); return nb;
      } },

    { label: 'Selecting tooth 17...', delay: 500,
      cursor: { x: 18, y: 38 },
      action: (ref, b) => {
        const id = findBlockId(b, 'image');
        const nb = updateBlock(b, id, { teeth: [14, 15, 16, 17] });
        ref.setBlocks(nb); return nb;
      }, previewScroll: 'bottom' },

    { label: 'Writing clinical notes...', delay: 800,
      cursor: { x: 18, y: 60 }, editorScroll: 0.35,
      action: (ref, b) => {
        const id = findBlockId(b, 'image');
        const nb = updateBlock(b, id, { notes: 'Fractured cusp on tooth #14. Crown preparation completed.' });
        ref.setBlocks(nb); return nb;
      }, previewScroll: 'bottom' },

    // ═══ PHASE 4: ANNOTATION ═══
    { label: 'Opening annotation lightbox...', delay: 900,
      cursor: { x: 22, y: 35 }, editorScroll: 0.1,
      action: (_, b) => b },

    { label: 'Drawing on area of concern with pen tool...', delay: 1200,
      cursor: { x: 50, y: 45 },
      action: (_, b) => b },

    { label: 'Saving annotation...', delay: 800,
      cursor: { x: 70, y: 88 },
      action: (_, b) => b },

    // ═══ PHASE 5: BEFORE/AFTER ═══
    { label: 'Expanding Before / After comparison...', delay: 800,
      cursor: { x: 15, y: 50 }, editorScroll: 0.5,
      action: (ref, b) => {
        const id = findBlockId(b, 'comparison');
        const nb = updateBlock(b, id, { collapsed: false });
        ref.setBlocks(nb); return nb;
      } },

    { label: 'Loading "Before" prep image...', delay: 800,
      cursor: { x: 12, y: 60 }, editorScroll: 0.55,
      action: (ref, b) => {
        const id = findBlockId(b, 'comparison');
        const nb = updateBlock(b, id, { imageA: { file: null, previewUrl: prepModel1 }, labelA: 'Before prep' });
        ref.setBlocks(nb); return nb;
      }, previewScroll: 'bottom' },

    { label: 'Loading "After" prep image...', delay: 800,
      cursor: { x: 25, y: 60 },
      action: (ref, b) => {
        const id = findBlockId(b, 'comparison');
        const nb = updateBlock(b, id, { imageB: { file: null, previewUrl: prepModel2 }, labelB: 'After prep' });
        ref.setBlocks(nb); return nb;
      }, previewScroll: 'bottom' },

    { label: 'Writing comparison notes...', delay: 800,
      cursor: { x: 18, y: 70 }, editorScroll: 0.65,
      action: (ref, b) => {
        const id = findBlockId(b, 'comparison');
        const nb = updateBlock(b, id, { notes: 'Crown prep on tooth #14. Good margin definition with adequate reduction.' });
        ref.setBlocks(nb); return nb;
      }, previewScroll: 'bottom' },

    // ═══ PHASE 6: PATIENT INSTRUCTIONS ═══
    { label: 'Expanding Patient Instructions...', delay: 800,
      cursor: { x: 15, y: 72 }, editorScroll: 0.7,
      action: (ref, b) => {
        const id = findBlockId(b, 'patient-instructions');
        const nb = updateBlock(b, id, { collapsed: false });
        ref.setBlocks(nb); return nb;
      } },

    { label: 'Filling in post-treatment care steps...', delay: 1000,
      cursor: { x: 18, y: 78 }, editorScroll: 0.75,
      action: (ref, b) => {
        const id = findBlockId(b, 'patient-instructions');
        const nb = updateBlock(b, id, {
          title: 'Temporary Crown Care',
          items: [
            { id: uid(), text: 'Avoid hard or sticky foods on the temporary crown' },
            { id: uid(), text: 'Brush gently around the crown area' },
            { id: uid(), text: 'Do not pull floss upward — slide it out sideways' },
            { id: uid(), text: 'Contact us immediately if the crown loosens or falls off' },
          ],
        });
        ref.setBlocks(nb); return nb;
      }, previewScroll: 'bottom' },

    // ═══ PHASE 7: SIGNATURE & PIN ═══
    { label: 'Drawing signature...', delay: 1000,
      cursor: { x: 22, y: 72 },
      action: (ref, b) => {
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80"><path d="M20 55 Q40 20 60 50 Q80 80 100 40 Q120 10 140 45 Q155 65 170 35 Q185 15 200 50 Q215 70 235 30 Q250 10 270 45" fill="none" stroke="var(--ads-text-primary)" stroke-width="2.5" stroke-linecap="round"/></svg>';
        const sigUrl = 'data:image/svg+xml,' + encodeURIComponent(svg);
        s = { ...s, signatureUrl: sigUrl, signatureMethod: 'draw' };
        ref.setSettings(s);
        return b;
      }, previewScroll: 'bottom' },

    { label: 'Enabling PIN protection...', delay: 700,
      cursor: { x: 12, y: 83 },
      action: (ref, b) => { s = { ...s, pinEnabled: true }; ref.setSettings(s); return b; } },

    { label: 'Entering PIN: 4-2-8-1...', delay: 800,
      cursor: { x: 18, y: 88 },
      action: (ref, b) => { s = { ...s, pin: '4281' }; ref.setSettings(s); return b; },
      previewScroll: 'bottom' },

    // ═══ DONE ═══
    { label: 'Report complete! You can now edit freely.', delay: 600,
      cursor: { x: 50, y: 50 },
      action: (_, b) => b },
  ];

  return { steps, initialSettings, initialPatient };
}

function FullReportDemo({ onBack }: { onBack: () => void }) {
  const { steps, initialSettings, initialPatient } = useMemo(() => buildDemoSteps(), []);
  const pageRef = useRef<PatientReportPageHandle>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<DemoBlock[]>([]);

  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (timeoutRef.current !== null) { window.clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  // Step execution
  useEffect(() => {
    if (!playing) { cleanup(); return; }
    if (stepIndex >= steps.length - 1) { setPlaying(false); setCursorVisible(false); return; }

    const nextIdx = stepIndex + 1;
    const step = steps[nextIdx];

    // First: move cursor (takes 0.5s via CSS transition)
    setCursor(step.cursor);
    setCursorVisible(true);

    // Then: execute action after cursor arrives + small pause
    timeoutRef.current = window.setTimeout(() => {
      const ref = pageRef.current;
      if (ref) {
        if (step.tab) ref.setActiveTab(step.tab);
        blocksRef.current = step.action(ref, blocksRef.current);

        // Scroll both panels after a beat
        setTimeout(() => {
          if (!ref) return;
          const editorEl = ref.getEditorEl();
          if (step.editorScroll === 'bottom') ref.scrollEditorToBottom();
          else if (step.editorScroll === 'top' && editorEl) editorEl.scrollTo({ top: 0, behavior: 'smooth' });
          else if (typeof step.editorScroll === 'number' && editorEl) editorEl.scrollTo({ top: editorEl.scrollHeight * step.editorScroll, behavior: 'smooth' });

          if (step.previewScroll === 'bottom') ref.scrollPreviewToBottom();
          else if (step.previewScroll === 'top') { /* already at top by default */ }
        }, 200);
      }
      setStepIndex(nextIdx);
    }, step.delay);

    return cleanup;
  }, [playing, stepIndex, steps, cleanup]);

  const play = () => {
    if (stepIndex >= steps.length - 1) {
      // Reset: re-mount by clearing blocks
      blocksRef.current = [];
      if (pageRef.current) {
        pageRef.current.setSettings(initialSettings);
        pageRef.current.setPatient(initialPatient);
        pageRef.current.setBlocks([]);
        pageRef.current.setActiveTab('blocks');
      }
      setStepIndex(-1);
    }
    setPlaying(true);
    setCursorVisible(true);
  };
  const pause = () => setPlaying(false);
  const restart = () => {
    cleanup();
    setPlaying(false);
    blocksRef.current = [];
    if (pageRef.current) {
      pageRef.current.setSettings(initialSettings);
      pageRef.current.setPatient(initialPatient);
      pageRef.current.setBlocks([]);
      pageRef.current.setActiveTab('blocks');
    }
    setStepIndex(-1);
    setCursorVisible(false);
    window.setTimeout(() => { setPlaying(true); setCursorVisible(true); }, 100);
  };

  const progress = steps.length === 0 ? 0 : Math.max(0, (stepIndex + 1) / steps.length);
  const currentLabel = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex].label : 'Press play to watch the report being built';

  return (
    <div ref={wrapperRef} style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Animated cursor overlay — standard black pointer */}
      <div style={{
        position: 'absolute',
        left: `${cursor.x}%`, top: `${cursor.y}%`,
        width: 20, height: 24, pointerEvents: 'none',
        transition: 'left 0.5s cubic-bezier(.4,0,.2,1), top 0.5s cubic-bezier(.4,0,.2,1), opacity 0.3s',
        opacity: cursorVisible ? 1 : 0,
        transform: 'translate(-1px, -1px)',
        zIndex: 9999,
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
      }}>
        <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
          <path d="M1 1L1 16L5.5 12L9 20L12 19L8.5 11L14 11L1 1Z" fill="#222" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Transport bar */}
      <div style={{
        padding: `${space[2]} ${space[6]}`, borderBottom: `1px solid ${color.borderDefault}`,
        backgroundColor: color.white, display: 'flex', alignItems: 'center', gap: space[3], flexShrink: 0, zIndex: 20,
      }}>
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
              <path d="M2 7a5 5 0 1 0 1.5-3.5" /><path d="M2 2v3h3" />
            </svg>
          </IconButton>
        </div>
        <div style={{ flex: 1, height: 4, backgroundColor: color.neutral150, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: color.primary, transition: 'width 0.3s ease' }} />
        </div>
        <span style={{ fontSize: font.size['2xs'], color: color.textSubtle, fontVariantNumeric: 'tabular-nums', minWidth: 40, textAlign: 'right' }}>
          {Math.max(0, stepIndex + 1)}/{steps.length}
        </span>
        <span style={{ fontSize: font.size.xs, color: color.textSubtle, fontWeight: font.weight.medium }}>{currentLabel}</span>
      </div>

      {/* The REAL PatientReportPage — single instance, driven via ref */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PatientReportPage
          ref={pageRef}
          onBackToHome={onBack}
          initialData={{ settings: initialSettings, patient: initialPatient, blocks: [] }}
        />
      </div>
    </div>
  );
}

// ─── Demo catalog ────────────────────────────────────────────────────────────

type DemoId = 'patient-report';

type DemoMeta = {
  id: DemoId;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
};

const DEMOS: DemoMeta[] = [
  {
    id: 'patient-report',
    title: 'Patient Report',
    description:
      'Templates, media gallery, annotation, tooth chart, multi-section builder, signatures, sharing and PIN protection. Switch between a scripted feature tour and the full interactive report.',
    badge: '11 features',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    ),
  },
];

// ─── Hub card ────────────────────────────────────────────────────────────────

function DemoHubCard({ demo, onOpen }: { demo: DemoMeta; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: 'left',
        padding: space[5],
        backgroundColor: color.white,
        border: `1px solid ${hovered ? color.primary : color.borderDefault}`,
        borderRadius: radius.lg,
        boxShadow: hovered ? shadow.md : shadow.sm,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: `all ${transition.base}`,
        cursor: 'pointer',
        fontFamily: font.family,
        display: 'flex',
        flexDirection: 'column',
        gap: space[3],
        minHeight: 180,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: radius.md,
          backgroundColor: hovered ? color.primary : color.neutral100,
          color: hovered ? color.textOnPrimary : color.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: `all ${transition.base}`,
        }}>
          {demo.icon}
        </div>
        {demo.badge && (
          <span style={{
            fontSize: font.size['2xs'],
            fontWeight: font.weight.medium,
            color: color.primary,
            backgroundColor: 'var(--ads-background-highlight-blue)',
            padding: `${space[1]} ${space[2]}`,
            borderRadius: radius.full,
          }}>
            {demo.badge}
          </span>
        )}
      </div>
      <div style={{ fontSize: font.size.lg, fontWeight: font.weight.semibold, color: color.textHeading }}>
        {demo.title}
      </div>
      <div style={{ fontSize: font.size.xs, color: color.textSubtle, lineHeight: '1.5', flex: 1 }}>
        {demo.description}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: space[1],
        fontSize: font.size.xs,
        fontWeight: font.weight.medium,
        color: color.primary,
      }}>
        Open demo
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 2l4 4-4 4" />
        </svg>
      </div>
    </button>
  );
}

// ─── Patient Report demo (single walkthrough) ──────────────────────────────

function PatientReportDemo({ onBackToHub }: { onBackToHub: () => void }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: color.bgPage,
      fontFamily: font.family,
    }}>
      <FullReportDemo onBack={onBackToHub} />
    </div>
  );
}

// ─── Hub ─────────────────────────────────────────────────────────────────────

export default function DemoPage({ onBackToHome }: { onBackToHome: () => void }) {
  const [activeDemo, setActiveDemo] = useState<DemoId | null>(null);

  if (activeDemo === 'patient-report') {
    return <PatientReportDemo onBackToHub={() => setActiveDemo(null)} />;
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: color.bgPage,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: space[4] }}>
          <button
            type="button"
            onClick={onBackToHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              border: 'none',
              borderRadius: radius.sm,
              backgroundColor: 'transparent',
              color: color.textSubtle,
              cursor: 'pointer',
              transition: `background-color ${transition.fast}`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color.bgHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>
          <div>
            <div style={{ fontSize: font.size.lg, fontWeight: font.weight.semibold, color: color.textHeading }}>
              Demo
            </div>
            <div style={{ fontSize: font.size.xs, color: color.textSubtle, marginTop: 2 }}>
              Interactive demos showcasing key features. Pick a demo to start.
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: space[8] }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: space[5],
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {DEMOS.map((demo) => (
            <DemoHubCard key={demo.id} demo={demo} onOpen={() => setActiveDemo(demo.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
