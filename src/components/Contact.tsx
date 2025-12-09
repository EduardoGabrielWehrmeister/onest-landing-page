import type { ComponentType, SVGProps } from "react";
import { Mail, Instagram, MessageCircle, MapPin, Facebook } from "lucide-react";

type ContactLink = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
  description: string;
  forceWrap?: boolean;
};

const contactLinks: ContactLink[] = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "https://api.whatsapp.com/send?phone=5511916807522",
    description: "Fale direto pelo WhatsApp",
  },
  {
    icon: Mail,
    label: "E-mail",
    href: "mailto:contato@onestacidadania.com.br",
    description: "contato@onestacidadania.com.br",
    forceWrap: true,
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/onesta.cidadania",
    description: "@onesta.cidadania",
  },
  {
    icon: Facebook,
    label: "Facebook",
    href: "https://www.facebook.com/onesta.cidadania",
    description: "/onesta.cidadania",
  },
];

const Contact = () => {
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
          <div className="grid gap-4 sm:grid-cols-2">
            {contactLinks.map((contact, index) => (
              <a
                key={index}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full items-start gap-4 rounded-2xl border border-border/60 bg-card/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/15">
                  <contact.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-foreground">
                    {contact.label}
                  </p>
                  <p
                    className={`text-sm text-muted-foreground ${contact.forceWrap ? "break-all" : ""}`}
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
