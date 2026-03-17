/**
 * StepFormSelection Component
 *
 * Initial step where user selects State, Service Type, and User Type
 */

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, MapPin, FileText, User } from 'lucide-react';
import { useFormConfiguration } from '@/hooks/useFormConfiguration';
import type { State, ServiceType } from '@/lib/supabase/formTypes';

interface StepFormSelectionProps {
  onSelection: (params: {
    stateId: string;
    serviceTypeId: string;
    userType: 'cliente' | 'assessor';
    config: any;
  }) => void;
}

export const StepFormSelection = ({
  onSelection,
}: StepFormSelectionProps) => {
  const {
    getStates,
    getServiceTypes,
    getFormConfiguration,
    loading,
    error,
  } = useFormConfiguration();

  const [states, setStates] = useState<State[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedUserType, setSelectedUserType] = useState<
    'cliente' | 'assessor'
  >('cliente');

  // Load states and service types on mount
  useEffect(() => {
    const loadData = async () => {
      const [statesData, servicesData] = await Promise.all([
        getStates(),
        getServiceTypes(),
      ]);

      if (statesData) setStates(statesData);
      if (servicesData) setServiceTypes(servicesData);
    };

    loadData();
  }, []);

  // Handle continue button click
  const handleContinue = async () => {
    if (!selectedState || !selectedService || !selectedUserType) {
      return;
    }

    // Load form configuration
    const config = await getFormConfiguration({
      stateId: selectedState,
      serviceTypeId: selectedService,
      userType: selectedUserType,
    });

    if (config) {
      onSelection({
        stateId: selectedState,
        serviceTypeId: selectedService,
        userType: selectedUserType,
        config,
      });
    } else {
      alert('Não foi possível carregar a configuração do formulário.');
    }
  };

  const canContinue =
    !!selectedState && !!selectedService && !!selectedUserType && !loading;

  return (
    <Card className="card-elevated border-0 shadow-xl">
      <CardContent className="p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">
            Configure seu Formulário
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="font-medium">Erro ao carregar dados</p>
              <p className="text-sm">{error.message}</p>
            </div>
          )}

          {/* State Selection */}
          <div className="mb-6">
            <Label htmlFor="state" className="mb-2 block flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Estado
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={selectedState}
              onValueChange={setSelectedState}
              disabled={loading}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service Type Selection */}
          <div className="mb-6">
            <Label htmlFor="service" className="mb-2 block flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Tipo de Serviço
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={selectedService}
              onValueChange={setSelectedService}
              disabled={loading}
            >
              <SelectTrigger id="service">
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* User Type Selection */}
          <div className="mb-8">
            <Label className="mb-3 block flex items-center">
              <User className="h-4 w-4 mr-2" />
              Tipo de Usuário
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedUserType('cliente')}
                disabled={loading}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  selectedUserType === 'cliente'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <User className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-base">Cliente</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Estou solicitando para mim e minha família
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedUserType('assessor')}
                disabled={loading}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  selectedUserType === 'assessor'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <FileText className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-base">Assessor</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Estou solicitando em nome de um cliente
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              size="lg"
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                'Continuar'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
