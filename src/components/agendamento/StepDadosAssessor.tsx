import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData } from "@/hooks/useLocalStorageForm";

interface Props {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const fields = [
  { key: "assessorNome" as const, label: "Nome completo", type: "text" },
  { key: "assessorEmail" as const, label: "Email", type: "email" },
  { key: "assessorTelefone" as const, label: "Telefone", type: "tel" },
  { key: "assessorEmpresa" as const, label: "Empresa", type: "text" },
];

const StepDadosAssessor = ({ formData, updateField }: Props) => (
  <div className="space-y-8">
    {/* Header */}
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
        Dados do Assessor
      </h2>
      <p className="text-base text-muted-foreground">
        Informe seus dados profissionais
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

export default StepDadosAssessor;
