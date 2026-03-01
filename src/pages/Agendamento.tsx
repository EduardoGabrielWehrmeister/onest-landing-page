import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useLocalStorage, useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { useFormConfig } from "@/hooks/useFormConfig";
import { StepSelecaoServico } from "@/components/agendamento/StepSelecaoServico";
import { DynamicFormSection } from "@/components/agendamento/DynamicFormSection";
import StepSucesso from "@/components/agendamento/StepSucesso";
import StepIndicator from "@/components/agendamento/StepIndicator";
import type { FormFieldValue } from "@/lib/supabase/types";

// Storage keys
const SELECTION_STORAGE_KEY = "agendamento-selection";
const FORM_VALUES_STORAGE_KEY = "agendamento-dynamic-values";

interface ServiceSelection {
  stateCode: string | null;
  serviceSlug: string | null;
}

const Agendamento = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Seleção de estado/serviço (persistida em localStorage)
  const [selection, setSelection] = useLocalStorage<ServiceSelection>(
    SELECTION_STORAGE_KEY,
    { stateCode: null, serviceSlug: null }
  );

  // Valores dinâmicos dos campos (persistidos em localStorage)
  const [formValues, setFormValues] = useLocalStorage<Record<string, FormFieldValue>>(
    FORM_VALUES_STORAGE_KEY,
    {}
  );

  // Erros de validação
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Ref para formValues - usado em canGoNext para evitar re-renders
  const formValuesRef = useRef(formValues);
  useEffect(() => {
    formValuesRef.current = formValues;
  }, [formValues]);

  // Carregar configuração do formulário
  const {
    config,
    loading: configLoading,
    error: configError,
    validateField,
    validateSection,
  } = useFormConfig(selection.stateCode, selection.serviceSlug, {
    onError: (error) => {
      console.error('Error loading form config:', error);
    },
  });

  // Step atual
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = localStorage.getItem(SELECTION_STORAGE_KEY + "-step");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Salvar step no localStorage
  useEffect(() => {
    localStorage.setItem(SELECTION_STORAGE_KEY + "-step", String(currentStep));
  }, [currentStep]);

  // Determinar se devemos mostrar o step de seleção
  const showSelectionStep = !selection.stateCode || !selection.serviceSlug;

  // Calcular steps visíveis baseados na configuração
  // Retornar todas as seções, filtramos no render
  const visibleSections = useMemo(() => {
    if (!config) return [];
    return config.sections;
  }, [config]);

  // Adicionar steps de seleção e sucesso
  const allSteps = useMemo(() => {
    const steps = [];

    if (showSelectionStep) {
      steps.push({ label: "Seleção", key: "selection", icon: User });
    }

    visibleSections.forEach((section) => {
      steps.push({
        label: section.title.split(" ")[0], // Primeira palavra do título
        key: section.slug,
        icon: undefined, // Será mapeado depois se necessário
      });
    });

    // Adicionar revisão e sucesso apenas se não for step de seleção
    if (!showSelectionStep) {
      steps.push({ label: "Revisão", key: "revisao", icon: CheckCircle });
      steps.push({ label: "Sucesso", key: "sucesso", icon: CheckCircle });
    }

    return steps;
  }, [showSelectionStep, visibleSections]);

  const totalSteps = allSteps.length;
  const currentKey = allSteps[currentStep]?.key;
  const isSuccessStep = currentKey === "sucesso";
  const isReviewStep = currentKey === "revisao";
  const isSelectionStep = currentKey === "selection";

  // Atualizar valor de um campo
  const updateValue = useCallback((fieldKey: string, value: FormFieldValue) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    // Limpar erro do campo ao atualizar
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldKey];
      return newErrors;
    });
  }, [setFormValues]);

  // Callbacks para seleção de serviço
  const handleStateChange = useCallback((stateCode: string | null) => {
    setSelection((prev) => ({ ...prev, stateCode }));
    // Limpar valores do formulário ao mudar estado
    setFormValues({});
    setFieldErrors({});
    setCurrentStep(0);
  }, [setSelection, setFormValues, setFieldErrors, setCurrentStep]);

  const handleServiceChange = useCallback((serviceSlug: string | null) => {
    setSelection((prev) => ({ ...prev, serviceSlug }));
    // Limpar valores do formulário ao mudar serviço
    setFormValues({});
    setFieldErrors({});
    setCurrentStep(0);
  }, [setSelection, setFormValues, setFieldErrors, setCurrentStep]);

  // Validar step atual - usa ref para formValues para evitar re-renders
  const canGoNext = useCallback((): boolean => {
    if (isSelectionStep) {
      return !!selection.stateCode && !!selection.serviceSlug;
    }

    if (isReviewStep) {
      return formValuesRef.current['revisaoConfirmado'] === true;
    }

    // Validar seção atual
    const currentSectionIndex = currentStep - (showSelectionStep ? 1 : 0);
    if (currentSectionIndex >= 0 && currentSectionIndex < visibleSections.length) {
      const result = validateSection(currentSectionIndex, formValuesRef.current);

      // Atualizar erros
      if (!result.valid) {
        setFieldErrors(result.errors);
      }

      return result.valid;
    }

    return true;
  }, [isSelectionStep, isReviewStep, selection.stateCode, selection.serviceSlug, currentStep, showSelectionStep, visibleSections.length, validateSection]);

  // Submeter formulário
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Implementar submissão real usando formSubmissionService
      // const submissionData = {
      //   form_configuration_id: config!.id,
      //   user_type: formValuesRef.current['tipoUsuario'] as 'cliente' | 'assessor',
      //   titular_data: formValuesRef.current,
      //   requerentes_adicionais: formValuesRef.current['requerentes'] || [],
      //   datas_restricao: formValuesRef.current['datasRestricao'] || [],
      //   observacoes: formValuesRef.current['observacoes'] as string || '',
      //   status: 'submitted' as const,
      // };

      // const result = await formSubmissionService.create(submissionData);

      // if (result.error || !result.data) {
      //   throw new Error(result.error?.message || 'Erro ao enviar formulário');
      // }

      // Simular submissão bem-sucedida
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(totalSteps - 1); // Ir para step de sucesso
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao enviar formulário';
      setSubmitError(message);
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [config, totalSteps]);

  // Navegação
  const handleNext = () => {
    if (isReviewStep) {
      handleSubmit();
    } else if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = useCallback(() => {
    setSelection({ stateCode: null, serviceSlug: null });
    setFormValues({});
    setFieldErrors({});
    setCurrentStep(0);
    localStorage.removeItem(SELECTION_STORAGE_KEY + "-step");
  }, [setSelection, setFormValues]);

  // Renderizar step atual
  const renderStep = () => {
    // Loading
    if (!showSelectionStep && configLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Carregando formulário...</p>
        </div>
      );
    }

    // Erro de configuração
    if (!showSelectionStep && configError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {configError.message || 'Erro ao carregar configuração do formulário. Tente novamente.'}
          </AlertDescription>
        </Alert>
      );
    }

    // Step de seleção
    if (isSelectionStep) {
      return (
        <StepSelecaoServico
          selectedState={selection.stateCode}
          onStateChange={handleStateChange}
          selectedService={selection.serviceSlug}
          onServiceChange={handleServiceChange}
        />
      );
    }

    // Step de sucesso
    if (isSuccessStep) {
      return <StepSucesso onReset={handleReset} />;
    }

    // Step de revisão
    if (isReviewStep) {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-serif font-bold">Revisão e Confirmação</h2>
            <p className="text-muted-foreground">
              Revise todas as informações antes de enviar
            </p>
          </div>

          {/* Resumo das informações */}
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{config?.name}</h3>
              <p className="text-sm text-muted-foreground">
                Estado: {config?.state.name} | Serviço: {config?.service_type.name}
              </p>
            </div>

            {/* Listar todos os campos preenchidos */}
            <div className="space-y-2">
              {visibleSections.flatMap((section) =>
                section.fields
                  .filter(f => formValues[f.field_key])
                  .map((field) => (
                    <div key={field.id} className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{field.label}</span>
                      <span className="font-medium">
                        {Array.isArray(formValues[field.field_key])
                          ? `${(formValues[field.field_key] as any[]).length} itens`
                          : String(formValues[field.field_key] || '-')}
                      </span>
                    </div>
                  ))
              )}
            </div>

            {/* Checkbox de confirmação */}
            {config && visibleSections.find(s => s.slug === 'revisao')?.fields.map(field => (
              field.field_key === 'revisaoConfirmado' ? (
                <div key={field.id} className="flex items-start space-x-2 pt-4">
                  <input
                    type="checkbox"
                    id="revisaoConfirmado"
                    checked={formValues['revisaoConfirmado'] === true}
                    onChange={(e) => updateValue('revisaoConfirmado', e.target.checked)}
                    className="mt-1"
                  />
                  <label
                    htmlFor="revisaoConfirmado"
                    className="text-sm cursor-pointer"
                  >
                    Confirmo que todas as informações estão corretas
                  </label>
                </div>
              ) : null
            ))}
          </div>

          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}
        </div>
      );
    }

    // Seções dinâmicas
    const currentSectionIndex = currentStep - (showSelectionStep ? 1 : 0);
    const currentSection = visibleSections[currentSectionIndex];

    if (currentSection) {
      // Retornar todos os campos da seção (sem filtrar por visibilidade)
      // A filtragem pode ser feita no componente se necessário
      return (
        <DynamicFormSection
          section={currentSection}
          values={formValues}
          onChange={updateValue}
          errors={fieldErrors}
          formName="agendamento-form"
        />
      );
    }

    return null;
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
          {!isSuccessStep && !configLoading && (
            <div className="mb-8 overflow-x-auto pb-4">
              <div className="flex items-start justify-between min-w-max md:min-w-0 gap-2">
                {allSteps.slice(0, isSuccessStep ? undefined : -1).map((step, index) => (
                  <StepIndicator
                    key={step.key}
                    icon={step.icon}
                    label={step.label}
                    active={index === currentStep}
                    completed={index < currentStep}
                    isLast={index === allSteps.length - (isSuccessStep ? 1 : 2)}
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
          {!isSuccessStep && !configLoading && (
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
              {/* Hide back button on first step */}
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="gap-2 w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              )}

              {/* Hide next button on revisao step during submit */}
              {(!isReviewStep || !isSubmitting) && currentKey !== "sucesso" && (
                <Button
                  onClick={handleNext}
                  disabled={!canGoNext() || isSubmitting || configLoading}
                  className="gap-2 w-full sm:w-auto"
                  style={{ marginLeft: currentStep === 0 ? 'auto' : undefined }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : isReviewStep ? (
                    <>
                      Enviar
                      <CheckCircle className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Próximo
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
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
