import type { Patient } from "../types";

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Deterministic portrait photo for a patient. randomuser.me serves 100 men and
 * 100 women portraits (0–99) — we pick a slot from a hash of the patient id so
 * the same patient always gets the same face. Bucketed by gender; falls back to
 * an even/odd split when gender is unknown. Callers render the patient's
 * initials behind this <img> and hide the image `onError`, so a failing URL
 * degrades gracefully back to initials.
 */
export function patientAvatarUrl(patient: Patient): string {
  const seed = hashSeed(patient.id || `${patient.firstName}-${patient.lastName}`);
  const slot = seed % 100;
  const bucket =
    patient.gender === "female" ? "women" :
    patient.gender === "male" ? "men" :
    seed % 2 === 0 ? "women" : "men";
  return `https://randomuser.me/api/portraits/${bucket}/${slot}.jpg`;
}

/**
 * Deterministic ~25% of patients get a real portrait photo; the rest keep the
 * blue-initials tile. Same patient always resolves the same way (hash of id),
 * so a patient looks identical across the list, header bar, and info section.
 */
export function patientHasPhoto(patient: Patient): boolean {
  const seed = hashSeed(patient.id || `${patient.firstName}-${patient.lastName}`);
  return seed % 4 === 0;
}
