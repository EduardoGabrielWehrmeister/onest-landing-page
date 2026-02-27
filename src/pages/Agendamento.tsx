import { useMemo } from "react";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

import StepTipoUsuario from "@/components/agendamento/StepTipoUsuario";
import StepDadosAssessor from "@/components/agendamento/StepDadosAssessor";
import StepDadosCliente from "@/components/agendamento/StepDadosCliente";
import StepPessoas from "@/components/agendamento/StepPessoas";
import StepEndereco from "@/components/agendamento/StepEndereco";
import StepUpload from "@/components/agendamento/StepUpload";
import StepAnotacoes from "@/components/agendamento/StepAnotacoes";
import StepRevisao from "@/components/agendamento/StepRevisao";
import StepConfirmacao from "@/components/agendamento/StepConfirmacao";
import StepSucesso from "@/components/agendamento/StepSucesso";

const Agendamento = () => {
  const {
    formData,
    currentStep,
    setCurrentStep,
    updateField,
    updatePerson,
    setQuantidadePessoas,
    resetForm,
  } = useLocalStorageForm();

  const isAssessor = formData.tipoUsuario === "assessor";

  const steps = useMemo(() => {
    const base = [
      { label: "Tipo de Usuário", key: "tipo" },
      ...(isAssessor ? [{ label: "Dados do Assessor", key: "assessor" }] : []),
      { label: "Dados do Cliente", key: "cliente" },
      { label: "Pessoas", key: "pessoas" },
      { label: "Endereço", key: "endereco" },
      { label: "Comprovante", key: "upload" },
      ...(isAssessor ? [{ label: "Anotações", key: "anotacoes" }] : []),
      { label: "Revisão", key: "revisao" },
      { label: "Confirmação", key: "confirmacao" },
      { label: "Sucesso", key: "sucesso" },
    ];
    return base;
  }, [isAssessor]);

  const totalSteps = steps.length;
  const progressValue = ((currentStep + 1) / totalSteps) * 100;
  const currentKey = steps[currentStep]?.key;
  const isLastActionStep = currentKey === "confirmacao";
  const isSuccessStep = currentKey === "sucesso";

  const canGoNext = () => {
    switch (currentKey) {
      case "tipo": return formData.tipoUsuario !== "";
      case "confirmacao": return formData.confirmacao;
      default: return true;
    }
  };

  const handleNext = () => {
    if (isLastActionStep) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentKey) {
      case "tipo":
        return <StepTipoUsuario value={formData.tipoUsuario} onChange={(v) => updateField("tipoUsuario", v)} />;
      case "assessor":
        return <StepDadosAssessor formData={formData} updateField={updateField} />;
      case "cliente":
        return <StepDadosCliente formData={formData} updateField={updateField} />;
      case "pessoas":
        return <StepPessoas formData={formData} updatePerson={updatePerson} setQuantidadePessoas={setQuantidadePessoas} />;
      case "endereco":
        return <StepEndereco formData={formData} updateField={updateField} />;
      case "upload":
        return <StepUpload fileName={formData.nomeArquivo} onChange={(v) => updateField("nomeArquivo", v)} />;
      case "anotacoes":
        return <StepAnotacoes value={formData.anotacoes} onChange={(v) => updateField("anotacoes", v)} />;
      case "revisao":
        return <StepRevisao formData={formData} />;
      case "confirmacao":
        return <StepConfirmacao checked={formData.confirmacao} onChange={(v) => updateField("confirmacao", v)} />;
      case "sucesso":
        return <StepSucesso onReset={resetForm} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Solicitação de Agendamento
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Preencha as informações abaixo para solicitar seu agendamento
          </p>
        </div>

        {/* Progress */}
        {!isSuccessStep && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Etapa {currentStep + 1} de {totalSteps - 1}</span>
              <span>{steps[currentStep]?.label}</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        )}

        {/* Card */}
        <Card className="card-elevated border-0 shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="animate-fade-in" key={currentStep}>
              {renderStep()}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        {!isSuccessStep && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canGoNext()}
              className="gap-2"
              variant={isLastActionStep ? "cta" : "default"}
            >
              {isLastActionStep ? (
                <>
                  Enviar
                  <Send className="h-4 w-4" />
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agendamento;
