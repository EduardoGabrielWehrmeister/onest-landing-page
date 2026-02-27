import type { FormData } from "@/hooks/useLocalStorageForm";
import { User, Briefcase, Users, MapPin, FileText, FileCheck, Clipboard } from "lucide-react";

interface SectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

const Section = ({ title, icon: Icon, children }: SectionProps) => (
  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border">
      <Icon className="h-4 w-4 text-primary" />
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{title}</h3>
    </div>
    <div className="p-4 space-y-2">{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4 py-1">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm text-foreground font-medium text-right">{value || "—"}</span>
  </div>
);

const StepRevisao = ({ formData }: Props) => {
  const isAssessor = formData.tipoUsuario === "assessor";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
          <Clipboard className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          Revisão dos Dados
        </h2>
        <p className="text-muted-foreground">
          Confira todas as informações antes de enviar sua solicitação
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {/* Tipo de Usuário */}
        <Section title="Tipo de Usuário" icon={isAssessor ? Briefcase : User}>
          <Row label="Tipo" value={isAssessor ? "Assessor" : "Cliente Final"} />
        </Section>

        {/* Dados do Assessor */}
        {isAssessor && (
          <Section title="Dados do Assessor" icon={Briefcase}>
            <Row label="Nome" value={formData.assessorNome} />
            <Row label="Email" value={formData.assessorEmail} />
            <Row label="Telefone" value={formData.assessorTelefone} />
            <Row label="Empresa" value={formData.assessorEmpresa} />
          </Section>
        )}

        {/* Cliente Titular */}
        <Section title="Cliente Titular" icon={User}>
          <Row label="Nome" value={formData.clienteNome} />
          <Row label="Nascimento" value={formData.clienteNascimento} />
          <Row label="Nacionalidade" value={formData.clienteNacionalidade} />
          <Row label="Email Prenotami" value={formData.clienteEmailPrenotami} />
          <Row label="Telefone" value={formData.clienteTelefone} />
        </Section>

        {/* Pessoas */}
        <Section title={`Pessoas (${formData.quantidadePessoas})`} icon={Users}>
          {formData.pessoas.slice(0, formData.quantidadePessoas).map((p, i) => (
            <div key={i} className="border-b border-border/50 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
              <Row label={`Pessoa ${i + 1}`} value={p.nomeCompleto} />
              <Row label="Nascimento" value={p.dataNascimento} />
              <Row label="Login Fast It" value={p.loginFastIt} />
            </div>
          ))}
        </Section>

        {/* Endereço */}
        <Section title="Endereço" icon={MapPin}>
          <Row label="Rua" value={`${formData.rua}, ${formData.numero}`} />
          <Row label="Cidade" value={`${formData.cidade} - ${formData.estado}`} />
          <Row label="CEP" value={formData.cep} />
          <Row label="País" value={formData.pais} />
        </Section>

        {/* Comprovante */}
        <Section title="Comprovante" icon={FileCheck}>
          <Row label="Arquivo" value={formData.nomeArquivo} />
        </Section>

        {/* Anotações */}
        {isAssessor && formData.anotacoes && (
          <Section title="Anotações" icon={FileText}>
            <p className="text-sm text-foreground p-2 bg-muted/30 rounded-lg">{formData.anotacoes}</p>
          </Section>
        )}
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-left">
          <p className="text-sm font-medium text-foreground">Confirmação necessária</p>
          <p className="text-xs text-muted-foreground">
            Ao prosseguir, você confirma que todas as informações acima estão corretas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepRevisao;
