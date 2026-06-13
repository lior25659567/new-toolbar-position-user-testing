import React, { useMemo, useState } from 'react';
import { Avatar, Checkbox, DropdownList, PrimaryButton, SecondaryButton, Tag, TextInput } from '../design-system';

interface OnboardingPageProps {
  onBackToHome?: () => void;
}

type StepId = 'welcome' | 'practice' | 'pms' | 'pms-import' | 'schedule' | 'team' | 'plan' | 'baa' | 'review' | 'done';

interface StepDef {
  id: StepId;
  title: string;
  description: string;
  group: string;
}

const ALL_STEPS: StepDef[] = [
  { id: 'welcome',     group: 'Get started', title: 'Welcome',                 description: "Let's set up your DS Core workspace." },
  { id: 'practice',    group: 'Get started', title: 'About your practice',     description: 'Name, address, NPI, and the basics.' },
  { id: 'pms',         group: 'Connect',     title: 'Existing software',       description: 'Tell us what you currently use.' },
  { id: 'pms-import',  group: 'Connect',     title: 'Import patients',         description: 'Bring patients in from your old system.' },
  { id: 'schedule',    group: 'Configure',   title: 'Operating hours',         description: 'When the practice is open and which chairs you have.' },
  { id: 'team',        group: 'Configure',   title: 'Invite your team',        description: 'Send invites to your dentists, hygienists, and staff.' },
  { id: 'plan',        group: 'Subscribe',   title: 'Pick a plan',             description: 'Choose Starter, Pro, or Enterprise.' },
  { id: 'baa',         group: 'Compliance',  title: 'Sign HIPAA BAA',          description: 'Required Business Associate Agreement.' },
  { id: 'review',      group: 'Compliance',  title: 'Review & confirm',        description: 'One last look before we launch your workspace.' },
  { id: 'done',        group: 'Compliance',  title: 'All set!',                description: 'Your workspace is ready.' },
];

interface OnboardingState {
  practiceName: string;
  npi: string;
  address: string;
  phone: string;
  /** When 'open-dental' or 'eaglesoft', the import step appears; when 'none', it's skipped. */
  pmsChoice: 'open-dental' | 'eaglesoft' | 'dentrix' | 'none';
  pmsCredentialsValid: boolean;
  importStarted: boolean;
  workingHoursStart: string;
  workingHoursEnd: string;
  operatoryCount: number;
  teamInvites: { email: string; role: 'admin' | 'clinician' | 'staff' | 'lab-liaison' }[];
  inviteDraft: { email: string; role: 'admin' | 'clinician' | 'staff' | 'lab-liaison' };
  plan: 'starter' | 'pro' | 'enterprise';
  baaSigned: boolean;
  baaSignerName: string;
}

const PLAN_PRICE = { starter: 99, pro: 399, enterprise: 999 };

