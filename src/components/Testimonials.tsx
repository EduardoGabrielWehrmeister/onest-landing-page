import { LocateIcon, Quote } from "lucide-react";
import dopoimento01 from "../assets/testimonials/Dopoimento01.jpg";
import dopoimento02 from "../assets/testimonials/Dopoimento02.jpg";
import dopoimento03 from "../assets/testimonials/Dopoimento03.jpg";
import dopoimento04 from "../assets/testimonials/Dopoimento04.jpg";
import dopoimento05 from "../assets/testimonials/Dopoimento05.jpg";
import dopoimento06 from "../assets/testimonials/Dopoimento06.jpg";
import dopoimento07 from "../assets/testimonials/Dopoimento07.jpg";
import dopoimento08 from "../assets/testimonials/Dopoimento08.jpg";
import dopoimento09 from "../assets/testimonials/Dopoimento09.jpg";
import dopoimento10 from "../assets/testimonials/Dopoimento10.jpg";
import dopoimento11 from "../assets/testimonials/Dopoimento11.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ana Carolina Bertolini",
      location: "Curitiba, PR",
      text: "O acompanhamento personalizado fez toda a diferença. Sempre me senti segura e bem informada sobre cada etapa do processo. Minha família toda já é cidadã italiana!",
      image: dopoimento03,
    },

    {
      name: "Lucas Ferreira",
      location: "Belo Horizonte, MG",
      text: "Excelente trabalho! A equipe foi super atenciosa e resolveu tudo rapidamente. Finalmente consegui meu passaporte italiano com a ajuda da Onestà.",
      image: dopoimento11,
    },
    {
      name: "Juliana Santos",
      location: "Salvador, BA",
      text: "Profissionais incríveis! Me guiaram por todo o processo de cidadania italiana com muita dedicação. Só tenho gratidão pela equipe da Onestà.",
      image: dopoimento05,
    },
    {
      name: "Fernando Oliveira",
      location: "Brasília, DF",
      text: "A melhor decisão que tomei foi contratar a Onestà. Todo o processo foi simplificado e explicado detalhadamente. Superou todas as minhas expectativas!",
      image: dopoimento09,
    },
    {
      name: "Roberto Mancini",
      location: "Rio de Janeiro, RJ",
      text: "Depois de anos tentando sozinho, a equipe da Onestà conseguiu resolver todas as pendências em poucos meses. Profissionalismo impecável do início ao fim.",
      image: dopoimento02,
    },
    {
      name: "Patrícia Costa",
      location: "Porto Alegre, RS",
      text: "Impressionante a competência da equipe! Em poucos meses conquistei minha cidadania italiana. Agradeço a toda a equipe pelo excelente trabalho.",
      image: dopoimento10,
    },
    {
      name: "Ricardo Almeida",
      location: "Fortaleza, CE",
      text: "A Onestà transformou um processo complicado em algo simples e rápido. Recomendo para todos que buscam a cidadania italiana. Nota 10!",
      image: dopoimento08,
    },
    {
      name: "Maria Fernanda Silva",
      location: "São Paulo, SP",
      text: "A Onestà foi fundamental na conquista da minha cidadania italiana. O processo foi conduzido com extrema competência e transparência. Recomendo de olhos fechados!",
      image: dopoimento01,
    },
  ];

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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <a
              href="https://www.instagram.com/onesta.cidadania/"
              target="_blank"
            >
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden group card-elevated cursor-pointer"
              >
                {/* Background Image */}
                <img
                  src={testimonial.image}
                  alt={`Foto de ${testimonial.name}`}
                  className="w-full h-100 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Dark Overlay on Bottom Half */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/10 to-transparent p-6 flex flex-col justify-end">
                  {/* Testimonial Text */}
                  {/* <p className="text-black text-sm leading-relaxed mb-4 line-clamp-4">
                  "{testimonial.text}"
                </p> */}

                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-base">
                        {testimonial.name}
                      </p>
                      <p className="text-white/70 text-sm">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
