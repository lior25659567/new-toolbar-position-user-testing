import React, { useState, useCallback } from 'react';
import { Modal } from '../../design-system';
import { color, font, space, radius, transition } from '../../design-system/tokens';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  reportName: string;
  patientName: string;
}

type ShareMethod = 'link' | 'email' | 'wechat' | 'whatsapp' | 'sms';

const SHARE_METHODS: { id: ShareMethod; label: string; icon: React.ReactNode; color: string }[] = [
  {
    id: 'link', label: 'Copy Link', color: '#6366F1',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  },
  {
    id: 'email', label: 'Email', color: '#EA4335',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>,
  },
  {
    id: 'whatsapp', label: 'WhatsApp', color: '#25D366',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  },
  {
    id: 'wechat', label: 'WeChat', color: '#07C160',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.297 2.858c-3.754 0-7.104 2.588-7.104 5.963 0 3.376 3.35 5.963 7.104 5.963.66 0 1.293-.09 1.904-.259a.67.67 0 01.556.076l1.477.864a.252.252 0 00.13.042.227.227 0 00.224-.229c0-.056-.022-.11-.037-.165l-.301-1.148a.458.458 0 01.165-.516c1.42-1.044 2.328-2.59 2.328-4.29 0-3.712-3.647-6.3-6.446-6.3zm-2.602 3.121c.498 0 .9.41.9.914a.907.907 0 01-.9.914.907.907 0 01-.9-.914c0-.505.403-.914.9-.914zm4.502 0c.498 0 .9.41.9.914a.907.907 0 01-.9.914.907.907 0 01-.9-.914c0-.505.403-.914.9-.914z"/></svg>,
  },
  {
    id: 'sms', label: 'SMS', color: '#3B82F6',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  },
];

