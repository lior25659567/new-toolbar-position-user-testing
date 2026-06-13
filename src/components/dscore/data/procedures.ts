import type { ProcedureCatalogEntry } from './types';

// Curated catalog. Codes are styled like ADA but mocked.
// `generatesJob: true` ⇒ accepting a plan with this proc spawns a Job in the Jobs page.
export const PROCEDURE_CATALOG: ProcedureCatalogEntry[] = [
  // Diagnostic
  { code: 'D0210', name: 'Periapical X-ray',              category: 'Diagnostic',   defaultPrice:    80, defaultDurationMin: 15, appliesPerTooth: false, generatesJob: false, insuranceCoverageDefault: 1.0 },
  { code: 'D0150', name: 'Comprehensive oral evaluation', category: 'Diagnostic',   defaultPrice:   120, defaultDurationMin: 30, appliesPerTooth: false, generatesJob: false, insuranceCoverageDefault: 0.9 },

  // Extractions (prerequisite for many restorative procs)
  { code: 'D7140', name: 'Extraction',                    category: 'Restorative',  defaultPrice:   180, defaultDurationMin: 30, appliesPerTooth: true,  generatesJob: false, insuranceCoverageDefault: 0.7 },

  // Restorative
  { code: 'D2740', name: 'Crown — porcelain/ceramic',     category: 'Restorative',  defaultPrice: 1200,  defaultDurationMin: 60, appliesPerTooth: true,  generatesJob: true,  insuranceCoverageDefault: 0.5, prerequisites: ['D7140'], minWeeksAfterPrereq: 8 },
  { code: 'D2950', name: 'Core build-up',                 category: 'Restorative',  defaultPrice:   320, defaultDurationMin: 30, appliesPerTooth: true,  generatesJob: false, insuranceCoverageDefault: 0.5 },
  { code: 'D2962', name: 'Veneer — porcelain laminate',   category: 'Restorative',  defaultPrice: 1400,  defaultDurationMin: 60, appliesPerTooth: true,  generatesJob: true,  insuranceCoverageDefault: 0.0 },
  { code: 'D2960', name: 'Inlay — composite',             category: 'Restorative',  defaultPrice:   650, defaultDurationMin: 45, appliesPerTooth: true,  generatesJob: true,  insuranceCoverageDefault: 0.4 },

  // Implants
  { code: 'D6010', name: 'Implant — surgical placement',  category: 'Implantology', defaultPrice: 2200,  defaultDurationMin: 90, appliesPerTooth: true,  generatesJob: false, insuranceCoverageDefault: 0.3 },
  { code: 'D6058', name: 'Implant abutment — custom',     category: 'Implantology', defaultPrice:   650, defaultDurationMin: 30, appliesPerTooth: true,  generatesJob: true,  insuranceCoverageDefault: 0.3, prerequisites: ['D6010'], minWeeksAfterPrereq: 12 },
  { code: 'D6065', name: 'Implant crown — porcelain',     category: 'Implantology', defaultPrice: 1800,  defaultDurationMin: 60, appliesPerTooth: true,  generatesJob: true,  insuranceCoverageDefault: 0.3, prerequisites: ['D6058'], minWeeksAfterPrereq: 2 },

  // Orthodontics
  { code: 'D8090', name: 'Aligner — comprehensive',       category: 'Orthodontics', defaultPrice: 4800,  defaultDurationMin: 30, appliesPerTooth: false, generatesJob: true,  insuranceCoverageDefault: 0.5 },

  // Appliance
  { code: 'D9944', name: 'Occlusal guard — hard',         category: 'Appliance',    defaultPrice:   480, defaultDurationMin: 30, appliesPerTooth: false, generatesJob: true,  insuranceCoverageDefault: 0.5 },
];

// Quick lookup
export const procedureByCode = (code: string): ProcedureCatalogEntry | undefined =>
  PROCEDURE_CATALOG.find((p) => p.code === code);
