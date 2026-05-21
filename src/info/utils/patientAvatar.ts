import type { Patient } from "../types";

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Deterministic photo for a patient. randomuser.me serves 100 men and 100
// women portraits (0–99) — we pick a slot from a hash of the patient id so
// the same patient always gets the same face.
export function patientAvatarUrl(patient: Patient): string {
  const seed = hashSeed(patient.id || `${patient.firstName}-${patient.lastName}`);
  const slot = seed % 100;
  const bucket =
    patient.gender === "female" ? "women" :
    patient.gender === "male" ? "men" :
    seed % 2 === 0 ? "women" : "men";
  return `https://randomuser.me/api/portraits/${bucket}/${slot}.jpg`;
}
