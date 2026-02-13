"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useTickets } from "@/hooks/use-tickets";
import { mockCustomers } from "@/data/mock-customers";
import { mockDevices } from "@/data/mock-devices";
import { RepairTicket } from "@/types";

interface TicketFormProps {
  onCreated: (ticket: RepairTicket) => void;
}

export function TicketForm({ onCreated }: TicketFormProps) {
  const { addTicket } = useTickets();
  const [customerId, setCustomerId] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [intakeNotes, setIntakeNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !deviceId) return;
    const ticket = addTicket({ customerId, deviceId, intakeNotes });
    onCreated(ticket);
    setCustomerId("");
    setDeviceId("");
    setIntakeNotes("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Customer</label>
        <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
          <option value="">Select customer...</option>
          {mockCustomers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.phone}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Device</label>
        <Select value={deviceId} onChange={(e) => setDeviceId(e.target.value)} required>
          <option value="">Select device...</option>
          {mockDevices.map((d) => (
            <option key={d.id} value={d.id}>
              {d.make} {d.model} ({d.type})
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Intake Notes</label>
        <Textarea
          placeholder="Describe the reported issue..."
          value={intakeNotes}
          onChange={(e) => setIntakeNotes(e.target.value)}
          rows={4}
        />
      </div>
      <Button type="submit" className="w-full">
        Create Ticket
      </Button>
    </form>
  );
}
