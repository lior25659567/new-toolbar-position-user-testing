// Pure aggregation helpers for the Schedule page.
// These run in render via useMemo so they're cheap to recompute as state evolves.

import {
  type Appointment,
  type AppointmentStatus,
  type ScheduleFiltersState,
  WORK_HOURS,
  isSameLocalDate,
  appointmentEndISO,
  canBookAt,
  OPERATORIES,
} from './scheduleState';
import type { KpiValue } from '../data/types';

export function appointmentsForDay(all: Appointment[], dateISO: string): Appointment[] {
  return all.filter((a) => isSameLocalDate(a.startISO, dateISO));
}

export function applyScheduleFilters(all: Appointment[], f: ScheduleFiltersState): Appointment[] {
  const sameDay = appointmentsForDay(all, f.date);
  return sameDay.filter((a) => {
    if (f.providerId !== 'all' && a.providerId !== f.providerId) return false;
    if (f.specialty !== 'all'   && a.specialty   !== f.specialty)   return false;
    return true;
  });
}

export function buildScheduleKpis(allAppointments: Appointment[], dateISO: string): KpiValue[] {
  const today = appointmentsForDay(allAppointments, dateISO);
  const visible = today.filter((a) => a.status !== 'cancelled');
  const busy = today.filter((a) => !['cancelled', 'no-show'].includes(a.status));

  // Chair utilization: total minutes booked across operatories ÷ total minutes available.
  const minutesPerDay = (WORK_HOURS.endHour - WORK_HOURS.startHour) * 60 * OPERATORIES.length;
  const minutesBooked = busy.reduce((s, a) => s + a.durationMin, 0);
  const utilization = minutesPerDay === 0 ? 0 : minutesBooked / minutesPerDay;

  const noShowCount = today.filter((a) => a.status === 'no-show').length;
  const totalScheduled = today.filter((a) => a.status !== 'cancelled').length;
  const noShowRate = totalScheduled === 0 ? 0 : noShowCount / totalScheduled;

  // Conflicts: any visible appointment that fails canBookAt against the rest.
  const conflictCount = countConflicts(visible);

  // Today's projected revenue — naive: 1.5×durationMin USD.
  const projectedRevenue = busy.reduce((s, a) => s + Math.round(a.durationMin * 1.5), 0);

  return [
    { label: 'Booked today',  value: totalScheduled, display: String(totalScheduled),                                         delta:  0.04 },
    { label: 'Chair utilization', value: utilization, display: `${Math.round(utilization * 100)}%`,                            delta:  0.05 },
    { label: 'No-shows',      value: noShowCount,  display: `${noShowCount} (${Math.round(noShowRate * 100)}%)`,               delta: -0.02 },
    { label: 'Conflicts',     value: conflictCount,display: String(conflictCount),                                             delta:  0    },
    { label: 'Day revenue',   value: projectedRevenue, display: projectedRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), delta: 0.07 },
  ];
}

export function countConflicts(visible: Appointment[]): number {
  let count = 0;
  for (const a of visible) {
    const r = canBookAt(a, visible, a.id);
    if (!r.ok) count += 1;
  }
  return count;
}

export function statusBucket(s: AppointmentStatus): 'pre-visit' | 'in-flight' | 'closed' | 'failed' {
  if (s === 'scheduled' || s === 'confirmed') return 'pre-visit';
  if (s === 'checked-in' || s === 'in-treatment') return 'in-flight';
  if (s === 'completed') return 'closed';
  return 'failed';
}

/** Returns an array of conflicting (id, reasons) pairs for the given day. */
export function conflictDigest(visible: Appointment[]): { id: string; reasons: string[] }[] {
  const out: { id: string; reasons: string[] }[] = [];
  for (const a of visible) {
    const r = canBookAt(a, visible, a.id);
    if (!r.ok) out.push({ id: a.id, reasons: r.reasons });
  }
  return out;
}

/** Find the next free slot of a given duration in a single operatory. */
export function nextOpenSlot(
  dayAppointments: Appointment[],
  dateISO: string,
  durationMin: number,
  operatoryId: string,
): string | null {
  const inOp = dayAppointments.filter((a) => a.operatoryId === operatoryId && a.status !== 'cancelled' && a.status !== 'no-show');
  inOp.sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());
  const dayStart = new Date(`${dateISO}T${String(WORK_HOURS.startHour).padStart(2, '0')}:00:00`);
  const dayEnd = new Date(`${dateISO}T${String(WORK_HOURS.endHour).padStart(2, '0')}:00:00`);
  let cursor = dayStart;
  for (const a of inOp) {
    const aStart = new Date(a.startISO);
    if (aStart.getTime() - cursor.getTime() >= durationMin * 60_000) {
      return cursor.toISOString();
    }
    const end = new Date(appointmentEndISO(a));
    if (end > cursor) cursor = end;
  }
  if (dayEnd.getTime() - cursor.getTime() >= durationMin * 60_000) return cursor.toISOString();
  return null;
}
