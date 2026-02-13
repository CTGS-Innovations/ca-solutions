import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "success" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "xs" | "icon";
}

const variantStyles: Record<string, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  success: "bg-accent text-accent-foreground hover:bg-accent/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-border bg-card hover:bg-secondary text-foreground",
  ghost: "hover:bg-secondary text-foreground",
  link: "text-primary underline-offset-4 hover:underline p-0",
};

const sizeStyles: Record<string, string> = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-8 px-3 py-1 text-sm",
  xs: "h-6 px-2 py-0.5 text-xs",
  icon: "h-9 w-9 p-0",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
