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
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-serif font-semibold text-foreground">Dados do Assessor</h2>
      <p className="text-sm text-muted-foreground mt-1">Informe seus dados profissionais</p>
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

export default StepDadosAssessor;
