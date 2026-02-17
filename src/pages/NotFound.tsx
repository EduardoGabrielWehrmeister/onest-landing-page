import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, MessageCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Italian Stripe */}
        <div className="italian-stripe mb-8 rounded-full" />

        {/* 404 Number */}
        <div className="mb-6">
          <span className="text-[120px] md:text-[180px] font-serif font-bold text-primary-foreground/20 leading-none select-none">
            404
          </span>
        </div>

        {/* Message */}
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Página Não Encontrada
        </h1>
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-md mx-auto">
          Ops! A página que você está procurando não existe ou foi movida.
          Vamos te ajudar a encontrar o caminho certo.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button variant="hero" size="lg" onClick={handleGoBack}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <Button variant="heroOutline" size="lg" asChild>
            <a href="/">
              <Home className="w-5 h-5 mr-2" />
              Página Inicial
            </a>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="text-primary-foreground/70 mb-4 text-sm">
            Links úteis:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/#servicos"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Serviços
            </a>
            <span className="text-primary-foreground/40">•</span>
            <a
              href="/#contato"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm flex items-center gap-1"
            >
              <MessageCircle className="w-4 h-4" />
              Contato
            </a>
            <span className="text-primary-foreground/40">•</span>
            <a
              href="/#faq"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm flex items-center gap-1"
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </a>
          </div>
        </div>

        {/* Bottom Italian Stripe */}
        <div className="italian-stripe mt-8 rounded-full" />
      </div>
    </div>
  );
};

export default NotFound;