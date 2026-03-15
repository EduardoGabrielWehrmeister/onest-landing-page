/**
 * DateField Component
 *
 * Renders a date input field
 */

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { FormFieldProps } from '@/lib/supabase/formTypes';
import { getGridClasses } from '@/lib/formGridUtils';

export const DateField = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}: FormFieldProps) => {
  const gridClasses = getGridClasses(field.grid_columns, field.grid_md_columns);

  return (
    <div className={`form-field ${gridClasses}`}>
      <Label htmlFor={field.field_key} className="mb-2 block">
        {field.label}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {field.help_text && (
        <p className="text-sm text-muted-foreground mb-2">
          {field.help_text}
        </p>
      )}
      <Input
        id={field.field_key}
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
