import { RepairStatus } from "@/types";
import { processSteps } from "@/data/process-steps";
import { STATUS_CONFIG } from "@/lib/constants";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessStepperProps {
  currentStatus: RepairStatus;
}

export function ProcessStepper({ currentStatus }: ProcessStepperProps) {
  const currentStep = STATUS_CONFIG[currentStatus]?.step ?? 1;

  return (
    <div className="bg-card border rounded p-4 sm:p-6">
      <h2 className="font-semibold mb-4">Repair Progress</h2>
      <div className="space-y-0">
        {processSteps.map((step, idx) => {
          const stepNum = idx + 1;
          const isComplete = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0",
                    isComplete && "bg-accent border-accent text-accent-foreground",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                    !isComplete && !isCurrent && "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                {idx < processSteps.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 h-12 my-1",
                      isComplete ? "bg-accent" : "bg-border"
                    )}
                  />
                )}
              </div>
              <div className="pt-1 pb-4">
                <p className={cn(
                  "text-sm font-semibold",
                  isCurrent && "text-primary",
                  !isComplete && !isCurrent && "text-muted-foreground"
                )}>
                  {step.title}
                </p>
                {(isCurrent || isComplete) && (
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
