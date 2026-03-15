/**
 * PhoneField Component
 *
 * Renders a phone input field with masking
 */

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatPhoneInput } from '@/lib/formUtils';
import type { FormFieldProps } from '@/lib/supabase/formTypes';
import { getGridClasses } from '@/lib/formGridUtils';

export const PhoneField = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}: FormFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    onChange(formatted);
  };

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
        type="tel"
        placeholder={field.placeholder || '(XX) XXXXX-XXXX'}
        value={value || ''}
        onChange={handleChange}
        maxLength={15}
        disabled={disabled}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
