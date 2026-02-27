import { Label } from "@/components/ui/label";
import { Upload, FileText, X, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface Props {
  fileName: string;
  onChange: (name: string) => void;
}

const StepUpload = ({ fileName, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file.name);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
          <FileCheck className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          Comprovante de Residência
        </h2>
        <p className="text-base text-muted-foreground">
          Faça upload do comprovante (simulação)
        </p>
      </div>

      <input ref={inputRef} type="file" className="hidden" onChange={handleFile} accept=".pdf,.jpg,.jpeg,.png" />

      {/* Upload area */}
      {!fileName ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "w-full border-2 border-dashed border-border rounded-2xl p-8 md:p-12",
            "flex flex-col items-center gap-4",
            "hover:border-primary hover:bg-primary/5",
            "transition-all duration-300 cursor-pointer group",
            "hover:scale-[1.01] hover:shadow-lg"
          )}
        >
          <div className={cn(
            "flex items-center justify-center w-16 h-16 rounded-full",
            "bg-primary/10 group-hover:bg-primary/20",
            "transition-colors duration-300"
          )}>
            <Upload className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="text-center space-y-1">
            <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
              Clique para selecionar um arquivo
            </span>
            <p className="text-sm text-muted-foreground">
              Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
            </p>
          </div>
        </button>
      ) : (
        /* File preview */
        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
              <p className="text-xs text-muted-foreground">Arquivo selecionado</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange("")}
              className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepUpload;
