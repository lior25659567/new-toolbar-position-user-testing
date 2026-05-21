ca# iTero Lab Order Flow — Research & Redesign

> Companion to [DESIGN_SYSTEM_RULES.md](./DESIGN_SYSTEM_RULES.md). Synthesizes (1) iTero's production order UX today, (2) the clinical/lab data each service genuinely requires, and (3) wizard patterns from best-in-class SaaS, into a concrete redesign for each service plus cross-cutting recommendations.

**Synthesis rule:** SaaS pattern wins where it's compatible with the clinical process. Clinical data wins where SaaS would drop required fields to look cleaner. Anywhere they agree (most places), follow both.

---

## Part A — Per-service redesign

For each card we document four things:

1. **iTero today** — what production looks like now
2. **Clinical truth** — what the lab genuinely needs, regardless of UI
3. **Required fields** — the canonical field list (collapsed from clinical truth)
4. **Recommended redesign** — what we should ship

---

### 1. Invisalign (clear aligner submission)

**iTero today.** From scanner Home → New Scan, doctor enters name + DOB + chart #, picks Case Type = `Invisalign / Invisalign + iRecord / Vivera / Vivera Pre-Debond`. Optional "Brackets present" checkbox. Multi-bite is greyed out. No tooth chart on the scanner — the actual treatment Rx (extractions, IPR, attachments, elastics) is filled in *separately* on the Invisalign Doctor Site (IDS) after the scan auto-uploads. Two apps, two re-keys. ([Element 5D Manual §4.3](https://storagy-itero-production-us.s3.amazonaws.com/download/en-us/iTero-Element-5D-User-Manual.pdf))

**Clinical truth.** The lab needs: arches treated, teeth not to move (FDI), missing/extracted teeth (FDI), Angle class + overjet/overbite/midline mm, A-P strategy (IPR, distalization, expansion, extraction, Class II elastics), posterior occlusion goal, aligner package (Comprehensive / Moderate / Lite / Express / First / Teen), attachment restrictions, button/precision-cut locations, scans <21 days old, 9-view intraoral + 3-view extraoral photos, pano + ceph for comprehensive cases. (Sources: Align Rx form, AAO guidelines.)

**Required fields.**
- Arches (Upper jaw / Lower jaw / Both)
- Aligner package (Comprehensive / Moderate / Lite / Express / First / Teen)
- Treatment goals (multi-select: crowding, spacing, deep bite, open bite, crossbite, Class II/III correction, midline, esthetics)
- Angle class + overjet (mm) + overbite (mm) + midline deviation (mm)
- A-P strategy (multi-select: IPR, distalization, expansion, extractions, Class II elastics)
- Teeth not to move (tooth-chart selection)
- Missing / to-be-extracted teeth (tooth-chart selection)
- Attachment restrictions (tooth-chart selection)
- Elastics + button positions (conditional, tooth-chart marker)
- Scans (STL upper + lower + bite, < 21 days)
- Photos (9-view intraoral + 3-view extraoral)
- Pano / Ceph (conditional on package = Comprehensive)

