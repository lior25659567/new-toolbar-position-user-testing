import { useEffect, useState } from 'react';
import type { PatientReportPageHandle } from '../PatientReportPage';
import { startGallerySession, endGalleryDemo } from './reportDemoGalleryBus';

/**
 * Self-driving demo for the Patient Report page.
 *
 * Pressing "r" on the report page plays a hands-off, realistic end-to-end
 * session: fill the patient details, browse + apply templates (scrolling the
 * report top→bottom for each), build a complete report (real gallery photos,
 * teeth, notes, appointment, a closing summary), then sign, preview and share.
 *
 * The image gallery is driven by the modal ITSELF (via reportDemoGalleryBus) so
 * the selection is genuinely visible and it confirms + closes reliably — the
 * overlay just opens it and waits. Everything else is driven through the page's
 * imperative handle + a fake cursor. The overlay never intercepts pointer events.
 */

type XY = { x: number; y: number };
type DemoBlock = { id: string; type: string; collapsed?: boolean; [k: string]: unknown };

interface Props {
  pageRef: React.RefObject<PatientReportPageHandle | null>;
  /** 0 = idle. Any non-zero value (re)starts the demo; changing it restarts. */
  runId: number;
  onDone: () => void;
  /** Live playback rate (1× = authored pace). Picked up on the next wait. */
  speedRef?: React.MutableRefObject<number>;
}

const ABORT = Symbol('demo-abort');
const PATIENT = { patientName: 'Sarah Chen', birthDate: '03/15/1985', chartNumber: 'A-2048' };

