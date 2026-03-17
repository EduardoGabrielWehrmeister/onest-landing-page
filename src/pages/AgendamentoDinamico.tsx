/**
 * Página de Agendamento Dinâmico
 *
 * Formulário carregado do Supabase com base em:
 * - Estado (State)
 * - Tipo de Serviço (Service Type)
 * - Tipo de Usuário (Cliente/Assessor)
 */

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StepFormSelection } from '@/components/agendamento/StepFormSelection';
import { DynamicForm } from '@/components/dynamic-form/DynamicForm';
import { useFormConfiguration } from '@/hooks/useFormConfiguration';
import type { FormConfigurationComplete } from '@/lib/supabase/formTypes';
import { useLocalStorageForm } from '@/hooks/useLocalStorageForm';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const AgendamentoDinamico = () => {
  const [currentPhase, setCurrentPhase] = useState<
    'selection' | 'dynamic_form' | 'success'
  >('selection');

  // Form configuration loaded from database
  const [formConfig, setFormConfig] = useState<FormConfigurationComplete | null>(
    null
  );

  // Form data stored in localStorage
  const { formData, updateField, resetForm } = useLocalStorageForm();

  const {
    getFormConfiguration,
    submitForm,
    loading,
    error,
  } = useFormConfiguration();

  // Handle form configuration selection
  const handleSelection = async (params: {
    stateId: string;
    serviceTypeId: string;
    userType: 'cliente' | 'assessor';
    config: FormConfigurationComplete;
  }) => {
    // Store configuration
    setFormConfig(params.config);

    // Store user type
    updateField('tipoUsuario', params.userType);

    // Initialize form values with defaults
    params.config.sections.forEach((section) => {
      section.fields.forEach(({ field }) => {
        // Set default value if not already set
        if (formData[field.field_key] === undefined) {
          updateField(field.field_key, '');
        }
      });
    });

    // Move to dynamic form phase
    setCurrentPhase('dynamic_form');
  };

  // Handle dynamic form submission
  const handleSubmit = async (formValues: Record<string, any>) => {
    if (!formConfig) return;

    // Store all form values
    Object.entries(formValues).forEach(([key, value]) => {
      updateField(key, value);
    });

    // Submit to database
    const result = await submitForm(formValues, formConfig, formData.tipoUsuario);

    if (result) {
      // Move to success phase
      setCurrentPhase('success');
    } else {
      console.error('Erro ao enviar formulário:', error);
      alert('Erro ao enviar formulário. Tente novamente.');
    }
  };

  // Handle restart
  const handleRestart = () => {
    resetForm();
    setFormConfig(null);
    setCurrentPhase('selection');
  };

  // Render content based on phase
  const renderContent = () => {
    switch (currentPhase) {
      case 'selection':
        return (
          <StepFormSelection
            onSelection={handleSelection}
          />
        );

      case 'dynamic_form':
        if (!formConfig) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent"></div>
            </div>
          );
        }

        return (
          <Card className="card-elevated border-0 shadow-xl">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setCurrentPhase('selection')}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar à Seleção</span>
                </button>
              </div>

              <DynamicForm
                config={formConfig}
                initialValues={formData}
                onSubmit={handleSubmit}
                submitLabel="Enviar Solicitação"
                onCancel={() => setCurrentPhase('selection')}
                userType={formData.tipoUsuario}
              />
            </CardContent>
          </Card>
        );

      case 'success':
        return (
          <Card className="card-elevated border-0 shadow-xl max-w-2xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold">
                  Solicitação Enviada!
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Sua solicitação foi enviada com sucesso. Entraremos em
                  contato em breve.
                </p>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="mt-6"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Nova Solicitação
                </button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-background">
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
              Preencha as informações abaixo com base na solicitação que deseja fazer
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
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="font-medium">Erro ao carregar dados</p>
              <p className="text-sm">{error.message}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && currentPhase === 'selection' && (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent"></div>
            </div>
          )}

          {/* Form Content */}
          {renderContent()}
        </div>
      </div>

      {/* Spacer for bottom */}
      <div className="py-12 md:py-16"></div>
    </main>
  );
};

export default AgendamentoDinamico;
