"use client";

import { useState } from "react";
import { UpdateLogEntry } from "@/types";
import { useTickets } from "@/hooks/use-tickets";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface NotesPanelProps {
  ticketId: string;
  entries: UpdateLogEntry[];
}

export function NotesPanel({ ticketId, entries }: NotesPanelProps) {
  const { addUpdateLog } = useTickets();
  const [message, setMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    addUpdateLog(ticketId, message.trim(), isInternal);
    setMessage("");
  };

  return (
    <div>
      <h3 className="font-semibold text-sm mb-3">Updates & Notes</h3>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <Textarea
          placeholder="Add an update..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="rounded"
            />
            Internal only (not visible to customer)
          </label>
          <Button type="submit" size="sm">
            Add Note
          </Button>
        </div>
      </form>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {[...entries].reverse().map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "border-l-2 pl-3 py-1",
              entry.isInternal ? "border-amber-400" : "border-primary/30"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{formatDate(entry.timestamp)}</span>
              {entry.isInternal && (
                <span className="text-xs bg-amber-100 text-amber-700 px-1.5 rounded">Internal</span>
              )}
            </div>
            <p className="text-sm">{entry.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
