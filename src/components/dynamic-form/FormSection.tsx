/**
 * FormSection Component
 *
 * Renders a form section (step) with all its fields
 */

import { FormFieldFromComplete } from './FormField';
import type { FormSectionComplete } from '@/lib/supabase/formTypes';
import { User, Briefcase, Users, StickyNote, CheckCircle } from 'lucide-react';

// Icon mapping for section icons
const iconMap: Record<string, React.ReactNode> = {
  user: <User className="h-5 w-5" />,
  briefcase: <Briefcase className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  'sticky-note': <StickyNote className="h-5 w-5" />,
  'check-circle': <CheckCircle className="h-5 w-5" />,
};

interface FormSectionProps {
  sectionComplete: FormSectionComplete;
  values: Record<string, any>;
  errors: Record<string, string>;
  onChange: (fieldKey: string, value: any) => void;
  disabled?: boolean;
}

export const FormSection = ({
  sectionComplete,
  values,
  errors,
  onChange,
  disabled = false,
}: FormSectionProps) => {
  const { section, fields } = sectionComplete;

  return (
    <div className="form-section">
      {/* Section Header */}
      <div className="mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          {section.icon_name && iconMap[section.icon_name]}
          <h2 className="text-xl font-semibold">{section.title}</h2>
        </div>
        {section.description && (
          <p className="text-muted-foreground mt-2">{section.description}</p>
        )}
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {fields.map((fieldComplete) => {
          const fieldValue = values[fieldComplete.field.field_key];
          const fieldError = errors[fieldComplete.field.field_key];

          return (
            <FormFieldFromComplete
              key={fieldComplete.field.id}
              fieldComplete={fieldComplete}
              value={fieldValue}
              onChange={(value) =>
                onChange(fieldComplete.field.field_key, value)
              }
              error={fieldError}
              disabled={disabled}
            />
          );
        })}
      </div>
    </div>
  );
};
