/**
 * Step: Seleção de Estado e Serviço
 * @description Primeiro passo para selecionar o estado e tipo de serviço
 */

import { useState, useEffect } from 'react';
import { MapPin, FileText, Loader2, User, Briefcase } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { statesService, serviceTypesService } from '@/services/base.service';
import type { State, ServiceType } from '@/lib/supabase/types';

export type UserType = 'cliente' | 'assessor';

export interface StepSelecaoServicoProps {
  /** Estado selecionado (código UF) */
  selectedState: string | null;
  /** Callback quando estado muda */
  onStateChange: (stateCode: string | null) => void;
  /** Tipo de serviço selecionado (slug) */
  selectedService: string | null;
  /** Callback quando serviço muda */
  onServiceChange: (serviceSlug: string | null) => void;
  /** Tipo de pessoa selecionado */
  userType?: UserType | null;
  /** Callback quando tipo de pessoa muda */
  onUserTypeChange?: (userType: UserType | null) => void;
  /** Se o formulário está em modo de edição (apenas um estado/serviço específico) */
  fixedStateCode?: string;
  fixedServiceSlug?: string;
}

/**
 * Componente de seleção de estado e tipo de serviço
 */
export function StepSelecaoServico({
  selectedState,
  onStateChange,
  selectedService,
  onServiceChange,
  userType,
  onUserTypeChange,
  fixedStateCode,
  fixedServiceSlug,
}: StepSelecaoServicoProps) {
  const [states, setStates] = useState<State[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [errorStates, setErrorStates] = useState<string | null>(null);
  const [errorServices, setErrorServices] = useState<string | null>(null);

  // Buscar estados
  useEffect(() => {
    async function fetchStates() {
      setLoadingStates(true);
      setErrorStates(null);

      const result = await statesService.getAll();

      if (result.error || !result.data) {
        setErrorStates('Erro ao carregar estados');
        console.error('Error loading states:', result.error);
      } else {
        setStates(result.data);

        // Se tiver estado fixo, selecionar automaticamente
        if (fixedStateCode) {
          const fixedState = result.data.find(s => s.code === fixedStateCode);
          if (fixedState) {
            onStateChange(fixedState.code);
          }
        }
      }

      setLoadingStates(false);
    }

    fetchStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedStateCode]);

  // Buscar tipos de serviço
  useEffect(() => {
    async function fetchServices() {
      setLoadingServices(true);
      setErrorServices(null);

      const result = await serviceTypesService.getAll();

      if (result.error || !result.data) {
        setErrorServices('Erro ao carregar serviços');
        console.error('Error loading services:', result.error);
      } else {
        setServices(result.data);

        // Se tiver serviço fixo, selecionar automaticamente
        if (fixedServiceSlug) {
          const fixedService = result.data.find(s => s.slug === fixedServiceSlug);
          if (fixedService) {
            onServiceChange(fixedService.slug);
          }
        }
      }

      setLoadingServices(false);
    }

    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedServiceSlug]);

  // Se tem estado e serviço fixos, mostrar mensagem em vez de seleção
  const isFixed = fixedStateCode && fixedServiceSlug;
  const fixedState = states.find(s => s.code === fixedStateCode);
  const fixedService = services.find(s => s.slug === fixedServiceSlug);

  if (isFixed && fixedState && fixedService) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            {fixedService.name}
          </h2>
          <p className="text-muted-foreground">
            Estado: {fixedState.name}
          </p>
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Estado Selecionado</h3>
                <p className="text-sm text-muted-foreground">{fixedState.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <FileText className="h-6 w-6 text-primary mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Serviço Selecionado</h3>
                <p className="text-sm text-muted-foreground">{fixedService.name}</p>
                {fixedService.description && (
                  <p className="text-xs text-muted-foreground mt-2">{fixedService.description}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          Selecione o Estado e Serviço
        </h2>
        <p className="text-muted-foreground">
          Informe sua localização e o tipo de serviço desejado
        </p>
      </div>

      {/* Seleção de Estado */}
      <div className="space-y-2">
        <Label htmlFor="state-select" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Estado (UF)
        </Label>
        {loadingStates ? (
          <div className="flex items-center justify-center p-4 border rounded-md">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Carregando estados...</span>
          </div>
        ) : errorStates ? (
          <div className="p-4 border border-destructive rounded-md text-destructive text-sm">
            {errorStates}
          </div>
        ) : (
          <Select
            value={selectedState || ''}
            onValueChange={(value) => onStateChange(value || null)}
            disabled={!!fixedStateCode}
          >
            <SelectTrigger id="state-select">
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.id} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Seleção de Tipo de Serviço */}
      <div className="space-y-2">
        <Label htmlFor="service-select" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Tipo de Serviço
        </Label>
        {loadingServices ? (
          <div className="flex items-center justify-center p-4 border rounded-md">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Carregando serviços...</span>
          </div>
        ) : errorServices ? (
          <div className="p-4 border border-destructive rounded-md text-destructive text-sm">
            {errorServices}
          </div>
        ) : (
          <Select
            value={selectedService || ''}
            onValueChange={(value) => onServiceChange(value || null)}
            disabled={!!fixedServiceSlug}
          >
            <SelectTrigger id="service-select">
              <SelectValue placeholder="Selecione o tipo de serviço" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.slug}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Seleção de Tipo de Pessoa */}
      {onUserTypeChange && (
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Tipo de Pessoa
          </Label>
          <RadioGroup
            value={userType || ''}
            onValueChange={(value) => onUserTypeChange(value as UserType | null)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Opção Cliente */}
            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                userType === 'cliente'
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onUserTypeChange('cliente')}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="cliente" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Cliente</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Estou agendando para mim mesmo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opção Assessor */}
            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                userType === 'assessor'
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onUserTypeChange('assessor')}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="assessor" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Assessor</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sou um assessor/agência de turismo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        </div>
      )}
    </div>
  );
}

export default StepSelecaoServico;
