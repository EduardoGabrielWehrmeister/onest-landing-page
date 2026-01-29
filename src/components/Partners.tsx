import { ArrowRight, Handshake } from "lucide-react";

import { Button } from "./ui/button";

const Partners = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden gradient-section">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            {/* Eyebrow */}
            <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4">
              PARCERIAS
            </span>

            {/* Title */}
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-foreground">
              Você é assessor? Podemos te ajudar com o <span className="text-primary">Prenotami</span>!!!
            </h2>

            {/* Description */}
            <div className="space-y-4 text-lg text-muted-foreground mb-8">
              <p>
                Se você sofre para realizar os agendamentos necessários para seus clientes no portal Prenotami, nós podemos te ajudar!
              </p>
              <p>
                Possuímos nosso próprio sistema para monitoramento e agendamento dos diversos serviços dos consulados italianos pelo mundo todo.
              </p>
              <p>
                Somos parceiros de grandes assessorias do mercado e podemos te ajudar também a alavancar seu negócio.
              </p>
            </div>

            {/* CTA */}
            <Button variant="cta" size="xl" asChild>
              <a href="#contato">
                Entrar em Contato
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>

          {/* Visual Element */}
          <div className="flex justify-center items-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-primary/10 flex items-center justify-center">
                <Handshake className="w-32 h-32 md:w-40 md:h-40 text-primary" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-accent/10" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-accent/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
