import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const StepAnotacoes = ({ value, onChange }: Props) => (
  <div className="space-y-8">
    {/* Header */}
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
        <StickyNote className="h-7 w-7 text-accent" />
      </div>
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
