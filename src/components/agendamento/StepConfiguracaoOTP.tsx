import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Shield, MessageCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormData } from "@/hooks/useLocalStorageForm";

interface Props {
  otpConfigurado: boolean;
  otpGmailAtencao: boolean;
  otpWhatsAppContato: boolean;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const StepConfiguracaoOTP = ({
  otpConfigurado,
  otpGmailAtencao,
  otpWhatsAppContato,
  updateField,
}: Props) => {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/5500000000000", "_blank");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          Configuração OTP
        </h2>
        <p className="text-base text-muted-foreground">
          Autenticação em duas etapas do Prenotami
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-muted-foreground/20 bg-muted/30">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-foreground">O que é OTP?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                O sistema Prenotami utiliza autenticação em duas etapas (OTP - One Time Password) para
                proteger sua conta. Um código de verificação será enviado para seu email sempre que
                necessário fazer login ou confirmar ações sensíveis.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Certifique-se de ter acesso à conta de email fornecida e verifique sua pasta de spam
                caso não receba o código.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gmail Alert Card */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-5">
          <div className="flex gap-3">
            <Mail className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-900 dark:text-amber-100 font-medium mb-1">
                Atenção: Contas Gmail
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-200">
                O sistema funciona apenas com contas Gmail. O Gmail pode classificar emails do Prenotami
                como spam. Verifique sua pasta de spam/promoções caso não receba o código de confirmação.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Button */}
      <Card className="border-muted-foreground/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Precisa de ajuda?</p>
                <p className="text-xs text-muted-foreground">
                  Fale conosco pelo WhatsApp para tirar dúvidas sobre OTP
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleWhatsAppClick}
              className="gap-2 flex-shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              Falar no WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Checkboxes */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-foreground">Confirme que você entendeu:</p>

        <Label
          className={cn(
            "flex items-start gap-4 rounded-xl border-2 p-5 cursor-pointer transition-all",
            "hover:border-primary/30 hover:bg-primary/5",
            otpConfigurado ? "border-primary bg-primary/5" : "border-border bg-card"
          )}
        >
          <Checkbox
            checked={otpConfigurado}
            onCheckedChange={(checked) => updateField("otpConfigurado", checked === true)}
            className="mt-0.5"
          />
          <span className="text-sm font-medium leading-relaxed">
            Entendi a configuração necessária para OTP e que receberei um código no email fornecido
          </span>
        </Label>

        <Label
          className={cn(
            "flex items-start gap-4 rounded-xl border-2 p-5 cursor-pointer transition-all",
            "hover:border-primary/30 hover:bg-primary/5",
            otpGmailAtencao ? "border-primary bg-primary/5" : "border-border bg-card"
          )}
        >
          <Checkbox
            checked={otpGmailAtencao}
            onCheckedChange={(checked) => updateField("otpGmailAtencao", checked === true)}
            className="mt-0.5"
          />
          <span className="text-sm font-medium leading-relaxed">
            Confirmo que tenho acesso à conta de email Gmail fornecida e verificarei a pasta de spam
          </span>
        </Label>
      </div>
    </div>
  );
};

export default StepConfiguracaoOTP;
