import { Mail, Phone, Instagram, MessageCircle, Calendar, MapPin } from "lucide-react";
import { Button } from "./ui/button";

const Contact = () => {
  const contactLinks = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: "https://wa.me/5511999999999",
      description: "Atendimento rápido",
      highlight: true,
    },
    {
      icon: Mail,
      label: "E-mail",
      href: "mailto:contato@onestacidadania.com.br",
      description: "contato@onestacidadania.com.br",
    },
    {
      icon: Phone,
      label: "Telefone",
      href: "tel:+5511999999999",
      description: "+55 11 99999-9999",
    },
    {
      icon: Calendar,
      label: "Agendar Reunião",
      href: "#",
      description: "Consulta gratuita online",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://instagram.com/onestacidadania",
      description: "@onestacidadania",
    },
  ];

  return (
    <section id="contato" className="py-20 md:py-32 bg-background">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4">
              Contato
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Vamos Conversar?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Entre em contato conosco e dê o primeiro passo rumo à sua
              cidadania italiana. Estamos prontos para ajudar.
            </p>
          </div>

          {/* Contact Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactLinks.map((contact, index) => (
              <a
                key={index}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-4 p-6 rounded-xl border transition-all duration-300 ${
                  contact.highlight
                    ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 col-span-full sm:col-span-2 lg:col-span-1"
                    : "bg-card border-border hover:border-primary/30 card-elevated"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    contact.highlight
                      ? "bg-primary-foreground/20"
                      : "bg-primary/10 group-hover:bg-primary/20"
                  } transition-colors duration-300`}
                >
                  <contact.icon
                    className={`w-6 h-6 ${
                      contact.highlight ? "text-primary-foreground" : "text-primary"
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`font-semibold ${
                      contact.highlight ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {contact.label}
                  </p>
                  <p
                    className={`text-sm ${
                      contact.highlight
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {contact.description}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Location */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>São Paulo, SP - Atendimento em todo o Brasil</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
