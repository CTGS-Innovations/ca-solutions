import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PanelProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function Panel({ title, icon: Icon, children, className }: PanelProps) {
  return (
    <div className={cn("panel panel-primary", className)}>
      <div className="panel-heading">
        <h3 className="panel-title">
          {Icon && <Icon className="h-4 w-4" />}
          {title}
        </h3>
      </div>
      <div className="panel-body">{children}</div>
    </div>
  );
}
