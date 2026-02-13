"use client";

import { RepairTicket } from "@/types";
import { addonCatalog } from "@/data/addon-catalog";
import { SafeguardCard } from "./safeguard-card";
import { useTickets } from "@/hooks/use-tickets";
import { Shield } from "lucide-react";
import { Panel } from "@/components/ui/panel";

interface SafeguardsGridProps {
  ticket: RepairTicket;
}

export function SafeguardsGrid({ ticket }: SafeguardsGridProps) {
  const { requestAddon } = useTickets();
  const activeAddons = addonCatalog.filter((a) => a.active);

  return (
    <Panel title="Recommended Safeguards" icon={Shield}>
      <p className="text-xs text-muted-foreground mb-4">
        Optional enhancements if you want extra protection. These are never required — every repair already includes our full baseline service.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activeAddons.map((item) => {
          const existing = ticket.addOnRequests.find(
            (r) => r.catalogItemId === item.id
          );
          return (
            <SafeguardCard
              key={item.id}
              item={item}
              existingRequest={existing}
              onRequest={() => requestAddon(ticket.id, item.id)}
            />
          );
        })}
      </div>
    </Panel>
  );
}
