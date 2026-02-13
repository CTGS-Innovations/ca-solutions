import { ChecklistItem } from "@/types";
import { Panel } from "@/components/ui/panel";
import { ClipboardCheck, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaselineChecklistProps {
  items: ChecklistItem[];
}

export function BaselineChecklist({ items }: BaselineChecklistProps) {
  const completed = items.filter((i) => i.checked).length;

  return (
    <Panel title="What We Do Every Time" icon={ClipboardCheck}>
      <p className="text-xs text-muted-foreground mb-3">
        Every repair includes these baseline checks at no extra cost — {completed} of {items.length} complete.
      </p>
      <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${(completed / items.length) * 100}%` }}
        />
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-sm">
            {item.checked ? (
              <Check className="h-4 w-4 text-accent shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
            )}
            <span className={cn(item.checked && "text-muted-foreground")}>{item.label}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
