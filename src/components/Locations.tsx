import { MapPin, Phone, Mail } from "lucide-react";

const Locations = () => {
  const locations = [
    {
      city: "São Paulo, SP",
      consulado: "Consulado Geral da Itália em São Paulo",
      description:
        "Atendemos processos para o consulado de São Paulo, que abrange a capital e região. Especialistas em documentação para habitantes de São Paulo.",
    },
    {
      city: "Rio de Janeiro, RJ",
      consulado: "Consulado Geral da Itália no Rio de Janeiro",
      description:
        "Especialistas em processos para o consulado carioca, incluindo documentação de estados vizinhos. Cidadania italiana para clientes do Rio de Janeiro.",
    },
    {
      city: "Belo Horizonte, MG",
      consulado: "Consulado da Itália em Belo Horizonte",
      description:
        "Assessoria completa para mineiros buscando cidadania italiana via consulado de BH. Atendimento especializado para descendentes de italianos em Minas Gerais.",
    },
    {
      city: "Curitiba, PR",
      consulado: "Consulado da Itália em Curitiba",
      description:
        "Atendimento especializado para paranenses e descendentes de italianos do sul do Brasil. Processos de cidadania italiana para Curitiba e região.",
    },
    {
      city: "Porto Alegre, RS",
      consulado: "Consulado da Itália em Porto Alegre",
      description:
        "Expertise em processos para gaúchos com ascendência italiana, especialmente região do Vêneto. Cidadania italiana para Rio Grande do Sul.",
    },
    {
      city: "Brasília, DF",
      consulado: "Embaixada da Itália",
      description:
        "Processos via Embaixada para residentes no Distrito Federal e região Centro-Oeste. Cidadania italiana para brasilienses.",
    },
    {
      city: "Recife, PE",
      consulado: "Consulado da Itália em Recife",
      description:
        "Assessoria para nordestinos descendentes de italianos via consulado pernambucano. Atendemos clientes de Pernambuco e região.",
    },
  ];

  return (
    <section id="atendimento" className="py-20 md:py-32 bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            Onde Atendemos
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Cidadania Italiana em{" "}
            <span className="text-primary">Todo o Brasil</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Atuamos em todos os consulados italianos no Brasil e via judicial para
            todo o território nacional
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {locations.map((location, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {location.city}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {location.consulado}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {location.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* National Coverage Banner */}
        <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center border border-primary/20">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
            Atendimento Nacional e Internacional
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Além de todo o Brasil, atendemos brasileiros residentes no exterior que
            buscam reconhecer sua cidadania italiana. Nossa equipe é especializada
            em processos internacionais e via judicial.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>(11) 9168-07522</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>contato@onestacidadania.com.br</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Locations;
