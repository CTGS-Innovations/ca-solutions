"use client";

import { useTickets } from "@/hooks/use-tickets";
import { JobHeader } from "@/components/repair/job-header";
import { ProcessStepper } from "@/components/repair/process-stepper";
import { BaselineChecklist } from "@/components/repair/baseline-checklist";
import { RiskReduction } from "@/components/repair/risk-reduction";
import { SafeguardsGrid } from "@/components/repair/safeguards-grid";
import { UpdateLog } from "@/components/repair/update-log";
import { PickupInstructions } from "@/components/repair/pickup-instructions";
import { RepairStatus } from "@/types";

export default function RepairStatusPage({
  params,
}: {
  params: { token: string };
}) {
  const { getTicketByToken, getCustomer, getDevice } = useTickets();
  const ticket = getTicketByToken(params.token);

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-bold mb-2">Ticket Not Found</h1>
        <p className="text-sm text-muted-foreground">
          This repair link may be invalid or expired. Please check the URL or contact us for help.
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

  const isReady = ticket.status === RepairStatus.READY_FOR_PICKUP;

  return (
    <div className="space-y-4">
      <JobHeader ticket={ticket} device={device} customer={customer} />
      <ProcessStepper currentStatus={ticket.status} />
      <BaselineChecklist items={ticket.checklistItems} />
      <RiskReduction />
      <SafeguardsGrid ticket={ticket} />
      <UpdateLog entries={ticket.updateLog} />
      {isReady && <PickupInstructions />}
    </div>
  );
}
