import { CheckCircle2 } from "lucide-react";

import { getExperienceYears } from "@/lib/utils";
import logoFull from "@/assets/logo.jpeg";
import logoSemFundo from "@/assets/logo-sem-fundo.png";

const About = () => {
  const experienceYears = getExperienceYears();
  const isPlural = experienceYears > 1;
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
              Sua Jornada para a <span className="text-primary">Itália</span>{" "}
              Começa Aqui
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Fundada em 2024 por descendentes de italianos, nossa empresa
              nasceu da experiência real: conhecemos na prática cada dificuldade
              e a extensa burocracia que os requerentes enfrentam. Criamos a
              Onestà exatamente para mudar essa realidade, tornando o
              reconhecimento da cidadania um processo mais simples, transparente
              e acessível do início ao fim.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Atuamos de forma totalmente online, o que nos permite oferecer um
              atendimento ágil e eficiente para clientes em qualquer lugar do
              mundo. Essa estrutura digital garante que você tenha suporte
              especializado e acompanhamento constante, sem as barreiras da
              distância.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Nosso compromisso é com a clareza e a segurança jurídica.
              Acreditamos que a busca pelas suas raízes deve ser uma jornada de
              realização, e não de estresse. Por isso, cuidamos de toda a
              complexidade documental e burocrática para que você conquiste seu
              passaporte italiano com o máximo de agilidade e confiança.
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
                <div className="text-center p-6 md:p-8 space-y-4">
                  <picture className="block">
                    <source srcSet={logoSemFundo} type="image/png" />
                    <img
                      src={logoFull}
                      alt="Logo Onestà Cidadania Italiana - Assessoria especializada em cidadania italiana com mais de 15 anos de experiência atendendo famílias em todo o Brasil"
                      className="mx-auto max-w-[200px] md:max-w-xs w-full drop-shadow-xl"
                      loading="lazy"
                      decoding="async"
                      width="200"
                      height="200"
                    />
                  </picture>
                  <div>
                    <p className="font-serif text-2xl md:text-3xl text-foreground italic">
                      "Onestà"
                    </p>
                    <p className="text-muted-foreground">
                      Honestidade em italiano
                    </p>
                  </div>
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
