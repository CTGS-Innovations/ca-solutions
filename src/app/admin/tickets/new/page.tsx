"use client";

import { useState } from "react";
import { PageHeading } from "@/components/shared/page-heading";
import { TicketForm } from "@/components/admin/ticket-form";
import { QrDisplay } from "@/components/admin/qr-display";
import { QrPrintReceipt } from "@/components/admin/qr-print-receipt";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RepairTicket } from "@/types";
import { useTickets } from "@/hooks/use-tickets";
import { Printer } from "lucide-react";
import Link from "next/link";

export default function NewTicketPage() {
  const [createdTicket, setCreatedTicket] = useState<RepairTicket | null>(null);
  const { getCustomer, getDevice } = useTickets();

  const customer = createdTicket ? getCustomer(createdTicket.customerId) : null;
  const device = createdTicket ? getDevice(createdTicket.deviceId) : null;

  return (
    <div className="max-w-lg">
      <PageHeading
        title="Create New Ticket"
        description="Enter customer and device information to start a repair."
      />

      <div className="bg-card border rounded p-4">
        <TicketForm onCreated={(ticket) => setCreatedTicket(ticket)} />
      </div>

      <Dialog
        open={!!createdTicket}
        onClose={() => setCreatedTicket(null)}
        title="Ticket Created"
      >
        {createdTicket && (
          <div className="space-y-4">
            <QrDisplay
              publicToken={createdTicket.publicToken}
              jobNumber={createdTicket.jobNumber}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-1"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" />
                Print Receipt
              </Button>
              <Link href={`/admin/tickets/${createdTicket.id}`} className="flex-1">
                <Button className="w-full">View Ticket</Button>
              </Link>
            </div>
          </div>
        )}
      </Dialog>

      {/* Hidden print receipt */}
      {createdTicket && customer && device && (
        <div className="print-only">
          <QrPrintReceipt ticket={createdTicket} customer={customer} device={device} />
        </div>
      )}
    </div>
  );
}
