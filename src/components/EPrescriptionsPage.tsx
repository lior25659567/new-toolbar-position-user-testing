import React, { useMemo, useState } from 'react';
import { Avatar, DropdownList, Modal, NumberInput, PrimaryButton, SecondaryButton, Tag, TextInput, type TagColor } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';

interface Drug {
  id: string;
  brand: string;
  generic: string;
  strengthOptions: string[];   // ['250mg', '500mg', '875mg']
  defaultDispenseQty: number;
  schedule: 'OTC' | 'Rx' | 'CII' | 'CIII' | 'CIV';
  formularyTier: 1 | 2 | 3;     // mock tier (1 = preferred)
}

interface InteractionRule {
  /** Both drug ids must be present in patient meds for the rule to fire. */
  drugA: string;
  drugB: string;
  severity: 'minor' | 'moderate' | 'major';
  detail: string;
}

interface PatientMed {
  drugId: string;
  startedAt: string;
}

interface PatientAllergy {
  substance: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
}

interface RxRecord {
  id: string;
  rxNumber: string;
  patientId: string;
  patientName: string;
  prescriberName: string;
  drugId: string;
  drugBrand: string;
  drugGeneric: string;
  strength: string;
  sig: string;                 // "Take 1 tab by mouth every 8 hours…"
  dispenseQty: number;
  refills: number;
  pharmacy: string;
  status: 'pending-2fa' | 'sent' | 'filled' | 'cancelled';
  signedAt?: string;
  filledAt?: string;
}

const DRUGS: Drug[] = [
  { id: 'amoxicillin',    brand: 'Amoxil',     generic: 'amoxicillin',          strengthOptions: ['250mg', '500mg', '875mg'], defaultDispenseQty: 21, schedule: 'Rx',  formularyTier: 1 },
  { id: 'clindamycin',    brand: 'Cleocin',    generic: 'clindamycin',          strengthOptions: ['150mg', '300mg'],          defaultDispenseQty: 28, schedule: 'Rx',  formularyTier: 2 },
  { id: 'ibuprofen',      brand: 'Advil',      generic: 'ibuprofen',            strengthOptions: ['400mg', '600mg', '800mg'], defaultDispenseQty: 30, schedule: 'OTC', formularyTier: 1 },
  { id: 'acetaminophen',  brand: 'Tylenol',    generic: 'acetaminophen',        strengthOptions: ['500mg', '650mg'],          defaultDispenseQty: 30, schedule: 'OTC', formularyTier: 1 },
  { id: 'hydrocodone',    brand: 'Norco',      generic: 'hydrocodone/APAP',     strengthOptions: ['5/325mg', '7.5/325mg'],    defaultDispenseQty: 12, schedule: 'CII', formularyTier: 3 },
  { id: 'oxycodone',      brand: 'Percocet',   generic: 'oxycodone/APAP',       strengthOptions: ['5/325mg', '7.5/325mg'],    defaultDispenseQty: 8,  schedule: 'CII', formularyTier: 3 },
  { id: 'tramadol',       brand: 'Ultram',     generic: 'tramadol',             strengthOptions: ['50mg'],                    defaultDispenseQty: 12, schedule: 'CIV', formularyTier: 2 },
  { id: 'chlorhexidine',  brand: 'Peridex',    generic: 'chlorhexidine 0.12%',  strengthOptions: ['480mL'],                   defaultDispenseQty: 1,  schedule: 'Rx',  formularyTier: 1 },
  { id: 'penicillin-vk',  brand: 'Pen VK',     generic: 'penicillin V potassium',strengthOptions: ['250mg', '500mg'],         defaultDispenseQty: 28, schedule: 'Rx',  formularyTier: 1 },
  { id: 'warfarin',       brand: 'Coumadin',   generic: 'warfarin',             strengthOptions: ['1mg', '5mg'],              defaultDispenseQty: 30, schedule: 'Rx',  formularyTier: 1 },
];

const INTERACTIONS: InteractionRule[] = [
  { drugA: 'warfarin',   drugB: 'amoxicillin',   severity: 'moderate', detail: 'Amoxicillin may increase INR. Monitor closely; consider dose adjustment.' },
  { drugA: 'warfarin',   drugB: 'ibuprofen',     severity: 'major',    detail: 'NSAIDs significantly increase bleeding risk with warfarin. Avoid combination.' },
  { drugA: 'hydrocodone',drugB: 'tramadol',      severity: 'major',    detail: 'Concurrent opioids increase respiratory depression risk. Avoid combination.' },
  { drugA: 'oxycodone',  drugB: 'tramadol',      severity: 'major',    detail: 'Concurrent opioids increase respiratory depression risk. Avoid combination.' },
  { drugA: 'penicillin-vk', drugB: 'amoxicillin',severity: 'minor',    detail: 'Both are penicillins — therapeutic redundancy.' },
  { drugA: 'ibuprofen',  drugB: 'acetaminophen', severity: 'minor',    detail: 'Generally safe to alternate but cap APAP at 3g/day.' },
];

