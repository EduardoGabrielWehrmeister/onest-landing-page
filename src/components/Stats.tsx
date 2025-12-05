import { useEffect, useState, useRef } from "react";

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
    <div ref={ref} className="text-center">
      <div className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-2">
        {count.toLocaleString("pt-BR")}
        {suffix}
      </div>
      <p className="text-primary-foreground/80 text-lg">{label}</p>
    </div>
  );
};

const Stats = () => {
  const stats = [
    { value: 2500, suffix: "+", label: "Famílias Atendidas" },
    { value: 15000, suffix: "+", label: "Documentos Processados" },
    { value: 15, suffix: "+", label: "Anos de Experiência" },
    { value: 98, suffix: "%", label: "Taxa de Aprovação" },
  ];

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
