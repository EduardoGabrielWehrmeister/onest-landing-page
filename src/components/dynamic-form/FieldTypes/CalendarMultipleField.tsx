/**
 * CalendarMultipleField Component
 *
 * Renders a multiple date selection field (calendar with multiple dates)
 */

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';
import type { FormFieldProps } from '@/lib/supabase/formTypes';
import { getGridClasses } from '@/lib/formGridUtils';

export const CalendarMultipleField = ({
  field,
  value = [],
  onChange,
  error,
  disabled = false,
}: FormFieldProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const gridClasses = getGridClasses(field.grid_columns, field.grid_md_columns);

  const selectedDates: string[] = Array.isArray(value) ? value : [];

  const handleDateAdd = (date: string) => {
    if (!selectedDates.includes(date)) {
      const newDates = [...selectedDates, date].sort();
      onChange(newDates);
    }
  };

  const handleDateRemove = (date: string) => {
    const newDates = selectedDates.filter((d) => d !== date);
    onChange(newDates);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getNextWeekDates = (): Array<{ date: string; display: string }> => {
    const dates = [];
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString(),
        display: formatDate(date.toISOString()),
      });
    }
    return dates;
  };

  const upcomingDates = getNextWeekDates();

  return (
    <div className={`form-field ${gridClasses}`}>
      <Label className="mb-2 block">
        {field.label}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {field.help_text && (
        <p className="text-sm text-muted-foreground mb-2">
          {field.help_text}
        </p>
      )}

      <div className="space-y-3">
        {/* Selected Dates */}
        {selectedDates.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Datas selecionadas ({selectedDates.length})
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                disabled={disabled}
              >
                Limpar todas
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedDates.map((date) => (
                <div
                  key={date}
                  className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm"
                >
                  <span>{formatDate(date)}</span>
                  <button
                    type="button"
                    onClick={() => handleDateRemove(date)}
                    disabled={disabled}
                    className="hover:text-blue-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          disabled={disabled}
          className="w-full"
        >
          <Calendar className="h-4 w-4 mr-2" />
          {isCalendarOpen ? 'Fechar Calendário' : 'Selecionar Datas'}
        </Button>

        {/* Calendar Grid */}
        {isCalendarOpen && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm font-medium mb-3">
              Selecione as datas (próximos 30 dias):
            </p>
            <div className="grid grid-cols-5 gap-2">
              {upcomingDates.map(({ date, display }) => {
                const isSelected = selectedDates.includes(date);
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => handleDateAdd(date)}
                    disabled={isSelected || disabled}
                    className={`p-2 text-sm rounded transition-colors ${
                      isSelected
                        ? 'bg-blue-500 text-white cursor-not-allowed'
                        : 'bg-white hover:bg-blue-100 border cursor-pointer'
                    }`}
                  >
                    {display}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
