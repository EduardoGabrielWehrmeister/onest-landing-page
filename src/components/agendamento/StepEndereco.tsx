import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData } from "@/hooks/useLocalStorageForm";

interface Props {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const fields = [
  { key: "rua" as const, label: "Rua", half: false },
  { key: "numero" as const, label: "Número", half: true },
  { key: "cidade" as const, label: "Cidade", half: true },
  { key: "estado" as const, label: "Estado", half: true },
  { key: "cep" as const, label: "CEP", half: true },
  { key: "pais" as const, label: "País", half: false },
];

const StepEndereco = ({ formData, updateField }: Props) => (
  <div className="space-y-8">
    {/* Header */}
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
        Endereço
      </h2>
      <p className="text-base text-muted-foreground">
        Endereço de residência atual
      </p>
    </div>

    {/* Form fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {fields.map(({ key, label, half }) => (
        <div key={key} className={`space-y-2 ${!half ? "md:col-span-2" : ""}`}>
          <Label htmlFor={key} className="text-sm font-medium">{label}</Label>
          <Input
            id={key}
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

export default StepEndereco;
