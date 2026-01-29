import type { ComponentType, SVGProps, MouseEvent } from "react";
import { Mail, Instagram, MessageCircle, MapPin, Facebook } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type ContactLink = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
  description: string;
  forceWrap?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  newTab?: boolean;
};

const EMAIL_ADDRESS = "contato@onestacidadania.com.br";
const EMAIL_SUBJECT = "Quero falar sobre cidadania italiana";
const EMAIL_BODY = `Olá, equipe Onestà Cidadania,

Gostaria de conversar sobre o processo de cidadania italiana e entender as opções de assessoria disponíveis.

Obrigado(a) e aguardo o retorno.`;
const EMAIL_MAILTO = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;

const WHATSAPP_MESSAGE =
  "Olá, equipe Onestà Cidadania! Gostaria de saber mais sobre o processo de cidadania italiana e entender os próximos passos.";
const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=5511916807522&text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const copyEmailToClipboard = async () => {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      return true;
    }
  } catch (error) {
    console.error("Erro ao copiar com a API do Clipboard", error);
  }

  if (typeof document !== "undefined") {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = EMAIL_ADDRESS;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      return successful;
    } catch (fallbackError) {
      console.error("Erro ao copiar com o fallback", fallbackError);
    }
  }

  return false;
};

const Contact = () => {
  const handleEmailClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const copied = await copyEmailToClipboard();
    toast({
      title: copied ? "E-mail copiado!" : "Copie o e-mail manualmente",
      description: copied
        ? "E-mail copiado com sucesso!"
        : `Não foi possível copiar automaticamente, mas o e-mail é ${EMAIL_ADDRESS}.`,
    });

    if (typeof window !== "undefined") {
      window.location.href = EMAIL_MAILTO;
    }
  };

  const contactLinks: ContactLink[] = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: WHATSAPP_URL,
      description: "Fale direto pelo WhatsApp",
    },
    {
      icon: Mail,
      label: "E-mail",
      href: EMAIL_MAILTO,
      description: EMAIL_ADDRESS,
      forceWrap: true,
      onClick: handleEmailClick,
      newTab: false,
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

  return (
    <section id="contato" className="py-20 md:py-28 gradient-hero relative overflow-hidden">
      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-primary-foreground/70 uppercase tracking-wider mb-4">
              Contato
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Vamos Conversar?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
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
                target={contact.newTab === false ? undefined : "_blank"}
                rel={contact.newTab === false ? undefined : "noopener noreferrer"}
                onClick={contact.onClick}
                className="group flex h-full items-start gap-4 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-foreground/15"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground transition-colors duration-300 group-hover:bg-primary-foreground/30">
                  <contact.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-primary-foreground">
                    {contact.label}
                  </p>
                  <p
                    className={`text-sm text-primary-foreground/80 ${contact.forceWrap ? "break-all" : ""}`}
                  >
                    {contact.description}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Location */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-primary-foreground/80">
              <span>Ribeirão Preto, SP - Atendimento em todo o Brasil e em todo o mundo!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
