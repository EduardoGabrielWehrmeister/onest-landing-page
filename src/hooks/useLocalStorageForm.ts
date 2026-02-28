import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "agendamento-draft";

export interface PersonData {
  nomeCompleto: string;
  dataNascimento: string;
  loginFastIt: string;
  senhaFastIt: string;
}

export interface FormData {
  // Legacy fields (kept for compatibility with existing components)
  tipoUsuario: "cliente" | "assessor" | "";
  assessorNome: string;
  assessorEmail: string;
  assessorTelefone: string;
  assessorEmpresa: string;
  clienteNome: string;
  clienteNascimento: string;
  clienteNacionalidade: string;
  clienteEmailPrenotami: string;
  clienteTelefone: string;
  quantidadePessoas: number;
  pessoas: PersonData[];
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
  nomeArquivo: string;
  anotacoes: string;
  confirmacao: boolean;

  // New flow fields
  assessorNomeEmpresa: string;
  declaracaoResponsabilidade: boolean;
  clientePrincipalNome: string;
  clientePrincipalDocumentoNome: string;
  declaracaoArquivo: boolean;
  declaracaoContatoWhatsapp: boolean;
  clienteSenhaPrenotami: string;
  clienteEnderecoCompleto: string;
  quantidadeRequerentes: "1" | "2" | "3" | "4";
  adicional1Sobrenome: string;
  adicional1Nome: string;
  adicional1CorOlhos: string;
  adicional1Altura: string;
  adicional1Nascimento: string;
  adicional1DocumentoNome: string;
  declaracaoOrdemRequerentes: boolean;
  observacoesConsulado: string;
}

const defaultFormData: FormData = {
  tipoUsuario: "",
  assessorNome: "",
  assessorEmail: "",
  assessorTelefone: "",
  assessorEmpresa: "",
  clienteNome: "",
  clienteNascimento: "",
  clienteNacionalidade: "",
  clienteEmailPrenotami: "",
  clienteTelefone: "",
  quantidadePessoas: 1,
  pessoas: [{ nomeCompleto: "", dataNascimento: "", loginFastIt: "", senhaFastIt: "" }],
  rua: "",
  numero: "",
  cidade: "",
  estado: "",
  cep: "",
  pais: "",
  nomeArquivo: "",
  anotacoes: "",
  confirmacao: false,

  assessorNomeEmpresa: "",
  declaracaoResponsabilidade: false,
  clientePrincipalNome: "",
  clientePrincipalDocumentoNome: "",
  declaracaoArquivo: false,
  declaracaoContatoWhatsapp: false,
  clienteSenhaPrenotami: "",
  clienteEnderecoCompleto: "",
  quantidadeRequerentes: "1",
  adicional1Sobrenome: "",
  adicional1Nome: "",
  adicional1CorOlhos: "",
  adicional1Altura: "",
  adicional1Nascimento: "",
  adicional1DocumentoNome: "",
  declaracaoOrdemRequerentes: false,
  observacoesConsulado: "",
};

export function useLocalStorageForm() {
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultFormData, ...JSON.parse(saved) };
    } catch {
      // no-op
    }
    return defaultFormData;
  });

  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + "-step");
      if (saved) return parseInt(saved, 10);
    } catch {
      // no-op
    }
    return 0;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + "-step", String(currentStep));
  }, [currentStep]);

  const updateField = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updatePerson = useCallback((index: number, field: keyof PersonData, value: string) => {
    setFormData((prev) => {
      const pessoas = [...prev.pessoas];
      pessoas[index] = { ...pessoas[index], [field]: value };
      return { ...prev, pessoas };
    });
  }, []);

  const setQuantidadePessoas = useCallback((qty: number) => {
    setFormData((prev) => {
      const pessoas = [...prev.pessoas];
      while (pessoas.length < qty) {
        pessoas.push({ nomeCompleto: "", dataNascimento: "", loginFastIt: "", senhaFastIt: "" });
      }
      return { ...prev, quantidadePessoas: qty, pessoas: pessoas.slice(0, qty) };
    });
  }, []);

  const resetForm = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + "-step");
    setFormData(defaultFormData);
    setCurrentStep(0);
  }, []);

  return {
    formData,
    currentStep,
    setCurrentStep,
    updateField,
    updatePerson,
    setQuantidadePessoas,
    resetForm,
  };
}
