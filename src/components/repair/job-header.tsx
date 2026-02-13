import { RepairTicket, Device, Customer } from "@/types";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { Monitor, Laptop, Tablet, Cpu } from "lucide-react";

const deviceIcons: Record<string, React.ElementType> = {
  laptop: Laptop,
  desktop: Monitor,
  tablet: Tablet,
  other: Cpu,
};

interface JobHeaderProps {
  ticket: RepairTicket;
  device: Device;
  customer: Customer;
}

export function JobHeader({ ticket, device, customer }: JobHeaderProps) {
  const DeviceIcon = deviceIcons[device.type] || Cpu;

  return (
    <div className="bg-card border rounded p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
            <DeviceIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">{device.make} {device.model}</h1>
            <p className="text-sm text-muted-foreground">Job #{ticket.jobNumber}</p>
          </div>
        </div>
        <StatusBadge status={ticket.status} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-muted-foreground">Checked in</span>
          <p className="font-medium">{formatDate(ticket.checkedInAt)}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Customer</span>
          <p className="font-medium">{customer.name}</p>
        </div>
      </div>
      {ticket.intakeNotes && (
        <div className="mt-3 pt-3 border-t">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Issue Reported</span>
          <p className="text-sm mt-1">{ticket.intakeNotes}</p>
        </div>
      )}
    </div>
  );
}
