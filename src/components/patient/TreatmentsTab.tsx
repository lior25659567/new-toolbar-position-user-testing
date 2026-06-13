import React from "react";
import { PrimaryButton, SecondaryButton, Tag } from "../../design-system";
import type { PatientTreatment } from "./treatmentConstants";

/**
 * STUB — original implementation was lost. Lists the patient's treatments. The
 * "create treatment" wizard is reduced to a minimal panel that creates a draft.
 */
interface TreatmentsTabProps {
  treatments: PatientTreatment[];
  patientName: string;
  onTreatmentCreated: (treatment: PatientTreatment) => void;
  externalOpen: boolean;
  onExternalOpenChange: (open: boolean) => void;
}

const STATUS_TONE: Record<PatientTreatment["status"], "blue" | "orange" | "purple" | "green"> = {
  draft: "orange",
  submitted: "blue",
  active: "purple",
  completed: "green",
};

export function TreatmentsTab({
  treatments,
  patientName,
  onTreatmentCreated,
  externalOpen,
  onExternalOpenChange,
}: TreatmentsTabProps) {
  const createDraft = () => {
    const now = new Date();
    onTreatmentCreated({
      id: `trt-${now.getTime().toString(36)}`,
      procedureLabel: "New treatment",
      status: "draft",
      createdAt: now.toISOString(),
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
          Treatments <span style={{ color: "var(--ads-text-muted)", fontWeight: 400 }}>({treatments.length})</span>
        </h2>
        <PrimaryButton size={36} icon="plus" onClick={() => onExternalOpenChange(true)}>
          New treatment
        </PrimaryButton>
      </div>

      {treatments.length === 0 ? (
        <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--ads-text-muted)", fontFamily: "var(--ads-font-sans)", fontSize: "14px" }}>
          No treatments yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {treatments.map((t) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "var(--ads-radius-sm)",
                border: "1px solid var(--ads-border-subtle)",
                fontFamily: "var(--ads-font-sans)",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ads-text-primary)" }}>
                  {t.procedureLabel}
                </div>
                <div style={{ fontSize: "12px", color: "var(--ads-text-muted)", marginTop: "2px" }}>
                  {patientName} · {new Date(t.createdAt).toLocaleDateString()}
                  {t.provider ? ` · ${t.provider}` : ""}
                </div>
              </div>
              <Tag size="small" color={STATUS_TONE[t.status]}>
                {t.status}
              </Tag>
            </div>
          ))}
        </div>
      )}

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
            Treatment wizard placeholder. Create a draft treatment to continue.
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
