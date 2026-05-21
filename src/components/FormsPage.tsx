import React, { useState } from 'react';
import { DropdownList, IconButton, Modal, PrimaryButton, SecondaryButton, Tag, TextInput, type TagColor } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';

type FieldKind = 'short-text' | 'long-text' | 'date' | 'checkbox' | 'radio' | 'signature' | 'heading';

interface FormField {
  id: string;
  kind: FieldKind;
  label: string;
  required?: boolean;
  options?: string[];   // for radio
  helper?: string;
}

interface FormDef {
  id: string;
  name: string;
  fields: FormField[];
  /** Number of times this form has been signed. */
  signed: number;
  /** Number of currently outstanding sends. */
  outstanding: number;
  updatedAt: string;
}

const FIELD_PALETTE: { kind: FieldKind; label: string }[] = [
  { kind: 'short-text', label: 'Short text' },
  { kind: 'long-text',  label: 'Long text' },
  { kind: 'date',       label: 'Date' },
  { kind: 'checkbox',   label: 'Checkbox' },
  { kind: 'radio',      label: 'Radio group' },
  { kind: 'signature',  label: 'Signature' },
  { kind: 'heading',    label: 'Section heading' },
];

const DEFAULT_FORM: FormDef = {
  id: 'form-consent',
  name: 'Crown placement informed consent',
  signed: 84,
  outstanding: 3,
  updatedAt: new Date().toISOString(),
  fields: [
    { id: 'f-1', kind: 'heading', label: 'Patient information' },
    { id: 'f-2', kind: 'short-text', label: 'Patient full name', required: true },
    { id: 'f-3', kind: 'date',       label: 'Date of birth',     required: true },
    { id: 'f-4', kind: 'heading', label: 'Treatment details' },
    { id: 'f-5', kind: 'long-text',  label: 'Procedures to be performed', required: true, helper: 'Pre-filled from the treatment plan' },
    { id: 'f-6', kind: 'radio',      label: 'I have discussed alternatives with my dentist:', options: ['Yes', 'No'], required: true },
    { id: 'f-7', kind: 'checkbox',   label: 'I understand the risks of crown placement, including pulp irritation, restoration failure, and need for further treatment.', required: true },
    { id: 'f-8', kind: 'heading', label: 'Signature' },
    { id: 'f-9', kind: 'signature',  label: 'Patient signature',                       required: true },
  ],
};

const SEED_FORMS: FormDef[] = [
  DEFAULT_FORM,
  { id: 'form-medhx',  name: 'Annual medical history update',         fields: [], signed: 312, outstanding: 7, updatedAt: new Date().toISOString() },
  { id: 'form-hipaa',  name: 'HIPAA notice acknowledgement',          fields: [], signed: 1180, outstanding: 0, updatedAt: new Date().toISOString() },
  { id: 'form-finance',name: 'Financial responsibility agreement',    fields: [], signed: 902, outstanding: 2, updatedAt: new Date().toISOString() },
];

interface OutstandingSend {
  id: string;
  formName: string;
  patientName: string;
  sentAt: string;
  channel: 'email' | 'sms' | 'in-office';
  status: 'awaiting' | 'opened' | 'signed' | 'expired';
}

const SEED_SENDS: OutstandingSend[] = [
  { id: 's-1', formName: 'Crown placement informed consent', patientName: 'Mina Yamada',  sentAt: hoursAgo(2),   channel: 'email',     status: 'opened' },
  { id: 's-2', formName: 'Crown placement informed consent', patientName: 'Ethan Liu',    sentAt: hoursAgo(48),  channel: 'email',     status: 'awaiting' },
  { id: 's-3', formName: 'Annual medical history update',    patientName: 'Noor Hassan',  sentAt: hoursAgo(72),  channel: 'sms',       status: 'awaiting' },
  { id: 's-4', formName: 'Crown placement informed consent', patientName: 'Leon Bernal',  sentAt: hoursAgo(120), channel: 'in-office', status: 'signed' },
  { id: 's-5', formName: 'Annual medical history update',    patientName: 'Aiko Tanaka',  sentAt: hoursAgo(720), channel: 'email',     status: 'expired' },
];

interface Props { onBackToHome?: () => void; onNavigate?: (id: DSCoreNavId) => void; }

