import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Quanto tempo demora o processo de cidadania italiana?",
      answer:
        "O tempo varia conforme o tipo de processo. Via consulado, pode levar de 2 a 5 anos. Via judicial, geralmente entre 12 a 24 meses. Nossa equipe analisa seu caso e define a melhor estratégia.",
    },
    {
      question: "Quais documentos necessários para cidadania italiana?",
      answer:
        "Os documentos básicos incluem: certidões de nascimento, casamento e óbito da linha italiana, além de documentos de identidade. Comprovamos a documentação completa e orientamos sobre eventuais retificações.",
    },
    {
      question: "Vocês atendem quais cidades do Brasil?",
      answer:
        "Atendemos todo o Brasil e brasileiros residentes no exterior. Nossa equipe é especializada em processos em todos os consulados italianos no Brasil e na via judicial.",
    },
    {
      question: "Qual o valor da assessoria para cidadania italiana?",
      answer:
        "O valor varia conforme o tipo de processo (consular ou judicial) e a complexidade da documentação. Oferecemos consulta gratuita para análise do seu caso e orçamento personalizado.",
    },
    {
      question: "Preciso ir à Itália para conseguir a cidadania?",
      answer:
        "Não é obrigatório ir à Itália. A cidadania pode ser reconhecida via consulado italiano no Brasil ou através de ação judicial no Brasil, sem necessidade de viagem.",
    },
    {
      question: "O que é AIRE e por que preciso me registrar?",
      answer:
        "AIRE (Anagrafe degli Italiani Residenti all'Estero) é o registro de cidadãos italianos residentes fora da Itália. É obrigatório para cidadãos italianos e necessário para acessar serviços consulares e benefícios na Itália.",
    },
    {
      question: "Vocês fazem traduções de documentos?",
      answer:
        "Sim, oferecemos serviço completo de tradução juramentada de documentos brasileiros para italiano e vice-versa, realizado por tradutores certificados e reconhecidos pelo consulado.",
    },
    {
      question: "Como agendar o Prenotami (consulado)?",
      answer:
        "O Prenotami é o sistema de agendamento online do consulado italiano. Nossa equipe auxilia em todo o processo de agendamento, preenchimento e preparação da documentação necessária.",
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-32 bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            Perguntas Frequentes
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Dúvidas sobre{" "}
            <span className="text-primary">Cidadania Italiana</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tire suas dúvidas sobre o processo de reconhecimento da cidadania
            italiana
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:text-primary transition-colors">
                  <span className="text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#contato"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            Ainda tem dúvidas? Fale com um especialista →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
