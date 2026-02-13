import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ checked, onChange, label, disabled, className }: CheckboxProps) {
  return (
    <label className={cn("flex items-center gap-2 cursor-pointer", disabled && "opacity-50 cursor-not-allowed", className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "h-4 w-4 rounded-sm border flex items-center justify-center transition-colors",
          checked
            ? "bg-primary border-primary text-primary-foreground"
            : "border-border bg-input"
        )}
      >
        {checked && <Check className="h-3 w-3" />}
      </button>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}
