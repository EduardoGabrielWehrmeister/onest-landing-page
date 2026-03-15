/**
 * Componente de Seleção de Múltiplas Datas
 * @description Permite selecionar múltiplas datas usando um calendar interativo
 */

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface MultipleDatesPickerProps {
  /** Datas selecionadas (array de strings em formato ISO) */
  value: string[];
  /** Callback quando as datas mudam */
  onChange: (dates: string[]) => void;
  /** Texto de placeholder */
  placeholder?: string;
  /** Se o campo está desabilitado */
  disabled?: boolean;
  /** Mensagem de erro */
  error?: string;
  /** Nome do campo para acessibilidade */
  name?: string;
}

/**
 * Renderiza um componente de seleção de múltiplas datas
 */
export function MultipleDatesPicker({
  value = [],
  onChange,
  placeholder = 'Selecione as datas',
  disabled = false,
  error,
  name = 'dates-picker',
}: MultipleDatesPickerProps) {
  const [open, setOpen] = useState(false);

  // Converter strings ISO para objetos Date
  const selectedDates = value
    .filter(dateStr => dateStr)
    .map(dateStr => new Date(dateStr))
    .filter(date => !isNaN(date.getTime()));

  /**
   * Remove uma data específica da seleção
   */
  const removeDate = (dateToRemove: Date) => {
    const newDates = selectedDates.filter(
      date => date.getTime() !== dateToRemove.getTime()
    );
    onChange(newDates.map(d => d.toISOString().split('T')[0]));
  };

  /**
   * Seleciona/deseleciona uma data no calendar
   */
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate || disabled) return;

    // Converter para string ISO (apenas a parte da data)
    const dateStr = selectedDate.toISOString().split('T')[0];
    const currentDateIndex = value.findIndex(v => v === dateStr);

    if (currentDateIndex > -1) {
      // Data já está selecionada, remover
      const newValue = [...value];
      newValue.splice(currentDateIndex, 1);
      onChange(newValue);
    } else {
      // Adicionar data selecionada
      onChange([...value, dateStr]);
    }
  };

  /**
   * Verifica se uma data já está selecionada
   */
  const isSelected = (date: Date) => {
    return selectedDates.some(
      selected => selected.getTime() === date.getTime()
    );
  };

  /**
   * Verifica se uma data está no passado
   */
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  return (
    <div className="space-y-2">
      {/* Trigger para abrir o calendar */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`
              w-full flex items-center justify-between
              px-3 py-2 text-sm bg-background
              border border-input rounded-md
              hover:bg-accent hover:text-accent-foreground
              focus:outline-none focus:ring-2 focus:ring-ring
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
              ${error ? 'border-destructive' : ''}
            `}
            aria-label={placeholder}
            aria-expanded={open}
            name={name}
          >
            <span className={selectedDates.length > 0 ? '' : 'text-muted-foreground'}>
              {selectedDates.length > 0
                ? `${selectedDates.length} ${selectedDates.length === 1 ? 'data selecionada' : 'datas selecionadas'}`
                : placeholder
              }
            </span>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={handleDateSelect}
            disabled={(date) => isPastDate(date)}
            locale={ptBR}
            initialFocus
            className="rounded-md"
          />
        </PopoverContent>
      </Popover>

      {/* Badges com datas selecionadas */}
      {selectedDates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedDates
            .sort((a, b) => a.getTime() - b.getTime())
            .map((date, index) => (
              <Badge
                key={`${date.getTime()}-${index}`}
                variant="secondary"
                className="gap-1 pr-1"
              >
                {format(date, 'dd/MM/yyyy', { locale: ptBR })}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeDate(date)}
                    className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                    aria-label={`Remover data ${format(date, 'dd/MM/yyyy', { locale: ptBR })}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
        </div>
      )}

      {/* Texto de ajuda sobre datas no passado */}
      {selectedDates.length === 0 && !disabled && (
        <p className="text-xs text-muted-foreground">
          Clique para selecionar as datas em que você NÃO pode comparecer.
          Não é possível selecionar datas no passado.
        </p>
      )}

      {/* Mensagem de erro */}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default MultipleDatesPicker;
