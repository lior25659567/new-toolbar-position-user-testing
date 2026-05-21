import React, { useMemo, useRef, useState } from 'react';
import {
  type Appointment,
  type ScheduleFiltersState,
  type ScheduleViewBy,
  type ScheduleAction,
  OPERATORIES,
  PROVIDERS,
  WORK_HOURS,
  PX_PER_MIN,
  buildSlotISO,
  canBookAt,
  isSameLocalDate,
  fmtSlotTime,
  STATUS_LABEL,
  findOperatory,
  findProvider,
  findProcedure,
} from './scheduleState';

const SLOT_MIN = 15;                  // 15-min row resolution
const HEADER_PX = 36;                 // column-header height
const TIME_COL_PX = 64;
const SLOT_PX = SLOT_MIN * PX_PER_MIN;

export function ScheduleGrid({
  filters,
  appointments,
  selectedId,
  conflictIds,
  dispatch,
}: {
  filters: ScheduleFiltersState;
  appointments: Appointment[];
  selectedId: string | null;
  conflictIds: Set<string>;
  dispatch: React.Dispatch<ScheduleAction>;
}) {
  // Resource columns depend on view mode.
  const columns = useMemo(() => {
    if (filters.viewBy === 'operatory') {
      return OPERATORIES.map((o) => ({ id: o.id, label: o.name, kind: 'operatory' as const }));
    }
    return PROVIDERS.map((p) => ({ id: p.id, label: `${p.name} · ${p.role === 'dentist' ? 'DDS' : 'RDH'}`, kind: 'provider' as const }));
  }, [filters.viewBy]);

  // Build time labels every hour (8am, 9am, …).
  const hourLabels = useMemo(() => {
    const out: { hour: number; label: string }[] = [];
    for (let h = WORK_HOURS.startHour; h <= WORK_HOURS.endHour; h += 1) {
      const hr = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? 'am' : 'pm';
      out.push({ hour: h, label: `${hr}${ampm}` });
    }
    return out;
  }, []);

  const totalMinutes = (WORK_HOURS.endHour - WORK_HOURS.startHour) * 60;
  const gridHeight = totalMinutes * PX_PER_MIN;

  const visibleAppts = useMemo(() => appointments.filter((a) => isSameLocalDate(a.startISO, filters.date)), [appointments, filters.date]);

  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        overflow: 'hidden',
      }}
    >
      {/* Resource header row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `${TIME_COL_PX}px repeat(${columns.length}, minmax(0, 1fr))`,
          height: HEADER_PX,
          borderBottom: '1px solid var(--ads-border-subtle)',
          backgroundColor: 'var(--ads-bg-page)',
        }}
      >
        <div />
        {columns.map((c) => (
          <div
            key={c.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderLeft: '1px solid var(--ads-border-subtle)',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--ads-text-primary)',
              padding: '0 8px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {c.label}
          </div>
        ))}
      </div>

      {/* Grid body */}
      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `${TIME_COL_PX}px repeat(${columns.length}, minmax(0, 1fr))`,
          height: `${gridHeight}px`,
        }}
      >
        {/* Time-of-day column */}
        <div style={{ position: 'relative' }}>
          {hourLabels.map(({ hour, label }, i) => (
            <div
              key={hour}
              style={{
                position: 'absolute',
                top: i === 0 ? 0 : (hour - WORK_HOURS.startHour) * 60 * PX_PER_MIN,
                right: '6px',
                transform: i === 0 ? 'translateY(0)' : 'translateY(-50%)',
                fontFamily: 'var(--ads-font-sans)',
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--ads-text-muted)',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Resource columns */}
        {columns.map((c, i) => (
          <ResourceColumn
            key={c.id}
            column={c}
            viewBy={filters.viewBy}
            dateISO={filters.date}
            allAppointments={visibleAppts}
            ownAppointments={visibleAppts.filter((a) => filters.viewBy === 'operatory' ? a.operatoryId === c.id : a.providerId === c.id)}
            selectedId={selectedId}
            conflictIds={conflictIds}
            dispatch={dispatch}
            colIndex={i}
          />
        ))}
      </div>
    </section>
  );
}

function ResourceColumn({
  column,
  viewBy,
  dateISO,
  allAppointments,
  ownAppointments,
  selectedId,
  conflictIds,
  dispatch,
}: {
  column: { id: string; label: string; kind: 'operatory' | 'provider' };
  viewBy: ScheduleViewBy;
  dateISO: string;
  allAppointments: Appointment[];
  ownAppointments: Appointment[];
  selectedId: string | null;
  conflictIds: Set<string>;
  dispatch: React.Dispatch<ScheduleAction>;
  colIndex: number;
}) {
  const colRef = useRef<HTMLDivElement>(null);
  const [hoverPx, setHoverPx] = useState<number | null>(null);

  // Render a horizontal grid line every 15 minutes so the eye can read time.
  const totalMinutes = (WORK_HOURS.endHour - WORK_HOURS.startHour) * 60;
  const slotCount = totalMinutes / SLOT_MIN;

  const onDragOver = (e: React.DragEvent) => {
    if (!colRef.current) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = colRef.current.getBoundingClientRect();
    setHoverPx(snapPx(e.clientY - rect.top));
  };

  const onDragLeave = () => setHoverPx(null);

  const onDrop = (e: React.DragEvent) => {
    if (!colRef.current) return;
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    const rect = colRef.current.getBoundingClientRect();
    const droppedPx = snapPx(e.clientY - rect.top);
    const minutesFromStart = droppedPx / PX_PER_MIN;
    const startHour = WORK_HOURS.startHour + Math.floor(minutesFromStart / 60);
    const startMin = Math.round(minutesFromStart) % 60;
    const startISO = buildSlotISO(dateISO, startHour, startMin);
    const appt = allAppointments.find((a) => a.id === id);
    if (!appt) return;
    const candidate: Pick<Appointment, 'startISO' | 'durationMin' | 'providerId' | 'operatoryId' | 'specialty'> = {
      startISO,
      durationMin: appt.durationMin,
      operatoryId: viewBy === 'operatory' ? column.id : appt.operatoryId,
      providerId:  viewBy === 'provider'  ? column.id : appt.providerId,
      specialty: appt.specialty,
    };
    const r = canBookAt(candidate, allAppointments, appt.id);
    if (!r.ok) {
      // Visually nudge — for now just bail; real app would surface a toast.
      setHoverPx(null);
      return;
    }
    dispatch({
      type: 'MOVE_APPT',
      id,
      startISO,
      operatoryId: candidate.operatoryId,
      providerId:  candidate.providerId,
    });
    setHoverPx(null);
  };

  const onColumnDoubleClick = (e: React.MouseEvent) => {
    if (!colRef.current) return;
    const rect = colRef.current.getBoundingClientRect();
    const py = snapPx(e.clientY - rect.top);
    const minutesFromStart = py / PX_PER_MIN;
    const startHour = WORK_HOURS.startHour + Math.floor(minutesFromStart / 60);
    const startMin = Math.round(minutesFromStart) % 60;
    const startISO = buildSlotISO(dateISO, startHour, startMin);
    dispatch({
      type: 'OPEN_NEW_APPT',
      date: dateISO,
      startISO,
      operatoryId: viewBy === 'operatory' ? column.id : undefined,
      providerId: viewBy === 'provider' ? column.id : undefined,
    });
  };

  return (
    <div
      ref={colRef}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDoubleClick={onColumnDoubleClick}
      style={{
        position: 'relative',
        borderLeft: '1px solid var(--ads-border-subtle)',
        cursor: 'cell',
      }}
      title="Double-click to create an appointment in this slot"
    >
      {/* Quarter-hour grid lines */}
      {Array.from({ length: slotCount + 1 }).map((_, i) => {
        const y = i * SLOT_PX;
        const isHour = i % 4 === 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: y, left: 0, right: 0, height: 1,
              backgroundColor: isHour ? 'var(--ads-border-subtle)' : 'transparent',
              borderTop: isHour ? undefined : '1px dashed color-mix(in srgb, var(--ads-border-subtle) 65%, transparent)',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Drop hover indicator */}
      {hoverPx !== null && (
        <div
          style={{
            position: 'absolute',
            top: hoverPx, left: 4, right: 4, height: 2,
            backgroundColor: 'var(--ads-blue-500)',
            pointerEvents: 'none',
            borderRadius: 1,
          }}
        />
      )}

      {/* Appointment blocks */}
      {ownAppointments.map((a) => (
        <AppointmentBlock
          key={a.id}
          appt={a}
          selected={selectedId === a.id}
          conflict={conflictIds.has(a.id)}
          dispatch={dispatch}
        />
      ))}
    </div>
  );
}

function snapPx(y: number): number {
  return Math.max(0, Math.round(y / SLOT_PX) * SLOT_PX);
}

function AppointmentBlock({
  appt,
  selected,
  conflict,
  dispatch,
}: {
  appt: Appointment;
  selected: boolean;
  conflict: boolean;
  dispatch: React.Dispatch<ScheduleAction>;
}) {
  const start = new Date(appt.startISO);
  const minutesFromStart = (start.getHours() - WORK_HOURS.startHour) * 60 + start.getMinutes();
  const top = minutesFromStart * PX_PER_MIN;
  const height = appt.durationMin * PX_PER_MIN;
  const op = findOperatory(appt.operatoryId);
  const tone = op?.tone ?? 'blue';
  const provider = findProvider(appt.providerId);
  const proc = findProcedure(appt.procedureId);

  const dim = appt.status === 'cancelled' || appt.status === 'no-show';

  return (
    <div
      role="button"
      draggable={!dim}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', appt.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: 'SELECT_APPT', id: appt.id });
      }}
      onDoubleClick={(e) => e.stopPropagation()}
      title={`${appt.patientName} · ${proc?.label} · ${provider?.name}`}
      style={{
        position: 'absolute',
        top, left: 4, right: 4,
        height: Math.max(20, height - 2),
        padding: '4px 8px',
        boxSizing: 'border-box',
        borderRadius: 'var(--ads-radius-sm)',
        backgroundColor: dim
          ? 'color-mix(in srgb, var(--ads-bg-page) 65%, var(--ads-bg-surface) 35%)'
          : `var(--ads-tag-${tone}-bg)`,
        border: `1px solid ${
          conflict ? 'var(--ads-tag-red-br)'
          : selected ? 'var(--ads-blue-500)'
          : `var(--ads-tag-${tone}-br)`
        }`,
        boxShadow: selected ? '0 0 0 2px color-mix(in srgb, var(--ads-blue-500) 24%, transparent)' : undefined,
        color: dim ? 'var(--ads-text-muted)' : `var(--ads-tag-${tone}-fg)`,
        cursor: dim ? 'not-allowed' : 'grab',
        overflow: 'hidden',
        opacity: appt.status === 'cancelled' ? 0.55 : 1,
        textDecoration: appt.status === 'cancelled' ? 'line-through' : 'none',
        fontFamily: 'var(--ads-font-sans)',
        fontSize: '12px',
        lineHeight: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '6px' }}>
        <span style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {appt.patientName}
        </span>
        <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>{fmtSlotTime(appt.startISO)}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', minWidth: 0 }}>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {appt.procedureLabel}
        </span>
        {provider && height >= 36 && (
          <span style={{ marginLeft: 'auto', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'currentColor', opacity: 0.7 }}>
            {provider.monogram}
          </span>
        )}
      </div>
      {height >= 60 && (
        <div style={{ marginTop: 'auto', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.7 }}>
          {STATUS_LABEL[appt.status]}
        </div>
      )}
      {conflict && (
        <div style={{ position: 'absolute', top: 4, right: 6, fontSize: '11px', color: 'var(--ads-tag-red-fg)' }} aria-label="Conflict">
          ⚠
        </div>
      )}
    </div>
  );
}
