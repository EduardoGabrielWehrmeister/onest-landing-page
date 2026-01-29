import { AtSign, File, FileText, Globe, Languages, MapPin } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: File,
      title: "Cidadania Italiana",
      description:
        "Assessoria completa para o reconhecimento da sua cidadania por via Judicial ou Consular, cuidando de toda a estratégia técnica e jurídica do processo.",
    },
    {
      icon: AtSign,
      title: "Agendamentos Prenot@mi",
      description:
        "Consultoria técnica para agendamento de serviços consulares, como emissão de Passaporte e reconhecimento de Cidadania, através do portal Prenot@mi para consulados de todo o mundo.",
    },
    {
      icon: Globe,
      title: "Passaporte Italiano",
      description:
        "Auxílio completo no processo de obtenção do passaporte italiano, desde a análise documental até o agendamento no consulado.",
    },
    {
      icon: FileText,
      title: "Documentos",
      description:
        "Orientação especializada na organização, localização e retificação de todos os documentos necessários para o processo.",
    },
    {
      icon: Languages,
      title: "Traduções",
      description:
        "Serviço de tradução juramentada de documentos brasileiros e italianos, realizadas por tradutores certificados.",
    },
    {
      icon: MapPin,
      title: "AIRE",
      description:
        "Registro no AIRE (Anagrafe degli Italiani Residenti all'Estero) para cidadãos italianos residentes fora da Itália.",
    },
  ];

  return (
    <section id="servicos" className="py-20 md:py-32 bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            Nossos Serviços
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Soluções Completas para Sua Cidadania
          </h2>
          <p className="text-lg text-muted-foreground">
            Oferecemos um conjunto completo de serviços para facilitar cada
            etapa do seu processo de cidadania italiana.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <service.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