export default function OnboardingPage({ onBackToHome }: OnboardingPageProps) {
  const [state, setState] = useState<OnboardingState>({
    practiceName: '',
    npi: '',
    address: '',
    phone: '',
    pmsChoice: 'open-dental',
    pmsCredentialsValid: false,
    importStarted: false,
    workingHoursStart: '08:00',
    workingHoursEnd: '18:00',
    operatoryCount: 4,
    teamInvites: [],
    inviteDraft: { email: '', role: 'clinician' },
    plan: 'pro',
    baaSigned: false,
    baaSignerName: '',
  });

  // Branching: skip 'pms-import' if user said they have no existing PMS.
  const visibleSteps = useMemo(() => ALL_STEPS.filter((s) => s.id !== 'pms-import' || state.pmsChoice !== 'none'), [state.pmsChoice]);

  const [currentStepId, setCurrentStepId] = useState<StepId>('welcome');
  const currentIndex = visibleSteps.findIndex((s) => s.id === currentStepId);
  const current = visibleSteps[currentIndex];
  const next = visibleSteps[currentIndex + 1];
  const prev = visibleSteps[currentIndex - 1];

  const canAdvance = useMemo(() => {
    switch (currentStepId) {
      case 'welcome':    return true;
      case 'practice':   return state.practiceName.trim().length >= 3 && /^\d{10}$/.test(state.npi);
      case 'pms':        return true;
      case 'pms-import': return state.pmsCredentialsValid;
      case 'schedule':   return /^\d{2}:\d{2}$/.test(state.workingHoursStart) && /^\d{2}:\d{2}$/.test(state.workingHoursEnd) && state.operatoryCount > 0;
      case 'team':       return true; // skippable
      case 'plan':       return true;
      case 'baa':        return state.baaSigned && state.baaSignerName.trim().length > 0;
      case 'review':     return true;
      case 'done':       return false;
    }
  }, [currentStepId, state]);

  const update = (patch: Partial<OnboardingState>) => setState((s) => ({ ...s, ...patch }));

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--ads-bg-page)', fontFamily: 'var(--ads-font-sans)' }}>
      {/* Top bar */}
      <header style={{ height: 56, backgroundColor: 'var(--ads-bg-surface)', borderBottom: '1px solid var(--ads-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 600, fontSize: '15px', letterSpacing: '0.06em' }}>
            DS CORE
          </span>
          <Tag size="small" color="purple">Onboarding</Tag>
        </div>
        <button
          type="button"
          onClick={onBackToHome}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: 'var(--ads-text-muted)' }}
        >
          Save & exit
        </button>
      </header>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Sidebar with steps */}
        <aside style={{ width: 260, flexShrink: 0, padding: '24px 16px', borderRight: '1px solid var(--ads-border-subtle)', backgroundColor: 'var(--ads-bg-surface)', overflowY: 'auto' }}>
          {Array.from(new Set(visibleSteps.map((s) => s.group))).map((group) => (
            <div key={group} style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 8px 8px', fontFamily: 'var(--ads-font-sans)', fontSize: '11px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {group}
              </h4>
              {visibleSteps.filter((s) => s.group === group).map((s) => {
                const stepIndex = visibleSteps.findIndex((x) => x.id === s.id);
                const isComplete = stepIndex < currentIndex;
                const isActive = s.id === currentStepId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentStepId(s.id)}
                    disabled={!isComplete && !isActive}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '8px 10px',
                      background: isActive ? 'color-mix(in srgb, var(--ads-blue-500) 8%, transparent)' : 'transparent',
                      border: '1px solid', borderColor: isActive ? 'var(--ads-blue-500)' : 'transparent',
                      borderRadius: 'var(--ads-radius-sm)',
                      cursor: isComplete || isActive ? 'pointer' : 'default',
                      color: isActive ? 'var(--ads-blue-550)' : isComplete ? 'var(--ads-text-primary)' : 'var(--ads-text-muted)',
                      fontFamily: 'inherit',
                      fontSize: '13px',
                      textAlign: 'left',
                      marginBottom: '2px',
                    }}
                  >
                    <span
                      style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: isComplete ? 'var(--ads-success-600)' : isActive ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)',
                        color: '#fff',
                        fontFamily: 'inherit', fontSize: '11px', fontWeight: 600,
                      }}
                    >
                      {isComplete ? '✓' : stepIndex + 1}
                    </span>
                    <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        {/* Step content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '40px 32px 80px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Step {currentIndex + 1} of {visibleSteps.length}
              </div>
              <h1 style={{ margin: '6px 0 0', fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', color: 'var(--ads-text-primary)' }}>
                {current.title}
              </h1>
              <p style={{ margin: '6px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)' }}>
                {current.description}
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', padding: '24px' }}>
              {currentStepId === 'welcome' && <Welcome />}
              {currentStepId === 'practice' && <PracticeStep state={state} update={update} />}
              {currentStepId === 'pms' && <PmsStep state={state} update={update} />}
              {currentStepId === 'pms-import' && <PmsImportStep state={state} update={update} />}
              {currentStepId === 'schedule' && <ScheduleStep state={state} update={update} />}
              {currentStepId === 'team' && <TeamStep state={state} update={update} />}
              {currentStepId === 'plan' && <PlanStep state={state} update={update} />}
              {currentStepId === 'baa' && <BaaStep state={state} update={update} />}
              {currentStepId === 'review' && <ReviewStep state={state} />}
              {currentStepId === 'done' && <DoneStep onFinish={onBackToHome} />}
            </div>

            {currentStepId !== 'done' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <SecondaryButton size={36} disabled={!prev} onClick={() => prev && setCurrentStepId(prev.id)}>
                  Back
                </SecondaryButton>
                <PrimaryButton
                  size={36}
                  disabled={!canAdvance}
                  onClick={() => next && setCurrentStepId(next.id)}
                >
                  {currentStepId === 'review' ? 'Launch workspace' : 'Continue'}
                </PrimaryButton>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function Welcome() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'var(--ads-font-sans)', fontSize: '14px', lineHeight: '20px', color: 'var(--ads-text-primary)' }}>
      <p style={{ margin: 0 }}>This wizard takes about 15 minutes. You can save and resume at any point.</p>
      <p style={{ margin: 0 }}>We'll set up:</p>
      <ul style={{ margin: 0, paddingLeft: '20px' }}>
        <li>Your practice profile</li>
        <li>An import from your existing PMS (optional)</li>
        <li>Operating hours and chairs</li>
        <li>Team invites</li>
        <li>A subscription plan</li>
        <li>The HIPAA BAA</li>
      </ul>
    </div>
  );
}

function PracticeStep({ state, update }: { state: OnboardingState; update: (p: Partial<OnboardingState>) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <TextInput label="Practice name" required value={state.practiceName} onChange={(e) => update({ practiceName: e.target.value })} fullWidth />
      <TextInput label="NPI (10 digits)" required value={state.npi} onChange={(e) => update({ npi: e.target.value.replace(/\D/g, '').slice(0, 10) })} fullWidth />
      <TextInput label="Address" value={state.address} onChange={(e) => update({ address: e.target.value })} fullWidth />
      <TextInput label="Phone" value={state.phone} onChange={(e) => update({ phone: e.target.value })} fullWidth />
    </div>
  );
}

function PmsStep({ state, update }: { state: OnboardingState; update: (p: Partial<OnboardingState>) => void }) {
  const options = [
    { value: 'open-dental', label: 'Open Dental' },
    { value: 'eaglesoft',   label: 'Eaglesoft' },
    { value: 'dentrix',     label: 'Dentrix' },
    { value: 'none',        label: "I'm not using a PMS today" },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <DropdownList
        label="Current practice management software"
        options={options}
        value={state.pmsChoice}
        onChange={(v) => update({ pmsChoice: v as OnboardingState['pmsChoice'] })}
        fullWidth
      />
      {state.pmsChoice !== 'none' && (
        <div style={{ padding: '12px 14px', backgroundColor: 'var(--ads-tag-blue-bg)', border: '1px solid var(--ads-tag-blue-br)', borderRadius: 'var(--ads-radius-sm)', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
          Next, you'll connect to {options.find((o) => o.value === state.pmsChoice)?.label} so we can import your patients.
        </div>
      )}
      {state.pmsChoice === 'none' && (
        <div style={{ padding: '12px 14px', backgroundColor: 'var(--ads-tag-green-bg)', border: '1px solid var(--ads-tag-green-br)', borderRadius: 'var(--ads-radius-sm)', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
          Great — you'll start fresh. We'll skip the import step.
        </div>
      )}
    </div>
  );
}

function PmsImportStep({ state, update }: { state: OnboardingState; update: (p: Partial<OnboardingState>) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
        Run our connector on your server to authorize a one-time read of your patient roster.
      </p>
      <TextInput label="Bridge service hostname" placeholder="bridge.local" fullWidth />
      <TextInput label="Read-only API key" placeholder="•••••••" fullWidth type="password" />
      <PrimaryButton size={36} onClick={() => update({ pmsCredentialsValid: true })} disabled={state.pmsCredentialsValid}>
        {state.pmsCredentialsValid ? 'Connection verified ✓' : 'Test connection'}
      </PrimaryButton>
      {state.pmsCredentialsValid && (
        <SecondaryButton size={36} onClick={() => update({ importStarted: true })} disabled={state.importStarted}>
          {state.importStarted ? 'Import scheduled ✓' : 'Start import'}
        </SecondaryButton>
      )}
    </div>
  );
}

function ScheduleStep({ state, update }: { state: OnboardingState; update: (p: Partial<OnboardingState>) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <TextInput label="Hours start" value={state.workingHoursStart} onChange={(e) => update({ workingHoursStart: e.target.value })} fullWidth />
        <TextInput label="Hours end"   value={state.workingHoursEnd}   onChange={(e) => update({ workingHoursEnd: e.target.value })} fullWidth />
      </div>
      <TextInput
        label="Number of operatories"
        value={String(state.operatoryCount)}
        onChange={(e) => update({ operatoryCount: Math.max(0, Number(e.target.value.replace(/\D/g, '')) || 0) })}
        fullWidth
      />
    </div>
  );
}

function TeamStep({ state, update }: { state: OnboardingState; update: (p: Partial<OnboardingState>) => void }) {
  const addInvite = () => {
    if (!/.+@.+\..+/.test(state.inviteDraft.email)) return;
    update({ teamInvites: [...state.teamInvites, state.inviteDraft], inviteDraft: { email: '', role: 'clinician' } });
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
        Invite teammates now or skip — you can always invite from Settings → Team later.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '8px', alignItems: 'flex-end' }}>
        <TextInput
          label="Email"
          value={state.inviteDraft.email}
          onChange={(e) => update({ inviteDraft: { ...state.inviteDraft, email: e.target.value } })}
          fullWidth
        />
        <DropdownList
          label="Role"
          options={[
            { value: 'admin',        label: 'Admin' },
            { value: 'clinician',    label: 'Clinician' },
            { value: 'staff',        label: 'Staff' },
            { value: 'lab-liaison',  label: 'Lab liaison' },
          ]}
          value={state.inviteDraft.role}
          onChange={(v) => update({ inviteDraft: { ...state.inviteDraft, role: v as OnboardingState['inviteDraft']['role'] } })}
          fullWidth
        />
        <SecondaryButton size={36} onClick={addInvite}>Add</SecondaryButton>
      </div>
      {state.teamInvites.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {state.teamInvites.map((t, i) => (
            <div key={i} style={{ padding: '8px 10px', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
              <span>{t.email}</span>
              <Tag size="small" color="blue">{t.role}</Tag>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlanStep({ state, update }: { state: OnboardingState; update: (p: Partial<OnboardingState>) => void }) {
  const plans: { id: OnboardingState['plan']; name: string; perks: string[] }[] = [
    { id: 'starter',    name: 'Starter',    perks: ['50 cases/mo', '3 seats', 'Email support'] },
    { id: 'pro',        name: 'Pro',        perks: ['200 cases/mo', '12 seats', 'Audit log + API'] },
    { id: 'enterprise', name: 'Enterprise', perks: ['Unlimited cases', 'Unlimited seats', 'SSO + dedicated CSM'] },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
      {plans.map((p) => {
        const isSelected = state.plan === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => update({ plan: p.id })}
            style={{
              padding: '16px',
              border: `2px solid ${isSelected ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
              borderRadius: 'var(--ads-radius-sm)',
              background: 'var(--ads-bg-surface)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              color: 'inherit',
              textAlign: 'left',
            }}
          >
            <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '15px', fontWeight: 500 }}>{p.name}</div>
            <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '20px', fontWeight: 500, marginTop: '4px' }}>${PLAN_PRICE[p.id]}<span style={{ fontSize: '12px', color: 'var(--ads-text-muted)', fontWeight: 400 }}> / mo</span></div>
            <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
              {p.perks.map((perk) => <li key={perk}>✓ {perk}</li>)}
            </ul>
          </button>
        );
      })}
    </div>
  );
}

function BaaStep({ state, update }: { state: OnboardingState; update: (p: Partial<OnboardingState>) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ padding: '14px 16px', backgroundColor: 'var(--ads-bg-page)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', maxHeight: '240px', overflowY: 'auto', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', lineHeight: '18px', color: 'var(--ads-text-primary)' }}>
        <strong>HIPAA Business Associate Agreement (excerpt)</strong>
        <p>This Agreement is entered into by and between {state.practiceName || '[Practice Name]'} ("Covered Entity") and DS Core, Inc. ("Business Associate") and governs the safeguarding of Protected Health Information ("PHI") in accordance with the Health Insurance Portability and Accountability Act of 1996...</p>
        <p>1. Permitted uses and disclosures. Business Associate may use and disclose PHI only as permitted or required by this Agreement or as Required by Law...</p>
        <p>2. Safeguards. Business Associate will use appropriate administrative, physical, and technical safeguards to prevent the use or disclosure of PHI other than as provided for by this Agreement...</p>
        <p>3. Reporting. Business Associate will report to Covered Entity any use or disclosure of PHI not provided for by this Agreement of which it becomes aware...</p>
      </div>
      <Checkbox
        checked={state.baaSigned}
        onChange={() => update({ baaSigned: !state.baaSigned })}
        label="I have read and agree to the HIPAA BAA on behalf of my practice."
      />
      <TextInput
        label="Type your full name to sign"
        required
        value={state.baaSignerName}
        onChange={(e) => update({ baaSignerName: e.target.value })}
        fullWidth
        disabled={!state.baaSigned}
      />
    </div>
  );
}

function ReviewStep({ state }: { state: OnboardingState }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 140px) minmax(0, 1fr)', gap: '8px 16px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
      <KV k="Practice"          v={state.practiceName} />
      <KV k="NPI"               v={state.npi} />
      <KV k="Address"           v={state.address || '—'} />
      <KV k="Existing PMS"      v={state.pmsChoice === 'none' ? 'New install' : state.pmsChoice} />
      {state.pmsChoice !== 'none' && <KV k="PMS connection" v={state.pmsCredentialsValid ? 'Verified' : 'Not verified'} />}
      <KV k="Hours"             v={`${state.workingHoursStart}–${state.workingHoursEnd}`} />
      <KV k="Operatories"       v={String(state.operatoryCount)} />
      <KV k="Team invites"      v={state.teamInvites.length === 0 ? 'None' : `${state.teamInvites.length} pending`} />
      <KV k="Plan"              v={`${state.plan} ($${PLAN_PRICE[state.plan]}/mo)`} />
      <KV k="BAA"               v={state.baaSigned ? `Signed by ${state.baaSignerName}` : 'Not signed'} />
    </div>
  );
}

function DoneStep({ onFinish }: { onFinish?: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <Avatar name="✓" size="lg" />
      <h2 style={{ margin: '14px 0 6px', fontFamily: 'var(--ads-font-sans)', fontSize: '20px', fontWeight: 500 }}>Workspace launched.</h2>
      <p style={{ margin: '0 auto', maxWidth: '420px', fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)' }}>
        Your team will get their invites in a few minutes. You can keep customizing from Home.
      </p>
      <div style={{ marginTop: '16px' }}>
        <PrimaryButton size={36} onClick={onFinish}>Go to home</PrimaryButton>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <>
      <div style={{ color: 'var(--ads-text-muted)' }}>{k}</div>
      <div style={{ color: 'var(--ads-text-primary)' }}>{v}</div>
    </>
  );
}
