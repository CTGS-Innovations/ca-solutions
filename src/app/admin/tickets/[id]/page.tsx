"use client";

import { useTickets } from "@/hooks/use-tickets";
import { PageHeading } from "@/components/shared/page-heading";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatusUpdater } from "@/components/admin/status-updater";
import { AdminChecklist } from "@/components/admin/admin-checklist";
import { NotesPanel } from "@/components/admin/notes-panel";
import { AddonRequestsPanel } from "@/components/admin/addon-requests-panel";
import { QrDisplay } from "@/components/admin/qr-display";
import { QrPrintReceipt } from "@/components/admin/qr-print-receipt";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { Printer, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { getTicketById, getCustomer, getDevice } = useTickets();
  const ticket = getTicketById(params.id);

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-bold mb-2">Ticket Not Found</h1>
        <p className="text-sm text-muted-foreground">
          This ticket ID does not exist.
        </p>
      </div>
    );
  }

  const customer = getCustomer(ticket.customerId);
  const device = getDevice(ticket.deviceId);

  if (!customer || !device) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Error loading ticket data.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <PageHeading title={ticket.jobNumber} description={`${device.make} ${device.model}`}>
        <StatusBadge status={ticket.status} />
      </PageHeading>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column: main ticket info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ticket info */}
          <div className="bg-card border rounded p-4">
            <h3 className="font-semibold text-sm mb-3">Ticket Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Customer</span>
                <p className="font-medium">{customer.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phone</span>
                <p className="font-medium">{customer.phone}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email</span>
                <p className="font-medium">{customer.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Checked In</span>
                <p className="font-medium">{formatDate(ticket.checkedInAt)}</p>
              </div>
            </div>
            {ticket.intakeNotes && (
              <>
                <Separator className="my-3" />
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Intake Notes</span>
                  <p className="text-sm mt-1">{ticket.intakeNotes}</p>
                </div>
              </>
            )}
          </div>

          {/* Status updater */}
          <div className="bg-card border rounded p-4">
            <StatusUpdater ticketId={ticket.id} currentStatus={ticket.status} />
          </div>

          {/* Checklist */}
          <div className="bg-card border rounded p-4">
            <AdminChecklist ticketId={ticket.id} items={ticket.checklistItems} />
          </div>

          {/* Notes */}
          <div className="bg-card border rounded p-4">
            <NotesPanel ticketId={ticket.id} entries={ticket.updateLog} />
          </div>

          {/* Add-on requests */}
          <div className="bg-card border rounded p-4">
            <AddonRequestsPanel ticketId={ticket.id} requests={ticket.addOnRequests} />
          </div>
        </div>

        {/* Right column: QR + actions */}
        <div className="space-y-4">
          <div className="bg-card border rounded p-4">
            <h3 className="font-semibold text-sm mb-3 text-center">QR Code</h3>
            <QrDisplay publicToken={ticket.publicToken} jobNumber={ticket.jobNumber} />
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" />
                Print Receipt
              </Button>
              <Link href={`/repair/${ticket.publicToken}`} target="_blank" className="block">
                <Button variant="outline" size="sm" className="w-full gap-1">
                  <ExternalLink className="h-4 w-4" />
                  Customer View
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-card border rounded p-4 text-sm">
            <h3 className="font-semibold mb-2">Device Details</h3>
            <div className="space-y-1">
              <p><span className="text-muted-foreground">Type:</span> {device.type}</p>
              <p><span className="text-muted-foreground">Make:</span> {device.make}</p>
              <p><span className="text-muted-foreground">Model:</span> {device.model}</p>
              {device.serial && <p><span className="text-muted-foreground">Serial:</span> {device.serial}</p>}
              {device.conditionNotes && (
                <p><span className="text-muted-foreground">Condition:</span> {device.conditionNotes}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden print receipt */}
      <div className="print-only">
        <QrPrintReceipt ticket={ticket} customer={customer} device={device} />
      </div>
    </div>
  );
}
