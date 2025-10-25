import { useState } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CSVUploadProps {
  onFileSelect: (file: File, columns?: string[]) => void;
  isLoading?: boolean;
  apiUrl?: string;
}

export default function CSVUpload({ onFileSelect, isLoading = false, apiUrl }: CSVUploadProps) {
  const defaultApiUrl = apiUrl || import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: File): boolean => {
    setError(null);
    setSuccess(false);

    if (!file.name.endsWith(".csv")) {
      setError("Por favor, selecione um arquivo CSV válido");
      return false;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Arquivo muito grande. Máximo permitido: 10MB");
      return false;
    }

    return true;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("csv_file", file);

    try {
      const response = await fetch(`${defaultApiUrl}/upload_csv`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setFileName(file.name);
        setSuccess(true);
        onFileSelect(file, data.columns);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || "Erro ao fazer upload do arquivo");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor. Verifique se o back-end está rodando.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
          dragActive
            ? "border-primary bg-primary/10"
            : "border-border bg-card/50 hover:border-primary/50"
        }`}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleChange}
          disabled={isLoading || uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Upload size={32} className="text-primary" />
          </div>

          <h3 className="text-lg font-semibold mb-2">
            Arraste seu arquivo CSV aqui
          </h3>

          <p className="text-muted-foreground mb-4">
            ou clique para selecionar um arquivo
          </p>

          <Button
            variant="default"
            disabled={isLoading || uploading}
            className="bg-primary hover:bg-primary/90"
          >
            {uploading ? "Enviando..." : isLoading ? "Processando..." : "Selecionar Arquivo"}
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Formatos suportados: CSV | Tamanho máximo: 10MB
          </p>
        </div>
      </div>

      {success && fileName && (
        <div className="mt-4 flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
          <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-500">Arquivo carregado com sucesso!</p>
            <p className="text-sm text-green-400">{fileName}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-3 p-4 bg-destructive/20 border border-destructive/50 rounded-lg">
          <AlertCircle size={20} className="text-destructive flex-shrink-0" />
          <p className="font-medium text-destructive">{error}</p>
        </div>
      )}

      {fileName && !error && !success && (
        <div className="mt-4 flex items-center gap-3 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <CheckCircle size={20} className="text-blue-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-400">Arquivo pronto para análise</p>
            <p className="text-sm text-blue-300">{fileName}</p>
          </div>
        </div>
      )}
    </div>
  );
}

