import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cleanAddressInput, formatHeightInput } from "@/lib/formUtils";
import type { FormData } from "@/hooks/useLocalStorageForm";

interface Props {
  email: string;
  senha: string;
  endereco: string;
  altura: string;
  corOlhos: FormData["prenotamiCorOlhos"];
  quantidadePessoas: number;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  setQuantidadeRequerentes: (qty: number) => void;
}

const StepContaPrenotami = ({
  email,
  senha,
  endereco,
  altura,
  corOlhos,
  quantidadePessoas,
  updateField,
  setQuantidadeRequerentes,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const eyeColors = [
    { value: "azul", label: "Azul" },
    { value: "castanho", label: "Castanho" },
    { value: "cinza", label: "Cinza" },
    { value: "preto", label: "Preto" },
    { value: "verde", label: "Verde" },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          Conta Prenotami
        </h2>
        <p className="text-base text-muted-foreground">
          Dados para acesso e informações pessoais
        </p>
      </div>

      <div className="grid gap-6">
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 p-0 hover:bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Endereço Inteligente */}
        <div className="space-y-2">
          <Label htmlFor="prenotamiEndereco" className="text-sm font-medium">
            Endereço completo
          </Label>
          <Input
            id="prenotamiEndereco"
            type="text"
            value={endereco}
            onChange={(e) => updateField("prenotamiEndereco", cleanAddressInput(e.target.value))}
            placeholder="AV BRIGADEIRO LUIS ANTONIO 100 - COND CANADA - SAO PAULO - SP - CEP 12345678"
            className="h-11 uppercase"
          />
          <p className="text-xs text-muted-foreground">
            Use o formato: Rua, número, bairro, cidade - estado - CEP
          </p>
        </div>

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

        {/* Quantidade de Requerentes */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quantidade total de pessoas</Label>
          <RadioGroup
            value={String(quantidadePessoas)}
            onValueChange={(value) => setQuantidadeRequerentes(Number(value))}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((num) => (
                <label
                  key={num}
                  className={`
                    relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all
                    ${quantidadePessoas === num
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/30"
                    }
                  `}
                >
                  <RadioGroupItem value={String(num)} className="sr-only" />
                  <span className="text-2xl font-bold text-foreground">{num}</span>
                  <span className="text-xs text-muted-foreground">
                    {num === 1 ? "pessoa" : "pessoas"}
                  </span>
                  {quantidadePessoas === num && (
                    <div className="absolute inset-0 rounded-xl ring-2 ring-primary ring-offset-2 pointer-events-none" />
                  )}
                </label>
              ))}
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">
            Incluindo o titular. Selecione mais de 1 para adicionar requerentes adicionais.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepContaPrenotami;
