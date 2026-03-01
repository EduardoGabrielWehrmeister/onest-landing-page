/**
 * Componente de Seção Dinâmica
 * @description Renderiza uma seção completa com todos os seus campos dinâmicos
 */

import { User, Briefcase, Users, StickyNote, CheckCircle, FileText, Info } from 'lucide-react';
import { DynamicFieldsGrid } from './DynamicField';
import type {
  FormSectionWithFields,
  FormFieldValue,
} from '@/lib/supabase/types';

export interface DynamicFormSectionProps {
  /** Seção a ser renderizada */
  section: FormSectionWithFields;
  /** Valores atuais dos campos */
  values: Record<string, FormFieldValue>;
  /** Callback quando um valor muda */
  onChange: (fieldKey: string, value: FormFieldValue) => void;
  /** Erros de validação */
  errors?: Record<string, string>;
  /** Se os campos estão desabilitados */
  disabled?: boolean;
  /** Nome do formulário */
  formName?: string;
  /** Se deve mostrar campos condicionais (baseado em visibility) */
  visibleFields?: string[];
}

/**
 * Mapeamento de ícones para seções
 */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'user': User,
  'briefcase': Briefcase,
  'users': Users,
  'sticky-note': StickyNote,
  'check-circle': CheckCircle,
  'file-text': FileText,
  'info': Info,
};

/**
 * Renderiza uma seção completa do formulário
 */
export function DynamicFormSection({
  section,
  values,
  onChange,
  errors = {},
  disabled = false,
  formName = 'form',
  visibleFields,
}: DynamicFormSectionProps) {
  // Filtrar campos visíveis (se fornecido)
  const fieldsToRender = visibleFields
    ? section.fields.filter(f => visibleFields.includes(f.field_key))
    : section.fields;

  // Se não há campos para renderizar, não mostrar seção
  if (fieldsToRender.length === 0) {
    return null;
  }

  // Obter ícone da seção
  const IconComponent = ICON_MAP[section.icon_name || 'info'] || Info;

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Cabeçalho da Seção */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {IconComponent && (
            <div className="flex-shrink-0">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              {section.title}
            </h2>
            {section.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {section.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Campos da Seção */}
      <DynamicFieldsGrid
        fields={fieldsToRender}
        values={values}
        onChange={onChange}
        errors={errors}
        disabled={disabled}
        formName={formName}
      />
    </div>
  );
}

export default DynamicFormSection;
