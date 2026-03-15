/**
 * DynamicForm Component
 *
 * Main form container that renders a complete dynamic form from database configuration
 */

import { useState, useEffect, useCallback } from 'react';
import { FormSection } from './FormSection';
import type { FormConfigurationComplete } from '@/lib/supabase/formTypes';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';

interface DynamicFormProps {
  config: FormConfigurationComplete;
  initialValues?: Record<string, any>;
  onSubmit?: (data: Record<string, any>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  disabled?: boolean;
  showSubmitButton?: boolean;
}

export const DynamicForm = ({
  config,
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = 'Continuar',
  disabled = false,
  showSubmitButton = true,
}: DynamicFormProps) => {
  // Form state
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update values when initialValues change
  useEffect(() => {
    setValues(initialValues);
  }, [JSON.stringify(initialValues)]);

  // Handle field change
  const handleChange = useCallback(
    (fieldKey: string, value: any) => {
      setValues((prev) => ({ ...prev, [fieldKey]: value }));

      // Clear error for this field when value changes
      if (errors[fieldKey]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldKey];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Handle field blur (mark as touched and validate)
  const handleBlur = useCallback((fieldKey: string) => {
    setTouched((prev) => ({ ...prev, [fieldKey]: true }));

    // Validate this field
    const error = validateField(fieldKey, values[fieldKey]);
    if (error) {
      setErrors((prev) => ({ ...prev, [fieldKey]: error }));
    }
  }, [values]);

  // Validate a single field
  const validateField = useCallback(
    (fieldKey: string, value: any): string | null => {
      // Find field configuration
      let fieldConfig = null;
      for (const section of config.sections) {
        const found = section.fields.find((f) => f.field.field_key === fieldKey);
        if (found) {
          fieldConfig = found;
          break;
        }
      }

      if (!fieldConfig) return null;

      const { field, validations } = fieldConfig;

      // Check required
      if (field.is_required && (!value || value === '')) {
        return `${field.label} é obrigatório`;
      }

      // Apply validations from database
      if (validations && validations.length > 0) {
        for (const validation of validations) {
          const error = applyValidation(validation, value, field.label);
          if (error) return error;
        }
      }

      return null;
    },
    [config]
  );

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate all fields
    for (const section of config.sections) {
      for (const fieldComplete of section.fields) {
        const { field } = fieldComplete;
        const value = values[field.field_key];
        const error = validateField(field.field_key, value);
        if (error) {
          newErrors[field.field_key] = error;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [config, values, validateField]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="dynamic-form">
      {/* Render all sections */}
      {config.sections.map((sectionComplete) => (
        <div key={sectionComplete.section.id} className="mb-8">
          <FormSection
            sectionComplete={sectionComplete}
            values={values}
            errors={errors}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
      ))}

      {/* Submit button */}
      {showSubmitButton && (
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={disabled || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                {submitLabel}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </form>
  );
};

/**
 * Helper function to apply a validation rule
 */
const applyValidation = (
  validation: any,
  value: any,
  label: string
): string | null => {
  switch (validation.validation_type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return validation.error_message;
      }
      break;

    case 'phone':
      const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
      if (!phoneRegex.test(value)) {
        return validation.error_message;
      }
      break;

    case 'cep':
      const cepRegex = /^\d{5}-\d{3}$/;
      if (!cepRegex.test(value)) {
        return validation.error_message;
      }
      break;

    case 'min_length':
      if (value?.length < Number(validation.validation_value)) {
        return validation.error_message;
      }
      break;

    case 'max_length':
      if (value?.length > Number(validation.validation_value)) {
        return validation.error_message;
      }
      break;

    case 'pattern':
      if (validation.validation_value) {
        const regex = new RegExp(validation.validation_value);
        if (!regex.test(value)) {
          return validation.error_message;
        }
      }
      break;
  }

  return null;
};
