import React, { useState, useCallback } from 'react';
import { Modal, PrimaryButton, SecondaryButton, TextInput, TextArea } from '../../design-system';
import { color, font, space, radius, transition, shadow } from '../../design-system/tokens';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  reportName: string;
  patientName: string;
}

type ShareAction = 'link' | 'whatsapp' | 'wechat' | 'qr' | 'email' | null;

// ─── Share method icon button ───────────────────────────────────────────────

function ShareIcon({ icon, label, active, onClick }: {
  icon: React.ReactNode; label: string; active?: boolean; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: 0,
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        outline: 'none',
        minWidth: 56,
      }}
    >
      <div style={{
        width: 56,
        height: 56,
        borderRadius: radius.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? color.primary : hovered ? color.neutral100 : color.neutral50,
        color: active ? color.textOnPrimary : color.textDefault,
        transition: `all ${transition.fast}`,
        border: `1px solid ${active ? color.primary : hovered ? color.borderStrong : color.borderDefault}`,
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: font.size.xs,
        fontWeight: 500,
        color: active ? color.primary : color.textSubtle,
        fontFamily: font.family,
        transition: `color ${transition.fast}`,
      }}>
        {label}
      </span>
    </button>
  );
}

// ─── QR Code (simple SVG placeholder) ───────────────────────────────────────

function QRCodePreview({ link }: { link: string }) {
  // Generate a deterministic pattern from the link
  const cells: boolean[][] = [];
  let hash = 0;
  for (let i = 0; i < link.length; i++) hash = ((hash << 5) - hash + link.charCodeAt(i)) | 0;
  for (let r = 0; r < 21; r++) {
    cells[r] = [];
    for (let c = 0; c < 21; c++) {
      // Corner finder patterns
      if ((r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7)) {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 0 && r <= 6 && (c === 0 || c === 6)) || (c >= 0 && c <= 6 && (r === 0 || r === 6));
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        cells[r][c] = isOuter || isInner;
      } else {
        cells[r][c] = ((hash * (r * 21 + c + 1) * 2654435761) >>> 0) % 3 !== 0;
      }
    }
  }

  const size = 160;
  const cellSize = size / 21;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: space[4] }}>
      <div style={{
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: radius.md,
        border: `1px solid ${color.borderDefault}`,
        display: 'inline-block',
      }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {cells.map((row, r) =>
            row.map((cell, c) =>
              cell ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="#1e293b"
                />
              ) : null
            )
          )}
        </svg>
      </div>
    </div>
  );
}

// ─── Main Modal ─────────────────────────────────────────────────────────────

