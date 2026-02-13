"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RepairTicket } from "@/types";
import { StatusBadge } from "@/components/shared/status-badge";
import { useTickets } from "@/hooks/use-tickets";
import { formatShortDate, isOverdue } from "@/lib/utils";
import { SLA_THRESHOLD_HOURS } from "@/lib/constants";
import { AlertTriangle } from "lucide-react";

interface TicketTableProps {
  tickets: RepairTicket[];
}

export function TicketTable({ tickets }: TicketTableProps) {
  const { getCustomer, getDevice } = useTickets();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No tickets found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2 font-medium text-muted-foreground">Job #</th>
            <th className="pb-2 font-medium text-muted-foreground">Customer</th>
            <th className="pb-2 font-medium text-muted-foreground hidden sm:table-cell">Device</th>
            <th className="pb-2 font-medium text-muted-foreground">Status</th>
            <th className="pb-2 font-medium text-muted-foreground hidden md:table-cell">Checked In</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {tickets.map((ticket) => {
            const customer = getCustomer(ticket.customerId);
            const device = getDevice(ticket.deviceId);
            const overdue = mounted && isOverdue(ticket.checkedInAt, SLA_THRESHOLD_HOURS) &&
              ticket.status !== "READY_FOR_PICKUP" && ticket.status !== "CLOSED";

            return (
              <tr key={ticket.id} className="hover:bg-muted/50">
                <td className="py-3">
                  <Link
                    href={`/admin/tickets/${ticket.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {ticket.jobNumber}
                  </Link>
                </td>
                <td className="py-3">{customer?.name ?? "Unknown"}</td>
                <td className="py-3 hidden sm:table-cell">
                  {device ? `${device.make} ${device.model}` : "Unknown"}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={ticket.status} />
                    {overdue && (
                      <span title="Overdue">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 text-muted-foreground hidden md:table-cell">
                  {formatShortDate(ticket.checkedInAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
