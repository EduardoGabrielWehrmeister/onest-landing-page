import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Mail, Upload, FileCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { cleanAddressInput, formatHeightInput } from "@/lib/formUtils";
import type { FormData } from "@/hooks/useLocalStorageForm";

interface Props {
  nome: string;
  pdfFile: string;
  email: string;
  senha: string;
  cep: string;
  estadoCivil: FormData["titularEstadoCivil"];
  documentoIdentidade: string;
  altura: string;
  corOlhos: FormData["prenotamiCorOlhos"];
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const estadoCivilOptions = [
  { value: "solteiro", label: "Solteiro(a)" },
  { value: "casado", label: "Casado(a)" },
  { value: "divorciado", label: "Divorciado(a)" },
  { value: "viuvo", label: "Viúvo(a)" },
  { value: "uniao_estavel", label: "União Estável" },
] as const;

const eyeColors = [
  { value: "azul", label: "Azul" },
  { value: "castanho", label: "Castanho" },
  { value: "cinza", label: "Cinza" },
  { value: "preto", label: "Preto" },
  { value: "verde", label: "Verde" },
] as const;

const StepDadosTitular = ({
  nome,
  pdfFile,
  email,
  senha,
  cep,
  estadoCivil,
  documentoIdentidade,
  altura,
  corOlhos,
  updateField,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File | null, field: "clientePdfFile" | "titularDocumentoIdentidade") => {
    if (file && file.type === "application/pdf") {
      updateField(field, file.name);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: "clientePdfFile" | "titularDocumentoIdentidade") => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file, field);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, field: "clientePdfFile" | "titularDocumentoIdentidade") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0], field);
    }
  };

  const handleRemoveFile = (field: "clientePdfFile" | "titularDocumentoIdentidade", inputRef: React.RefObject<HTMLInputElement>) => {
    updateField(field, "");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const renderPdfUpload = (
    title: string,
    file: string,
    field: "clientePdfFile" | "titularDocumentoIdentidade",
    inputRef: React.RefObject<HTMLInputElement>
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{title}</Label>
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => handleDrop(e, field)}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
            "hover:border-primary/50 hover:bg-primary/5",
            dragActive ? "border-primary bg-primary/10" : "border-border"
          )}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => handleInputChange(e, field)}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Clique para selecionar ou arraste o arquivo
              </p>
              <p className="text-xs text-muted-foreground mt-1">Apenas arquivos PDF</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-xl p-4 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file}</p>
                <p className="text-xs text-muted-foreground">Arquivo PDF selecionado</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveFile(field, inputRef)}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          Dados do Titular (Prenotante)
        </h2>
        <p className="text-base text-muted-foreground">
          Informações pessoais e credenciais de acesso
        </p>
      </div>

      <div className="grid gap-6">
        {/* Nome Completo */}
        <div className="space-y-2">
          <Label htmlFor="clienteNome" className="text-sm font-medium">
            Nome completo
          </Label>
          <Input
            id="clienteNome"
            type="text"
            value={nome}
            onChange={(e) => updateField("clienteNome", e.target.value)}
            placeholder="Ex: Maria da Silva Santos"
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Informe o nome completo conforme documento de identidade
          </p>
        </div>

        {/* Email Prenotami */}
        <div className="space-y-2">
          <Label htmlFor="prenotamiEmail" className="text-sm font-medium">
            Email Prenotami
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="prenotamiEmail"
              type="email"
              value={email}
              onChange={(e) => updateField("prenotamiEmail", e.target.value)}
              placeholder="seuemail@gmail.com"
              className="h-11 pl-10"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="w-3 h-3" />
            <span>O sistema funciona apenas com contas Gmail</span>
          </div>
        </div>

        {/* Senha */}
        <div className="space-y-2">
          <Label htmlFor="prenotamiSenha" className="text-sm font-medium">
            Senha Prenotami
          </Label>
          <div className="relative">
            <Input
              id="prenotamiSenha"
              type={showPassword ? "text" : "password"}
              value={senha}
              onChange={(e) => updateField("prenotamiSenha", e.target.value)}
              placeholder="Sua senha"
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* CEP */}
        <div className="space-y-2">
          <Label htmlFor="titularCep" className="text-sm font-medium">
            CEP
          </Label>
          <Input
            id="titularCep"
            type="text"
            inputMode="numeric"
            value={cep}
            onChange={(e) => updateField("titularCep", cleanAddressInput(e.target.value))}
            placeholder="12345678"
            className="h-11 uppercase"
          />
          <p className="text-xs text-muted-foreground">Apenas números (8 dígitos)</p>
        </div>

        {/* Estado Civil */}
        <div className="space-y-2">
          <Label htmlFor="titularEstadoCivil" className="text-sm font-medium">
            Estado Civil
          </Label>
          <Select value={estadoCivil} onValueChange={(value) => updateField("titularEstadoCivil", value as FormData["titularEstadoCivil"])}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecione o estado civil" />
            </SelectTrigger>
            <SelectContent>
              {estadoCivilOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Comprovante PDF */}
        {renderPdfUpload("Comprovante de identidade (PDF)", pdfFile, "clientePdfFile", fileInputRef)}

        {/* Documento de Identidade */}
        {renderPdfUpload("Documento de Identidade (PDF)", documentoIdentidade, "titularDocumentoIdentidade", docInputRef)}

        {/* Altura */}
        <div className="space-y-2">
          <Label htmlFor="prenotamiAltura" className="text-sm font-medium">
            Altura
          </Label>
          <Input
            id="prenotamiAltura"
            type="text"
            inputMode="numeric"
            value={altura}
            onChange={(e) => updateField("prenotamiAltura", formatHeightInput(e.target.value))}
            placeholder="185"
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Informe apenas números em centímetros (ex: 185 para 1,85m)
          </p>
        </div>

        {/* Cor dos Olhos */}
        <div className="space-y-2">
          <Label htmlFor="prenotamiCorOlhos" className="text-sm font-medium">
            Cor dos olhos
          </Label>
          <Select value={corOlhos} onValueChange={(value) => updateField("prenotamiCorOlhos", value as FormData["prenotamiCorOlhos"])}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecione a cor dos olhos" />
            </SelectTrigger>
            <SelectContent>
              {eyeColors.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  {color.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StepDadosTitular;
