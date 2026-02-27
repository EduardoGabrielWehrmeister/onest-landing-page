import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw } from "lucide-react";

interface Props {
  onReset: () => void;
}

const StepSucesso = ({ onReset }: Props) => (
  <div className="flex flex-col items-center text-center py-8 gap-6 animate-scale-in">
    <div className="rounded-full bg-primary/10 p-6">
      <CheckCircle2 className="h-16 w-16 text-primary" />
    </div>
    <div className="space-y-2">
      <h2 className="text-2xl font-serif font-bold text-foreground">
        Solicitação enviada com sucesso!
      </h2>
      <p className="text-muted-foreground max-w-sm">
        Em breve entraremos em contato para confirmar seu agendamento.
      </p>
    </div>
    <Button onClick={onReset} variant="outline" className="gap-2 mt-4">
      <RotateCcw className="h-4 w-4" />
      Nova solicitação
    </Button>
  </div>
);

export default StepSucesso;
