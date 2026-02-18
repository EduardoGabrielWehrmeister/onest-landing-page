import flaviaCosta from "../assets/images/testimonials/depoimento-onesta-cidadania-italiana-flavia-costa.jpg";
import jaquelineMenin from "../assets/images/testimonials/depoimento-onesta-cidadania-italiana-jaqueline-menin.jpg";
import lucasLopesMoreira from "../assets/images/testimonials/depoimento-onesta-cidadania-italiana-lucas-lopes-moreira.jpg";
import roLoren from "../assets/images/testimonials/depoimento-onesta-cidadania-italiana-ro-loren.jpg";
import denerRamos from "../assets/images/testimonials/depoimento-onesta-cidadania-italiana-dener-ramos.jpg";
import mariaCristinaSimeone from "../assets/images/testimonials/depoimento-onesta-cidadania-italiana-maria-cristina-simeone.jpg";
import ivoneSantos from "../assets/images/testimonials/depoimento-onesta-cidadania-italiana-ivone-santos.jpg";
import gabuPaulini from "../assets/images/testimonials/depoimento-onesta-cidadania-italiana-gabu-paulini.jpg";
import familiaPaulini from "../assets/images/testimonials/depoimento-onesta-cidadania-italiana-familia-paulini.jpg";
import wiltonDaSilva from "../assets/images/testimonials/depoimento-onesta-cidadania-italiana-wilton-da-silva.jpg";
import anaMaura from "../assets/images/testimonials/depoimento-onesta-cidadania-italiana-ana-maura.jpg";
import heitorMarucci from "../assets/images/testimonials/depoimento-onesta-cidadania-italiana-heitor-marucci.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Flávia Costa",
      location: "",
      image: flaviaCosta,
    },
    {
      name: "Jaqueline Menin",
      location: "",
      image: jaquelineMenin,
    },
    {
      name: "Lucas Lopes Moreira",
      location: "",
      image: lucasLopesMoreira,
    },
    {
      name: "Roberta Lorençatto",
      location: "",
      image: roLoren,
    },
    {
      name: "Dener Ramos",
      location: "",
      image: denerRamos,
    },
    {
      name: "Maria Cristina Simeone",
      location: "",
      image: mariaCristinaSimeone,
    },
    {
      name: "Ivone Santos",
      location: "",
      image: ivoneSantos,
    },
    {
      name: "Gabu Paulini",
      location: "",
      image: gabuPaulini,
    },
    {
      name: "Família Paulini",
      location: "",
      image: familiaPaulini,
    },
    {
      name: "Wilton Da Silva Moretto",
      location: "",
      image: wiltonDaSilva,
    },

    {
      name: "Ana Maura Perles",
      location: "",
      image: anaMaura,
    },

    {
      name: "Heitor Marucci",
      location: "",
      image: heitorMarucci,
    },
  ];

  return (
    <section id="clientes" className="py-20 md:py-32 gradient-section">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            Clientes
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            O Sorriso da Conquista
          </h2>
          <p className="text-lg text-muted-foreground">
            Nada nos orgulha mais do que ver o passaporte nas mãos de quem
            ajudamos. Aqui estão alguns dos nossos clientes:
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <a
              href="https://www.instagram.com/stories/highlights/18069216859631647/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden group card-elevated cursor-pointer"
              >
                {/* Background Image */}
                <img
                  src={testimonial.image}
                  alt={`Foto de ${testimonial.name} com passaporte italiano após conquistar a cidadania com a Onestà`}
                  className="w-full h-100 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Dark Overlay on Bottom Half */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/10 to-transparent p-6 flex flex-col justify-end">
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
