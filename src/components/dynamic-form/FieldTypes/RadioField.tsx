/**
 * RadioField Component
 *
 * Renders radio button options
 */

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import type { FormFieldProps } from '@/lib/supabase/formTypes';
import { getGridClasses } from '@/lib/formGridUtils';

export const RadioField = ({
  field,
  value,
  onChange,
  error,
  options = [],
  disabled = false,
}: FormFieldProps) => {
  const gridClasses = getGridClasses(field.grid_columns, field.grid_md_columns);

  return (
    <div className={`form-field ${gridClasses}`}>
      <div className="flex items-center gap-1.5 mb-3">
        <Label>
          {field.label}
          {field.is_required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {field.tooltip_text && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{field.tooltip_text}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {field.help_text && (
        <p className="text-sm text-muted-foreground mb-3">
          {field.help_text}
        </p>
      )}
      <RadioGroup value={value || ''} onValueChange={onChange} disabled={disabled}>
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`${field.field_key}-${option.value}`}
              />
              <Label
                htmlFor={`${field.field_key}-${option.value}`}
                className="font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
