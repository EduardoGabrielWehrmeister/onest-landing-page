import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormData } from "@/hooks/useLocalStorageForm";

interface Props {
  nome: string;
  pdfFile: string;
  pdfConfirmado: boolean;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const StepClientePrincipal = ({ nome, pdfFile, pdfConfirmado, updateField }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File | null) => {
    if (file && file.type === "application/pdf") {
      updateField("clientePdfFile", file.name);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    updateField("clientePdfFile", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          Cliente Principal
        </h2>
        <p className="text-base text-muted-foreground">
          Informações do titular da solicitação
        </p>
      </div>

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

      {/* Upload PDF */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Comprovante de identidade (PDF)</Label>

        {!pdfFile ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              dragActive ? "border-primary bg-primary/10" : "border-border"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleInputChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Clique para selecionar ou arraste o arquivo
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Apenas arquivos PDF
                </p>
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
                  <p className="text-sm font-medium text-foreground truncate">{pdfFile}</p>
                  <p className="text-xs text-muted-foreground">Arquivo PDF selecionado</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="flex-shrink-0 p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Recomendado até 200kb para melhor desempenho
        </p>
      </div>

      {/* Checkbox Confirmação */}
      <label
        className={cn(
          "flex items-start gap-4 rounded-xl border-2 p-5 cursor-pointer transition-all",
          "hover:border-primary/30 hover:bg-primary/5",
          pdfConfirmado ? "border-primary bg-primary/5" : "border-border bg-card"
        )}
      >
        <Checkbox
          checked={pdfConfirmado}
          onCheckedChange={(checked) => updateField("clientePdfConfirmado", checked === true)}
          className="mt-0.5"
        />
        <span className="text-sm font-medium leading-relaxed">
          Confirmo que o arquivo enviado está correto e legível
        </span>
      </label>
    </div>
  );
};

export default StepClientePrincipal;
