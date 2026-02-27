import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-semibold text-foreground">Comprovante de Residência</h2>
        <p className="text-sm text-muted-foreground mt-1">Faça upload do comprovante (simulação)</p>
      </div>

      <input ref={inputRef} type="file" className="hidden" onChange={handleFile} accept=".pdf,.jpg,.jpeg,.png" />

      {!fileName ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors cursor-pointer"
        >
          <Upload className="h-10 w-10 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Clique para selecionar um arquivo</span>
          <span className="text-xs text-muted-foreground">PDF, JPG ou PNG</span>
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-border p-4">
          <FileText className="h-5 w-5 text-primary shrink-0" />
          <span className="text-sm text-foreground truncate flex-1">{fileName}</span>
          <Button variant="ghost" size="icon" onClick={() => onChange("")}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default StepUpload;
