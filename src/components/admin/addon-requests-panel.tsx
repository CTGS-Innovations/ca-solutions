"use client";

import { AddOnRequest } from "@/types";
import { addonCatalog } from "@/data/addon-catalog";
import { useTickets } from "@/hooks/use-tickets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AddonRequestsPanelProps {
  ticketId: string;
  requests: AddOnRequest[];
}

export function AddonRequestsPanel({ ticketId, requests }: AddonRequestsPanelProps) {
  const { respondAddon } = useTickets();

  if (requests.length === 0) {
    return (
      <div>
        <h3 className="font-semibold text-sm mb-2">Add-On Requests</h3>
        <p className="text-sm text-muted-foreground">No add-on requests yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-sm mb-3">Add-On Requests</h3>
      <div className="space-y-3">
        {requests.map((req) => {
          const item = addonCatalog.find((a) => a.id === req.catalogItemId);
          if (!item) return null;
          return (
            <div key={req.id} className="border rounded p-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">${item.price}</p>
                </div>
                {req.status === "requested" ? (
                  <Badge variant="secondary">Pending</Badge>
                ) : req.status === "approved" ? (
                  <Badge variant="success">Approved</Badge>
                ) : (
                  <Badge variant="destructive">Declined</Badge>
                )}
              </div>
              {req.status === "requested" && (
                <div className="flex gap-2 mt-2">
                  <Button
                    size="xs"
                    variant="success"
                    onClick={() => respondAddon(ticketId, req.id, "approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => respondAddon(ticketId, req.id, "declined")}
                  >
                    Decline
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
