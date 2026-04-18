import React, { useState, useCallback } from 'react';
import { Modal, TextInput } from '../../design-system';
import { color, font, space, radius, transition, shadow } from '../../design-system/tokens';

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

// ─── QR Code ────────────────────────────────────────────────────────────────

function QRCodePreview({ link }: { link: string }) {
  const N = 25;
  const cells: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));
  let h = 0;
  for (let i = 0; i < link.length; i++) h = ((h << 5) - h + link.charCodeAt(i)) | 0;
  const finder = (sr: number, sc: number) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      cells[sr + r][sc + c] = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
    }
  };
  finder(0, 0); finder(0, N - 7); finder(N - 7, 0);
  for (let i = 8; i < N - 8; i++) { cells[6][i] = i % 2 === 0; cells[i][6] = i % 2 === 0; }
  for (let r = -2; r <= 2; r++) for (let c = -2; c <= 2; c++) {
    const ar = 18 + r, ac = 18 + c;
    if (ar >= 0 && ar < N && ac >= 0 && ac < N) cells[ar][ac] = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
  }
  for (let i = 0; i < 8; i++) {
    if (i < N) { cells[7][i] = false; cells[i][7] = false; }
    if (N - 8 + i < N) cells[7][N - 8 + i] = false;
    if (i < N) cells[i][N - 8] = false;
    if (N - 8 + i < N) cells[N - 8][i] = false;
    if (i < N) cells[N - 8 + i][7] = false;
  }
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if ((r < 9 && c < 9) || (r < 9 && c >= N - 8) || (r >= N - 8 && c < 9)) continue;
    if (r === 6 || c === 6) continue;
    if (r >= 16 && r <= 20 && c >= 16 && c <= 20) continue;
    cells[r][c] = ((h * (r * N + c + 1) * 2654435761) >>> 0) % 5 !== 0 && ((h * (r * N + c + 1) * 2654435761) >>> 0) % 3 !== 0;
  }
  const size = 160, cs = size / N;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: space[3] }}>
      <div style={{ padding: 12, backgroundColor: '#fff', borderRadius: radius.md, border: `1px solid ${color.borderDefault}` }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {cells.map((row, r) => row.map((cell, c) => cell ? <rect key={`${r}-${c}`} x={c * cs} y={r * cs} width={cs + 0.5} height={cs + 0.5} fill="#1a1a2e" rx={0.4} /> : null))}
        </svg>
      </div>
    </div>
  );
}

// ─── Small icon button for bottom row ───────────────────────────────────────

function SocialIcon({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 40, height: 40, borderRadius: radius.full, border: `1px solid ${color.borderDefault}`,
        backgroundColor: hovered ? color.neutral100 : color.bgSurface,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: color.textDefault, padding: 0,
        transition: `all ${transition.fast}`,
      }}
    >
      {icon}
    </button>
  );
}

// ─── Main Modal ─────────────────────────────────────────────────────────────

