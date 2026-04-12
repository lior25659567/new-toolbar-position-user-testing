import React, { useState } from 'react';
import { color, font, space, radius, shadow, transition } from '../../design-system/tokens';
import { SecondaryButton } from '../../design-system/SecondaryButton';
import PatientReportPage from '../PatientReportPage';
import { FeatureTourGrid } from '../report/PatientReportDemoPage';

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
          <PatientReportPage onBackToHome={onBackToHub} />
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
