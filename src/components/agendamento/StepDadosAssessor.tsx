import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData } from "@/hooks/useLocalStorageForm";

interface Props {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const fields = [
  {
    key: "assessorNome" as const,
    label: "Nome / Empresa",
    type: "text",
    placeholder: "Ex: João Silva - Turismo Brasil",
  },
  {
    key: "assessorEmail" as const,
    label: "Email",
    type: "email",
    placeholder: "Ex: joao@exemplo.com",
  },
  {
    key: "assessorTelefone" as const,
    label: "Telefone",
    type: "tel",
    placeholder: "Ex: (11) 98765-4321",
  },
];

const StepDadosAssessor = ({ formData, updateField }: Props) => (
  <div className="space-y-8">
    {/* Header */}
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
        Dados do Assessor
      </h2>
      <p className="text-base text-muted-foreground">
        Informe seus dados de contato profissional
      </p>
    </div>

    {/* Form fields */}
    <div className="grid gap-5">
      {fields.map(({ key, label, type, placeholder }) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">
            {label}
          </Label>
          <Input
            id={key}
            type={type}
            value={formData[key]}
            onChange={(e) => updateField(key, e.target.value)}
            placeholder={placeholder}
            className="h-11"
          />
        </div>
      ))}
    </div>
  </div>
);

export default StepDadosAssessor;
