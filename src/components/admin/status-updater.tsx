"use client";

import { RepairStatus } from "@/types";
import { STATUS_CONFIG } from "@/lib/constants";
import { Select } from "@/components/ui/select";
import { useTickets } from "@/hooks/use-tickets";

interface StatusUpdaterProps {
  ticketId: string;
  currentStatus: RepairStatus;
}

export function StatusUpdater({ ticketId, currentStatus }: StatusUpdaterProps) {
  const { updateStatus } = useTickets();
  const allStatuses = Object.values(RepairStatus);

  return (
    <div>
      <label className="text-sm font-medium mb-1 block">Update Status</label>
      <Select
        value={currentStatus}
        onChange={(e) => updateStatus(ticketId, e.target.value as RepairStatus)}
      >
        {allStatuses.map((status) => (
          <option key={status} value={status}>
            {STATUS_CONFIG[status].label}
          </option>
        ))}
      </Select>
    </div>
  );
}
