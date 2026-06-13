import type { Job } from './types';
import { LABS, DENTISTS, PATIENTS } from './labs';
import { daysFromNowISO, makeActivityEvent } from './activity';

const lab = (id: string) => {
  const l = LABS.find((x) => x.id === id)!;
  return { id: l.id, name: l.name, monogram: l.monogram };
};

const dentist = (id: string) => {
  const d = DENTISTS.find((x) => x.id === id)!;
  return d;
};

const patient = (id: string) => PATIENTS.find((p) => p.id === id)!;

// Generate a starter activity log for a given job (created + assigned).
function seedActivity(jobCreatedAt: string, dentistName: string, dentistId: string, labName: string) {
  return [
    makeActivityEvent({
      type: 'created',
      actorId: dentistId,
      actorName: dentistName,
      timestamp: jobCreatedAt,
      payload: {},
    }),
    makeActivityEvent({
      type: 'assigned',
      actorId: dentistId,
      actorName: dentistName,
      timestamp: jobCreatedAt,
      payload: { lab: labName },
    }),
  ];
}

// ─── Mock jobs across all states ─────────────────────────────────────────────

export const SEED_JOBS: Job[] = (() => {
  const jobs: Job[] = [];

  // 1. New
  {
    const created = daysFromNowISO(-1);
    const d = dentist('dr-aw');
    const l = lab('lab-bright');
    jobs.push({
      id: 'job-1',
      patient: patient('pat-mina'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Crown — porcelain/ceramic',
      category: 'Restorative',
      status: 'new',
      priority: 'standard',
      createdAt: created,
      dueDate: daysFromNowISO(6),
      toothNumbers: [14],
      attachments: [
        { id: 'a1', name: 'scan-upper.ply', kind: 'scan',  sizeKb: 2480, uploadedBy: d.name, uploadedAt: created },
        { id: 'a2', name: 'shade-guide.jpg', kind: 'image', sizeKb:  340, uploadedBy: d.name, uploadedAt: created },
      ],
      activity: seedActivity(created, d.name, d.id, l.name),
      messages: [],
      notes: 'Patient prefers slightly warmer shade.',
    });
  }

  // 2. New / rush
  {
    const created = daysFromNowISO(-2);
    const d = dentist('dr-mp');
    const l = lab('lab-acme');
    jobs.push({
      id: 'job-2',
      patient: patient('pat-priya'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Veneer — porcelain laminate',
      category: 'Restorative',
      status: 'new',
      priority: 'rush',
      createdAt: created,
      dueDate: daysFromNowISO(3),
      toothNumbers: [21],
      attachments: [],
      activity: seedActivity(created, d.name, d.id, l.name),
      messages: [],
    });
  }

  // 3. In design
  {
    const created = daysFromNowISO(-4);
    const d = dentist('dr-jk');
    const l = lab('lab-crownco');
    jobs.push({
      id: 'job-3',
      patient: patient('pat-ethan'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Crown — porcelain/ceramic',
      category: 'Restorative',
      status: 'in-design',
      priority: 'standard',
      createdAt: created,
      dueDate: daysFromNowISO(4),
      toothNumbers: [36],
      attachments: [
        { id: 'a3', name: 'preop.jpg', kind: 'image', sizeKb: 220, uploadedBy: d.name, uploadedAt: created },
      ],
      activity: [
        ...seedActivity(created, d.name, d.id, l.name),
        makeActivityEvent({
          type: 'status-change', actorId: 'lab-crownco', actorName: l.name, actorRole: 'lab',
          timestamp: daysFromNowISO(-3),
          payload: { from: 'new', to: 'in-design' },
        }),
      ],
      messages: [
        { id: 'm1', authorId: 'lab-crownco', authorName: l.name, authorRole: 'lab',
          body: 'Received scans, started design. Margin looks clean.', timestamp: daysFromNowISO(-3) },
      ],
      unreadMessages: 1,
    });
  }

  // 4. In design / SLA-risk (changes-requested)
  {
    const created = daysFromNowISO(-5);
    const d = dentist('dr-aw');
    const l = lab('lab-orthoarc');
    jobs.push({
      id: 'job-4',
      patient: patient('pat-aiko'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Aligner — comprehensive',
      category: 'Orthodontics',
      status: 'in-design',
      priority: 'urgent',
      createdAt: created,
      dueDate: daysFromNowISO(1),
      toothNumbers: [],
      attachments: [],
      activity: seedActivity(created, d.name, d.id, l.name),
      messages: [],
      notes: 'Patient travel deadline next week.',
    });
  }

  // 5. In production
  {
    const created = daysFromNowISO(-6);
    const d = dentist('dr-rs');
    const l = lab('lab-acme');
    jobs.push({
      id: 'job-5',
      patient: patient('pat-leon'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Implant abutment — custom',
      category: 'Implantology',
      status: 'in-production',
      priority: 'standard',
      createdAt: created,
      dueDate: daysFromNowISO(8),
      toothNumbers: [46],
      attachments: [],
      activity: [
        ...seedActivity(created, d.name, d.id, l.name),
        makeActivityEvent({ type: 'status-change', actorId: 'lab-acme', actorName: l.name, actorRole: 'lab',
          timestamp: daysFromNowISO(-4), payload: { from: 'new', to: 'in-design' } }),
        makeActivityEvent({ type: 'status-change', actorId: 'lab-acme', actorName: l.name, actorRole: 'lab',
          timestamp: daysFromNowISO(-1), payload: { from: 'in-design', to: 'in-production' } }),
      ],
      messages: [],
    });
  }

  // 6. In production / changes-requested
  {
    const created = daysFromNowISO(-8);
    const d = dentist('dr-mp');
    const l = lab('lab-bright');
    jobs.push({
      id: 'job-6',
      patient: patient('pat-tomas'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Crown — porcelain/ceramic',
      category: 'Restorative',
      status: 'changes-requested',
      priority: 'standard',
      createdAt: created,
      dueDate: daysFromNowISO(2),
      toothNumbers: [25],
      attachments: [],
      activity: seedActivity(created, d.name, d.id, l.name),
      messages: [
        { id: 'm6', authorId: d.id, authorName: d.name, authorRole: 'dentist',
          body: 'Margin contour on the buccal looks too high. Can you reduce by ~0.3mm?', timestamp: daysFromNowISO(-1) },
      ],
      unreadMessages: 0,
    });
  }

  // 7. Quality check
  {
    const created = daysFromNowISO(-9);
    const d = dentist('dr-jk');
    const l = lab('lab-implix');
    jobs.push({
      id: 'job-7',
      patient: patient('pat-noor'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Implant crown — porcelain',
      category: 'Implantology',
      status: 'quality-check',
      priority: 'standard',
      createdAt: created,
      dueDate: daysFromNowISO(5),
      toothNumbers: [16],
      attachments: [],
      activity: seedActivity(created, d.name, d.id, l.name),
      messages: [],
    });
  }

  // 8. Shipping
  {
    const created = daysFromNowISO(-12);
    const d = dentist('dr-aw');
    const l = lab('lab-acme');
    jobs.push({
      id: 'job-8',
      patient: patient('pat-mina'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Occlusal guard — hard',
      category: 'Appliance',
      status: 'shipping',
      priority: 'standard',
      createdAt: created,
      dueDate: daysFromNowISO(3),
      shippedAt: daysFromNowISO(0),
      toothNumbers: [],
      attachments: [],
      activity: seedActivity(created, d.name, d.id, l.name),
      messages: [],
    });
  }

  // 9. Delivered
  {
    const created = daysFromNowISO(-20);
    const d = dentist('dr-rs');
    const l = lab('lab-bright');
    jobs.push({
      id: 'job-9',
      patient: patient('pat-ethan'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Crown — porcelain/ceramic',
      category: 'Restorative',
      status: 'delivered',
      priority: 'standard',
      createdAt: created,
      dueDate: daysFromNowISO(-7),
      shippedAt: daysFromNowISO(-9),
      toothNumbers: [11],
      attachments: [],
      activity: seedActivity(created, d.name, d.id, l.name),
      messages: [],
    });
  }

  // 10. Delivered, late
  {
    const created = daysFromNowISO(-30);
    const d = dentist('dr-mp');
    const l = lab('lab-crownco');
    jobs.push({
      id: 'job-10',
      patient: patient('pat-priya'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Veneer — porcelain laminate',
      category: 'Restorative',
      status: 'delivered',
      priority: 'standard',
      createdAt: created,
      dueDate: daysFromNowISO(-22),
      shippedAt: daysFromNowISO(-18),
      toothNumbers: [22],
      attachments: [],
      activity: seedActivity(created, d.name, d.id, l.name),
      messages: [],
    });
  }

  // 11. Cancelled
  {
    const created = daysFromNowISO(-15);
    const d = dentist('dr-jk');
    const l = lab('lab-acme');
    jobs.push({
      id: 'job-11',
      patient: patient('pat-noor'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Inlay — composite',
      category: 'Restorative',
      status: 'cancelled',
      priority: 'standard',
      createdAt: created,
      dueDate: daysFromNowISO(-5),
      toothNumbers: [37],
      attachments: [],
      activity: seedActivity(created, d.name, d.id, l.name),
      messages: [],
    });
  }

  // 12-14. Extra in-production / in-design / new for filling the kanban
  {
    const created = daysFromNowISO(-3);
    const d = dentist('dr-aw');
    const l = lab('lab-orthoarc');
    jobs.push({
      id: 'job-12',
      patient: patient('pat-leon'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Aligner — comprehensive',
      category: 'Orthodontics',
      status: 'in-production',
      priority: 'standard',
      createdAt: created,
      dueDate: daysFromNowISO(11),
      toothNumbers: [],
      attachments: [],
      activity: seedActivity(created, d.name, d.id, l.name),
      messages: [],
    });
  }
  {
    const created = daysFromNowISO(-4);
    const d = dentist('dr-rs');
    const l = lab('lab-implix');
    jobs.push({
      id: 'job-13',
      patient: patient('pat-tomas'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Implant abutment — custom',
      category: 'Implantology',
      status: 'in-design',
      priority: 'rush',
      createdAt: created,
      dueDate: daysFromNowISO(2),
      toothNumbers: [46],
      attachments: [],
      activity: seedActivity(created, d.name, d.id, l.name),
      messages: [],
    });
  }
  {
    const created = daysFromNowISO(-1);
    const d = dentist('dr-mp');
    const l = lab('lab-bright');
    jobs.push({
      id: 'job-14',
      patient: patient('pat-aiko'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Crown — porcelain/ceramic',
      category: 'Restorative',
      status: 'new',
      priority: 'standard',
      createdAt: created,
      dueDate: daysFromNowISO(7),
      toothNumbers: [44],
      attachments: [],
      activity: seedActivity(created, d.name, d.id, l.name),
      messages: [],
    });
  }
  {
    const created = daysFromNowISO(-25);
    const d = dentist('dr-aw');
    const l = lab('lab-acme');
    jobs.push({
      id: 'job-15',
      patient: patient('pat-mina'),
      lab: l,
      dentist: { id: d.id, name: d.name, monogram: d.monogram },
      service: 'Occlusal guard — hard',
      category: 'Appliance',
      status: 'delivered',
      priority: 'standard',
      createdAt: created,
      dueDate: daysFromNowISO(-15),
      shippedAt: daysFromNowISO(-16),
      toothNumbers: [],
      attachments: [],
      activity: seedActivity(created, d.name, d.id, l.name),
      messages: [],
    });
  }

  return jobs;
})();
