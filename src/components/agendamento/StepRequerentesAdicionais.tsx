import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cleanAddressInput, formatHeightInput } from "@/lib/formUtils";
import type { RequerenteData } from "@/hooks/useLocalStorageForm";

interface Props {
  requerentes: RequerenteData[];
  quantidade: number;
  updateRequerente: (index: number, field: keyof RequerenteData, value: string) => void;
}

const StepRequerentesAdicionais = ({ requerentes, quantidade, updateRequerente }: Props) => {
  const [showPassword, setShowPassword] = useState<Record<number, boolean>>({});

  const eyeColors = [
    { value: "azul", label: "Azul" },
    { value: "castanho", label: "Castanho" },
    { value: "cinza", label: "Cinza" },
    { value: "preto", label: "Preto" },
    { value: "verde", label: "Verde" },
  ] as const;

  const requiredCount = Math.max(0, quantidade - 1);

  // If no additional requerentes needed
  if (requiredCount === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
            Requerentes Adicionais
          </h2>
          <p className="text-base text-muted-foreground">
            Nenhum requerente adicional necessário
          </p>
        </div>

        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Você selecionou apenas 1 pessoa. Não há requerentes adicionais para cadastrar.
          </p>
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
          Informações dos demais requerentes
        </p>
      </div>

      {/* Requerente Cards */}
      <div className="space-y-6">
        {requerentes.slice(0, requiredCount).map((requerente, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <span className="text-sm font-semibold text-primary">{idx + 2}</span>
              </div>
              <h3 className="font-semibold text-foreground">
                Requerente Adicional {idx + 2}
              </h3>
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

              {/* Email Prenotami */}
              <div className="space-y-2">
                <Label htmlFor={`req-${idx}-email`} className="text-sm font-medium">
                  Email Prenotami
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id={`req-${idx}-email`}
                    type="email"
                    value={requerente.prenotamiEmail}
                    onChange={(e) => updateRequerente(idx, "prenotamiEmail", e.target.value)}
                    placeholder="seuemail@gmail.com"
                    className="h-10 pl-10"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor={`req-${idx}-senha`} className="text-sm font-medium">
                  Senha Prenotami
                </Label>
                <div className="relative">
                  <Input
                    id={`req-${idx}-senha`}
                    type={showPassword[idx] ? "text" : "password"}
                    value={requerente.prenotamiSenha}
                    onChange={(e) => updateRequerente(idx, "prenotamiSenha", e.target.value)}
                    placeholder="Sua senha"
                    className="h-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setShowPassword((prev) => ({ ...prev, [idx]: !prev[idx] }))
                    }
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                  >
                    {showPassword[idx] ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-2">
                <Label htmlFor={`req-${idx}-endereco`} className="text-sm font-medium">
                  Endereço completo
                </Label>
                <Input
                  id={`req-${idx}-endereco`}
                  type="text"
                  value={requerente.endereco}
                  onChange={(e) =>
                    updateRequerente(idx, "endereco", cleanAddressInput(e.target.value))
                  }
                  placeholder="AV BRIGADEIRO LUIS ANTONIO 100 - COND CANADA - SAO PAULO - SP"
                  className="h-10 uppercase"
                />
              </div>

              {/* Altura e Cor dos Olhos - Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    onChange={(e) =>
                      updateRequerente(idx, "altura", formatHeightInput(e.target.value))
                    }
                    placeholder="185"
                    className="h-10"
                  />
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepRequerentesAdicionais;
