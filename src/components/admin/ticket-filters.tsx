"use client";

import { STATUS_CONFIG } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search } from "lucide-react";

interface TicketFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function TicketFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: TicketFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by job number, customer, or device..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="w-full sm:w-48"
      >
        <option value="">All Statuses</option>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <option key={key} value={key}>
            {config.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
