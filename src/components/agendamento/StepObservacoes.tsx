import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cleanObservations, getCharCount } from "@/lib/formUtils";

interface Props {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const StepObservacoes = ({ value, onChange, maxLength = 100 }: Props) => {
  const charCount = getCharCount(value, maxLength);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(cleanObservations(e.target.value, maxLength));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          Observações
        </h2>
        <p className="text-base text-muted-foreground">
          Informações adicionais (opcional)
        </p>
      </div>

      {/* Textarea */}
      <div className="space-y-3">
        <Label htmlFor="observacoes" className="text-sm font-medium">
          Observações adicionais
        </Label>
        <Textarea
          id="observacoes"
          value={value}
          onChange={handleChange}
          placeholder="Ex: Prefiro horários pela manhã, ou: Necessidade de acessibilidade"
          rows={4}
          className="resize-none"
          maxLength={maxLength}
        />

        {/* Character Counter */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Campo opcional - Use para informações relevantes
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium ${
                charCount.isNearLimit
                  ? "text-amber-600 dark:text-amber-400"
                  : charCount.isAtLimit
                  ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground"
              }`}
            >
              {charCount.remaining} restantes
            </span>
            <span className="text-xs text-muted-foreground">/ {maxLength}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-200 ${
              charCount.isNearLimit
                ? "bg-amber-500"
                : charCount.isAtLimit
                ? "bg-red-500"
                : "bg-primary"
            }`}
            style={{ width: `${(charCount.current / maxLength) * 100}%` }}
          />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Sugestões:</span> Prefira horários
            específicos, necessidades de acessibilidade, informações sobre crianças, ou qualquer
            detalhe que possa ajudar no seu atendimento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepObservacoes;