**Recommended redesign.**
- **Single-page form** with collapsible sections (Stripe Connect pattern). The whole Invisalign Rx fits one screen with smart defaults.
- **Card picker** for Aligner package (6 cards with case-count icons), since the package gates downstream IPR/elastics allowance.
- **Reuse the Info-page tooth chart** ([ToothChart.tsx](../../info/components/ToothChart/ToothChart.tsx)) for all 3 tooth-list inputs — a single chart with 3 colored "modes" (Don't move / Missing / Restrict attachments) instead of 3 separate charts.
- **Inline help (Stripe "?" pattern)** on Angle class, A-P strategy.
- **Auto-validate scan freshness** ("Scans are 8 days old — within 21-day window ✓").
- **Drop the IDS double-entry**. The order form *is* the Rx; the scanner step is just file capture. One submit, one record.

---

### 2. Final restoration (crown / bridge / veneer / inlay / onlay)

**iTero today.** Procedure = `Fixed Restorative`. Per-tooth dropdown on the FDI chart picks restoration type. Then a cascading mandatory-field sequence: Material (drives the rest) → Preparation Design (B + L) → Margin Design (B + L, only if metal) → Shade System (VITA Lumin / 3D-Master / Other) with Incisal/Body/Gingival → Stumpf Shade. For multi-unit: "Copy from tooth XX". Attachments via MyiTero (separate web portal). ([Lumina Single Crown Job Aid](https://assets.ctfassets.net/o8m7afojxkhl/4RX9sydJSBAKPo2KGOa7RU/b3b8a4dc809c729ab72493338a04fb94/-EN-iTero_Lumina_Single_crown_workflow_job_aid.pdf))

**Clinical truth.** Per-tooth: FDI, restoration type, material (zirconia 3Y/4Y/5Y, e.max CAD/Press, feldspathic, PFM, gold), shade system + value (VITA Classical, VITA 3D-Master, Ivoclar Chromascop, Bleach), shade map (cervical/body/incisal for anteriors), margin design + location (chamfer/shoulder/feather; supragingival/equigingival/subgingival mm), occlusal scheme (mutually-protected / group function / canine guidance), antagonist type, contact tightness, cement type, pontic design (bridges), connector cross-section (zirconia ≥9 mm² posterior). Material gates clearance: zirconia monolithic ≥1.0 mm occlusal, layered/e.max ≥1.5 mm, PFM ≥1.5 mm. (Sources: Shillingburg, Glidewell Rx, Ivoclar e.max docs.)

**Required fields** (per tooth, repeatable):
- Tooth FDI + restoration type
- Material (gates clearance + cement options + shade systems)
- Shade system + cervical / body / incisal values
- Margin design (B + L) + margin location (sub/equi/supragingival mm)
- Occlusal clearance confirmation (auto-warn from scan if available)
- Antagonist + contact tightness
- Cement type
- For bridges: pontic design + pontic FDIs
- For anterior esthetic: stick-bite, characterization notes, polarized photos
- Files: prep scan + opposing + bite + pre-op (anteriors) + shade photo

**Recommended redesign.**
- **Per-tooth wizard sub-flow**, but render as collapsible cards in a single scrollable view (Notion property pattern). One card per tooth, expanded only for the active tooth.
- **Card picker** for restoration type (Crown / Bridge / Veneer / Inlay / Onlay) inside each tooth card.
- **Material card with clearance preview** — show actual mm requirement next to each material option, plus a green/red badge if the prep scan satisfies it (Ramp's exception-based pattern: only flag where confidence is low).
- **Shade picker = visual swatch grid** (not dropdown). Show actual VITA/Ivoclar shade swatches, allow filtering by system. Photo-upload field with the camera/lab swatch tab as guide image.
- **"Copy from tooth #X"** — preserve iTero's best feature, but as a one-click action on each new tooth card.
- **Templates** ("My standard zirconia crown", "Glidewell BruxZir") — Linear-style. Pre-fills material, margin, shade system, cement, contact tightness.
- Move attachments **into the order form**. Kill the separate MyiTero upload portal.

---

### 3. Custom abutment

**iTero today.** No first-class "Custom Abutment" choice exists. Doctor seats an ATLANTIS IO FLO scan body, picks `Fixed Restorative → Implant-Supported`, sends scan. Lab opens the case in Partner Lab Software, then *they* toggle "Custom Abutment Order (iDX)" and pick a production center. Implant manufacturer + product line are entered downstream in ATLANTIS WebOrder. The doctor never specifies the implant system on the iTero Rx. ([Atlantis IO FLO guide](https://www.dentsplysirona.com/content/dam/dentsply/web/Implants/Franchise%20Content/32670620-USX-1407-Intraoral-scanning-for-ATLANTIS-Abutment-with-iTero-LR-7t66ea0-en-1409.pdf), [Partner Lab Manual p.13](https://storagy-itero-production-us.s3.amazonaws.com/download/en-us/iTero-Partner-Lab-Software-Training-Manual.pdf))

**Clinical truth.** The lab cannot start without: implant FDI + manufacturer + product line + platform/connection (internal hex / conical / Tri-Channel / CrossFit) + diameter (NP/RP/WP or mm), scan body brand + part # (mismatch = remake), abutment material (Ti grade 5, Ti-base + zirconia, full zirconia), emergence profile + soft-tissue height (mm from platform), angulation correction (degrees), final restoration type (gates abutment design: screw-retained crown vs cement-retained vs bridge abutment), torque value. Files: STL with scan body in place, opposing arch, bite, soft-tissue cuff scan after healing abutment removal. (Sources: Atlantis Rx, Straumann CARES.)

**Required fields.**
- Implant FDI
- Manufacturer (card picker — Nobel / Straumann / Zimmer / Dentsply / MIS / BioHorizons / Megagen / Neodent / Other)
- Product line (cascading dropdown gated by manufacturer)
- Platform / connection + diameter (cascading from product line)
- Scan body SKU (cascading from platform — labs *will* remake on mismatch)
- Abutment material
- Emergence profile + soft-tissue height (mm slider)
- Angulation correction (degrees)
- Final restoration type (screw / cement-retained / bridge)
- Files: STL with scan body, opposing, bite, cuff scan

**Recommended redesign.**
- **Promote to a first-class service card.** Don't bury it under "Implant-Supported / Fixed Restorative" — it's clinically distinct and the field set is different.
- **Cascading dropdowns** for the implant SKU chain (Stripe Connect's country-gated pattern). Pick manufacturer → product line auto-filters → platform auto-filters → scan body auto-filters. Show a green check at each step ("Scan body library matched ✓").
- **Visual implant brand cards** for the manufacturer step (8 brand cards with logos). Visual recognition is faster than dropdown for major brands.
- **Emergence profile preview** — show a live SVG/3D illustration of the soft-tissue cuff that updates as the height slider moves. (See §B.4 Imagery.)
- **Hard validation** on scan-body match (Ramp-style red banner with retry): "Scan body NB-001 doesn't match implant Straumann BLX 4.0 — common cause of remakes."

---

### 4. Nightguard / occlusal splint

**iTero today.** Procedure = `Appliance` (introduced 2023), Type sub-dropdown = Nightguard / Bite Splint / Mouthguard / Orthodontic Appliance. Multi-bite enabled. No tooth chart, just an arch toggle. Send To = lab, partner lab, or in-house Design Suite (which runs a 6-step in-MyiTero wizard for milling/printing). No shade or material picker on the Rx — labs guess from notes. ([Enhanced Rx Guide](https://assets.ctfassets.net/o8m7afojxkhl/6mdEs9ZpNpV0moz31ZhhcZ/a3b5c2d94eb22e45acc9f9a5584cc932/Step-by-step_guide__Enhanced_iTero_Rx_form.pdf))

**Clinical truth.** Arch, type (hard acrylic / soft EVA / dual-laminate / NTI deprogrammer / Tanner), indication (bruxism / TMD / protective post-restorative), coverage (full vs partial — TMD requires full), thickness (1.5 mm light, 2-3 mm moderate-heavy), occlusal scheme (flat plane with canine guidance ramps), bite position (MIP / CR / therapeutic — TMD requires CR + face-bow). Validation: full occlusal coverage of all teeth (prevents supra-eruption); even bilateral contacts; canine disclusion in excursions. (Sources: AAOP, Dawson, Okeson.)

**Required fields.**
- Arch (Upper jaw / Lower jaw)
- Type (card picker: Hard / Soft / Dual-laminate / NTI / Tanner)
- Indication (segmented control: Bruxism / TMD / Protective)
- Coverage (Full / Partial — Partial disabled when Indication = TMD with red helper)
- Thickness (1.5 / 2.0 / 2.5 / 3.0 mm)
- Bite position (MIP / CR / Therapeutic)
- Existing restorations or implants (free text or chart marker)
- Files: STL both arches + bite

**Recommended redesign.**
- **Single screen, ~30-second flow.** Linear-style minimal modal — this is the simplest service.
- **Type card picker** (5 cards with thickness and indication shown on each card).
- **Smart conditional** — picking `TMD` indication disables `Partial coverage` with an inline explanation ("TMD splints require full-arch coverage to prevent supra-eruption"). Stripe-style validation message.
- **Default thickness** based on type + indication (e.g., Hard + Bruxism → default 2 mm).

---

### 5. Implant planning (pre-surgical)

**iTero today.** Procedure = `Implant Planning`. On the Tooth Diagram, doctor marks implant site(s). For tooth-supported guides also picks supporting tooth/teeth. Scan exports as STL alongside the patient's CBCT DICOMs — but the actual STL+DICOM merge happens in Simplant / coDiagnostiX / planning software, **not on iTero**. Plan returns for doctor approval, then a separate surgical-guide order. Implant brand/diameter/length are NOT captured on the iTero Rx. ([iTeroEd Implant Planning](https://www.iteroed.com/en-SG/materials/602Mn5kcS4Pt3EeOqj08rr))

**Clinical truth.** Edentulous site FDI, planned implant manufacturer + product line + diameter + length, loading protocol (immediate / early / conventional), planned restoration (single crown / bridge / overdenture / All-on-X), bone quality (Lekholm-Zarb D1-D4, from CBCT), soft-tissue biotype, inter-occlusal space (mm), keratinized tissue width (mm), patient medical (bisphosphonates, HbA1c, smoking, anticoagulants), CBCT (DICOM, FOV covering site + 1 tooth M/D, voxel ≤0.3 mm, ≤6 months), STL both arches, diagnostic wax-up. Validation: minimum 1.5 mm bone B/L, 3 mm between implants, 1.5 mm to adjacent root, 2 mm above IAN. (Sources: AAID, AAOMS, Misch, ITI.)

**Required fields.**
- Implant site FDI(s)
- Planned implant SKU chain (manufacturer → product line → diameter → length)
- Loading protocol (Immediate / Early / Conventional)
- Restoration plan (Single crown / Bridge / Overdenture / All-on-X)
- Patient medical flags (multi-select checklist: bisphosphonates / diabetes / smoking / anticoagulants / radiation history)
- CBCT (DICOM upload — required, ≤6 months, with embedded date check)
- STL upper + lower
- Wax-up (file or "lab to design" toggle)

**Recommended redesign.**
- **Wizard with vertical sidebar checklist** (Stripe Connect pattern) — 5-7 fields, but each is consequential and benefits from a checked-off list.
- **CBCT upload as a first-class field**, not an attachment. Preview the DICOM in-place (a lightweight viewer). Auto-validate study date < 6 months and FOV adequacy ("CBCT FOV: 8 cm × 8 cm — ✓ covers site").
- **Implant SKU chain reused from §3** — same cascading dropdown with brand cards.
- **Patient medical checklist** as a collapsed callout — opens on click. Don't intimidate the user with red-flag forms upfront.
- **Diagnostic wax-up step** with toggle: "Upload my wax-up" vs "Have lab design from STL".

---

### 6. Surgical guide

**iTero today.** Surgical guide is **not its own procedure** on iTero — it's a downstream output of Implant Planning (§5). After plan approval in the planning software, the lab fabricates the guide from the same STL + DICOM bundle. No iTero-side fields for sleeve system, drill kit, or tissue thickness. ([Enhanced Rx Guide p.6](https://assets.ctfassets.net/o8m7afojxkhl/6mdEs9ZpNpV0moz31ZhhcZ/a3b5c2d94eb22e45acc9f9a5584cc932/Step-by-step_guide__Enhanced_iTero_Rx_form.pdf))

**Clinical truth.** Approved implant plan (links the SKU chain from §5), guide type (pilot only / partially guided / fully guided sleeve-in-sleeve), support type (tooth / mucosa / bone / pin-stabilized), sleeve system (manufacturer-specific: Straumann Guided / Nobel Guided / Densah Guided — gates drill kit and sleeve internal diameter), inspection windows, anchor pin positions (mucosa-supported). For fully edentulous: fiducial markers / dual-scan protocol or paired with denture conversion. (Sources: Straumann Guided Surgery manual, Nobel NobelGuide, coDiagnostiX.)

**Required fields.**
- Approved implant plan (link to §5 record — locks SKU chain)
- Guide type (Pilot / Partial / Fully guided)
- Support type (Tooth / Mucosa / Bone / Pin-stabilized)
- Sleeve system (cascading from implant manufacturer)
- Anchor pin positions (conditional on Mucosa support)
- Inspection window count + locations (default: 3, distributed)

**Recommended redesign.**
- **Make it a follow-up flow from the Implant planning order**, not a separate first-class card. After implant plan approval, surface a "Generate surgical guide" CTA that pre-fills the entire SKU chain and asks only the 4-5 guide-specific questions.
- **Card picker for support type** (4 cards with line-art: tooth / bone / mucosa / pin) — already in the codebase.
- **Sleeve system auto-derived** from the implant manufacturer; show as read-only confirmation with a "Change" link.
- **3D guide preview** — render the planned guide silhouette on a dental arch SVG (or live 3D if budget allows). Powerful confidence signal before submit.

---

### 7. Temporary restoration

**iTero today.** No first-class "Temporary" procedure. Two patterns: (a) immediate provisional → set Fixed Restorative + toggle "Pre-Treatment Scan" so the lab can copy the pre-prep anatomy; (b) implant provisional → three scans (temp in place, scan body alone, temp out-of-mouth) under one Rx with hand-noted instructions in Notes. No structured field for temp material, duration, or shade match to final. ([Element 5D Manual §4.3.1](https://storagy-itero-production-us.s3.amazonaws.com/download/en-us/iTero-Element-5D-User-Manual.pdf))

**Clinical truth.** Tooth FDI, type (chairside relined / lab-fabricated / long-term >3 months), material (PMMA milled / bis-acryl / composite / heat-cured acrylic — duration gates choice), shade (VITA Classical typically; bleach if pre-whitening), margin design + location (mirrors final), contour intent (anatomical / tissue-conditioning / ovate-pontic for site development), light contacts. For implant provisional: screw-retained on Ti-base or PEEK temp abutment, **out of static and dynamic occlusion**, emergence ≤30° from implant axis. (Sources: Shillingburg, Gracis et al. provisional consensus.)

**Required fields.**
- Tooth FDI
- Type (Chairside / Lab-fabricated / Long-term)
- Material (gated by Type and Duration)
- Duration (1-3 weeks / 1-3 months / >3 months — slider or segmented)
- Shade
- Margin design (mirrors final restoration)
- Contour intent (Anatomical / Tissue-conditioning / Ovate pontic)
- For implant: retention method (screw / cement) + Ti-base SKU + occlusion confirmation (out-of-occlusion checkbox)
- Files: prep scan + opposing + bite + pre-op scan (for copy-mill)

**Recommended redesign.**
- **Promote to first-class card** with two sub-types up-front (Tooth-supported / Implant-supported) — they have meaningfully different fields.
- **Smart material defaults** based on duration: <1 month → bis-acryl; 1-3 months → PMMA milled; >3 months → heat-cured acrylic. Show as recommendation with "Change" link.
- **For implant provisional: structured "Out of occlusion" confirmation** — prevents the most common implant temp failure. Auto-checked from scan if available, manual checkbox otherwise.
- **"Same as final restoration"** template — pre-fills shade + margin from the patient's existing Final Restoration order, so temps match what's coming.

---

### 8. Full denture

**iTero today.** Procedure = `Denture/Removable`, Type = Full. Structured fields for Fabrication Stage / Mold Shape / Gingival Shade / Tooth Shade / Material — better than most competitors. Arch toggle (no tooth chart). Special edentulous scan sequence (occlusal → palatal seal → intaglio). Send To = lab or exocad via the iTero-exocad Connector. **iDD specifically calls out** that there's no streamlined denture/All-on-X workflow despite hardware capability. ([iDD Lumina Review](https://instituteofdigitaldentistry.com/intraoral-scanner-reviews/itero-lumina-review-the-best-intraoral-scanner-yet-from-align-technology/))

**Clinical truth.** Arch, material (heat-cured PMMA / injected / milled / 3D-printed — NextDent, Lucitone), tooth mold + shade (Ivoclar SR Vivodent / Dentsply Portrait IPN / VITA Physiodent — VITA Classical A1-D4, mold #), base shade (original / light pink / fibered / vein / Meharry shades), occlusal scheme (balanced / lingualized / monoplane / anatomic 30°/20°/0°), VDO (mm), CR bite registration, midline + smile line + canine line markers, anatomic vs non-anatomic posteriors. For implant overdentures: attachment system (Locator / Locator R-Tx / ball / bar) + retention insert color. (Sources: Zarb-Bolender, Ivoclar BPS.)

**Required fields.**
- Arch (Upper jaw / Lower jaw / Both)
- Fabrication stage (Try-in / Final / Reline / Repair / Conversion)
- Material (gated by Fabrication stage)
- Tooth shade (VITA visual swatch picker)
- Tooth mold (manufacturer + mold # — visual catalog)
- Gingival/base shade (5-6 swatch options)
- Occlusal scheme (Balanced / Lingualized / Monoplane / Anatomic)
- VDO (mm number input)
- Markers: midline / smile line / canine line (chart input)
- For implant overdenture: attachment system + retention force
- Files: scan or impressions + CR bite rim + face-bow / mounting data

**Recommended redesign.**
- **Multi-step wizard** — 5+ fields with conditional logic justifies stepper (Stripe Atlas threshold).
- **Dedicated edentulous scan window** — separate scan UI optimized for ridge capture, not the dentate UI.
- **Visual catalog pickers** for tooth mold and shade (gallery of mold thumbnails, swatch grid for shade — Notion template-gallery pattern).
- **Implant overdenture branch** — selecting "Implant overdenture" reveals the attachment system fields (uses the same SKU chain from §3).
- **Try-in / Final / Reline as a stage selector at top** — fields adapt per stage. Don't render all stages simultaneously.

---

### 9. Partial denture

**iTero today.** Same `Denture/Removable` procedure, Type = Partial. Doctor uses the tooth chart to mark existing vs edentulous teeth, then **specifies framework needs in the Notes free-text field** — no structured rest-seat or clasp fields. ([Enhanced Rx Guide p.2](https://assets.ctfassets.net/o8m7afojxkhl/6mdEs9ZpNpV0moz31ZhhcZ/a3b5c2d94eb22e45acc9f9a5584cc932/Step-by-step_guide__Enhanced_iTero_Rx_form.pdf))

**Clinical truth.** Arch + Kennedy classification (Class I-IV with modifications), abutment teeth FDI list, framework material (cobalt-chromium cast / titanium / PEEK / thermoplastic flexible / milled CoCr / 3D-printed laser-sintered CoCr), **clasp design per abutment** (circumferential / I-bar / T-bar / RPI / RPA, cast vs wrought wire), **rest seat locations** (FDI + occlusal/cingulum/incisal), major connector design (palatal strap / A-P palatal bar / horseshoe / lingual bar / lingual plate / sublingual bar), guide planes, path of insertion. Material gates clasp options (no cast clasps on Valplast). (Sources: McCracken, Stewart.)

**Required fields.**
- Arch
- Kennedy class (I / II / III / IV) + modifications
- Abutment teeth (chart selection)
- Framework material (gates clasp options)
- Clasp design per abutment (per-tooth picker on the chart)
- Rest seat locations (per-tooth marker on chart)
- Major connector design (illustrated picker)
- Tooth shade + mold + acrylic shade (saddle areas)
- Files: STL both arches with surveyed abutments + bite + opposing

**Recommended redesign.**
- **Wizard with strong tooth-chart interaction.** This is the most chart-dependent service.
- **Augment the tooth chart with role markers.** Each tooth can be marked: Abutment / Pontic / Edentulous saddle / Rest seat. Render with distinct icons on the chart (see §B.4 Imagery).
- **Major connector picker = illustrated cards** (palatal strap diagram, lingual bar diagram, etc.). One of the highest-value imagery upgrades.
- **Smart material → clasp coupling.** Picking "Valplast" (flexible) automatically disables cast-clasp options with explanation. Stripe-style conditional disabling.
- **Kennedy classification as a card picker with arch diagrams** — Class I (bilateral distal extension) shows a visual.

---

### 10. Working model (printed / solid / study)

**iTero today.** Procedure = `Study Model/iRecord` — "for reference and model fabrication." Brackets Present checkbox. Multi-bite enabled (one of only two procedures where it is). No tooth chart, no material, no shade. Send To includes "do not send to lab" (store only). STL export gated by checkboxes set at Rx time — if missed, doctor must call iTero support to reset (frequent friction point). ([Dental Lab Network](https://dentallabnetwork.com/forums/threads/itero-basics.24249/))

**Clinical truth.** Arch(es), model type (solid / die model with removable dies / articulated set), source file (STL / PLY / OBJ), material (model resin: NextDent, Formlabs Model V3, Asiga DentaModel; or stone if analog), base design (horseshoe / ABO orthodontic / ditched die / plain), scale (always 1:1 clinical). Conditional: articulator type + face-bow + condylar settings (for articulated); FDI teeth needing removable dies (for die model); implant analog SKU per site (for implant model — must match scan body / implant). Validation: implant analog must match patient's actual implant SKU; printed models post-cured per spec for <100 µm accuracy. (Sources: ADA technical reports on additive manufacturing.)

**Required fields.**
- Arch(es)
- Model type (Solid / Die model / Articulated set)
- Material (model resin variant)
- Base design (Horseshoe / ABO / Ditched die / Plain)
- For die model: which FDI need removable dies
- For articulated: articulator type + bite STL
- For implant model: implant analog SKU per site (gates SKU library)
- Files: STL minimum (both arches); bite STL for articulation; scan body STL for implant model

**Recommended redesign.**
- **Simplest flow on the platform** — preserve that. Single screen, 4 fields default, more reveal conditionally.
- **Model type as 3-card picker.**
- **Drop the STL-export-gated-by-checkboxes friction.** Always export STL, full stop. No reason this should require a phone call.
- **Implant analog branch** uses §3's SKU chain.

---

### 11. Custom order (free-form)

**iTero today.** **Does not exist** as a category. Doctors pick the nearest procedure (usually Appliance or Study Model) and use the Notes field. Attachments uploaded only via MyiTero web, not on-scanner. ([Partner Lab Manual p.14](https://storagy-itero-production-us.s3.amazonaws.com/download/en-us/iTero-Partner-Lab-Software-Training-Manual.pdf))

**Clinical truth.** At minimum: patient + doctor IDs, free-text description, arch + FDI (if applicable), intended clinical use, material preference (or "lab to recommend"), delivery date, contact method for callback. Lab will then triage and request specifics based on description. Custom orders should auto-flag for manual lab review before production. (Sources: NADL Rx best practices, FDA 21 CFR 820 for US labs.)

**Required fields.**
- Free-text description (required, ≥30 chars)
- Arch + FDI teeth (optional chart input)
- Intended clinical use (free text)
- Material preference (or "Lab to recommend" toggle)
- Delivery date
- Contact method for callback (phone / email — required)
- Photos / sketches / reference images (file upload)
- STL files (optional)

**Recommended redesign.**
- **Make it a first-class card** — clinicians need an explicit escape hatch.
- **Conversational form:** large text area first ("Describe what you need — the lab tech will follow up") plus a small Optional Details panel below for arch/FDI/files.
- **Mark every custom order with a `Custom` tag** in the Orders table so lab + clinic can spot them at a glance.
- **Show estimated lead-time uncertainty:** "Custom orders typically add 3-5 days for lab review."
- **Auto-create a `Pending lab review` status** as the first stage of the post-submit pipeline (see §B.6).

---

## Part B — Cross-cutting recommendations

### B.1 Wizard structure & step indicator

**Recommendation:** **Vertical sidebar checklist** (Stripe Connect pattern), not a horizontal stepper, for the multi-step services. Horizontal steppers are right when steps are strictly linear and short (Ramp bill creation, Vercel deploy). Lab orders are non-linear: clinicians pause to take a new scan, attach files first, jump back to fix the shade. Vertical checklist supports skip-around, shows progress at a glance, and matches Stripe Connect — the canonical complex B2B onboarding flow.

For short flows (Nightguard, Working model, Study model, Custom order): **single-page form with collapsible sections** (Linear, Vercel project import). Don't impose multi-step ceremony when the whole form fits on screen.

| Service | Pattern |
|---------|---------|
| Invisalign | Single page, collapsible sections |
| Final restoration | Per-tooth collapsible cards |
| Custom abutment | Cascading wizard (3 steps) |
| Nightguard | Single page, ~30 sec |
| Implant planning | Vertical checklist (5-7 sections) |
| Surgical guide | 4-question follow-up to Implant plan |
| Temporary restoration | Single page with implant/tooth branch |
| Full denture | Vertical checklist (stage-driven) |
| Partial denture | Wizard with tooth-chart-heavy steps |
| Working model | Single page, 4 fields |
| Custom order | Single page, conversational |

### B.2 Component choice

| Decision type | Right component | SaaS exemplar |
|---------------|-----------------|---------------|
| Service / sub-type pick (≤8 options, shapes downstream flow) | **Card picker** | Vercel framework picker, Notion template gallery |
| Binary mode (Upper / Lower, Screw / Cement) | **Segmented control** | Stripe payment link "One-time / Subscription" |
| 3-axis state | **Card picker** with icons | Vercel runtime picker |
| Long catalog (shades, manufacturer SKUs, lab list) | **Searchable dropdown** | Ramp vendor picker |
| Visual catalog (tooth molds, illustrated connectors) | **Card grid with image previews** | Notion template gallery |
| Numeric range with constraints (VDO, thickness, mm clearance) | **Slider + numeric input** | Stripe currency input |
| Multi-select short list (treatment goals, medical flags) | **Checkbox group** | Linear label picker |
| Multi-select long list (teeth) | **Tooth chart** (custom — already exists) | n/a |
| Free text | **TextArea** with character counter | Linear issue body |

**Banned patterns** (reinforces [DESIGN_SYSTEM_RULES.md](./DESIGN_SYSTEM_RULES.md)):
- Native `<select>` for any clinical decision (bad mobile UX, hard to style consistently).
- 3+ stacked dropdowns where a cascading wizard would be clearer.
- Modal-on-modal for confirmation steps (use a step in the main wizard).

### B.3 Save / draft / resume

Lab orders are **high-stakes** — a lost draft is patient-facing, legally significant, and erodes trust. Combine three signals:

1. **Persistent draft list** (Stripe pattern) — drafts appear in the Orders tab with `Draft` status pill and last-edited time. The current implementation already does this.
2. **Autosave with "Saved" pulse** in the wizard header (Linear pattern). Pulse on every field change debounce, fade after 2 sec.
3. **Recovery on accidental close** — if the user closes the wizard without saving, prompt: "Save as draft / Discard / Cancel". Default = Save as draft.

Never silent-save (Notion-style) for clinical data. Clinicians need confidence the order is preserved.

### B.4 Imagery & visual recommendations

Lab orders are inherently visual. Today most fields are textual; many should be visual.

| Where | Visual upgrade | Rationale | Reference |
|-------|----------------|-----------|-----------|
| Service selection | **Line-art SVG illustration per service** (already shipped) | Visual recognition > text scan | Vercel framework cards |
| Restoration type per tooth | **Tooth icon with restoration overlay** (crown silhouette over tooth, etc.) | Spatial reasoning | New asset |
| Tooth chart selection | **Color-coded role markers** (abutment / pontic / saddle / rest seat) | Already exists in [ToothChart.tsx](../../info/components/ToothChart/ToothChart.tsx) — extend palette | n/a |
| Shade picker | **Visual swatch grid** showing actual VITA / Ivoclar shade colors | Replace dropdown — closer to physical shade tab | New asset (color swatches) |
| Tooth mold (denture) | **Photo grid of mold options** (Ivoclar SR Vivodent, etc.) | Manufacturer catalog familiarity | Manufacturer image rights needed |
| Material card | **Mini section diagram** showing minimum clearance for each material (e.g., "Zirconia: 1.0 mm occlusal") | Field engineers' rule-of-thumb made visible | New SVG diagrams |
| Margin design | **Cross-section diagrams** of chamfer / shoulder / feather edge | Communication with lab improves | New SVG diagrams |
| Implant manufacturer | **Brand logo cards** | Visual recognition is faster than dropdown text | Brand image rights |
| Major connector (partial) | **Illustrated cards**: palatal strap, lingual bar, etc. | Highest-impact diagram for partials | New SVG diagrams |
| Surgical guide preview | **3D guide silhouette on dental arch** (or live 3D if budget allows) | Confidence signal before submit | Three.js or SVG |
| Implant abutment emergence profile | **Live SVG cuff preview** updating as height slider moves | Spatial verification | New SVG |
| Pre-op vs prep scan | **Before / after comparison** (split-pane STL viewer) | Catches scan-quality issues before submit | Three.js viewer |
| Submission review | **Visual order card** with all fields rendered as a printable summary | Mirrors the printed lab Rx familiar to dentists | Composed component |

### B.5 Validation patterns

Inspired by Stripe (eager on-blur with green checks), Vercel (per-step server checks), Ramp (continuous formatting):

- **On-blur green checkmark** for fields with deterministic validity: tooth FDI, shade codes, dates, file types, scan freshness (<21 days).
- **Soft warnings** (yellow) for non-blocking concerns: "Material is Zirconia — typical clearance 1.0 mm. Your scan shows 0.8 mm. Lab may request adjustment."
- **Hard blocks** (red) for clinical safety: "Scan body NB-001 doesn't match implant Straumann BLX 4.0 — mismatched scan body causes remakes. [Change scan body / Change implant]"
- **Per-step validation before Next** — block on missing required fields only. Optional fields don't gate progress. Display an inline summary at the top of the step listing what's missing ("3 required fields incomplete: Material, Shade, Margin design").
- **Lazy validation for free text** (notes, custom order description) — never red-flag mid-typing.
- **Server errors** = persistent banner at top of step (Stripe pattern) with the specific cause and a Retry CTA. Always preserve form data.

### B.6 Post-submission tracking

Today, iTero submission is fire-and-forget — the doctor sees the order in MyiTero with a status, but no rich timeline. Best-in-class:

- **Order detail page** (Linear-style) opened immediately after submit. Shows:
  - **Status pipeline** (Ramp pattern): `Received → In Design → In Production → QA → Shipped → Delivered`
  - **Activity timeline** (Stripe webhook pattern): timestamped events including lab tech notes ("Sarah from BruxZir lab marked scan quality OK")
  - **Estimated delivery date** prominent (auto-calculated from service + lab + rush option)
  - **Message lab** CTA (creates a thread tied to this order)
  - **Files panel** (uploaded attachments, plus lab-uploaded design previews / shade-match photos)
- **Email + SMS confirmation** with order # and a link to the order detail page.
- **Push update on stage transitions** so the doctor doesn't have to poll.

This is what Spark Aligners portal and Glidewell Direct already do; iTero lags here.

### B.7 Templates / repeat orders

The single highest-leverage productivity upgrade. Cite Linear, Notion, Asana templates:

- **Personal templates** ("My standard zirconia crown for #14") — saved per doctor. One-click apply.
- **Lab-recommended templates** ("Glidewell BruxZir Z-Anterior", "Atlantis Ti-base + zirconia") — curated gallery, surfaces recommended materials.
- **Repeat from previous order** — on any patient's order page, "Duplicate to new order" button. Pre-fills everything; doctor changes the tooth #.
- **Multi-tooth bulk apply** — select multiple teeth on the chart, apply the same material/shade/margin to all (replaces iTero's one-tooth-at-a-time dropdown grind).

Realistic outcome: 5-min order → 30-sec order for repeat configurations.

### B.8 Inline help & contextual guidance

- **`?` icon next to jargon-heavy fields** (Stripe pattern). Click → popover with a 1-paragraph explanation + link to a longer doc. Examples: margin design, occlusal clearance, antagonist, Kennedy classification, scan body matching, sleeve system.
- **First-time onboarding coachmark** (HubSpot pattern) — once per new doctor, briefly walk through the wizard structure.
- **Don't pre-render tooltips on every field.** Most lab order fields are obvious to a dentist; over-helping patronizes.
- **Smart inline suggestions** based on prior orders — "You usually pick VITA Classical A2 for tooth 14 — apply?" (Notion-style suggestions, opt-in defaults).

### B.9 Accessibility & keyboard

Best-in-class wizards (Linear, Stripe Dashboard) work entirely keyboard:

- `Tab` / `Shift+Tab` through all fields in DOM order.
- `Enter` advances to Next when a step is complete.
- `Cmd/Ctrl + S` saves draft explicitly.
- `Cmd/Ctrl + Enter` submits the order from the review step.
- `Esc` opens "Save as draft / Discard / Cancel" dialog.
- All custom pickers (card pickers, tooth chart) have proper `aria-pressed` / `role="radiogroup"`.
- Color is never the only signal (status dots paired with text; shade swatches show the code too).
- Focus visible at all times; never `outline: none` without a custom focus ring.

### B.10 Mobile vs desktop

Lab orders are **desktop-primary** — clinicians order from operatory PCs. Mobile should support **review, status check, message lab, minor edits** — not full new-order creation. Follow Linear's pattern (mobile = read + small edits, desktop = creation). Don't try to make a 30-field denture wizard work on a phone.

The Orders tab + order detail + status pipeline + lab message thread should all be mobile-first. Only the wizard itself remains desktop-primary.

### B.11 Gap analysis — what's missing today

Beyond the per-service redesigns, these are missing from iTero:

**Missing features (bring from best-in-class SaaS):**
- **Persistent drafts with last-edited timestamp** (Stripe).
- **Personal & lab-curated templates** (Linear, Notion).
- **Repeat / duplicate order** from any prior submission.
- **Order detail page with status pipeline + activity timeline** (Linear, Stripe, Ramp).
- **In-thread lab messaging** tied to each order (vs free-text Notes that go one-way).
- **Push / email / SMS notifications on stage transitions** (Vercel deploy events).
- **Visual review screen before submit** (Vercel deploy preview) — show every field as a printable Rx summary.
- **Edit-from-summary** with focused mini-modals (Vercel pencil-icon pattern).
- **Smart defaults from prior orders** (Notion suggestions).
- **Bulk multi-tooth field apply** on the chart.
- **First-run onboarding coachmark** (HubSpot).

**Missing clinical features:**
- **Custom abutment as a first-class service** (currently buried under Fixed Restorative).
- **Temporary restoration as a first-class service** (currently a "Pre-Treatment Scan" toggle).
- **Surgical guide explicit follow-up flow** (currently invisible — an output of Implant Planning that the doctor never sees).
- **CBCT upload as a first-class field** (currently external to iTero entirely).
- **Structured framework / clasp / rest-seat data for partial dentures** (currently free text).
- **Out-of-occlusion confirmation for implant provisionals** (currently only in Notes).
- **Pre-op scan validation** (e.g., scan freshness < 21 days for Invisalign, ≤ 6 months for CBCT).

**Missing affordances:**
- **Rush options** with clear surcharge.
- **Shipping address / tracking** (lab-side data the clinician has no visibility into).
- **Cost estimate** before submit.
- **Insurance pre-auth attachment slot.**
- **Clinical notes + lab notes split** (today both live in one Notes field).
- **Attachments inside the order form** (today: separate MyiTero web portal — a 2-app flow).

### B.12 Submission flow improvements (concrete checklist)

Bringing it all together — the order of polish work that would have the highest impact:

1. **Promote 4 services to first-class cards** (Custom abutment, Temporary restoration, Surgical guide as guided follow-up, Custom order).
2. **Replace the global one-form Rx with per-service flows** matching the patterns in §B.1.
3. **Move attachments into the order form** — kill the MyiTero web round-trip.
4. **Add the visual review screen** before submit, with edit-from-summary mini-modals.
5. **Add personal + lab-recommended templates** to the Orders tab.
6. **Build the post-submit order detail page** with status pipeline + activity timeline + lab thread.
7. **Add persistent draft autosave + close-without-save prompt.**
8. **Add visual catalog pickers for shade and tooth mold** (replace dropdowns).
9. **Add cascading SKU pickers** for Custom abutment, Implant planning, and Surgical guide flows (single source of truth for the implant SKU chain).
10. **Add structured framework / clasp / rest-seat fields** for Partial denture — biggest clinical-data gap.
11. **Add CBCT first-class upload + lightweight in-form viewer** for Implant planning.
12. **Add `?` popovers** on jargon-heavy fields, with links to short illustrated explainers.
13. **Add bulk multi-tooth apply** on the tooth chart.
14. **Wire up keyboard shortcuts** (`Tab` / `Enter` / `Cmd+S` / `Cmd+Enter` / `Esc`).
15. **Add rush + shipping + cost estimate fields** at the Files step.

### B.13 SaaS benchmark cheat-sheet

Quick reference for which product inspires which pattern — useful when reviewing PRs:

| Pattern | Inspired by |
|---------|-------------|
| Vertical sidebar checklist for non-linear flows | Stripe Connect onboarding |
| Single-page form for short flows | Linear, Vercel project import |
| Card picker for primary type selection | Vercel framework selection, Notion template gallery |
| Cascading dropdowns for SKU chains | Stripe Connect (country-gated), Ramp vendor categorization |
| Visual catalog pickers (shades, molds) | Notion template gallery, Figma component picker |
| Persistent draft list + last-edited time | Stripe Dashboard, Linear |
| Autosave "Saved" pulse | Linear |
| Per-step on-blur validation with green check | Stripe |
| Server-error banner with preserved data | Stripe, Vercel |
| Inline `?` help popovers | Stripe |
| Visual review screen before submit | Stripe Checkout, Vercel deploy preview |
| Edit-from-summary with focused modal | Vercel deploy preview |
| Templates + duplicate-from-previous | Linear, Notion, Asana |
| Status pipeline post-submit | Ramp bill pipeline |
| Activity timeline post-submit | Stripe webhook events, Linear issue thread |
| Push notifications on stage transitions | Vercel deploy events |
| Mobile-as-read-only, desktop-as-creation | Linear |
| Keyboard-first navigation | Linear, Stripe Dashboard |

---

## Sources

**iTero / Align:**
- [Step-by-step guide: Enhanced iTero Rx form (Align, 2022-2023)](https://assets.ctfassets.net/o8m7afojxkhl/6mdEs9ZpNpV0moz31ZhhcZ/a3b5c2d94eb22e45acc9f9a5584cc932/Step-by-step_guide__Enhanced_iTero_Rx_form.pdf)
- [iTero Lumina Single Crown Workflow Job Aid (2025)](https://assets.ctfassets.net/o8m7afojxkhl/4RX9sydJSBAKPo2KGOa7RU/b3b8a4dc809c729ab72493338a04fb94/-EN-iTero_Lumina_Single_crown_workflow_job_aid.pdf)
- [iTero Lumina Denture Workflow Job Aid](https://assets.ctfassets.net/o8m7afojxkhl/7KYSid5ECy9ExOs4GMSl1m/ff3919931abb190554f9667b5d839182/iTero-Lumina-Denture-workflow-job-aid--ANZ.pdf)
- [iTero Element 5D User Manual](https://storagy-itero-production-us.s3.amazonaws.com/download/en-us/iTero-Element-5D-User-Manual.pdf)
- [iTero Partner Lab Software Training Manual](https://storagy-itero-production-us.s3.amazonaws.com/download/en-us/iTero-Partner-Lab-Software-Training-Manual.pdf)
- [iTero Design Suite Bite Splint workflow](https://assets.ctfassets.net/o8m7afojxkhl/7Br2seopxc1oOObiHm4UUy/e3d15cafd8c7e2096dd43d452e0c8d0d/0680EN_iTero__Design_Suite_-_Bite_Splint_workflow.pdf)
- [Dentsply Atlantis IO FLO scanning guide](https://www.dentsplysirona.com/content/dam/dentsply/web/Implants/Franchise%20Content/32670620-USX-1407-Intraoral-scanning-for-ATLANTIS-Abutment-with-iTero-LR-7t66ea0-en-1409.pdf)
- [SureSmile Scanner Protocol](https://d1w1xo54rgq5xs.cloudfront.net/suresmile_documentation/Guides/DOC-500368_Scanner_protocol_iTero_iOC.pdf)
- [Institute of Digital Dentistry — iTero Lumina review](https://instituteofdigitaldentistry.com/intraoral-scanner-reviews/itero-lumina-review-the-best-intraoral-scanner-yet-from-align-technology/)
- [iDD — Lumina restorative news (2025)](https://instituteofdigitaldentistry.com/news/itero-lumina-finally-gets-restorative-capabilities/)
- [Dental Lab Network — iTero basics thread](https://dentallabnetwork.com/forums/threads/itero-basics.24249/)
- [iTero Insights — implant restorations](https://itero.com/education-and-resources/itero-insights/digital-dentistry/simplify-complex-restorative-treatments-for-implants)
- [iTero Learn — Partial Denture](https://learn.itero.com/en-EU/video/EF0E72B4-9008-4A9F-BFFF20185A85C18A)
- [iTeroEd Implant Planning](https://www.iteroed.com/en-SG/materials/602Mn5kcS4Pt3EeOqj08rr)
- [Orthosnap — exporting STL from iTero](https://help.orthosnap.com/en/articles/5761042-how-to-export-stl-files-from-my-itero-machine)

**Clinical references** (cited in body): Shillingburg "Fundamentals of Fixed Prosthodontics"; Misch "Contemporary Implant Dentistry"; Zarb-Bolender "Prosthodontic Treatment for Edentulous Patients"; McCracken's "Removable Partial Prosthodontics"; Stewart's "Removable Partial Dentures"; Dawson "Functional Occlusion"; Okeson TMD textbook; Gracis et al. provisional restoration consensus; AAOP, AAID, AAOMS, ITI, ADA, AAO published guidelines; Glidewell BruxZir Rx; Atlantis Rx form; Straumann CARES; Nobel NobelProcera; Ivoclar e.max scientific docs; Ivoclar BPS protocol; coDiagnostiX workflow; FDA 21 CFR 820; NADL Rx best practices.

**SaaS benchmarks** (referenced patterns from common knowledge of Linear, Stripe, Figma, Notion, Intercom, Asana, Salesforce Lightning, Ramp, Vercel, HubSpot, Pipedrive, Epic Hyperspace, SureSmile portal, Pearl AI, Overjet, Spark Aligners, Glidewell Direct, Sirona Connect, Henry Schein Lab portal, Zocdoc).

---

**Author note.** Section §B.4 (Imagery) is the single highest-impact upgrade beyond the per-service redesigns. Replacing material/shade/margin/connector dropdowns with visual catalogs would by itself move the perceived modernity of the product several notches — comparable to the jump from text-based Gmail to Inbox, or from the Stripe v1 dashboard to the v2 redesign.
