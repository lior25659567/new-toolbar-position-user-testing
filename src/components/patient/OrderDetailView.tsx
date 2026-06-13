import React, { useEffect, useState } from "react";
import { PrimaryButton, SecondaryButton } from "../../design-system";
import {
  PRODUCTION_STAGES,
  type LabMessage,
  type PatientOrder,
  type ProductionStage,
} from "./orderConstants";

/**
 * STUB — original implementation was lost. A slide-over showing a single
 * order: its activity/messages, with controls to send a message, advance the
 * production stage, and duplicate the order.
 */
interface OrderDetailViewProps {
  open: boolean;
  order: PatientOrder | null;
  patientName: string;
  onClose: () => void;
  onSendMessage: (orderId: string, message: LabMessage) => void;
  onAdvanceStage: (orderId: string, stage: ProductionStage) => void;
  onDuplicate: (order: PatientOrder) => void;
}

export function OrderDetailView({
  open,
  order,
  patientName,
  onClose,
  onSendMessage,
  onAdvanceStage,
  onDuplicate,
}: OrderDetailViewProps) {
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !order) return null;

  const send = () => {
    const body = draft.trim();
    if (!body) return;
    onSendMessage(order.id, {
      id: `m-${Date.now().toString(36)}`,
      author: "Practice",
      timestamp: new Date().toISOString(),
      body,
    });
    setDraft("");
  };

  const advance = () => {
    const idx = order.productionStage ? PRODUCTION_STAGES.indexOf(order.productionStage) : -1;
    const next = PRODUCTION_STAGES[Math.min(PRODUCTION_STAGES.length - 1, idx + 1)];
    if (next) onAdvanceStage(order.id, next);
  };

  const thread = order.thread ?? [];

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, backgroundColor: "var(--ads-scrim)", zIndex: 1000 }}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Order ${order.service}`}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "560px",
          maxWidth: "100vw",
          backgroundColor: "var(--ads-bg-surface)",
          boxShadow: "var(--ads-shadow-lg)",
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--ads-font-sans)",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--ads-border-subtle)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: "20px", lineHeight: "28px", fontWeight: 500, color: "var(--ads-text-primary)" }}>
              {order.service}
            </h2>
            <div style={{ marginTop: "4px", fontSize: "13px", color: "var(--ads-text-muted)" }}>
              {patientName} · {order.status}
              {order.productionStage ? ` · ${order.productionStage}` : ""}
            </div>
          </div>
          <SecondaryButton size={36} onClick={onClose}>Close</SecondaryButton>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <PrimaryButton size={36} onClick={advance}>Advance stage</PrimaryButton>
            <SecondaryButton size={36} onClick={() => onDuplicate(order)}>Duplicate</SecondaryButton>
          </div>

          <div>
            <h3 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 500, color: "var(--ads-text-primary)" }}>
              Messages
            </h3>
            {thread.length === 0 ? (
              <p style={{ margin: 0, fontSize: "13px", color: "var(--ads-text-muted)" }}>No messages yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {thread.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "var(--ads-radius-sm)",
                      border: "1px solid var(--ads-border-subtle)",
                      backgroundColor: "var(--ads-bg-page)",
                    }}
                  >
                    <div style={{ fontSize: "12px", color: "var(--ads-text-muted)" }}>
                      {m.author} · {new Date(m.timestamp).toLocaleString()}
                    </div>
                    <div style={{ marginTop: "2px", fontSize: "13px", color: "var(--ads-text-primary)" }}>{m.body}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--ads-border-subtle)", display: "flex", gap: "8px" }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            placeholder="Message the lab…"
            style={{
              flex: 1,
              padding: "8px 10px",
              fontFamily: "var(--ads-font-sans)",
              fontSize: "13px",
              border: "1px solid var(--ads-border-subtle)",
              borderRadius: "var(--ads-radius-sm)",
              backgroundColor: "var(--ads-bg-surface)",
              color: "var(--ads-text-primary)",
            }}
          />
          <PrimaryButton size={36} disabled={!draft.trim()} onClick={send}>Send</PrimaryButton>
        </div>
      </aside>
    </>
  );
}
