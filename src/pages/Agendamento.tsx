import { useMemo, useState } from "react";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Send, MessageCircle } from "lucide-react";

import StepSucesso from "@/components/agendamento/StepSucesso";

type Errors = Record<string, string>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatDate = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const steps = [
  "Dados do Assessor",
  "Declaração de Responsabilidade",
  "Dados do Cliente Principal",
  "Contato via WhatsApp",
  "Dados do Cliente",
  "Dados do Requerente Adicional",
  "Declaração de Ordem",
  "Observações",
  "Confirmação",
] as const;

const Agendamento = () => {
  const { formData, currentStep, setCurrentStep, updateField, resetForm } = useLocalStorageForm();
  const [errors, setErrors] = useState<Errors>({});

  const progressValue = useMemo(() => ((currentStep + 1) / (steps.length + 1)) * 100, [currentStep]);
  const isSuccessStep = currentStep >= steps.length;

  const validateStep = (step: number) => {
    const nextErrors: Errors = {};

    if (step === 0) {
      if (!EMAIL_REGEX.test(formData.assessorEmail)) nextErrors.assessorEmail = "Informe um e-mail válido.";
      if (!formData.assessorNomeEmpresa.trim()) nextErrors.assessorNomeEmpresa = "Campo obrigatório.";
      if (formData.assessorTelefone.replace(/\D/g, "").length !== 11) nextErrors.assessorTelefone = "Telefone deve estar no formato (99) 99999-9999.";
    }

    if (step === 1 && !formData.declaracaoResponsabilidade) {
      nextErrors.declaracaoResponsabilidade = "Você deve aceitar a declaração para continuar.";
    }

    if (step === 2) {
      if (!formData.clientePrincipalNome.trim()) nextErrors.clientePrincipalNome = "Campo obrigatório.";
      if (!formData.clientePrincipalDocumentoNome) nextErrors.clientePrincipalDocumentoNome = "Envie um PDF de até 200 KB.";
      if (!formData.declaracaoArquivo) nextErrors.declaracaoArquivo = "Confirme a declaração do arquivo.";
    }

    if (step === 3 && !formData.declaracaoContatoWhatsapp) {
      nextErrors.declaracaoContatoWhatsapp = "A declaração de contato é obrigatória.";
    }

    if (step === 4) {
      if (!EMAIL_REGEX.test(formData.clienteEmailPrenotami)) nextErrors.clienteEmailPrenotami = "Informe um e-mail válido.";
      if (!formData.clienteSenhaPrenotami.trim()) nextErrors.clienteSenhaPrenotami = "Campo obrigatório.";
      if (!formData.clienteEnderecoCompleto.trim()) nextErrors.clienteEnderecoCompleto = "Campo obrigatório.";
      if (!formData.quantidadeRequerentes) nextErrors.quantidadeRequerentes = "Selecione uma opção.";
    }

    if (step === 5) {
      if (!formData.adicional1Sobrenome.trim()) nextErrors.adicional1Sobrenome = "Campo obrigatório.";
      if (!formData.adicional1Nome.trim()) nextErrors.adicional1Nome = "Campo obrigatório.";
      if (!formData.adicional1CorOlhos) nextErrors.adicional1CorOlhos = "Selecione a cor dos olhos.";
      if (!/^\d+$/.test(formData.adicional1Altura)) nextErrors.adicional1Altura = "Use apenas números.";
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.adicional1Nascimento)) nextErrors.adicional1Nascimento = "Data inválida. Use DD/MM/AAAA.";
      if (!formData.adicional1DocumentoNome) nextErrors.adicional1DocumentoNome = "Envie o documento PDF (até 200 KB).";
    }

    if (step === 6 && !formData.declaracaoOrdemRequerentes) {
      nextErrors.declaracaoOrdemRequerentes = "Confirmação obrigatória.";
    }

    if (step === 7 && formData.observacoesConsulado.length > 100) {
      nextErrors.observacoesConsulado = "Máximo de 100 caracteres.";
    }

    if (step === 8 && !formData.confirmacao) {
      nextErrors.confirmacao = "Você precisa confirmar para enviar.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFile = (field: "clientePrincipalDocumentoNome" | "adicional1DocumentoNome") => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, [field]: "Apenas arquivos PDF são aceitos." }));
      return;
    }

    if (file.size > 200 * 1024) {
      setErrors((prev) => ({ ...prev, [field]: "O arquivo deve ter no máximo 200 KB." }));
      return;
    }

    setErrors((prev) => ({ ...prev, [field]: "" }));
    updateField(field, file.name);
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setErrors({});
      setCurrentStep(currentStep - 1);
    }
  };

  if (isSuccessStep) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-3xl">
            <CardContent className="p-8">
              <StepSucesso onReset={resetForm} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-4xl border-0 shadow-xl">
          <CardContent className="space-y-8 p-6 md:p-10">
            <header className="space-y-4 text-center">
              <h1 className="text-2xl font-bold md:text-3xl">Formulário de Agendamento</h1>
              <p className="text-sm text-muted-foreground">Etapa {currentStep + 1} de {steps.length}: {steps[currentStep]}</p>
              <Progress value={progressValue} className="h-2" />
            </header>

            <div className="space-y-5">
              {currentStep === 0 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="assessorEmail">Informe o seu e-mail</Label>
                    <Input id="assessorEmail" type="email" placeholder="exemplo@dominio.com" value={formData.assessorEmail} onChange={(e) => updateField("assessorEmail", e.target.value)} />
                    {errors.assessorEmail && <p className="text-xs text-destructive">{errors.assessorEmail}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assessorNomeEmpresa">Informe seu nome ou nome da sua empresa</Label>
                    <Input id="assessorNomeEmpresa" placeholder="Seu nome completo ou nome da empresa" value={formData.assessorNomeEmpresa} onChange={(e) => updateField("assessorNomeEmpresa", e.target.value)} />
                    {errors.assessorNomeEmpresa && <p className="text-xs text-destructive">{errors.assessorNomeEmpresa}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assessorTelefone">Informe seu número de telefone</Label>
                    <Input id="assessorTelefone" placeholder="(XX) XXXXX-XXXX" value={formData.assessorTelefone} onChange={(e) => updateField("assessorTelefone", formatPhone(e.target.value))} />
                    {errors.assessorTelefone && <p className="text-xs text-destructive">{errors.assessorTelefone}</p>}
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
                  <p className="font-medium">Declaro que os dados preenchidos estão corretos</p>
                  <label className="flex items-start gap-3 text-sm">
                    <Checkbox checked={formData.declaracaoResponsabilidade} onCheckedChange={(v) => updateField("declaracaoResponsabilidade", v === true)} />
                    <span>EU DECLARO QUE VOU PREENCHER CORRETAMENTE TODAS AS INFORMAÇÕES REFERENTES AO MEU CLIENTE/REQUERENTES ADICIONAIS. QUALQUER ERRO NOS DADOS QUE RESULTE EM PROBLEMAS NO AGENDAMENTO É DE MINHA EXCLUSIVA RESPONSABILIDADE.</span>
                  </label>
                  {errors.declaracaoResponsabilidade && <p className="text-xs text-destructive">{errors.declaracaoResponsabilidade}</p>}
                </div>
              )}

              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="clientePrincipalNome">Nome completo do cliente principal/titular</Label>
                    <Input id="clientePrincipalNome" placeholder="Nome completo" value={formData.clientePrincipalNome} onChange={(e) => updateField("clientePrincipalNome", e.target.value)} />
                    {errors.clientePrincipalNome && <p className="text-xs text-destructive">{errors.clientePrincipalNome}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientePrincipalDocumentoNome">Documento de Identidade (PDF)</Label>
                    <Input id="clientePrincipalDocumentoNome" type="file" accept="application/pdf" onChange={handleFile("clientePrincipalDocumentoNome")} />
                    <p className="text-xs text-muted-foreground">O comprovante de residência é opcional, mas, se for enviar, envie em um único arquivo junto com a identidade.</p>
                    {formData.clientePrincipalDocumentoNome && <p className="text-xs text-primary">Arquivo: {formData.clientePrincipalDocumentoNome}</p>}
                    {errors.clientePrincipalDocumentoNome && <p className="text-xs text-destructive">{errors.clientePrincipalDocumentoNome}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
                    <p className="font-medium">Eu declaro que o arquivo PDF enviado está correto</p>
                    <label className="flex items-start gap-3 text-sm">
                      <Checkbox checked={formData.declaracaoArquivo} onCheckedChange={(v) => updateField("declaracaoArquivo", v === true)} />
                      <span>Eu declaro que o arquivo PDF enviado está correto e foi comprimido adequadamente.</span>
                    </label>
                    {errors.declaracaoArquivo && <p className="text-xs text-destructive">{errors.declaracaoArquivo}</p>}
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
                    <p className="font-medium">Clique aqui para falar conosco no WhatsApp</p>
                    <Button asChild variant="outline" className="w-full">
                      <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Clique para contato via WhatsApp
                      </a>
                    </Button>
                  </div>
                  <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
                    <p className="font-medium">Declaro que entrarei em contato para realizar a configuração do encaminhamento do código OTP</p>
                    <label className="flex items-start gap-3 text-sm">
                      <Checkbox checked={formData.declaracaoContatoWhatsapp} onCheckedChange={(v) => updateField("declaracaoContatoWhatsapp", v === true)} />
                      <span>DECLARO QUE VOU ENTRAR EM CONTATO PARA FAZERMOS A CONFIGURAÇÃO DO ENCAMINHAMENTO DO CÓDIGO OTP</span>
                    </label>
                    {errors.declaracaoContatoWhatsapp && <p className="text-xs text-destructive">{errors.declaracaoContatoWhatsapp}</p>}
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="clienteEmailPrenotami">Informe o e-mail Prenotami do cliente</Label>
                    <Input id="clienteEmailPrenotami" type="email" placeholder="cliente@dominio.com" value={formData.clienteEmailPrenotami} onChange={(e) => updateField("clienteEmailPrenotami", e.target.value)} />
                    {errors.clienteEmailPrenotami && <p className="text-xs text-destructive">{errors.clienteEmailPrenotami}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clienteSenhaPrenotami">Informe a senha Prenotami do cliente</Label>
                    <Input id="clienteSenhaPrenotami" type="password" placeholder="Senha" value={formData.clienteSenhaPrenotami} onChange={(e) => updateField("clienteSenhaPrenotami", e.target.value)} />
                    {errors.clienteSenhaPrenotami && <p className="text-xs text-destructive">{errors.clienteSenhaPrenotami}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clienteEnderecoCompleto">Informe o endereço completo do cliente</Label>
                    <Input id="clienteEnderecoCompleto" placeholder="Exemplo: Av Brigadeiro Luis Antonio 100 - São Paulo - SP - CEP 12345678" value={formData.clienteEnderecoCompleto} onChange={(e) => updateField("clienteEnderecoCompleto", e.target.value)} />
                    <p className="text-xs text-muted-foreground">Sem vírgulas, sem acentuação, sem caracteres especiais. Use hífen para separar informações.</p>
                    {errors.clienteEnderecoCompleto && <p className="text-xs text-destructive">{errors.clienteEnderecoCompleto}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Quantas pessoas farão parte do agendamento?</Label>
                    <Select value={formData.quantidadeRequerentes} onValueChange={(v: "1" | "2" | "3" | "4") => updateField("quantidadeRequerentes", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 requerente principal</SelectItem>
                        <SelectItem value="2">1 requerente principal + 1 adicional</SelectItem>
                        <SelectItem value="3">1 requerente principal + 2 adicionais</SelectItem>
                        <SelectItem value="4">1 requerente principal + 3 adicionais</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.quantidadeRequerentes && <p className="text-xs text-destructive">{errors.quantidadeRequerentes}</p>}
                  </div>
                </>
              )}

              {currentStep === 5 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="adicional1Sobrenome">Sobrenome do requerente adicional 1</Label>
                    <Input id="adicional1Sobrenome" placeholder="Sobrenome" value={formData.adicional1Sobrenome} onChange={(e) => updateField("adicional1Sobrenome", e.target.value)} />
                    {errors.adicional1Sobrenome && <p className="text-xs text-destructive">{errors.adicional1Sobrenome}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adicional1Nome">Nome do requerente adicional 1</Label>
                    <Input id="adicional1Nome" placeholder="Nome completo" value={formData.adicional1Nome} onChange={(e) => updateField("adicional1Nome", e.target.value)} />
                    {errors.adicional1Nome && <p className="text-xs text-destructive">{errors.adicional1Nome}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Cor dos olhos do requerente adicional 1</Label>
                    <Select value={formData.adicional1CorOlhos} onValueChange={(v) => updateField("adicional1CorOlhos", v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Azul">Azul</SelectItem>
                        <SelectItem value="Castanho">Castanho</SelectItem>
                        <SelectItem value="Cinza">Cinza</SelectItem>
                        <SelectItem value="Preto">Preto</SelectItem>
                        <SelectItem value="Verde">Verde</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.adicional1CorOlhos && <p className="text-xs text-destructive">{errors.adicional1CorOlhos}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adicional1Altura">Altura do requerente adicional 1 (em cm)</Label>
                    <Input id="adicional1Altura" placeholder="Exemplo: 185" value={formData.adicional1Altura} onChange={(e) => updateField("adicional1Altura", e.target.value.replace(/\D/g, ""))} />
                    {errors.adicional1Altura && <p className="text-xs text-destructive">{errors.adicional1Altura}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adicional1Nascimento">Data de nascimento do requerente adicional 1</Label>
                    <Input id="adicional1Nascimento" placeholder="DD/MM/AAAA" value={formData.adicional1Nascimento} onChange={(e) => updateField("adicional1Nascimento", formatDate(e.target.value))} />
                    {errors.adicional1Nascimento && <p className="text-xs text-destructive">{errors.adicional1Nascimento}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adicional1DocumentoNome">Documento PDF do requerente adicional 1</Label>
                    <Input id="adicional1DocumentoNome" type="file" accept="application/pdf" onChange={handleFile("adicional1DocumentoNome")} />
                    <p className="text-xs text-muted-foreground">Comprimir o arquivo, até 200 KB</p>
                    {formData.adicional1DocumentoNome && <p className="text-xs text-primary">Arquivo: {formData.adicional1DocumentoNome}</p>}
                    {errors.adicional1DocumentoNome && <p className="text-xs text-destructive">{errors.adicional1DocumentoNome}</p>}
                  </div>
                </>
              )}

              {currentStep === 6 && (
                <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
                  <p className="font-medium">Declaro que irei preencher os dados começando pelo requerente adicional mais velho</p>
                  <label className="flex items-start gap-3 text-sm">
                    <Checkbox checked={formData.declaracaoOrdemRequerentes} onCheckedChange={(v) => updateField("declaracaoOrdemRequerentes", v === true)} />
                    <span>EU DECLARO QUE VOU COLOCAR NA ORDEM FAZENDO PRIMEIRO O REQUERENTE ADICIONAL MAIS VELHO E DEPOIS O MAIS NOVO</span>
                  </label>
                  {errors.declaracaoOrdemRequerentes && <p className="text-xs text-destructive">{errors.declaracaoOrdemRequerentes}</p>}
                </div>
              )}

              {currentStep === 7 && (
                <div className="space-y-2">
                  <Label htmlFor="observacoesConsulado">Adicione observações para o consulado (máximo 100 caracteres)</Label>
                  <Textarea id="observacoesConsulado" placeholder="Informação adicional" value={formData.observacoesConsulado} onChange={(e) => updateField("observacoesConsulado", e.target.value)} maxLength={100} />
                  <p className="text-xs text-muted-foreground">Sem vírgulas, sem acentuação, sem caracteres especiais. Máximo de 100 caracteres.</p>
                  <p className="text-xs text-muted-foreground">{formData.observacoesConsulado.length}/100</p>
                  {errors.observacoesConsulado && <p className="text-xs text-destructive">{errors.observacoesConsulado}</p>}
                </div>
              )}

              {currentStep === 8 && (
                <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
                  <p className="font-medium">Declaro que todas as informações estão corretas</p>
                  <label className="flex items-start gap-3 text-sm">
                    <Checkbox checked={formData.confirmacao} onCheckedChange={(v) => updateField("confirmacao", v === true)} />
                    <span>Declaro que todas as informações fornecidas são verdadeiras e corretas</span>
                  </label>
                  {errors.confirmacao && <p className="text-xs text-destructive">{errors.confirmacao}</p>}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button onClick={handleNext} variant={currentStep === steps.length - 1 ? "cta" : "default"}>
                {currentStep === steps.length - 1 ? (
                  <>
                    Enviar solicitação
                    <Send className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Agendamento;
