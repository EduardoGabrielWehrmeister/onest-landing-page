import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "agendamento-draft";

export interface RequerenteData {
  nomeCompleto: string;
  dataNascimento: string;
  prenotamiEmail: string;
  prenotamiSenha: string;
  endereco: string;
  altura: string;
  corOlhos: "azul" | "castanho" | "cinza" | "preto" | "verde" | "";
}

export interface FormData {
  // Step 1: Dados do Assessor
  assessorEmail: string;
  assessorNome: string;
  assessorTelefone: string;

  // Step 2: Termo de Responsabilidade
  termoResponsabilidadeAceito: boolean;

  // Step 3: Cliente Principal
  clienteNome: string;
  clientePdfFile: string;
  clientePdfConfirmado: boolean;

  // Step 4: Configuração OTP
  otpConfigurado: boolean;
  otpGmailAtencao: boolean;
  otpWhatsAppContato: boolean;

  // Step 5: Conta Prenotami
  prenotamiEmail: string;
  prenotamiSenha: string;
  prenotamiEndereco: string;
  prenotamiAltura: string;
  prenotamiCorOlhos: "azul" | "castanho" | "cinza" | "preto" | "verde" | "";
  prenotamiQuantidadePessoas: number;

  // Step 6: Requerentes Adicionais
  requerentes: RequerenteData[];

  // Step 7: Observações
  observacoes: string;
}

const defaultFormData: FormData = {
  assessorEmail: "",
  assessorNome: "",
  assessorTelefone: "",
  termoResponsabilidadeAceito: false,
  clienteNome: "",
  clientePdfFile: "",
  clientePdfConfirmado: false,
  otpConfigurado: false,
  otpGmailAtencao: false,
  otpWhatsAppContato: false,
  prenotamiEmail: "",
  prenotamiSenha: "",
  prenotamiEndereco: "",
  prenotamiAltura: "",
  prenotamiCorOlhos: "",
  prenotamiQuantidadePessoas: 1,
  requerentes: [
    {
      nomeCompleto: "",
      dataNascimento: "",
      prenotamiEmail: "",
      prenotamiSenha: "",
      endereco: "",
      altura: "",
      corOlhos: "",
    },
  ],
  observacoes: "",
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateRequerente = useCallback(
    (index: number, field: keyof RequerenteData, value: string) => {
      setFormData((prev) => {
        const requerentes = [...prev.requerentes];
        requerentes[index] = { ...requerentes[index], [field]: value };
        return { ...prev, requerentes };
      });
    },
    []
  );

  const setQuantidadeRequerentes = useCallback((qty: number) => {
    setFormData((prev) => {
      const requerentes = [...prev.requerentes];
      while (requerentes.length < qty) {
        requerentes.push({
          nomeCompleto: "",
          dataNascimento: "",
          prenotamiEmail: "",
          prenotamiSenha: "",
          endereco: "",
          altura: "",
          corOlhos: "",
        });
      }
      return {
        ...prev,
        prenotamiQuantidadePessoas: qty,
        requerentes: requerentes.slice(0, qty),
      };
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
    updateRequerente,
    setQuantidadeRequerentes,
    resetForm,
  };
}
