import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData } from "@/hooks/useLocalStorageForm";

interface Props {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const fields = [
  { key: "clienteNome" as const, label: "Nome completo", type: "text" },
  { key: "clienteNascimento" as const, label: "Data de nascimento", type: "date" },
  { key: "clienteNacionalidade" as const, label: "Nacionalidade", type: "text" },
  { key: "clienteEmailPrenotami" as const, label: "Email Prenotami", type: "email" },
  { key: "clienteTelefone" as const, label: "Telefone", type: "tel" },
];

const StepDadosCliente = ({ formData, updateField }: Props) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-serif font-semibold text-foreground">Dados do Cliente Titular</h2>
      <p className="text-sm text-muted-foreground mt-1">Informações do titular da solicitação</p>
    </div>
    <div className="grid gap-4">
      {fields.map(({ key, label, type }) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{label}</Label>
          <Input
            id={key}
            type={type}
            value={formData[key]}
            onChange={(e) => updateField(key, e.target.value)}
            placeholder={label}
          />
        </div>
      ))}
    </div>
  </div>
);

export default StepDadosCliente;
