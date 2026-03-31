import React, { useRef, useCallback, useState, useMemo, useEffect } from "react";
import type { InfoState, ToothSpec } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { UPPER_TEETH, LOWER_TEETH, ALL_TEETH } from "../../constants";
import { ToothArc } from "./ToothArc";
import { ToothSpecCard } from "./ToothSpecCard";
import { ToothBatchActions } from "./ToothBatchActions";
import { ToothTable } from "./ToothTable";
import { GhostButton } from "../../../design-system";


interface ToothChartProps {
  state: InfoState;
  toothColorMap: Record<number, string>;
  dispatch: React.Dispatch<InfoAction>;
  title?: string;
}

function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={active ? "#ffffff" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round">
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="11" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="11" width="6" height="6" rx="1" />
      <rect x="11" y="11" width="6" height="6" rx="1" />
    </svg>
  );
}

function TableIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={active ? "#ffffff" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round">
      <line x1="1" y1="4" x2="17" y2="4" />
      <line x1="1" y1="9" x2="17" y2="9" />
      <line x1="1" y1="14" x2="17" y2="14" />
    </svg>
  );
}

function groupSpecsByGroupId(specs: ToothSpec[]): ToothSpec[][] {
  const map = new Map<string, ToothSpec[]>();
  for (const spec of specs) {
    const key = spec.groupId || `solo-${spec.toothNumber}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(spec);
  }
  return Array.from(map.values());
}

export function ToothChart({ state, toothColorMap, dispatch, title }: ToothChartProps) {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const lastClickedRef = useRef<number | null>(null);

  const handleToothClick = useCallback(
    (num: number, e?: React.MouseEvent) => {
      if (e?.shiftKey && lastClickedRef.current !== null) {
        const fromIdx = ALL_TEETH.indexOf(lastClickedRef.current);
        const toIdx = ALL_TEETH.indexOf(num);
        if (fromIdx >= 0 && toIdx >= 0) {
          const start = Math.min(fromIdx, toIdx);
          const end = Math.max(fromIdx, toIdx);
          const range = ALL_TEETH.slice(start, end + 1);
          dispatch({ type: "SELECT_TEETH_RANGE", from: lastClickedRef.current, to: num, teeth: range });
        }
      } else {
        // Click any tooth: toggle selection or remove procedure
        setExpandedGroupId(null);
        dispatch({ type: "TOGGLE_TOOTH", toothNumber: num });
      }
      lastClickedRef.current = num;
    },
    [dispatch, state.toothSpecs]
  );

  const unassignedSelected = state.selectedTeeth.filter(
    (t) => !state.toothSpecs.find((s) => s.toothNumber === t)
  );

  const totalAssigned = state.toothSpecs.length;
  const unassignedTeeth = ALL_TEETH.filter((t) => !state.toothSpecs.some((s) => s.toothNumber === t));

  const groups = useMemo(() => groupSpecsByGroupId(state.toothSpecs), [state.toothSpecs]);

  // When a new batch is assigned (expandedTeeth gets populated by reducer),
  // sync expandedGroupId once, then clear the signal.
  useEffect(() => {
    if (state.expandedTeeth.length > 0) {
      const spec = state.toothSpecs.find((s) => s.toothNumber === state.expandedTeeth[0]);
      if (spec?.groupId) {
        setExpandedGroupId(spec.groupId);
      }
      dispatch({ type: "SET_EXPANDED_TEETH", teeth: [] });
    }
  }, [state.expandedTeeth, state.toothSpecs, dispatch]);

  return (
    <div>
      {/* Row 1: Title + chart/table toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: state.selectedTeeth.length > 0 ? "8px" : "16px" }}>
        {title && (
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#1e2939", fontFamily: "Inter, sans-serif" }}>
            {title}
          </span>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "auto" }}>
          <button
            type="button"
            onClick={() => setViewMode("chart")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "32px", height: "32px", borderRadius: "6px", border: "none",
              backgroundColor: viewMode === "chart" ? "#009ACE" : "transparent",
              cursor: "pointer", transition: "background-color 0.15s",
            }}
            title="Chart view"
          >
            <ChartIcon active={viewMode === "chart"} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "32px", height: "32px", borderRadius: "6px", border: "none",
              backgroundColor: viewMode === "table" ? "#009ACE" : "transparent",
              cursor: "pointer", transition: "background-color 0.15s",
            }}
            title="Table view"
          >
            <TableIcon active={viewMode === "table"} />
          </button>
        </div>
      </div>

      {/* Row 2: Selected count + Clear (under title) */}
      {state.selectedTeeth.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#009ACE",
              backgroundColor: "#E0F2FE",
              padding: "3px 10px",
              borderRadius: "9999px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {state.selectedTeeth.length} selected
          </span>
          <GhostButton
            size={36}
            onClick={() => dispatch({ type: "CLEAR_SELECTION" })}
            style={{ minHeight: "26px", padding: "0 8px", fontSize: "12px" }}
          >
            Clear
          </GhostButton>
        </div>
      )}

      {viewMode === "chart" ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <ToothArc
              teeth={UPPER_TEETH}
              selectedTeeth={state.selectedTeeth}
              toothSpecs={state.toothSpecs}
              toothColorMap={toothColorMap}
              expandedTeeth={state.expandedTeeth}
              onToothClick={(num, e) => handleToothClick(num, e)}
              label="Upper"
            />
            <ToothArc
              teeth={LOWER_TEETH}
              selectedTeeth={state.selectedTeeth}
              toothSpecs={state.toothSpecs}
              toothColorMap={toothColorMap}
              expandedTeeth={state.expandedTeeth}
              onToothClick={(num, e) => handleToothClick(num, e)}
              label="Lower"
            />
          </div>

          <ToothBatchActions
            selectedCount={unassignedSelected.length}
            selectedTeeth={unassignedSelected}
            dispatch={dispatch}
          />
        </>
      ) : (
        <ToothTable state={state} toothColorMap={toothColorMap} dispatch={dispatch} />
      )}

      {/* Divider + spec cards */}
      {groups.length > 0 && (
        <>
          <div style={{ height: "1px", backgroundColor: "#E5E7EB", margin: "20px 0" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {groups.slice().reverse().map((groupSpecs) => {
              const gid = groupSpecs[0].groupId || `solo-${groupSpecs[0].toothNumber}`;
              return (
                <ToothSpecCard
                  key={gid}
                  specs={groupSpecs}
                  expanded={expandedGroupId === gid}
                  onToggle={() => {
                    setExpandedGroupId((prev) => prev === gid ? null : gid);
                  }}
                  dispatch={dispatch}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