const PATIENTS = [
  { id: 'pat-mina',  name: 'Mina Yamada',  meds: [{ drugId: 'warfarin', startedAt: '2025-09-12' }] as PatientMed[],   allergies: [{ substance: 'Penicillin', severity: 'severe', reaction: 'Hives + breathing difficulty' }] as PatientAllergy[] },
  { id: 'pat-ethan', name: 'Ethan Liu',    meds: [] as PatientMed[],                                                  allergies: [] as PatientAllergy[] },
  { id: 'pat-noor',  name: 'Noor Hassan',  meds: [{ drugId: 'tramadol', startedAt: '2026-04-10' }] as PatientMed[],   allergies: [{ substance: 'Sulfa', severity: 'moderate', reaction: 'Rash' }] as PatientAllergy[] },
  { id: 'pat-leon',  name: 'Leon Bernal',  meds: [] as PatientMed[],                                                  allergies: [] as PatientAllergy[] },
];

const SEED_HISTORY: RxRecord[] = [
  { id: 'rx-1', rxNumber: 'Rx-2026-0231', patientId: 'pat-mina',  patientName: 'Mina Yamada', prescriberName: 'Dr. Alex Watanabe', drugId: 'amoxicillin', drugBrand: 'Amoxil',  drugGeneric: 'amoxicillin', strength: '500mg', sig: 'Take 1 capsule by mouth every 8 hours for 7 days', dispenseQty: 21, refills: 0, pharmacy: 'Walgreens · 750 Market St', status: 'sent',   signedAt: hoursAgo(2)},
  { id: 'rx-2', rxNumber: 'Rx-2026-0228', patientId: 'pat-noor',  patientName: 'Noor Hassan', prescriberName: 'Dr. Maria Petrov',  drugId: 'ibuprofen',   drugBrand: 'Advil',   drugGeneric: 'ibuprofen',   strength: '600mg', sig: 'Take 1 tablet by mouth every 6 hours as needed for pain',     dispenseQty: 30, refills: 1, pharmacy: 'CVS · 8th Ave',         status: 'filled', signedAt: hoursAgo(48), filledAt: hoursAgo(40)},
  { id: 'rx-3', rxNumber: 'Rx-2026-0224', patientId: 'pat-leon',  patientName: 'Leon Bernal', prescriberName: 'Dr. Ravi Subramani', drugId: 'chlorhexidine',drugBrand: 'Peridex', drugGeneric: 'chlorhexidine 0.12%', strength: '480mL', sig: 'Rinse 15mL twice daily for 2 weeks',                          dispenseQty: 1,  refills: 0, pharmacy: 'Walgreens · 750 Market St', status: 'filled', signedAt: hoursAgo(120), filledAt: hoursAgo(110)},
];

interface Props { onBackToHome?: () => void; onNavigate?: (id: DSCoreNavId) => void; }

