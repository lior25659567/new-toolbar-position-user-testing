import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { User, CheckCircle2, Plus } from 'lucide-react';
import { color } from '../../design-system/tokens';
import type { ReportBlock, PatientInfo, ReportSettings, BlockType } from './types';
import { BLOCK_TYPE_TINT } from './blockTheme';
import { BlockTypeIcon } from './BlockNavList';
import { AddBlockMenu } from './BlockEditor';
import ReportWorkflowNode, { type WorkflowNodeData } from './ReportWorkflowNode';

const START_TINT = { bg: color.tagBlue.bg, fg: color.tagBlue.text };
const END_TINT = { bg: color.tagGreen.bg, fg: color.tagGreen.text };
const FALLBACK_TINT = { bg: 'var(--ads-background-subtle-01, #eef0f3)', fg: 'var(--ads-text-secondary, #5b626d)' };

const TYPE_LABEL: Record<string, string> = {
  image: 'Image',
  comparison: 'Before / After',
  'cost-summary': 'Cost summary',
  notes: 'Notes',
  'section-title': 'Section',
  diagnosis: 'Diagnosis',
  treatment: 'Treatment',
  rx: 'Prescription',
  'next-appointment': 'Next appointment',
  'patient-instructions': 'Patient instructions',
};

const excerpt = (s: string, n = 40) => {
  const t = (s || '').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n - 1) + '…' : t;
};

