"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTickets } from "@/hooks/use-tickets";
import { PageHeading } from "@/components/shared/page-heading";
import { TicketFilters } from "@/components/admin/ticket-filters";
import { TicketTable } from "@/components/admin/ticket-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
  const { tickets, getCustomer, getDevice } = useTickets();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    let result = tickets;

    if (statusFilter) {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => {
        const customer = getCustomer(t.customerId);
        const device = getDevice(t.deviceId);
        return (
          t.jobNumber.toLowerCase().includes(q) ||
          customer?.name.toLowerCase().includes(q) ||
          device?.make.toLowerCase().includes(q) ||
          device?.model.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [tickets, search, statusFilter, getCustomer, getDevice]);

  return (
    <div className="max-w-5xl">
      <PageHeading title="Dashboard" description={`${tickets.length} total tickets`}>
        <Link href="/admin/tickets/new">
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </PageHeading>

      <div className="bg-card border rounded p-4">
        <TicketFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <TicketTable tickets={filtered} />
      </div>
    </div>
  );
}
