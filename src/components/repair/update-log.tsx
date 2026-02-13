import { UpdateLogEntry } from "@/types";
import { Panel } from "@/components/ui/panel";
import { MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface UpdateLogProps {
  entries: UpdateLogEntry[];
}

export function UpdateLog({ entries }: UpdateLogProps) {
  const customerEntries = entries.filter((e) => !e.isInternal);

  if (customerEntries.length === 0) return null;

  return (
    <Panel title="Updates" icon={MessageSquare}>
      <div className="space-y-3">
        {customerEntries.map((entry) => (
          <div key={entry.id} className="border-l-2 border-primary/30 pl-3">
            <p className="text-xs text-muted-foreground">{formatDate(entry.timestamp)}</p>
            <p className="text-sm mt-0.5">{entry.message}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
