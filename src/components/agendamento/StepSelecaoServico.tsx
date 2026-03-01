/**
 * Step: Seleção de Estado e Serviço
 * @description Primeiro passo para selecionar o estado e tipo de serviço
 */

import { useState, useEffect } from 'react';
import { MapPin, FileText, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { statesService, serviceTypesService } from '@/services/base.service';
import type { State, ServiceType } from '@/lib/supabase/types';

export interface StepSelecaoServicoProps {
  /** Estado selecionado (código UF) */
  selectedState: string | null;
  /** Callback quando estado muda */
  onStateChange: (stateCode: string | null) => void;
  /** Tipo de serviço selecionado (slug) */
  selectedService: string | null;
  /** Callback quando serviço muda */
  onServiceChange: (serviceSlug: string | null) => void;
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
  }, [fixedStateCode, onStateChange]);

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
  }, [fixedServiceSlug, onServiceChange]);

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

      {/* Cards de Informação */}
      {selectedState && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Estado Selecionado</h3>
                <p className="text-sm text-muted-foreground">
                  {states.find((s) => s.code === selectedState)?.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedService && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Serviço Selecionado</h3>
                <p className="text-sm text-muted-foreground">
                  {services.find((s) => s.slug === selectedService)?.name}
                </p>
                {services.find((s) => s.slug === selectedService)?.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {services.find((s) => s.slug === selectedService)?.description}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default StepSelecaoServico;