// Simple QR code generator (renders a visual placeholder pattern)
function QRCode({ value, size = 160 }: { value: string; size?: number }) {
  // Generate a deterministic pattern from the value string
  const cells = 21;
  const cellSize = size / cells;
  const hash = (s: string, i: number) => {
    let h = 0;
    for (let j = 0; j < s.length; j++) h = ((h << 5) - h + s.charCodeAt(j) + i * 7) | 0;
    return h;
  };
  const grid: boolean[][] = [];
  for (let r = 0; r < cells; r++) {
    grid[r] = [];
    for (let c = 0; c < cells; c++) {
      // Fixed patterns (finder patterns in corners)
      const inFinderTL = r < 7 && c < 7;
      const inFinderTR = r < 7 && c >= cells - 7;
      const inFinderBL = r >= cells - 7 && c < 7;
      if (inFinderTL || inFinderTR || inFinderBL) {
        const lr = inFinderTL ? r : inFinderTR ? r : r - (cells - 7);
        const lc = inFinderTL ? c : inFinderTR ? c - (cells - 7) : c;
        grid[r][c] = (lr === 0 || lr === 6 || lc === 0 || lc === 6) || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
      } else {
        grid[r][c] = Math.abs(hash(value, r * cells + c)) % 3 === 0;
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {grid.map((row, r) =>
        row.map((cell, c) =>
          cell ? <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill="#1e2939" /> : null
        )
      )}
    </svg>
  );
}

function ShareMethodButton({ method, active, onClick }: {
  method: typeof SHARE_METHODS[0]; active: boolean; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        padding: '16px 12px', borderRadius: '12px', border: 'none', cursor: 'pointer',
        backgroundColor: active ? `${method.color}10` : hovered ? '#F9FAFB' : 'transparent',
        transition: 'all 0.2s ease',
        outline: active ? `2px solid ${method.color}` : '2px solid transparent',
        minWidth: '72px',
      }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '50%',
        backgroundColor: `${method.color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: method.color,
        transition: 'transform 0.2s ease',
        transform: hovered || active ? 'scale(1.1)' : 'scale(1)',
      }}>
        {method.icon}
      </div>
      <span style={{
        fontSize: '11px', fontWeight: active ? 600 : 500,
        color: active ? method.color : '#374151',
        fontFamily: font.family,
      }}>
        {method.label}
      </span>
    </button>
  );
}

export default function ShareModal({ open, onClose, reportName, patientName }: ShareModalProps) {
  const [activeMethod, setActiveMethod] = useState<ShareMethod>('link');
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(`Here's the dental report for ${patientName}`);

  const reportLink = `https://reports.itero.com/share/${Date.now().toString(36)}`;

  const handleCopyLink = useCallback(() => {
    navigator.clipboard?.writeText(reportLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [reportLink]);

  const handleSend = useCallback(() => {
    // Simulate sending
    onClose();
  }, [onClose]);

  const renderContent = () => {
    switch (activeMethod) {
      case 'link':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '13px', color: '#6a7282', fontFamily: font.family }}>
              Anyone with this link can view the report.
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 14px', borderRadius: '8px',
              border: `1px solid ${color.borderDefault}`, backgroundColor: '#F9FAFB',
            }}>
              <span style={{
                flex: 1, fontSize: '13px', color: '#374151', fontFamily: font.family,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {reportLink}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                style={{
                  padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 600, fontFamily: font.family,
                  backgroundColor: copied ? '#16A34A' : color.primary,
                  color: 'white', transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                {copied ? (
                  <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied</>
                ) : 'Copy'}
              </button>
            </div>
          </div>
        );

      case 'email':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#6a7282', display: 'block', marginBottom: '6px', fontFamily: font.family }}>Recipient email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@clinic.com"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: `1px solid ${color.borderDefault}`, fontSize: '13px',
                  fontFamily: font.family, outline: 'none', boxSizing: 'border-box',
                  transition: `border-color ${transition.fast}`,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = color.primary)}
                onBlur={(e) => (e.currentTarget.style.borderColor = color.borderDefault)}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#6a7282', display: 'block', marginBottom: '6px', fontFamily: font.family }}>Message</label>
              <textarea
                value={message} onChange={(e) => setMessage(e.target.value)}
                rows={3}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: `1px solid ${color.borderDefault}`, fontSize: '13px',
                  fontFamily: font.family, outline: 'none', resize: 'vertical',
                  boxSizing: 'border-box', lineHeight: '1.5',
                  transition: `border-color ${transition.fast}`,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = color.primary)}
                onBlur={(e) => (e.currentTarget.style.borderColor = color.borderDefault)}
              />
            </div>
            <button type="button" onClick={handleSend} style={sendBtnStyle}>
              Send Email
            </button>
          </div>
        );

      case 'wechat':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
            <div style={{
              padding: '16px', borderRadius: '12px', border: `1px solid ${color.borderDefault}`,
              backgroundColor: 'white',
            }}>
              <QRCode value={reportLink} size={180} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e2939', fontFamily: font.family }}>
                Scan with WeChat
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: font.family, marginTop: '4px' }}>
                Open WeChat and scan this QR code to view the report
              </div>
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#6a7282', display: 'block', marginBottom: '6px', fontFamily: font.family }}>Phone number</label>
              <input
                type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: `1px solid ${color.borderDefault}`, fontSize: '13px',
                  fontFamily: font.family, outline: 'none', boxSizing: 'border-box',
                  transition: `border-color ${transition.fast}`,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = color.primary)}
                onBlur={(e) => (e.currentTarget.style.borderColor = color.borderDefault)}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#6a7282', display: 'block', marginBottom: '6px', fontFamily: font.family }}>Message</label>
              <textarea
                value={message} onChange={(e) => setMessage(e.target.value)}
                rows={2}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: `1px solid ${color.borderDefault}`, fontSize: '13px',
                  fontFamily: font.family, outline: 'none', resize: 'vertical',
                  boxSizing: 'border-box', lineHeight: '1.5',
                  transition: `border-color ${transition.fast}`,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = color.primary)}
                onBlur={(e) => (e.currentTarget.style.borderColor = color.borderDefault)}
              />
            </div>
            <button type="button" onClick={handleSend} style={{ ...sendBtnStyle, backgroundColor: '#25D366' }}>
              Send via WhatsApp
            </button>
          </div>
        );

      case 'sms':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#6a7282', display: 'block', marginBottom: '6px', fontFamily: font.family }}>Phone number</label>
              <input
                type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: `1px solid ${color.borderDefault}`, fontSize: '13px',
                  fontFamily: font.family, outline: 'none', boxSizing: 'border-box',
                  transition: `border-color ${transition.fast}`,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = color.primary)}
                onBlur={(e) => (e.currentTarget.style.borderColor = color.borderDefault)}
              />
            </div>
            <button type="button" onClick={handleSend} style={sendBtnStyle}>
              Send SMS
            </button>
          </div>
        );
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Share Report" width={520}>
      {/* Report info */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 16px', borderRadius: '10px',
        backgroundColor: '#F9FAFB', border: `1px solid ${color.borderDefault}`,
        marginBottom: '20px',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          backgroundColor: `${color.primary}15`, display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e2939', fontFamily: font.family, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {reportName || 'Patient Report'}
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: font.family }}>
            {patientName || 'Patient'}
          </div>
        </div>
      </div>

      {/* Share method selector */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '4px',
        padding: '4px', borderRadius: '12px', backgroundColor: '#F9FAFB',
        marginBottom: '20px',
      }}>
        {SHARE_METHODS.map((m) => (
          <ShareMethodButton
            key={m.id}
            method={m}
            active={activeMethod === m.id}
            onClick={() => setActiveMethod(m.id)}
          />
        ))}
      </div>

      {/* Active method content */}
      <div style={{ minHeight: '120px' }}>
        {renderContent()}
      </div>
    </Modal>
  );
}

const sendBtnStyle: React.CSSProperties = {
  width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
  backgroundColor: '#009ACE', color: 'white', fontSize: '13px',
  fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: 'pointer',
  transition: 'all 0.2s ease',
};
