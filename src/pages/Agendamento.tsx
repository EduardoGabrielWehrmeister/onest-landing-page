import { useMemo } from "react";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  User,
  Users,
  FileText,
  StickyNote,
  Shield,
  Key,
  CheckCircle,
} from "lucide-react";

import StepDadosAssessor from "@/components/agendamento/StepDadosAssessor";
import StepTermoResponsabilidade from "@/components/agendamento/StepTermoResponsabilidade";
import StepClientePrincipal from "@/components/agendamento/StepClientePrincipal";
import StepConfiguracaoOTP from "@/components/agendamento/StepConfiguracaoOTP";
import StepContaPrenotami from "@/components/agendamento/StepContaPrenotami";
import StepRequerentesAdicionais from "@/components/agendamento/StepRequerentesAdicionais";
import StepObservacoes from "@/components/agendamento/StepObservacoes";
import StepSucesso from "@/components/agendamento/StepSucesso";
import StepIndicator from "@/components/agendamento/StepIndicator";

const Agendamento = () => {
  const {
    formData,
    currentStep,
    setCurrentStep,
    updateField,
    updateRequerente,
    setQuantidadeRequerentes,
    resetForm,
  } = useLocalStorageForm();

  const steps = useMemo(
    () => [
      { label: "Assessor", key: "assessor", icon: BadgeCheck },
      { label: "Termo", key: "termo", icon: FileText },
      { label: "Cliente", key: "cliente", icon: User },
      { label: "OTP", key: "otp", icon: Shield },
      { label: "Conta", key: "conta", icon: Key },
      { label: "Requerentes", key: "requerentes", icon: Users },
      { label: "Observações", key: "observacoes", icon: StickyNote },
      { label: "Sucesso", key: "sucesso", icon: CheckCircle },
    ],
    []
  );

  const totalSteps = steps.length;
  const currentKey = steps[currentStep]?.key;
  const isSuccessStep = currentKey === "sucesso";

  const canGoNext = () => {
    switch (currentKey) {
      case "assessor":
        return !!(
          formData.assessorEmail &&
          formData.assessorNome &&
          formData.assessorTelefone
        );
      case "termo":
        return formData.termoResponsabilidadeAceito === true;
      case "cliente":
        return !!(
          formData.clienteNome &&
          formData.clientePdfFile &&
          formData.clientePdfConfirmado
        );
      case "otp":
        return !!(formData.otpConfigurado && formData.otpGmailAtencao);
      case "conta":
        return !!(
          formData.prenotamiEmail &&
          formData.prenotamiSenha &&
          formData.prenotamiEndereco &&
          formData.prenotamiAltura &&
          formData.prenotamiCorOlhos
        );
      case "requerentes": {
        const requiredCount = Math.max(0, formData.prenotamiQuantidadePessoas - 1);
        for (let i = 0; i < requiredCount; i++) {
          const r = formData.requerentes[i];
          if (
            !r?.nomeCompleto ||
            !r?.dataNascimento ||
            !r?.prenotamiEmail ||
            !r?.prenotamiSenha ||
            !r?.endereco ||
            !r?.altura ||
            !r?.corOlhos
          ) {
            return false;
          }
        }
        return true;
      }
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentKey) {
      case "assessor":
        return <StepDadosAssessor formData={formData} updateField={updateField} />;
      case "termo":
        return (
          <StepTermoResponsabilidade
            aceito={formData.termoResponsabilidadeAceito}
            onChange={(v) => updateField("termoResponsabilidadeAceito", v)}
          />
        );
      case "cliente":
        return (
          <StepClientePrincipal
            nome={formData.clienteNome}
            pdfFile={formData.clientePdfFile}
            pdfConfirmado={formData.clientePdfConfirmado}
            updateField={updateField}
          />
        );
      case "otp":
        return (
          <StepConfiguracaoOTP
            otpConfigurado={formData.otpConfigurado}
            otpGmailAtencao={formData.otpGmailAtencao}
            otpWhatsAppContato={formData.otpWhatsAppContato}
            updateField={updateField}
          />
        );
      case "conta":
        return (
          <StepContaPrenotami
            email={formData.prenotamiEmail}
            senha={formData.prenotamiSenha}
            endereco={formData.prenotamiEndereco}
            altura={formData.prenotamiAltura}
            corOlhos={formData.prenotamiCorOlhos}
            quantidadePessoas={formData.prenotamiQuantidadePessoas}
            updateField={updateField}
            setQuantidadeRequerentes={setQuantidadeRequerentes}
          />
        );
      case "requerentes":
        return (
          <StepRequerentesAdicionais
            requerentes={formData.requerentes}
            quantidade={formData.prenotamiQuantidadePessoas}
            updateRequerente={updateRequerente}
          />
        );
      case "observacoes":
        return (
          <StepObservacoes value={formData.observacoes} onChange={(v) => updateField("observacoes", v)} />
        );
      case "sucesso":
        return <StepSucesso onReset={resetForm} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="gradient-hero pb-12 md:pb-16">
        {/* Italian Stripe */}
        <div className="italian-stripe"></div>

        <div className="section-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight mb-4 pt-8">
              Solicitação de <span className="italic">Agendamento</span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Preencha as informações abaixo para solicitar seu agendamento no Prenotami
            </p>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(0, 0%, 98%)"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-container relative z-10 -mt-8">
        <div className="max-w-3xl mx-auto">
          {/* Stepper - Only show if not success step */}
          {!isSuccessStep && (
            <div className="mb-8 overflow-x-auto pb-4">
              <div className="flex items-start justify-between min-w-max md:min-w-0 gap-2">
                {steps.slice(0, -1).map((step, index) => (
                  <StepIndicator
                    key={step.key}
                    icon={step.icon}
                    label={step.label}
                    active={index === currentStep}
                    completed={index < currentStep}
                    isLast={index === steps.length - 2}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Card */}
          <Card className="card-elevated border-0 shadow-xl">
            <CardContent className="p-6 md:p-8 lg:p-10">
              <div className="animate-slide-in" key={currentStep}>
                {renderStep()}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          {!isSuccessStep && (
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="gap-2 w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="gap-2 w-full sm:w-auto"
              >
                <>
                  Próximo
                  <ArrowRight className="h-4 w-4" />
                </>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Spacer for bottom */}
      <div className="py-12 md:py-16"></div>
    </div>
  );
};

export default Agendamento;
