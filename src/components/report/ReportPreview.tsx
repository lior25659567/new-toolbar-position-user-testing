import React from 'react';
import { color, font, space, radius, shadow } from '../../design-system/tokens';
import type { PatientInfo, ReportSettings, ImageBlock, ComparisonBlock, CostSummaryBlock } from './types';
// iTero logo inline SVG component
function IteroLogoSvg() {
  return (
    <svg width="80" height="22" viewBox="0 0 103 28" fill="none">
      <path d="M79.2389 19.7792C79.2417 18.7027 79.0308 17.6364 78.6182 16.6421C78.2057 15.6478 77.5999 14.7454 76.8358 13.987C75.2477 12.4036 73.0828 11.532 70.7364 11.532C68.3919 11.532 66.2252 12.4036 64.639 13.987C63.8772 14.7461 63.2741 15.6491 62.8649 16.6435C62.4556 17.6379 62.2483 18.7039 62.2551 19.7792C62.2551 22.0073 63.0658 24.0664 64.5746 25.579C66.1307 27.1397 68.3202 28 70.7364 28C73.1527 28 75.3422 27.1397 76.9001 25.579C78.407 24.0664 79.2389 22.0073 79.2389 19.7792ZM75.4197 19.7792C75.4197 22.3042 73.2321 24.5192 70.7364 24.5192C68.2426 24.5192 66.0531 22.3042 66.0531 19.7792C66.0483 19.1467 66.1696 18.5196 66.4098 17.9344C66.6501 17.3493 67.0045 16.8179 67.4523 16.3712C68.3236 15.5008 69.5048 15.0118 70.7365 15.0118C71.9681 15.0118 73.1493 15.5008 74.0206 16.3712C74.4688 16.8176 74.8234 17.349 75.0636 17.9342C75.3039 18.5194 75.4249 19.1466 75.4197 19.7792ZM56.1254 15.8294H60.7869V11.8713H52.1682V27.7249H56.1254V15.8294ZM36.5939 21.2945H49.0215V20.7378C49.0215 18.0643 48.2312 15.7681 46.7357 14.0977C45.2534 12.4433 43.1358 11.532 40.7743 11.532C38.4506 11.532 36.3481 12.3989 34.8583 13.9738C33.427 15.4855 32.6386 17.5369 32.6386 19.7517C32.6386 21.9185 33.4195 23.9415 34.8356 25.4476C36.4067 27.117 38.6056 28 41.1959 28C43.8145 28 45.9738 27.0196 47.9608 24.9239L45.4216 22.3798C44.2172 23.7799 42.7463 24.5192 41.1675 24.5192C39.9273 24.5192 38.823 24.1401 37.9742 23.4217C37.315 22.8637 36.8349 22.1238 36.5939 21.2945ZM36.577 18.0956C36.9948 16.5584 38.2634 15.0118 40.746 15.0118C42.8219 15.0118 44.4611 16.2521 44.9281 18.0956H36.577ZM29.392 7.91404H34.8675V3.95686H19.9593V7.91404H25.4347V27.7249H29.392V7.91404Z" fill="black" fillOpacity="0.93"/>
      <path d="M56.1254 15.8294H60.7869V11.8713H52.1682V27.7249H56.1254V15.8294Z" fill="black" fillOpacity="0.93"/>
      <path d="M19.9572 11.8713H16V27.7249H19.9572V11.8713Z" fill="black" fillOpacity="0.93"/>
      <path d="M19.9572 0H16V3.95718H19.9572V0Z" fill="black" fillOpacity="0.93"/>
      <path d="M80.4516 11.8664H82.8465V12.3382H81.9222V14.8167H81.3708V12.3382H80.4516V11.8664Z" fill="black" fillOpacity="0.93"/>
      <path d="M83.2317 11.8664H83.9573L84.4414 13.2707C84.5565 13.6152 84.6992 14.2613 84.6992 14.2613H84.7114C84.7114 14.2613 84.8541 13.6192 84.9652 13.2707L85.4401 11.8664H86.182V14.8167H85.6704V13.2778C85.6704 12.9568 85.7061 12.3586 85.7061 12.3586H85.6979C85.6979 12.3586 85.5756 12.9018 85.4798 13.1953L84.9214 14.8167H84.477L83.9145 13.1953C83.8187 12.9018 83.6964 12.3586 83.6964 12.3586H83.6882C83.6882 12.3586 83.7239 12.9568 83.7239 13.2778V14.8167H83.2317V11.8664Z" fill="black" fillOpacity="0.93"/>
    </svg>
  );
}

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
  const hasNotes = !!block.notes;
  const hasClinical = !!(block.diagnosis || block.treatment || block.estimatedCost || block.treatmentDate);
  const hasTeeth = block.teeth.length > 0;
  const hasMeta = hasNotes || hasClinical || hasTeeth;

  return (
    <div style={{
      borderRadius: '8px',
      border: `1px solid ${color.borderDefault}`,
      overflow: 'hidden',
      backgroundColor: color.white,
    }}>
      {/* Image */}
      {block.previewUrl ? (
        <img
          src={block.previewUrl}
          alt={block.title || 'Clinical image'}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'contain',
            display: 'block',
            backgroundColor: color.neutral50,
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '80px',
          backgroundColor: color.neutral50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color.textPlaceholder,
          fontSize: '10px',
        }}>
          No image
        </div>
      )}

      {/* Meta below image */}
      {hasMeta && (
        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {block.title && (
            <div style={{ fontSize: '10px', fontWeight: 600, color: color.textHeading }}>
              {block.title}
            </div>
          )}
          {hasNotes && (
            <div style={{ fontSize: '9px', color: color.textSubtle, lineHeight: '1.4' }}>
              {block.notes}
            </div>
          )}
          <PreviewTeethTags teeth={block.teeth} />
          {hasClinical && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
              <PreviewClinicalRow label="Diagnosis" value={block.diagnosis} />
              <PreviewClinicalRow label="Treatment" value={block.treatment} />
              <PreviewClinicalRow label="Est. Cost" value={block.estimatedCost} />
              <PreviewClinicalRow label="Date" value={block.treatmentDate} />
            </div>
          )}
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
        <IteroLogoSvg />
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
      ) : (() => {
        // Separate image blocks from other blocks for 2-column layout
        const imageBlocks = blocks.filter(b => b.type === 'image') as ImageBlock[];
        const otherBlocks = blocks.filter(b => b.type !== 'image');

        return (
          <>
            {/* Image blocks in 2-column grid */}
            {imageBlocks.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space[3], marginBottom: otherBlocks.length > 0 ? space[4] : 0 }}>
                {imageBlocks.map((block) => (
                  <ImageBlockPreview key={block.id} block={block} />
                ))}
              </div>
            )}
            {/* Other blocks full width */}
            {otherBlocks.map((block) => {
              switch (block.type) {
                case 'comparison':
                  return <ComparisonBlockPreview key={block.id} block={block as ComparisonBlock} />;
                case 'cost-summary':
                  return <CostSummaryBlockPreview key={block.id} block={block as CostSummaryBlock} />;
                default:
                  return null;
              }
            })}
          </>
        );
      })()}

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
