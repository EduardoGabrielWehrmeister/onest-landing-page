import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "agendamento-draft";

export interface PersonData {
  nomeCompleto: string;
  dataNascimento: string;
  loginFastIt: string;
  senhaFastIt: string;
}

export interface FormData {
  // Step 1
  tipoUsuario: "cliente" | "assessor" | "";
  // Step 2 - Assessor
  assessorNome: string;
  assessorEmail: string;
  assessorTelefone: string;
  assessorEmpresa: string;
  // Step 3 - Cliente
  clienteNome: string;
  clienteNascimento: string;
  clienteNacionalidade: string;
  clienteEmailPrenotami: string;
  clienteTelefone: string;
  // Step 4 - Pessoas
  quantidadePessoas: number;
  pessoas: PersonData[];
  // Step 5 - Endereço
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
  // Step 6 - Upload
  nomeArquivo: string;
  // Step 7 - Anotações
  anotacoes: string;
  // Step 9 - Confirmação
  confirmacao: boolean;
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
};

export function useLocalStorageForm() {
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultFormData, ...JSON.parse(saved) };
    } catch {}
    return defaultFormData;
  });

  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + "-step");
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 0;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + "-step", String(currentStep));
  }, [currentStep]);

  const updateField = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updatePerson = useCallback((index: number, field: keyof PersonData, value: string) => {
    setFormData(prev => {
      const pessoas = [...prev.pessoas];
      pessoas[index] = { ...pessoas[index], [field]: value };
      return { ...prev, pessoas };
    });
  }, []);

  const setQuantidadePessoas = useCallback((qty: number) => {
    setFormData(prev => {
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
