/**
 * NumberField Component
 *
 * Renders a number input field
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import type { FormFieldProps } from "@/lib/supabase/formTypes";
import { getGridClasses } from "@/lib/formGridUtils";

export const NumberField = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}: FormFieldProps) => {

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let stringValue = e.target.value;

  stringValue = stringValue.replace(/\D/g, '');

  stringValue = stringValue.slice(0, 3);

  const newValue = stringValue === '' ? '' : Number(stringValue);

  onChange(newValue);
};

  const gridClasses = getGridClasses(field.grid_columns, field.grid_md_columns);

  return (
    <div className={`form-field ${gridClasses}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <Label htmlFor={field.field_key} className="text-sm font-medium">
          {field.label}
          {field.is_required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {field.tooltip_text && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{field.tooltip_text}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {field.help_text && (
        <p className="text-sm text-muted-foreground mb-2">{field.help_text}</p>
      )}
      <Input
        id={field.field_key}
        type="text"
        inputMode="numeric"
        placeholder={field.placeholder}
        value={value || ""}
        onChange={handleChange}
        className={error ? "border-red-500" : ""}
        disabled={disabled}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