// ── Add-block node: renders the report's real AddBlockMenu palette ──
function AddBlockNode({ data }: { data: { onAdd: (t: BlockType) => void } }) {
  return (
    <div style={{ width: 256, fontFamily: 'var(--ads-font-sans)' }}>
      <Handle type="target" position={Position.Top} style={{ width: 7, height: 7, background: 'var(--ads-border-accent, #c7ccd4)', border: '1.5px solid #fff' }} />
      <AddBlockMenu
        onAdd={data.onAdd}
        renderTrigger={({ toggle, ref }) => (
          <button
            ref={ref}
            type="button"
            className="nodrag nopan"
            onClick={toggle}
            style={{
              width: '100%',
              minHeight: 52,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 'var(--ads-radius-md, 12px)',
              border: '1.5px dashed var(--ads-border-accent, #c7ccd4)',
              background: 'var(--ads-bg-surface, #fff)',
              color: 'var(--ads-text-link, #2563eb)',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={16} strokeWidth={2.2} />
            Add block
          </button>
        )}
      />
      <Handle type="source" position={Position.Bottom} style={{ width: 7, height: 7, background: 'var(--ads-border-accent, #c7ccd4)', border: '1.5px solid #fff' }} />
    </div>
  );
}

const nodeTypes = { report: ReportWorkflowNode, add: AddBlockNode };

// Map a report block → node card data (DS tint + report's BlockTypeIcon).
function blockToData(block: ReportBlock, index: number, onOpen: () => void, onRemove: () => void): WorkflowNodeData {
  const tint = BLOCK_TYPE_TINT[block.type] ?? FALLBACK_TINT;
  const icon = <BlockTypeIcon type={block.type} size={17} />;
  const base = { kind: 'block' as const, tint, icon, index, title: TYPE_LABEL[block.type] ?? 'Block', onOpen, onRemove };

  switch (block.type) {
    case 'image':
      return { ...base, badge: block.teeth.length ? `${block.teeth.length} ${block.teeth.length === 1 ? 'tooth' : 'teeth'}` : undefined, thumb: block.previewUrl || null, lines: [block.title ? excerpt(block.title) : block.notes ? excerpt(block.notes) : 'Untitled image'] };
    case 'comparison':
      return { ...base, thumb: block.imageA?.previewUrl || null, thumbB: block.imageB?.previewUrl || null, lines: [`${block.labelA || 'Before'} → ${block.labelB || 'After'}`] };
    case 'cost-summary':
      return { ...base, lines: [block.content ? excerpt(block.content) : 'No amounts yet'] };
    case 'notes':
      return { ...base, lines: [block.content ? excerpt(block.content, 56) : 'Empty note'] };
    case 'section-title':
      return { ...base, title: block.title ? excerpt(block.title, 26) : 'Section' };
    case 'diagnosis':
      return { ...base, badge: block.severity || undefined, lines: [block.diagnosis ? excerpt(block.diagnosis) : 'No diagnosis'] };
    case 'treatment':
      return { ...base, badge: block.estimatedCost || undefined, lines: [block.treatment ? excerpt(block.treatment) : 'No treatment'] };
    case 'rx':
      return { ...base, badge: block.items.length ? `${block.items.length} med${block.items.length === 1 ? '' : 's'}` : undefined, lines: [block.items.length ? excerpt(block.items[0].medication || 'Medication') : 'No medications'] };
    case 'next-appointment': {
      const apptLines = [
        block.date ? `${block.date}${block.time ? ` · ${block.time}` : ''}` : 'No date set',
        block.procedure ? excerpt(block.procedure) : '',
      ].filter(Boolean) as string[];
      return { ...base, lines: apptLines };
    }
    case 'patient-instructions':
      return { ...base, title: block.title ? excerpt(block.title, 24) : 'Patient instructions', badge: block.items.length ? `${block.items.length} step${block.items.length === 1 ? '' : 's'}` : undefined, lines: [block.items.length ? excerpt(block.items[0].text || 'Step 1') : 'No steps'] };
    default:
      return base;
  }
}

interface Props {
  settings: ReportSettings;
  patient: PatientInfo;
  blocks: ReportBlock[];
  onExit: () => void;
  onAddBlock: (type: BlockType) => void;
  onDeleteBlock: (id: string) => void;
  onOpenBlock: (id: string) => void;
}

const NODE_GAP = 172;

const edgeBase = {
  type: 'smoothstep' as const,
  markerEnd: { type: MarkerType.ArrowClosed, color: '#b9c0cb', width: 16, height: 16 },
  style: { stroke: '#b9c0cb', strokeWidth: 1.6 },
};

export default function ReportWorkflowView({ settings, patient, blocks, onExit, onAddBlock, onDeleteBlock, onOpenBlock }: Props) {
  const { nodes, edges } = useMemo(() => {
    const ns: Node[] = [];
    const es: Edge[] = [];
    const link = (source: string, target: string) => es.push({ id: `e-${source}-${target}`, source, target, ...edgeBase });

    ns.push({
      id: 'start', type: 'report', position: { x: 0, y: 0 },
      data: {
        kind: 'start', tint: START_TINT, icon: <User size={17} strokeWidth={1.8} />,
        title: settings.reportName || 'Patient Report', badge: 'Report',
        lines: [settings.clinicName || 'Clinic', settings.doctorName || 'Doctor', patient.patientName ? `${patient.patientName}${patient.chartNumber ? ` · ${patient.chartNumber}` : ''}` : 'No patient'],
      } as unknown as Record<string, unknown>,
    });

    let prev = 'start';
    blocks.forEach((block, i) => {
      const id = block.id || `block-${i}`;
      ns.push({
        id, type: 'report', position: { x: 0, y: (i + 1) * NODE_GAP },
        data: blockToData(block, i + 1, () => onOpenBlock(id), () => onDeleteBlock(id)) as unknown as Record<string, unknown>,
      });
      link(prev, id);
      prev = id;
    });

    // "+ Add block" node — appends via the report's real palette.
    const addId = 'add';
    ns.push({ id: addId, type: 'add', position: { x: 2, y: (blocks.length + 1) * NODE_GAP }, data: { onAdd: onAddBlock } as unknown as Record<string, unknown> });
    link(prev, addId);

    const endId = 'end';
    ns.push({
      id: endId, type: 'report', position: { x: 0, y: (blocks.length + 2) * NODE_GAP },
      data: {
        kind: 'end', tint: END_TINT, icon: <CheckCircle2 size={17} strokeWidth={1.8} />,
        title: 'Sign & Share', badge: 'Finish',
        lines: [settings.signatureUrl ? 'Signed' : 'Awaiting signature', settings.pinEnabled ? 'PIN protected' : 'No PIN'],
      } as unknown as Record<string, unknown>,
    });
    link(addId, endId);

    return { nodes: ns, edges: es };
  }, [settings, patient, blocks, onAddBlock, onDeleteBlock, onOpenBlock]);

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--ads-bg-page, #f7f8fa)', fontFamily: 'var(--ads-font-sans)' }}>
      {/* Top bar */}
      <div
        style={{
          height: 56, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px',
          background: 'var(--ads-bg-surface, #fff)', borderBottom: '1px solid var(--ads-border-subtle, #e6e8ec)', zIndex: 5,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ width: 28, height: 28, borderRadius: 8, display: 'grid', placeItems: 'center', background: color.tagBlue.bg, color: color.tagBlue.text }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><path d="M10 6.5h4a3 3 0 0 1 3 3V14" />
            </svg>
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ads-text-primary, #14181f)' }}>Report workflow</span>
            <span style={{ fontSize: 11.5, color: 'var(--ads-text-secondary, #5b626d)' }}>{settings.reportName || 'Patient Report'}</span>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11.5, color: 'var(--ads-text-muted, #9aa0a8)' }}>press <kbd style={{ fontFamily: 'inherit', fontWeight: 600 }}>1</kbd> to toggle · click a node to edit</span>
        <button
          type="button"
          onClick={onExit}
          style={{
            height: 34, padding: '0 14px', borderRadius: 8, border: '1px solid var(--ads-border-subtle, #d8dbe0)',
            background: 'var(--ads-bg-surface, #fff)', color: 'var(--ads-text-primary, #14181f)', fontFamily: 'inherit',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3L5 8l5 5" /></svg>
          Back to editor
        </button>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.28 }}
          minZoom={0.3}
          maxZoom={1.6}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1.5} color="var(--ads-border-subtle, #dfe2e7)" />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
      </div>
    </div>
  );
}