export default function ShareModal({ open, onClose, reportName, patientName }: ShareModalProps) {
  const [activeAction, setActiveAction] = useState<ShareAction>(null);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`Here's the dental report for ${patientName}`);

  const reportLink = `https://reports.itero.com/share/${Date.now().toString(36)}`;

  const handleCopyLink = useCallback(() => {
    navigator.clipboard?.writeText(reportLink).catch(() => {});
    setCopied(true);
    setActiveAction('link');
    window.setTimeout(() => setCopied(false), 2000);
  }, [reportLink]);

  const handleAction = (action: ShareAction) => {
    if (action === 'link') {
      handleCopyLink();
      return;
    }
    setActiveAction(activeAction === action ? null : action);
  };

  // Build footer based on active action
  const footer = (() => {
    if (activeAction === 'email') {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: space[2] }}>
          <SecondaryButton size={36} onClick={() => setActiveAction(null)}>Cancel</SecondaryButton>
          <PrimaryButton size={36} onClick={onClose} disabled={!email}>Send email</PrimaryButton>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PrimaryButton size={36} fullWidth onClick={onClose}>Done</PrimaryButton>
      </div>
    );
  })();

  return (
    <Modal open={open} onClose={onClose} title="Share report" width={480} footer={footer}>
      {/* Report preview card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: space[3],
        padding: space[3],
        backgroundColor: color.neutral50,
        borderRadius: radius.md,
        border: `1px solid ${color.borderDefault}`,
        marginBottom: space[5],
      }}>
        {/* Document icon */}
        <div style={{
          width: 40, height: 40, borderRadius: radius.sm,
          backgroundColor: color.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: font.size.sm, fontWeight: font.weight.semibold,
            color: color.textHeading, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {reportName || 'Patient Report'}
          </div>
          <div style={{ fontSize: font.size.xs, color: color.textSubtle }}>
            {patientName || 'Patient'}
          </div>
        </div>
      </div>

      {/* Share method icons row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: space[5],
      }}>
        <ShareIcon
          label={copied ? 'Copied!' : 'Copy Link'}
          active={activeAction === 'link'}
          onClick={() => handleAction('link')}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          }
        />
        <ShareIcon
          label="WhatsApp"
          active={activeAction === 'whatsapp'}
          onClick={() => handleAction('whatsapp')}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          }
        />
        <ShareIcon
          label="WeChat"
          active={activeAction === 'wechat'}
          onClick={() => handleAction('wechat')}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.97 3.258c-1.637 0-3.116.475-4.28 1.318-1.466 1.06-2.387 2.765-2.387 4.504 0 .637.116 1.25.328 1.828.648 1.768 2.105 3.2 4.037 3.893.526.189 1.075.326 1.64.398a8.85 8.85 0 001.46.078 8.39 8.39 0 002.089-.263.65.65 0 01.54.073l1.44.844a.245.245 0 00.126.04.22.22 0 00.22-.224c0-.054-.022-.108-.036-.161l-.296-1.121a.445.445 0 01.161-.503C21.37 18.757 24 16.926 24 14.27c0-2.87-2.85-5.023-6.432-5.023zm-2.37 2.606c.484 0 .878.4.878.89a.884.884 0 01-.877.89.884.884 0 01-.878-.89c0-.49.394-.89.878-.89zm4.742 0c.485 0 .878.4.878.89a.884.884 0 01-.878.89.884.884 0 01-.877-.89c0-.49.393-.89.877-.89z" />
            </svg>
          }
        />
        <ShareIcon
          label="QR Code"
          active={activeAction === 'qr'}
          onClick={() => handleAction('qr')}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="3" height="3" />
              <line x1="21" y1="14" x2="21" y2="14.01" />
              <line x1="21" y1="18" x2="21" y2="21" />
              <line x1="17" y1="21" x2="17" y2="21.01" />
            </svg>
          }
        />
        <ShareIcon
          label="Email"
          active={activeAction === 'email'}
          onClick={() => handleAction('email')}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
            </svg>
          }
        />
      </div>

      {/* Expanded content area based on active action */}
      {activeAction === 'link' && (
        <div style={{
          padding: `${space[3]} ${space[4]}`,
          backgroundColor: color.neutral50,
          borderRadius: radius.md,
          border: `1px solid ${color.borderDefault}`,
          display: 'flex', alignItems: 'center', gap: space[2],
          marginBottom: space[3],
        }}>
          <span style={{
            flex: 1, fontSize: font.size.xs, color: color.textDefault,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontFamily: font.mono,
          }}>
            {reportLink}
          </span>
          {copied && (
            <span style={{ fontSize: font.size['2xs'], fontWeight: font.weight.semibold, color: color.success }}>
              Copied!
            </span>
          )}
        </div>
      )}

      {activeAction === 'qr' && (
        <div style={{ marginBottom: space[3] }}>
          <QRCodePreview link={reportLink} />
          <div style={{ textAlign: 'center', fontSize: font.size.xs, color: color.textSubtle, marginTop: space[2] }}>
            Scan to open report
          </div>
        </div>
      )}

      {activeAction === 'email' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: space[3], marginBottom: space[3] }}>
          <TextInput
            label="Recipient email"
            type="email"
            placeholder="doctor@clinic.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextArea
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            fullWidth
          />
        </div>
      )}

      {activeAction === 'whatsapp' && (
        <div style={{
          padding: space[4], backgroundColor: color.neutral50,
          borderRadius: radius.md, border: `1px solid ${color.borderDefault}`,
          textAlign: 'center', marginBottom: space[3],
        }}>
          <div style={{ fontSize: font.size.sm, fontWeight: font.weight.medium, color: color.textDefault, marginBottom: space[1] }}>
            Open in WhatsApp
          </div>
          <div style={{ fontSize: font.size.xs, color: color.textSubtle }}>
            The report link will be pre-filled in a WhatsApp message
          </div>
        </div>
      )}

      {activeAction === 'wechat' && (
        <div style={{ marginBottom: space[3] }}>
          <QRCodePreview link={reportLink} />
          <div style={{ textAlign: 'center', fontSize: font.size.xs, color: color.textSubtle, marginTop: space[2] }}>
            Scan with WeChat to share
          </div>
        </div>
      )}

    </Modal>
  );
}
