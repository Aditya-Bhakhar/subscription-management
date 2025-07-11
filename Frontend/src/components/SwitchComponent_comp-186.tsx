import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SwitchComponentProps {
  label?: string;
  subLabel?: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function SwitchComponent({
  checked,
  onCheckedChange,
  label = "Label",
  subLabel = "(Sublabel)",
  description = "A short description goes here.",
}: SwitchComponentProps) {
  const id = useId();
  return (
    <div className="border-input has-data-[state=checked]:border-ring relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
        aria-describedby={`${id}-description`}
      />
      <div className="grid grow gap-2">
        <Label htmlFor={id}>
          {label}{" "}
          <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
            ({subLabel})
          </span>
        </Label>
        {description && (
          <p id={`${id}-description`} className="text-muted-foreground text-xs">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
