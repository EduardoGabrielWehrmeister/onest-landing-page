import { CheckCircle2 } from "lucide-react";

const About = () => {
  const highlights = [
    "Equipe especializada com experiência comprovada",
    "Acompanhamento personalizado em cada etapa",
    "Transparência total no processo",
    "Suporte em português e italiano",
  ];

  return (
    <section id="sobre" className="py-20 md:py-32 bg-background">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4">
              Sobre Nós
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Sua Jornada para a{" "}
              <span className="text-primary">Itália</span> Começa Aqui
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              A <strong className="text-foreground">Onestà Cidadania Italiana</strong> nasceu da
              paixão pela cultura italiana e do desejo de conectar pessoas às
              suas raízes. Há mais de 15 anos, ajudamos famílias brasileiras a
              conquistar o reconhecimento da cidadania italiana.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Nossa missão é tornar esse processo acessível, transparente e
              seguro. Entendemos que cada família tem uma história única, e por
              isso oferecemos um atendimento personalizado, guiando você em cada
              passo dessa importante jornada.
            </p>

            {/* Highlights */}
            <ul className="space-y-4">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image/Visual */}
          <div className="order-1 lg:order-2 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 relative">
              {/* Decorative Elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-primary/20 blur-3xl" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="font-serif text-6xl md:text-8xl font-bold text-primary/30 mb-2">
                    🇮🇹
                  </div>
                  <p className="font-serif text-2xl md:text-3xl text-foreground italic">
                    "Onestà"
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Honestidade em italiano
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">+15 Anos</p>
                  <p className="text-sm text-muted-foreground">de Experiência</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
