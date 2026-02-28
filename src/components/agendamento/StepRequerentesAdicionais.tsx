import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck, X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatHeightInput } from "@/lib/formUtils";
import type { RequerenteData } from "@/hooks/useLocalStorageForm";

interface Props {
  requerentes: RequerenteData[];
  updateRequerente: (index: number, field: keyof RequerenteData, value: string) => void;
  addRequerente: () => void;
  removeRequerente: (index: number) => void;
}

const eyeColors = [
  { value: "azul", label: "Azul" },
  { value: "castanho", label: "Castanho" },
  { value: "cinza", label: "Cinza" },
  { value: "preto", label: "Preto" },
  { value: "verde", label: "Verde" },
] as const;

const StepRequerentesAdicionais = ({ requerentes, updateRequerente, addRequerente, removeRequerente }: Props) => {
  const [showPassword, setShowPassword] = useState<Record<number, boolean>>({});
  const [dragActive, setDragActive] = useState<Record<number, boolean>>({});
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const handleFileSelect = (file: File | null, index: number) => {
    if (file && file.type === "application/pdf") {
      updateRequerente(index, "documentoIdentidade", file.name);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file, index);
  };

  const handleDrag = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [index]: true }));
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [index]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0], index);
    }
  };

  const handleRemoveFile = (index: number) => {
    updateRequerente(index, "documentoIdentidade", "");
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = "";
    }
  };

  const renderPdfUpload = (index: number) => {
    const file = requerentes[index]?.documentoIdentidade;

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Documento de Identidade (PDF)</Label>
        {!file ? (
          <div
            onDragEnter={(e) => handleDrag(e, index)}
            onDragLeave={(e) => handleDrag(e, index)}
            onDragOver={(e) => handleDrag(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={cn(
              "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              dragActive[index] ? "border-primary bg-primary/10" : "border-border"
            )}
            onClick={() => fileInputRefs.current[index]?.click()}
          >
            <input
              ref={(el) => (fileInputRefs.current[index] = el)}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => handleInputChange(e, index)}
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
                onClick={() => handleRemoveFile(index)}
                className="flex-shrink-0 p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Empty state
  if (requerentes.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
            Requerentes Adicionais
          </h2>
          <p className="text-base text-muted-foreground">
            Adicione outros requerentes à solicitação (opcional)
          </p>
        </div>

        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4">
            <span className="text-3xl">👥</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Nenhum requerente adicional adicionado ainda.
          </p>
          <Button
            type="button"
            onClick={addRequerente}
            variant="outline"
            className="gap-2"
            disabled={requerentes.length >= 3}
          >
            <Plus className="w-4 h-4" />
            Adicionar requerente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          Requerentes Adicionais
        </h2>
        <p className="text-base text-muted-foreground">
          Informações dos demais requerentes ({requerentes.length}/3)
        </p>
      </div>

      {/* Requerente Cards */}
      <div className="space-y-6">
        {requerentes.map((requerente, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <span className="text-sm font-semibold text-primary">{idx + 2}</span>
                </div>
                <h3 className="font-semibold text-foreground">
                  Requerente Adicional {idx + 2}
                </h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeRequerente(idx)}
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                Remover
              </Button>
            </div>

            {/* Card Fields */}
            <div className="grid gap-5">
              {/* Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor={`req-${idx}-nome`} className="text-sm font-medium">
                  Nome completo
                </Label>
                <Input
                  id={`req-${idx}-nome`}
                  type="text"
                  value={requerente.nomeCompleto}
                  onChange={(e) => updateRequerente(idx, "nomeCompleto", e.target.value)}
                  placeholder="Ex: João Silva Santos"
                  className="h-10"
                />
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-2">
                <Label htmlFor={`req-${idx}-nascimento`} className="text-sm font-medium">
                  Data de nascimento
                </Label>
                <Input
                  id={`req-${idx}-nascimento`}
                  type="date"
                  value={requerente.dataNascimento}
                  onChange={(e) => updateRequerente(idx, "dataNascimento", e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Altura */}
              <div className="space-y-2">
                <Label htmlFor={`req-${idx}-altura`} className="text-sm font-medium">
                  Altura
                </Label>
                <Input
                  id={`req-${idx}-altura`}
                  type="text"
                  inputMode="numeric"
                  value={requerente.altura}
                  onChange={(e) => updateRequerente(idx, "altura", formatHeightInput(e.target.value))}
                  placeholder="185"
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">Apenas números em centímetros</p>
              </div>

              {/* Cor dos Olhos */}
              <div className="space-y-2">
                <Label htmlFor={`req-${idx}-cor-olhos`} className="text-sm font-medium">
                  Cor dos olhos
                </Label>
                <Select
                  value={requerente.corOlhos}
                  onValueChange={(value) =>
                    updateRequerente(idx, "corOlhos", value as RequerenteData["corOlhos"])
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecione" />
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

              {/* PDF Upload */}
              {renderPdfUpload(idx)}
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      {requerentes.length < 3 && (
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={addRequerente}
            variant="outline"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar outro requerente
          </Button>
        </div>
      )}
    </div>
  );
};

export default StepRequerentesAdicionais;
