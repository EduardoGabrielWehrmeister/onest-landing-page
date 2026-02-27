import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const StepAnotacoes = ({ value, onChange }: Props) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-serif font-semibold text-foreground">Anotações</h2>
      <p className="text-sm text-muted-foreground mt-1">Observações adicionais sobre o cliente</p>
    </div>
    <div className="space-y-2">
      <Label htmlFor="anotacoes">Observações</Label>
      <Textarea
        id="anotacoes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escreva aqui suas anotações..."
        rows={6}
      />
    </div>
  </div>
);

export default StepAnotacoes;
