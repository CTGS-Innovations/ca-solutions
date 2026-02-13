import { RepairTicket, RepairStatus } from "@/types";
import { createChecklist } from "./baseline-checklist";

function makeChecklist(checkedIds: string[]) {
  return createChecklist().map((item) => ({
    ...item,
    checked: checkedIds.includes(item.id),
  }));
}

export const mockTickets: RepairTicket[] = [
  {
    id: "ticket-001",
    publicToken: "tk_Nq3kR7xBm2PvLwYs9Hj",
    jobNumber: "CA-20250210-001",
    customerId: "cust-001",
    deviceId: "dev-001",
    status: RepairStatus.CHECKED_IN,
    intakeNotes:
      "Customer reports laptop not booting past Windows logo. Started yesterday after a Windows update. No recent hardware changes.",
    checklistItems: makeChecklist(["chk-01"]),
    updateLog: [
      {
        id: "log-001-1",
        timestamp: "2025-02-10T09:30:00Z",
        message: "Device received and condition documented. Starting intake process.",
        isInternal: false,
      },
    ],
    addOnRequests: [],
    checkedInAt: "2025-02-10T09:30:00Z",
  },
  {
    id: "ticket-002",
    publicToken: "tk_Xp8mT4nAw6QrKcDf5Uy",
    jobNumber: "CA-20250209-002",
    customerId: "cust-002",
    deviceId: "dev-002",
    status: RepairStatus.REPAIR_IN_PROGRESS,
    intakeNotes:
      "Intermittent kernel panics, usually when running video editing software. Customer suspects RAM issue. AppleCare expired.",
    checklistItems: makeChecklist([
      "chk-01",
      "chk-02",
      "chk-03",
      "chk-04",
      "chk-05",
      "chk-06",
    ]),
    updateLog: [
      {
        id: "log-002-1",
        timestamp: "2025-02-09T11:00:00Z",
        message: "Device received. Pristine condition noted with charger.",
        isInternal: false,
      },
      {
        id: "log-002-2",
        timestamp: "2025-02-09T14:30:00Z",
        message:
          "Diagnostics complete. Confirmed RAM module issue — one stick reporting errors under load. Ordering replacement.",
        isInternal: false,
      },
      {
        id: "log-002-3",
        timestamp: "2025-02-10T10:00:00Z",
        message: "Replacement RAM arrived. Beginning repair.",
        isInternal: false,
      },
    ],
    addOnRequests: [
      {
        id: "addon-req-001",
        catalogItemId: "addon-002",
        status: "requested",
        requestedAt: "2025-02-09T16:00:00Z",
      },
    ],
    checkedInAt: "2025-02-09T11:00:00Z",
    diagnosingAt: "2025-02-09T11:30:00Z",
    repairInProgressAt: "2025-02-10T10:00:00Z",
  },
  {
    id: "ticket-003",
    publicToken: "tk_Gy7vJ2sEn9WqZmPk4Lt",
    jobNumber: "CA-20250207-003",
    customerId: "cust-003",
    deviceId: "dev-003",
    status: RepairStatus.READY_FOR_PICKUP,
    intakeNotes:
      "Desktop running extremely slowly. Takes 10+ minutes to boot. Customer suspects virus. Multiple browser toolbars visible.",
    checklistItems: makeChecklist([
      "chk-01",
      "chk-02",
      "chk-03",
      "chk-04",
      "chk-05",
      "chk-06",
      "chk-07",
      "chk-08",
      "chk-09",
      "chk-10",
      "chk-11",
      "chk-12",
    ]),
    updateLog: [
      {
        id: "log-003-1",
        timestamp: "2025-02-07T10:00:00Z",
        message: "Device received. Heavy dust buildup noted.",
        isInternal: false,
      },
      {
        id: "log-003-2",
        timestamp: "2025-02-07T13:00:00Z",
        message:
          "Found 3 malware infections and 12 potentially unwanted programs. Hard drive health at 82%. Beginning cleanup.",
        isInternal: false,
      },
      {
        id: "log-003-3",
        timestamp: "2025-02-08T09:00:00Z",
        message:
          "All malware removed. System cleaned, optimized, and drivers updated. Running stability tests.",
        isInternal: false,
      },
      {
        id: "log-003-4",
        timestamp: "2025-02-08T16:00:00Z",
        message:
          "All tests passed. Boot time reduced from 10+ minutes to 45 seconds. Ready for pickup.",
        isInternal: false,
      },
    ],
    addOnRequests: [
      {
        id: "addon-req-002",
        catalogItemId: "addon-003",
        status: "approved",
        requestedAt: "2025-02-07T14:00:00Z",
        respondedAt: "2025-02-07T14:30:00Z",
      },
    ],
    checkedInAt: "2025-02-07T10:00:00Z",
    diagnosingAt: "2025-02-07T11:00:00Z",
    repairInProgressAt: "2025-02-07T15:00:00Z",
    validationAt: "2025-02-08T09:00:00Z",
    readyForPickupAt: "2025-02-08T16:00:00Z",
  },
  {
    id: "ticket-004",
    publicToken: "tk_Bw5rC8hFx1MnUaVd3Ks",
    jobNumber: "CA-20250208-004",
    customerId: "cust-004",
    deviceId: "dev-004",
    status: RepairStatus.DIAGNOSING,
    intakeNotes:
      "Surface Pro 9 touchscreen unresponsive in the bottom third. Works fine with Type Cover trackpad. No physical damage visible.",
    checklistItems: makeChecklist(["chk-01", "chk-02"]),
    updateLog: [
      {
        id: "log-004-1",
        timestamp: "2025-02-08T14:00:00Z",
        message:
          "Device received with Type Cover. Touchscreen issue confirmed — bottom third unresponsive.",
        isInternal: false,
      },
      {
        id: "log-004-2",
        timestamp: "2025-02-08T15:30:00Z",
        message:
          "Running extended diagnostics to determine if this is a digitizer hardware failure or driver/firmware issue.",
        isInternal: false,
      },
    ],
    addOnRequests: [],
    checkedInAt: "2025-02-08T14:00:00Z",
    diagnosingAt: "2025-02-08T15:00:00Z",
  },
];