export default function FormsPage({ onBackToHome, onNavigate }: Props) {
  const [form, setForm] = useState<FormDef>(DEFAULT_FORM);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const addField = (kind: FieldKind) => {
    const id = `f-${Date.now()}`;
    const field: FormField = { id, kind, label: defaultLabel(kind), options: kind === 'radio' ? ['Option 1', 'Option 2'] : undefined };
    setForm((f) => ({ ...f, fields: [...f.fields, field] }));
    setSelectedFieldId(id);
  };

  const removeField = (id: string) => setForm((f) => ({ ...f, fields: f.fields.filter((x) => x.id !== id) }));
  const moveField = (id: string, dir: -1 | 1) => {
    setForm((f) => {
      const idx = f.fields.findIndex((x) => x.id === id);
      if (idx === -1) return f;
      const next = idx + dir;
      if (next < 0 || next >= f.fields.length) return f;
      const arr = [...f.fields];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return { ...f, fields: arr };
    });
  };
  const updateField = (id: string, patch: Partial<FormField>) => setForm((f) => ({
    ...f,
    fields: f.fields.map((x) => x.id === id ? { ...x, ...patch } : x),
  }));

  const selected = selectedFieldId ? form.fields.find((f) => f.id === selectedFieldId) ?? null : null;

  return (
    <DSCoreShell active="files" unread={SEED_SENDS.filter((s) => s.status === 'awaiting').length} onNavigate={(id) => id === 'home' && onBackToHome ? onBackToHome() : onNavigate?.(id)}>
      <div style={{ maxWidth: '1480px', margin: '0 auto', padding: '32px 32px 80px' }}>
        <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', margin: 0, color: 'var(--ads-text-primary)' }}>
              Forms & e-Sign
            </h1>
            <p style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)', margin: '6px 0 0' }}>
              Design dynamic patient forms; send via email, SMS, or in-office; collect signatures with audit trail.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <SecondaryButton size={36} onClick={() => setPreviewOpen(true)}>Preview</SecondaryButton>
            <PrimaryButton size={36}>Send to patient</PrimaryButton>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr) 280px', gap: '12px' }}>
          {/* Field palette */}
          <aside style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', padding: '16px', height: 'fit-content' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Add field
            </h3>
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {FIELD_PALETTE.map((p) => (
                <button
                  key={p.kind}
                  type="button"
                  onClick={() => addField(p.kind)}
                  style={{
                    padding: '8px 10px',
                    border: '1px solid var(--ads-border-subtle)',
                    borderRadius: 'var(--ads-radius-sm)',
                    backgroundColor: 'var(--ads-bg-page)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    color: 'var(--ads-text-primary)',
                    textAlign: 'left',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Canvas */}
          <section style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', padding: '24px' }}>
            <TextInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
              style={{ fontSize: '18px', fontWeight: 500 }}
            />
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {form.fields.map((field) => (
                <FieldRow
                  key={field.id}
                  field={field}
                  selected={selectedFieldId === field.id}
                  onSelect={() => setSelectedFieldId(field.id)}
                  onMoveUp={() => moveField(field.id, -1)}
                  onMoveDown={() => moveField(field.id, 1)}
                  onRemove={() => removeField(field.id)}
                />
              ))}
              {form.fields.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ads-text-muted)', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
                  Add fields from the left palette to start building.
                </div>
              )}
            </div>
          </section>

          {/* Inspector */}
          <aside style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', padding: '16px', height: 'fit-content' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Field properties
            </h3>
            {selected ? (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <DropdownList
                  label="Type"
                  options={FIELD_PALETTE.map((p) => ({ value: p.kind, label: p.label }))}
                  value={selected.kind}
                  onChange={(v) => updateField(selected.id, { kind: v as FieldKind })}
                  fullWidth
                />
                <TextInput
                  label="Label"
                  value={selected.label}
                  onChange={(e) => updateField(selected.id, { label: e.target.value })}
                  fullWidth
                />
                <TextInput
                  label="Helper text"
                  value={selected.helper ?? ''}
                  onChange={(e) => updateField(selected.id, { helper: e.target.value })}
                  fullWidth
                />
                {selected.kind === 'radio' && (
                  <TextInput
                    label="Options (comma-separated)"
                    value={(selected.options ?? []).join(', ')}
                    onChange={(e) => updateField(selected.id, { options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                    fullWidth
                  />
                )}
                {selected.kind !== 'heading' && (
                  <SecondaryButton
                    size={36}
                    selected={!!selected.required}
                    onClick={() => updateField(selected.id, { required: !selected.required })}
                  >
                    {selected.required ? '★ Required' : '☆ Required'}
                  </SecondaryButton>
                )}
              </div>
            ) : (
              <div style={{ marginTop: '10px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                Select a field on the canvas to edit its properties.
              </div>
            )}
          </aside>
        </div>

        {/* Outstanding sends */}
        <section style={{ marginTop: '24px' }}>
          <h3 style={{ margin: '0 0 12px', fontFamily: 'var(--ads-font-sans)', fontSize: '15px', fontWeight: 500 }}>
            Active sends
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SEED_SENDS.map((s) => (
              <div key={s.id} style={{ padding: '12px 14px', backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500 }}>{s.formName}</div>
                  <div style={{ marginTop: '2px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                    {s.patientName} · {s.channel} · sent {new Date(s.sentAt).toLocaleString()}
                  </div>
                </div>
                <Tag size="small" color={SEND_TONE[s.status]}>{s.status}</Tag>
              </div>
            ))}
          </div>
        </section>

        {/* Library */}
        <section style={{ marginTop: '24px' }}>
          <h3 style={{ margin: '0 0 12px', fontFamily: 'var(--ads-font-sans)', fontSize: '15px', fontWeight: 500 }}>Form library</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
            {SEED_FORMS.map((f) => (
              <button key={f.id} type="button" onClick={() => setForm(f.id === DEFAULT_FORM.id ? DEFAULT_FORM : { ...f, fields: DEFAULT_FORM.fields })} style={{ padding: '14px', textAlign: 'left', background: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', cursor: 'pointer', font: 'inherit', color: 'inherit' }}>
                <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500 }}>{f.name}</div>
                <div style={{ marginTop: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                  {f.signed.toLocaleString()} signed · {f.outstanding} outstanding
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {previewOpen && (
        <Modal open onClose={() => setPreviewOpen(false)} title={form.name} size="md" footer={<PrimaryButton size={36} onClick={() => setPreviewOpen(false)}>Close</PrimaryButton>}>
          <FormPreview form={form} />
        </Modal>
      )}
    </DSCoreShell>
  );
}

function FieldRow({ field, selected, onSelect, onMoveUp, onMoveDown, onRemove }: {
  field: FormField; selected: boolean; onSelect: () => void; onMoveUp: () => void; onMoveDown: () => void; onRemove: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        padding: '10px 12px',
        border: `1px solid ${selected ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
        backgroundColor: selected ? 'color-mix(in srgb, var(--ads-blue-500) 6%, transparent)' : 'var(--ads-bg-page)',
        borderRadius: 'var(--ads-radius-sm)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <Tag size="small" color="purple">{field.kind}</Tag>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: field.kind === 'heading' ? 500 : 400, color: 'var(--ads-text-primary)' }}>
          {field.label}{field.required && <span style={{ color: 'var(--ads-danger-500)' }}> *</span>}
        </div>
        {field.helper && <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>{field.helper}</div>}
      </div>
      <div style={{ display: 'flex', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
        <IconButton size="md" aria-label="Move up"   onClick={onMoveUp}>↑</IconButton>
        <IconButton size="md" aria-label="Move down" onClick={onMoveDown}>↓</IconButton>
        <IconButton size="md" aria-label="Remove"    onClick={onRemove}>×</IconButton>
      </div>
    </div>
  );
}

function FormPreview({ form }: { form: FormDef }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h2 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '20px', fontWeight: 500 }}>{form.name}</h2>
      {form.fields.map((field) => (
        <PreviewField key={field.id} field={field} />
      ))}
      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
        <PrimaryButton size={36}>Submit</PrimaryButton>
      </div>
    </div>
  );
}

function PreviewField({ field }: { field: FormField }) {
  if (field.kind === 'heading') {
    return <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '15px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>{field.label}</h3>;
  }
  if (field.kind === 'short-text') return <TextInput label={field.label} required={field.required} helper={field.helper} fullWidth />;
  if (field.kind === 'date')       return <TextInput label={field.label} required={field.required} type="text" placeholder="MM / DD / YYYY" fullWidth />;
  if (field.kind === 'long-text') return (
    <div>
      <div style={{ marginBottom: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>{field.label}{field.required && <span style={{ color: 'var(--ads-danger-500)' }}> *</span>}</div>
      <textarea rows={4} style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '13px', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }} />
    </div>
  );
  if (field.kind === 'checkbox') return (
    <label style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
      <input type="checkbox" />
      <span>{field.label}{field.required && <span style={{ color: 'var(--ads-danger-500)' }}> *</span>}</span>
    </label>
  );
  if (field.kind === 'radio') return (
    <div>
      <div style={{ marginBottom: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>{field.label}{field.required && <span style={{ color: 'var(--ads-danger-500)' }}> *</span>}</div>
      {(field.options ?? []).map((o, i) => (
        <label key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', padding: '4px 0' }}>
          <input type="radio" name={field.id} /> {o}
        </label>
      ))}
    </div>
  );
  if (field.kind === 'signature') return (
    <div>
      <div style={{ marginBottom: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>{field.label}{field.required && <span style={{ color: 'var(--ads-danger-500)' }}> *</span>}</div>
      <div style={{ height: 80, backgroundColor: 'var(--ads-bg-page)', border: '1px dashed var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
        Sign here
      </div>
    </div>
  );
  return null;
}

const SEND_TONE: Record<OutstandingSend['status'], TagColor> = {
  awaiting: 'orange', opened: 'blue', signed: 'green', expired: 'red',
};

function defaultLabel(kind: FieldKind): string {
  switch (kind) {
    case 'short-text':  return 'New short text';
    case 'long-text':   return 'New long text';
    case 'date':        return 'Date';
    case 'checkbox':    return 'I agree to ...';
    case 'radio':       return 'Choose one';
    case 'signature':   return 'Signature';
    case 'heading':     return 'New section';
  }
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}
