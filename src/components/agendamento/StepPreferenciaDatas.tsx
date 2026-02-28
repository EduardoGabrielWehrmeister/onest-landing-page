import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Props {
  selectedDates: string[];
  onChange: (dates: string[]) => void;
}

const StepPreferenciaDatas = ({ selectedDates, onChange }: Props) => {
  // Handle date selection from calendar
  const handleSelect = (dates: Date[] | undefined) => {
    if (dates) {
      const isoDates = dates.map((d) => d.toISOString());
      onChange(isoDates);
    } else {
      onChange([]);
    }
  };

  // Remove individual date
  const removeDate = (dateToRemove: string) => {
    onChange(selectedDates.filter((d) => d !== dateToRemove));
  };

  // Convert ISO strings back to Date objects for Calendar
  const calendarDates = selectedDates.map((d) => new Date(d));

  // Sort dates for display
  const sortedDates = [...selectedDates].sort();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          Preferência de Datas
        </h2>
        <p className="text-base text-muted-foreground">
          Selecione as datas preferidas para o agendamento (opcional)
        </p>
      </div>

      {/* Calendar */}
      <div className="flex justify-center">
        <Calendar
          mode="multiple"
          selected={calendarDates}
          onSelect={handleSelect}
          className="rounded-md border"
          disabled={{ before: new Date() }}
          classNames={{
            month_caption: "flex justify-center pt-1 relative items-center w-full",
            caption_label: "text-sm font-medium",
            month_grid: "w-full border-collapse space-x-1 space-y-1",
          }}
        />
      </div>

      {/* Selected Dates Display */}
      {selectedDates.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Datas selecionadas ({selectedDates.length})
          </Label>
          <div className="flex flex-wrap gap-2">
            {sortedDates.map((dateStr) => {
              const date = new Date(dateStr);
              return (
                <Badge key={dateStr} variant="secondary" className="gap-1 pr-1">
                  {date.toLocaleDateString("pt-BR")}
                  <button
                    type="button"
                    onClick={() => removeDate(dateStr)}
                    className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Helper text */}
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Dica:</span> Selecione todas as datas
          que você tem disponibilidade. Isso nos ajuda a encontrar o melhor horário para você.
        </p>
      </div>

      {/* Empty state hint */}
      {selectedDates.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Você pode selecionar datas clicando no calendário acima ou prosseguir sem selecionar nenhuma data.
          </p>
        </div>
      )}
    </div>
  );
};

export default StepPreferenciaDatas;
