import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
}

const StepConfirmacao = ({ checked, onChange }: Props) => (
  <div className="space-y-8">
    {/* Header */}
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
        <ShieldCheck className="h-7 w-7 text-primary" />
      </div>
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
        Confirmação
      </h2>
      <p className="text-base text-muted-foreground">
        Revise e confirme para enviar sua solicitação
      </p>
    </div>

    {/* Info card */}
    <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border">
      <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div className="text-left">
        <p className="text-sm font-medium text-foreground">Declaração</p>
        <p className="text-xs text-muted-foreground mt-1">
          Ao confirmar, você declara que todas as informações fornecidas estão corretas
          e autoriza o uso dos dados para o processo de agendamento no Prenotami.
        </p>
      </div>
    </div>

    {/* Checkbox */}
    <Label
      htmlFor="confirmacao"
      className={cn(
        "flex items-center gap-4 rounded-xl border-2 p-5 cursor-pointer transition-all duration-300",
        "hover:border-primary/30 hover:shadow-md",
        checked ? "border-primary bg-primary/5 shadow-lg" : "border-border"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-6 h-6 rounded-md transition-colors",
        checked ? "bg-primary" : "bg-muted"
      )}>
        <Checkbox
          id="confirmacao"
          checked={checked}
          onCheckedChange={(v) => onChange(v === true)}
          className="border-foreground"
        />
      </div>
      <span className="text-sm font-medium text-foreground">
        Confirmo que as informações fornecidas estão corretas
      </span>
    </Label>

    {/* Notice */}
    <div className="text-center">
      <p className="text-xs text-muted-foreground">
        Após confirmar, sua solicitação será enviada para análise
      </p>
    </div>
  </div>
);

export default StepConfirmacao;