export default function EPrescriptionsPage({ onBackToHome, onNavigate }: Props) {
  const [history, setHistory] = useState<RxRecord[]>(SEED_HISTORY);
  const [patientId, setPatientId] = useState('pat-mina');
  const [drugId, setDrugId] = useState('amoxicillin');
  const [strength, setStrength] = useState('500mg');
  const [sig, setSig] = useState('Take 1 capsule by mouth every 8 hours for 7 days');
  const [dispenseQty, setDispenseQty] = useState(21);
  const [refills, setRefills] = useState(0);
  const [pharmacy, setPharmacy] = useState('Walgreens · 750 Market St');
  const [twofaOpen, setTwofaOpen] = useState(false);
  const [twofaCode, setTwofaCode] = useState('');

  const patient = PATIENTS.find((p) => p.id === patientId)!;
  const drug = DRUGS.find((d) => d.id === drugId)!;

  // Allergy match (e.g. patient allergic to "Penicillin" + we're prescribing amoxicillin/penicillin-vk)
  const allergyAlerts = useMemo(() => {
    const alerts: { substance: string; severity: PatientAllergy['severity']; reason: string }[] = [];
    for (const a of patient.allergies) {
      const sub = a.substance.toLowerCase();
      if (sub.includes('penicillin') && (drug.id === 'amoxicillin' || drug.id === 'penicillin-vk')) {
        alerts.push({ substance: a.substance, severity: a.severity, reason: `${drug.generic} is a beta-lactam — same class as ${a.substance}` });
      }
      if (sub.includes('sulfa') && drug.generic.includes('sulfa')) {
        alerts.push({ substance: a.substance, severity: a.severity, reason: `${drug.generic} contains sulfonamides` });
      }
    }
    return alerts;
  }, [patient, drug]);

  // Drug-drug interactions with current meds
  const interactionAlerts = useMemo(() => {
    const fired: InteractionRule[] = [];
    for (const med of patient.meds) {
      for (const rule of INTERACTIONS) {
        const match = (rule.drugA === med.drugId && rule.drugB === drug.id) || (rule.drugA === drug.id && rule.drugB === med.drugId);
        if (match) fired.push(rule);
      }
    }
    return fired;
  }, [patient, drug]);

  const isControlled = drug.schedule.startsWith('C');
  const blockedByMajor = interactionAlerts.some((r) => r.severity === 'major') || allergyAlerts.some((a) => a.severity === 'severe');

  const onSign = () => {
    if (isControlled) {
      setTwofaOpen(true);
      return;
    }
    finalizeSign();
  };

  const finalizeSign = () => {
    const newRx: RxRecord = {
      id: `rx-${Date.now()}`,
      rxNumber: `Rx-2026-${String(232 + history.length).padStart(4, '0')}`,
      patientId, patientName: patient.name,
      prescriberName: 'Dr. Alex Watanabe',
      drugId, drugBrand: drug.brand, drugGeneric: drug.generic, strength,
      sig, dispenseQty, refills, pharmacy,
      status: 'sent',
      signedAt: new Date().toISOString(),
    };
    setHistory((h) => [newRx, ...h]);
    setTwofaOpen(false);
    setTwofaCode('');
  };

  const onDrugChange = (newId: string) => {
    setDrugId(newId);
    const d = DRUGS.find((x) => x.id === newId)!;
    setStrength(d.strengthOptions[0]);
    setDispenseQty(d.defaultDispenseQty);
  };

  return (
    <DSCoreShell active="patients" unread={0} onNavigate={(id) => id === 'home' && onBackToHome ? onBackToHome() : onNavigate?.(id)}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 40px 80px' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', margin: 0, color: 'var(--ads-text-primary)' }}>
            e-Prescriptions
          </h1>
          <p style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)', margin: '6px 0 0' }}>
            Sign and send prescriptions. Allergies and interactions check live against the patient's chart. Controlled substances require step-up auth.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '16px' }}>
          <Card title="New prescription">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <DropdownList label="Patient" required options={PATIENTS.map((p) => ({ value: p.id, label: p.name }))} value={patientId} onChange={setPatientId} fullWidth />

              {/* Patient profile chip row */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {patient.allergies.map((a) => (
                  <Tag key={a.substance} size="small" color="red">⚠ {a.substance} ({a.severity})</Tag>
                ))}
                {patient.meds.map((m) => {
                  const d = DRUGS.find((x) => x.id === m.drugId);
                  return d ? <Tag key={m.drugId} size="small" color="purple">Rx: {d.generic}</Tag> : null;
                })}
                {patient.allergies.length === 0 && patient.meds.length === 0 && (
                  <Tag size="small" color="green">No allergies, no current meds</Tag>
                )}
              </div>

              <DropdownList
                label="Drug"
                required
                options={DRUGS.map((d) => ({ value: d.id, label: `${d.brand} (${d.generic}) · ${d.schedule}` }))}
                value={drugId}
                onChange={onDrugChange}
                fullWidth
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <DropdownList
                  label="Strength"
                  options={drug.strengthOptions.map((s) => ({ value: s, label: s }))}
                  value={strength}
                  onChange={setStrength}
                  fullWidth
                />
                <NumberInput label="Dispense qty" value={dispenseQty} onChange={(v) => setDispenseQty(Number(v) || 0)} fullWidth />
              </div>
              <TextInput label="Sig (directions for patient)" required value={sig} onChange={(e) => setSig(e.target.value)} fullWidth />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <NumberInput label="Refills" value={refills} onChange={(v) => setRefills(Number(v) || 0)} fullWidth />
                <TextInput label="Pharmacy" value={pharmacy} onChange={(e) => setPharmacy(e.target.value)} fullWidth />
              </div>

              {/* Alerts */}
              {allergyAlerts.length > 0 && (
                <div style={{ padding: '12px 14px', backgroundColor: 'var(--ads-tag-red-bg)', border: '1px solid var(--ads-tag-red-br)', borderRadius: 'var(--ads-radius-sm)' }}>
                  <strong style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-tag-red-fg)' }}>Allergy alert</strong>
                  <ul style={{ margin: '6px 0 0', paddingLeft: '18px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
                    {allergyAlerts.map((a, i) => (
                      <li key={i}><strong>{a.substance}</strong> ({a.severity}) — {a.reason}</li>
                    ))}
                  </ul>
                </div>
              )}
              {interactionAlerts.length > 0 && (
                <div style={{ padding: '12px 14px', backgroundColor: 'var(--ads-tag-orange-bg)', border: '1px solid var(--ads-tag-orange-br)', borderRadius: 'var(--ads-radius-sm)' }}>
                  <strong style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-tag-orange-fg)' }}>Drug–drug interactions</strong>
                  <ul style={{ margin: '6px 0 0', paddingLeft: '18px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
                    {interactionAlerts.map((r, i) => (
                      <li key={i}>
                        <Tag size="small" color={r.severity === 'major' ? 'red' : r.severity === 'moderate' ? 'orange' : 'blue'}>
                          {r.severity}
                        </Tag>{' '}
                        {r.detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {isControlled && (
                <div style={{ padding: '12px 14px', backgroundColor: 'var(--ads-tag-purple-bg)', border: '1px solid var(--ads-tag-purple-br)', borderRadius: 'var(--ads-radius-sm)', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
                  <strong>Schedule {drug.schedule.replace('C', '')} controlled substance.</strong> EPCS rules require two-factor authentication and a unique 6-digit token at signing.
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <SecondaryButton size={36} onClick={() => { /* draft no-op */ }}>Save draft</SecondaryButton>
                <PrimaryButton size={36} disabled={blockedByMajor} onClick={onSign}>
                  {isControlled ? 'Sign with 2FA' : 'Sign & send'}
                </PrimaryButton>
              </div>
              {blockedByMajor && (
                <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-danger-500)' }}>
                  Major interaction or severe allergy detected — clinical override required before signing (not implemented in this demo).
                </p>
              )}
            </div>
          </Card>

          <Card title="Recent prescriptions" subtitle="All Rx written by this practice">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.map((rx) => (
                <div
                  key={rx.id}
                  style={{
                    padding: '12px 14px',
                    border: '1px solid var(--ads-border-subtle)',
                    backgroundColor: 'var(--ads-bg-surface)',
                    borderRadius: 'var(--ads-radius-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '12px', color: 'var(--ads-text-primary)', fontWeight: 500 }}>
                      {rx.rxNumber}
                    </span>
                    <Tag size="small" color={STATUS_TONE[rx.status]}>{rx.status}</Tag>
                  </div>
                  <div style={{ marginTop: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)', fontWeight: 500 }}>
                    {rx.drugBrand} {rx.strength}
                    <span style={{ fontWeight: 400, color: 'var(--ads-text-muted)' }}> · {rx.drugGeneric}</span>
                  </div>
                  <div style={{ marginTop: '2px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                    {rx.patientName} · {rx.prescriberName} · {rx.pharmacy}
                  </div>
                  <div style={{ marginTop: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)', fontStyle: 'italic' }}>
                    "{rx.sig}"
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {twofaOpen && (
        <Modal
          open
          onClose={() => setTwofaOpen(false)}
          title="EPCS two-factor authentication"
          size="sm"
          footer={
            <>
              <SecondaryButton size={36} onClick={() => setTwofaOpen(false)}>Cancel</SecondaryButton>
              <PrimaryButton size={36} disabled={!/^\d{6}$/.test(twofaCode)} onClick={finalizeSign}>
                Confirm & sign
              </PrimaryButton>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar name="AW" size="md" />
              <div>
                <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500 }}>Dr. Alex Watanabe</div>
                <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>DEA: AW1234567</div>
              </div>
            </div>
            <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
              Enter the 6-digit code from your authenticator app to sign this controlled-substance prescription.
            </p>
            <TextInput
              label="Authenticator code"
              required
              value={twofaCode}
              onChange={(e) => setTwofaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              fullWidth
              style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', letterSpacing: '0.2em' }}
            />
          </div>
        </Modal>
      )}
    </DSCoreShell>
  );
}

const STATUS_TONE: Record<RxRecord['status'], TagColor> = {
  'pending-2fa': 'orange',
  sent:          'blue',
  filled:        'green',
  cancelled:     'red',
};

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '20px',
      }}
    >
      <header style={{ marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '15px' }}>{title}</h3>
        {subtitle && <p style={{ margin: '4px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}
