import { ProcessStep, RepairStatus } from "@/types";

export const processSteps: ProcessStep[] = [
  {
    id: "step-1",
    title: "Checked In",
    description:
      "Your device has been received and logged. We document its condition and your reported issues.",
    status: RepairStatus.CHECKED_IN,
  },
  {
    id: "step-2",
    title: "Diagnostics",
    description:
      "We run comprehensive tests to identify the root cause — not just the symptoms. This ensures we fix it right the first time.",
    status: RepairStatus.DIAGNOSING,
  },
  {
    id: "step-3",
    title: "Repair In Progress",
    description:
      "Our technician is actively working on your device using industry-standard tools and verified parts.",
    status: RepairStatus.REPAIR_IN_PROGRESS,
  },
  {
    id: "step-4",
    title: "Validation & Testing",
    description:
      "After the repair, we run stability tests to make sure everything works reliably before you pick up.",
    status: RepairStatus.VALIDATION,
  },
  {
    id: "step-5",
    title: "Ready for Pickup",
    description:
      "Your device is repaired, tested, and ready to go. We'll walk you through what was done when you pick up.",
    status: RepairStatus.READY_FOR_PICKUP,
  },
];
