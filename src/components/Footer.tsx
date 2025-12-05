const Footer = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="text-center md:text-left">
            <span className="font-serif text-xl font-semibold text-background">
              Onestà
            </span>
            <span className="text-background/60 text-sm ml-2">
              Cidadania Italiana
            </span>
          </div>

          {/* Copyright */}
          <p className="text-background/60 text-sm">
            © {new Date().getFullYear()} Onestà Cidadania Italiana. Todos os
            direitos reservados.
          </p>
        </div>
      </div>

      {/* Italian Stripe */}
      <div className="italian-stripe mt-8" />
    </footer>
  );
};

export default Footer;
