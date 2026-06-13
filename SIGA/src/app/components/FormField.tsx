import { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

/**
 * Standalone form field component.
 * Must NOT be defined inside another component's render scope —
 * doing so causes React to unmount/remount the DOM node on every
 * parent render, losing input focus and resetting IME state.
 */
export function FormField({ label, error, hint, className = "", ...inputProps }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm text-foreground mb-1">{label}</label>
      <input
        {...inputProps}
        className={`w-full px-3 py-2 rounded-md border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring transition-all ${
          error ? "border-destructive focus:ring-destructive/30" : "border-border"
        } ${className}`}
      />
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-muted-foreground text-xs mt-1">{hint}</p>}
    </div>
  );
}
