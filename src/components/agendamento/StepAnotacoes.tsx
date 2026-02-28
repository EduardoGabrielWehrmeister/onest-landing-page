import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const StepAnotacoes = ({ value, onChange }: Props) => (
  <div className="space-y-8">
    {/* Header */}
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
        Anotações
      </h2>
      <p className="text-base text-muted-foreground">
        Observações adicionais sobre o cliente
      </p>
    </div>

    {/* Textarea */}
    <div className="space-y-2">
      <Label htmlFor="anotacoes" className="text-sm font-medium">Observações</Label>
      <Textarea
        id="anotacoes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escreva aqui suas anotações..."
        rows={6}
        className="resize-none"
      />
      <p className="text-xs text-muted-foreground">
        Campo opcional - Use para adicionar informações relevantes sobre o cliente
      </p>
    </div>
  </div>
);

export default StepAnotacoes;
