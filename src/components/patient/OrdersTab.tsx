import React, { useEffect } from "react";
import { PrimaryButton, SecondaryButton, Tag } from "../../design-system";
import type { OrderTemplate, PatientOrder } from "./orderConstants";

/**
 * STUB — original implementation was lost. Lists the patient's orders and lets
 * a row be opened. The "create order" wizard is reduced to a minimal panel that
 * creates a draft order, enough to exercise the surrounding PatientPage flow.
 */
interface OrdersTabProps {
  orders: PatientOrder[];
  patientName: string;
  templates: OrderTemplate[];
  duplicateSource: PatientOrder | null;
  onDuplicateConsumed: () => void;
  onOrderCreated: (order: PatientOrder) => void;
  onSaveTemplate: (template: OrderTemplate) => void;
  onOpenOrder: (id: string) => void;
  externalOpen: boolean;
  onExternalOpenChange: (open: boolean) => void;
}

const STATUS_TONE: Record<PatientOrder["status"], "blue" | "orange" | "purple" | "green"> = {
  draft: "orange",
  submitted: "blue",
  "in-production": "purple",
  completed: "green",
};

export function OrdersTab({
  orders,
  patientName,
  duplicateSource,
  onDuplicateConsumed,
  onOrderCreated,
  onOpenOrder,
  externalOpen,
  onExternalOpenChange,
}: OrdersTabProps) {
  // Acknowledge any pending "duplicate" request so the parent can clear it.
  useEffect(() => {
    if (duplicateSource) onDuplicateConsumed();
  }, [duplicateSource, onDuplicateConsumed]);

  const createDraft = () => {
    const now = new Date();
    onOrderCreated({
      id: `ord-${now.getTime().toString(36)}`,
      service: "New order",
      status: "draft",
      createdAt: now.toISOString(),
      thread: [],
      activity: [],
    });
    onExternalOpenChange(false);
  };

  return (
    <section
      style={{
        backgroundColor: "var(--ads-bg-surface)",
        borderRadius: "var(--ads-radius-sm)",
        border: "1px solid var(--ads-border-subtle)",
        padding: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--ads-font-sans)",
            fontWeight: 500,
            fontSize: "17px",
            lineHeight: "24px",
            color: "var(--ads-text-primary)",
          }}
        >
          Orders <span style={{ color: "var(--ads-text-muted)", fontWeight: 400 }}>({orders.length})</span>
        </h2>
        <PrimaryButton size={36} icon="plus" onClick={() => onExternalOpenChange(true)}>
          New order
        </PrimaryButton>
      </div>

      {orders.length === 0 ? (
        <EmptyRow label="No orders yet." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {orders.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => onOpenOrder(o.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                width: "100%",
                textAlign: "left",
                padding: "14px 16px",
                borderRadius: "var(--ads-radius-sm)",
                border: "1px solid var(--ads-border-subtle)",
                backgroundColor: "var(--ads-bg-surface)",
                cursor: "pointer",
                fontFamily: "var(--ads-font-sans)",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ads-text-primary)" }}>
                  {o.service}
                </div>
                <div style={{ fontSize: "12px", color: "var(--ads-text-muted)", marginTop: "2px" }}>
                  {patientName} · {new Date(o.createdAt).toLocaleDateString()}
                  {o.lab ? ` · ${o.lab}` : ""}
                </div>
              </div>
              <Tag size="small" color={STATUS_TONE[o.status]}>
                {o.status}
              </Tag>
            </button>
          ))}
        </div>
      )}

      {/* Minimal stand-in for the "create order" wizard. */}
      {externalOpen && (
        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            border: "1px dashed var(--ads-border-default)",
            borderRadius: "var(--ads-radius-sm)",
            backgroundColor: "var(--ads-bg-page)",
            fontFamily: "var(--ads-font-sans)",
          }}
        >
          <p style={{ margin: "0 0 12px", fontSize: "13px", color: "var(--ads-text-secondary)" }}>
            Order wizard placeholder. Create a draft order to continue.
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <PrimaryButton size={36} onClick={createDraft}>Create draft</PrimaryButton>
            <SecondaryButton size={36} onClick={() => onExternalOpenChange(false)}>Cancel</SecondaryButton>
          </div>
        </div>
      )}
    </section>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: "32px 16px",
        textAlign: "center",
        color: "var(--ads-text-muted)",
        fontFamily: "var(--ads-font-sans)",
        fontSize: "14px",
      }}
    >
      {label}
    </div>
  );
}
