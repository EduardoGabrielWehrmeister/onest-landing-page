import { ArrowRight, Compass, Handshake, HeartHandshake, Lightbulb } from "lucide-react";
import { Button } from "./ui/button";

const Consultancy = () => {
  const steps = [
    {
      icon: Compass,
      title: "Análise Inicial",
      description: "Avaliamos sua documentação e traçamos a melhor estratégia para seu caso.",
    },
    {
      icon: Lightbulb,
      title: "Planejamento",
      description: "Definimos o cronograma e os próximos passos de forma clara e objetiva.",
    },
    {
      icon: Handshake,
      title: "Execução",
      description: "Cuidamos de toda a burocracia enquanto você acompanha cada evolução.",
    },
    {
      icon: HeartHandshake,
      title: "Conquista",
      description: "Celebramos juntos a conquista da sua cidadania italiana.",
    },
  ];

  return (
    <section className="py-20 md:py-32 gradient-section">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4">
              Assessoria Personalizada
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Do Sonho à Realidade:{" "}
              <span className="text-primary">Estamos com Você</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Entendemos que o processo de cidadania pode parecer complexo.
              Por isso, oferecemos uma assessoria completa e personalizada,
              acompanhando você em cada etapa com dedicação e transparência.
            </p>
            <Button variant="cta" size="lg" asChild>
              <a href="#contato">
                Agendar Consulta Gratuita
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 bg-card rounded-xl border border-border hover:border-primary/20 transition-colors duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Consultancy;
