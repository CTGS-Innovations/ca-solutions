"use client";

import { ChecklistItem } from "@/types";
import { useTickets } from "@/hooks/use-tickets";
import { Checkbox } from "@/components/ui/checkbox";

interface AdminChecklistProps {
  ticketId: string;
  items: ChecklistItem[];
}

export function AdminChecklist({ ticketId, items }: AdminChecklistProps) {
  const { toggleChecklistItem } = useTickets();
  const completed = items.filter((i) => i.checked).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Checklist</h3>
        <span className="text-xs text-muted-foreground">
          {completed}/{items.length} complete
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <Checkbox
            key={item.id}
            checked={item.checked}
            onChange={() => toggleChecklistItem(ticketId, item.id)}
            label={item.label}
          />
        ))}
      </div>
    </div>
  );
}
