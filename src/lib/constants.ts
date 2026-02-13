import { RepairStatus } from "@/types";

export const STATUS_CONFIG: Record<
  RepairStatus,
  { label: string; color: string; bgColor: string; step: number }
> = {
  [RepairStatus.CHECKED_IN]: {
    label: "Checked In",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    step: 1,
  },
  [RepairStatus.DIAGNOSING]: {
    label: "Diagnosing",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    step: 2,
  },
  [RepairStatus.AWAITING_APPROVAL]: {
    label: "Awaiting Approval",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    step: 2,
  },
  [RepairStatus.REPAIR_IN_PROGRESS]: {
    label: "Repair In Progress",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
    step: 3,
  },
  [RepairStatus.VALIDATION]: {
    label: "Validation",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    step: 4,
  },
  [RepairStatus.READY_FOR_PICKUP]: {
    label: "Ready for Pickup",
    color: "text-green-700",
    bgColor: "bg-green-100",
    step: 5,
  },
  [RepairStatus.CLOSED]: {
    label: "Closed",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    step: 5,
  },
};

export const SLA_THRESHOLD_HOURS = 48;

export const STATUS_ORDER: RepairStatus[] = [
  RepairStatus.CHECKED_IN,
  RepairStatus.DIAGNOSING,
  RepairStatus.REPAIR_IN_PROGRESS,
  RepairStatus.VALIDATION,
  RepairStatus.READY_FOR_PICKUP,
];
