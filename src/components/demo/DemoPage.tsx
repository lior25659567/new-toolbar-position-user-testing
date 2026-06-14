import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { color, font, space, radius, shadow, transition } from '../../design-system/tokens';
import { IconButton } from '../../design-system/IconButton';
import PatientReportPage from '../PatientReportPage';
import type { PatientReportPageHandle } from '../PatientReportPage';
import ReportDemoOverlay from '../report/ReportDemoOverlay';
import AnnotationDemoOverlay from '../report/AnnotationDemoOverlay';


import upperArchColor from '../../assets/button-images/review-tool/Color.png';

import prepModel1 from '../../assets/button-images/prep-qc/prep-model-1.png';
import prepModel2 from '../../assets/button-images/prep-qc/prep-model-2.png';

import type { ImageBlock, ComparisonBlock, CostSummaryBlock, NotesBlock, RxBlock, NextAppointmentBlock, PatientInstructionsBlock, PatientInfo, ReportSettings } from '../report/types';

import { useInfoState } from '../../info/state/useInfoState';
import { InfoStickyLayout } from '../../info/components/InfoPage';
import ScreenTemplate from '../../imports/ScreenTemplate';
import type { ScanTab } from '../ScanTabs';
import { ToolbarDensityContext } from '../ToolbarDensityContext';

type DemoBlock = ImageBlock | ComparisonBlock | CostSummaryBlock | NotesBlock | RxBlock | NextAppointmentBlock | PatientInstructionsBlock;

// ─── Playback speed control (shared by every demo) ──────────────────────────
//
// Demos pace themselves by multiplying their authored waits by a base constant.
// `useDemoSpeed` exposes a live rate (1× = the authored pace) via a ref so the
// running script picks up changes on its next wait, and `SpeedControl` is the
// YouTube-style rate selector rendered in each transport bar.

const SPEED_OPTIONS = [0.5, 1, 1.5, 2];

function useDemoSpeed(initial = 1) {
  const [speed, setSpeedState] = useState(initial);
  const speedRef = useRef(initial);
  const setSpeed = useCallback((s: number) => { speedRef.current = s; setSpeedState(s); }, []);
  return { speed, setSpeed, speedRef };
}

function SpeedControl({ speed, onChange }: { speed: number; onChange: (s: number) => void }) {
  return (
    <div role="group" aria-label="Playback speed" style={{
      display: 'flex', alignItems: 'center', gap: 2, padding: 2,
      backgroundColor: color.neutral100, borderRadius: radius.full, flexShrink: 0,
    }}>
      {SPEED_OPTIONS.map((s) => {
        const active = s === speed;
        return (
          <button
            key={s}
            type="button"
            aria-label={`${s}× speed`}
            aria-pressed={active}
            onClick={() => onChange(s)}
            style={{
              border: 'none', cursor: 'pointer', fontFamily: font.family,
              fontSize: font.size['2xs'], fontWeight: font.weight.medium, fontVariantNumeric: 'tabular-nums',
              padding: `${space[1]} ${space[2]}`, borderRadius: radius.full, lineHeight: 1,
              backgroundColor: active ? color.white : 'transparent',
              color: active ? color.primary : color.textSubtle,
              boxShadow: active ? shadow.sm : 'none', transition: `all ${transition.fast}`,
            }}
          >
            {s}×
          </button>
        );
      })}
    </div>
  );
}

// ─── In-app screen recorder (shared by every demo) ──────────────────────────
//
// Captures the current tab via getDisplayMedia + MediaRecorder and downloads a
// .webm. There's a one-time "share this tab" confirm (browsers don't allow
// silent capture). For a polished .mp4 use `npm run record:demo` instead.

