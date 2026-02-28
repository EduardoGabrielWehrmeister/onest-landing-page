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

  const currentLength = value.length;

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
            Use apenas letras e números. Não utilize vírgulas ou acentos. Você pode usar hífen para separar informações.
          </p>
          <span className="text-xs text-muted-foreground">
            {currentLength} / {maxLength} caracteres
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepObservacoes;
