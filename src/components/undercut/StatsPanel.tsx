import React from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import type { UndercutAnalysis } from './types';

interface StatsPanelProps {
  analysis: UndercutAnalysis | null;
  isAnalyzing: boolean;
  onResetToOptimal: () => void;
}

function StatRow({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0' }}>
      <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>{label}</span>
      <span style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: color.textHeading }}>
        {value}{unit && <span style={{ fontSize: '10px', color: color.textSubtle, marginLeft: '2px' }}>{unit}</span>}
      </span>
    </div>
  );
}

function SeverityBar({ clear, minor, severe }: { clear: number; minor: number; severe: number }) {
  const total = clear + minor + severe || 1;
  return (
    <div style={{ display: 'flex', height: '8px', borderRadius: radius.full, overflow: 'hidden', backgroundColor: color.neutral100 }}>
      {clear > 0 && (
        <div style={{ width: `${(clear / total) * 100}%`, backgroundColor: 'var(--ads-text-success)' }} />
      )}
      {minor > 0 && (
        <div style={{ width: `${(minor / total) * 100}%`, backgroundColor: 'var(--ads-text-warning)' }} />
      )}
      {severe > 0 && (
        <div style={{ width: `${(severe / total) * 100}%`, backgroundColor: 'var(--ads-text-error)' }} />
      )}
    </div>
  );
}

function HeatmapLegend() {
  return (
    <div style={{ marginTop: space[3] }}>
      <div style={{ fontSize: '10px', color: color.textPlaceholder, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Heatmap Legend
      </div>
      <div style={{
        height: '12px', borderRadius: radius.full, overflow: 'hidden',
        background: 'linear-gradient(to right, var(--ads-text-success) 0%, var(--ads-text-success) 30%, var(--ads-text-warning) 50%, var(--ads-text-error) 80%, var(--ads-text-error) 100%)',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
        <span style={{ fontSize: '9px', color: color.textPlaceholder }}>Clear</span>
        <span style={{ fontSize: '9px', color: color.textPlaceholder }}>Minor (&lt;0.5mm)</span>
        <span style={{ fontSize: '9px', color: color.textPlaceholder }}>Severe (&gt;0.5mm)</span>
      </div>
    </div>
  );
}

export default function StatsPanel({ analysis, isAnalyzing, onResetToOptimal }: StatsPanelProps) {
  if (isAnalyzing) {
    return (
      <div style={{
        padding: space[4], backgroundColor: color.white,
        borderRadius: radius.lg, border: `1px solid ${color.borderDefault}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space[3],
      }}>
        <div style={{
          width: '32px', height: '32px', border: `3px solid ${color.neutral200}`,
          borderTopColor: color.primary, borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: font.size.sm, color: color.textSubtle }}>Analyzing undercuts...</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div style={{
        padding: space[4], backgroundColor: color.white,
        borderRadius: radius.lg, border: `1px solid ${color.borderDefault}`,
      }}>
        <div style={{ fontSize: font.size.sm, fontWeight: font.weight.bold, color: color.textHeading, marginBottom: space[2] }}>
          Analysis Results
        </div>
        <div style={{ fontSize: font.size.xs, color: color.textPlaceholder, textAlign: 'center', padding: `${space[4]} 0` }}>
          Select teeth and run analysis to see results
        </div>
      </div>
    );
  }

  const clearCount = analysis.regions.filter(r => r.severity === 'clear').length;
  const minorCount = analysis.regions.filter(r => r.severity === 'minor').length;
  const severeCount = analysis.regions.filter(r => r.severity === 'severe').length;

  // Compute tilt angle from Y axis
  const tiltDeg = Math.round(Math.acos(Math.min(1, Math.abs(analysis.insertionPath.direction[1]))) * (180 / Math.PI));

  return (
    <div style={{
      padding: space[4], backgroundColor: color.white,
      borderRadius: radius.lg, border: `1px solid ${color.borderDefault}`,
      display: 'flex', flexDirection: 'column', gap: space[2],
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: font.size.sm, fontWeight: font.weight.bold, color: color.textHeading }}>
          Analysis Results
        </div>
        {analysis.insertionPath.isOptimal ? (
          <span style={{
            padding: '2px 8px', borderRadius: radius.full, fontSize: '10px', fontWeight: 600,
            backgroundColor: 'var(--ads-background-highlight-green)', color: 'var(--ads-text-success)',
          }}>
            Optimal
          </span>
        ) : (
          <span style={{
            padding: '2px 8px', borderRadius: radius.full, fontSize: '10px', fontWeight: 600,
            backgroundColor: 'var(--ads-background-highlight-orange)', color: 'var(--ads-text-warning)',
          }}>
            Custom
          </span>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${color.borderDefault}`, paddingTop: space[2] }}>
        <StatRow label="Total Undercut Area" value={analysis.totalArea} unit="mm²" />
        <StatRow label="Max Undercut Depth" value={analysis.maxDepth} unit="mm" />
        <StatRow label="Preps Affected" value={`${analysis.percentAffected}%`} />
        <StatRow label="Path Tilt" value={`${tiltDeg}°`} />
      </div>

      {/* Severity breakdown */}
      <div style={{ borderTop: `1px solid ${color.borderDefault}`, paddingTop: space[2] }}>
        <div style={{ fontSize: '10px', color: color.textPlaceholder, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Severity Breakdown
        </div>
        <SeverityBar clear={clearCount} minor={minorCount} severe={severeCount} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '10px', color: 'var(--ads-text-success)' }}>{clearCount} clear</span>
          <span style={{ fontSize: '10px', color: 'var(--ads-text-warning)' }}>{minorCount} minor</span>
          <span style={{ fontSize: '10px', color: 'var(--ads-text-error)' }}>{severeCount} severe</span>
        </div>
      </div>

      <HeatmapLegend />

      {/* Reset button */}
      {!analysis.insertionPath.isOptimal && (
        <button
          onClick={onResetToOptimal}
          style={{
            marginTop: space[1], padding: '8px 0', border: `1px solid ${color.primary}`,
            borderRadius: radius.md, backgroundColor: 'transparent', cursor: 'pointer',
            fontSize: '12px', fontWeight: 600, color: color.primary,
            transition: `all ${transition.fast}`,
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = color.primary; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = color.primary; }}
        >
          Reset to Optimal Path
        </button>
      )}
    </div>
  );
}
