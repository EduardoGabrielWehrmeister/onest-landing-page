/**
 * SelectField Component
 *
 * Renders a dropdown select field
 */

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FormFieldProps } from '@/lib/supabase/formTypes';
import { getGridClasses } from '@/lib/formGridUtils';

export const SelectField = ({
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
      <Label htmlFor={field.field_key} className="mb-2 block">
        {field.label}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {field.help_text && (
        <p className="text-sm text-muted-foreground mb-2">
          {field.help_text}
        </p>
      )}
      <Select
        value={value || ''}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder={field.placeholder || 'Selecione uma opção'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
