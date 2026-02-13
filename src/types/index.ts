export enum RepairStatus {
  CHECKED_IN = "CHECKED_IN",
  DIAGNOSING = "DIAGNOSING",
  AWAITING_APPROVAL = "AWAITING_APPROVAL",
  REPAIR_IN_PROGRESS = "REPAIR_IN_PROGRESS",
  VALIDATION = "VALIDATION",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  CLOSED = "CLOSED",
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Device {
  id: string;
  type: "laptop" | "desktop" | "tablet" | "other";
  make: string;
  model: string;
  serial?: string;
  conditionNotes?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface UpdateLogEntry {
  id: string;
  timestamp: string;
  message: string;
  isInternal: boolean;
}

export interface AddOnRequest {
  id: string;
  catalogItemId: string;
  status: "requested" | "approved" | "declined";
  requestedAt: string;
  respondedAt?: string;
}

export interface RepairTicket {
  id: string;
  publicToken: string;
  jobNumber: string;
  customerId: string;
  deviceId: string;
  status: RepairStatus;
  intakeNotes: string;
  checklistItems: ChecklistItem[];
  updateLog: UpdateLogEntry[];
  addOnRequests: AddOnRequest[];
  checkedInAt: string;
  diagnosingAt?: string;
  awaitingApprovalAt?: string;
  repairInProgressAt?: string;
  validationAt?: string;
  readyForPickupAt?: string;
  closedAt?: string;
}

export interface AddOnCatalogItem {
  id: string;
  name: string;
  description: string;
  whyItMatters: string;
  price: number;
  active: boolean;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  status: RepairStatus;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}
