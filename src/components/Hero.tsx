import { ArrowRight, Shield, Award, Users } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_hsl(40_30%_97%_/_0.1)_0%,_transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_hsl(40_30%_97%_/_0.1)_0%,_transparent_50%)]" />
      </div>

      <div className="section-container relative z-10 pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8 animate-fade-up opacity-0">
            <Shield className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">
              Especialistas em Cidadania Italiana
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up opacity-0 delay-100">
            Realize o Sonho da{" "}
            <span className="italic">Cidadania Italiana</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up opacity-0 delay-200">
            A Onestà oferece assessoria completa e personalizada para você
            conquistar sua cidadania italiana com segurança e tranquilidade.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up opacity-0 delay-300">
            <Button variant="hero" size="xl" asChild>
              <a href="#contato">
                Iniciar Minha Jornada
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#servicos">Conhecer Serviços</a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 animate-fade-up opacity-0 delay-400">
            <div className="flex items-center justify-center gap-3 text-primary-foreground/90">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">+15 Anos de Experiência</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-primary-foreground/90">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">+2.000 Famílias Atendidas</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-primary-foreground/90">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Processo 100% Seguro</span>
            </div>
          </div>
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
            fill="hsl(40, 30%, 97%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
