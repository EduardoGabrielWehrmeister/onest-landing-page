/**
 * RequerentesAdicionaisField Component
 *
 * Renders a repeating field group for additional applicants
 * Allows adding, editing, and removing up to 3 additional applicants
 */

import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, User, Info, Upload, File } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FormFieldProps, RequerenteData } from "@/lib/supabase/formTypes";
import { formatHeightInput } from "@/lib/formUtils";

// Eye color options (same as static form)
const eyeColors = [
  { value: "azul", label: "Azul" },
  { value: "castanho", label: "Castanho" },
  { value: "cinza", label: "Cinza" },
  { value: "preto", label: "Preto" },
  { value: "verde", label: "Verde" },
] as const;

const MAX_REQUERENTES = 3;

export const RequerentesAdicionaisField = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}: FormFieldProps) => {
  const requerentes = (value as RequerenteData[]) || [];

  // Add new applicant
  const handleAddRequerente = () => {
    if (requerentes.length >= MAX_REQUERENTES) return;

    const novoRequerente: RequerenteData = {
      nomeCompleto: "",
      dataNascimento: "",
      altura: "",
      corOlhos: "",
      documentoIdentidade: null,
    };

    onChange([...requerentes, novoRequerente]);
  };

  // Remove applicant
  const handleRemoveRequerente = (index: number) => {
    const novosRequerentes = requerentes.filter((_, i) => i !== index);
    onChange(novosRequerentes);
  };

  // Update a field within a specific applicant
  const handleUpdateRequerente = (
    index: number,
    campo: keyof RequerenteData,
    valor: any,
  ) => {
    const novosRequerentes = [...requerentes];
    novosRequerentes[index] = { ...novosRequerentes[index], [campo]: valor };
    onChange(novosRequerentes);
  };

  // Validate all required fields
  const validateRequerente = (requerente: RequerenteData): boolean => {
    return !!(
      requerente.nomeCompleto?.trim() &&
      requerente.dataNascimento &&
      requerente.altura &&
      requerente.corOlhos &&
      requerente.documentoIdentidade
    );
  };

  const isAnyInvalid = requerentes.some((r) => !validateRequerente(r));

  // Empty state
  if (requerentes.length === 0) {
    return (
      <TooltipProvider>
        <div className="md:col-span-12 space-y-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/30 mb-6">
              <span className="text-4xl">👥</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-foreground">
                {field.label || "Requerentes Adicionais"}
              </h3>
              {field.tooltip_text && (
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-5 w-5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{field.tooltip_text}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto">
              {field.help_text ||
                "Adicione outros requerentes à solicitação (opcional)"}
            </p>
            <Button
              type="button"
              onClick={handleAddRequerente}
              variant="outline"
              className="gap-2 px-6"
              disabled={disabled || requerentes.length >= MAX_REQUERENTES}
            >
              <Plus className="w-4 h-4" />
              Adicionar requerente
            </Button>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="md:col-span-12 space-y-8">
        {/* Field Header */}
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">
            {field.label || "Requerentes Adicionais"}
          </h2>
          {field.tooltip_text && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{field.tooltip_text}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {field.help_text && (
          <p className="text-sm text-muted-foreground -mt-6 mb-2">
            {field.help_text}
          </p>
        )}

        {/* Requerente Cards */}
        {requerentes.map((requerente, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Requerente Adicional #{idx + 1}
                </h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveRequerente(idx)}
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={disabled}
              >
                <Trash2 className="w-4 h-4" />
                Remover
              </Button>
            </div>

            {/* Card Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nome Completo */}
              <div className="sm:col-span-2 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label
                    htmlFor={`req-${idx}-nome`}
                    className="text-sm font-medium"
                  >
                    Nome completo
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Informe o nome completo do requerente adicional</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id={`req-${idx}-nome`}
                  type="text"
                  value={requerente.nomeCompleto}
                  onChange={(e) =>
                    handleUpdateRequerente(idx, "nomeCompleto", e.target.value)
                  }
                  placeholder="Ex: Eduarda Silva Santos"
                  className="h-11"
                  disabled={disabled}
                  required
                />
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-2">
                <Label
                  htmlFor={`req-${idx}-nascimento`}
                  className="text-sm font-medium"
                >
                  Data de nascimento{" "}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id={`req-${idx}-nascimento`}
                  type="date"
                  value={requerente.dataNascimento}
                  onChange={(e) =>
                    handleUpdateRequerente(
                      idx,
                      "dataNascimento",
                      e.target.value,
                    )
                  }
                  className="h-11"
                  disabled={disabled}
                  required
                />
              </div>

              {/* Altura */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label
                    htmlFor={`req-${idx}-altura`}
                    className="text-sm font-medium"
                  >
                    Altura
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Informe apenas números em centímetros (ex: 185 para
                        1,85m)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id={`req-${idx}-altura`}
                  type="text"
                  inputMode="numeric"
                  value={requerente.altura}
                  onChange={(e) =>
                    handleUpdateRequerente(
                      idx,
                      "altura",
                      formatHeightInput(e.target.value),
                    )
                  }
                  placeholder="185"
                  className="h-11"
                  disabled={disabled}
                  required
                />
              </div>

              {/* Cor dos Olhos */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label
                    htmlFor={`req-${idx}-cor-olhos`}
                    className="text-sm font-medium"
                  >
                    Cor dos olhos
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Somente estas cores são fornecidas pelo sistema. Escolha
                        a cor que melhor se adapta à sua.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={requerente.corOlhos}
                  onValueChange={(value) =>
                    handleUpdateRequerente(
                      idx,
                      "corOlhos",
                      value as RequerenteData["corOlhos"],
                    )
                  }
                  disabled={disabled}
                  required
                >
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

              {/* PDF Upload - using FileField */}
              <div className="sm:col-span-2 space-y-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <Label className="text-sm font-medium">
                    Documento de Identidade (PDF)
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Frente e verso da Identidade do Requerente Adicional em
                        formato PDF
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <CustomFileField
                  value={requerente.documentoIdentidade}
                  onChange={(file) =>
                    handleUpdateRequerente(idx, "documentoIdentidade", file)
                  }
                  disabled={disabled}
                  fieldName={`req-${idx}-documento`}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Button */}
        {requerentes.length < MAX_REQUERENTES && (
          <div className="flex justify-center pt-4">
            <Button
              type="button"
              onClick={handleAddRequerente}
              variant="outline"
              className="gap-2 px-6"
              disabled={disabled}
            >
              <Plus className="w-4 h-4" />
              Adicionar outro requerente
            </Button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

/**
 * Custom FileField wrapper for use within the RequerentesAdicionaisField
 * This creates a FormField-like interface for the FileField component
 */
interface CustomFileFieldProps {
  value: File | null;
  onChange: (file: File | null) => void;
  disabled: boolean;
  fieldName: string;
}

const CustomFileField = ({
  value,
  onChange,
  disabled,
  fieldName,
}: CustomFileFieldProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate PDF only
    if (file.type !== "application/pdf") {
      alert("Por favor, selecione apenas arquivos PDF.");
      return;
    }

    // Validate size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Arquivo muito grande. Máximo: 10MB");
      return;
    }

    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef) {
      inputRef.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div>
      {!value ? (
        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-gray-300 hover:border-gray-400 hover:border-gray-500"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef?.click()}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-base font-medium mb-2 text-foreground">
            Arraste seu arquivo aqui ou clique para selecionar
          </p>
          <p className="text-sm text-muted-foreground">Apenas PDF (máx 10MB)</p>
          <input
            ref={inputRef}
            id={fieldName}
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            disabled={disabled}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between p-5 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 text-red-600">
              <File className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {value.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(value.size)} • PDF
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={disabled}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
