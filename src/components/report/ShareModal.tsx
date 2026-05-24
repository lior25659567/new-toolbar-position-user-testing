import React, { useState } from 'react';
import { notify } from '../../design-system/notify';
import { Modal } from '../../design-system';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import { QRCodePreview } from '../shared/QRCodePreview';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  reportName: string;
  patientName: string;
  doctorName: string;
  signatureUrl: string;
  signatureMethod: string;
  onSignatureChange: (url: string, method: string) => void;
  pinEnabled: boolean;
  pin: string;
  onPinEnabledChange: (enabled: boolean) => void;
  onPinChange: (pin: string) => void;
}

// ─── Share option card ───────────────────────────────────────────────────────

function ShareOption({ icon, label, selected, onClick }: {
  icon: React.ReactNode; label: string; selected?: boolean; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const borderColor = selected
    ? 'var(--ds-color-primary)'
    : hovered
    ? 'var(--ads-border-accent-hover)'
    : color.borderDefault;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: space[2],
        padding: `${space[4]} ${space[3]}`,
        border: `${selected ? '2px' : '1px'} solid ${borderColor}`,
        borderRadius: radius.md,
        backgroundColor: color.bgSurface,
        cursor: 'pointer',
        fontFamily: font.family,
        transition: `border-color ${transition.fast}`,
      }}
    >
      <span style={{
        width: 44, height: 44, borderRadius: radius.full, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: color.bgPage,
        color: selected ? 'var(--ds-color-primary)' : color.textDefault,
      }}>
        {icon}
      </span>
      <span style={{ fontSize: font.size.sm, fontWeight: font.weight.medium, color: color.textDefault, textAlign: 'center' }}>
        {label}
      </span>
    </button>
  );
}

// ─── Main Modal ─────────────────────────────────────────────────────────────

export default function ShareModal({ open, onClose, reportName }: ShareModalProps) {
  const [showQR, setShowQR] = useState(false);
  const reportLink = `https://reports.itero.com/share/${Date.now().toString(36)}`;

  return (
    <Modal open={open} onClose={onClose} title="Share report" width={440}>
      <div style={{ fontSize: font.size.sm, color: color.textSubtle, marginBottom: space[4] }}>
        Choose how to share “{reportName || 'this report'}”.
      </div>

      <div style={{ display: 'flex', gap: space[3] }}>
        {/* Download PDF */}
        <ShareOption
          label="Download PDF"
          onClick={() => { notify.success('Report downloaded as PDF'); onClose(); }}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v11" /><path d="M7.5 10.5 12 15l4.5-4.5" />
              <path d="M5 19h14" />
            </svg>
          }
        />
        {/* WeChat */}
        <ShareOption
          label="WeChat"
          onClick={() => { notify.success('Shared to WeChat'); onClose(); }}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .718-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05a5.797 5.797 0 0 1-.231-1.61c0-3.367 3.272-6.105 7.337-6.105.246 0 .487.013.728.039-.665-3.412-4.064-5.984-8.46-5.984zm-2.91 2.964c.491 0 .89.397.89.888a.89.89 0 0 1-.89.888.888.888 0 1 1 0-1.776zm5.819 0a.888.888 0 1 1 0 1.776.89.89 0 0 1-.89-.888c0-.491.398-.888.89-.888zm6.318 4.49c-3.633 0-6.582 2.476-6.582 5.534 0 3.057 2.95 5.533 6.582 5.533.79 0 1.546-.123 2.246-.346a.713.713 0 0 1 .592.082l1.439.832c.041.024.082.041.13.041a.236.236 0 0 0 .238-.238c0-.06-.024-.118-.038-.176l-.295-1.115a.49.49 0 0 1-.018-.13.49.49 0 0 1 .197-.382C23.555 18.398 24 17.376 24 16.05c0-3.058-2.95-5.534-6.582-5.534v.626zm-2.18 1.789a.738.738 0 1 1 0 1.476.738.738 0 0 1 0-1.476zm4.36 0a.738.738 0 1 1 0 1.476.738.738 0 0 1 0-1.476z" />
            </svg>
          }
        />
        {/* Share via QR code */}
        <ShareOption
          label="QR code"
          selected={showQR}
          onClick={() => setShowQR((v) => !v)}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" />
              <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h3v3h-3z" strokeWidth="1.4" />
            </svg>
          }
        />
      </div>

      {showQR && (
        <div style={{ marginTop: space[4] }}>
          <QRCodePreview link={reportLink} />
          <div style={{ textAlign: 'center', fontSize: font.size.xs, color: color.textSubtle }}>
            Scan to open the report
          </div>
        </div>
      )}
    </Modal>
  );
}