function useDemoRecorder() {
  const [recording, setRecording] = useState(false);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const pollRef = useRef<number | null>(null);
  const teardownRef = useRef<(() => void) | null>(null);
  const supported =
    typeof window !== 'undefined' && !!navigator.mediaDevices?.getDisplayMedia && 'MediaRecorder' in window;

  const clearPoll = () => { if (pollRef.current != null) { window.clearInterval(pollRef.current); pollRef.current = null; } };

  const stop = useCallback(() => {
    clearPoll();
    const rec = recRef.current;
    if (rec && rec.state !== 'inactive') rec.stop();
  }, []);

  const start = useCallback(async (filename: string, onStart?: () => void) => {
    if (!supported || recording) return;
    let display: MediaStream;
    try {
      // preferCurrentTab nudges Chrome to pre-select this tab in the picker.
      display = await navigator.mediaDevices.getDisplayMedia(
        { video: { frameRate: 30 }, audio: false, preferCurrentTab: true } as MediaStreamConstraints,
      );
    } catch { return; } // user dismissed the picker

    // Pipe the tab capture through a <canvas> so we can crop off the demo's
    // control header — only the content below the transport bar is recorded.
    const video = document.createElement('video');
    video.muted = true;
    video.srcObject = display;
    try { await video.play(); } catch { /* autoplay guard */ }
    await new Promise<void>((res) => {
      if (video.videoWidth) return res();
      video.onloadedmetadata = () => res();
      window.setTimeout(res, 600);
    });

    const vW = video.videoWidth || window.innerWidth;
    const vH = video.videoHeight || window.innerHeight;
    const scaleY = vH / Math.max(1, window.innerHeight);
    // The transport bar is the Rec button's parent; crop everything above its bottom.
    const recBtn = document.querySelector('[aria-label="Record demo"], [aria-label="Stop recording"]');
    const bar = recBtn?.parentElement as HTMLElement | null;
    const cropTop = bar ? Math.max(0, Math.round(bar.getBoundingClientRect().bottom * scaleY)) : 0;

    const canvas = document.createElement('canvas');
    canvas.width = vW;
    canvas.height = Math.max(1, vH - cropTop);
    const ctx = canvas.getContext('2d');
    let raf = 0;
    const draw = () => {
      ctx?.drawImage(video, 0, cropTop, vW, vH - cropTop, 0, 0, canvas.width, canvas.height);
      raf = requestAnimationFrame(draw);
    };
    draw();
    teardownRef.current = () => {
      cancelAnimationFrame(raf);
      display.getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    };

    chunksRef.current = [];
    const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
      .find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';
    const rec = new MediaRecorder(canvas.captureStream(30), { mimeType: mime, videoBitsPerSecond: 8_000_000 });
    recRef.current = rec;
    rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
    rec.onstop = () => {
      clearPoll();
      teardownRef.current?.();
      teardownRef.current = null;
      setRecording(false);
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${filename}.webm`;
      document.body.appendChild(a); a.click(); a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    };
    // Stop cleanly if the user ends the share via the browser's own bar.
    display.getVideoTracks()[0]?.addEventListener('ended', stop);
    rec.start();
    setRecording(true);
    onStart?.(); // replay the demo from the top so the clip starts clean

    // Auto-stop once the demo signals completion (same cues the recorder script uses).
    const startedAt = Date.now();
    pollRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      if (elapsed > 6 * 60 * 1000) { stop(); return; } // 6-min hard cap
      if (elapsed < 3000) return; // ignore the pre-replay "Done" state
      const txt = document.body.innerText || '';
      const doneSpan = Array.from(document.querySelectorAll('span')).some((s) => (s.textContent || '').trim() === 'Done');
      const m = txt.match(/\b(\d+)\/(\d+)\b/);
      const countDone = !!m && m[2] !== '0' && m[1] === m[2];
      if (/Flow complete/i.test(txt) || doneSpan || countDone) { clearPoll(); window.setTimeout(stop, 1400); }
    }, 500);
  }, [supported, recording, stop]);

  const toggle = useCallback((filename: string, onStart?: () => void) => {
    if (recording) stop(); else void start(filename, onStart);
  }, [recording, start, stop]);

  return { recording, toggle, supported };
}

function RecordButton({ recording, supported, onClick }: { recording: boolean; supported: boolean; onClick: () => void }) {
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={recording ? 'Stop recording' : 'Record demo'}
      title={recording ? 'Stop & download .webm' : 'Record this demo to .webm'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: space[1], border: 'none', cursor: 'pointer',
        fontFamily: font.family, fontSize: font.size['2xs'], fontWeight: font.weight.medium, lineHeight: 1,
        padding: `${space[1]} ${space[2]}`, borderRadius: radius.full, flexShrink: 0,
        backgroundColor: recording ? 'var(--ads-background-highlight-blue)' : color.neutral100,
        color: recording ? color.primary : color.textSubtle, transition: `all ${transition.fast}`,
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: recording ? 2 : '50%', backgroundColor: '#e5484d', display: 'inline-block' }} />
      {recording ? 'Stop' : 'Rec'}
    </button>
  );
}

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
  const recName = 'patient-report';
  const { steps, initialSettings, initialPatient } = useMemo(() => buildDemoSteps(), []);
  const pageRef = useRef<PatientReportPageHandle>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<DemoBlock[]>([]);

  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const { speed, setSpeed, speedRef } = useDemoSpeed();
  const { recording, toggle: recToggle, supported: recSupported } = useDemoRecorder();

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
    }, step.delay / speedRef.current);

    return cleanup;
  }, [playing, stepIndex, steps, cleanup, speedRef]);

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
        <RecordButton recording={recording} supported={recSupported} onClick={() => recToggle(recName, restart)} />
        <SpeedControl speed={speed} onChange={setSpeed} />
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

// ─── Fixed Restorative Flow demo (Info page, Option 5, summary hidden) ───────
//
// Drives the REAL Option-5 components — exactly like the patient-report "r"
// demo (ReportDemoOverlay). A fake cursor moves to real elements (the search
// box, patient rows, procedure cards, teeth, assign chips, cards, toggles,
// notes) and dispatches real mouse/input events, so each component's own
// onClick / onChange handlers and state fire. Nothing is poked into the
// reducer directly except the initial RESET.

type XY = { x: number; y: number };
const INFO_ABORT = Symbol('info-demo-abort');

function InfoFlowDemo({ onBack }: { onBack: () => void }) {
  const recName = 'fixed-restorative';
  const { state, dispatch, canProceed, toothColorMap } = useInfoState();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { speed, setSpeed, speedRef } = useDemoSpeed();
  const { recording, toggle: recToggle, supported: recSupported } = useDemoRecorder();

  const [cursor, setCursor] = useState<XY>({ x: -200, y: -200 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [clickKey, setClickKey] = useState(0);
  const [label, setLabel] = useState('Starting…');
  const [playing, setPlaying] = useState(false);
  const [runId, setRunId] = useState(1); // bump to (re)start; auto-runs on mount

  useEffect(() => {
    if (runId === 0) return;
    let aborted = false;
    const timers = new Set<number>();
    setPlaying(true);

    const SPEED = 0.85;
    const sleep = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const id = window.setTimeout(() => { timers.delete(id); aborted ? reject(INFO_ABORT) : resolve(); }, ms * SPEED / speedRef.current);
        timers.add(id);
      });
    const ensure = () => { if (aborted) throw INFO_ABORT; };

    // ── DOM helpers ──
    const $ = (sel: string) => document.querySelector(sel) as HTMLElement | null;
    const $$ = (sel: string) => Array.from(document.querySelectorAll(sel)) as HTMLElement[];
    const byText = (sel: string, text: string) =>
      $$(sel).find((e) => (e.textContent || '').includes(text)) ?? null;
    const centerOf = (el: Element): XY => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const fire = (el: Element | null, type: string) => {
      if (el) el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
    };
    let lastHover: Element | null = null;
    const setHover = (el: Element | null) => {
      if (lastHover && lastHover !== el) {
        lastHover.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true, view: window, relatedTarget: el ?? document.body }));
      }
      if (el && el !== lastHover) fire(el, 'mouseover');
      if (el) fire(el, 'mousemove');
      lastHover = el;
    };
    const realClick = (el: Element | null) => {
      if (!el) return;
      fire(el, 'mousedown');
      fire(el, 'mouseup');
      const anyEl = el as unknown as { click?: () => void };
      if (typeof anyEl.click === 'function') anyEl.click();
      else fire(el, 'click');
    };
    const scrollTo = (el: Element | null) => el?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // ── Cursor motion ──
    const moveTo = async (xy: XY, dur = 420) => { ensure(); setCursorVisible(true); setCursor(xy); await sleep(dur); };
    const moveToEl = async (el: Element | null, dur?: number) => {
      if (!el) { await sleep(120); return; }
      await moveTo(centerOf(el), dur);
      setHover(el);
    };
    const clickPulse = async () => { setClickKey((k) => k + 1); setClicking(true); await sleep(170); setClicking(false); await sleep(60); };
    const clickEl = async (el: Element | null, settle = 400) => {
      if (!el) { await sleep(150); return; }
      await moveToEl(el);
      await clickPulse();
      realClick(el);
      await sleep(settle);
    };
    const pollFor = async (sel: string, tries = 40): Promise<HTMLElement | null> => {
      for (let k = 0; k < tries; k++) { ensure(); const el = $(sel); if (el) return el; await sleep(80); }
      return null;
    };
    const pollText = async (sel: string, text: string, tries = 40): Promise<HTMLElement | null> => {
      for (let k = 0; k < tries; k++) { ensure(); const el = byText(sel, text); if (el) return el; await sleep(80); }
      return null;
    };

    // Type into a REAL input via the native value setter so React's own
    // onChange fires (i.e. the component's live state updates).
    const nativeSet = (el: HTMLInputElement | HTMLTextAreaElement, value: string) => {
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      desc?.set?.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const typeInto = async (el: Element | null, text: string, perChar = 55) => {
      if (!el) return;
      const input = el as HTMLInputElement;
      input.focus?.();
      await sleep(180);
      nativeSet(input, '');
      await sleep(120);
      for (let i = 1; i <= text.length; i++) {
        ensure();
        nativeSet(input, text.slice(0, i));
        const ch = text[i - 1];
        await sleep((ch === ' ' || ch === '-' ? perChar + 30 : perChar) + ((i * 23) % 26));
      }
      await sleep(240);
    };

    // Open a real DropdownList trigger and click the option matching `text`.
    const pickDropdown = async (trigger: Element | null, optionText: string) => {
      if (!trigger) return;
      scrollTo(trigger); await sleep(200);
      await clickEl(trigger, 250);
      await clickEl(await pollText('li[role="option"]', optionText, 25), 420);
    };
    // Click a procedure card by name in the (collapsible) procedure picker,
    // re-expanding the grid via "Change" first when another one is selected.
    const showProcedure = async (name: string) => {
      if (!byText('button', name)) await clickEl(byText('button', 'Change'), 450);
      await clickEl(await pollText('button', name, 25), 650);
    };
    // Type + send a single note into the real notes input.
    const addNote = async (text: string) => {
      const input = $('input[placeholder="Progress notes here"]');
      if (!input) return;
      scrollTo(input); await sleep(250);
      await moveToEl(input, 420); await clickPulse(); realClick(input);
      await typeInto(input, text, 24);
      await clickEl($('button[aria-label="Send note"]'), 500);
    };

    // ── Script — every step is a real interaction on a real component ──
    const run = async () => {
      dispatch({ type: 'RESET' }); // clean slate (analogous to report demo's resetReport)
      setCursorVisible(true);
      await moveTo({ x: window.innerWidth / 2, y: window.innerHeight * 0.4 }, 280);
      await sleep(400);

      // 1 · PATIENT — sort + search the list, pick someone, realise it's the
      //     wrong person, reopen the picker, then create the correct patient.
      setLabel('Sorting the patient list by date of birth');
      const search = await pollFor('input[placeholder="Search"]', 40);
      await pickDropdown($('button[aria-haspopup="listbox"]'), 'Date of birth');
      await sleep(500);
      setLabel('Searching: "Smith"…');
      await moveToEl(search, 520); await clickPulse(); realClick(search);
      await typeInto(search, 'Smith', 70);
      await sleep(600);
      setLabel('Picking John Smith from the list…');
      await clickEl(await pollText('button', 'John Smith', 30), 750);
      setLabel('Not the right patient — reopening the picker');
      await clickEl(await pollFor('button[aria-label="Edit patient"]', 30), 700);

      // 2 · CREATE the correct patient via the real form
      setLabel('Adding the correct patient…');
      await clickEl(await pollText('button', '+ New patient', 30), 500);
      const fn = await pollFor('[data-demo="patient-form"] input[placeholder="First name"]', 30);
      await moveToEl(fn, 460); await clickPulse(); realClick(fn);
      await typeInto(fn, 'Maya', 55);
      const ln = $('[data-demo="patient-form"] input[placeholder="Last name"]');
      await moveToEl(ln, 420); await clickPulse(); realClick(ln);
      await typeInto(ln, 'Okafor', 55);
      setLabel('Choosing gender…');
      const fem = $('[data-demo="patient-form"] input[type="radio"][value="female"]');
      if (fem) { await moveToEl(fem.closest('label') ?? fem, 420); await clickPulse(); realClick(fem); await sleep(300); }
      setLabel('Picking the date of birth…');
      const dob = $('[data-demo="new-patient-dob"] button');
      if (dob) {
        await clickEl(dob, 250);
        await pollFor('[aria-label="Previous month"]', 20);
        await clickEl(await pollFor('[data-demo="cal-day-12"]', 20), 400);
      }
      setLabel('Saving the new patient');
      await clickEl(await pollText('[data-demo="patient-form"] button', 'Save Patient', 25), 700);

      // 3 · PROCEDURES — actually click through a few, then settle on Fixed Restorative
      const procGrid = await pollText('button', 'Fixed Restorative', 40);
      scrollTo(procGrid); await sleep(500);
      setLabel('Opening Study Model…');
      await showProcedure('Study Model');
      setLabel('Trying Invisalign…');
      await showProcedure('Invisalign');
      setLabel('Choosing Fixed Restorative');
      await showProcedure('Fixed Restorative');

      // 4 · DUE / SEND — drive the real dropdown + date picker
      setLabel('Selecting the lab…');
      const sendTrigger = await pollFor('[data-demo="due-send"] button[aria-haspopup="listbox"]', 40);
      scrollTo(sendTrigger); await sleep(300);
      await pickDropdown(sendTrigger, 'Premier Dental Lab');
      setLabel('Setting the due date…');
      const dateBtn = $('[data-demo="due-send"] button:not([aria-haspopup="listbox"])');
      if (dateBtn) {
        await clickEl(dateBtn, 250);
        await pollFor('[aria-label="Next month"]', 25);
        await clickEl($('[aria-label="Next month"]'), 300);
        await clickEl(await pollFor('[data-demo="cal-day-20"]', 20), 450);
      }

      // 5 · TEETH — assign a group, FILL its fields, then move on to the next.
      // ── Crown on 14–16 ──
      setLabel('Selecting tooth 14…');
      const t14 = await pollFor('[data-demo="tooth-14"]', 40);
      scrollTo(t14); await sleep(400);
      await clickEl(t14, 300);
      setLabel('Multi-selecting teeth 15 and 16…');
      await clickEl($('[data-demo="tooth-15"]'), 260);
      await clickEl($('[data-demo="tooth-16"]'), 300);
      setLabel('Pressing Crown');
      await clickEl(await pollFor('[data-demo="assign-crown"]', 25), 550);
      const crownDrops = () => $$('[data-demo="spec-card-crown"] button[aria-haspopup="listbox"]');
      setLabel('Crown → specification: Full anatomic');
      await pickDropdown(crownDrops()[0], 'Full anatomic');
      setLabel('Crown → material: Zirconia');
      await pickDropdown(crownDrops()[1], 'Zirconia');
      setLabel('Crown → shade system: VITA Classical');
      await pickDropdown(crownDrops()[2], 'VITA Classical');
      setLabel('Crown → body: A2');
      await pickDropdown(crownDrops()[3], 'A2');
      setLabel('Crown → toggle additional information');
      await clickEl($('[data-demo="spec-card-crown"] [data-demo="add-additional-info"] label'), 550);
      setLabel('Crown → preparation design (buccal): Chamfer');
      await pickDropdown(crownDrops()[4], 'Chamfer');
      setLabel('Crown → margin design (buccal): Supragingival');
      await pickDropdown(crownDrops()[6], 'Supragingival');
      setLabel('Crown → incisal: Medium translucency');
      await pickDropdown(crownDrops()[8], 'Medium translucency');

      // ── Bridge on 24–26 ──
      setLabel('Now selecting teeth 24–26…');
      const t24 = await pollFor('[data-demo="tooth-24"]', 25);
      scrollTo(t24); await sleep(300);
      await clickEl(t24, 260);
      await clickEl($('[data-demo="tooth-25"]'), 260);
      await clickEl($('[data-demo="tooth-26"]'), 300);
      setLabel('Pressing Bridge');
      await clickEl(await pollFor('[data-demo="assign-bridge"]', 25), 550);
      const bridgeDrops = () => $$('[data-demo="spec-card-bridge"] button[aria-haspopup="listbox"]');
      setLabel('Bridge → specification: Coping');
      await pickDropdown(bridgeDrops()[0], 'Coping');
      setLabel('Bridge → material: PFM');
      await pickDropdown(bridgeDrops()[1], 'PFM');
      setLabel('Bridge → shade system: VITA Classical');
      await pickDropdown(bridgeDrops()[2], 'VITA Classical');
      setLabel('Bridge → body: A3');
      await pickDropdown(bridgeDrops()[3], 'A3');

      // ── Inlay on 36 (added, then removed below to show card removal) ──
      setLabel('Adding an Inlay on tooth 36…');
      const t36 = $('[data-demo="tooth-36"]');
      scrollTo(t36); await sleep(300);
      await clickEl(t36, 300);
      setLabel('Pressing Inlay');
      await clickEl(await pollFor('[data-demo="assign-inlay"]', 25), 550);

      // 6 · TABLE CONTEXT — view all teeth as a table, then back
      setLabel('Viewing all teeth as a table…');
      await clickEl($('button[title="Table view"]'), 900);
      setLabel('Back to the chart view');
      await clickEl($('button[title="Chart view"]'), 600);

      // 7 · REMOVE the Inlay card
      setLabel('Removing the Inlay card');
      await clickEl($('[data-demo="spec-card-inlay"] button[aria-label="Remove"]'), 700);

      // 9 · SCAN OPTIONS — three real toggles
      setLabel('Enabling scan options…');
      for (const t of ['NIRI Capture', 'Multi Bite', 'New Sleeve']) {
        const lab = byText('label', t);
        if (lab) { scrollTo(lab); await sleep(250); await moveToEl(lab, 420); await clickPulse(); realClick(lab.querySelector('input')); await sleep(350); }
      }

      // 10 · NOTES — add several, each typed + sent on the real input
      setLabel('Adding notes…');
      await addNote('Crowns #14–16: zirconia, shade A2, deep chamfer margin.');
      await addNote('Bridge #24–26: PFM, shade A3, pontic at #25.');

      setLabel('Flow complete — ready to scan.');
      await moveTo({ x: window.innerWidth / 2, y: window.innerHeight * 0.45 }, 500);
      await sleep(300);
      setCursorVisible(false);
    };

    run()
      .then(() => { if (!aborted) setPlaying(false); })
      .catch((e) => { if (e !== INFO_ABORT) console.error('[InfoDemo]', e); });

    return () => { aborted = true; timers.forEach((id) => window.clearTimeout(id)); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  const restart = () => { setCursorVisible(false); setRunId((n) => n + 1); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Transport bar */}
      <div style={{
        padding: `${space[2]} ${space[6]}`, borderBottom: `1px solid ${color.borderDefault}`,
        backgroundColor: color.white, display: 'flex', alignItems: 'center', gap: space[3], flexShrink: 0, zIndex: 20,
      }}>
        <IconButton size="sm" aria-label="Back to demos" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </IconButton>
        <IconButton size="sm" aria-label="Restart" onClick={restart}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 7a5 5 0 1 0 1.5-3.5" /><path d="M2 2v3h3" />
          </svg>
        </IconButton>
        <span style={{ fontSize: font.size.xs, color: color.textSubtle, fontWeight: font.weight.medium }}>{label}</span>
        <div style={{ flex: 1 }} />
        <RecordButton recording={recording} supported={recSupported} onClick={() => recToggle(recName, restart)} />
        <SpeedControl speed={speed} onChange={setSpeed} />
        <span style={{ fontSize: font.size['2xs'], color: color.textSubtle }}>{playing ? 'Playing…' : 'Done'}</span>
      </div>

      {/* The REAL Option-5 layout — summary hidden — driven by the cursor below */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <InfoStickyLayout
          state={state}
          dispatch={dispatch}
          canProceed={canProceed}
          toothColorMap={toothColorMap}
          onContinue={onBack}
          showSummary={false}
          openPickerOnMount
          onEditPatient={() => dispatch({ type: 'CLEAR_PATIENT' })}
          scrollRef={scrollRef}
        />

        {/* Fake cursor overlay — never intercepts pointer events */}
        <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100000, overflow: 'hidden' }}>
          <style>{`@keyframes infoDemoRipple { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: .45 } 100% { transform: translate(-50%,-50%) scale(2.4); opacity: 0 } }`}</style>
          {clicking && (
            <span key={clickKey} style={{ position: 'absolute', left: cursor.x, top: cursor.y, width: 24, height: 24, borderRadius: '50%', border: '1.5px solid rgba(37,99,235,.9)', background: 'rgba(37,99,235,.12)', transform: 'translate(-50%,-50%)', animation: 'infoDemoRipple .42s ease-out forwards' }} />
          )}
          <div style={{
            position: 'absolute', left: cursor.x, top: cursor.y, width: 16, height: 20,
            transform: `translate(-0.9px,-0.9px) scale(${clicking ? 0.85 : 1})`, transformOrigin: 'top left',
            transition: 'left .26s cubic-bezier(.45,.05,.2,1), top .26s cubic-bezier(.45,.05,.2,1), opacity .3s, transform .12s ease',
            opacity: cursorVisible ? 1 : 0, filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,.4))',
          }}>
            <svg width="16" height="20" viewBox="0 0 18 22" fill="none">
              <path d="M1 1L1 16L5.5 12L9 20L12 19L8.5 11L14 11L1 1Z" fill="#000" stroke="#fff" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dentures flow demo (real Option-5 info layout, summary hidden) ─────────
//
// Same self-driving opening as InfoFlowDemo (search & create the patient), but
// the procedure sequence browses Fixed Restorative → Implant Planning and then
// settles on Dentures, which is fully configured (arch, type, stage, mould,
// shades), scanned and noted. Every step is a real interaction on a real
// component, driven by a fake cursor + synthetic DOM events.

function InfoDenturesDemo({ onBack }: { onBack: () => void }) {
  const recName = 'dentures';
  const { state, dispatch, canProceed, toothColorMap } = useInfoState();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { speed, setSpeed, speedRef } = useDemoSpeed();
  const { recording, toggle: recToggle, supported: recSupported } = useDemoRecorder();

  const [cursor, setCursor] = useState<XY>({ x: -200, y: -200 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [clickKey, setClickKey] = useState(0);
  const [label, setLabel] = useState('Starting…');
  const [playing, setPlaying] = useState(false);
  const [runId, setRunId] = useState(1); // bump to (re)start; auto-runs on mount

  useEffect(() => {
    if (runId === 0) return;
    let aborted = false;
    const timers = new Set<number>();
    setPlaying(true);

    const SPEED = 0.85;
    const sleep = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const id = window.setTimeout(() => { timers.delete(id); aborted ? reject(INFO_ABORT) : resolve(); }, ms * SPEED / speedRef.current);
        timers.add(id);
      });
    const ensure = () => { if (aborted) throw INFO_ABORT; };

    // ── DOM helpers ──
    const $ = (sel: string) => document.querySelector(sel) as HTMLElement | null;
    const $$ = (sel: string) => Array.from(document.querySelectorAll(sel)) as HTMLElement[];
    const byText = (sel: string, text: string) =>
      $$(sel).find((e) => (e.textContent || '').includes(text)) ?? null;
    const centerOf = (el: Element): XY => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const fire = (el: Element | null, type: string) => {
      if (el) el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
    };
    let lastHover: Element | null = null;
    const setHover = (el: Element | null) => {
      if (lastHover && lastHover !== el) {
        lastHover.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true, view: window, relatedTarget: el ?? document.body }));
      }
      if (el && el !== lastHover) fire(el, 'mouseover');
      if (el) fire(el, 'mousemove');
      lastHover = el;
    };
    const realClick = (el: Element | null) => {
      if (!el) return;
      fire(el, 'mousedown');
      fire(el, 'mouseup');
      const anyEl = el as unknown as { click?: () => void };
      if (typeof anyEl.click === 'function') anyEl.click();
      else fire(el, 'click');
    };
    const scrollTo = (el: Element | null) => el?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // ── Cursor motion ──
    const moveTo = async (xy: XY, dur = 420) => { ensure(); setCursorVisible(true); setCursor(xy); await sleep(dur); };
    const moveToEl = async (el: Element | null, dur?: number) => {
      if (!el) { await sleep(120); return; }
      await moveTo(centerOf(el), dur);
      setHover(el);
    };
    const clickPulse = async () => { setClickKey((k) => k + 1); setClicking(true); await sleep(170); setClicking(false); await sleep(60); };
    const clickEl = async (el: Element | null, settle = 400) => {
      if (!el) { await sleep(150); return; }
      await moveToEl(el);
      await clickPulse();
      realClick(el);
      await sleep(settle);
    };
    const pollFor = async (sel: string, tries = 40): Promise<HTMLElement | null> => {
      for (let k = 0; k < tries; k++) { ensure(); const el = $(sel); if (el) return el; await sleep(80); }
      return null;
    };
    const pollText = async (sel: string, text: string, tries = 40): Promise<HTMLElement | null> => {
      for (let k = 0; k < tries; k++) { ensure(); const el = byText(sel, text); if (el) return el; await sleep(80); }
      return null;
    };

    // Type into a REAL input via the native value setter so React's own
    // onChange fires (i.e. the component's live state updates).
    const nativeSet = (el: HTMLInputElement | HTMLTextAreaElement, value: string) => {
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      desc?.set?.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const typeInto = async (el: Element | null, text: string, perChar = 55) => {
      if (!el) return;
      const input = el as HTMLInputElement;
      input.focus?.();
      await sleep(180);
      nativeSet(input, '');
      await sleep(120);
      for (let i = 1; i <= text.length; i++) {
        ensure();
        nativeSet(input, text.slice(0, i));
        const ch = text[i - 1];
        await sleep((ch === ' ' || ch === '-' ? perChar + 30 : perChar) + ((i * 23) % 26));
      }
      await sleep(240);
    };

    // Open a real DropdownList trigger and click the option matching `text`.
    const pickDropdown = async (trigger: Element | null, optionText: string) => {
      if (!trigger) return;
      scrollTo(trigger); await sleep(200);
      await clickEl(trigger, 250);
      await clickEl(await pollText('li[role="option"]', optionText, 25), 420);
    };
    // The DropdownList trigger inside a `[data-demo="…"]` field wrapper.
    const fieldTrigger = (sel: string) => $(`${sel} button[aria-haspopup="listbox"]`);
    // Click a procedure card by name in the (collapsible) procedure picker,
    // re-expanding the grid via "Change" first when another one is selected.
    const showProcedure = async (name: string) => {
      if (!byText('button', name)) await clickEl(byText('button', 'Change'), 450);
      await clickEl(await pollText('button', name, 25), 650);
    };
    // Type + send a single note into the real notes input.
    const addNote = async (text: string) => {
      const input = $('input[placeholder="Progress notes here"]');
      if (!input) return;
      scrollTo(input); await sleep(250);
      await moveToEl(input, 420); await clickPulse(); realClick(input);
      await typeInto(input, text, 24);
      await clickEl($('button[aria-label="Send note"]'), 500);
    };

    // ── Script — every step is a real interaction on a real component ──
    const run = async () => {
      dispatch({ type: 'RESET' }); // clean slate
      setCursorVisible(true);
      await moveTo({ x: window.innerWidth / 2, y: window.innerHeight * 0.4 }, 280);
      await sleep(400);

      // 1 · PATIENT — sort + search the list, pick the wrong person, reopen the
      //     picker, then create the correct patient (same opening as the
      //     Fixed Restorative demo).
      setLabel('Sorting the patient list by date of birth');
      const search = await pollFor('input[placeholder="Search"]', 40);
      await pickDropdown($('button[aria-haspopup="listbox"]'), 'Date of birth');
      await sleep(500);
      setLabel('Searching: "Smith"…');
      await moveToEl(search, 520); await clickPulse(); realClick(search);
      await typeInto(search, 'Smith', 70);
      await sleep(600);
      setLabel('Picking John Smith from the list…');
      await clickEl(await pollText('button', 'John Smith', 30), 750);
      setLabel('Not the right patient — reopening the picker');
      await clickEl(await pollFor('button[aria-label="Edit patient"]', 30), 700);

      // 2 · CREATE the correct patient via the real form
      setLabel('Adding the correct patient…');
      await clickEl(await pollText('button', '+ New patient', 30), 500);
      const fn = await pollFor('[data-demo="patient-form"] input[placeholder="First name"]', 30);
      await moveToEl(fn, 460); await clickPulse(); realClick(fn);
      await typeInto(fn, 'Maya', 55);
      const ln = $('[data-demo="patient-form"] input[placeholder="Last name"]');
      await moveToEl(ln, 420); await clickPulse(); realClick(ln);
      await typeInto(ln, 'Okafor', 55);
      setLabel('Choosing gender…');
      const fem = $('[data-demo="patient-form"] input[type="radio"][value="female"]');
      if (fem) { await moveToEl(fem.closest('label') ?? fem, 420); await clickPulse(); realClick(fem); await sleep(300); }
      setLabel('Picking the date of birth…');
      const dob = $('[data-demo="new-patient-dob"] button');
      if (dob) {
        await clickEl(dob, 250);
        await pollFor('[aria-label="Previous month"]', 20);
        await clickEl(await pollFor('[data-demo="cal-day-12"]', 20), 400);
      }
      setLabel('Saving the new patient');
      await clickEl(await pollText('[data-demo="patient-form"] button', 'Save Patient', 25), 700);

      // 3 · PROCEDURES — browse Fixed Restorative → Implant Planning, then Dentures
      const procGrid = await pollText('button', 'Dentures', 40);
      scrollTo(procGrid); await sleep(500);
      setLabel('Opening Fixed Restorative…');
      await showProcedure('Fixed Restorative');
      setLabel('Trying Implant Planning…');
      await showProcedure('Implant Planning');
      setLabel('Choosing Dentures');
      await showProcedure('Dentures');

      // 4 · DUE / SEND — drive the real dropdown + date picker
      setLabel('Selecting the lab…');
      const sendTrigger = await pollFor('[data-demo="due-send"] button[aria-haspopup="listbox"]', 40);
      scrollTo(sendTrigger); await sleep(300);
      await pickDropdown(sendTrigger, 'Premier Dental Lab');
      setLabel('Setting the due date…');
      const dateBtn = $('[data-demo="due-send"] button:not([aria-haspopup="listbox"])');
      if (dateBtn) {
        await clickEl(dateBtn, 250);
        await pollFor('[aria-label="Next month"]', 25);
        await clickEl($('[aria-label="Next month"]'), 300);
        await clickEl(await pollFor('[data-demo="cal-day-20"]', 20), 450);
      }

      // 5 · ARCH — pick Both
      setLabel('Arch → Both');
      const archBoth = await pollFor('[data-demo="dentures-arch"] input[type="radio"][value="both"]', 30);
      if (archBoth) {
        scrollTo(archBoth); await sleep(250);
        await moveToEl(archBoth.closest('label') ?? archBoth, 420); await clickPulse(); realClick(archBoth); await sleep(350);
      }

      // 6 · DENTURE SPEC — drive each real dropdown in turn
      setLabel('Denture type → Complete Denture');
      await pickDropdown(fieldTrigger('[data-demo="dent-type"]'), 'Complete Denture');
      setLabel('Stage → Final');
      await pickDropdown(fieldTrigger('[data-demo="dent-stage"]'), 'Final');
      setLabel('Mould → Ovoid');
      await pickDropdown(fieldTrigger('[data-demo="dent-mould"]'), 'Ovoid');
      setLabel('Shade system → VITA Classical');
      await pickDropdown(fieldTrigger('[data-demo="dent-shade-system"]'), 'VITA Classical');
      setLabel('Teeth shade → A2');
      await pickDropdown(fieldTrigger('[data-demo="dent-teeth-shade"]'), 'A2');
      setLabel('Gingival shade → Medium Pink');
      await pickDropdown(fieldTrigger('[data-demo="dent-gingival"]'), 'Medium Pink');

      // 7 · SCAN OPTIONS — three real toggles
      setLabel('Enabling scan options…');
      for (const t of ['NIRI capture', 'Sleeve attached', 'Denture copy']) {
        const lab = byText('label', t);
        if (lab) { scrollTo(lab); await sleep(250); await moveToEl(lab, 420); await clickPulse(); realClick(lab.querySelector('input')); await sleep(350); }
      }

      // 8 · NOTES — add a couple, each typed + sent on the real input
      setLabel('Adding notes…');
      await addNote('Complete denture, both arches — final stage.');
      await addNote('Mould ovoid; teeth shade A2, gingival medium pink.');

      setLabel('Flow complete — ready to scan.');
      await moveTo({ x: window.innerWidth / 2, y: window.innerHeight * 0.45 }, 500);
      await sleep(300);
      setCursorVisible(false);
    };

    run()
      .then(() => { if (!aborted) setPlaying(false); })
      .catch((e) => { if (e !== INFO_ABORT) console.error('[DenturesDemo]', e); });

    return () => { aborted = true; timers.forEach((id) => window.clearTimeout(id)); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  const restart = () => { setCursorVisible(false); setRunId((n) => n + 1); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Transport bar */}
      <div style={{
        padding: `${space[2]} ${space[6]}`, borderBottom: `1px solid ${color.borderDefault}`,
        backgroundColor: color.white, display: 'flex', alignItems: 'center', gap: space[3], flexShrink: 0, zIndex: 20,
      }}>
        <IconButton size="sm" aria-label="Back to demos" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </IconButton>
        <IconButton size="sm" aria-label="Restart" onClick={restart}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 7a5 5 0 1 0 1.5-3.5" /><path d="M2 2v3h3" />
          </svg>
        </IconButton>
        <span style={{ fontSize: font.size.xs, color: color.textSubtle, fontWeight: font.weight.medium }}>{label}</span>
        <div style={{ flex: 1 }} />
        <RecordButton recording={recording} supported={recSupported} onClick={() => recToggle(recName, restart)} />
        <SpeedControl speed={speed} onChange={setSpeed} />
        <span style={{ fontSize: font.size['2xs'], color: color.textSubtle }}>{playing ? 'Playing…' : 'Done'}</span>
      </div>

      {/* The REAL Option-5 layout — summary hidden — driven by the cursor below */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <InfoStickyLayout
          state={state}
          dispatch={dispatch}
          canProceed={canProceed}
          toothColorMap={toothColorMap}
          onContinue={onBack}
          showSummary={false}
          openPickerOnMount
          onEditPatient={() => dispatch({ type: 'CLEAR_PATIENT' })}
          scrollRef={scrollRef}
        />

        {/* Fake cursor overlay — never intercepts pointer events */}
        <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100000, overflow: 'hidden' }}>
          <style>{`@keyframes infoDemoRipple { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: .45 } 100% { transform: translate(-50%,-50%) scale(2.4); opacity: 0 } }`}</style>
          {clicking && (
            <span key={clickKey} style={{ position: 'absolute', left: cursor.x, top: cursor.y, width: 24, height: 24, borderRadius: '50%', border: '1.5px solid rgba(37,99,235,.9)', background: 'rgba(37,99,235,.12)', transform: 'translate(-50%,-50%)', animation: 'infoDemoRipple .42s ease-out forwards' }} />
          )}
          <div style={{
            position: 'absolute', left: cursor.x, top: cursor.y, width: 16, height: 20,
            transform: `translate(-0.9px,-0.9px) scale(${clicking ? 0.85 : 1})`, transformOrigin: 'top left',
            transition: 'left .26s cubic-bezier(.45,.05,.2,1), top .26s cubic-bezier(.45,.05,.2,1), opacity .3s, transform .12s ease',
            opacity: cursorVisible ? 1 : 0, filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,.4))',
          }}>
            <svg width="16" height="20" viewBox="0 0 18 22" fill="none">
              <path d="M1 1L1 16L5.5 12L9 20L12 19L8.5 11L14 11L1 1Z" fill="#000" stroke="#fff" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scan + View flow demo (real ScreenTemplate, horizontal-top layout) ─────
//
// Drives the REAL scan & view pages via a fake cursor + real DOM events, like
// the other demos. Hosts ScreenTemplate the same way DedicatedTopToolbarPage
// does (horizontal-top, scan tabs on), but owns currentPage so it can start on
// Scan and switch to View mid-script.

function ScanViewDemo({ onBack }: { onBack: () => void }) {
  const recName = 'scan-view';
  const [currentPage, setCurrentPage] = useState<string>('scan');
  const [activeButtons, setActiveButtons] = useState<Set<number>>(new Set());
  const [viewActiveButtons, setViewActiveButtons] = useState<Set<number>>(new Set());
  const [scanTabs, setScanTabs] = useState<ScanTab[]>([
    { id: '1', label: 'Treatment Scan', layerType: 'treatment-scan' },
  ]);

  const [cursor, setCursor] = useState<XY>({ x: -200, y: -200 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [clickKey, setClickKey] = useState(0);
  const [label, setLabel] = useState('Starting…');
  const [playing, setPlaying] = useState(false);
  const [runId, setRunId] = useState(1);
  const { speed, setSpeed, speedRef } = useDemoSpeed();
  const { recording, toggle: recToggle, supported: recSupported } = useDemoRecorder();

  // Scan tool toggle (skip index 3 — in the app it navigates away to Undercut).
  const handleButtonClick = (index: number) => {
    if (index === 3) return;
    setActiveButtons((prev) => {
      const s = new Set(prev);
      s.has(index) ? s.delete(index) : s.add(index);
      return s;
    });
  };
  // View tool toggle with the app's mutual-exclusivity rules (2/4 and 3/5).
  const handleViewButtonClick = (index: number) => {
    setViewActiveButtons((prev) => {
      const s = new Set(prev);
      if (index === 2 || index === 4) {
        s.delete(index === 2 ? 4 : 2);
        s.has(index) ? s.delete(index) : s.add(index);
      } else if (index === 3 || index === 5) {
        s.delete(index === 3 ? 5 : 3);
        s.has(index) ? s.delete(index) : s.add(index);
      } else {
        s.has(index) ? s.delete(index) : s.add(index);
      }
      return s;
    });
  };

  useEffect(() => {
    if (runId === 0) return;
    let aborted = false;
    const timers = new Set<number>();
    setPlaying(true);

    const SPEED = 0.9;
    const sleep = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const id = window.setTimeout(() => { timers.delete(id); aborted ? reject(INFO_ABORT) : resolve(); }, ms * SPEED / speedRef.current);
        timers.add(id);
      });
    const ensure = () => { if (aborted) throw INFO_ABORT; };

    const $ = (sel: string) => document.querySelector(sel) as HTMLElement | null;
    const $$ = (sel: string) => Array.from(document.querySelectorAll(sel)) as HTMLElement[];
    const byText = (sel: string, text: string) => $$(sel).find((e) => (e.textContent || '').includes(text)) ?? null;
    const byExact = (sel: string, text: string) => $$(sel).find((e) => (e.textContent || '').trim() === text) ?? null;
    const centerOf = (el: Element): XY => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
    const fire = (el: Element | null, type: string, extra: MouseEventInit = {}) => {
      if (el) el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window, ...extra }));
    };
    let lastHover: Element | null = null;
    const setHover = (el: Element | null) => {
      if (lastHover && lastHover !== el) lastHover.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true, view: window, relatedTarget: el ?? document.body }));
      if (el && el !== lastHover) fire(el, 'mouseover');
      if (el) fire(el, 'mousemove');
      lastHover = el;
    };
    const realClick = (el: Element | null) => {
      if (!el) return;
      fire(el, 'mousedown'); fire(el, 'mouseup');
      const anyEl = el as unknown as { click?: () => void };
      if (typeof anyEl.click === 'function') anyEl.click(); else fire(el, 'click');
    };
    const moveTo = async (xy: XY, dur = 460) => { ensure(); setCursorVisible(true); setCursor(xy); await sleep(dur); };
    const moveToEl = async (el: Element | null, dur?: number) => { if (!el) { await sleep(120); return; } await moveTo(centerOf(el), dur); setHover(el); };
    const clickPulse = async () => { setClickKey((k) => k + 1); setClicking(true); await sleep(170); setClicking(false); await sleep(60); };
    // Clear hover after a click so tool tooltips dismiss — they should only
    // show while hovering, not linger once the tool has been clicked.
    const clearHover = (el: Element | null) => {
      if (el) el.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true, view: window, relatedTarget: document.body }));
      lastHover = null;
    };
    const clickEl = async (el: Element | null, settle = 450) => {
      if (!el) { await sleep(150); return; }
      await moveToEl(el);
      await sleep(800); // dwell on hover so the DS tooltip (~400ms delay) appears + is clearly seen before clicking
      await clickPulse();
      realClick(el);
      await sleep(settle);
      clearHover(el); // then dismiss the tooltip — it should only show while hovering
    };
    const pollFor = async (sel: string, tries = 40): Promise<HTMLElement | null> => {
      for (let k = 0; k < tries; k++) { ensure(); const el = $(sel); if (el) return el; await sleep(80); }
      return null;
    };
    const pollText = async (sel: string, text: string, tries = 40): Promise<HTMLElement | null> => {
      for (let k = 0; k < tries; k++) { ensure(); const el = byText(sel, text); if (el) return el; await sleep(80); }
      return null;
    };
    // Drag a custom role="slider" to `percent` by dispatching real mouse events.
    const dragSlider = async (el: Element | null, percent: number) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const y = r.top + r.height / 2;
      const xAt = (p: number) => r.left + (Math.max(0, Math.min(100, p)) / 100) * r.width;
      await moveTo({ x: xAt(8), y });
      fire(el, 'mousedown', { clientX: xAt(8), clientY: y });
      for (const p of [20, 35, percent]) {
        ensure();
        await sleep(180);
        const x = xAt(p);
        window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, view: window, clientX: x, clientY: y }));
        document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, view: window, clientX: x, clientY: y }));
        setCursor({ x, y });
      }
      window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, view: window, clientX: xAt(percent), clientY: y }));
      await sleep(350);
    };

    // Rotate the 3D model by dragging the WebGL canvas. drei's OrbitControls
    // captures the pointer on the canvas, so pointermove MUST be dispatched on
    // the canvas (not window). Many small eased steps + damping → smooth orbit.
    const dragModel = async (dx = 230, dy = 50) => {
      const canvas = $('canvas');
      if (!canvas) { await sleep(150); return; }
      const r = canvas.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const pe = (type: string, x: number, y: number, buttons: number) =>
        new PointerEvent(type, { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons, pressure: buttons ? 0.5 : 0 });
      await moveTo({ x: cx, y: cy }, 360);
      canvas.dispatchEvent(pe('pointerdown', cx, cy, 1));
      const steps = 30;
      let lastX = cx, lastY = cy;
      for (let i = 1; i <= steps; i++) {
        ensure();
        const t = i / steps;
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOut
        const x = cx + dx * ease, y = cy + dy * ease;
        // dispatch on the canvas (pointer-capture target) AND window as fallback
        const mv = pe('pointermove', x, y, 1);
        canvas.dispatchEvent(mv);
        window.dispatchEvent(pe('pointermove', x, y, 1));
        setCursor({ x, y });
        lastX = x; lastY = y;
        await sleep(18);
      }
      canvas.dispatchEvent(pe('pointerup', lastX, lastY, 0));
      window.dispatchEvent(pe('pointerup', lastX, lastY, 0));
      await sleep(550); // let damping settle for a natural finish
    };

    const run = async () => {
      setCursorVisible(true);
      await moveTo({ x: window.innerWidth / 2, y: window.innerHeight * 0.4 }, 280);
      await sleep(500);

      // ═══ SCAN — jaw selector: lower → upper → both, rotating in each ═══
      setLabel('Scan — lower arch, rotating the model…');
      await dragModel(140, 20);
      setLabel('Switching to the Upper arch…');
      await clickEl(await pollFor('[aria-label="Previous jaw"]', 40), 500);
      await dragModel(-120, 18);
      setLabel('Switching to Both arches…');
      await clickEl($('[aria-label="Previous jaw"]'), 500);
      await dragModel(120, -18);

      // ═══ SCAN — tools: monochrome on then off, scan assist, prep edit ═══
      setLabel('Turning on Monochrome…');
      await clickEl(await pollFor('[aria-label="Monochrome"]', 40), 650);
      setLabel('…and turning Monochrome off');
      await clickEl($('[aria-label="Monochrome"]'), 650);
      setLabel('Turning on the Scan-assist (feedback) tool…');
      await clickEl($('[aria-label="Scan assist"]'), 650);
      setLabel('Turning on Prep edit…');
      await clickEl($('[aria-label="Prep edit"]'), 700);

      // ═══ SCAN — settle the model back toward its original view ═══
      setLabel('Returning the model to its original view…');
      await dragModel(-160, -22);

      // ═══ SCAN — additional layers ═══
      setLabel('Adding a Pre-Treatment scan…');
      await clickEl(await pollFor('[aria-label="Add layer"]', 30), 450);
      await clickEl(await pollText('[role="menuitem"]', 'Pre Treatment', 25), 750);
      setLabel('Adding an Additional scan…');
      await clickEl($('[aria-label="Add layer"]'), 450);
      await clickEl(await pollText('[role="menuitem"]', 'Additional Scan', 25), 750);
      setLabel('Adding Additional bites…');
      await clickEl($('[aria-label="Add layer"]'), 450);
      await clickEl(await pollText('[role="menuitem"]', 'Additional Bite', 25), 450);
      setLabel('Selecting bites: Centric Occlusion + Right Lateral…');
      await clickEl(await pollText('[role="menuitemcheckbox"]', 'Centric Occlusion', 25), 350);
      await clickEl(await pollText('[role="menuitemcheckbox"]', 'Right Lateral', 25), 350);
      await clickEl(byText('button', 'Add Selected') ?? byText('button', 'Update'), 800);
      setLabel('Removing an additional bite…');
      const closeBtn = $$('button[aria-label^="Close"]').slice(-1)[0] ?? null;
      if (closeBtn) { await moveToEl(closeBtn.closest('[role="tab"]') ?? closeBtn, 400); await clickEl(closeBtn, 750); }

      // ═══ Move to VIEW ═══
      setLabel('Moving to the View page…');
      const viewNav = byExact('span, div, p', 'View');
      if (viewNav) { await moveToEl(viewNav, 600); await clickPulse(); realClick(viewNav); }
      setCurrentPage('view');
      await sleep(1000);

      // ═══ VIEW — jaw selector in the multi-layer panel ═══
      setLabel('View — selecting the Upper jaw…');
      await clickEl(await pollFor('[aria-label="Select upper jaw"]', 40), 600);
      setLabel('View — selecting the Lower jaw…');
      await clickEl($('[aria-label="Select lower jaw"]'), 600);
      setLabel('View — back to Both jaws…');
      await clickEl($('[aria-label="Select both jaw"]'), 600);

      // ═══ VIEW — rotate the model ═══
      setLabel('View — rotating the model…');
      await dragModel(150, 22);

      // ═══ VIEW — opacity ═══
      setLabel('Expanding the layers panel…');
      const expand = $('button[aria-label="Expand layers"]');
      if (expand) await clickEl(expand, 700);
      setLabel('Adjusting the layer opacity…');
      await dragSlider(await pollFor('[role="slider"]', 25), 45);

      // ═══ VIEW — Review tool + Margin line, then close both ═══
      setLabel('Opening the Review (NIRI) tool…');
      await clickEl(await pollFor('[aria-label="Review Tool"]', 40), 700);
      setLabel('Opening the Margin line tool…');
      await clickEl($('[aria-label="Margin line"]'), 800);
      setLabel('Closing the Margin line…');
      await clickEl($('[aria-label="Margin line"]'), 700);
      setLabel('Closing the Review tool…');
      await clickEl($('[aria-label="Review Tool"]'), 700);

      // ═══ VIEW — Occlusalgram ═══
      setLabel('Opening the Occlusalgram tool…');
      await clickEl($('[aria-label="Occlusalgram"]'), 800);

      // ═══ VIEW — settle the model back toward its original view ═══
      setLabel('Returning the model to its original view…');
      await dragModel(-150, -20);

      setLabel('Scan → View flow complete.');
      await moveTo({ x: window.innerWidth / 2, y: window.innerHeight * 0.45 }, 500);
      await sleep(300);
      setCursorVisible(false);
    };

    run()
      .then(() => { if (!aborted) setPlaying(false); })
      .catch((e) => { if (e !== INFO_ABORT) console.error('[ScanViewDemo]', e); });

    return () => { aborted = true; timers.forEach((id) => window.clearTimeout(id)); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  const restart = () => { setCursorVisible(false); setActiveButtons(new Set()); setViewActiveButtons(new Set()); setScanTabs([{ id: '1', label: 'Treatment Scan', layerType: 'treatment-scan' }]); setCurrentPage('scan'); setRunId((n) => n + 1); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Transport bar */}
      <div style={{
        padding: `${space[2]} ${space[6]}`, borderBottom: `1px solid ${color.borderDefault}`,
        backgroundColor: color.white, display: 'flex', alignItems: 'center', gap: space[3], flexShrink: 0, zIndex: 20,
      }}>
        <IconButton size="sm" aria-label="Back to demos" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3L5 8l5 5" /></svg>
        </IconButton>
        <IconButton size="sm" aria-label="Restart" onClick={restart}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7a5 5 0 1 0 1.5-3.5" /><path d="M2 2v3h3" /></svg>
        </IconButton>
        <span style={{ fontSize: font.size.xs, color: color.textSubtle, fontWeight: font.weight.medium }}>{label}</span>
        <div style={{ flex: 1 }} />
        <RecordButton recording={recording} supported={recSupported} onClick={() => recToggle(recName, restart)} />
        <SpeedControl speed={speed} onChange={setSpeed} />
        <span style={{ fontSize: font.size['2xs'], color: color.textSubtle }}>{playing ? 'Playing…' : 'Done'}</span>
      </div>

      {/* The REAL scan/view pages — driven by the cursor below */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <ToolbarDensityContext.Provider value={{ dense: true }}>
          <div className="w-full h-full overflow-hidden relative" style={{ backgroundColor: 'var(--ads-background-subtle-01)' }}>
            <ScreenTemplate
              initialPage={currentPage}
              microAnimations={true}
              onBackToHome={onBack}
              onNavigateToLayout={() => {}}
              layout="horizontal-top"
              activeButtons={activeButtons}
              viewActiveButtons={viewActiveButtons}
              onPageChange={setCurrentPage}
              onButtonClick={handleButtonClick}
              onViewButtonClick={handleViewButtonClick}
              combinedPanelMode={false}
              onCombinedPanelModeChange={() => {}}
              hideLayoutSwitcher
              showScanTabs
              scanTabs={scanTabs}
              onScanTabsChange={setScanTabs}
            />
          </div>
        </ToolbarDensityContext.Provider>

        {/* Fake cursor overlay */}
        <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100000, overflow: 'hidden' }}>
          <style>{`@keyframes svDemoRipple { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: .45 } 100% { transform: translate(-50%,-50%) scale(2.4); opacity: 0 } }`}</style>
          {clicking && (
            <span key={clickKey} style={{ position: 'absolute', left: cursor.x, top: cursor.y, width: 24, height: 24, borderRadius: '50%', border: '1.5px solid rgba(37,99,235,.9)', background: 'rgba(37,99,235,.12)', transform: 'translate(-50%,-50%)', animation: 'svDemoRipple .42s ease-out forwards' }} />
          )}
          <div style={{
            position: 'absolute', left: cursor.x, top: cursor.y, width: 16, height: 20,
            transform: `translate(-0.9px,-0.9px) scale(${clicking ? 0.85 : 1})`, transformOrigin: 'top left',
            transition: 'left .26s cubic-bezier(.45,.05,.2,1), top .26s cubic-bezier(.45,.05,.2,1), opacity .3s, transform .12s ease',
            opacity: cursorVisible ? 1 : 0, filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,.4))',
          }}>
            <svg width="16" height="20" viewBox="0 0 18 22" fill="none">
              <path d="M1 1L1 16L5.5 12L9 20L12 19L8.5 11L14 11L1 1Z" fill="#000" stroke="#fff" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Real Patient-Report overlay demos (the "r" full-flow + "t" annotation) ──
//
// These are the genuine self-driving overlays that run over the REAL
// PatientReportPage (same ones triggered by "r" / "t" on the report page),
// surfaced here as their own hub cards.

type ReportOverlayProps = {
  pageRef: React.RefObject<PatientReportPageHandle | null>;
  runId: number;
  onDone: () => void;
  speedRef?: React.MutableRefObject<number>;
};

function PatientReportOverlayDemo({ onBack, title, Overlay }: { onBack: () => void; title: string; Overlay: React.ComponentType<ReportOverlayProps> }) {
  const recName = title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'report';
  const ref = useRef<PatientReportPageHandle | null>(null);
  const [runId, setRunId] = useState(0);
  const [done, setDone] = useState(false);
  const { speed, setSpeed, speedRef } = useDemoSpeed();
  const { recording, toggle: recToggle, supported: recSupported } = useDemoRecorder();

  // Start once the page (and its ref) is mounted; the overlays bail early if
  // pageRef.current is null, so we defer the first run by a tick.
  useEffect(() => {
    const t = window.setTimeout(() => setRunId(1), 350);
    return () => window.clearTimeout(t);
  }, []);

  const restart = () => { setDone(false); setRunId((n) => n + 1); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div style={{
        padding: `${space[2]} ${space[6]}`, borderBottom: `1px solid ${color.borderDefault}`,
        backgroundColor: color.white, display: 'flex', alignItems: 'center', gap: space[3], flexShrink: 0, zIndex: 20,
      }}>
        <IconButton size="sm" aria-label="Back to demos" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3L5 8l5 5" /></svg>
        </IconButton>
        <IconButton size="sm" aria-label="Restart" onClick={restart}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7a5 5 0 1 0 1.5-3.5" /><path d="M2 2v3h3" /></svg>
        </IconButton>
        <span style={{ fontSize: font.size.xs, color: color.textSubtle, fontWeight: font.weight.medium }}>{title}</span>
        <div style={{ flex: 1 }} />
        <RecordButton recording={recording} supported={recSupported} onClick={() => recToggle(recName, restart)} />
        <SpeedControl speed={speed} onChange={setSpeed} />
        <span style={{ fontSize: font.size['2xs'], color: color.textSubtle }}>{done ? 'Done' : 'Playing…'}</span>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <PatientReportPage ref={ref} onBackToHome={onBack} />
        <Overlay pageRef={ref} runId={runId} onDone={() => setDone(true)} speedRef={speedRef} />
      </div>
    </div>
  );
}

// ─── Demo catalog ────────────────────────────────────────────────────────────

type DemoId = 'patient-report' | 'info-fixed-restorative' | 'info-dentures' | 'scan-view' | 'report-flow' | 'report-annotation';

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
  {
    id: 'info-fixed-restorative',
    title: 'Fixed Restorative Flow',
    description:
      'Info page Option 5 with the summary panel hidden: patient search & table filtering, all procedures, due/send dates, multi-tooth selection across different procedures, the tooth table expand/collapse, removing cards, scan options and notes.',
    badge: '10 features',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5.5c-2-2-5.5-2-7 0-1.6 2 0 5 0.7 8 0.4 1.7 0.6 4.5 2 4.5 1.3 0 1.3-3 2.3-3s1 3 2.3 3c1.4 0 1.6-2.8 2-4.5 0.7-3 2.3-6 0.7-8-1.5-2-5-2-7 0Z" />
      </svg>
    ),
  },
  {
    id: 'info-dentures',
    title: 'Dentures Flow',
    description:
      'Info page Option 5 with the summary panel hidden: the same patient search & create opening, browsing Fixed Restorative → Implant Planning, then a fully configured Dentures case — arch, type, stage, mould, shade system, teeth & gingival shades, scan options and notes.',
    badge: 'Implant → Dentures',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9c0-2 1.5-3.5 4-3.5 1.6 0 2.4 0.8 4 0.8s2.4-0.8 4-0.8c2.5 0 4 1.5 4 3.5 0 3-1.2 4.2-2.2 6.6-0.7 1.7-1 3.4-2.3 3.4-1.2 0-1.2-2.5-2.2-2.5h-2.6c-1 0-1 2.5-2.2 2.5-1.3 0-1.6-1.7-2.3-3.4C5.2 13.2 4 12 4 9Z" />
        <path d="M8 9.5h8" />
      </svg>
    ),
  },
  {
    id: 'report-flow',
    title: 'Patient Report — Full Flow',
    description:
      'The real self-driving report demo: fills patient details, browses & applies templates, builds the report from the media gallery, picks teeth, writes notes, fills the appointment & prescription, signs, previews and shares — all driven on the live report page.',
    badge: 'Auto',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'report-annotation',
    title: 'Annotation Tool',
    description:
      'The real annotation demo: opens an image in the lightbox and draws annotations (pen, shapes, labels) on the area of concern, then saves them back onto the report.',
    badge: 'Auto',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    id: 'scan-view',
    title: 'Scan & View Flow',
    description:
      'Top-toolbar layout: pick scan tools (Monochrome, Scan assist, Prep edit), add a Pre-Treatment scan, an Additional scan and Additional bites, remove a bite, then switch to View — toggle tools and use the multi-layer panel (opacity slider, eye visibility).',
    badge: 'Scan + View',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
        <circle cx="12" cy="12" r="3" />
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
  // Deep-link: `?demo=<id>` opens straight into that demo (used by the MP4
  // recorder script and shareable links). Falls back to the hub.
  const [activeDemo, setActiveDemo] = useState<DemoId | null>(() => {
    const d = new URLSearchParams(window.location.search).get('demo');
    return DEMOS.some((x) => x.id === d) ? (d as DemoId) : null;
  });

  if (activeDemo === 'patient-report') {
    return <PatientReportDemo onBackToHub={() => setActiveDemo(null)} />;
  }

  if (activeDemo === 'info-fixed-restorative') {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: color.bgPage,
        fontFamily: font.family,
      }}>
        <InfoFlowDemo onBack={() => setActiveDemo(null)} />
      </div>
    );
  }

  if (activeDemo === 'info-dentures') {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: color.bgPage,
        fontFamily: font.family,
      }}>
        <InfoDenturesDemo onBack={() => setActiveDemo(null)} />
      </div>
    );
  }

  if (activeDemo === 'scan-view') {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: color.bgPage,
        fontFamily: font.family,
      }}>
        <ScanViewDemo onBack={() => setActiveDemo(null)} />
      </div>
    );
  }

  if (activeDemo === 'report-flow') {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: color.bgPage, fontFamily: font.family }}>
        <PatientReportOverlayDemo onBack={() => setActiveDemo(null)} title="Patient Report — full flow" Overlay={ReportDemoOverlay} />
      </div>
    );
  }

  if (activeDemo === 'report-annotation') {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: color.bgPage, fontFamily: font.family }}>
        <PatientReportOverlayDemo onBack={() => setActiveDemo(null)} title="Annotation tool" Overlay={AnnotationDemoOverlay} />
      </div>
    );
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
