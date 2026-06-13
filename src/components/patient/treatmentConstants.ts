/**
 * STUB — original implementation was lost. Minimal types + seed data for the
 * patient Treatments tab so the page compiles and renders. Replace with the
 * real treatment model when it is recovered.
 */

export type TreatmentStatus = "draft" | "submitted" | "active" | "completed";

export interface PatientTreatment {
  id: string;
  procedureLabel: string;
  status: TreatmentStatus;
  createdAt: string; // ISO
  provider?: string;
}

export const SEED_PATIENT_TREATMENTS: PatientTreatment[] = [
  {
    id: "trt-2001",
    procedureLabel: "Invisalign · Full arch",
    status: "active",
    createdAt: "2026-03-10T11:00:00.000Z",
    provider: "Dr. A. Wong",
  },
  {
    id: "trt-2002",
    procedureLabel: "Implant planning · #36",
    status: "submitted",
    createdAt: "2026-04-28T15:30:00.000Z",
    provider: "Dr. A. Wong",
  },
];
