import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import type { FormData, PersonData } from "@/hooks/useLocalStorageForm";

interface Props {
  formData: FormData;
  updatePerson: (index: number, field: keyof PersonData, value: string) => void;
  setQuantidadePessoas: (qty: number) => void;
}

const personFields = [
  { field: "nomeCompleto" as const, label: "Nome completo", type: "text" },
  { field: "dataNascimento" as const, label: "Data de nascimento", type: "date" },
  { field: "loginFastIt" as const, label: "Login Fast It", type: "text" },
  { field: "senhaFastIt" as const, label: "Senha Fast It", type: "password" },
];

const StepPessoas = ({ formData, updatePerson, setQuantidadePessoas }: Props) => (
  <div className="space-y-8">
    {/* Header */}
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
        <Users className="h-7 w-7 text-primary" />
      </div>
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
        Pessoas a Agendar
      </h2>
      <p className="text-base text-muted-foreground">
        Informe os dados de cada pessoa que será agendada
      </p>
    </div>

    {/* Quantity selector */}
    <div className="space-y-2">
      <Label className="text-sm font-medium">Quantidade de pessoas</Label>
      <Select
        value={String(formData.quantidadePessoas)}
        onValueChange={(v) => setQuantidadePessoas(Number(v))}
      >
        <SelectTrigger className="h-11">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4].map((n) => (
            <SelectItem key={n} value={String(n)}>{n} pessoa{n > 1 ? "s" : ""}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Person cards */}
    <div className="space-y-5">
      {formData.pessoas.slice(0, formData.quantidadePessoas).map((pessoa, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <span className="text-sm font-semibold text-primary">{i + 1}</span>
            </div>
            <h3 className="font-semibold text-foreground">Pessoa {i + 1}</h3>
          </div>
          <div className="grid gap-4">
            {personFields.map(({ field, label, type }) => (
              <div key={field} className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {label}
                </Label>
                <Input
                  type={type}
                  value={pessoa[field]}
                  onChange={(e) => updatePerson(i, field, e.target.value)}
                  placeholder={label}
                  className="h-10"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default StepPessoas;
