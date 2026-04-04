import React from 'react';
import { color, font, space, radius, shadow } from '../../design-system/tokens';
import type { PatientInfo, ReportSettings, ImageBlock, ComparisonBlock, CostSummaryBlock } from './types';
import iteroLogo from '../../assets/iTero logo.png';

type SupportedBlock = ImageBlock | ComparisonBlock | CostSummaryBlock;

// ─── Preview sub-components ──────────────────────────────────────────────────

function PreviewTeethTags({ teeth }: { teeth: number[] }) {
  if (teeth.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: space[2] }}>
      <span style={{ fontSize: '10px', color: color.textSubtle, marginRight: '4px', lineHeight: '20px' }}>Teeth:</span>
      {teeth.map((t) => (
        <span key={t} style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: `2px 8px`,
          fontSize: '10px',
          fontWeight: 500,
          color: '#374151',
          backgroundColor: '#F9FAFB',
          border: `1px solid ${color.borderDefault}`,
          borderRadius: '9999px',
        }}>
          {t}
        </span>
      ))}
    </div>
  );
}

function PreviewClinicalRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: space[2], fontSize: '10px', lineHeight: '1.5' }}>
      <span style={{ color: color.textSubtle, fontWeight: 500, minWidth: '70px' }}>{label}:</span>
      <span style={{ color: color.textDefault }}>{value}</span>
    </div>
  );
}

// ─── Block Previews ─────────────────────────────────────────────────────────

