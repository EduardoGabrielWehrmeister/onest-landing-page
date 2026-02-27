import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormData, PersonData } from "@/hooks/useLocalStorageForm";

interface Props {
  formData: FormData;
  updatePerson: (index: number, field: keyof PersonData, value: string) => void;
  setQuantidadePessoas: (qty: number) => void;
}

const StepPessoas = ({ formData, updatePerson, setQuantidadePessoas }: Props) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-serif font-semibold text-foreground">Pessoas a serem Agendadas</h2>
      <p className="text-sm text-muted-foreground mt-1">Informe os dados de cada pessoa</p>
    </div>

    <div className="space-y-2">
      <Label>Quantidade de pessoas</Label>
      <Select
        value={String(formData.quantidadePessoas)}
        onValueChange={(v) => setQuantidadePessoas(Number(v))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4].map((n) => (
            <SelectItem key={n} value={String(n)}>{n} pessoa{n > 1 ? "s" : ""}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {formData.pessoas.slice(0, formData.quantidadePessoas).map((pessoa, i) => (
      <div key={i} className="rounded-lg border border-border p-4 space-y-3">
        <h3 className="font-medium text-sm text-foreground">Pessoa {i + 1}</h3>
        {([
          { field: "nomeCompleto" as const, label: "Nome completo", type: "text" },
          { field: "dataNascimento" as const, label: "Data de nascimento", type: "date" },
          { field: "loginFastIt" as const, label: "Login Fast It", type: "text" },
          { field: "senhaFastIt" as const, label: "Senha Fast It", type: "password" },
        ]).map(({ field, label, type }) => (
          <div key={field} className="space-y-1">
            <Label className="text-xs">{label}</Label>
            <Input
              type={type}
              value={pessoa[field]}
              onChange={(e) => updatePerson(i, field, e.target.value)}
              placeholder={label}
            />
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default StepPessoas;
