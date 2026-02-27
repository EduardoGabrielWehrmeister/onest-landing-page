import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
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
  <div className="space-y-8">
    {/* Header */}
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
        <User className="h-7 w-7 text-primary" />
      </div>
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
        Dados do Cliente
      </h2>
      <p className="text-base text-muted-foreground">
        Informações do titular da solicitação
      </p>
    </div>

    {/* Form fields */}
    <div className="grid gap-5">
      {fields.map(({ key, label, type }) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">{label}</Label>
          <Input
            id={key}
            type={type}
            value={formData[key]}
            onChange={(e) => updateField(key, e.target.value)}
            placeholder={label}
            className="h-11"
          />
        </div>
      ))}
    </div>
  </div>
);

export default StepDadosCliente;