function ImageBlockPreview({ block }: { block: ImageBlock }) {
  return (
    <div style={{ marginBottom: space[4] }}>
      {block.title && (
        <div style={{ fontSize: '11px', fontWeight: 600, color: color.textHeading, marginBottom: space[1] }}>
          {block.title}
        </div>
      )}
      {block.previewUrl ? (
        <img
          src={block.previewUrl}
          alt={block.title || 'Clinical image'}
          style={{
            width: '100%',
            maxHeight: '200px',
            objectFit: 'contain',
            borderRadius: '8px',
            backgroundColor: color.neutral50,
            display: 'block',
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '80px',
          backgroundColor: color.neutral50,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color.textPlaceholder,
          fontSize: '10px',
        }}>
          No image
        </div>
      )}
      {block.notes && (
        <div style={{
          fontSize: '10px',
          color: color.textDefault,
          lineHeight: '1.5',
          marginTop: space[2],
          paddingLeft: space[3],
          borderLeft: `2px solid ${color.primary}`,
        }}>
          {block.notes}
        </div>
      )}
      <PreviewTeethTags teeth={block.teeth} />
      {(block.diagnosis || block.treatment || block.estimatedCost || block.treatmentDate) && (
        <div style={{
          marginTop: space[2],
          padding: space[3],
          backgroundColor: color.neutral50,
          borderRadius: '8px',
          border: `1px solid ${color.borderDefault}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <PreviewClinicalRow label="Diagnosis" value={block.diagnosis} />
          <PreviewClinicalRow label="Treatment" value={block.treatment} />
          <PreviewClinicalRow label="Est. Cost" value={block.estimatedCost} />
          <PreviewClinicalRow label="Date" value={block.treatmentDate} />
        </div>
      )}
    </div>
  );
}

function ComparisonBlockPreview({ block }: { block: ComparisonBlock }) {
  const renderSide = (img: { previewUrl: string }, label: string) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '10px', fontWeight: 600, color: color.textLabel, textAlign: 'center', marginBottom: space[1] }}>
        {label}
      </div>
      {img.previewUrl ? (
        <img src={img.previewUrl} alt={label} style={{
          width: '100%', height: '100px', objectFit: 'contain',
          borderRadius: '8px', backgroundColor: color.neutral50, display: 'block',
        }} />
      ) : (
        <div style={{
          width: '100%', height: '100px', backgroundColor: color.neutral50,
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color.textPlaceholder, fontSize: '10px',
        }}>
          No image
        </div>
      )}
    </div>
  );

  return (
    <div style={{ marginBottom: space[4] }}>
      <div style={{ display: 'flex', gap: space[2] }}>
        {renderSide(block.imageA, block.labelA || 'Before')}
        {renderSide(block.imageB, block.labelB || 'After')}
      </div>
      {block.notes && (
        <div style={{
          fontSize: '10px', color: color.textDefault, lineHeight: '1.5',
          marginTop: space[2], paddingLeft: space[2], borderLeft: `2px solid ${color.neutral200}`,
        }}>
          {block.notes}
        </div>
      )}
    </div>
  );
}

function CostSummaryBlockPreview({ block }: { block: CostSummaryBlock }) {
  const total = block.items.reduce((sum, it) => {
    const n = parseFloat(it.amount.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);
  const hasContent = block.items.some((it) => it.description || it.amount);

  if (!hasContent) return null;

  return (
    <div style={{ marginBottom: space[4] }}>
      <table style={{
        width: '100%',
        fontSize: '10px',
        borderCollapse: 'collapse',
        color: color.textDefault,
      }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${color.borderDefault}` }}>
            <th style={{ textAlign: 'left', padding: '4px 0', fontWeight: 600, color: color.textLabel }}>Item</th>
            <th style={{ textAlign: 'right', padding: '4px 0', fontWeight: 600, color: color.textLabel, width: '80px' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {block.items.filter((it) => it.description || it.amount).map((item) => (
            <tr key={item.id} style={{ borderBottom: `1px solid ${color.neutral100}` }}>
              <td style={{ padding: '3px 0' }}>{item.description || '---'}</td>
              <td style={{ padding: '3px 0', textAlign: 'right' }}>{item.amount || '---'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ borderTop: `1.5px solid ${color.borderStrong}` }}>
            <td style={{ padding: '4px 0', fontWeight: 600 }}>Total</td>
            <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 600 }}>${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ─── Main Preview ────────────────────────────────────────────────────────────

interface ReportPreviewProps {
  settings: ReportSettings;
  patient: PatientInfo;
  blocks: SupportedBlock[];
}

export default function ReportPreview({ settings, patient, blocks }: ReportPreviewProps) {
  return (
    <div style={{
      backgroundColor: color.white,
      border: `1px solid ${color.borderDefault}`,
      borderRadius: radius.lg,
      padding: `${space[8]} ${space[6]}`,
      minHeight: '700px',
      boxShadow: shadow.md,
      fontFamily: font.family,
      position: 'relative',
    }}>
      {/* Logo Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: space[4],
      }}>
        {/* Doctor / Clinic logo */}
        {settings.clinicLogoUrl ? (
          <img
            src={settings.clinicLogoUrl}
            alt="Clinic logo"
            style={{
              height: '36px',
              maxWidth: '140px',
              objectFit: 'contain',
            }}
          />
        ) : (
          <div style={{
            height: '36px',
            padding: '0 12px',
            borderRadius: radius.md,
            border: `1.5px dashed ${color.neutral200}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: color.neutral300,
            backgroundColor: color.neutral50,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <circle cx="8.5" cy="10.5" r="2" />
              <path d="M5 20l5-6 3 3 4-5 4 4" />
            </svg>
            <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.02em' }}>Your Logo</span>
          </div>
        )}

        {/* iTero logo */}
        <img src={iteroLogo} alt="iTero" style={{ height: '28px', objectFit: 'contain', display: 'block', flexShrink: 0 }} />
      </div>

      {/* Report Header */}
      <div style={{
        borderBottom: `2px solid ${color.primary}`,
        paddingBottom: space[3],
        marginBottom: space[5],
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 700,
          color: color.textHeading,
          letterSpacing: font.tracking.tight,
        }}>
          {settings.reportName || 'Untitled Report'}
        </div>
        <div style={{
          fontSize: '10px',
          color: color.textSubtle,
          marginTop: '2px',
        }}>
          {settings.doctorName || 'Doctor Name'}
        </div>
      </div>

      {/* Patient info */}
      <div style={{
        backgroundColor: color.neutral50,
        borderRadius: '8px',
        border: `1px solid ${color.borderDefault}`,
        padding: `${space[4]} ${space[5]}`,
        marginBottom: space[5],
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: space[4],
      }}>
        <div>
          <div style={{ fontSize: '10px', color: color.textPlaceholder, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', fontWeight: 500 }}>Patient</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: color.textDefault }}>{patient.patientName || '---'}</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: color.textPlaceholder, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', fontWeight: 500 }}>Birth Date</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: color.textDefault }}>{patient.birthDate || '---'}</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: color.textPlaceholder, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', fontWeight: 500 }}>Chart #</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: color.textDefault }}>{patient.chartNumber || '---'}</div>
        </div>
      </div>

      {/* Blocks */}
      {blocks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: `${space[16]} 0`,
          color: color.textPlaceholder,
          fontSize: '11px',
        }}>
          Add blocks to see the report preview
        </div>
      ) : (
        blocks.map((block) => {
          switch (block.type) {
            case 'image':
              return <ImageBlockPreview key={block.id} block={block} />;
            case 'comparison':
              return <ComparisonBlockPreview key={block.id} block={block} />;
            case 'cost-summary':
              return <CostSummaryBlockPreview key={block.id} block={block} />;
            default:
              return null;
          }
        })
      )}

      {/* Signature */}
      {settings.signatureUrl && (
        <div style={{
          marginTop: space[8],
          paddingTop: space[4],
          borderTop: `1px solid ${color.borderDefault}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}>
          <img src={settings.signatureUrl} alt="Doctor signature" style={{ maxHeight: '50px', objectFit: 'contain' }} />
          <div style={{ fontSize: '10px', fontWeight: 500, color: color.textDefault, marginTop: '2px' }}>
            {settings.doctorName}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${color.borderDefault}`,
        marginTop: space[8],
        paddingTop: space[3],
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '9px',
        color: color.textPlaceholder,
      }}>
        <span>Generated {new Date().toLocaleDateString()}</span>
        <span>{settings.pinEnabled ? 'PIN protected' : ''}</span>
        <span>Page 1</span>
      </div>

      {/* Page break indicator removed */}
    </div>
  );
}
