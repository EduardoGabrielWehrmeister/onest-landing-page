import dopoimento01 from "../assets/testimonials/Dopoimento01.jpg";
import dopoimento02 from "../assets/testimonials/Dopoimento02.jpg";
import dopoimento03 from "../assets/testimonials/Dopoimento03.jpg";
import dopoimento05 from "../assets/testimonials/Dopoimento05.jpg";
import dopoimento08 from "../assets/testimonials/Dopoimento08.jpg";
import dopoimento09 from "../assets/testimonials/Dopoimento09.jpg";
import dopoimento10 from "../assets/testimonials/Dopoimento10.jpg";
import dopoimento11 from "../assets/testimonials/Dopoimento11.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Flávia Costa",
      location: "",
      image: dopoimento03,
    },
    {
      name: "Jaqueline Menin",
      location: "",
      image: dopoimento11,
    },
    {
      name: "Lucas Lopes Moreira",
      location: "",
      image: dopoimento05,
    },
    {
      name: "Ro Loren",
      location: "",
      image: dopoimento09,
    },
    {
      name: "Dener Ramos",
      location: "",
      image: dopoimento02,
    },
    {
      name: "Maria Cristina Simeone",
      location: "",
      image: dopoimento10,
    },
    {
      name: "Ivone Santos",
      location: "",
      image: dopoimento08,
    },
    {
      name: "Gabu Paulini",
      location: "",
      image: dopoimento01,
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
                  alt={`Foto de ${testimonial.name}`}
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
