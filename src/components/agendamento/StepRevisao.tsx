import type { FormData } from "@/hooks/useLocalStorageForm";

interface Props {
  formData: FormData;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">{title}</h3>
    <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-sm">{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-2">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium text-right">{value || "—"}</span>
  </div>
);

const StepRevisao = ({ formData }: Props) => {
  const isAssessor = formData.tipoUsuario === "assessor";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-semibold text-foreground">Revisão dos Dados</h2>
        <p className="text-sm text-muted-foreground mt-1">Confira todas as informações antes de enviar</p>
      </div>

      <div className="space-y-4">
        <Section title="Tipo de Usuário">
          <Row label="Tipo" value={isAssessor ? "Assessor" : "Cliente Final"} />
        </Section>

        {isAssessor && (
          <Section title="Dados do Assessor">
            <Row label="Nome" value={formData.assessorNome} />
            <Row label="Email" value={formData.assessorEmail} />
            <Row label="Telefone" value={formData.assessorTelefone} />
            <Row label="Empresa" value={formData.assessorEmpresa} />
          </Section>
        )}

        <Section title="Cliente Titular">
          <Row label="Nome" value={formData.clienteNome} />
          <Row label="Nascimento" value={formData.clienteNascimento} />
          <Row label="Nacionalidade" value={formData.clienteNacionalidade} />
          <Row label="Email Prenotami" value={formData.clienteEmailPrenotami} />
          <Row label="Telefone" value={formData.clienteTelefone} />
        </Section>

        <Section title={`Pessoas (${formData.quantidadePessoas})`}>
          {formData.pessoas.slice(0, formData.quantidadePessoas).map((p, i) => (
            <div key={i} className="border-b border-border/50 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
              <Row label={`Pessoa ${i + 1}`} value={p.nomeCompleto} />
              <Row label="Nascimento" value={p.dataNascimento} />
              <Row label="Login Fast It" value={p.loginFastIt} />
            </div>
          ))}
        </Section>

        <Section title="Endereço">
          <Row label="Rua" value={`${formData.rua}, ${formData.numero}`} />
          <Row label="Cidade" value={`${formData.cidade} - ${formData.estado}`} />
          <Row label="CEP" value={formData.cep} />
          <Row label="País" value={formData.pais} />
        </Section>

        <Section title="Comprovante">
          <Row label="Arquivo" value={formData.nomeArquivo} />
        </Section>

        {isAssessor && formData.anotacoes && (
          <Section title="Anotações">
            <p className="text-foreground text-sm">{formData.anotacoes}</p>
          </Section>
        )}
      </div>
    </div>
  );
};

export default StepRevisao;