export default function ShareModal({ open, onClose, reportName, patientName, doctorName, signatureUrl, signatureMethod, onSignatureChange, pinEnabled, pin, onPinEnabledChange, onPinChange }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [accessLevel, setAccessLevel] = useState<'invited' | 'anyone'>('invited');
  const [accessDropdownOpen, setAccessDropdownOpen] = useState(false);

  const reportLink = `https://reports.itero.com/share/${Date.now().toString(36)}`;

  const handleCopyLink = useCallback(() => {
    navigator.clipboard?.writeText(reportLink).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [reportLink]);

  return (
    <Modal open={open} onClose={onClose} title="Share Report" width={480}>

      {/* Email input */}
      <div style={{ marginBottom: space[4] }}>
        <TextInput
          placeholder="Email, separated by commas"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
      </div>

      {/* Who has access */}
      <div style={{ marginBottom: space[3] }}>
        <div style={{ fontSize: font.size.xs, color: color.textSubtle, marginBottom: space[2] }}>
          Who has access
        </div>

        {/* Access level dropdown */}
        <div style={{ position: 'relative', marginBottom: space[3] }}>
          <button
            type="button"
            onClick={() => setAccessDropdownOpen(!accessDropdownOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: space[2], width: '100%',
              padding: `${space[2]} ${space[3]}`,
              backgroundColor: color.bgSurface, borderRadius: radius.md,
              border: `1px solid ${color.borderDefault}`, cursor: 'pointer',
              fontFamily: font.family, textAlign: 'left',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color.textSubtle} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {accessLevel === 'invited' ? (
                <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>
              ) : (
                <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></>
              )}
            </svg>
            <span style={{ fontSize: font.size.sm, color: color.textDefault, fontWeight: font.weight.medium, flex: 1 }}>
              {accessLevel === 'invited' ? 'Only those invited' : 'Anyone with the link'}
            </span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={color.textSubtle} strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
          {accessDropdownOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 1 }} onClick={() => setAccessDropdownOpen(false)} />
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: space[1],
                backgroundColor: color.bgSurface, border: `1px solid ${color.borderDefault}`,
                borderRadius: radius.md, boxShadow: shadow.lg, zIndex: 2, overflow: 'hidden',
              }}>
                {([
                  { value: 'invited' as const, label: 'Only those invited', icon: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></> },
                  { value: 'anyone' as const, label: 'Anyone with the link', icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></> },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setAccessLevel(opt.value); setAccessDropdownOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: space[2], width: '100%',
                      padding: `${space[2]} ${space[3]}`, border: 'none', backgroundColor: accessLevel === opt.value ? color.neutral50 : 'transparent',
                      cursor: 'pointer', fontFamily: font.family, fontSize: font.size.sm,
                      color: color.textDefault, textAlign: 'left',
                      transition: `background-color ${transition.fast}`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color.bgHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = accessLevel === opt.value ? color.neutral50 : 'transparent'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color.textSubtle} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {opt.icon}
                    </svg>
                    <span style={{ flex: 1 }}>{opt.label}</span>
                    {accessLevel === opt.value && (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={color.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8.5L6.5 12 13 4" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Owner row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: space[3],
          padding: `${space[2]} 0`,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: radius.full,
            backgroundColor: color.neutral200, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textLabel,
            flexShrink: 0,
          }}>
            {(doctorName || 'D').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: font.size.sm, fontWeight: font.weight.medium, color: color.textDefault }}>
              {doctorName || 'Doctor'} <span style={{ color: color.textPlaceholder, fontWeight: font.weight.regular }}>(you)</span>
            </div>
          </div>
          <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>Owner</span>
        </div>
      </div>

      {/* Warning box */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: space[2],
        padding: `${space[3]} ${space[4]}`,
        backgroundColor: color.neutral50, borderRadius: radius.md,
        border: `1px solid ${color.borderDefault}`,
        marginTop: space[2], marginBottom: space[4],
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color.textSubtle} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <div>
          <div style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textDefault, marginBottom: 2 }}>
            This report may include personal information
          </div>
          <div style={{ fontSize: font.size.xs, color: color.textSubtle, lineHeight: '1.45' }}>
            All report contents are visible to recipients. Enable PIN protection for added security.
          </div>
        </div>
      </div>

      {/* PIN Protection — after warning */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `${space[2]} 0`, marginBottom: pinEnabled ? space[2] : space[3],
      }}>
        <span style={{ fontSize: font.size.sm, color: color.textDefault, fontWeight: font.weight.medium }}>
          PIN Protection
        </span>
        <button
          type="button"
          onClick={() => onPinEnabledChange(!pinEnabled)}
          style={{
            width: '36px', height: '20px', borderRadius: radius.full, border: 'none',
            backgroundColor: pinEnabled ? color.primary : color.neutral300,
            cursor: 'pointer', position: 'relative', transition: `background-color ${transition.fast}`, padding: 0,
          }}
        >
          <div style={{
            width: '16px', height: '16px', borderRadius: '50%', backgroundColor: color.white,
            position: 'absolute', top: '2px', left: pinEnabled ? '18px' : '2px',
            transition: `left ${transition.fast}`, boxShadow: shadow.sm,
          }} />
        </button>
      </div>
      {pinEnabled && (
        <div style={{ marginBottom: space[3] }}>
          <input
            type="text"
            inputMode="numeric"
            value={pin}
            onChange={(e) => onPinChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            placeholder="4-6 digit PIN"
            style={{
              width: '100%', height: '36px', padding: `0 ${space[3]}`,
              fontSize: font.size.sm, fontFamily: font.family, color: color.textDefault,
              backgroundColor: color.white, border: `1px solid ${color.borderDefault}`,
              borderRadius: radius.md, outline: 'none', boxSizing: 'border-box' as const,
              letterSpacing: '0.2em', textAlign: 'center',
            }}
          />
          <span style={{ fontSize: font.size['2xs'], color: color.textPlaceholder, marginTop: space[1], display: 'block' }}>
            Recipients will need this PIN to view
          </span>
        </div>
      )}

      {/* QR expanded */}
      {showQR && (
        <div style={{ marginBottom: space[3] }}>
          <QRCodePreview link={reportLink} />
          <div style={{ textAlign: 'center', fontSize: font.size.xs, color: color.textSubtle }}>
            Scan to open report
          </div>
        </div>
      )}

      {/* Bottom: social icons + Copy link */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: `1px solid ${color.borderDefault}`, paddingTop: space[4],
      }}>
        <div style={{ display: 'flex', gap: space[2] }}>
          {/* WhatsApp — cleaner icon */}
          <SocialIcon
            label="WhatsApp"
            onClick={() => {}}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.72.44 3.34 1.21 4.75L2 22l5.37-1.17C8.72 21.56 10.32 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.8" fill="none" />
                <path d="M16.5 14.38c-.25-.12-1.47-.72-1.7-.8-.23-.08-.39-.12-.56.12-.17.25-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.38-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42-.14 0-.31-.02-.48-.02s-.44.06-.67.31c-.23.25-.87.85-.87 2.08s.89 2.41 1.02 2.58c.12.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.17-.48-.29z" fill="currentColor" />
              </svg>
            }
          />
          {/* WeChat — cleaner icon */}
          <SocialIcon
            label="WeChat"
            onClick={() => {}}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 4C5.13 4 2 6.58 2 9.8c0 1.76.95 3.35 2.46 4.44l-.62 1.87 2.2-1.1c.92.26 1.9.4 2.93.4.33 0 .66-.02.98-.05" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.97 14.95c-.33.03-.66.05-1 .05" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M22 14.2c0-2.76-2.69-5-6-5s-6 2.24-6 5 2.69 5 6 5c.73 0 1.43-.1 2.08-.3l1.72.86-.49-1.46C20.88 17.6 22 16.02 22 14.2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="7" cy="8.5" r="0.8" fill="currentColor" /><circle cx="11" cy="8.5" r="0.8" fill="currentColor" />
                <circle cx="14" cy="13.5" r="0.8" fill="currentColor" /><circle cx="18" cy="13.5" r="0.8" fill="currentColor" />
              </svg>
            }
          />
          {/* QR — cleaner icon */}
          <SocialIcon
            label="QR Code"
            onClick={() => setShowQR(!showQR)}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" />
                <rect x="6" y="6" width="2" height="2" fill="currentColor" stroke="none" /><rect x="16" y="6" width="2" height="2" fill="currentColor" stroke="none" /><rect x="6" y="16" width="2" height="2" fill="currentColor" stroke="none" />
                <path d="M13 13h2v2h-2zM17 13h2v2h-2zM13 17h2v2h-2zM17 17h4v4h-4z" strokeWidth="1.5" />
              </svg>
            }
          />
        </div>

        {/* Copy link — primary color, design system radius */}
        <button
          type="button"
          onClick={handleCopyLink}
          style={{
            display: 'flex', alignItems: 'center', gap: space[2],
            height: 40, padding: `0 ${space[5]}`,
            borderRadius: radius.md,
            border: 'none',
            backgroundColor: color.primary,
            color: color.textOnPrimary,
            fontSize: font.size.sm,
            fontWeight: font.weight.medium,
            fontFamily: font.family,
            cursor: 'pointer',
            transition: `background-color ${transition.fast}`,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--ds-color-primary-hover)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = color.primary; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </Modal>
  );
}
