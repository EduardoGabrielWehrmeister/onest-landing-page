import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (v: "cliente" | "assessor") => void;
}

const StepTipoUsuario = ({ value, onChange }: Props) => (
  <div className="space-y-8">
    {/* Header */}
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
        Como deseja prosseguir?
      </h2>
      <p className="text-base text-muted-foreground">
        Selecione o tipo de usuário para continuar com o agendamento
      </p>
    </div>

    <RadioGroup value={value} onValueChange={(v) => onChange(v as "cliente" | "assessor")} className="grid gap-4 md:gap-6">
      {[
        {
          val: "cliente",
          label: "Cliente Final",
          desc: "Estou solicitando para mim ou minha família",
          icon: User,
        },
        {
          val: "assessor",
          label: "Assessor",
          desc: "Estou solicitando em nome de um cliente",
          icon: Briefcase,
        },
      ].map(({ val, label, desc, icon: Icon }) => (
        <Label
          key={val}
          htmlFor={val}
          className={cn(
            "group relative flex items-center gap-4 md:gap-5 rounded-2xl border-2 p-5 md:p-6 cursor-pointer",
            "transition-all duration-300 animate-scale-up",
            value === val
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]"
              : "border-border hover:border-primary/30 hover:shadow-md hover:-translate-y-1"
          )}
        >
          {/* Radio item (visually hidden but accessible) */}
          <RadioGroupItem value={val} id={val} className="sr-only" />

          {/* Icon container */}
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl",
              "transition-all duration-300 shrink-0",
              value === val
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-primary/10 text-primary group-hover:bg-primary/20"
            )}
          >
            <Icon className="h-6 w-6 md:h-7 md:w-7" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <span
              className={cn(
                "font-semibold text-lg md:text-xl block mb-1",
                value === val ? "text-primary" : "text-foreground"
              )}
            >
              {label}
            </span>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>

          {/* Selection indicator */}
          {value === val && (
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </Label>
      ))}
    </RadioGroup>
  </div>
);

export default StepTipoUsuario;
