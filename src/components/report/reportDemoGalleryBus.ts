/**
 * Module-level channel that lets the self-driving report demo reliably drive the
 * image GalleryOverlayModal.
 *
 * Driving the gallery from outside via synthetic DOM clicks proved unreliable in
 * real browsers (the modal's selection state wouldn't register, so the "Add"
 * button stayed disabled and the modal never closed). Instead, when this bus is
 * `active`, the GalleryOverlayModal drives its OWN selection (real React state →
 * the blue selection borders genuinely appear, the Add button genuinely enables)
 * and then confirms + closes itself. The demo overlay only opens the gallery and
 * waits for it to disappear.
 */

export type GalleryBusState = {
  /** Overlay sets true around a gallery interaction, false otherwise. */
  active: boolean;
  /** How many thumbnails the modal should auto-select. */
  selectCount: number;
  /** Index of the first gallery image to select (so each demo slot gets its own
   *  photo instead of always the first). */
  pickIndex: number;
  /** Delay between each auto-selection (ms) so the user sees each highlight. */
  stepMs: number;
  /** Pause after the last selection before confirming (ms). */
  settleMs: number;
  /** Bumped each time a new gallery session starts. */
  session: number;
};

const bus: GalleryBusState = {
  active: false,
  selectCount: 1,
  pickIndex: 0,
  stepMs: 650,
  settleMs: 700,
  session: 0,
};

export function getGalleryBus(): GalleryBusState {
  return bus;
}

/** Arm the bus right before opening a gallery so the modal self-drives on mount. */
export function startGallerySession(opts?: {
  selectCount?: number;
  pickIndex?: number;
  stepMs?: number;
  settleMs?: number;
}): number {
  bus.active = true;
  bus.selectCount = opts?.selectCount ?? 1;
  bus.pickIndex = opts?.pickIndex ?? 0;
  if (opts?.stepMs != null) bus.stepMs = opts.stepMs;
  if (opts?.settleMs != null) bus.settleMs = opts.settleMs;
  bus.session += 1;
  return bus.session;
}

/** Disarm the bus — must be called after each session and on demo teardown. */
export function endGalleryDemo(): void {
  bus.active = false;
}

export function isGalleryDemoActive(): boolean {
  return bus.active;
}
