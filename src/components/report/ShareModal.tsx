import React, { useState, useCallback } from 'react';
import { Modal, Tabs, PrimaryButton, SecondaryButton, TextInput, TextArea } from '../../design-system';
import { color, font, space, radius } from '../../design-system/tokens';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  reportName: string;
  patientName: string;
}

type ShareMethod = 'link' | 'email' | 'whatsapp' | 'sms';

const METHODS: { id: ShareMethod; label: string }[] = [
  { id: 'link', label: 'Link' },
  { id: 'email', label: 'Email' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'sms', label: 'SMS' },
];

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
    window.setTimeout(() => setCopied(false), 2000);
  }, [reportLink]);

  const handleSend = useCallback(() => {
    onClose();
  }, [onClose]);

  // Footer changes by method — Link uses a single Copy action, the others a Send action.
  const footer = (() => {
    const cancel = <SecondaryButton size={36} onClick={onClose}>Cancel</SecondaryButton>;
    const wrap = (right: React.ReactNode) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: space[2] }}>
        {cancel}
        {right}
      </div>
    );
    switch (activeMethod) {
      case 'link':
        return wrap(<PrimaryButton size={36} onClick={handleCopyLink}>{copied ? 'Copied' : 'Copy link'}</PrimaryButton>);
      case 'email':
        return wrap(<PrimaryButton size={36} onClick={handleSend} disabled={!email}>Send email</PrimaryButton>);
      case 'whatsapp':
        return wrap(<PrimaryButton size={36} onClick={handleSend} disabled={!phone}>Send</PrimaryButton>);
      case 'sms':
        return wrap(<PrimaryButton size={36} onClick={handleSend} disabled={!phone}>Send SMS</PrimaryButton>);
    }
  })();

  const tabItems = METHODS.map((m) => ({ id: m.id, label: m.label }));

  return (
    <Modal open={open} onClose={onClose} title="Share report" width={520} footer={footer}>
      {/* Report identity line — single line, no chrome */}
      <div style={{
        fontSize: font.size.xs,
        color: color.textSubtle,
        marginBottom: space[4],
      }}>
        {reportName || 'Patient Report'} · {patientName || 'Patient'}
      </div>

      {/* Method tabs */}
      <Tabs
        items={tabItems}
        activeId={activeMethod}
        onChange={(id) => setActiveMethod(id as ShareMethod)}
      />

      {/* Method body */}
      <div style={{ marginTop: space[5], minHeight: 130 }}>
        {activeMethod === 'link' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
            <label style={{
              fontSize: font.size.xs,
              fontWeight: font.weight.medium,
              color: color.textLabel,
              fontFamily: font.family,
            }}>
              Anyone with this link can view the report
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: space[2],
              padding: `${space[2]} ${space[3]}`,
              borderRadius: radius.md,
              border: `1px solid ${color.borderDefault}`,
              backgroundColor: color.bgSurface,
              fontSize: font.size.xs,
              fontFamily: font.family,
              color: color.textDefault,
            }}>
              <span style={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>{reportLink}</span>
              {copied && (
                <span style={{ color: color.success, fontWeight: font.weight.medium, fontSize: font.size['2xs'] }}>
                  Copied
                </span>
              )}
            </div>
          </div>
        )}

        {activeMethod === 'email' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[3] }}>
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

        {(activeMethod === 'whatsapp' || activeMethod === 'sms') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[3] }}>
            <TextInput
              label="Phone number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
            {activeMethod === 'whatsapp' && (
              <TextArea
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                fullWidth
              />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
