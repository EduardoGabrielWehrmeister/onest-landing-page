/**
 * CheckboxField Component
 *
 * Renders a checkbox field (typically for a single boolean field)
 */

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
          <Label
            htmlFor={field.field_key}
            className="font-normal cursor-pointer"
          >
            {field.label}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </Label>
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
