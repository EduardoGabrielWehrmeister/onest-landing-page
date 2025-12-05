import { Quote, Star } from "lucide-react";
import { useState } from "react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria Fernanda Silva",
      location: "São Paulo, SP",
      text: "A Onestà foi fundamental na conquista da minha cidadania italiana. O processo foi conduzido com extrema competência e transparência. Recomendo de olhos fechados!",
      rating: 5,
    },
    {
      name: "Roberto Mancini",
      location: "Rio de Janeiro, RJ",
      text: "Depois de anos tentando sozinho, a equipe da Onestà conseguiu resolver todas as pendências em poucos meses. Profissionalismo impecável do início ao fim.",
      rating: 5,
    },
    {
      name: "Ana Carolina Bertolini",
      location: "Curitiba, PR",
      text: "O acompanhamento personalizado fez toda a diferença. Sempre me senti segura e bem informada sobre cada etapa do processo. Minha família toda já é cidadã italiana!",
      rating: 5,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="depoimentos" className="py-20 md:py-32 bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            Depoimentos
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Histórias de Sucesso
          </h2>
          <p className="text-lg text-muted-foreground">
            Conheça as experiências de quem já conquistou a cidadania italiana
            com a Onestà.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 card-elevated border border-border relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-12 h-12 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-gold text-gold"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-8 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-serif text-lg font-semibold text-primary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
