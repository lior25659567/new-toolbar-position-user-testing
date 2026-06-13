/**
 * STUB — original implementation was lost. Minimal types + seed data for the
 * patient Orders tab so the page compiles and renders. Replace with the real
 * order model when it is recovered.
 */

export type ProductionStage =
  | "received"
  | "design"
  | "manufacturing"
  | "qc"
  | "shipped";

export const PRODUCTION_STAGES: ProductionStage[] = [
  "received",
  "design",
  "manufacturing",
  "qc",
  "shipped",
];

export type OrderStatus = "draft" | "submitted" | "in-production" | "completed";

export interface LabMessage {
  id: string;
  author: string;
  timestamp: string; // ISO
  body: string;
}

export interface OrderActivityEvent {
  id: string;
  timestamp: string; // ISO
  actor: string;
  kind: "stage" | "message" | "status";
  stage?: ProductionStage;
  message: string;
}

export interface PatientOrder {
  id: string;
  service: string;
  status: OrderStatus;
  lab?: string;
  createdAt: string; // ISO
  productionStage?: ProductionStage;
  thread?: LabMessage[];
  activity?: OrderActivityEvent[];
}

export interface OrderTemplate {
  id: string;
  name: string;
  service: string;
}

export const SEED_PATIENT_ORDERS: PatientOrder[] = [
  {
    id: "ord-1001",
    service: "Crown · #14",
    status: "in-production",
    lab: "Northside Dental Lab",
    createdAt: "2026-04-20T10:15:00.000Z",
    productionStage: "design",
    thread: [
      {
        id: "m-1",
        author: "Lab",
        timestamp: "2026-04-21T09:00:00.000Z",
        body: "Received the impression — starting the design today.",
      },
    ],
    activity: [
      {
        id: "a-1",
        timestamp: "2026-04-20T10:15:00.000Z",
        actor: "Practice",
        kind: "status",
        message: "Order submitted.",
      },
      {
        id: "a-2",
        timestamp: "2026-04-21T09:00:00.000Z",
        actor: "Lab",
        kind: "stage",
        stage: "design",
        message: "Stage: Design.",
      },
    ],
  },
  {
    id: "ord-1002",
    service: "Night guard",
    status: "submitted",
    lab: "Northside Dental Lab",
    createdAt: "2026-05-02T14:40:00.000Z",
    productionStage: "received",
    thread: [],
    activity: [
      {
        id: "a-3",
        timestamp: "2026-05-02T14:40:00.000Z",
        actor: "Practice",
        kind: "status",
        message: "Order submitted.",
      },
    ],
  },
  {
    id: "ord-1003",
    service: "Study model",
    status: "draft",
    createdAt: "2026-05-18T08:05:00.000Z",
    thread: [],
    activity: [],
  },
];

export const SEED_ORDER_TEMPLATES: OrderTemplate[] = [
  { id: "tpl-1", name: "Standard crown", service: "Crown" },
  { id: "tpl-2", name: "Night guard", service: "Night guard" },
];
