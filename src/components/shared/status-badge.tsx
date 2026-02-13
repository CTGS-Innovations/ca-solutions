import { RepairStatus } from "@/types";
import { STATUS_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: RepairStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2.5 py-1 text-xs font-semibold",
        config.bgColor,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
