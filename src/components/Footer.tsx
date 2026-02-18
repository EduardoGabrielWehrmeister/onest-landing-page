import { Mail, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);

  const EMAIL_ADDRESS = "contato@onestacidadania.com.br";
  const EMAIL_SUBJECT = "Quero falar sobre cidadania italiana";
  const EMAIL_BODY = `Olá, equipe Onestà Cidadania,

Gostaria de conversar sobre o processo de cidadania italiana e entender as opções de assessoria disponíveis.

Obrigado(a) e aguardo o retorno.`;
  const EMAIL_MAILTO = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;

  const WHATSAPP_MESSAGE =
    "Olá, equipe Onestà Cidadania! \n\nGostaria de saber mais sobre o processo de cidadania italiana e entender os próximos passos.";
  const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=5511916807522&text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  // Detectar se é dispositivo mobile
  const checkIsMobile = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  };

  // Copiar email para o clipboard (desktop)
  const copyEmailToClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL_ADDRESS);
        toast({
          title: "E-mail copiado!",
          description: EMAIL_ADDRESS,
        });
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
        if (successful) {
          toast({
            title: "E-mail copiado!",
            description: EMAIL_ADDRESS,
          });
        }
        return successful;
      } catch (fallbackError) {
        console.error("Erro ao copiar com o fallback", fallbackError);
      }
    }

    return false;
  };

  // Handle do clique no email
  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (checkIsMobile()) {
      // Mobile: abre email normalmente
      return;
    }
    // Desktop: copia email
    e.preventDefault();
    copyEmailToClipboard();
  };

  // Atualizar estado mobile ao redimensionar
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(checkIsMobile());

      const handleResize = () => {
        setIsMobile(checkIsMobile());
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <footer className="bg-foreground py-12">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="text-center md:text-left">
            <span className="font-serif text-xl font-semibold text-background">
              Onestà
            </span>
            <span className="text-background/60 text-sm ml-2">
              Cidadania Italiana
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 md:gap-6">
            <a
              href="https://www.instagram.com/onesta.cidadania"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Onestà Cidadania Italiana"
              className="text-background/60 hover:text-background transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/onesta.cidadania"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook da Onestà Cidadania Italiana"
              className="text-background/60 hover:text-background transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp da Onestà Cidadania Italiana"
              className="text-background/60 hover:text-background transition-colors duration-200"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
            <a
              href={EMAIL_MAILTO}
              onClick={handleEmailClick}
              aria-label="Email da Onestà Cidadania Italiana"
              className="text-background/60 hover:text-background transition-colors duration-200"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-background/60 text-sm">
              © {new Date().getFullYear()} Onestà Cidadania Italiana. Todos os
              direitos reservados.
            </p>
            <p className="text-background/40 text-xs mt-1">
              CNPJ: 65.044.487/0001-50 • Ribeirão Preto, SP
            </p>
          </div>
        </div>
      </div>

      {/* Italian Stripe */}
      <div className="italian-stripe mt-8" />
    </footer>
  );
};

export default Footer;
