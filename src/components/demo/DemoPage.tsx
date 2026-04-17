import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { color, font, space, radius, shadow, transition } from '../../design-system/tokens';
import { IconButton } from '../../design-system/IconButton';
import PatientReportPage from '../PatientReportPage';
import type { PatientReportPageHandle } from '../PatientReportPage';
import { FeatureTourGrid } from '../report/PatientReportDemoPage';

import upperArchColor from '../../assets/button-images/review-tool/Color.png';
import lowerArchNiri from '../../assets/button-images/review-tool/Niri.png';
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

  // Keep stable IDs for blocks we'll update incrementally
  const img1Id = 'demo-img1';
  const img2Id = 'demo-img2';
  const compId = 'demo-comp';
  const notesId = 'demo-notes';
  const rxId = 'demo-rx';
  const costId = 'demo-cost';
  const instrId = 'demo-instr';
  const apptId = 'demo-appt';

  const initialSettings: ReportSettings = {
    reportName: 'Patient Report', doctorName: '', doctorImageUrl: '',
    clinicName: '', clinicLogoUrl: '', pinEnabled: false, pin: '',
    signatureUrl: '', signatureMethod: '',
  };
  const initialPatient: PatientInfo = { patientName: '', birthDate: '', chartNumber: '' };

  // Helper: update last block of given id
  const updateBlock = (blocks: DemoBlock[], id: string, updates: Partial<DemoBlock>): DemoBlock[] =>
    blocks.map((b) => b.id === id ? { ...b, ...updates } as DemoBlock : b);

  // Accumulate settings as we fill fields
  let s = { ...initialSettings };

  const steps: DemoStep[] = [
    // ═══ PHASE 1: DETAILS TAB ═══
    { label: 'Clicking Details tab...', delay: 700,
      cursor: { x: 28, y: 12 }, tab: 'settings',
      action: (ref) => { ref.setActiveTab('settings'); return []; },
      editorScroll: 'top' },

    { label: 'Clicking report name field...', delay: 600,
      cursor: { x: 18, y: 22 }, editorScroll: 'top',
      action: (_, b) => b },

    { label: 'Typing "Comprehensive Treatment Report"...', delay: 900,
      cursor: { x: 25, y: 22 }, editorScroll: 'top',
      action: (ref, b) => { s = { ...s, reportName: 'Comprehensive Treatment Report' }; ref.setSettings(s); return b; } },

    { label: 'Clicking doctor name field...', delay: 600,
      cursor: { x: 18, y: 34 }, editorScroll: 0.15,
      action: (_, b) => b },

    { label: 'Typing "Dr. Sarah Mitchell, DDS"...', delay: 900,
      cursor: { x: 28, y: 34 }, editorScroll: 0.15,
      action: (ref, b) => { s = { ...s, doctorName: 'Dr. Sarah Mitchell, DDS' }; ref.setSettings(s); return b; } },

    { label: 'Clicking clinic name field...', delay: 600,
      cursor: { x: 18, y: 46 }, editorScroll: 0.3,
      action: (_, b) => b },

    { label: 'Typing "Bright Smile Dental Clinic"...', delay: 900,
      cursor: { x: 28, y: 46 }, editorScroll: 0.3,
      action: (ref, b) => { s = { ...s, clinicName: 'Bright Smile Dental Clinic' }; ref.setSettings(s); return b; } },

    { label: 'Scrolling to patient section...', delay: 500,
      cursor: { x: 15, y: 55 }, editorScroll: 0.5,
      action: (_, b) => b },

    { label: 'Clicking patient name field...', delay: 600,
      cursor: { x: 18, y: 58 }, editorScroll: 0.5,
      action: (_, b) => b },

    { label: 'Typing "James Anderson"...', delay: 800,
      cursor: { x: 25, y: 58 },
      action: (ref, b) => { ref.setPatient({ patientName: 'James Anderson', birthDate: '', chartNumber: '' }); return b; } },

    { label: 'Filling date of birth...', delay: 700,
      cursor: { x: 18, y: 64 }, editorScroll: 0.6,
      action: (ref, b) => { ref.setPatient({ patientName: 'James Anderson', birthDate: '08/22/1979', chartNumber: '' }); return b; } },

    { label: 'Filling chart number...', delay: 700,
      cursor: { x: 18, y: 70 }, editorScroll: 0.65,
      action: (ref, b) => { ref.setPatient({ patientName: 'James Anderson', birthDate: '08/22/1979', chartNumber: '10042-A' }); return b; },
      previewScroll: 'bottom' },

    // ═══ PHASE 2: SWITCH TO REPORT TAB ═══
    { label: 'Clicking Report tab...', delay: 700,
      cursor: { x: 12, y: 12 }, tab: 'blocks',
      action: (ref) => { ref.setActiveTab('blocks'); return []; },
      editorScroll: 'top' },

    // ═══ PHASE 3: IMAGE 1 — Upper Arch ═══
    { label: 'Clicking "Add Section"...', delay: 700,
      cursor: { x: 18, y: 85 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Selecting "Image" from menu...', delay: 600,
      cursor: { x: 18, y: 78 },
      action: (ref, b) => {
        const nb: DemoBlock[] = [...b, { id: img1Id, type: 'image', collapsed: false, file: null, previewUrl: '', title: '', notes: '', teeth: [], diagnosis: '', treatment: '', estimatedCost: '', treatmentDate: '', annotations: [], showClinicalFields: false }];
        ref.setBlocks(nb); return nb;
      }, editorScroll: 'bottom' },

    { label: 'Scrolling to new image block...', delay: 600,
      cursor: { x: 15, y: 45 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Clicking "Choose from gallery"...', delay: 700,
      cursor: { x: 18, y: 48 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Gallery opened — browsing Full Arch Scans...', delay: 900,
      cursor: { x: 40, y: 40 },
      action: (_, b) => b },

    { label: 'Selecting upper arch color scan...', delay: 800,
      cursor: { x: 45, y: 45 },
      action: (ref, b) => { const nb = updateBlock(b, img1Id, { previewUrl: upperArchColor }); ref.setBlocks(nb); return nb; },
      editorScroll: 'bottom' },

    { label: 'Image loaded — clicking "Annotate"...', delay: 900,
      cursor: { x: 22, y: 42 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Annotation lightbox opened — selecting pen tool...', delay: 800,
      cursor: { x: 38, y: 15 },
      action: (_, b) => b },

    { label: 'Drawing circle around area of concern...', delay: 1200,
      cursor: { x: 50, y: 45 },
      action: (_, b) => b },

    { label: 'Adding text label "Plaque buildup"...', delay: 900,
      cursor: { x: 52, y: 42 },
      action: (_, b) => b },

    { label: 'Clicking "Save" to save annotation...', delay: 700,
      cursor: { x: 70, y: 88 },
      action: (_, b) => b, editorScroll: 'bottom' },

    { label: 'Clicking title field...', delay: 600,
      cursor: { x: 18, y: 55 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Typing "Upper arch — full color scan"...', delay: 800,
      cursor: { x: 25, y: 55 },
      action: (ref, b) => { const nb = updateBlock(b, img1Id, { title: 'Upper arch — full color scan' }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    { label: 'Opening tooth selector...', delay: 600,
      cursor: { x: 15, y: 42 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Clicking tooth 14 on chart...', delay: 700,
      cursor: { x: 12, y: 48 },
      action: (ref, b) => { const nb = updateBlock(b, img1Id, { teeth: [14] }); ref.setBlocks(nb); return nb; } },

    { label: 'Clicking tooth 15...', delay: 500,
      cursor: { x: 14, y: 48 },
      action: (ref, b) => { const nb = updateBlock(b, img1Id, { teeth: [14, 15] }); ref.setBlocks(nb); return nb; } },

    { label: 'Clicking tooth 16...', delay: 500,
      cursor: { x: 16, y: 48 },
      action: (ref, b) => { const nb = updateBlock(b, img1Id, { teeth: [14, 15, 16] }); ref.setBlocks(nb); return nb; } },

    { label: 'Clicking tooth 17...', delay: 500,
      cursor: { x: 18, y: 48 },
      action: (ref, b) => { const nb = updateBlock(b, img1Id, { teeth: [14, 15, 16, 17] }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    { label: 'Clicking notes field...', delay: 600,
      cursor: { x: 18, y: 62 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Writing clinical notes...', delay: 800,
      cursor: { x: 25, y: 65 },
      action: (ref, b) => { const nb = updateBlock(b, img1Id, { notes: 'Full arch scan captured with iTero Element 5D. Mild plaque on lingual surfaces.' }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    { label: 'Expanding clinical details...', delay: 600,
      cursor: { x: 12, y: 72 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Filling diagnosis and treatment...', delay: 900,
      cursor: { x: 18, y: 76 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, img1Id, { showClinicalFields: true, diagnosis: 'Mild gingivitis', treatment: 'Professional cleaning', estimatedCost: '$180', treatmentDate: '2026-04-20' }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    // ═══ PHASE 4: IMAGE 2 — NIRI ═══
    { label: 'Clicking "Add Section"...', delay: 700,
      cursor: { x: 18, y: 88 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Selecting "Image"...', delay: 600,
      cursor: { x: 18, y: 80 },
      action: (ref, b) => {
        const nb: DemoBlock[] = [...b, { id: img2Id, type: 'image', collapsed: false, file: null, previewUrl: '', title: '', notes: '', teeth: [], diagnosis: '', treatment: '', estimatedCost: '', treatmentDate: '', annotations: [], showClinicalFields: false }];
        ref.setBlocks(nb); return nb;
      }, editorScroll: 'bottom' },

    { label: 'Clicking "Choose from gallery"...', delay: 700,
      cursor: { x: 18, y: 48 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Gallery opened — browsing NIRI & Diagnostics...', delay: 900,
      cursor: { x: 35, y: 60 },
      action: (_, b) => b },

    { label: 'Selecting lower arch NIRI scan...', delay: 800,
      cursor: { x: 40, y: 65 },
      action: (ref, b) => { const nb = updateBlock(b, img2Id, { previewUrl: lowerArchNiri }); ref.setBlocks(nb); return nb; },
      editorScroll: 'bottom' },

    { label: 'Typing title...', delay: 700,
      cursor: { x: 18, y: 58 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, img2Id, { title: 'Lower arch — NIRI transillumination' }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    { label: 'Opening tooth selector...', delay: 600,
      cursor: { x: 15, y: 44 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Clicking tooth 36 on chart...', delay: 700,
      cursor: { x: 16, y: 52 },
      action: (ref, b) => { const nb = updateBlock(b, img2Id, { teeth: [36] }); ref.setBlocks(nb); return nb; } },

    { label: 'Clicking tooth 37...', delay: 500,
      cursor: { x: 18, y: 52 },
      action: (ref, b) => { const nb = updateBlock(b, img2Id, { teeth: [36, 37] }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    { label: 'Writing notes and filling clinical data...', delay: 1000,
      cursor: { x: 18, y: 65 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, img2Id, { notes: 'Early interproximal lesion between teeth 36-37.', showClinicalFields: true, diagnosis: 'Early caries (E1)', treatment: 'Fluoride varnish + 6-month review', estimatedCost: '$60', treatmentDate: '2026-04-20' }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    // ═══ PHASE 5: BEFORE/AFTER ═══
    { label: 'Clicking "Add Section"...', delay: 700,
      cursor: { x: 18, y: 88 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Selecting "Before / After"...', delay: 600,
      cursor: { x: 18, y: 80 },
      action: (ref, b) => {
        const nb: DemoBlock[] = [...b, { id: compId, type: 'comparison', collapsed: false, labelA: 'Before', labelB: 'After', imageA: { file: null, previewUrl: '' }, imageB: { file: null, previewUrl: '' }, notes: '' }];
        ref.setBlocks(nb); return nb;
      }, editorScroll: 'bottom' },

    { label: 'Uploading "Before" image...', delay: 800,
      cursor: { x: 12, y: 50 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, compId, { imageA: { file: null, previewUrl: prepModel1 }, labelA: 'Before treatment (Jan 2026)' }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    { label: 'Uploading "After" image...', delay: 800,
      cursor: { x: 25, y: 50 },
      action: (ref, b) => { const nb = updateBlock(b, compId, { imageB: { file: null, previewUrl: prepModel2 }, labelB: 'After treatment (Apr 2026)' }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    { label: 'Writing comparison notes...', delay: 800,
      cursor: { x: 18, y: 68 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, compId, { notes: 'Crown prep on tooth #5. Significant improvement in margin definition.' }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    // ═══ PHASE 6: NOTES ═══
    { label: 'Clicking "Add Section"...', delay: 700,
      cursor: { x: 18, y: 88 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Selecting "Notes"...', delay: 600,
      cursor: { x: 18, y: 80 },
      action: (ref, b) => {
        const nb: DemoBlock[] = [...b, { id: notesId, type: 'notes', collapsed: false, content: '' }];
        ref.setBlocks(nb); return nb;
      }, editorScroll: 'bottom' },

    { label: 'Clicking notes text area...', delay: 500,
      cursor: { x: 18, y: 55 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Writing clinical notes...', delay: 1000,
      cursor: { x: 25, y: 60 },
      action: (ref, b) => { const nb = updateBlock(b, notesId, { content: 'Patient presented for crown preparation and periodontal follow-up. Oral hygiene improved since last visit. Reduced sensitivity on upper right after fluoride treatment. Discussed implant for site #19 — patient prefers to wait 6 months.' }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    // ═══ PHASE 7: PRESCRIPTION ═══
    { label: 'Clicking "Add Section"...', delay: 700,
      cursor: { x: 18, y: 88 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Selecting "Prescription"...', delay: 600,
      cursor: { x: 18, y: 80 },
      action: (ref, b) => {
        const nb: DemoBlock[] = [...b, { id: rxId, type: 'rx', collapsed: false, notes: '', items: [{ id: uid(), medication: '', dosage: '', frequency: '', duration: '' }] }];
        ref.setBlocks(nb); return nb;
      }, editorScroll: 'bottom' },

    { label: 'Typing first medication — Amoxicillin 500mg...', delay: 900,
      cursor: { x: 15, y: 55 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, rxId, { items: [{ id: uid(), medication: 'Amoxicillin', dosage: '500mg', frequency: '3x daily', duration: '7 days' }] }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    { label: 'Adding Ibuprofen 400mg...', delay: 800,
      cursor: { x: 12, y: 65 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, rxId, { items: [{ id: uid(), medication: 'Amoxicillin', dosage: '500mg', frequency: '3x daily', duration: '7 days' }, { id: uid(), medication: 'Ibuprofen', dosage: '400mg', frequency: 'Every 6 hrs PRN', duration: '5 days' }] }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    { label: 'Adding Chlorhexidine rinse...', delay: 800,
      cursor: { x: 12, y: 72 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, rxId, { items: [{ id: uid(), medication: 'Amoxicillin', dosage: '500mg', frequency: '3x daily', duration: '7 days' }, { id: uid(), medication: 'Ibuprofen', dosage: '400mg', frequency: 'Every 6 hrs PRN', duration: '5 days' }, { id: uid(), medication: 'Chlorhexidine 0.12%', dosage: '15ml', frequency: '2x daily', duration: '14 days' }], notes: 'NKDA. Verify no interactions with Lisinopril 10mg.' }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    // ═══ PHASE 8: COST SUMMARY ═══
    { label: 'Clicking "Add Section"...', delay: 700,
      cursor: { x: 18, y: 88 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Selecting "Summary"...', delay: 600,
      cursor: { x: 18, y: 80 },
      action: (ref, b) => {
        const nb: DemoBlock[] = [...b, { id: costId, type: 'cost-summary', collapsed: false, items: [{ id: uid(), description: '', amount: '' }] }];
        ref.setBlocks(nb); return nb;
      }, editorScroll: 'bottom' },

    { label: 'Adding exam and X-ray items...', delay: 800,
      cursor: { x: 18, y: 55 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, costId, { items: [{ id: uid(), description: 'Comprehensive oral exam (D0150)', amount: '$120' }, { id: uid(), description: 'Periapical X-rays x4 (D0220)', amount: '$80' }] }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    { label: 'Adding prophylaxis and crown prep...', delay: 800,
      cursor: { x: 18, y: 62 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, costId, { items: [{ id: uid(), description: 'Comprehensive oral exam (D0150)', amount: '$120' }, { id: uid(), description: 'Periapical X-rays x4 (D0220)', amount: '$80' }, { id: uid(), description: 'Prophylaxis — adult (D1110)', amount: '$180' }, { id: uid(), description: 'Crown prep — ceramic (D2740)', amount: '$1,200' }] }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    { label: 'Adding fluoride and temp crown...', delay: 800,
      cursor: { x: 18, y: 70 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, costId, { items: [{ id: uid(), description: 'Comprehensive oral exam (D0150)', amount: '$120' }, { id: uid(), description: 'Periapical X-rays x4 (D0220)', amount: '$80' }, { id: uid(), description: 'Prophylaxis — adult (D1110)', amount: '$180' }, { id: uid(), description: 'Crown prep — ceramic (D2740)', amount: '$1,200' }, { id: uid(), description: 'Fluoride varnish (D1206)', amount: '$60' }, { id: uid(), description: 'Temporary crown (D2999)', amount: '$250' }] }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    // ═══ PHASE 9: PATIENT INSTRUCTIONS ═══
    { label: 'Clicking "Add Section"...', delay: 700,
      cursor: { x: 18, y: 88 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Selecting "Patient Instructions"...', delay: 600,
      cursor: { x: 18, y: 82 },
      action: (ref, b) => {
        const nb: DemoBlock[] = [...b, { id: instrId, type: 'patient-instructions', collapsed: false, title: 'Post-Treatment Care', items: [{ id: uid(), text: '' }] }];
        ref.setBlocks(nb); return nb;
      }, editorScroll: 'bottom' },

    { label: 'Adding first 3 instructions...', delay: 900,
      cursor: { x: 18, y: 55 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, instrId, { items: [{ id: uid(), text: 'Avoid eating for 30 min after fluoride' }, { id: uid(), text: 'No hard or sticky foods on temp crown' }, { id: uid(), text: 'Brush gently around temporary crown' }] }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    { label: 'Adding remaining instructions...', delay: 900,
      cursor: { x: 18, y: 68 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, instrId, { title: 'Post-Treatment Care Instructions', items: [{ id: uid(), text: 'Avoid eating for 30 min after fluoride' }, { id: uid(), text: 'No hard or sticky foods on temp crown' }, { id: uid(), text: 'Brush gently around temporary crown' }, { id: uid(), text: 'Use chlorhexidine rinse 2x daily for 2 weeks' }, { id: uid(), text: 'Complete full Amoxicillin course' }, { id: uid(), text: 'Contact us if temp crown loosens' }, { id: uid(), text: 'Ibuprofen as needed for sensitivity' }] }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    // ═══ PHASE 10: NEXT APPOINTMENT ═══
    { label: 'Clicking "Add Section"...', delay: 700,
      cursor: { x: 18, y: 88 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Selecting "Next Appointment"...', delay: 600,
      cursor: { x: 18, y: 84 },
      action: (ref, b) => {
        const nb: DemoBlock[] = [...b, { id: apptId, type: 'next-appointment', collapsed: false, date: '', time: '', procedure: '', instructions: '' }];
        ref.setBlocks(nb); return nb;
      }, editorScroll: 'bottom' },

    { label: 'Setting date — May 8, 2026...', delay: 700,
      cursor: { x: 15, y: 55 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, apptId, { date: 'May 8, 2026' }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    { label: 'Setting time — 10:30 AM...', delay: 600,
      cursor: { x: 25, y: 55 },
      action: (ref, b) => { const nb = updateBlock(b, apptId, { time: '10:30 AM' }); ref.setBlocks(nb); return nb; } },

    { label: 'Typing procedure details...', delay: 800,
      cursor: { x: 18, y: 65 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, apptId, { procedure: 'Permanent crown cementation + periodontal re-eval' }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    { label: 'Adding pre-visit instructions...', delay: 800,
      cursor: { x: 18, y: 72 }, editorScroll: 'bottom',
      action: (ref, b) => { const nb = updateBlock(b, apptId, { instructions: 'Arrive 10 min early. Bring current medication list.' }); ref.setBlocks(nb); return nb; },
      previewScroll: 'bottom' },

    // ═══ PHASE 11: SIGNATURE & SECURITY ═══
    { label: 'Clicking Details tab...', delay: 700,
      cursor: { x: 28, y: 12 }, tab: 'settings',
      action: (ref, b) => { ref.setActiveTab('settings'); return b; },
      editorScroll: 0.6 },

    { label: 'Scrolling to signature section...', delay: 700,
      cursor: { x: 15, y: 65 }, editorScroll: 0.65,
      action: (_, b) => b },

    { label: 'Clicking "Draw signature"...', delay: 800,
      cursor: { x: 18, y: 68 }, editorScroll: 0.7,
      action: (_, b) => b },

    { label: 'Drawing signature...', delay: 1200,
      cursor: { x: 22, y: 72 },
      action: (ref, b) => {
        // Create a fake signature as SVG data URL
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80"><path d="M20 55 Q40 20 60 50 Q80 80 100 40 Q120 10 140 45 Q155 65 170 35 Q185 15 200 50 Q215 70 235 30 Q250 10 270 45" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/></svg>`;
        const sigUrl = 'data:image/svg+xml,' + encodeURIComponent(svg);
        s = { ...s, signatureUrl: sigUrl, signatureMethod: 'draw' };
        ref.setSettings(s);
        return b;
      }, editorScroll: 0.75 },

    { label: 'Signature saved!', delay: 600,
      cursor: { x: 20, y: 75 },
      action: (_, b) => b, previewScroll: 'bottom' },

    { label: 'Scrolling to security section...', delay: 600,
      cursor: { x: 15, y: 80 }, editorScroll: 'bottom',
      action: (_, b) => b },

    { label: 'Enabling PIN toggle...', delay: 700,
      cursor: { x: 12, y: 83 }, editorScroll: 'bottom',
      action: (ref, b) => { s = { ...s, pinEnabled: true }; ref.setSettings(s); return b; } },

    { label: 'Entering PIN: 4-2-8-1...', delay: 900,
      cursor: { x: 18, y: 88 }, editorScroll: 'bottom',
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
            backgroundColor: '#E0F2FE',
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

// ─── Patient Report demo (tabbed) ────────────────────────────────────────────

// Static feature explanations shown in the "Features" tab
const PATIENT_REPORT_FEATURES: { title: string; summary: string; details: string[] }[] = [
  {
    title: 'Report Templates',
    summary: 'Start from a pre-built template tailored to common procedures so reports take seconds, not minutes.',
    details: [
      'General Scan, Implant Planning, Crown Prep and Follow-up included out of the box.',
      'Each template seeds the right sections and placeholder content for the procedure.',
      'You can switch templates without losing your edits — your previous content is restored.',
    ],
  },
  {
    title: 'Media Gallery',
    summary: 'Upload a clinical photo or pick from a curated gallery of pre-loaded scans.',
    details: [
      'Categorized library: Full Arch, Prep & Review, Diagnostics.',
      'Drag-and-drop upload, plus paste from clipboard support.',
      'Re-use the same image across multiple sections.',
    ],
  },
  {
    title: 'Image Annotation',
    summary: 'Highlight findings directly on the image with pen, arrow and text tools.',
    details: [
      'Adjustable brush size and color picker.',
      'Annotations are saved with the image — no separate layer to manage.',
      'Lightbox view lets you annotate full-size before saving back.',
    ],
  },
  {
    title: 'Interactive Tooth Chart',
    summary: 'Tag each treatment plan to specific teeth with a click on a full-mouth FDI chart.',
    details: [
      'Both arches in a single SVG with FDI numbering on every tooth.',
      'Click to toggle, hover preview, multiple selections per section.',
      'Selected teeth flow into the report preview as tags.',
    ],
  },
  {
    title: 'Multi-Section Builder',
    summary: 'Compose reports from image, notes, diagnosis, treatment, cost and before/after sections.',
    details: [
      'Reorder via drag handle, duplicate or delete any section.',
      'Collapse sections to focus on what you’re editing.',
      'Each section type has its own dedicated editor.',
    ],
  },
  {
    title: 'Before / After Comparison',
    summary: 'Side-by-side image comparison with custom labels for treatment progression.',
    details: [
      'Default Before / After labels — rename to anything ("Initial", "Week 6").',
      'Optional notes field for explaining what changed.',
      'Renders cleanly in the PDF export.',
    ],
  },
  {
    title: 'Cost Summary',
    summary: 'Build itemized price tables for treatment estimates with live totals.',
    details: [
      'Add unlimited line items with description and amount.',
      'Total recalculates instantly as you type.',
      'Currency-agnostic — type whatever symbol you need.',
    ],
  },
  {
    title: 'Signature Options',
    summary: 'Add your signature by uploading an image, drawing freehand, or reusing a saved one.',
    details: [
      'Upload PNG / JPG transparent signatures.',
      'Draw directly on a canvas with mouse or touch.',
      '"Saved" option lets you re-use the last signature without re-drawing.',
    ],
  },
  {
    title: 'Editable Header',
    summary: 'Edit doctor, clinic and patient names right from the header — no settings panel needed.',
    details: [
      'Inline-editable chips with a pen-icon affordance on hover.',
      'Updates flow into the live preview and the exported PDF.',
      'Defaults are seeded so a new report is presentable immediately.',
    ],
  },
  {
    title: 'Share & Export',
    summary: 'Share the report via link, email, WhatsApp, WeChat (QR), SMS, or export a clean PDF.',
    details: [
      'Auto-generated shareable URL with copy-to-clipboard confirmation.',
      'PDF export captures the full preview with consistent typography.',
      'Each share method opens the right native picker / app.',
    ],
  },
  {
    title: 'PIN Protection',
    summary: 'Add an optional 4-6 digit PIN so only the patient can open the shared report.',
    details: [
      'Toggle in Settings — disabled by default.',
      'Required before the recipient can view any content.',
      'PIN is shown in the share modal so you can hand it over verbally.',
    ],
  },
];

function FeatureList() {
  return (
    <div style={{ padding: space[6], maxWidth: 900, margin: '0 auto', fontFamily: font.family }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: space[4] }}>
        {PATIENT_REPORT_FEATURES.map((f, i) => (
          <div key={f.title} style={{
            display: 'flex',
            gap: space[4],
            padding: space[5],
            backgroundColor: color.white,
            border: `1px solid ${color.borderDefault}`,
            borderRadius: radius.lg,
            boxShadow: shadow.sm,
          }}>
            <div style={{
              flexShrink: 0,
              width: 36,
              height: 36,
              borderRadius: radius.full,
              backgroundColor: '#E0F2FE',
              color: color.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: font.size.sm,
              fontWeight: font.weight.semibold,
            }}>{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: font.size.base, fontWeight: font.weight.semibold, color: color.textHeading }}>
                {f.title}
              </div>
              <div style={{ fontSize: font.size.sm, color: color.textSubtle, marginTop: space[1], lineHeight: '1.5' }}>
                {f.summary}
              </div>
              <ul style={{
                margin: `${space[3]} 0 0`,
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: space[1],
              }}>
                {f.details.map((d, j) => (
                  <li key={j} style={{
                    fontSize: font.size.xs,
                    color: color.textDefault,
                    paddingLeft: space[4],
                    position: 'relative',
                    lineHeight: '1.55',
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      top: 7,
                      width: 6,
                      height: 6,
                      borderRadius: radius.full,
                      backgroundColor: color.primary,
                    }} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PatientReportDemo({ onBackToHub }: { onBackToHub: () => void }) {
  const [tab, setTab] = useState<'features' | 'tour' | 'full'>('features');

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
            onClick={onBackToHub}
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
              Patient Report
            </div>
            <div style={{ fontSize: font.size.xs, color: color.textSubtle, marginTop: 2 }}>
              {tab === 'features'
                ? 'A short explanation of every feature in the Patient Report.'
                : tab === 'tour'
                  ? 'Play each feature card to see how it works in isolation.'
                  : 'The real interactive report — all features available for hands-on exploration.'}
            </div>
          </div>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'flex',
          padding: 4,
          borderRadius: radius.md,
          backgroundColor: color.neutral100,
          gap: 2,
        }}>
          {(['features', 'tour', 'full'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              style={{
                padding: `${space[2]} ${space[4]}`,
                border: 'none',
                borderRadius: radius.sm,
                backgroundColor: tab === t ? color.white : 'transparent',
                boxShadow: tab === t ? shadow.sm : 'none',
                color: tab === t ? color.textHeading : color.textSubtle,
                fontFamily: font.family,
                fontSize: font.size.xs,
                fontWeight: font.weight.semibold,
                cursor: 'pointer',
                transition: `all ${transition.fast}`,
              }}
            >
              {t === 'features' ? 'Features' : t === 'tour' ? 'Feature Tour' : 'Full Report'}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tab === 'features' && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <FeatureList />
          </div>
        )}
        {tab === 'tour' && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <FeatureTourGrid />
          </div>
        )}
        {tab === 'full' && (
          <FullReportDemo onBack={onBackToHub} />
        )}
      </div>
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
