# Dentures Flow — Info-Page Demo

**Date:** 2026-06-14
**Workspace:** `~/Developer/new-toolbar-position-user-testing` (the live workspace; the `~/Documents` copy is stale)

## Goal

Add a new, separate self-driving demo card to the demo hub for the **info page**, sitting
right after the existing "Fixed Restorative Flow" demo. It reuses the same patient
search/create opening, but the procedure sequence ends on **Dentures**, which gets fully
filled out (arch, type, stage, mould, shades, scan options, notes).

## Context

- The demo hub lives in `src/components/demo/DemoPage.tsx`. Demos are listed in the `DEMOS`
  array (`DemoMeta[]`), keyed by a `DemoId` union, and routed via `activeDemo === '<id>'`
  branches in the default-exported `DemoPage` component.
- The existing info demo is `InfoFlowDemo` (the "Fixed Restorative Flow" card,
  id `info-fixed-restorative`). It is a self-driving, cursor-animated walkthrough that
  drives the **real** `InfoStickyLayout` (info page "Option 5", case-summary panel hidden)
  by dispatching synthetic DOM events on real components.
- The walkthrough engine is a single `useEffect` keyed on `runId` containing DOM/cursor
  helpers (`$`, `$$`, `byText`, `moveTo`, `clickEl`, `pollFor`, `pollText`, `typeInto`,
  `pickDropdown`, `showProcedure`, `addNote`) and an async `run()` script. Cancellation is
  handled by an `aborted` flag + `INFO_ABORT` reject + cleared timers on unmount/restart.
- Dentures config (`src/info/components/ConfigSection/DenturesConfig.tsx`) reuses the shared
  `DueDateSendTo` (already driven via `[data-demo="due-send"]`) and `NotesField`
  (`input[placeholder="Progress notes here"]` + `button[aria-label="Send note"]`), so the
  due/send, and notes machinery is reusable as-is. Its Arch radios and six dropdowns
  currently have **no** `data-demo` hooks.

## Approach

**Clone `InfoFlowDemo` into a new `InfoDenturesDemo` component** (Approach A — lowest risk,
keeps each script readable end-to-end, does not touch the working Fixed Restorative demo).
Rejected: extracting shared helpers (refactors working code) and a single `variant`-prop
component (messy conditionals). A shared-helper extraction is a reasonable later cleanup if
a third info demo appears.

## Changes

### 1. `src/components/demo/DemoPage.tsx`

- **New component `InfoDenturesDemo({ onBack })`** — a copy of `InfoFlowDemo`'s shell: the
  same `useInfoState`, cursor/click/type/dropdown helpers, transport bar (Back, Restart,
  label, Playing/Done), and the same `InfoStickyLayout` render with the summary hidden.
  Only the `run()` script differs (see below).
- **`DemoId` union** — add `'info-dentures'`.
- **`DEMOS` array** — add a new entry immediately **after** the `info-fixed-restorative`
  entry:
  - `id: 'info-dentures'`
  - `title: 'Dentures Flow'`
  - `description`: patient search/create, browsing Fixed Restorative → Implant Planning,
    then a fully configured Dentures case (arch, type, stage, mould, shades, scan options,
    notes).
  - `badge`: e.g. `'Implant → Dentures'`
  - `icon`: a denture/arch SVG (distinct from the Fixed Restorative tooth icon).
- **Routing** — add an `activeDemo === 'info-dentures'` branch rendering `InfoDenturesDemo`
  inside the same page wrapper used by the other info demo.

### 2. `src/info/components/ConfigSection/DenturesConfig.tsx`

Add `data-demo` hooks for reliable scripting (mirroring `FixedRestorativeConfig`):

- Arch radios: `data-demo="arch-upper"`, `arch-lower`, `arch-both` (on each `RadioItem` or
  its label wrapper).
- The six dropdowns (on each `DropdownList` wrapper): `data-demo="dent-type"`,
  `dent-stage`, `dent-mould`, `dent-shade-system`, `dent-teeth-shade`, `dent-gingival`.

(Implementation detail: confirm `DropdownList` forwards/accepts a wrapper hook; if not, wrap
each in a `<div data-demo="...">`.)

## The `run()` script (data flow)

1. **Patient** — identical to the existing Fixed Restorative demo:
   `RESET` → sort the patient list by Date of birth → search `"Smith"` → pick John Smith →
   realize it's wrong → reopen the picker → **+ New patient** → create **Maya Okafor**,
   gender female, pick DOB → Save Patient.
2. **Procedure browse** — `showProcedure('Fixed Restorative')` (preview) →
   `showProcedure('Implant Planning')` (preview) → `showProcedure('Dentures')` (settle).
3. **Fill Dentures**:
   - Lab via `[data-demo="due-send"] button[aria-haspopup="listbox"]` → "Premier Dental Lab".
   - Due date via `[data-demo="due-send"] button:not([aria-haspopup="listbox"])` → next
     month, day 20.
   - Arch → **Both** (`[data-demo="arch-both"]`).
   - `dent-type`, `dent-stage`, `dent-mould`, `dent-shade-system`, then `dent-teeth-shade`
     (depends on shade system), `dent-gingival` — each via `pickDropdown` with concrete
     option text from `DENTURE_TYPES` / `DENTURE_STAGES` / `DENTURE_MOULDS` /
     `SHADE_SYSTEMS` / `SHADE_OPTIONS`.
   - Scan options — toggle the dentures scan-option labels (exact text confirmed against
     `ScanOptionsCheckboxes` for `procedure="dentures"`).
   - Notes — add 2–3 notes via the real notes input (`addNote` helper), describing the
     denture case (arch, type, stage, shade).
4. **Finish** — set label "Flow complete — ready to scan.", park the cursor, hide it.

## Error handling

Same model as the existing demo: every interaction uses `pollFor`/`pollText` with retries;
the `ensure()` guard throws `INFO_ABORT` when `aborted`; the effect cleanup sets `aborted`
and clears all pending timers so Restart and unmount cancel cleanly. Missing optional
elements degrade to a short `sleep` rather than throwing.

## Testing

Visual, matching how the Fixed Restorative demo is validated: run the dev app, open the
"Dentures Flow" demo card, and watch the cursor drive the real Option-5 layout from patient
search through a fully configured Dentures case to "Flow complete". Confirm Restart re-runs
cleanly and Back returns to the hub.

## Out of scope

- Refactoring `InfoFlowDemo` or extracting shared demo helpers.
- Changes to any other demo, to the info wizard's non-demo behavior, or to procedures other
  than Dentures (Fixed Restorative / Implant Planning are preview-only clicks).
