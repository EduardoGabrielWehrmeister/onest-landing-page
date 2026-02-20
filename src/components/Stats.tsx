import { useEffect, useState, useRef } from "react";

import { getExperienceYears } from "@/lib/utils";
import { useTotalAccumulated, usePrenotamiAccumulated } from "@/hooks/use-supabase";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
}

const StatItem = ({ value, suffix = "", label }: StatProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="text-center min-w-0">
      <div className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-1 sm:mb-2">
        {count.toLocaleString("pt-BR")}
        {suffix}
      </div>
      <p className="text-primary-foreground/80 text-sm sm:text-base md:text-lg">{label}</p>
    </div>
  );
};

const Stats = () => {
  const experienceYears = getExperienceYears();
  const experienceLabel = experienceYears > 1 ? "Anos" : "Ano";

  // Buscar dados do Supabase
  const { data: totalClientes, loading: loadingTotal, error: errorTotal } = useTotalAccumulated();
  const { data: totalPrenotami, loading: loadingPrenotami, error: errorPrenotami } = usePrenotamiAccumulated();

  // Verificar se há erro em alguma das chamadas
  const hasError = errorTotal || errorPrenotami;
  const isLoading = loadingTotal || loadingPrenotami;

  // Garantir que os valores são números, usar valores padrão se houver erro ou não houver dados
  const clientesValue = (typeof totalClientes === 'number' ? totalClientes : 9999);
  const prenotamiValue = (typeof totalPrenotami === 'number' ? totalPrenotami : 999);

  const stats = [
    { 
      value: prenotamiValue, 
      suffix: "+", 
      label: "Agendamentos no Prenotami" 
    },
    {
      value: experienceYears,
      suffix: "+",
      label: `${experienceLabel} de Experiência`,
    },
    { 
      value: clientesValue, 
      suffix: "+", 
      label: "Clientes Atendidos" 
    }  ];

  return (
    <section id="numeros" className="py-20 md:py-28 gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary-foreground" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary-foreground" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary-foreground" />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-primary-foreground/70 uppercase tracking-wider mb-4">
            Nossos Números
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
            Resultados que Falam por Si
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mt-4 text-center text-primary-foreground/70 text-sm">
            Atualizando estatísticas...
          </div>
        )}

        {/* Error Indicator */}
        {hasError && !isLoading && (
          <div className="mt-4 text-center text-yellow-300/90 text-sm">
            ⚠️ Algumas estatísticas podem estar desatualizadas
          </div>
        )}
      </div>
    </section>
  );
};

export default Stats;