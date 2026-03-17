/**
 * FormField Component
 *
 * Generic field renderer that dispatches to the appropriate field type component
 */

import * as FieldTypes from './FieldTypes';
import type { FormFieldProps } from '@/lib/supabase/formTypes';
import type { FormFieldComplete } from '@/lib/supabase/formTypes';

export const FormField = ({
  field,
  value,
  onChange,
  error,
  options = [],
  disabled = false,
}: FormFieldProps) => {
  const commonProps = {
    field,
    value,
    onChange,
    error,
    options,
    disabled,
  };

  // Map field type to component
  switch (field.field_type) {
    case 'text':
      return <FieldTypes.TextField {...commonProps} />;
    case 'email':
      return <FieldTypes.EmailField {...commonProps} />;
    case 'phone':
      return <FieldTypes.PhoneField {...commonProps} />;
    case 'number':
      return <FieldTypes.NumberField {...commonProps} />;
    case 'textarea':
      return <FieldTypes.TextareaField {...commonProps} />;
    case 'select':
      return <FieldTypes.SelectField {...commonProps} />;
    case 'radio':
      return <FieldTypes.RadioField {...commonProps} />;
    case 'checkbox':
      return <FieldTypes.CheckboxField {...commonProps} />;
    case 'date':
      return <FieldTypes.DateField {...commonProps} />;
    case 'password':
      return <FieldTypes.PasswordField {...commonProps} />;
    case 'file':
      return <FieldTypes.FileField {...commonProps} />;
    case 'address_autocomplete':
      return <FieldTypes.AddressAutocompleteField {...commonProps} />;
    case 'calendar_multiple':
      return <FieldTypes.CalendarMultipleField {...commonProps} />;
    case 'requerentes_adicionais':
      return <FieldTypes.RequerentesAdicionaisField {...commonProps} />;
    default:
      // Fallback to text field for unknown types
      console.warn(`Unknown field type: ${field.field_type}, using TextField`);
      return <FieldTypes.TextField {...commonProps} />;
  }
};

/**
 * Helper to create FormField from FormFieldComplete
 */
export const FormFieldFromComplete = ({
  fieldComplete,
  value,
  onChange,
  error,
  disabled = false,
}: {
  fieldComplete: FormFieldComplete;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}) => {
  return (
    <FormField
      field={fieldComplete.field}
      value={value}
      onChange={onChange}
      error={error}
      options={fieldComplete.options}
      disabled={disabled}
    />
  );
};
