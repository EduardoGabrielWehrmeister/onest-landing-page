import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
}

const StepConfirmacao = ({ checked, onChange }: Props) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-serif font-semibold text-foreground">Confirmação</h2>
      <p className="text-sm text-muted-foreground mt-1">Confirme para enviar sua solicitação</p>
    </div>

    <div className="flex flex-col items-center text-center gap-4 py-4">
      <ShieldCheck className="h-12 w-12 text-primary" />
      <p className="text-sm text-muted-foreground max-w-md">
        Ao confirmar, você declara que todas as informações fornecidas estão corretas e autoriza o uso dos dados para o processo de agendamento.
      </p>
    </div>

    <Label
      htmlFor="confirmacao"
      className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
        checked ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      <Checkbox
        id="confirmacao"
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
      />
      <span className="text-sm text-foreground">Confirmo que as informações estão corretas</span>
    </Label>
  </div>
);

export default StepConfirmacao;
