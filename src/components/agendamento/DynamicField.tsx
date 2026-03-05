/**
 * Componente de Campo Dinâmico
 * @description Renderiza diferentes tipos de campos baseado na configuração do banco
 */

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import PdfUpload from "./PdfUpload";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type {
  FormFieldWithOptions,
  FormFieldValue,
  FieldOption,
} from '@/lib/supabase/types';
import { formatPhoneInput } from '@/lib/formUtils';

export interface DynamicFieldProps {
  /** Configuração do campo */
  field: FormFieldWithOptions;
  /** Valor atual do campo */
  value: FormFieldValue;
  /** Callback quando o valor muda */
  onChange: (value: FormFieldValue) => void;
  /** Mensagem de erro de validação */
  error?: string;
  /** Se o campo está desabilitado */
  disabled?: boolean;
  /** Nome do formulário (para radio group) */
  formName?: string;
}

/**
 * Renderiza um campo dinâmico baseado no tipo
 */
export function DynamicField({
  field,
  value,
  onChange,
  error,
  disabled = false,
  formName = 'form',
}: DynamicFieldProps) {
  const inputId = `field-${field.field_key}`;
  const errorId = error ? `error-${field.field_key}` : undefined;
  const hasError = !!error;

  // Wrapper com Label e mensagem de erro
  const FieldWrapper = ({ children }: { children: React.ReactNode }) => (
    <div
      className={`space-y-2 ${field.grid_columns ? `col-span-${field.grid_columns}` : ''}`}
      style={{ gridColumn: `span ${field.grid_columns || 12}` }}
    >
      <div className="flex items-center gap-2">
        <Label htmlFor={inputId} className={hasError ? 'text-destructive' : ''}>
          {field.label}
          {field.is_required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.tooltip_text && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{field.tooltip_text}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {children}
      {field.help_text && !hasError && (
        <p className="text-sm text-muted-foreground">{field.help_text}</p>
      )}
      {hasError && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );

  // Renderizar o tipo apropriado de campo
  const renderField = () => {
    switch (field.field_type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <FieldWrapper>
            <Input
              id={inputId}
              type={field.field_type === 'password' ? 'password' : field.field_type}
              placeholder={field.placeholder}
              value={value as string || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={errorId}
              maxLength={field.max_length}
              className={hasError ? 'border-destructive' : ''}
            />
          </FieldWrapper>
        );

      case 'phone':
        return (
          <FieldWrapper>
            <Input
              id={inputId}
              type="tel"
              placeholder={field.placeholder || '(00) 00000-0000'}
              value={formatPhoneInput(value as string || '')}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={errorId}
              className={hasError ? 'border-destructive' : ''}
              inputMode="tel"
            />
          </FieldWrapper>
        );

      case 'number':
        return (
          <FieldWrapper>
            <Input
              id={inputId}
              type="text"
              inputMode="numeric"
              placeholder={field.placeholder}
              value={value as string || ''}
              onChange={(e) => {
                const numValue = e.target.value.replace(/\D/g, '');
                onChange(numValue);
              }}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={errorId}
              maxLength={field.max_length}
              className={hasError ? 'border-destructive' : ''}
            />
          </FieldWrapper>
        );

      case 'textarea':
        return (
          <FieldWrapper>
            <Textarea
              id={inputId}
              placeholder={field.placeholder}
              value={value as string || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={errorId}
              maxLength={field.max_length}
              rows={4}
              className={hasError ? 'border-destructive' : ''}
            />
            {field.max_length && (
              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {(value as string || '').length} / {field.max_length}
                </span>
              </div>
            )}
          </FieldWrapper>
        );

      case 'select':
        return (
          <FieldWrapper>
            <Select
              value={value as string || ''}
              onValueChange={onChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={inputId}
                aria-invalid={hasError}
                aria-describedby={errorId}
                className={hasError ? 'border-destructive' : ''}
              >
                <SelectValue placeholder={field.placeholder || 'Selecione...'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: FieldOption) => (
                  <SelectItem
                    key={option.id}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>
        );

      case 'radio':
        return (
          <FieldWrapper>
            <RadioGroup
              name={formName}
              value={value as string || ''}
              onValueChange={onChange}
              disabled={disabled}
            >
              {field.options?.map((option: FieldOption) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${inputId}-${option.value}`}
                  />
                  <Label
                    htmlFor={`${inputId}-${option.value}`}
                    className="font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FieldWrapper>
        );

      case 'checkbox':
        return (
          <FieldWrapper>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={inputId}
                checked={!!value}
                onCheckedChange={(checked) => onChange(checked)}
                disabled={disabled}
                aria-invalid={hasError}
                aria-describedby={errorId}
              />
              <Label
                htmlFor={inputId}
                className={hasError ? 'text-destructive' : ''}
              >
                {field.label}
              </Label>
            </div>
          </FieldWrapper>
        );

      case 'date':
        return (
          <FieldWrapper>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id={inputId}
                  type="button"
                  disabled={disabled}
                  className={`
                    w-full flex items-center justify-between
                    px-3 py-2 text-sm bg-background
                    border border-input rounded-md
                    hover:bg-accent hover:text-accent-foreground
                    focus:outline-none focus:ring-2 focus:ring-ring
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${hasError ? 'border-destructive' : ''}
                  `}
                >
                  <span className={value ? '' : 'text-muted-foreground'}>
                    {value
                      ? format(new Date(value as string), 'PPP', { locale: ptBR })
                      : (field.placeholder || 'Selecione uma data')
                    }
                  </span>
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value as string) : undefined}
                  onSelect={(date) => onChange(date?.toISOString().split('T')[0])}
                  disabled={(date) =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FieldWrapper>
        );

      case 'file':
        return (
          <FieldWrapper>
            <PdfUpload
              title={field.label}
              fileName={value as string || ''}
              onFileSelect={(file) => onChange(file?.name || '')}
              onFileRemove={() => onChange('')}
              accept={field.file_types?.join(',') || '.pdf,application/pdf'}
              tooltipText={field.help_text}
            />
          </FieldWrapper>
        );

      case 'address_autocomplete':
        // Campo especial para CEP com auto-complete
        return (
          <FieldWrapper>
            <Input
              id={inputId}
              type="text"
              inputMode="numeric"
              placeholder={field.placeholder || '00000-000'}
              value={value as string || ''}
              onChange={(e) => {
                const cepValue = e.target.value.replace(/\D/g, '');
                onChange(cepValue);
              }}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={errorId}
              maxLength={8}
              className={hasError ? 'border-destructive' : ''}
            />
          </FieldWrapper>
        );

      case 'calendar_multiple':
        // Implementar se necessário para múltiplas datas
        return (
          <FieldWrapper>
            <div className="text-sm text-muted-foreground">
              Campo de múltiplas datas (calendar_multiple) - a ser implementado
            </div>
          </FieldWrapper>
        );

      default:
        return (
          <FieldWrapper>
            <Input
              id={inputId}
              placeholder={field.placeholder}
              value={value as string || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={errorId}
              className={hasError ? 'border-destructive' : ''}
            />
          </FieldWrapper>
        );
    }
  };

  return renderField();
}

/**
 * Renderiza múltiplos campos dinâmicos em um grid
 */
export interface DynamicFieldsGridProps {
  /** Lista de campos para renderizar */
  fields: FormFieldWithOptions[];
  /** Valores atuais dos campos */
  values: Record<string, FormFieldValue>;
  /** Callback quando um valor muda */
  onChange: (fieldKey: string, value: FormFieldValue) => void;
  /** Erros de validação */
  errors?: Record<string, string>;
  /** Se os campos estão desabilitados */
  disabled?: boolean;
  /** Nome do formulário (para radio groups) */
  formName?: string;
}

export function DynamicFieldsGrid({
  fields,
  values,
  onChange,
  errors = {},
  disabled = false,
  formName = 'form',
}: DynamicFieldsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          value={values[field.field_key]}
          onChange={(value) => onChange(field.field_key, value)}
          error={errors[field.field_key]}
          disabled={disabled}
          formName={formName}
        />
      ))}
    </div>
  );
}
