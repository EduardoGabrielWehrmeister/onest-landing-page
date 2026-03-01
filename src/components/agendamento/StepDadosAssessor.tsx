import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData } from "@/hooks/useLocalStorageForm";

interface Props {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

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
    <div className="grid gap-6">
      {/* Nome / Empresa */}
      <div className="space-y-2">
        <Label htmlFor="assessorNome" className="text-sm font-medium">
          Nome / Empresa
        </Label>
        <Input
          id="assessorNome"
          type="text"
          value={formData.assessorNome}
          onChange={(e) => updateField("assessorNome", e.target.value)}
          placeholder="Ex: João Silva - Turismo Brasil"
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">Informe o nome completo ou nome da empresa</p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="assessorEmail" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="assessorEmail"
          type="email"
          value={formData.assessorEmail}
          onChange={(e) => updateField("assessorEmail", e.target.value)}
          placeholder="Ex: joao@exemplo.com"
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">Email para contato profissional</p>
      </div>

      {/* Telefone */}
      <div className="space-y-2">
        <Label htmlFor="assessorTelefone" className="text-sm font-medium">
          Telefone
        </Label>
        <Input
          id="assessorTelefone"
          type="tel"
          value={formData.assessorTelefone}
          onChange={(e) => updateField("assessorTelefone", e.target.value)}
          placeholder="Ex: (11) 98765-4321"
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">Formato: (11) 98765-4321</p>
      </div>
    </div>
  </div>
);

export default StepDadosAssessor;