export default function ReportDemoOverlay({ pageRef, runId, onDone, speedRef }: Props) {
  const [cursor, setCursor] = useState<XY>({ x: -200, y: -200 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [clickKey, setClickKey] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  // While drawing the signature, drop the cursor's easing so it tracks the pen.
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

    // Global pacing — <1 makes the whole demo proportionally faster.
    const SPEED = 0.6;
    const sleep = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          aborted ? reject(ABORT) : resolve();
        }, ms * SPEED / (speedRef?.current ?? 1));
        timers.add(id);
      });
    const ensure = () => {
      if (aborted) throw ABORT;
    };

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
    // Wait until an element stops moving on screen (smooth-scroll settled) so the
    // fake cursor lands on it accurately instead of where it was mid-scroll.
    const rectStable = async (el: Element | null, tries = 16) => {
      if (!el) return;
      let last = el.getBoundingClientRect().top;
      for (let k = 0; k < tries; k++) {
        await sleep(70);
        const t = el.getBoundingClientRect().top;
        if (Math.abs(t - last) < 0.5) return;
        last = t;
      }
    };
    // Continuous (60fps) eased scroll — smooth, not the steppy scrollTo+sleep loop.
    const smoothScroll = (el: HTMLElement, to: number, duration: number) =>
      new Promise<void>((resolve) => {
        const startTop = el.scrollTop;
        const dist = to - startTop;
        if (Math.abs(dist) < 1) { resolve(); return; }
        const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
        let startTime = 0;
        const tick = (now: number) => {
          if (aborted) { resolve(); return; }
          if (!startTime) startTime = now;
          const p = Math.min(1, (now - startTime) / duration);
          el.scrollTop = startTop + dist * easeInOut(p);
          if (p < 1) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });

    // ── Cursor motion ──
    const MOVE = 420;
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
    const clickSel = async (sel: string, settle = 360) => {
      const el = $(sel);
      await moveToEl(el);
      await clickPulse();
      realClick(el);
      await sleep(settle);
    };
    const clickEl = async (el: Element | null, settle = 360) => {
      await moveToEl(el);
      await clickPulse();
      realClick(el);
      await sleep(settle);
    };
    const pollFor = async (sel: string, tries = 45): Promise<Element | null> => {
      for (let k = 0; k < tries; k++) {
        ensure();
        const el = $(sel);
        if (el) return el;
        await sleep(80);
      }
      return null;
    };

    const getBlocks = () => (pageRef.current?.getBlocks() ?? []) as unknown as DemoBlock[];
    const setBlocks = (next: DemoBlock[]) => {
      const fn = pageRef.current?.setBlocks as ((b: unknown) => void) | undefined;
      fn?.(next);
    };
    const patchBlock = (id: string, patch: Record<string, unknown>) =>
      setBlocks(getBlocks().map((b) => (b.id === id ? { ...b, ...patch } : b)));

    const openTemplates = async () => {
      await moveToSel('[data-demo="templates-toggle"]');
      await clickPulse();
      pageRef.current?.setTemplatesPanelOpen(true);
      await sleep(320);
    };
    const applyTemplate = async (id: string, dwell: number) => {
      await openTemplates();
      await clickSel(`[data-demo="template-card-${id}"]`, 480);
      await sleep(dwell);
    };

    // Scroll the report top→bottom→top so the viewer sees a template's full shape.
    const scrollThroughReport = async () => {
      const el = pageRef.current?.getEditorEl();
      if (!el) { await sleep(400); return; }
      el.scrollTo({ top: 0, behavior: 'smooth' });
      await sleep(450);
      pageRef.current?.scrollEditorToBottom();
      await sleep(900);
      el.scrollTo({ top: 0, behavior: 'smooth' });
      await sleep(500);
    };

    // Type into a block field, character by character.
    const typeField = async (
      blockId: string,
      inputSel: string,
      text: string,
      patch: (v: string) => Record<string, unknown>,
    ) => {
      scrollToEl($(`[data-block-id="${blockId}"]`));
      pageRef.current?.setActiveBlock(blockId);
      await sleep(360);
      const card = $(`[data-block-id="${blockId}"]`);
      const input = card?.querySelector(inputSel) ?? card;
      if (input) {
        const r = (input as Element).getBoundingClientRect();
        await moveTo({ x: r.left + Math.min(48, r.width / 2), y: r.top + Math.min(20, r.height / 2) });
        realClick(input as Element);
      }
      for (let i = 1; i <= text.length; i++) {
        ensure();
        patchBlock(blockId, patch(text.slice(0, i)));
        const ch = text[i - 1];
        const base = ch === ' ' || ch === '.' || ch === ',' || ch === '—' ? 60 : 20;
        await sleep(base + ((i * 31) % 34));
      }
      await sleep(300);
    };

    // Type into a REAL controlled input: focus it (so its focus state shows),
    // then dispatch per-character native input events so React's own onChange
    // fires — i.e. the demo uses the actual component and its live state.
    const nativeSet = (el: HTMLInputElement | HTMLTextAreaElement, value: string) => {
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      desc?.set?.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const typeIntoInput = async (el: Element | null, text: string, perChar = 50) => {
      if (!el) return;
      const input = el as HTMLInputElement;
      input.focus?.(); // real focus → onFocus → focus underline
      await sleep(200);
      nativeSet(input, ''); // clear the existing/placeholder value first
      await sleep(140);
      for (let i = 1; i <= text.length; i++) {
        ensure();
        nativeSet(input, text.slice(0, i));
        const ch = text[i - 1];
        await sleep((ch === ' ' || ch === '-' ? perChar + 35 : perChar) + ((i * 23) % 28));
      }
      await sleep(280);
      input.blur?.();
      await sleep(150);
    };

    // Fill the patient details using the real header inputs.
    const typePatient = async () => {
      const nameEl = $('[data-demo="patient-name"]');
      if (nameEl) { scrollToEl(nameEl); await sleep(250); await moveToEl(nameEl, 520); await clickPulse(); }
      await typeIntoInput(nameEl, PATIENT.patientName, 55);
      await sleep(250);
      const chartEl = $('[data-demo="chart-number"]');
      if (chartEl) { await moveToEl(chartEl, 480); await clickPulse(); }
      await typeIntoInput(chartEl, PATIENT.chartNumber, 70);
      await sleep(350);
    };

    // ── Reliable gallery (the modal self-drives via the bus) ──
    const galleryDialogSel = 'div[role="dialog"][aria-labelledby="gallery-modal-title"]';
    const isGalleryOpen = () => !!$(galleryDialogSel);

    // Open a gallery from a given "Choose from gallery" element and let the modal
    // self-select the image at `pickIndex` + confirm + close (the overlay only
    // drifts the cursor onto that thumbnail for show).
    const driveGallery = async (chooser: Element | null, pickIndex = 0) => {
      if (!chooser) return;
      startGallerySession({ selectCount: 1, pickIndex, stepMs: 360, settleMs: 360 });
      await moveToEl(chooser, 500);
      await clickPulse();
      realClick(chooser);
      await pollFor(galleryDialogSel, 40);
      const thumbs = $$('[data-demo^="gallery-"]').filter((e) => e.getAttribute('data-demo') !== 'gallery-add-btn');
      const thumb = thumbs[pickIndex] ?? thumbs[0] ?? null; // drift to the photo being chosen
      if (thumb) await moveToEl(thumb, 520);
      const addBtn = $('[data-demo="gallery-add-btn"]');
      if (addBtn) await moveToEl(addBtn, 460);
      for (let k = 0; k < 70 && isGalleryOpen(); k++) await sleep(120);
      if (isGalleryOpen()) {
        pageRef.current?.clickInPage(`${galleryDialogSel} button[aria-label="Close"]`);
        for (let k = 0; k < 20 && isGalleryOpen(); k++) await sleep(120);
      }
      endGalleryDemo();
      await sleep(350);
    };

    const fillImageViaGallery = async (cardId: string, pickIndex = 0) => {
      const card = $(`[data-block-id="${cardId}"]`);
      if (!card) return;
      scrollToEl(card);
      pageRef.current?.setActiveBlock(cardId);
      await sleep(420);
      await driveGallery($(`[data-block-id="${cardId}"] [data-demo="choose-from-gallery"]`), pickIndex);
    };

    const buildImages = async (): Promise<string[]> => {
      const imgs = getBlocks().filter((b) => b.type === 'image').slice(0, 2);
      // Pre-operative scan → image 0 (1.png); Implant planning view → image 1 (2.png).
      if (imgs[0]) await fillImageViaGallery(imgs[0].id, 0);
      if (imgs[1]) await fillImageViaGallery(imgs[1].id, 1);
      return getBlocks().filter((b) => b.type === 'image').map((b) => b.id);
    };

    // Insert a more complex block (Before/After) BETWEEN two existing blocks,
    // then fill it with two gallery photos + a comparison note.
    const insertComplicatedBlock = async () => {
      const ib = $('[data-demo="insert-between-1"]');
      if (!ib) return;
      scrollToEl(ib);
      await sleep(350);
      // Click the "+" directly (it's always mounted) WITHOUT setting the slot's
      // hover state, so the slot's only "visible" driver is the menu's open
      // state — which reliably collapses again once a block is chosen.
      const r = ib.getBoundingClientRect();
      await moveTo({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      await clickPulse();
      realClick(ib); // opens the insert menu — the "+" + divider lines appear
      await sleep(350);
      for (const t of ['add-block-image', 'add-block-rx', 'add-block-comparison']) {
        await moveToSel(`[data-demo="${t}"]`, 250);
      }
      await clickSel('[data-demo="add-block-comparison"]', 550); // inserts the Before/After block
      // The insert menu can linger open; click its backdrop to guarantee it
      // closes so the "+" slot collapses again.
      pageRef.current?.clickInPage('[data-demo="addmenu-backdrop"]');
      await sleep(450);
      const comp = getBlocks().find((b) => b.type === 'comparison');
      if (!comp) return;
      scrollToEl($(`[data-block-id="${comp.id}"]`));
      pageRef.current?.setActiveBlock(comp.id);
      await sleep(450);
      // Before image, then After image (re-query — the first upload zone is
      // replaced by the image once it's filled).
      let choosers = $$(`[data-block-id="${comp.id}"] [data-demo="choose-from-gallery"]`);
      await driveGallery(choosers[0] ?? null, 2); // Before → image 2 (3.png, implant placed)
      await sleep(300);
      choosers = $$(`[data-block-id="${comp.id}"] [data-demo="choose-from-gallery"]`);
      await driveGallery(choosers[0] ?? null, 3); // After → image 3 (4.png, healed)
      await sleep(300);
      await typeField(comp.id, 'textarea', 'Marked tissue healing and bone fill at the 3-month review.', (v) => ({ notes: v }));
    };

    // Add a Prescription block from the palette and fill its medication row.
    const addPrescription = async () => {
      await clickSel('[data-demo="add-block-trigger"]', 380);
      for (const t of ['add-block-cost-summary', 'add-block-notes', 'add-block-rx']) {
        await moveToSel(`[data-demo="${t}"]`, 220);
      }
      await clickSel('[data-demo="add-block-rx"]', 450);
      pageRef.current?.clickInPage('[data-demo="addmenu-backdrop"]');
      await sleep(450);
      const blocks = getBlocks();
      const rx = blocks[blocks.length - 1];
      if (!rx || rx.type !== 'rx') return;
      const cardSel = `[data-block-id="${rx.id}"]`;
      scrollToEl($(cardSel));
      pageRef.current?.setActiveBlock(rx.id);
      await sleep(400);
      const fill = async (sel: string, text: string, perChar = 45) => {
        const inp = $(`${cardSel} ${sel}`);
        if (inp) { await moveToEl(inp, 440); await clickPulse(); }
        await typeIntoInput(inp, text, perChar);
        await sleep(150);
      };
      await fill('input[placeholder="Medication name"]', 'Chlorhexidine 0.12%', 40);
      await fill('input[placeholder^="e.g. 500"]', '15 mL', 55);
      await fill('input[placeholder^="e.g. 3x"]', '2x daily', 50);
      await fill('input[placeholder^="e.g. 7"]', '14 days', 55);
      await fill('textarea', 'Rinse for 30 seconds after brushing. Do not swallow.', 24);
    };

    // Add the final post-treatment image (the new crown) as the last block.
    const addFinalCrownImage = async () => {
      await clickSel('[data-demo="add-block-trigger"]', 380);
      for (const t of ['add-block-comparison', 'add-block-notes', 'add-block-image']) {
        await moveToSel(`[data-demo="${t}"]`, 220);
      }
      await clickSel('[data-demo="add-block-image"]', 450);
      pageRef.current?.clickInPage('[data-demo="addmenu-backdrop"]');
      await sleep(450);
      const blocks = getBlocks();
      const img = blocks[blocks.length - 1];
      if (!img || img.type !== 'image') return;
      const cardSel = `[data-block-id="${img.id}"]`;
      scrollToEl($(cardSel));
      pageRef.current?.setActiveBlock(img.id);
      await sleep(400);
      await driveGallery($(`${cardSel} [data-demo="choose-from-gallery"]`), 4); // image 4 (5.png, final crown)
      await typeField(img.id, 'input[placeholder="Image title"]', 'Final result — new crown', (v) => ({ title: v }));
      await typeField(img.id, 'textarea', 'Definitive crown seated. Occlusion and contacts verified.', (v) => ({ notes: v }));
    };

    // Fill the Post-Surgical Instructions block — start it EMPTY (clear the
    // template's pre-fill) and type the title + steps so it's seen being filled.
    const fillPostSurgicalInstructions = async () => {
      const pi = getBlocks().find((b) => b.type === 'patient-instructions');
      if (!pi) return;
      const cardSel = `[data-block-id="${pi.id}"]`;
      patchBlock(pi.id, { title: '', items: [{ id: 'demo-pi-0', text: '' }] }); // empty, not pre-filled
      await sleep(250);
      scrollToEl($(cardSel));
      pageRef.current?.setActiveBlock(pi.id);
      await sleep(300);
      await rectStable($(cardSel));
      const titleEl = $(`${cardSel} input[placeholder^="e.g. Post-Treatment"]`);
      if (titleEl) { await moveToEl(titleEl, 460); await clickPulse(); }
      await typeIntoInput(titleEl, 'Post-Surgical Instructions', 38);
      await sleep(200);
      const steps = [
        'Apply ice packs 20 min on / 20 min off for the first 24 hours',
        'Eat soft foods; avoid chewing on the surgical site',
        'Do not rinse, spit, or use a straw for 24 hours',
      ];
      for (let i = 0; i < steps.length; i++) {
        ensure();
        if (i > 0) {
          const addBtn = $$(`${cardSel} button`).find((b) => (b.textContent || '').includes('Add instruction')) ?? null;
          if (addBtn) { await moveToEl(addBtn, 420); await clickPulse(); realClick(addBtn); await sleep(300); }
        }
        const rows = $$(`${cardSel} input[placeholder="Instruction step..."]`);
        const inp = rows[rows.length - 1] ?? null; // newest (empty) row
        if (inp) { await moveToEl(inp, 420); await clickPulse(); }
        await typeIntoInput(inp, steps[i], 20);
        await sleep(120);
      }
      await sleep(250);
    };

    // Open the tooth chart and visibly click a few teeth.
    const pickTeeth = async (cardId: string, count = 3) => {
      pageRef.current?.setActiveBlock(cardId);
      const addBtn = $(`[data-block-id="${cardId}"] [data-demo="tooth-add"]`);
      scrollToEl(addBtn ?? $(`[data-block-id="${cardId}"]`));
      await sleep(250);
      await rectStable(addBtn); // wait for the scroll to settle before placing the cursor
      // Deliberately move to + press the "Add teeth" button so it's clearly seen
      // hovering/clicking before the tooth chart opens.
      if (addBtn) {
        await moveToEl(addBtn, 560); // cursor arrives → button highlights
        await sleep(450); // hold on the highlighted button
        await clickPulse();
        realClick(addBtn); // opens the tooth chart
        await sleep(450);
      }
      const svg = $('g[data-demo^="tooth-"]')?.closest('svg') ?? null;
      scrollToEl(svg);
      await sleep(250);
      await rectStable(svg); // chart settled before clicking teeth
      await sleep(150);
      const teeth = $$('g[data-demo^="tooth-"]');
      for (const idx of [4, 6, 8, 10].slice(0, count)) {
        const g = teeth[idx];
        if (!g) continue;
        await moveToEl(g, 380);
        await clickPulse();
        realClick(g);
        await sleep(420);
      }
      const done = $$('button').find((b) => b.textContent?.trim() === 'Done') ?? null;
      if (done) await clickEl(done, 420);
    };

    // Fill the next appointment: date + time (pickers, set reliably) and
    // procedure + pre-visit instructions (typed into the real inputs).
    const fillAppointment = async () => {
      const appt = getBlocks().find((b) => b.type === 'next-appointment');
      if (!appt) return;
      const cardSel = `[data-block-id="${appt.id}"]`;
      scrollToEl($(cardSel));
      pageRef.current?.setActiveBlock(appt.id);
      await sleep(450);

      // DATE — open the real date picker, advance a month, click a day.
      const dateBtn = $(`${cardSel} button:not([aria-haspopup="listbox"]):not([aria-expanded])`);
      if (dateBtn) {
        await moveToEl(dateBtn, 480);
        await clickPulse();
        realClick(dateBtn);
        await pollFor('[aria-label="Next month"]', 25);
        await sleep(400);
        await clickSel('[aria-label="Next month"]', 350); // go to next month
        await sleep(250);
        const day = $('[data-demo="cal-day-15"]');
        if (day) { await moveToEl(day, 420); await clickPulse(); realClick(day); }
        await sleep(450);
      }

      // TIME — open the real dropdown, click a slot.
      const timeBtn = $(`${cardSel} button[aria-haspopup="listbox"]`);
      if (timeBtn) {
        await moveToEl(timeBtn, 460);
        await clickPulse();
        realClick(timeBtn);
        await pollFor('li[role="option"]', 25);
        await sleep(350);
        const opt = $$('li[role="option"]').find((li) => li.textContent?.trim() === '10:00 AM') ?? $$('li[role="option"]')[4] ?? null;
        if (opt) { await moveToEl(opt, 420); await clickPulse(); realClick(opt); }
        await sleep(450);
      }

      // PROCEDURE + PRE-VISIT INSTRUCTIONS — typed into the real inputs.
      const procEl = $(`${cardSel} input[placeholder^="e.g. Post-op"]`);
      if (procEl) { await moveToEl(procEl, 460); await clickPulse(); }
      await typeIntoInput(procEl, 'Implant placement & abutment fitting', 38);
      await sleep(250);
      const insEl = $(`${cardSel} textarea`);
      if (insEl) { await moveToEl(insEl, 460); await clickPulse(); }
      await typeIntoInput(insEl, 'Avoid eating 6 hours before. Arrange a ride home after surgery.', 28);
      await sleep(300);
    };

    // Hand-drawn cursive "Dr. Smith" signature, authored as bezier strokes in a
    // 760x300 space (baseline ~190). Black ink — the same path the demo inks live
    // on the signature pad.
    const SIG_INK = '#111111';
    const SIG_CURVES: { start: number[]; segs: number[][] }[] = [
      { start: [55, 190], segs: [[38, 140, 48, 70, 82, 62], [120, 55, 140, 95, 128, 128], [118, 160, 92, 196, 62, 188], [78, 176, 108, 165, 118, 140], [126, 120, 150, 118, 156, 132], [160, 142, 160, 165, 162, 190]] }, // Dr
      { start: [300, 86], segs: [[280, 56, 232, 60, 236, 98], [239, 124, 288, 120, 296, 148], [302, 176, 278, 200, 242, 190], [262, 182, 300, 168, 308, 140], [314, 120, 338, 118, 344, 140], [348, 156, 348, 178, 350, 190], [352, 165, 372, 120, 382, 142], [388, 156, 388, 178, 390, 190], [396, 168, 406, 128, 414, 134], [420, 150, 420, 176, 422, 190], [430, 160, 452, 80, 466, 62], [472, 82, 472, 160, 474, 190], [482, 160, 506, 70, 516, 58], [526, 66, 516, 110, 512, 140], [508, 168, 508, 182, 510, 190], [516, 162, 540, 120, 552, 140], [560, 156, 560, 178, 562, 190], [600, 176, 660, 196, 740, 168]] }, // Smith + tail
    ];
    const SIG_DOTS = [[192, 186], [414, 108]]; // period after "Dr", dot over the "i"
    const SIG_CROSS = [[440, 118], [486, 112]]; // the "t" cross-bar
    const SIG_OFFX = 42;
    const SIG_OFFY = 44;
    const makeSignatureDataUrl = (): string => {
      const c = document.createElement('canvas');
      c.width = 720;
      c.height = 180;
      const ctx = c.getContext('2d');
      if (!ctx) return '';
      ctx.strokeStyle = SIG_INK;
      ctx.fillStyle = SIG_INK;
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const ox = SIG_OFFX, oy = SIG_OFFY;
      for (const cv of SIG_CURVES) {
        ctx.beginPath();
        ctx.moveTo(cv.start[0] - ox, cv.start[1] - oy);
        for (const s of cv.segs) ctx.bezierCurveTo(s[0] - ox, s[1] - oy, s[2] - ox, s[3] - oy, s[4] - ox, s[5] - oy);
        ctx.stroke();
      }
      for (const d of SIG_DOTS) { ctx.beginPath(); ctx.arc(d[0] - ox, d[1] - oy, 3.1, 0, Math.PI * 2); ctx.fill(); }
      ctx.beginPath();
      ctx.moveTo(SIG_CROSS[0][0] - ox, SIG_CROSS[0][1] - oy);
      ctx.lineTo(SIG_CROSS[1][0] - ox, SIG_CROSS[1][1] - oy);
      ctx.stroke();
      return c.toDataURL('image/png');
    };

    const signReport = async () => {
      const line = $('[data-demo="signature-line"]');
      if (line) {
        scrollToEl(line);
        await sleep(400);
        await moveToEl(line, 520);
        await clickPulse();
        realClick(line);
      }
      await pollFor('[data-demo="signature-tab-draw"]', 30);
      await sleep(450);

      // Ink "Dr. Smith" onto the pad stroke-by-stroke (dispatched mouse events on
      // the canvas's native listeners), so the user sees it being signed by hand.
      const canvas = (await pollFor('canvas[aria-label="Signature drawing area"]', 30)) as HTMLCanvasElement | null;
      if (canvas) {
        const cw = canvas.width, ch = canvas.height; // 760 x 300 (path space)
        const rect = canvas.getBoundingClientRect();
        const sx = rect.width / cw, sy = rect.height / ch;
        const scr = (p: number[]): XY => ({ x: rect.left + p[0] * sx, y: rect.top + p[1] * sy });
        const bez = (p0: number[], s: number[], n: number): number[][] => {
          const out: number[][] = [];
          for (let i = 1; i <= n; i++) {
            const t = i / n, mt = 1 - t;
            out.push([
              mt * mt * mt * p0[0] + 3 * mt * mt * t * s[0] + 3 * mt * t * t * s[2] + t * t * t * s[4],
              mt * mt * mt * p0[1] + 3 * mt * mt * t * s[1] + 3 * mt * t * t * s[3] + t * t * t * s[5],
            ]);
          }
          return out;
        };
        const sampleCurve = (cv: { start: number[]; segs: number[][] }): number[][] => {
          const pts = [cv.start.slice()];
          let cur = cv.start;
          for (const s of cv.segs) { pts.push(...bez(cur, s, 10)); cur = [s[4], s[5]]; }
          return pts;
        };
        const dotStroke = (d: number[]): number[][] =>
          [[d[0], d[1] - 2], [d[0] + 2, d[1]], [d[0], d[1] + 2], [d[0] - 2, d[1]], [d[0], d[1] - 2]];
        // Natural signing order: Dr, period, Smith+tail, i-dot, t-cross.
        const strokes: number[][][] = [
          sampleCurve(SIG_CURVES[0]),
          dotStroke(SIG_DOTS[0]),
          sampleCurve(SIG_CURVES[1]),
          dotStroke(SIG_DOTS[1]),
          [SIG_CROSS[0], SIG_CROSS[1]],
        ];
        const inkAt = (type: string, p: XY) =>
          canvas.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window, clientX: p.x, clientY: p.y }));
        setDrawing(true); // cursor tracks the pen without easing
        setCursorVisible(true);
        for (const stroke of strokes) {
          ensure();
          const a = scr(stroke[0]);
          setCursor(a);
          await sleep(90);
          inkAt('mousedown', a);
          const step = stroke.length > 12 ? 13 : 55; // long curves fast, dots/cross slower
          for (let i = 1; i < stroke.length; i++) {
            ensure();
            const p = scr(stroke[i]);
            inkAt('mousemove', p);
            setCursor(p);
            await sleep(step);
          }
          inkAt('mouseup', scr(stroke[stroke.length - 1]));
          await sleep(110);
        }
        setDrawing(false);
        await sleep(450);
      }

      // Put the crisp "Dr. Smith" signature on the report, then close the pad.
      pageRef.current?.setSignature(makeSignatureDataUrl(), 'draw');
      await sleep(500);
      pageRef.current?.clickInPage('.modal-close');
      await sleep(450);
    };

    const doPreview = async () => {
      const btn = $('[data-demo="preview"]');
      if (btn) {
        await moveToEl(btn, 520);
        await clickPulse();
        realClick(btn);
      }
      await pollFor('[data-demo="preview-scroll"]', 30);
      await sleep(900); // take in the top of the report
      const scroller = $('[data-demo="preview-scroll"]') as HTMLElement | null;
      if (scroller) {
        // Smooth, continuous scroll down through the whole report, then back up.
        const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
        await smoothScroll(scroller, max, 3600);
        await sleep(700);
        await smoothScroll(scroller, 0, 1400);
      } else {
        await sleep(1500);
      }
      pageRef.current?.clickInPage('button[aria-label="Close preview"]');
      await sleep(600);
    };

    const doShare = async () => {
      const btn = $('[data-demo="share"]');
      if (btn) {
        await moveToEl(btn, 520);
        await clickPulse();
        realClick(btn);
      }
      const ok = await pollFor('[data-demo="share-qr"]', 30); // signature already set → Share opens
      if (!ok) { await sleep(400); return; }
      await sleep(450);
      await clickSel('[data-demo="share-qr"]', 700); // reveal the QR
      await sleep(1500);
      await moveToSel('[data-demo="share-download"]', 420);
      await sleep(300);
      pageRef.current?.clickInPage('.modal-close'); // close the share modal
      await sleep(500);
    };

    // ── Script ──
    const run = async () => {
      const h = pageRef.current;
      if (!h) return;

      setCursorVisible(true);
      setHintVisible(true);
      window.setTimeout(() => { if (!aborted) setHintVisible(false); }, 2400);

      // 0 · Reset to a blank report — clears blocks, patient name and signature
      //     back to empty placeholders (keeps the clinic logo/name).
      h.resetReport();
      await moveTo(center(), 280);
      await sleep(450);

      // 1 · Fill the patient details first (a real user starts here).
      await typePatient();

      // 2 · Browse all five templates, then apply EACH and scroll top→bottom
      //     through it so the viewer sees its full structure. End on Implant.
      await openTemplates();
      for (const id of ['scratch', 'general', 'implant', 'crown', 'followup']) {
        await moveToSel(`[data-demo="template-card-${id}"]`, 200);
      }
      await sleep(120);
      for (const id of ['general', 'crown', 'followup', 'implant']) {
        await applyTemplate(id, 380);
        await scrollThroughReport();
      }

      // 3 · Build the report.
      const imgIds = await buildImages(); // reliable gallery photos
      if (imgIds[0]) {
        await pickTeeth(imgIds[0], 3);
        await typeField(imgIds[0], 'textarea', 'Edentulous space #19 — adequate ridge height for placement.', (v) => ({ notes: v }));
      }
      if (imgIds[1]) {
        await typeField(imgIds[1], 'textarea', 'Implant position planned with a surgical guide.', (v) => ({ notes: v }));
      }

      // Fill the post-surgical instructions (starts empty → typed in).
      await fillPostSurgicalInstructions();

      await fillAppointment();

      // Add a prescription and fill it.
      await addPrescription();

      // Insert a Before/After comparison between blocks and fill it.
      await insertComplicatedBlock();

      // Add the final post-treatment image (the new crown) as the last block.
      await addFinalCrownImage();

      // 4 · Sign → Preview → Share.
      await signReport();
      await doPreview();
      await doShare();

      // 5 · Park + fade out.
      await moveTo(center(), 500);
      await sleep(300);
      setCursorVisible(false);
      await sleep(250);
    };

    run()
      .then(() => { if (!aborted) onDone(); })
      .catch((e) => { if (e !== ABORT) console.error('[ReportDemo]', e); })
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
    <div
      aria-hidden
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100000, overflow: 'hidden' }}
    >
      <style>{`
        @keyframes reportDemoRipple {
          0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 0.45; }
          100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
        }
      `}</style>

      {clicking && (
        <span
          key={clickKey}
          style={{
            position: 'absolute',
            left: cursor.x,
            top: cursor.y,
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '1.5px solid rgba(37, 99, 235, 0.9)',
            background: 'rgba(37, 99, 235, 0.12)',
            transform: 'translate(-50%, -50%)',
            animation: 'reportDemoRipple 0.42s ease-out forwards',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          left: cursor.x,
          top: cursor.y,
          // Real OS pointer size: ~16x20px visible arrow at standard DPI.
          width: 16,
          height: 20,
          // Keep the arrow TIP (svg 0 0 18 22 → point ~1,1) on the hotspot (cursor.x/y).
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
          <path
            d="M1 1L1 16L5.5 12L9 20L12 19L8.5 11L14 11L1 1Z"
            fill="#000000"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '6px 12px',
          borderRadius: 999,
          background: 'rgba(17, 24, 39, 0.82)',
          color: '#fff',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: 0.2,
          whiteSpace: 'nowrap',
          opacity: hintVisible ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        Auto demo playing · press Esc to stop
      </div>
    </div>
  );
}
