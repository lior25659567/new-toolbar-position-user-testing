import { useEffect, useState } from 'react';
import type { PatientReportPageHandle } from '../PatientReportPage';
import { startGallerySession, endGalleryDemo } from './reportDemoGalleryBus';

/**
 * Self-driving demo for the image ANNOTATION tool.
 *
 * Pressing "t" on the report page plays a hands-off session that uploads a few
 * clinical photos and explores the annotation lightbox: drawing/marking with the
 * pen (colours + sizes), writing text labels, erasing, deleting a label, and
 * undo / redo. Driven through a fake cursor + dispatched events, like the report
 * demo. The overlay never intercepts pointer events.
 */

type XY = { x: number; y: number };
type DemoBlock = { id: string; type: string; collapsed?: boolean; [k: string]: unknown };

interface Props {
  pageRef: React.RefObject<PatientReportPageHandle | null>;
  runId: number;
  onDone: () => void;
  /** Live playback rate (1× = authored pace). Picked up on the next wait. */
  speedRef?: React.MutableRefObject<number>;
}

const ABORT = Symbol('annot-demo-abort');

export default function AnnotationDemoOverlay({ pageRef, runId, onDone, speedRef }: Props) {
  const [cursor, setCursor] = useState<XY>({ x: -200, y: -200 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [clickKey, setClickKey] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (runId === 0) {
      setCursorVisible(false);
      setHintVisible(false);
      setDrawing(false);
      return;
    }

    let aborted = false;
    const timers = new Set<number>();
    const SPEED = 0.65;
    const sleep = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          aborted ? reject(ABORT) : resolve();
        }, ms * SPEED / (speedRef?.current ?? 1));
        timers.add(id);
      });
    const ensure = () => { if (aborted) throw ABORT; };

    // ── DOM helpers ──
    const $ = (sel: string) => document.querySelector(sel) as Element | null;
    const $$ = (sel: string) => Array.from(document.querySelectorAll(sel)) as Element[];
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
    const scrollToEl = (el: Element | null) => el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const rectStable = async (el: Element | null, tries = 14) => {
      if (!el) return;
      let last = el.getBoundingClientRect().top;
      for (let k = 0; k < tries; k++) {
        await sleep(70);
        const t = el.getBoundingClientRect().top;
        if (Math.abs(t - last) < 0.5) return;
        last = t;
      }
    };

    // ── Cursor motion ──
    const MOVE = 380;
    const center = (): XY => ({ x: window.innerWidth / 2, y: window.innerHeight * 0.45 });
    const moveTo = async (xy: XY, dur = MOVE) => {
      ensure();
      setCursorVisible(true);
      setCursor(xy);
      await sleep(dur);
    };
    const moveToEl = async (el: Element | null, dur?: number) => {
      if (!el) { await sleep(120); return; }
      await moveTo(centerOf(el), dur);
      setHover(el);
    };
    const moveToSel = async (sel: string, dur?: number) => moveToEl($(sel), dur);
    const clickPulse = async () => {
      setClickKey((k) => k + 1);
      setClicking(true);
      await sleep(170);
      setClicking(false);
      await sleep(70);
    };
    const clickEl = async (el: Element | null, settle = 340) => {
      await moveToEl(el);
      await clickPulse();
      realClick(el);
      await sleep(settle);
    };
    const clickSel = async (sel: string, settle = 340) => clickEl($(sel), settle);
    const pollFor = async (sel: string, tries = 45): Promise<Element | null> => {
      for (let k = 0; k < tries; k++) {
        ensure();
        const el = $(sel);
        if (el) return el;
        await sleep(80);
      }
      return null;
    };

    const nativeSet = (el: HTMLInputElement | HTMLTextAreaElement, value: string) => {
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      desc?.set?.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const typeIntoInput = async (el: Element | null, text: string, perChar = 48) => {
      if (!el) return;
      const input = el as HTMLInputElement;
      input.focus?.();
      await sleep(160);
      nativeSet(input, '');
      await sleep(120);
      for (let i = 1; i <= text.length; i++) {
        ensure();
        nativeSet(input, text.slice(0, i));
        await sleep(perChar + ((i * 23) % 26));
      }
      await sleep(240);
      input.blur?.();
      await sleep(150);
    };

    const getBlocks = () => (pageRef.current?.getBlocks() ?? []) as unknown as DemoBlock[];

    // ── Reliable gallery (the modal self-drives via the shared bus) ──
    const galleryDialogSel = 'div[role="dialog"][aria-labelledby="gallery-modal-title"]';
    const isGalleryOpen = () => !!$(galleryDialogSel);
    const driveGallery = async (chooser: Element | null, pickIndex = 0) => {
      if (!chooser) return;
      startGallerySession({ selectCount: 1, pickIndex, stepMs: 340, settleMs: 340 });
      await moveToEl(chooser, 460);
      await clickPulse();
      realClick(chooser);
      await pollFor(galleryDialogSel, 40);
      const thumbs = $$('[data-demo^="gallery-"]').filter((e) => e.getAttribute('data-demo') !== 'gallery-add-btn');
      const thumb = thumbs[pickIndex] ?? thumbs[0] ?? null;
      if (thumb) await moveToEl(thumb, 460);
      const addBtn = $('[data-demo="gallery-add-btn"]');
      if (addBtn) await moveToEl(addBtn, 420);
      for (let k = 0; k < 70 && isGalleryOpen(); k++) await sleep(120);
      if (isGalleryOpen()) {
        pageRef.current?.clickInPage(`${galleryDialogSel} button[aria-label="Close"]`);
        for (let k = 0; k < 20 && isGalleryOpen(); k++) await sleep(120);
      }
      endGalleryDemo();
      await sleep(300);
    };

    // Add a fresh image block via the "+ Add Block" menu, then upload a photo into
    // it from the gallery. Returns the new block's id.
    const addImageFromGallery = async (pickIndex: number): Promise<string | null> => {
      await clickSel('[data-demo="add-block-trigger"]', 360);
      await moveToSel('[data-demo="add-block-image"]', 220);
      await clickSel('[data-demo="add-block-image"]', 420);
      pageRef.current?.clickInPage('[data-demo="addmenu-backdrop"]');
      await sleep(420);
      const blocks = getBlocks();
      const img = blocks[blocks.length - 1];
      if (!img || img.type !== 'image') return null;
      const cardSel = `[data-block-id="${img.id}"]`;
      scrollToEl($(cardSel));
      pageRef.current?.setActiveBlock(img.id);
      await sleep(380);
      await rectStable($(cardSel));
      await driveGallery($(`${cardSel} [data-demo="choose-from-gallery"]`), pickIndex);
      return img.id;
    };

    // ── Annotation lightbox helpers ──
    const annoCanvasSel = 'canvas[data-demo="annotation-canvas"]';
    const openAnnotate = async (blockId: string): Promise<HTMLCanvasElement | null> => {
      const cardSel = `[data-block-id="${blockId}"]`;
      scrollToEl($(cardSel));
      await sleep(350);
      await rectStable($(cardSel));
      const btn = $(`${cardSel} [data-demo="annotate"]`) ?? $(`${cardSel} [data-demo="edit-annotation"]`);
      await clickEl(btn, 300);
      const canvas = (await pollFor(annoCanvasSel, 50)) as HTMLCanvasElement | null;
      await sleep(450); // image paints onto the canvas
      return canvas;
    };
    const closeAnnotateSave = async () => {
      await clickSel('[data-demo="annotation-save"]', 500);
    };

    const selectTool = (label: string) => clickSel(`button[aria-label="${label}"]`, 260);
    const selectColor = (hex: string) => clickSel(`button[aria-label="Brush color ${hex}"]`, 220);
    const selectSize = (n: number) => clickSel(`button[aria-label="Brush size ${n}"]`, 220);

    // Dispatch a pen stroke (mousedown→moves→mouseup) on the canvas's native
    // listeners; the cursor tracks the pen.
    const inkCanvas = (canvas: Element, type: string, p: XY) =>
      canvas.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window, clientX: p.x, clientY: p.y }));
    const strokeOnCanvas = async (canvas: Element, pts: XY[], stepMs = 16) => {
      if (pts.length < 2) return;
      setDrawing(true);
      setCursorVisible(true);
      setCursor(pts[0]);
      await sleep(120);
      inkCanvas(canvas, 'mousedown', pts[0]);
      for (let i = 1; i < pts.length; i++) {
        ensure();
        inkCanvas(canvas, 'mousemove', pts[i]);
        setCursor(pts[i]);
        await sleep(stepMs);
      }
      inkCanvas(canvas, 'mouseup', pts[pts.length - 1]);
      setDrawing(false);
      await sleep(200);
    };
    // Shape generators in canvas-fraction coords → screen points.
    const cpt = (canvas: Element, fx: number, fy: number): XY => {
      const r = canvas.getBoundingClientRect();
      return { x: r.left + fx * r.width, y: r.top + fy * r.height };
    };
    // A loose, hand-drawn loop — over-shoots ~1.1 turns, wobbly radius, gently
    // elliptical + tilted — like a clinician quickly circling an area by hand.
    const looseLoopPts = (canvas: Element, fx: number, fy: number, fr: number, variant = 0): XY[] => {
      const r = canvas.getBoundingClientRect();
      const cx = r.left + fx * r.width, cy = r.top + fy * r.height;
      const rad = r.width * fr;
      const rx = rad * (1.12 + variant * 0.07);
      const ry = rad * (0.86 - variant * 0.05);
      const tilt = -0.25 + variant * 0.55;
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      const n = 36;
      const turns = 1.12 + variant * 0.06;
      const start = -Math.PI * 0.55 - variant * 0.45;
      const pts: XY[] = [];
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const a = start + t * Math.PI * 2 * turns;
        const wob = 1 + 0.10 * Math.sin(a * 2.2 + variant * 1.7) + 0.05 * Math.sin(a * 4.7 + variant);
        const x = Math.cos(a) * rx * wob;
        const y = Math.sin(a) * ry * wob;
        pts.push({ x: cx + x * ct - y * st, y: cy + x * st + y * ct });
      }
      return pts;
    };
    const arrowPts = (canvas: Element, f1: XY, f2: XY): XY[] => {
      const A = cpt(canvas, f1.x, f1.y), B = cpt(canvas, f2.x, f2.y);
      const ang = Math.atan2(B.y - A.y, B.x - A.x);
      const barb = 16;
      const b1 = { x: B.x - barb * Math.cos(ang - 0.45), y: B.y - barb * Math.sin(ang - 0.45) };
      const b2 = { x: B.x - barb * Math.cos(ang + 0.45), y: B.y - barb * Math.sin(ang + 0.45) };
      const line: XY[] = [];
      const N = 16;
      for (let i = 0; i <= N; i++) line.push({ x: A.x + (B.x - A.x) * (i / N), y: A.y + (B.y - A.y) * (i / N) });
      return [...line, b1, B, b2];
    };
    // Add a text label at a canvas fraction point and type it.
    const addText = async (canvas: Element, fx: number, fy: number, text: string) => {
      const p = cpt(canvas, fx, fy);
      await moveTo(p, 380);
      await clickPulse();
      inkCanvas(canvas, 'mousedown', p);
      inkCanvas(canvas, 'mouseup', p);
      await sleep(260);
      const inputs = $$('input[placeholder^="Type"]');
      const input = inputs[inputs.length - 1] ?? null;
      await typeIntoInput(input, text, 46);
      await sleep(200);
    };

    const run = async () => {
      const h = pageRef.current;
      if (!h) return;
      setCursorVisible(true);
      setHintVisible(true);
      window.setTimeout(() => { if (!aborted) setHintVisible(false); }, 2400);

      // Start from a clean report.
      h.resetReport();
      await moveTo(center(), 260);
      await sleep(400);

      // ── Photo 1 — explore the PEN: mark up the pre-op site. ──
      const id1 = await addImageFromGallery(0); // 1.png (pre-op)
      if (id1) {
        const canvas = await openAnnotate(id1);
        if (canvas) {
          await selectTool('Pen');
          await selectColor('#FF3B30'); // red
          await selectSize(6);
          await strokeOnCanvas(canvas, looseLoopPts(canvas, 0.5, 0.56, 0.15, 0), 14);
          await selectColor('#007AFF'); // blue
          await strokeOnCanvas(canvas, arrowPts(canvas, { x: 0.2, y: 0.2 }, { x: 0.45, y: 0.49 }), 18);
          await sleep(300);
          await closeAnnotateSave();
        }
      }

      // ── Photo 2 — explore TEXT: label the X-ray. ──
      const id2 = await addImageFromGallery(1); // 2.png (implant x-ray)
      if (id2) {
        const canvas = await openAnnotate(id2);
        if (canvas) {
          await selectTool('Text');
          await selectColor('#007AFF');
          await addText(canvas, 0.34, 0.30, 'Implant fixture');
          await selectColor('#34C759'); // green
          await addText(canvas, 0.30, 0.74, 'Bone level');
          await sleep(500);
          // Delete the second label — move to it, hover its × button, then press
          // it deliberately so the removal is clearly seen.
          const lastText = $$('input[placeholder^="Type"]').slice(-1)[0] ?? null;
          if (lastText) { await moveToEl(lastText, 440); await sleep(380); }
          const removeBtns = $$('button[aria-label="Remove text"]');
          const rm = removeBtns[removeBtns.length - 1] ?? null;
          if (rm) {
            await moveToEl(rm, 420);
            await sleep(440); // dwell on the × so the click is clearly seen
            await clickPulse();
            realClick(rm);
            await sleep(650); // pause so the label visibly disappears
          }
          await closeAnnotateSave();
        }
      }

      // ── Photo 3 — explore ERASER, DELETE, UNDO / REDO. ──
      const id3 = await addImageFromGallery(3); // 4.png (healing)
      if (id3) {
        const canvas = await openAnnotate(id3);
        if (canvas) {
          await selectTool('Pen');
          await selectColor('#AF52DE'); // purple — a different colour from the others
          await selectSize(14); // a bolder brush than photo 1 (which used 6) — a real change
          const loop3 = looseLoopPts(canvas, 0.47, 0.5, 0.13, 1);
          await strokeOnCanvas(canvas, loop3, 14);
          await strokeOnCanvas(canvas, arrowPts(canvas, { x: 0.78, y: 0.24 }, { x: 0.57, y: 0.46 }), 18);
          await sleep(550); // let the viewer see both marks
          // Undo both marks (they vanish one by one), then redo them back.
          await clickSel('button[aria-label="Undo"]', 540);
          await clickSel('button[aria-label="Undo"]', 540);
          await sleep(250);
          await clickSel('button[aria-label="Redo"]', 540);
          await clickSel('button[aria-label="Redo"]', 540);
          await sleep(450);
          // Eraser: rub out a section of the circle by running it back & forth
          // ALONG the drawn loop — so a real gap opens up in the mark.
          await selectTool('Eraser');
          await selectSize(28); // a larger eraser — another real size change (was 14 for the pen)
          const arc = loop3.slice(13, 25);
          await strokeOnCanvas(canvas, [...arc, ...arc.slice().reverse()], 44);
          await sleep(550);
          await closeAnnotateSave();
        }
      }

      // Park + fade.
      await moveTo(center(), 460);
      await sleep(300);
      setCursorVisible(false);
      await sleep(250);
    };

    run()
      .then(() => { if (!aborted) onDone(); })
      .catch((e) => { if (e !== ABORT) console.error('[AnnotationDemo]', e); })
      .finally(() => { endGalleryDemo(); });

    return () => {
      aborted = true;
      timers.forEach((id) => clearTimeout(id));
      endGalleryDemo();
      setDrawing(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  if (runId === 0 && !cursorVisible) return null;

  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100000, overflow: 'hidden' }}>
      <style>{`
        @keyframes annotDemoRipple {
          0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 0.45; }
          100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
        }
      `}</style>

      {clicking && (
        <span
          key={clickKey}
          style={{
            position: 'absolute', left: cursor.x, top: cursor.y, width: 24, height: 24,
            borderRadius: '50%', border: '1.5px solid rgba(37, 99, 235, 0.9)',
            background: 'rgba(37, 99, 235, 0.12)', transform: 'translate(-50%, -50%)',
            animation: 'annotDemoRipple 0.42s ease-out forwards',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute', left: cursor.x, top: cursor.y, width: 16, height: 20,
          transform: `translate(-0.9px, -0.9px) scale(${clicking ? 0.85 : 1})`,
          transformOrigin: 'top left',
          transition: drawing
            ? 'opacity 0.3s, transform 0.12s ease'
            : 'left 0.24s cubic-bezier(.45,.05,.2,1), top 0.24s cubic-bezier(.45,.05,.2,1), opacity 0.3s, transform 0.12s ease',
          opacity: cursorVisible ? 1 : 0,
          filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.4))',
        }}
      >
        <svg width="16" height="20" viewBox="0 0 18 22" fill="none">
          <path d="M1 1L1 16L5.5 12L9 20L12 19L8.5 11L14 11L1 1Z" fill="#000000" stroke="#ffffff" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>

      <div
        style={{
          position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          padding: '6px 12px', borderRadius: 999, background: 'rgba(17, 24, 39, 0.82)',
          color: '#fff', fontSize: 12, fontWeight: 500, letterSpacing: 0.2, whiteSpace: 'nowrap',
          opacity: hintVisible ? 1 : 0, transition: 'opacity 0.5s ease',
        }}
      >
        Annotation demo · press Esc to stop
      </div>
    </div>
  );
}
