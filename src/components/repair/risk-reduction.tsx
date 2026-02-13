import { Panel } from "@/components/ui/panel";
import { ShieldCheck, HardDrive, Bug, RotateCcw, AlertTriangle } from "lucide-react";

const risks = [
  { icon: HardDrive, label: "Data loss from failing drives", color: "text-blue-600" },
  { icon: Bug, label: "Persistent malware or rootkits", color: "text-red-500" },
  { icon: RotateCcw, label: "Recurring crashes and instability", color: "text-amber-600" },
  { icon: AlertTriangle, label: "Undetected hardware failures", color: "text-orange-500" },
];

export function RiskReduction() {
  return (
    <Panel title="What This Prevents" icon={ShieldCheck}>
      <p className="text-xs text-muted-foreground mb-3">
        Our thorough process catches issues that quick fixes miss.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {risks.map((risk, i) => {
          const Icon = risk.icon;
          return (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Icon className={`h-4 w-4 shrink-0 ${risk.color}`} />
              <span>{risk.label}</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
