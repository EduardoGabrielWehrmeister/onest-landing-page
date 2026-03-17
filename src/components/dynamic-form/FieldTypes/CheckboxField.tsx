/**
 * CheckboxField Component
 *
 * Renders a checkbox field (typically for a single boolean field)
 */

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import type { FormFieldProps } from '@/lib/supabase/formTypes';
import { getGridClasses } from '@/lib/formGridUtils';

export const CheckboxField = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}: FormFieldProps) => {
  const gridClasses = getGridClasses(field.grid_columns, field.grid_md_columns);

  return (
    <div className={`form-field ${gridClasses}`}>
      <div className="flex items-start space-x-3">
        <Checkbox
          id={field.field_key}
          checked={value === true || value === 'true'}
          onCheckedChange={(checked) => onChange(checked)}
          disabled={disabled}
          className={error ? 'border-red-500' : ''}
        />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <Label
              htmlFor={field.field_key}
              className="font-normal cursor-pointer"
            >
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
            <p className="text-sm text-muted-foreground mt-1">
              {field.help_text}
            </p>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
