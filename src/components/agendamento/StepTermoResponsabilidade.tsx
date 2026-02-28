import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  aceito: boolean;
  onChange: (value: boolean) => void;
}

const StepTermoResponsabilidade = ({ aceito, onChange }: Props) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          Termo de Responsabilidade
        </h2>
        <p className="text-base text-muted-foreground">
          Leia atentamente antes de prosseguir
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-muted-foreground/20 bg-muted/30">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-foreground">Responsabilidade sobre as Informações</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ao prosseguir com esta solicitação de agendamento, você declara que todas as informações
                fornecidas são verdadeiras, completas e atuais. Você é responsável pela precisão dos dados
                inseridos e pela atualização de quaisquer alterações.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Informações incorretas ou incompletas podem resultar em cancelamento do agendamento ou
                impossibilidade de entrada no consulado. Certifique-se de que todos os documentos estejam
                válidos e dentro dos prazos exigidos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Card */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-5">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">
                Importante: Verifique todos os dados antes de enviar
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-200 mt-1">
                Após o envio, eventuais correções dependerão da disponibilidade de novos agendamentos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkbox */}
      <Label
        className={cn(
          "flex items-start gap-4 rounded-xl border-2 p-5 cursor-pointer transition-all",
          "hover:border-primary/30 hover:bg-primary/5",
          aceito ? "border-primary bg-primary/5" : "border-border bg-card"
        )}
      >
        <Checkbox
          checked={aceito}
          onCheckedChange={(checked) => onChange(checked === true)}
          className="mt-0.5"
        />
        <span className="text-sm font-medium leading-relaxed">
          Li e aceito o termo de responsabilidade declarando que as informações fornecidas são verdadeiras
        </span>
      </Label>
    </div>
  );
};

export default StepTermoResponsabilidade;
