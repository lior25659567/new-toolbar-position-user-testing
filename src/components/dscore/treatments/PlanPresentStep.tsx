import React, { useMemo, useRef, useState } from 'react';
import { PrimaryButton, SecondaryButton, Tag, TextInput } from '../../../design-system';
import type { TreatmentPlan } from '../data/types';
import { rollupPlan, formatCurrency, validatePlan } from './treatmentPlanRules';
import { procedureByCode } from '../data/procedures';

export function PlanPresentStep({
  plan,
  onPresent,
  onAccept,
  onDecline,
  onSetInsurance,
}: {
  plan: TreatmentPlan;
  onPresent: () => void;
  onAccept: (signatureDataUrl: string) => void;
  onDecline: (reason: string) => void;
  onSetInsurance: (provider?: string, planId?: string) => void;
}) {
  const totals = useMemo(() => rollupPlan(plan), [plan]);
  const issues = useMemo(() => validatePlan(plan), [plan]);
  const blockingErrors = issues.filter((i) => i.severity === 'error').length;

  const [signed, setSigned] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  const canPresent = blockingErrors === 0 && plan.phases.length > 0;
  const canAccept = plan.status === 'presented' && signed;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Patient-facing summary */}
      <section
        style={{
          backgroundColor: 'var(--ads-bg-surface)',
          border: '1px solid var(--ads-border-subtle)',
          borderRadius: 'var(--ads-radius-sm)',
          padding: '32px',
        }}
      >
        <header style={{ marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Treatment plan
          </p>
          <h1 style={{ margin: '4px 0 0', fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '32px', lineHeight: '40px', color: 'var(--ads-text-primary)' }}>
            {plan.patientName}
          </h1>
          <p style={{ margin: '8px 0 0', color: 'var(--ads-text-muted)', fontSize: '14px' }}>
            Prepared on {new Date(plan.createdAt).toLocaleDateString()} · {plan.phases.length} phase{plan.phases.length === 1 ? '' : 's'} · {totals.procedureCount} procedure{totals.procedureCount === 1 ? '' : 's'}
          </p>
        </header>

        {plan.diagnosisTags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
            {plan.diagnosisTags.map((t) => (
              <Tag key={t} color="purple">{t.replace(/-/g, ' ')}</Tag>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...plan.phases].sort((a, b) => a.ordering - b.ordering).map((ph) => {
            const phaseTotal = totals.byPhase.find((p) => p.phaseId === ph.id);
            return (
              <div key={ph.id} style={{ border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
                <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--ads-border-subtle)', backgroundColor: 'var(--ads-bg-muted)' }}>
                  <span style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '15px', color: 'var(--ads-text-primary)' }}>
                    Phase {ph.ordering + 1} · {ph.name}
                  </span>
                  <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
                    Starts week {ph.earliestStartOffsetWeeks}
                  </span>
                </header>
                <ul style={{ listStyle: 'none', margin: 0, padding: '8px 16px' }}>
                  {ph.procedures.map((proc) => {
                    const cat = procedureByCode(proc.catalogCode);
                    const price = proc.priceOverride ?? cat?.defaultPrice ?? 0;
                    return (
                      <li key={proc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--ads-border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-primary)' }}>
                            {cat?.name ?? proc.catalogCode}
                          </span>
                          {proc.toothNumber != null && (
                            <span style={{ fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                              · #{proc.toothNumber}
                            </span>
                          )}
                          {proc.material && (
                            <span style={{ fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                              · {proc.material}
                            </span>
                          )}
                        </div>
                        <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                          {formatCurrency(price)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {phaseTotal && (
                  <footer style={{ padding: '10px 16px', display: 'flex', justifyContent: 'flex-end', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
                    Phase total{' '}
                    <strong style={{ marginLeft: '8px', color: 'var(--ads-text-primary)' }}>
                      {formatCurrency(phaseTotal.subtotal)}
                    </strong>
                  </footer>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Cost summary + insurance */}
      <section
        style={{
          backgroundColor: 'var(--ads-bg-surface)',
          border: '1px solid var(--ads-border-subtle)',
          borderRadius: 'var(--ads-radius-sm)',
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '15px', color: 'var(--ads-text-primary)' }}>Insurance</h3>
          <p style={{ margin: '4px 0 12px', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
            Estimate uses default coverage by procedure category.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <TextInput
              label="Provider"
              value={plan.insurance.provider ?? ''}
              onChange={(e) => onSetInsurance(e.target.value || undefined, plan.insurance.planId)}
              placeholder="e.g. Delta Dental"
              fullWidth
            />
            <TextInput
              label="Plan ID"
              value={plan.insurance.planId ?? ''}
              onChange={(e) => onSetInsurance(plan.insurance.provider, e.target.value || undefined)}
              placeholder="Optional"
              fullWidth
            />
          </div>
        </div>
        <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '1fr auto', rowGap: '10px', columnGap: '24px' }}>
          <dt style={{ color: 'var(--ads-text-muted)' }}>Subtotal</dt>
          <dd style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '15px', color: 'var(--ads-text-primary)', fontWeight: 500, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(totals.subtotal)}
          </dd>
          <dt style={{ color: 'var(--ads-text-muted)' }}>Insurance est.</dt>
          <dd style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '15px', color: 'var(--ads-text-muted)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            −{formatCurrency(totals.insuranceEstimate)}
          </dd>
          <dt style={{ color: 'var(--ads-text-muted)', fontWeight: 500 }}>Patient pays</dt>
          <dd style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '24px', color: 'var(--ads-text-primary)', fontWeight: 500, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(totals.patientPays)}
          </dd>
        </dl>
      </section>

      {/* Approval area */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {plan.status === 'draft' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <PrimaryButton size={44} disabled={!canPresent} onClick={onPresent}>
              Present to patient
            </PrimaryButton>
            {!canPresent && (
              <span style={{ fontSize: '13px', color: 'var(--ads-text-muted)' }}>
                {blockingErrors > 0 ? `Resolve ${blockingErrors} error${blockingErrors === 1 ? '' : 's'} first.` : 'Add at least one phase.'}
              </span>
            )}
          </div>
        )}

        {plan.status === 'presented' && (
          <div
            style={{
              backgroundColor: 'var(--ads-bg-surface)',
              border: '1px solid var(--ads-border-subtle)',
              borderRadius: 'var(--ads-radius-sm)',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '15px', color: 'var(--ads-text-primary)' }}>
              Patient acceptance
            </h3>
            <SignaturePad onChange={setSignatureDataUrl} signed={signed} setSigned={setSigned} />
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <PrimaryButton
                size={44}
                disabled={!canAccept || !signatureDataUrl}
                onClick={() => signatureDataUrl && onAccept(signatureDataUrl)}
              >
                I accept this plan
              </PrimaryButton>
              <SecondaryButton
                size={44}
                onClick={() => onDecline(declineReason || 'No reason given')}
              >
                Decline
              </SecondaryButton>
              <TextInput
                placeholder="Reason for decline (optional)"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                style={{ flex: 1, minWidth: '200px' }}
              />
            </div>
          </div>
        )}

        {plan.status === 'accepted' && (
          <div
            style={{
              backgroundColor: 'var(--ads-tag-green-bg)',
              border: '1px solid var(--ads-tag-green-br)',
              borderRadius: 'var(--ads-radius-sm)',
              padding: '16px 20px',
              color: 'var(--ads-tag-green-fg)',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '14px',
            }}
          >
            ✓ Plan accepted on {plan.acceptedAt ? new Date(plan.acceptedAt).toLocaleDateString() : 'today'}. Continue to <strong>Execute</strong> to generate jobs.
          </div>
        )}

        {plan.status === 'declined' && (
          <div
            style={{
              backgroundColor: 'var(--ads-tag-red-bg)',
              border: '1px solid var(--ads-tag-red-br)',
              borderRadius: 'var(--ads-radius-sm)',
              padding: '16px 20px',
              color: 'var(--ads-tag-red-fg)',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '14px',
            }}
          >
            ✗ Plan declined.
          </div>
        )}
      </section>
    </div>
  );
}

function SignaturePad({
  onChange,
  signed,
  setSigned,
}: {
  onChange: (dataUrl: string | null) => void;
  signed: boolean;
  setSigned: (b: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);

  const begin = (x: number, y: number) => {
    drawingRef.current = true;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const draw = (x: number, y: number) => {
    if (!drawingRef.current) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'var(--ads-text-primary)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    setSigned(true);
  };
  const end = () => {
    drawingRef.current = false;
    const c = canvasRef.current;
    if (c) onChange(c.toDataURL('image/png'));
  };
  const clear = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    setSigned(false);
    onChange(null);
  };

  const getCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const point = 'touches' in e ? e.touches[0] : e;
    return { x: (point.clientX - rect.left) * (c.width / rect.width), y: (point.clientY - rect.top) * (c.height / rect.height) };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div
        style={{
          position: 'relative',
          border: `1.5px dashed ${signed ? 'var(--ads-blue-500)' : 'var(--ads-border-default)'}`,
          borderRadius: 'var(--ads-radius-sm)',
          backgroundColor: 'var(--ads-bg-surface)',
          height: '120px',
        }}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={120}
          style={{ width: '100%', height: '100%', cursor: 'crosshair', borderRadius: 'var(--ads-radius-sm)' }}
          onMouseDown={(e) => { const p = getCoords(e); begin(p.x, p.y); }}
          onMouseMove={(e) => { const p = getCoords(e); draw(p.x, p.y); }}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={(e) => { e.preventDefault(); const p = getCoords(e); begin(p.x, p.y); }}
          onTouchMove={(e) => { e.preventDefault(); const p = getCoords(e); draw(p.x, p.y); }}
          onTouchEnd={(e) => { e.preventDefault(); end(); }}
        />
        {!signed && (
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'var(--ads-text-subtle)',
              fontSize: '13px',
              pointerEvents: 'none',
            }}
          >
            Sign here
          </span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SecondaryButton size={36} onClick={clear} disabled={!signed}>Clear signature</SecondaryButton>
      </div>
    </div>
  );
}
